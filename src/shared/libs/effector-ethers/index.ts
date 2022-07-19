import { attach } from "effector";
import { ethers } from "ethers";

import { $connectionStatus, metamask } from "../effector-metamask";

const $provider = $connectionStatus.map((status) => {
  if (status !== "connected" || !metamask) return null;

  return new ethers.providers.Web3Provider(metamask);
});

const $signer = $provider.map((provider) => provider?.getSigner() || null);

const signMessageFx = attach({
  source: $signer,
  effect: async (signer, message: string) => {
    const signature = await signer?.signMessage(message);

    if (!signature) return Promise.reject();

    return signature;
  },
});

export { $signer, $provider, signMessageFx };
