import { PoolToken } from '@galacticcouncil/sdk';

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
  assets: PoolToken[],
  pairs: Map<string, PoolToken[]>,
  assetIn: string,
) {
  const allowed = assets
    .filter((asset: PoolToken) => {
      const assetPairs = pairs.get(asset.id);
      return assetPairs.length !== 0;
    })
    .map((asset: PoolToken) => asset.id);
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
  assets: PoolToken[],
  pairs: Map<string, PoolToken[]>,
  assetOut: string,
) {
  const unique: Map<string, PoolToken> = new Map([]);
  const allDests = assets.map((asset: PoolToken) => pairs.get(asset.id)).flat();
  allDests.forEach((asset: PoolToken) => {
    unique.set(asset.id, asset);
  });
  const allowed = Array.from(unique.values()).map(
    (asset: PoolToken) => asset.id,
  );
  return new Set(allowed).has(assetOut);
}
