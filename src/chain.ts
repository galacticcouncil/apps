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

async function initRouter(api: ApiPromise): Promise<TradeRouter> {
  const poolService = new PolkadotApiPoolService(api);
  return new TradeRouter(poolService, { includeOnly: [PoolType.XYK] });
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
        info(api);
        initRouter(api)
          .then((router: TradeRouter) => {
            console.log('Router ready');
            chainCursor.reset({
              api: api,
              router: router,
              url: apiUrl,
            });
          })
          .catch(onError);
      });

    return () => api.disconnect();
  } catch (error) {
    onError(error);
  }

  return null;
}
