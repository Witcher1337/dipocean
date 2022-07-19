import { ExternalProvider } from "@ethersproject/providers";
import { MetaMaskInpageProvider } from "@metamask/providers";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_BASE_URL: string;
      NEXT_PUBLIC_DIRECT_LOAN_FIXED_OFFER_ADDRESS: string;
      NEXT_PUBLIC_REQUIRED_CHAIN_ID: string;
    }
  }
  interface Window {
    INITIAL_STATE: Record<string, unknown>;
    ethereum?: MetaMaskInpageProvider & ExternalProvider;
  }
}

// declare module '*.scss' {
//   const content: Record<string, string>;
//   export default content;
// }