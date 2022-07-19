import { JSONRPCErrors } from "./errors";
import { Accounts, Chain, RequestAccountsParams } from "./types";
import { isProviderRPCError } from "./utils";

export const metamask =
  typeof window !== "undefined" && window.ethereum?.isMetaMask ? window.ethereum : null;

export const checkConnection = async () => {
  const wallets = await metamask?.request({ method: "eth_accounts" });

  if (!Array.isArray(wallets) || wallets.length === 0) throw Error();

  return true;
};

export const requestAccounts = async (_params?: RequestAccountsParams): Promise<Accounts> => {
  const accounts = await metamask?.request({
    method: "eth_requestAccounts",
  });

  if (!Array.isArray(accounts) || accounts.length === 0) return Promise.reject();

  return accounts;
};

export const requestChain = async () => {
  const chainId = await metamask?.request({ method: "eth_chainId" });

  if (typeof chainId !== "string") throw Error();

  return chainId;
};

export const addChains = async (chains: Array<Chain>) =>
  metamask?.request({
    method: "wallet_addEthereumChain",
    params: chains,
  });

export const switchChain = async (chain: Chain) => {
  try {
    await metamask?.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: chain.id }],
    });
  } catch (err) {
    if (isProviderRPCError(err)) {
      if (err.code === JSONRPCErrors.chainNotFound) {
        await addChains([chain]);
      }

      if (err.code === JSONRPCErrors.userRejectedRequest) throw err;
    }
  }
};
