import { Asset } from '@galacticcouncil/sdk';

const EXTERNAL_ASSETS_WHITELIST = [
  '1000021', // PINK
  '1000034', // STINK
  '1000085', // WUD
  '1000082', // WIFD
  '1000091', // BNDT
  '1000148', // BORK
];

/**
 * Check if external asset is whitelisted
 *
 * @param asset - asset
 * @returns true if asset whitelisted, otherwise false
 */
export const isExternalAssetWhitelisted = (asset: Asset) => {
  return asset.type === 'External'
    ? EXTERNAL_ASSETS_WHITELIST.includes(asset.id)
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

/**
 * Build cross-chain asset key
 *
 * @param asset - chain asset
 * @returns - key representation of asset in xcm config
 */
export function getXcmKey(asset: Asset) {
  if (asset.origin === 2004) {
    return asset.symbol.toLowerCase() + '_mwh';
  } else if (asset.origin === 2000) {
    return asset.symbol.toLowerCase() + '_awh';
  } else {
    return asset.symbol.toLowerCase();
  }
}
