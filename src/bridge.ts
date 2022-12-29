import { ApiProvider, Bridge, ChainName } from '@galacticcouncil/bridge/build';
import { BaseCrossChainAdapter } from '@galacticcouncil/bridge/build/base-chain-adapter';
import { PolkadotAdapter, RococoAdapter } from '@galacticcouncil/bridge/build/adapters/polkadot';
import { AcalaAdapter, KaruraAdapter } from '@galacticcouncil/bridge/build/adapters/acala';
import { HydradxAdapter, BasiliskAdapter } from '@galacticcouncil/bridge/build/adapters/hydradx';

import { firstValueFrom } from 'rxjs';

import { bridgeCursor } from './db';

const ADAPTERS: Record<string, BaseCrossChainAdapter> = {
  polkadot: new PolkadotAdapter(),
  rococo: new RococoAdapter(),
  acala: new AcalaAdapter(),
  karura: new KaruraAdapter(),
  hydradx: new HydradxAdapter(),
  basilisk: new BasiliskAdapter(),
};

const CHAINS: Record<string, string[]> = {
  polkadot: ['wss://rpc.polkadot.io'],
  acala: [
    'wss://acala-rpc-0.aca-api.network',
    'wss://acala-rpc-1.aca-api.network',
    'wss://acala-rpc-2.aca-api.network',
  ],
  karura: [
    'wss://karura-rpc-0.aca-api.network',
    'wss://karura-rpc-1.aca-api.network',
    'wss://karura-rpc-2.aca-api.network',
  ],
  hydradx: ['wss://rpc.hydradx.cloud'],
  basilisk: ['wss://rpc.basilisk.cloud'],
};

const CHAINS_TESTNET: Record<string, string[]> = {
  rococo: ['wss://rococo-rpc.polkadot.io'],
  karura: ['wss://karura-rococo-rpc.aca-staging.network/ws'],
  hydradx: ['wss://rococo-hydradx-rpc.hydration.dev'],
  basilisk: ['wss://rococo-basilisk-rpc.hydration.dev'],
};

export async function createBridge(chains: string[], testnet: Boolean) {
  const adapters = chains.map((chain: string) => ADAPTERS[chain]);
  const bridge = new Bridge({
    adapters: adapters,
  });
  const provider = new ApiProvider();
  const chainNames = chains as ChainName[];
  const connected = provider.connectFromChain(chainNames, testnet ? CHAINS_TESTNET : undefined);
  await firstValueFrom(connected);
  await Promise.all(chains.map((chain) => ADAPTERS[chain].setApi(provider.getApi(chain))));
  bridgeCursor.reset(bridge);
}
