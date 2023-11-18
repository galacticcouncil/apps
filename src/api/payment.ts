import type { Balance, RuntimeDispatchInfo } from '@polkadot/types/interfaces';
import { ApiPromise } from '@polkadot/api';
import {
  bnum,
  SYSTEM_ASSET_DECIMALS,
  SYSTEM_ASSET_ID,
  TradeRouter,
  Transaction,
} from '@galacticcouncil/sdk';

import { Account } from '../db';
import { formatAmount, multipleAmounts } from '../utils/amount';

const TRSRY_ACC = '7L53bUTBopuwFt3mKUfmkzgGLayYa1Yvn1hAg9v5UMrQzTfh';

export type PaymentFee = { amount: string; ed: string };

export class PaymentApi {
  private _api: ApiPromise;
  private _router: TradeRouter;

  public constructor(api: ApiPromise, router: TradeRouter) {
    this._api = api;
    this._router = router;
  }

  async getPaymentFeeAsset(account: Account): Promise<string> {
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

  async getPaymentFee(
    feeAssetId: string,
    feeAssetNativeBalance: Balance,
    feeAssetEd: string,
  ): Promise<PaymentFee> {
    const feeAssetEdBN = bnum(feeAssetEd.toString());
    const feeNativeBN = bnum(feeAssetNativeBalance.toString());
    const feeHuman = formatAmount(feeNativeBN, SYSTEM_ASSET_DECIMALS);

    if (feeAssetId == SYSTEM_ASSET_ID) {
      const ed = formatAmount(feeAssetEdBN, SYSTEM_ASSET_DECIMALS);
      return {
        amount: feeHuman,
        ed: ed,
      } as PaymentFee;
    }

    const feeAssetPrice = await this._router.getBestSpotPrice(
      SYSTEM_ASSET_ID,
      feeAssetId,
    );
    const fee = multipleAmounts(feeHuman, feeAssetPrice);
    const ed = formatAmount(feeAssetEdBN, feeAssetPrice.decimals);
    return {
      amount: fee.toString(),
      ed: ed,
    } as PaymentFee;
  }

  private getAddress(account: Account) {
    return account?.address ?? TRSRY_ACC;
  }
}
