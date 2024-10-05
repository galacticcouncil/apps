import {
  AnyChain,
  Asset,
  AssetAmount,
  SwapInfo,
} from '@galacticcouncil/xcm-core';
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
  swap: SwapInfo;
  xTransfer: XTransfer;
};

export const DEFAULT_TRANSFER_STATE: TransferState = {
  inProgress: true,
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
  swap: null,
  xTransfer: null,
};

export type ChainState = {
  balance: Map<string, AssetAmount>;
  dest: AnyChain[];
  list: AnyChain[];
  tokens: Asset[];
  selector: string;
};

export const DEFAULT_CHAIN_STATE: ChainState = {
  balance: new Map([]),
  dest: [],
  list: [],
  tokens: [],
  selector: null,
};
