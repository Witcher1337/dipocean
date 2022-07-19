import { attach, combine, createEvent, createStore, sample } from "effector";
import { getAddress } from "ethers/lib/utils";

import { $signer } from "../../../shared/libs/effector-ethers";
import { $defaultAccount } from "../../../shared/libs/effector-metamask";
import { IERC721__factory } from "../../../shared/smart-contracts";

const setAssetTokenId = createEvent<string>();
const resetAssetTokenId = createEvent();
const $assetTokenId = createStore("");

$assetTokenId.on(setAssetTokenId, (_, value) => value).reset(resetAssetTokenId);

const setAssetContractAddress = createEvent<string>();
const $assetContractAddress = createStore<null | string>(null);

$assetContractAddress.on(setAssetContractAddress, (_, value) => value);

const $IERC721Contract = combine($signer, $assetContractAddress, (signer, contractAddress) => {
  if (!signer || !contractAddress) return null;

  return IERC721__factory.connect(contractAddress, signer);
});

const checkIsAssetOwnerFx = attach({
  source: $IERC721Contract,
  effect: (contract, tokenId: string) => contract?.ownerOf(tokenId),
});

const setIsAssetOwner = createEvent();
const resetIsAssetOwner = createEvent();
const $isAssetOwner = createStore(false);

$isAssetOwner.on(setIsAssetOwner, (_, value) => value).reset(resetIsAssetOwner);

sample({
  clock: checkIsAssetOwnerFx.doneData,
  source: $defaultAccount,
  fn: (defaultAccount, result) => getAddress(String(result)) === getAddress(String(defaultAccount)),
  target: setIsAssetOwner,
});

$isAssetOwner.watch(console.log);
setIsAssetOwner.watch((v) => console.log("setIsAssetOwner", v));

sample({
  clock: $defaultAccount,
  target: resetIsAssetOwner,
});

export {
  $IERC721Contract,
  resetIsAssetOwner,
  setAssetContractAddress,
  checkIsAssetOwnerFx,
  $isAssetOwner,
  $assetTokenId,
  $assetContractAddress,
  setAssetTokenId,
};
