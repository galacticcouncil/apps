import { CachingPoolService, TradeRouter } from '@galacticcouncil/sdk';
import { SubstrateApis } from '@galacticcouncil/xcm-core';
import { ApiPromise } from '@polkadot/api';

import { Ecosystem, ChainCursor } from './db';
import { readExternal } from './utils/external';

const logFmt = (log: string) => {
  console.log('%c' + log, 'background: #222; color: #bada55');
};

async function info(api: ApiPromise): Promise<void> {
  const [systemChain, systemChainType, coreVersion] = await Promise.all([
    api.rpc.system.chain(),
    api.rpc.system.chainType(),
    api.call.core.version(),
  ]);
  const specName = api.runtimeVersion.specName.toString();
  const specVersion = api.runtimeVersion.specVersion.toString();
  logFmt(`Chain: ${systemChain} (${systemChainType.toString()})`);
  logFmt(`Runtime: ${specName} (${specVersion})`);
}

function initApi(
  api: ApiPromise,
  ecosystem: Ecosystem,
  onReady: (api: ApiPromise, router: TradeRouter) => void,
  isTestnet = false,
) {
  logFmt('API ready ✅');
  info(api);
  const poolService = new CachingPoolService(api);
  const router = new TradeRouter(poolService);
  // Get external assets
  const external = readExternal(isTestnet);
  // Get pools and cache the result
  poolService.syncRegistry(external).then(() => {
    logFmt('Router ready ✅');
    ChainCursor.reset({
      api: api,
      ecosystem: ecosystem,
      isTestnet: isTestnet,
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
  isTestnet = false,
) {
  try {
    const apiPool = SubstrateApis.getInstance();
    const api = await apiPool.api(apiUrl);
    initApi(api, ecosystem, onReady, isTestnet);
  } catch (error) {
    onError(error);
  }
}

export async function useApi(
  api: ApiPromise,
  ecosystem: Ecosystem,
  onReady: (api: ApiPromise, router: TradeRouter) => void,
  onError: (error: unknown) => void,
  isTestnet = false,
) {
  try {
    initApi(api, ecosystem, onReady, isTestnet);
  } catch (error) {
    onError(error);
  }
}
