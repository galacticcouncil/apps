import { createSdkContext, SdkCtx } from '@galacticcouncil/sdk';
import { SubstrateApis } from '@galacticcouncil/xcm-core';
import { ApiPromise } from '@polkadot/api';

import { Ecosystem, ChainCursor, Chain } from './db';
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
  onReady: (api: ApiPromise, sdk: SdkCtx) => void,
  isTestnet = false,
  unifiedAddressFormat = false,
) {
  logFmt('API ready ✅');
  info(api);

  const sdk = createSdkContext(api);
  const { ctx } = sdk;

  const external = readExternal(isTestnet);
  // Get pools and cache the result
  ctx.pool.syncRegistry(external).then(() => {
    logFmt('Router ready ✅');
    ChainCursor.reset({
      api: api,
      ecosystem: ecosystem,
      isTestnet: isTestnet,
      unifiedAddressFormat: unifiedAddressFormat,
      sdk: sdk,
    });
    onReady(api, sdk);
  });
}

export async function createApi(
  apiUrl: string,
  ecosystem: Ecosystem,
  onReady: (api: ApiPromise, sdk: SdkCtx) => void,
  onError: (error: unknown) => void,
  isTestnet = false,
  unifiedAddressFormat = false,
) {
  try {
    const apiPool = SubstrateApis.getInstance();
    const api = await apiPool.api(apiUrl);
    initApi(api, ecosystem, onReady, isTestnet, unifiedAddressFormat);
  } catch (error) {
    onError(error);
  }
}

export async function useApi(
  api: ApiPromise,
  ecosystem: Ecosystem,
  onReady: (api: ApiPromise, sdk: SdkCtx) => void,
  onError: (error: unknown) => void,
  isTestnet = false,
) {
  try {
    initApi(api, ecosystem, onReady, isTestnet);
  } catch (error) {
    onError(error);
  }
}

export async function createChainCtx(
  apiUrl: string,
  ecosystem: Ecosystem,
): Promise<Chain> {
  const apiPool = SubstrateApis.getInstance();
  const api = await apiPool.api(apiUrl);
  const sdk = createSdkContext(api);
  return {
    api: api,
    sdk: sdk,
    ecosystem: ecosystem,
    isTestnet: false,
    unifiedAddressFormat: false,
  };
}
