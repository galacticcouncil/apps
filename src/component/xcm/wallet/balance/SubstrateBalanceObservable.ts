import { SubstrateQueryConfig } from '@moonbeam-network/xcm-builder';
import { ApiPromise } from '@polkadot/api';
import { QueryableStorage } from '@polkadot/api/types';

import { concatMap, map, switchMap, Observable, ReplaySubject } from 'rxjs';

import { Balance } from '../types';

export class SubstrateBalanceObservable {
  readonly #api: ApiPromise;
  readonly #config: SubstrateQueryConfig;

  constructor(api: ApiPromise, config: SubstrateQueryConfig) {
    this.#api = api;
    this.#config = config;
  }

  public for(asset: string): Observable<Balance> {
    const subject = new ReplaySubject<QueryableStorage<'rxjs'>>(1);
    subject.next(this.#api.rx.query);

    const { module, func, args, transform } = this.#config;
    return subject.pipe(
      switchMap((q) => q[module][func](...args)),
      concatMap((b) => transform(b)),
      map((balance) => {
        return { key: asset, balance } as Balance;
      }),
    );
  }
}
