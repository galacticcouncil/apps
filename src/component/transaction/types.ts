import { Transaction } from '@galacticcouncil/sdk';
import { TemplateResult } from 'lit-html';
import { Account } from '../../db';

export type TxNotification = {
  processing: string | TemplateResult;
  success: string | TemplateResult;
  failure: string | TemplateResult;
};

export type TxInfo = {
  account: Account;
  transaction: Transaction;
  notification: TxNotification;
  meta?: Record<string, string>;
};
