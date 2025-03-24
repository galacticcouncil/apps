import { AnyChain, Asset, AssetAmount } from '@galacticcouncil/xcm-core';
import {
  TransferDestinationData,
  TransferSourceData,
  Transfer,
} from '@galacticcouncil/xcm-sdk';

export enum TransferTab {
  Form,
  SelectChain,
  SelectToken,
  SelectTokenOnDest,
}

export type TransferState = {
  inProgress: boolean;
  isProcessing: boolean;
  isApproving: boolean;
  isApprove: boolean;
  address: string;
  amount: string;
  destAsset: Asset;
  destBalance: AssetAmount;
  destChain: AnyChain;
  destData: TransferDestinationData;
  srcAsset: Asset;
  srcBalance: AssetAmount;
  srcChain: AnyChain;
  srcData: TransferSourceData;
  error: { [key: string]: string };
  transfer: Transfer;
  tags: string[];
};

export const DEFAULT_TRANSFER_STATE: TransferState = {
  inProgress: true,
  isProcessing: false,
  isApproving: false,
  isApprove: false,
  address: null,
  amount: null,
  destAsset: null,
  destBalance: null,
  destChain: null,
  destData: null,
  srcAsset: null,
  srcBalance: null,
  srcChain: null,
  srcData: null,
  error: {},
  transfer: null,
  tags: [],
};

export type ChainState = {
  balance: Map<string, AssetAmount>;
  balanceOnDest: Map<string, AssetAmount>;
  dest: AnyChain[];
  list: AnyChain[];
  assets: Asset[];
  assetsToReceive: Asset[];
  selector: string;
};

export const DEFAULT_CHAIN_STATE: ChainState = {
  balance: new Map([]),
  balanceOnDest: new Map([]),
  dest: [],
  list: [],
  assets: [],
  assetsToReceive: [],
  selector: null,
};
