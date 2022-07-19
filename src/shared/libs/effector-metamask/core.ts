import {
  combine,
  createEffect,
  createEvent,
  createStore,
  merge,
  sample,
  scopeBind,
} from "effector";

import { getClientScope } from "../get-client-scope";

import { connectionStatuses } from "./constants";
import { checkConnection, metamask, requestAccounts, requestChain, switchChain } from "./metamask";
import { Accounts, ConnectionStatus } from "./types";

const init = createEvent();

//#region Connection
const connectFx = createEffect(requestAccounts);
const checkConnectionFx = createEffect(checkConnection);
const disconnected = createEvent();

//#endregion

//#region HasMetamask
const $hasMetamask = createStore<boolean>(false);
const setHasMetamask = createEvent<boolean>();

$hasMetamask.on(setHasMetamask, (_, hasMetamask) => hasMetamask);
//#endregion

//#region Accounts
const $accounts = createStore<Accounts>([]);
const $defaultAccount = $accounts.map((accounts) => accounts[0] || "");
const setAccounts = createEvent<Accounts>();
const resetAccounts = createEvent();

const requestAccountsFx = createEffect(requestAccounts);

$accounts.on(setAccounts, (_, accounts) => accounts).reset(resetAccounts);

sample({
  clock: [requestAccountsFx.doneData, connectFx.doneData],
  target: setAccounts,
});
//#endregion

//#region Chains
const fetchChainFx = createEffect(requestChain);
const $currentChainId = createStore<null | string>(metamask?.chainId || null);
const $requiredChainId = createStore<string | null>(null);

const onChainChanged = createEvent<string>();
const switchChainFx = createEffect(switchChain);

$requiredChainId.on(connectFx, (_, params) => params?.chain?.id || null);

$currentChainId.on(merge([onChainChanged, fetchChainFx.doneData]), (_, chainId) => chainId);

//#endregion

//#region connectionStatus
const $connectionStatus = createStore<ConnectionStatus>("idle");
const setConnectionStatus = createEvent<ConnectionStatus>();

$connectionStatus.on(setConnectionStatus, (_, status) => status).watch(console.log);

sample({
  clock: disconnected,
  fn: () => connectionStatuses.detected,
  target: setConnectionStatus,
});

sample({
  clock: [connectFx, requestAccountsFx, switchChainFx],
  fn: () => connectionStatuses.pending,
  target: setConnectionStatus,
});

sample({
  clock: [connectFx.fail, requestAccountsFx.fail],
  fn: () => connectionStatuses.pending,
  target: setConnectionStatus,
});

sample({
  clock: setHasMetamask,
  fn: (hasMetamask) => (hasMetamask ? connectionStatuses.detected : connectionStatuses.notDetected),
  target: setConnectionStatus,
});

sample({
  clock: [connectFx.done, requestAccountsFx.done, switchChainFx.done],
  fn: () => connectionStatuses.connected,
  target: setConnectionStatus,
});

sample({
  clock: switchChainFx.fail,
  source: {
    requiredChainId: $requiredChainId,
    currentChainId: $currentChainId,
  },
  filter: ({ requiredChainId, currentChainId }) => {
    if (!requiredChainId || !currentChainId) return false;

    return requiredChainId !== currentChainId;
  },
  fn: () => connectionStatuses.wrongChain,
  target: setConnectionStatus,
});

sample({
  clock: combine([$connectionStatus, $requiredChainId, $currentChainId]),
  filter: ([connectionStatus]) =>
    connectionStatus === connectionStatuses.wrongChain ||
    connectionStatus === connectionStatuses.connected,
  fn: ([_, requiredChainId, currentChainId]) => {
    if (requiredChainId && requiredChainId !== currentChainId) return connectionStatuses.wrongChain;

    return connectionStatuses.connected;
  },
  target: setConnectionStatus,
});

$connectionStatus.watch(console.log);
//#endregion

// #region Initialization flow
sample({
  clock: init,
  fn: () => Boolean(metamask),
  target: setHasMetamask,
});

// If user has metamask, try to check, whether he has been connected before
sample({
  clock: setHasMetamask,
  filter: Boolean,
  target: [fetchChainFx, checkConnectionFx],
});

// If user has been connected before - try to connect again without any requests
sample({
  clock: checkConnectionFx.done,
  source: {
    requiredChainId: $requiredChainId,
    currentChainId: $currentChainId,
  },
  filter: ({ requiredChainId, currentChainId }) => {
    if (!requiredChainId) return true;

    return requiredChainId === currentChainId;
  },
  fn: ({ requiredChainId }) => ({
    chain: {
      id: requiredChainId ?? undefined,
    },
  }),
  target: connectFx,
});

sample({
  clock: connectFx.done,
  source: $currentChainId,
  filter: (currentChainId, { params }) => {
    if (params?.chain?.id === undefined) return false;

    return currentChainId !== params.chain.id;
  },
  fn: (_, { params }) => ({
    id: params?.chain?.id,
  }),
  target: switchChainFx,
});

const handleAccountsChange = (accounts: unknown) => {
  const scope = getClientScope();
  if (Array.isArray(accounts)) {
    scopeBind(setAccounts, { scope })(accounts);

    if (accounts.length === 0) scopeBind(disconnected, { scope })();
  }
};

const handleChainChange = (chainId: unknown) => {
  const scope = getClientScope();

  if (typeof chainId === "string") scopeBind(onChainChanged, { scope })(chainId);
};

$hasMetamask.watch((hasMetamask) => {
  if (hasMetamask) {
    metamask?.on("accountsChanged", handleAccountsChange);
    metamask?.on("chainChanged", handleChainChange);
  }
});
//#endregion

export {
  init,
  $accounts,
  $defaultAccount,
  $hasMetamask,
  $connectionStatus,
  $currentChainId,
  $requiredChainId,
  connectFx,
  switchChainFx,
};
