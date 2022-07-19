import { useEvent, useStore } from "effector-react";

import {
  $listingStage,
  $hasAccessesToAsset,
  checkAccessesToAsset,
  setListingStage,
  grantAccessToAssetFx,
} from "../../../model";

export const AccessGrantView = () => {
  const stage = useStore($listingStage);
  const hasGrant = useStore($hasAccessesToAsset);
  const isChecking = useStore(checkAccessesToAsset.pending);
  const isAccessesGrantPending = useStore(grantAccessToAssetFx.pending);

  const handlers = useEvent({
    setListingStage,
    checkAccessesToAsset,
    grantAccessToAssetFx,
  });

  const nextStep = () => {
    handlers.setListingStage("terms_confirmation");
  };

  const handleGrantAccess = () => {
    handlers.grantAccessToAssetFx();
  };

  const checkingView = isChecking && "Checking for accesses...";
  const hasGrantView = !isChecking && hasGrant && "You have grants";
  const noGrantView = !isChecking && !hasGrant && "You don't have grants";

  const grantAccessFooterView = !hasGrant && !isChecking && (
    <button disabled={isAccessesGrantPending} type="button" onClick={handleGrantAccess}>
      Access Grant
    </button>
  );

  const accessGrantedFooterView = hasGrant && (
    <button onClick={nextStep} type="submit">
      Next
    </button>
  );

  if (stage !== "access_grant") return null;

  return (
    <div>
      {checkingView}
      {hasGrantView}
      {noGrantView}
      {grantAccessFooterView}
      {accessGrantedFooterView}
    </div>
  );
};
