import { Transaction } from '@galacticcouncil/sdk';
import { TemplateResult } from 'lit-html';
import { Account } from '../../db';

export type TxNotificationMssg = {
  message: TemplateResult | string;
  rawHtml: string;
  values: string[];
};

export type TxNotification = {
  processing: TxNotificationMssg;
  success: TxNotificationMssg;
  failure: TxNotificationMssg;
};

export type TxInfo = {
  account: Account;
  transaction: Transaction;
  notification: TxNotification;
  meta?: Record<string, any>;
};
