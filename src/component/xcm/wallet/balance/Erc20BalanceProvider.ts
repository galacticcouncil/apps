import { ContractConfig } from '@moonbeam-network/xcm-builder';
import { Asset, AssetAmount } from '@moonbeam-network/xcm-types';

import {
  Observable,
  Subject,
  shareReplay,
  finalize,
  distinctUntilChanged,
} from 'rxjs';

import { Erc20, XTokens } from '../contracts';
import { EvmClient } from '../evm';
import { BalanceProvider } from '../types';

export class Erc20BalanceProvider implements BalanceProvider {
  readonly #client: EvmClient;
  readonly #erc20: Erc20;
  readonly #xTokens: XTokens;

  constructor(client: EvmClient) {
    this.#client = client;
    this.#erc20 = new Erc20(client);
    this.#xTokens = new XTokens(client);
  }

  async getBalance(asset: Asset, config: ContractConfig): Promise<AssetAmount> {
    const [balance, decimals] = await Promise.all([
      this.#erc20.getBalance(config),
      this.#erc20.getDecimals(config),
    ]);
    return AssetAmount.fromAsset(asset, {
      amount: balance,
      decimals: decimals,
    });
  }

  async getFee(
    address: string,
    amount: bigint,
    feeBalance: AssetAmount,
    config: ContractConfig,
  ): Promise<AssetAmount> {
    const fee = await this.#xTokens.getFee(address, amount, config);
    return feeBalance.copyWith({
      amount: fee,
    });
  }

  subscribeBalance(
    asset: Asset,
    config: ContractConfig,
  ): Observable<AssetAmount> {
    const subject = new Subject<AssetAmount>();
    const observable = subject.pipe(shareReplay(1));
    const provider = this.#client.getProvider();

    const run = async () => {
      const updateBalance = async () => {
        const balance = await this.getBalance(asset, config);
        subject.next(balance);
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
    ) as Observable<AssetAmount>;
  }
}
