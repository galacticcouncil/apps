import { AnyChain, Asset, AssetAmount } from '@galacticcouncil/xcm-core';
import { XTransfer } from '@galacticcouncil/xcm-sdk';

export enum TransferTab {
  Form,
  SelectChain,
  SelectToken,
}

export type TransferState = {
  inProgress: boolean;
  isProcessing: boolean;
  isApproving: boolean;
  isApprove: boolean;
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
  error: { [key: string]: string };
  xTransfer: XTransfer;
};

export const DEFAULT_TRANSFER_STATE: TransferState = {
  inProgress: false,
  isProcessing: false,
  isApproving: false,
  isApprove: false,
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
  xTransfer: null,
};

export type ChainState = {
  balance: Map<string, AssetAmount>;
  balanceDest: Map<string, AssetAmount>;
  dest: AnyChain[];
  list: AnyChain[];
  tokens: Asset[];
  selector: string;
};

export const DEFAULT_CHAIN_STATE: ChainState = {
  balance: new Map([]),
  balanceDest: new Map([]),
  dest: [],
  list: [],
  tokens: [],
  selector: null,
};
