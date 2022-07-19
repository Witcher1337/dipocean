import { GetNftMetadataParams, GetNftMetadataResponse } from "@alch/alchemy-web3";
import {
  attach,
  combine,
  createDomain,
  createEffect,
  createEvent,
  createStore,
  merge,
  sample,
} from "effector";
import { createGate } from "effector-react";
import { v4 as uuidv4 } from "uuid";

import {
  $assetTokenId,
  $IERC721Contract,
  checkIsAssetOwnerFx,
  resetIsAssetOwner,
  setAssetContractAddress,
  setAssetTokenId,
} from "../../../entities/assets/model";
import { AssetsProviderService } from "../../../shared/api/assetsProviderService";
import { ListingService } from "../../../shared/api/listingService";
import { ListedAsset } from "../../../shared/api/listingService/types";
import { collectionId } from "../../../shared/constants";
import { signMessageFx } from "../../../shared/libs/effector-ethers";
import { $defaultAccount } from "../../../shared/libs/effector-metamask";

import { Asset, CreateLoanStage, ListingTerms } from "./types";

//#region Assets List
const ownAssetsListGate = createGate();

const setOwnNftAssets = createEvent<Array<Asset>>();
const $ownAssets = createStore<Array<Asset>>([]);
const $ownAssetsPageKey = createStore<string>("");

const fetchOwnAssetsFx = attach({
  source: $defaultAccount,
  effect: (owner) =>
    AssetsProviderService.fetchAssets({
      owner,
    }),
});

const fetchMoreOwnAssetsFx = attach({
  source: {
    defaultAccount: $defaultAccount,
    pageKey: $ownAssetsPageKey,
  },
  effect: ({ defaultAccount, pageKey }) =>
    AssetsProviderService.fetchAssets({
      owner: defaultAccount,
      pageKey: pageKey || undefined,
    }),
});

$ownAssets.on(setOwnNftAssets, (_, data) => data);

$ownAssetsPageKey.on(
  [fetchMoreOwnAssetsFx.done, fetchOwnAssetsFx.done],
  (_, { result }) => result.pageKey || "",
);

sample({
  clock: [fetchMoreOwnAssetsFx.doneData, fetchOwnAssetsFx.doneData],
  source: {
    ownAssets: $ownAssets,
    loadMore: fetchMoreOwnAssetsFx.pending,
  },
  fn: ({ ownAssets, loadMore }, { ownedNfts }) => {
    const normalizedResult = ownedNfts.map(
      (nft): Asset => ({
        id: uuidv4(),
        title: nft.title,
        description: nft.description,
        image: nft.media?.find((img) => img.gateway)?.gateway,
        contract: nft.contract,
        tokenId: nft.id.tokenId,
      }),
    );

    return loadMore ? [...ownAssets, ...normalizedResult] : normalizedResult;
  },
  target: setOwnNftAssets,
});

sample({
  clock: [ownAssetsListGate.open, $defaultAccount.updates],
  source: combine([ownAssetsListGate.status, $defaultAccount]),
  filter: ([isOwnNftsMounted, defaultAccount]) => isOwnNftsMounted && Boolean(defaultAccount),
  target: fetchOwnAssetsFx,
});
//#endregion

//#region Asset Details
const fetchAssetsMetadata = createEffect((params: GetNftMetadataParams) =>
  AssetsProviderService.fetchAssetMetadata(params),
);

const $assetDetails = createStore<GetNftMetadataResponse | null>(null);

sample({
  clock: fetchAssetsMetadata,
  fn: (params) => params.contractAddress,
  target: setAssetContractAddress,
});

sample({
  clock: fetchAssetsMetadata,
  fn: (params) => params.tokenId,
  target: setAssetTokenId,
});

$assetDetails.on(fetchAssetsMetadata.done, (_, { result }) => result);
//#endregion

//#region Create Loan
const listingDomain = createDomain();
const listingGate = createGate<string>();

sample({
  clock: $assetTokenId,
  filter: Boolean,
  target: checkIsAssetOwnerFx,
});

sample({
  clock: listingGate.close,
  target: [resetIsAssetOwner],
});

const setListingTerms = createEvent<ListingTerms>();
const $listingTerms = listingDomain.createStore<ListingTerms | null>(null);

$listingTerms.on(setListingTerms, (_, terms) => terms);

const checkAccessesToAsset = attach({
  source: [$IERC721Contract, $defaultAccount],
  effect: async ([contract, defaultAccount]) => {
    const isApproved = await contract?.isApprovedForAll(
      defaultAccount,
      process.env.NEXT_PUBLIC_DIRECT_LOAN_FIXED_OFFER_ADDRESS,
    );

    if (!isApproved) return Promise.reject();
  },
});

const grantAccessToAssetFx = attach({
  source: $IERC721Contract,
  effect: async (contract) => {
    const tx = await contract?.setApprovalForAll(
      process.env.NEXT_PUBLIC_DIRECT_LOAN_FIXED_OFFER_ADDRESS,
      true,
    );

    return tx?.wait();
  },
});

const $hasAccessesToAsset = createStore(false);

$hasAccessesToAsset.on(merge([checkAccessesToAsset.done, grantAccessToAssetFx.done]), () => true);

const setListingStage = createEvent<CreateLoanStage>();
const $listingStage = listingDomain.createStore<CreateLoanStage>("initial");

$listingStage.on(setListingStage, (_, stage) => stage);

sample({
  source: $listingStage,
  filter: (stage) => stage === "access_grant",
  target: checkAccessesToAsset,
});

sample({
  clock: setListingTerms,
  fn: (): CreateLoanStage => "access_grant",
  target: setListingStage,
});

const listAssetFx = createEffect(ListingService.create);

const confirmListing = createEvent<unknown>();
const signListingMessageFx = attach({
  effect: signMessageFx,
});

const $isListingConfirming = combine(
  [signListingMessageFx.pending, listAssetFx.pending],
  (loaders) => loaders.some(Boolean),
);

sample({
  clock: confirmListing,
  source: $listingTerms,
  fn: (listingTerms) => JSON.stringify(listingTerms),
  target: signListingMessageFx,
});

sample({
  clock: signListingMessageFx.doneData,
  source: {
    listingTerms: $listingTerms,
    assetDetails: $assetDetails,
  },
  fn: ({ listingTerms, assetDetails }, signature) => ({
    message: {
      collateral: {
        tokenID: String(assetDetails?.id.tokenId),
        collectionID: collectionId,
      },
      ...(listingTerms as ListingTerms),
    },
    signature,
  }),
  target: listAssetFx,
});

sample({
  clock: signListingMessageFx.doneData,
  source: $listingTerms,
  filter: (_, signature): signature is string => typeof signature === "string",
  fn: (terms, signature) => ({
    ...terms,
    signature,
  }),
});

listingGate.open.watch(() => console.log("listingGate opened"));
listingGate.close.watch(() => console.log("listingGate closed"));
listingDomain.onCreateStore((store) => store.reset(listingGate.close));
//#endregion

//#region
const fetchListedAssetsFx = createEffect(ListingService.getAll);
const $listedAssets = createStore<Array<ListedAsset>>([]);

$listedAssets.on(fetchListedAssetsFx.doneData, (_, data) => data).watch(console.log);
//#endregion

export {
  fetchOwnAssetsFx,
  listingGate,
  ownAssetsListGate,
  $ownAssets,
  $listingStage,
  $assetDetails,
  $hasAccessesToAsset,
  fetchAssetsMetadata,
  setListingStage,
  checkAccessesToAsset,
  grantAccessToAssetFx,
  $listingTerms,
  setListingTerms,
  confirmListing,
  $isListingConfirming,
  $listedAssets,
  fetchListedAssetsFx,
};
