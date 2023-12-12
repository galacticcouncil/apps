import { AnyChain, Asset, AssetAmount } from '@moonbeam-network/xcm-types';
import { chainsMap } from '@galacticcouncil/xcm-cfg';

export enum TransferTab {
  TransferForm,
  SelectChain,
  SelectToken,
}

export type TransferState = {
  address: string;
  amount: string;
  asset: Asset;
  balance: string;
  effectiveBalance: string;
  destChain: AnyChain;
  destChainFee: AssetAmount;
  destChainSs58Prefix: number;
  srcChain: AnyChain;
  srcChainFee: AssetAmount;
  error: {};
};

export const DEFAULT_TRANSFER_STATE: TransferState = {
  address: null,
  amount: null,
  asset: null,
  balance: null,
  effectiveBalance: null,
  destChain: null,
  destChainFee: null,
  destChainSs58Prefix: null,
  srcChain: null,
  srcChainFee: null,
  error: {},
};

export type ChainState = {
  selector: string;
  list: AnyChain[];
  dest: AnyChain[];
  tokens: Asset[];
  balance: Map<string, AssetAmount>;
};

export const DEFAULT_CHAIN_STATE: ChainState = {
  selector: null,
  list: Array.from(chainsMap.values()),
  dest: [],
  tokens: [],
  balance: new Map([]),
};
