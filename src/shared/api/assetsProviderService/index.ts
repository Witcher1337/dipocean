import { GetNftMetadataParams, GetNftsParams } from "@alch/alchemy-web3";

import { AlchemyCLient } from "../clients/alchemy-client";

const fetchAssets = (params: GetNftsParams) => AlchemyCLient.alchemy.getNfts(params);

const fetchAssetMetadata = (params: GetNftMetadataParams) =>
  AlchemyCLient.alchemy.getNftMetadata(params);

export const AssetsProviderService = {
  fetchAssets,
  fetchAssetMetadata,
};
