import {
  createPublicClient,
  createWalletClient,
  custom,
  http,
  Chain,
  PublicClient,
  WalletClient,
} from 'viem';

export class EvmClient {
  readonly chain: Chain;

  constructor(chain: Chain) {
    this.chain = chain;
  }

  getProvider(): PublicClient {
    return createPublicClient({
      chain: this.chain,
      transport: http(),
    });
  }

  getSigner(address: string, browser?: boolean): WalletClient {
    return createWalletClient({
      account: address as `0x${string}`,
      chain: this.chain,
      transport: browser ? custom(window['ethereum']) : http(),
    });
  }
}
