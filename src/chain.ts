import { ApiPromise, WsProvider } from '@polkadot/api';
import { Ecosystem, chainCursor } from './db';
import {
  CachingPoolService,
  PoolType,
  TradeRouter,
} from '@galacticcouncil/sdk';

async function info(api: ApiPromise): Promise<void> {
  const [systemChain, systemChainType, systemName, systemVersion] =
    await Promise.all([
      api.rpc.system.chain(),
      api.rpc.system.chainType(),
      api.rpc.system.name(),
      api.rpc.system.version(),
    ]);
  console.log(`Chain: ${systemChain} (${systemChainType.toString()})`);
}

function initApi(
  api: ApiPromise,
  ecosystem: Ecosystem,
  pools: PoolType[],
  onReady: (api: ApiPromise, router: TradeRouter) => void,
) {
  api
    .on('connected', () => console.log('API connected'))
    .on('disconnected', () => console.log('API disconnected'))
    .on('error', () => console.log('API error'))
    .on('ready', () => {
      console.log('API ready ✅');
      info(api);
      const poolService = new CachingPoolService(api);
      const router = new TradeRouter(poolService, { includeOnly: pools });
      // Get pools and cache the result
      router.getPools().then(() => {
        console.log('Router ready ✅');
        chainCursor.reset({
          api: api,
          ecosystem: ecosystem,
          poolService: poolService,
          router: router,
        });
        onReady(api, router);
      });
    });
}

export async function createApi(
  apiUrl: string,
  ecosystem: Ecosystem,
  pools: PoolType[],
  onReady: (api: ApiPromise, router: TradeRouter) => void,
  onError: (error: unknown) => void,
) {
  try {
    const provider = new WsProvider(apiUrl);
    const api = new ApiPromise({
      provider: provider,
    });
    initApi(api, ecosystem, pools, onReady);
  } catch (error) {
    onError(error);
  }
}

export async function useApi(
  api: ApiPromise,
  ecosystem: Ecosystem,
  pools: PoolType[],
  onReady: (api: ApiPromise, router: TradeRouter) => void,
  onError: (error: unknown) => void,
) {
  try {
    initApi(api, ecosystem, pools, onReady);
  } catch (error) {
    onError(error);
  }
}
