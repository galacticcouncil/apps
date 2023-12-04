import {
  ExtrinsicConfig,
  SubstrateQueryConfig,
} from '@moonbeam-network/xcm-builder';
import { Asset, AssetAmount } from '@moonbeam-network/xcm-types';
import { QueryableStorage } from '@polkadot/api/types';

import { concatMap, map, switchMap, Observable, ReplaySubject } from 'rxjs';

import { BalanceProvider } from '../types';
import { SubstrateService } from '../substrate';

export class NativeBalanceProvider implements BalanceProvider {
  readonly #substrate: SubstrateService;

  constructor(substrate: SubstrateService) {
    this.#substrate = substrate;
  }

  async getBalance(
    asset: Asset,
    config: SubstrateQueryConfig,
  ): Promise<AssetAmount> {
    const { module, func, args, transform } = config;
    const response = await this.#substrate.api.query[module][func](...args);
    const balance = await transform(response);
    const decimals = this.#substrate.getDecimals(asset);
    return AssetAmount.fromAsset(asset, {
      amount: balance,
      decimals: decimals,
    });
  }

  async getFee(
    address: string,
    amount: bigint,
    feeBalance: AssetAmount,
    config: ExtrinsicConfig,
  ): Promise<AssetAmount> {
    const fee = await this.#substrate.getFee(address, config);
    return feeBalance.copyWith({
      amount: fee,
    });
  }

  subscribeBalance(
    asset: Asset,
    config: SubstrateQueryConfig,
  ): Observable<AssetAmount> {
    const subject = new ReplaySubject<QueryableStorage<'rxjs'>>(1);
    subject.next(this.#substrate.api.rx.query);

    const { module, func, args, transform } = config;
    return subject.pipe(
      switchMap((q) => q[module][func](...args)),
      concatMap((b) => transform(b)),
      map((balance) => {
        const decimals = this.#substrate.getDecimals(asset);
        return AssetAmount.fromAsset(asset, {
          amount: balance,
          decimals: decimals,
        });
      }),
    );
  }
}
