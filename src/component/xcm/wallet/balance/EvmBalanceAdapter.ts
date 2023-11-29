import { ContractConfig } from '@moonbeam-network/xcm-builder';
import { ApiPromise } from '@polkadot/api';

import {
  Observable,
  Subject,
  shareReplay,
  finalize,
  distinctUntilChanged,
} from 'rxjs';

import { parseAbi } from 'viem';
import { Balance } from '../types';
import { EvmProvider } from '../evm';

const ABI = parseAbi([
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
]);

export class EvmBalanceAdapter {
  readonly provider: EvmProvider;
  readonly api: ApiPromise;

  constructor(provider: EvmProvider, api: ApiPromise) {
    this.provider = provider;
    this.api = api;
  }

  public getObserver(asset: string, cfg: ContractConfig): Observable<Balance> {
    const subject = new Subject<Balance>();
    const observer = subject.pipe(shareReplay(1));

    const { address, args } = cfg;
    const [recipient] = args;

    const client = this.provider.getPublicClient();

    const run = async () => {
      const evmAddress = await this.provider.toEvmAddress(this.api, recipient);
      const updateBalance = async () => {
        if (evmAddress) {
          const balance = await client.readContract({
            address: address as `0x${string}`,
            abi: ABI,
            functionName: 'balanceOf',
            args: [evmAddress as `0x${string}`],
          });
          subject.next({ key: asset, balance });
        } else {
          subject.next({ key: asset, balance: 0n });
        }
      };
      await updateBalance();

      const unwatch = client.watchBlocks({
        onBlock: () => updateBalance(),
      });

      return () => unwatch();
    };

    let disconnectSubscribeBlock: () => void;
    run().then((unsub) => (disconnectSubscribeBlock = unsub));

    return observer.pipe(
      finalize(() => disconnectSubscribeBlock?.()),
      distinctUntilChanged((prev, curr) => prev.balance === curr.balance),
    ) as Observable<Balance>;
  }
}
