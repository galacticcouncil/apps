import { AnyChain, Asset, AssetAmount } from '@moonbeam-network/xcm-types';
import { XData } from '@galacticcouncil/xcm-sdk';

export enum TransferTab {
  TransferForm,
  SelectChain,
  SelectToken,
}

export type TransferState = {
  address: string;
  amount: string;
  asset: Asset;
  balance: AssetAmount;
  destChain: AnyChain;
  destChainFee: AssetAmount;
  max: AssetAmount;
  min: AssetAmount;
  srcChain: AnyChain;
  srcChainFee: AssetAmount;
  error: {};
  xdata: XData;
};

export const DEFAULT_TRANSFER_STATE: TransferState = {
  address: null,
  amount: null,
  asset: null,
  balance: null,
  destChain: null,
  destChainFee: null,
  max: null,
  min: null,
  srcChain: null,
  srcChainFee: null,
  error: {},
  xdata: null,
};

export type ChainState = {
  balance: Map<string, AssetAmount>;
  dest: AnyChain[];
  list: AnyChain[];
  tokens: Asset[];
  selector: string;
  connecting: boolean;
};

export const DEFAULT_CHAIN_STATE: ChainState = {
  balance: new Map([]),
  dest: [],
  list: [],
  tokens: [],
  selector: null,
  connecting: true,
};
