import type { RuntimeDispatchInfo } from '@polkadot/types/interfaces';
import { ApiPromise } from '@polkadot/api';
import { SYSTEM_ASSET_ID, Transaction } from '@galacticcouncil/sdk';

import { Account } from '../db';

export class PaymentApi {
  private _api: ApiPromise;

  public constructor(api: ApiPromise) {
    this._api = api;
  }

  async getFeePaymentAsset(account: Account): Promise<string> {
    const feeAsset = await this._api.query.multiTransactionPayment.accountCurrencyMap(account.address);
    return feeAsset.toHuman() ? feeAsset.toString() : SYSTEM_ASSET_ID;
  }

  async getPaymentInfo(transaction: Transaction, account: Account): Promise<RuntimeDispatchInfo> {
    const transactionExtrinsic = this._api.tx(transaction.hex);
    return await transactionExtrinsic.paymentInfo(account.address);
  }
}
