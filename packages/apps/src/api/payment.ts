import type { RuntimeDispatchInfo } from '@polkadot/types/interfaces';
import { ApiPromise } from '@polkadot/api';
import {
  Asset,
  Amount,
  bnum,
  TradeRouter,
  ZERO,
  Transaction,
  SYSTEM_ASSET_ID,
  SYSTEM_ASSET_DECIMALS,
  BigNumber,
  ONE,
} from '@galacticcouncil/sdk';
import { EvmClient, evmChains } from '@galacticcouncil/xcm-sdk';

import { Account } from 'db';
import { convertToH160, DISPATCH_ADDRESS } from 'utils/evm';

const TRSRY_ACC = '7L53bUTBopuwFt3mKUfmkzgGLayYa1Yvn1hAg9v5UMrQzTfh';

export type PaymentFee = { amount: string; ed: string };

export class PaymentApi {
  private _api: ApiPromise;
  private _router: TradeRouter;

  public constructor(api: ApiPromise, router: TradeRouter) {
    this._api = api;
    this._router = router;
  }

  async getPaymentFeeAsset(address: string): Promise<string> {
    const addr = this.getSafeAddress(address);
    try {
      const feeAsset =
        await this._api.query.multiTransactionPayment.accountCurrencyMap(addr);
      return feeAsset.toHuman() ? feeAsset.toString() : SYSTEM_ASSET_ID;
    } catch {
      return SYSTEM_ASSET_ID;
    }
  }

  async getPaymentInfo(
    transaction: Transaction,
    account: Account,
  ): Promise<RuntimeDispatchInfo> {
    const address = this.getSafeAddress(account?.address);
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

    const oraclePrice = await this._api.query.emaOracle.oracles(
      'omnipool',
      ['1', feeAsset.id],
      'Short',
    );

    let spotPrice: BigNumber;

    if (oraclePrice.isNone) {
      const currency =
        await this._api.query.multiTransactionPayment.acceptedCurrencies(
          feeAsset.id,
        );
      const fallbackPrice = currency.unwrap();

      spotPrice = ONE.shiftedBy(SYSTEM_ASSET_DECIMALS)
        .times(fallbackPrice.toString())
        .shiftedBy(-18);
    } else {
      spotPrice = (
        await this._router.getBestSpotPrice(SYSTEM_ASSET_ID, feeAsset.id)
      ).amount;
    }

    return {
      decimals: feeAsset.decimals,
      amount: bnum(feeNative)
        .shiftedBy(-SYSTEM_ASSET_DECIMALS)
        .times(spotPrice),
    };
  }

  async getEvmPaymentFee(txHex: string, account: Account): Promise<Amount> {
    const extrinsic = this._api.tx(txHex);
    const evmAddress = convertToH160(account.address);
    const evmChain = evmChains['hydradx'];
    const evmClient = new EvmClient(evmChain);
    const evmProvider = evmClient.getProvider();
    try {
      const data = extrinsic.inner.toHex();
      const [gas, gasPrice] = await Promise.all([
        evmProvider.estimateGas({
          account: evmAddress as `0x${string}`,
          data: data as `0x${string}`,
          to: DISPATCH_ADDRESS as `0x${string}`,
        }),
        evmProvider.getGasPrice(),
      ]);
      const price = gas * gasPrice;
      return {
        amount: bnum(price.toString()),
        decimals: evmChain.nativeCurrency.decimals,
      };
    } catch (error) {
      return {
        amount: ZERO,
        decimals: evmChain.nativeCurrency.decimals,
      };
    }
  }

  private getSafeAddress(address: string) {
    return address ?? TRSRY_ACC;
  }
}
