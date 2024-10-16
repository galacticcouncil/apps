import { ExternalAsset } from '@galacticcouncil/sdk';
import { HydrationConfigService } from '@galacticcouncil/xcm-cfg';
import { Asset, ChainAssetData } from '@galacticcouncil/xcm-core';

import { ExternalAssetCursor } from 'db';

const defaultExternals = [
  '18', // DOTA
  '23', // PINK
  '30', // DED
  '31337', // WUD
];

export function configureExternal(
  isTestnet: boolean,
  configService: HydrationConfigService,
) {
  readExternal(isTestnet)?.forEach((ext) => {
    if (ext.origin === 1000 && !defaultExternals.includes(ext.id)) {
      const assetData = buildAssetData(ext);
      console.log('💀 Registering ' + assetData.asset.key);
      configService.addExternalHubRoute(assetData);
    }
  });
}

export function readExternal(isTestnet: boolean) {
  const config = ExternalAssetCursor.deref();

  if (config) {
    const key = isTestnet ? 'testnet' : 'mainnet';
    return config.state.tokens[key];
  }
  return undefined;
}

export function buildAssetData(external: ExternalAsset): ChainAssetData {
  const { decimals, id, symbol, internalId } = external;

  const key = symbol.toLowerCase();
  const asset = new Asset({
    key: [key, external.origin, id].join('_'),
    originSymbol: symbol,
  });

  return {
    asset: asset,
    balanceId: internalId,
    decimals: decimals,
    id: id,
    palletInstance: 50,
  } as ChainAssetData;
}
