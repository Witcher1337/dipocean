import { CreateListingPayload } from "../../../shared/api/listingService/types";

export type Asset = {
  id: string;
  title: string;
  description: string;
  image?: string;
  tokenId: string | number;
  contract: {
    address: string | number;
  };
};

export type CreateLoanStage =
  | "initial"
  | "access_grant"
  | "terms_confirmation"
  | "mail_confirmation"
  | "listed";

export type ListingTerms = Pick<
  CreateListingPayload["message"],
  "desiredOffer" | "offerDefaultDuration"
>;
