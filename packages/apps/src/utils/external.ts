import { HydrationConfigService } from '@galacticcouncil/xcm-cfg';

import { ExternalAssetCursor } from 'db';

export function readExternal(isTestnet: boolean) {
  const config = ExternalAssetCursor.deref();

  if (config) {
    const key = isTestnet ? 'testnet' : 'mainnet';
    return config.state.tokens[key];
  }
  return undefined;
}

export function configureExternal(
  isTestnet: boolean,
  configService: HydrationConfigService,
) {
  const externals = readExternal(isTestnet);
  configService.registerExternal(externals);
}
