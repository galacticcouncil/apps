import { createWalletClient, custom, Chain, WalletClient } from 'viem';

import { EvmClient } from '@galacticcouncil/xcm-sdk';

export class EvmWalletClient extends EvmClient {
  readonly chain: Chain;

  constructor(chain: Chain) {
    super(chain);
  }

  getSigner(address: string): WalletClient {
    return createWalletClient({
      account: address as `0x${string}`,
      chain: this.chain,
      transport: custom(window['ethereum']),
    });
  }
}
