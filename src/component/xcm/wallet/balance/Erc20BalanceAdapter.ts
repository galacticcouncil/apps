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
import { Balance, BalanceAdapter } from '../types';

export class Erc20BalanceAdapter implements BalanceAdapter {
  readonly #client: EvmClient;
  readonly #contract: Erc20;

  constructor(client: EvmClient, config: ContractConfig) {
    this.#client = client;
    this.#contract = new Erc20(config, client);
  }

  getObservable(assetKey: string): Observable<Balance> {
    const subject = new Subject<Balance>();
    const observable = subject.pipe(shareReplay(1));
    const provider = this.#client.getProvider();

    const run = async () => {
      const updateBalance = async () => {
        const balance = await this.#contract.getBalance();
        subject.next({ key: assetKey, amount: balance });
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
      distinctUntilChanged((prev, curr) => prev.amount === curr.amount),
    ) as Observable<Balance>;
  }

  async getBalance(assetKey: string): Promise<Balance> {
    const balance = await this.#contract.getBalance();
    return { key: assetKey, amount: balance } as Balance;
  }
}
