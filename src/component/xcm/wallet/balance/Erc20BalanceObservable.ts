import { ContractConfig } from '@moonbeam-network/xcm-builder';

import {
  Observable,
  Subject,
  shareReplay,
  finalize,
  distinctUntilChanged,
} from 'rxjs';

import { Erc20 } from '../contracts/Erc20';
import { EvmClient } from '../evm';
import { Balance } from '../types';

export class Erc20BalanceObservable {
  readonly #client: EvmClient;
  readonly #contract: Erc20;

  constructor(client: EvmClient, config: ContractConfig) {
    this.#client = client;
    this.#contract = new Erc20(config, client);
  }

  public for(asset: string): Observable<Balance> {
    const subject = new Subject<Balance>();
    const observable = subject.pipe(shareReplay(1));
    const provider = this.#client.getProvider();

    const run = async () => {
      const updateBalance = async () => {
        const balance = await this.#contract.getBalance();
        subject.next({ key: asset, balance });
      };
      await updateBalance();

      const unsub = provider.watchBlocks({
        onBlock: () => updateBalance(),
      });
      return () => unsub();
    };

    let disconnect: () => void;
    run().then((unsub) => (disconnect = unsub));

    return observable.pipe(
      finalize(() => disconnect?.()),
      distinctUntilChanged((prev, curr) => prev.balance === curr.balance),
    ) as Observable<Balance>;
  }
}
