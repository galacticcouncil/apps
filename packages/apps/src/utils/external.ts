import { ExternalAsset } from '@galacticcouncil/sdk';
import { external } from '@galacticcouncil/xcm-cfg';
import {
  Asset,
  ChainAssetData,
  ConfigService,
} from '@galacticcouncil/xcm-core';

import { ExternalAssetCursor } from 'db';

const defaultExternals = [
  '18', // DOTA
  '23', // PINK
  '30', // DED
];

export function configureExternal(
  isTestnet: boolean,
  configService: ConfigService,
) {
  readExternal(isTestnet)?.forEach((ext) => {
    if (ext.origin === 1000 && !defaultExternals.includes(ext.id)) {
      const assetData = buildAssetData(ext, '_ah_');
      console.log('💀 Registering ' + assetData.asset.key);
      buildAssethubConfig(assetData, configService);
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

function buildAssetData(
  external: ExternalAsset,
  suffix: string,
): ChainAssetData {
  const { decimals, id, symbol, internalId } = external;

  const key = symbol.toLowerCase();
  const asset = new Asset({
    key: key + suffix + id,
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

function buildAssethubConfig(
  assetData: ChainAssetData,
  configService: ConfigService,
) {
  const assethub = configService.getChain('assethub');
  const hydration = configService.getChain('hydradx');
  const { balanceId, ...base } = assetData;

  assethub.updateAsset(base);
  hydration.updateAsset(assetData);

  configService.updateAsset(assetData.asset);
  configService.updateChainAssetConfig(
    assethub,
    external.fromAhTemplate(assetData),
  );
  configService.updateChainAssetConfig(
    hydration,
    external.toAhTemplate(assetData),
  );
}
