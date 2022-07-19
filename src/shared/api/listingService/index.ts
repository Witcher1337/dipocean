import { get, post } from "../clients/http-client";

import { CreateListingPayload, ListedAsset } from "./types";

const create = (payload: CreateListingPayload) => post("/listing", payload);

const getAll = (): Promise<Array<ListedAsset>> => get("/listing/all");

export const ListingService = {
  create,
  getAll,
};
