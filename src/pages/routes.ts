import { AssetDetails } from "./assetDetails";
import { BorrowAssets } from "./borrow/assets";
import { Home } from "./home";
import { LendAssets } from "./lend/assets";

export const routes = [
  {
    path: "/",
    element: Home,
  },
  {
    path: "/lend/assets",
    element: LendAssets,
  },
  {
    path: "/borrow/assets",
    element: BorrowAssets,
  },
  {
    path: "/assets/:contractAddress/:tokenId",
    element: AssetDetails,
  },
];
