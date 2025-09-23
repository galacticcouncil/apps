import { TemplateResult } from 'lit-html';
import { Asset, SubstrateTransaction, Transaction } from '@galacticcouncil/sdk';
import { Call, DryRunResult } from '@galacticcouncil/xcm-sdk';

import { Account } from 'db';

export enum NotificationType {
  success = 'success',
  error = 'error',
  progress = 'progress',
  default = '',
}

export type Notification = {
  id: string;
  timestamp: number;
  message: string | TemplateResult;
  type: NotificationType;
  toast: boolean;
  meta?: Record<string, string>;
};

export type TxMessage = {
  message: TemplateResult | string;
  rawHtml: string;
  values: string[];
};

export type TxNotification = {
  processing: TxMessage;
  success: TxMessage;
  failure: TxMessage;
};

export type TxType =
  | SubstrateTransaction
  | Transaction<Call, DryRunResult | undefined>;

export type TxDetail = {
  assetIn: Asset;
  assetOut: string;
  amount: string;
  isWithdraw: boolean;
};

export type TxMetadata = TradeMetadata | XcmMetadata;

export type TxInfo<T extends TxMetadata = never> = {
  account: Account;
  detail: TxDetail;
  notification: TxNotification;
  transaction: TxType;
  meta?: T;
};

export type TradeMetadata = {
  amountIn: string;
  amountOut: string;
  assetIn: Asset;
  assetOut: Asset;
  isWithdraw: boolean;
};

export type YieldMetadata = TradeMetadata & {
  amountInYield: string;
  amountInFrom: string;
};

export type XcmMetadata = {
  srcChain: string;
  srcChainFee: string;
  srcChainFeeBalance: string;
  srcChainFeeSymbol: string;
  dstChain: string;
  dstChainFee: string;
  dstChainFeeSymbol: string;
  tags: string[];
};
