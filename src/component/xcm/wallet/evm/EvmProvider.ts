import {
  createPublicClient,
  createWalletClient,
  http,
  Chain,
  PublicClient,
  WalletClient,
} from 'viem';

import { ApiPromise } from '@polkadot/api';

export abstract class EvmProvider {
  readonly evmChain: Chain;

  constructor(evmChain: Chain) {
    this.evmChain = evmChain;
  }

  abstract toEvmAddress(api: ApiPromise, address: string): Promise<string>;

  getPublicClient(): PublicClient {
    return createPublicClient({
      chain: this.evmChain,
      transport: http(),
    });
  }

  getWalletClient(address: string): WalletClient {
    return createWalletClient({
      account: address as `0x${string}`,
      chain: this.evmChain,
      transport: http(),
    });
  }
}
