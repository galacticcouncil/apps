import type { RuntimeDispatchInfo } from '@polkadot/types/interfaces';
import { ApiPromise } from '@polkadot/api';
import {
  Asset,
  Amount,
  bnum,
  SYSTEM_ASSET_ID,
  TradeRouter,
  Transaction,
} from '@galacticcouncil/sdk';

import { Account } from '../db';
import { isEvmAccount } from '../utils/account';

const TRSRY_ACC = '7L53bUTBopuwFt3mKUfmkzgGLayYa1Yvn1hAg9v5UMrQzTfh';
const EVM_PAYMENT_ASSET = 'WETH';
const EVM_PAYMENT_ORIGIN = 2004;

export type PaymentFee = { amount: string; ed: string };

export class PaymentApi {
  private _api: ApiPromise;
  private _router: TradeRouter;

  public constructor(api: ApiPromise, router: TradeRouter) {
    this._api = api;
    this._router = router;
  }

  async getPaymentFeeAsset(account: Account): Promise<string> {
    if (isEvmAccount(account.address)) {
      const assets = await this._router.getAllAssets();
      const paymentAsset = assets.find(
        (asset: Asset) =>
          asset.symbol === EVM_PAYMENT_ASSET &&
          asset.origin === EVM_PAYMENT_ORIGIN,
      );
      return paymentAsset.id;
    }

    try {
      const feeAsset =
        await this._api.query.multiTransactionPayment.accountCurrencyMap(
          account.address,
        );
      return feeAsset.toHuman() ? feeAsset.toString() : SYSTEM_ASSET_ID;
    } catch {
      return SYSTEM_ASSET_ID;
    }
  }

  async getPaymentInfo(
    transaction: Transaction,
    account: Account,
  ): Promise<RuntimeDispatchInfo> {
    const address = this.getAddress(account);
    const transactionExtrinsic = this._api.tx(transaction.hex);
    return await transactionExtrinsic.paymentInfo(address);
  }

  async getPaymentFee(feeAsset: Asset, feeNative: string): Promise<Amount> {
    const feeNativeBN = bnum(feeNative);
    if (feeAsset.id == SYSTEM_ASSET_ID) {
      return {
        amount: feeNativeBN,
        decimals: feeAsset.decimals,
      };
    }
    return await this._router.getBestSpotPrice(SYSTEM_ASSET_ID, feeAsset.id);
  }

  private getAddress(account: Account) {
    return account?.address ?? TRSRY_ACC;
  }
}
