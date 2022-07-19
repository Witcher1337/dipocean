import { ethers } from "ethers";

import { connectionStatuses } from "./constants";
export type ConnectionStatus = keyof typeof connectionStatuses;

export type Provider = ethers.providers.Web3Provider;
export type Accounts = Array<string>;

export type Chain = {
  id?: string;
  chainName?: string;
  rpcUrls?: Array<string>;
};

export type RequestAccountsParams = {
  chain?: Chain;
};

export type ProviderRpcError = {
  message: string;
  code: number;
  data?: unknown;
} & Error;

type CustomErrorCode = "wrong_chain";

export type CustomError = {
  code: CustomErrorCode;
} & Error;
