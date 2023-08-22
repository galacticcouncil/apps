import { PoolAsset } from '@galacticcouncil/sdk';

/**
 * Check if assetIn allowed.
 * Criteria: Have at least 1 pair with any tokenOut
 *
 * @param assets - all assets
 * @param pairs - asset pairs
 * @param assetIn - asset in
 * @returns true if asset allowed, otherwise false
 */
export function isAssetInAllowed(assets: PoolAsset[], pairs: Map<string, PoolAsset[]>, assetIn: string) {
  const allowed = assets
    .filter((asset: PoolAsset) => {
      const assetPairs = pairs.get(asset.id);
      return assetPairs.length !== 0;
    })
    .map((asset: PoolAsset) => asset.id);
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
export function isAssetOutAllowed(assets: PoolAsset[], pairs: Map<string, PoolAsset[]>, assetOut: string) {
  const unique: Map<string, PoolAsset> = new Map([]);
  const allDests = assets.map((asset: PoolAsset) => pairs.get(asset.id)).flat();
  allDests.forEach((asset: PoolAsset) => {
    unique.set(asset.id, asset);
  });
  const allowed = Array.from(unique.values()).map((asset: PoolAsset) => asset.id);
  return new Set(allowed).has(assetOut);
}