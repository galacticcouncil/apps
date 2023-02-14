import { ApiProvider, Bridge, ChainName } from '@galacticcouncil/bridge';
import { BaseCrossChainAdapter } from '@galacticcouncil/bridge/base-chain-adapter';
import { KusamaAdapter, PolkadotAdapter, RococoAdapter } from '@galacticcouncil/bridge/adapters/polkadot';
import { AcalaAdapter, KaruraAdapter } from '@galacticcouncil/bridge/adapters/acala';
import { HydradxAdapter, BasiliskAdapter } from '@galacticcouncil/bridge/adapters/hydradx';
import { StatemineAdapter } from '@galacticcouncil/bridge/adapters/statemint';
import { TinkernetAdapter } from '@galacticcouncil/bridge/adapters/tinkernet';

import { firstValueFrom } from 'rxjs';

import { xChainCursor } from './db';

const CHAINS: Record<string, string[]> = {
  polkadot: ['wss://rpc.polkadot.io'],
  kusama: ['wss://kusama.api.onfinality.io/public-ws'],
  acala: ['wss://acala-polkadot.api.onfinality.io/public-ws'],
  karura: ['wss://karura.api.onfinality.io/public-ws'],
  statemine: ['wss://statemine.api.onfinality.io/public-ws'],
  tinkernet: ['wss://invarch-tinkernet.api.onfinality.io/public-ws'],
  hydradx: ['wss://rpc.hydradx.cloud'],
  basilisk: ['wss://rpc.basilisk.cloud'],
};

const CHAINS_TESTNET: Record<string, string[]> = {
  rococo: ['wss://rococo-rpc.polkadot.io'],
  karura: ['wss://karura-rococo-rpc.aca-staging.network/ws'],
  hydradx: ['wss://rococo-hydradx-rpc.hydration.dev'],
  basilisk: ['wss://rococo-basilisk-rpc.hydration.dev'],
};

const ADAPTERS: Record<string, BaseCrossChainAdapter> = {
  polkadot: new PolkadotAdapter(),
  kusama: new KusamaAdapter(),
  rococo: new RococoAdapter(),
  acala: new AcalaAdapter(CHAINS['acala']),
  karura: new KaruraAdapter(),
  hydradx: new HydradxAdapter(),
  basilisk: new BasiliskAdapter(),
  statemine: new StatemineAdapter(),
  tinkernet: new TinkernetAdapter(),
};

export async function initBridge(chains: string[]) {
  const adapters = chains.map((chain: string) => ADAPTERS[chain]);
  const bridge = new Bridge({
    adapters: adapters,
  });
  const provider = new ApiProvider();
  xChainCursor.reset({ apiProvider: provider, bridge: bridge });
}

export async function initAdapterConnection(adapter: BaseCrossChainAdapter, testnet?: Boolean) {
  if (adapter.getApi() != null) {
    return;
  }

  const provider = xChainCursor.deref().apiProvider;
  const chain = adapter.chain.id;
  const notConnectedChain = [chain] as ChainName[];
  const connectedChain = provider.connectFromChain(notConnectedChain, testnet ? CHAINS_TESTNET : CHAINS);
  await firstValueFrom(connectedChain);
  await adapter.setApi(provider.getApi(chain));
}
