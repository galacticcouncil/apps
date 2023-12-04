import { BaseConfig } from '@moonbeam-network/xcm-builder';
import { Asset, AssetAmount } from '@moonbeam-network/xcm-types';

import { Observable } from 'rxjs';

export interface BalanceProvider {
  getBalance(asset: Asset, config: BaseConfig): Promise<AssetAmount>;
  getFee(
    address: string,
    amount: bigint,
    feeBalance: AssetAmount,
    config: BaseConfig,
  ): Promise<AssetAmount>;
  subscribeBalance(asset: Asset, config: BaseConfig): Observable<AssetAmount>;
}

export interface TransferProvider {
  getFee(
    address: string,
    amount: bigint,
    feeBalance: AssetAmount,
    config: BaseConfig,
  ): Promise<AssetAmount>;
}

export interface TransferInput {
  balance: AssetAmount;
  max: AssetAmount;
  min: AssetAmount;
  srcFee: AssetAmount;
  destFee: AssetAmount;
  // swap(amount: bigint | number | string): Promise<string>;
  // calldata(amount: bigint | number | string): Promise<string>;
}
