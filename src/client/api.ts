import { ApiPromise, WsProvider } from '@polkadot/api';
import type { ChainType } from '@polkadot/types/interfaces';
import { TradeRouter, PolkadotApiPoolService, PoolType } from '@galacticcouncil/sdk';
import { apiCursor } from '../db';

interface ChainData {
  systemChain: string;
  systemChainType: ChainType;
  systemName: string;
  systemVersion: string;
}

async function retrieve(api: ApiPromise): Promise<ChainData> {
  const [systemChain, systemChainType, systemName, systemVersion] = await Promise.all([
    api.rpc.system.chain(),
    api.rpc.system.chainType(),
    api.rpc.system.name(),
    api.rpc.system.version(),
  ]);

  return {
    systemChain: (systemChain || '<unknown>').toString(),
    systemChainType,
    systemName: systemName.toString(),
    systemVersion: systemVersion.toString(),
  };
}

async function loadOnReady(api: ApiPromise): Promise<TradeRouter> {
  const { systemChain, systemChainType, systemName, systemVersion } = await retrieve(api);

  console.log(`Chain: ${systemChain} (${systemChainType.toString()})`);
  const poolService = new PolkadotApiPoolService(api);
  return new TradeRouter(poolService, { includeOnly: [] });
}

export async function createApi(apiUrl: string, onError: (error: unknown) => void) {
  try {
    const provider = new WsProvider(apiUrl);
    const api = new ApiPromise({
      provider: provider,
    });

    api
      .on('connected', () => console.log('API connected'))
      .on('disconnected', () => console.log('API disconnected'))
      .on('error', () => console.log('API error'))
      .on('ready', () => {
        console.log('API ready');
        loadOnReady(api)
          .then((tradeRouter: TradeRouter) => {
            apiCursor.reset({
              promise: api,
              router: tradeRouter,
              node: apiUrl,
            });
          })
          .catch(onError);
      });
  } catch (error) {
    onError(error);
  }
}
