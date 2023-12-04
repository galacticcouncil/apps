import { AnyChain, Asset } from '@moonbeam-network/xcm-types';
import { chains, chainsMap, dot } from '@galacticcouncil/xcm';

export enum TransferTab {
  TransferForm,
  SelectChain,
  SelectToken,
}

export type TransferState = {
  srcChain: AnyChain;
  destChain: AnyChain;
  asset: Asset;
  amount: string;
  balance: string;
  address: string;
  effectiveBalance: string;
  nativeAsset: string;
  srcChainFee: string;
  destChainFee: string;
  destChainSs58Prefix: string;
  error: {};
};

export const DEFAULT_TRANSFER_STATE: TransferState = {
  srcChain: null,
  destChain: null,
  asset: null,
  amount: null,
  balance: null,
  address: null,
  effectiveBalance: null,
  nativeAsset: null,
  srcChainFee: null,
  destChainFee: null,
  destChainSs58Prefix: null,
  error: {},
};

export type ChainState = {
  selector: string;
  list: AnyChain[];
  dest: AnyChain[];
  tokens: Asset[];
  balance: Map<string, string>;
};

export const DEFAULT_CHAIN_STATE: ChainState = {
  selector: null,
  list: chains,
  dest: [],
  tokens: [],
  balance: new Map([]),
};

export interface AccountBalance {
  balance: string;
  extra: string;
  reason: string;
  status: string;
}
