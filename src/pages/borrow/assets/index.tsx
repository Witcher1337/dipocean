import { OwnAssets } from "../../../features/assets";
import { MetamaskGuard } from "../../../features/metamask";

export const BorrowAssets = () => {
  return (
    <MetamaskGuard>
      <OwnAssets />
    </MetamaskGuard>
  );
};
