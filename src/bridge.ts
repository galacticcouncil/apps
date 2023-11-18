import { ApiProvider, Bridge, ChainId } from '@galacticcouncil/bridge';
import { BaseCrossChainAdapter } from '@galacticcouncil/bridge/base-chain-adapter';
import {
  KusamaAdapter,
  PolkadotAdapter,
} from '@galacticcouncil/bridge/adapters/polkadot';
import {
  AcalaAdapter,
  KaruraAdapter,
} from '@galacticcouncil/bridge/adapters/acala';
import {
  HydraDxAdapter,
  BasiliskAdapter,
} from '@galacticcouncil/bridge/adapters/hydradx';
import {
  StatemineAdapter,
  StatemintAdapter,
} from '@galacticcouncil/bridge/adapters/statemint';
import { TinkernetAdapter } from '@galacticcouncil/bridge/adapters/tinkernet';
import { RobonomicsAdapter } from '@galacticcouncil/bridge/adapters/robonomics';
import { InterlayAdapter } from '@galacticcouncil/bridge/adapters/interlay';
import { ZeitgeistAdapter } from '@galacticcouncil/bridge/adapters/zeitgeist';
import { AstarAdapter } from '@galacticcouncil/bridge/adapters/astar';
import { CentrifugeAdapter } from '@galacticcouncil/bridge/adapters/centrifuge';
import { BifrostAdapter } from '@galacticcouncil/bridge/adapters/bifrost';

import { Wallet } from '@acala-network/sdk/wallet';
import { EvmRpcProvider } from '@acala-network/eth-providers';

import { firstValueFrom } from 'rxjs';
import { xChainCursor } from './db';

const CHAINS: Record<string, string[]> = {
  polkadot: ['wss://rpc.polkadot.io'],
  kusama: ['wss://kusama-rpc.polkadot.io'],
  acala: ['wss://acala-rpc-0.aca-api.network'],
  karura: ['wss://karura-rpc-1.aca-api.network'],
  statemine: ['wss://kusama-asset-hub-rpc.polkadot.io'],
  statemint: ['wss://polkadot-asset-hub-rpc.polkadot.io'],
  tinkernet: ['wss://tinkernet-rpc.dwellir.com'],
  robonomics: ['wss://kusama.rpc.robonomics.network/'],
  interlay: ['wss://interlay-rpc.dwellir.com'],
  zeitgeist: ['wss://zeitgeist-rpc.dwellir.com'],
  astar: ['wss://rpc.astar.network'],
  hydradx: ['wss://rpc.hydradx.cloud'],
  basilisk: ['wss://rpc.basilisk.cloud'],
  centrifuge: ['wss://fullnode.centrifuge.io'],
  bifrost: ['wss://bifrost-polkadot.api.onfinality.io/public-ws'],
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
  acala: new AcalaAdapter(),
  karura: new KaruraAdapter(),
  hydradx: new HydraDxAdapter(),
  basilisk: new BasiliskAdapter(),
  interlay: new InterlayAdapter(),
  statemine: new StatemineAdapter(),
  statemint: new StatemintAdapter(),
  tinkernet: new TinkernetAdapter(),
  robonomics: new RobonomicsAdapter(),
  zeitgeist: new ZeitgeistAdapter(),
  astar: new AstarAdapter(),
  centrifuge: new CentrifugeAdapter(),
  bifrost: new BifrostAdapter(),
};

const BASILISK_SUPPORTED_TOKENS = ['KSM', 'BSX', 'aUSD', 'XRT', 'TNKR', 'USDT'];
const HYDRADX_SUPPORTED_TOKENS = [
  'DOT',
  'HDX',
  'DAI',
  'WETH',
  'WBTC',
  'IBTC',
  'USDT',
  'USDC',
  'ZTG',
  'ASTR',
  'CFG',
  'BNC',
  'vDOT',
];

export function getSupportedTokens() {
  try {
    xChainCursor.deref().bridge.findAdapter('hydradx');
    return HYDRADX_SUPPORTED_TOKENS;
  } catch {
    return BASILISK_SUPPORTED_TOKENS;
  }
}

export async function initBridge(chains: string[]) {
  const adapters = chains.map((chain: string) => ADAPTERS[chain]);
  const bridge = new Bridge({
    adapters: adapters,
  });
  const provider = new ApiProvider();
  xChainCursor.reset({ apiProvider: provider, bridge: bridge });
}

export async function initAdapterConnection(
  adapter: BaseCrossChainAdapter,
  testnet?: Boolean,
) {
  const api = adapter.getApi();
  if (api != null) {
    return;
  }

  const provider = xChainCursor.deref().apiProvider;
  const chain = adapter.chain.id;
  const notConnectedChain = [chain] as ChainId[];
  const connectedChain = provider.connectFromChain(
    notConnectedChain,
    testnet ? CHAINS_TESTNET : CHAINS,
  );
  await firstValueFrom(connectedChain);

  if (chain == 'acala') {
    const acalaApi = provider.getApi(chain);
    const wallet = new Wallet(acalaApi, {
      evmProvider: new EvmRpcProvider('wss://acala.polkawallet.io'),
    });
    await adapter.init(acalaApi, wallet);
  } else {
    await adapter.init(provider.getApi(chain));
  }
}
