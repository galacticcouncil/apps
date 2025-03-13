import { Asset } from '@galacticcouncil/sdk';
import { ChainCursor } from 'db';

const A_TOKEN_UNDERLYING_ID_MAP_MAINNET: { [key: string]: string } = {
  // aDOT
  '1001': '5',
  // aUSDT
  '1002': '10',
  // aUSDC
  '1003': '22',
  // aWBTC
  '1004': '19',
  //avDOT
  '1005': '15',
};

export const A_TOKEN_UNDERLYING_ID_MAP_TESTNET: { [key: string]: string } = {
  // aDOT
  '1000037': '5',
  // aUSDT
  '1000039': '10',
  // aUSDC
  '1000038': '21',
  // aWBTC
  '1000040': '3',
  // aWETH
  '1000041': '20',
  //avDOT
  '1005': '15',
};

/**
 * Check if asset is aToken
 *
 * @param asset - asset
 * @returns true if asset is aToken, otherwise false
 */
export const isAToken = (asset: Asset, isTestnet = false) => {
  return asset.type === 'Erc20' && isTestnet
    ? !!A_TOKEN_UNDERLYING_ID_MAP_TESTNET[asset.id]
    : !!A_TOKEN_UNDERLYING_ID_MAP_MAINNET[asset.id];
};

export const getATokenUnderlyingAssetId = (asset: Asset, isTestnet = false) => {
  if (!isAToken(asset, isTestnet)) return;
  return isTestnet
    ? A_TOKEN_UNDERLYING_ID_MAP_TESTNET[asset.id]
    : A_TOKEN_UNDERLYING_ID_MAP_MAINNET[asset.id];
};

/**
 * Check if external asset is whitelisted
 *
 * @param whitelist - asset whitelist
 * @param asset - asset
 * @returns true if asset whitelisted, otherwise false
 */
export const isExternalAssetWhitelisted = (
  whitelist: string[],
  asset: Asset,
) => {
  return asset.type === 'External'
    ? whitelist.includes(asset.id) || !!asset.isWhiteListed
    : true;
};

/**
 * Check if assetIn allowed.
 * Criteria: Have at least 1 pair with any tokenOut
 *
 * @param assets - all assets
 * @param pairs - asset pairs
 * @param assetIn - asset in
 * @returns true if asset allowed, otherwise false
 */
export function isAssetInAllowed(
  assets: Asset[],
  pairs: Map<string, Asset[]>,
  assetIn: string,
) {
  const allowed = assets
    .filter((asset: Asset) => {
      const assetPairs = pairs.get(asset.id);
      return assetPairs.length !== 0;
    })
    .map((asset: Asset) => asset.id);
  return new Set(allowed).has(assetIn);
}

/**
 * Check if assetOut allowed.
 * Criteria: Have at least 1 pair with any tokenIn
 *
 * @param assets - all assets
 * @param pairs - asset pairs
 * @param assetOut - asset out
 * @returns true if asset allowed, otherwise false
 */
export function isAssetOutAllowed(
  assets: Asset[],
  pairs: Map<string, Asset[]>,
  assetOut: string,
) {
  const unique: Map<string, Asset> = new Map([]);
  const allDests = assets.map((asset: Asset) => pairs.get(asset.id)).flat();
  allDests.forEach((asset: Asset) => {
    unique.set(asset.id, asset);
  });
  const allowed = Array.from(unique.values()).map((asset: Asset) => asset.id);
  return new Set(allowed).has(assetOut);
}
