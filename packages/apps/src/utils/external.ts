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
  readExternal(isTestnet)?.forEach((ext) => {
    if (ext.origin === 1000 && !defaultExternals.includes(ext.id)) {
      const hubAsset = toHubAsset(ext);
      const parachainAsset = toParachainAsset(ext);

      console.log('💀 Registering ' + hubAsset.asset.key);
      configService.addExternalHubRoute(hubAsset, parachainAsset);
    }
  });
}

function toHubAsset(external: ExternalAsset): ChainAssetData {
  const { decimals, id, origin, symbol } = external;
  const key = symbol.toLowerCase();
  const asset = new Asset({
    key: [key, origin, id].join('_'),
    originSymbol: symbol,
  });

  return {
    asset: asset,
    decimals: decimals,
    id: id,
    xcmLocation: {
      parents: 0,
      interior: {
        X2: [
          {
            PalletInstance: 50,
          },
          {
            GeneralIndex: id,
          },
        ],
      },
    },
  } as ChainAssetData;
}

function toParachainAsset(external: ExternalAsset): ChainAssetData {
  const { decimals, id, internalId, origin, symbol } = external;
  const key = symbol.toLowerCase();
  const asset = new Asset({
    key: [key, origin, id].join('_'),
    originSymbol: symbol,
  });

  return {
    asset: asset,
    decimals: decimals,
    id: internalId,
    xcmLocation: {
      parents: 1,
      interior: {
        X3: [
          {
            Parachain: origin,
          },
          {
            PalletInstance: 50,
          },
          {
            GeneralIndex: id,
          },
        ],
      },
    },
  } as ChainAssetData;
}
