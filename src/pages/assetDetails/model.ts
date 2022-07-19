import { createDomain, createEvent, sample } from "effector";

import { $assetContractAddress, $assetTokenId } from "@entities/assets/model";
import { fetchAssetsMetadata } from "@features/assets";
import { StartEvent } from "shared/libs/page-routing";

export type PageParams = {
  tokenId: string;
  contractAddress: string;
};

const pageDomain = createDomain();

const mounted = createEvent<StartEvent<PageParams>>();
const unmounted = createEvent();

mounted.watch(() => console.log("mounted details"));
const $isMounted = pageDomain.createStore(false);

$isMounted.on(mounted, () => true);

sample({
  source: {
    tokenId: $assetTokenId,
    contractAddress: $assetContractAddress,
  },
  clock: mounted,
  fn: (_, { params }) => params,
  filter: ({ contractAddress, tokenId }, { params }) => {
    return contractAddress !== params.contractAddress || tokenId !== params.tokenId;
  },
  target: fetchAssetsMetadata,
});

pageDomain.onCreateStore((store) => store.reset(unmounted));

export { mounted, unmounted };
