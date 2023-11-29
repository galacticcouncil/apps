import { SubstrateQueryConfig } from '@moonbeam-network/xcm-builder';
import { ApiPromise } from '@polkadot/api';
import type { QueryableStorage } from '@polkadot/api/types';

import { concatMap, map, switchMap, Observable, ReplaySubject } from 'rxjs';

import { Balance } from '../types';

export class SubstrateBalanceAdapter {
  readonly api: ApiPromise;

  constructor(api: ApiPromise) {
    this.api = api;
  }

  public getObserver(
    asset: string,
    config: SubstrateQueryConfig,
  ): Observable<Balance> {
    const subject = new ReplaySubject<QueryableStorage<'rxjs'>>(1);
    subject.next(this.api.rx.query);

    const { module, func, args, transform } = config;
    return subject.pipe(
      switchMap((q) => q[module][func](...args)),
      concatMap((b) => transform(b)),
      map((balance) => {
        return { key: asset, balance } as Balance;
      }),
    );
  }

  public async query(config: SubstrateQueryConfig): Promise<bigint> {
    const { module, func, args, transform } = config;
    const response = await this.api.query[module][func](...args);
    return transform(response);
  }
}
