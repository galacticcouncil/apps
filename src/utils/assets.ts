import { PoolAsset } from '@galacticcouncil/sdk';

export function pairsById(pairs: [string, PoolAsset[]][]): Map<string, PoolAsset[]> {
  const result = new Map<string, PoolAsset[]>();
  pairs.forEach((pair: [string, PoolAsset[]]) => result.set(pair[0], pair[1]));
  return result;
}

export function assetsById(assets: PoolAsset[]): Map<string, PoolAsset> {
  return new Map<string, PoolAsset>(assets.map((i) => [i.id, i]));
}
