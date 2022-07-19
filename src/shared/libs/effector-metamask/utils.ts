import { ProviderRpcError } from "./types";

export const isProviderRPCError = (err: unknown): err is ProviderRpcError => {
  if (err && typeof err === "object") {
    return "message" in err && "code" in err;
  }

  return false;
};
