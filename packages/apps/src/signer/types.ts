import { TemplateResult } from 'lit-html';
import { SubstrateTransaction, Transaction } from '@galacticcouncil/sdk';
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

export type TxInfo<TxMeta extends object = never> = {
  account: Account;
  transaction:
    | SubstrateTransaction
    | Transaction<Call, DryRunResult | undefined>;
  notification: TxNotification;
  meta?: Record<string, string> | TxMeta;
};
