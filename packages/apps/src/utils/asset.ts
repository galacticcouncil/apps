import { Asset } from '@galacticcouncil/sdk';

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

export function isSellOnly(asset: Asset) {
  const isLrna = asset?.id === '1' && asset?.symbol.toLowerCase() === 'h2o';
  const isGdotShare =
    asset?.id === '690' && asset?.symbol.toLowerCase() === '2-pool-gdot';
  return isLrna || isGdotShare;
}
