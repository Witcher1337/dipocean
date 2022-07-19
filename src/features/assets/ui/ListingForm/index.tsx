import { useGate, useStore } from "effector-react";
import { useParams } from "react-router-dom";

import { listingGate } from "@features/assets/model";

import { $isAssetOwner } from "../../../../entities/assets/model";

import { AccessGrantView } from "./AccessGrantView";
import { ConfirmTermsView } from "./ConfirmTermsView";
import { InitialView } from "./InitialView";

type PageParams = {
  tokenId: string;
};

export const ListingForm = () => {
  const params = useParams<PageParams>();
  const isAssetOwner = useStore($isAssetOwner);

  useGate(listingGate, params.tokenId);

  if (!isAssetOwner) return null;

  return (
    <div>
      <InitialView />
      <AccessGrantView />
      <ConfirmTermsView />
    </div>
  );
};
