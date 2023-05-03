import { ApiPromise, WsProvider } from '@polkadot/api';
import { TradeRouter, PolkadotApiPoolService, PoolType } from '@galacticcouncil/sdk';
import { chainCursor } from './db';

async function info(api: ApiPromise): Promise<void> {
  const [systemChain, systemChainType, systemName, systemVersion] = await Promise.all([
    api.rpc.system.chain(),
    api.rpc.system.chainType(),
    api.rpc.system.name(),
    api.rpc.system.version(),
  ]);
  console.log(`Chain: ${systemChain} (${systemChainType.toString()})`);
}

async function initRouter(api: ApiPromise, pools: PoolType[]): Promise<TradeRouter> {
  const poolService = new PolkadotApiPoolService(api);
  return new TradeRouter(poolService, { includeOnly: pools });
}

function initApi(
  api: ApiPromise,
  pools: PoolType[],
  onReady: (api: ApiPromise, router: TradeRouter) => void,
  onError: (error: unknown) => void
) {
  api
    .on('connected', () => console.log('API connected'))
    .on('disconnected', () => console.log('API disconnected'))
    .on('error', () => console.log('API error'))
    .on('ready', () => {
      console.log('API ready ✅');
      info(api);
      initRouter(api, pools)
        .then((router: TradeRouter) => {
          console.log('Router ready ✅');
          chainCursor.reset({
            api: api,
            router: router,
          });
          onReady(api, router);
        })
        .catch(onError);
    });
}

export async function createApi(
  apiUrl: string,
  pools: PoolType[],
  onReady: (api: ApiPromise, router: TradeRouter) => void,
  onError: (error: unknown) => void
) {
  try {
    const provider = new WsProvider(apiUrl);
    const api = new ApiPromise({
      provider: provider,
    });
    initApi(api, pools, onReady, onError);
  } catch (error) {
    onError(error);
  }
}

export async function useApi(
  api: ApiPromise,
  pools: PoolType[],
  onReady: (api: ApiPromise, router: TradeRouter) => void,
  onError: (error: unknown) => void
) {
  try {
    initApi(api, pools, onReady, onError);
  } catch (error) {
    onError(error);
  }
}
