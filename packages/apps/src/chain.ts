import {
  CachingPoolService,
  ExternalAsset,
  PoolService,
  TradeRouter,
} from '@galacticcouncil/sdk';
import { SubstrateApis } from '@galacticcouncil/xcm-core';
import { ApiPromise } from '@polkadot/api';
import { Ecosystem, ChainCursor, ExternalAssetCursor } from './db';

const logFmt = (log: string) => {
  console.log('%c' + log, 'background: #222; color: #bada55');
};

const readExternal = (): ExternalAsset[] | undefined => {
  const externalConfig = ExternalAssetCursor.deref();
  return externalConfig ? externalConfig.state.tokens : undefined;
};

async function info(api: ApiPromise): Promise<void> {
  const [systemChain, systemChainType, systemName, systemVersion] =
    await Promise.all([
      api.rpc.system.chain(),
      api.rpc.system.chainType(),
      api.rpc.system.name(),
      api.rpc.system.version(),
    ]);
  logFmt(`Chain: ${systemChain} (${systemChainType.toString()})`);
}

function initApi(
  api: ApiPromise,
  ecosystem: Ecosystem,
  onReady: (api: ApiPromise, router: TradeRouter) => void,
) {
  logFmt('API ready ✅');
  info(api);
  const poolService = new CachingPoolService(api);
  const router = new TradeRouter(poolService);
  // Get external assets
  const external = readExternal();
  // Get pools and cache the result
  poolService.syncRegistry(external).then(() => {
    logFmt('Router ready ✅');
    ChainCursor.reset({
      api: api,
      ecosystem: ecosystem,
      poolService: poolService,
      router: router,
    });
    onReady(api, router);
  });
}

export async function createApi(
  apiUrl: string,
  ecosystem: Ecosystem,
  onReady: (api: ApiPromise, router: TradeRouter) => void,
  onError: (error: unknown) => void,
) {
  try {
    const apiPool = SubstrateApis.getInstance();
    const api = await apiPool.api(apiUrl);
    initApi(api, ecosystem, onReady);
  } catch (error) {
    onError(error);
  }
}

export async function useApi(
  api: ApiPromise,
  ecosystem: Ecosystem,
  onReady: (api: ApiPromise, router: TradeRouter) => void,
  onError: (error: unknown) => void,
) {
  try {
    initApi(api, ecosystem, onReady);
  } catch (error) {
    onError(error);
  }
}

export async function syncRegistry(
  poolService: PoolService,
  onReady: () => void,
  onError: (error: unknown) => void,
) {
  try {
    const external = readExternal();
    const isSynced = external.every((ext) =>
      poolService.assets.find((a) => a.symbol === ext.symbol),
    );
    if (isSynced) {
      onReady();
    } else {
      poolService.syncRegistry(external).then(() => onReady());
    }
  } catch (error) {
    onError(error);
  }
}
