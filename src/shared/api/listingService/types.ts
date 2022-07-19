export type CreateListingPayload = {
  message: {
    collateral: {
      collectionID: string;
      tokenID: string;
    };
    offerDefaultDuration: number;
    desiredOffer: {
      amount: number;
      coinID: string;
      lendSeconds: number;
      amountWithAPR: number;
    };
  };
  signature: string;
};

export type ListedAsset = {
  id: string;
  createdAt: string;
  updatedAt: string;
  collateralID: string;
  lenderID: string;
  stateID: string;
  offerDefaultDuration: number;
  desiredLendSeconds: number;
  desiredCoinID: string;
  desiredAmount: number;
  desiredAmountWithAPR: number;
};
