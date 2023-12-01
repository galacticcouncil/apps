import { SubstrateQueryConfig } from '@moonbeam-network/xcm-builder';
import { ApiPromise } from '@polkadot/api';
import { QueryableStorage } from '@polkadot/api/types';

import { concatMap, map, switchMap, Observable, ReplaySubject } from 'rxjs';

import { Balance, BalanceAdapter } from '../types';

export class SubstrateBalanceAdapter implements BalanceAdapter {
  readonly #api: ApiPromise;
  readonly #config: SubstrateQueryConfig;

  constructor(api: ApiPromise, config: SubstrateQueryConfig) {
    this.#api = api;
    this.#config = config;
  }

  getObservable(assetKey: string): Observable<Balance> {
    const subject = new ReplaySubject<QueryableStorage<'rxjs'>>(1);
    subject.next(this.#api.rx.query);

    const { module, func, args, transform } = this.#config;
    return subject.pipe(
      switchMap((q) => q[module][func](...args)),
      concatMap((b) => transform(b)),
      map((balance) => {
        return { key: assetKey, amount: balance } as Balance;
      }),
    );
  }

  async getBalance(assetKey: string): Promise<Balance> {
    const { module, func, args, transform } = this.#config;
    const response = await this.#api.query[module][func](...args);
    const balance = await transform(response);
    return { key: assetKey, amount: balance } as Balance;
  }
}
