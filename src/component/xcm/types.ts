export enum TransferScreen {
  SelectChain,
  SelectToken,
  Transfer,
}

export type ScreenState = {
  active: TransferScreen;
  height: number;
};

export const DEFAULT_SCREEN_STATE: ScreenState = {
  active: TransferScreen.Transfer,
  height: null,
};

export type TransferState = {
  srcChain: string;
  dstChain: string;
  asset: string;
  amount: string;
  balance: string;
  address: string;
  effectiveBalance: string;
  nativeAsset: string;
  srcChainFee: string;
  dstChainFee: string;
  dstChainSs58Prefix: string;
  error: {};
};

export const DEFAULT_TRANSFER_STATE: TransferState = {
  srcChain: null,
  dstChain: null,
  asset: null,
  amount: null,
  balance: null,
  address: null,
  effectiveBalance: null,
  nativeAsset: null,
  srcChainFee: null,
  dstChainFee: null,
  dstChainSs58Prefix: null,
  error: {},
};

export type ChainState = {
  selector: string;
  list: string[];
  dest: string[];
  tokens: string[];
  balance: Map<string, string>;
};

export const DEFAULT_CHAIN_STATE: ChainState = {
  selector: null,
  list: [],
  dest: [],
  tokens: [],
  balance: new Map([]),
};
