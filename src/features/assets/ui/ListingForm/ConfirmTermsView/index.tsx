import { useStore } from "effector-react";
import { useEvent } from "effector-react/scope";

import { Input } from "../../../../../shared/components";
import { secondsInDay } from "../../../../../shared/constants";
import { $isListingConfirming, $listingStage, $listingTerms, confirmListing } from "../../../model";

export const ConfirmTermsView = () => {
  const stage = useStore($listingStage);
  const terms = useStore($listingTerms);
  const isConfirming = useStore($isListingConfirming);

  const handlers = useEvent({
    confirmListing,
  });

  if (stage !== "terms_confirmation") return null;

  return (
    <div>
      <Input value={terms?.desiredOffer.amount} readOnly />
      <Input value={terms?.desiredOffer.coinID} readOnly />
      <Input value={(terms?.desiredOffer.lendSeconds || 0) / secondsInDay} readOnly />
      <Input value={terms?.desiredOffer.amountWithAPR} readOnly />
      <button disabled={isConfirming} onClick={handlers.confirmListing}>
        {isConfirming ? "Wait..." : "Confirm"}
      </button>
    </div>
  );
};
