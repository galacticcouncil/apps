import { Transaction } from '@galacticcouncil/sdk';
import { TemplateResult } from 'lit-html';
import { Account } from '../../db';

export type TransactionNotification = {
  processing: string | TemplateResult;
  success: string | TemplateResult;
  failure: string | TemplateResult;
};

export type TransactionInfo = {
  account: Account;
  transaction: Transaction;
  notification: TransactionNotification;
};
