import type { AssetMetadata } from '@polkadot/types/interfaces';
import { Amount, PoolAsset } from '@galacticcouncil/sdk';
import { getAccountBalance } from './balance';
import { chainCursor } from '../db';
import { pairs2Map } from '../utils/mapper';

export async function getAssetsBalance(address: string, assets: PoolAsset[]) {
  const balances: [string, Amount][] = await Promise.all(
    assets.map(async (asset: PoolAsset) => [asset.id, await getAccountBalance(address, asset.id)])
  );
  return pairs2Map(balances);
}

export async function getAssetsPairs(assets: PoolAsset[]) {
  const router = chainCursor.deref().router;
  const pairs: [string, PoolAsset[]][] = await Promise.all(
    assets.map(async (asset: PoolAsset) => [asset.id, await router.getAssetPairs(asset.id)])
  );
  return pairs2Map(pairs);
}

export async function getAssetMetadata(assetId: string): Promise<AssetMetadata> {
  const api = chainCursor.deref().api;
  return await api.query.assetRegistry.assetMetadataMap<AssetMetadata>(assetId);
}
