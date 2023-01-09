import type { AssetMetadata } from '@polkadot/types/interfaces';
import { Amount, PoolAsset, SYSTEM_ASSET_ID } from '@galacticcouncil/sdk';
import { getAccountBalance } from './balance';
import { chainCursor } from '../db';
import { pairs2Map } from '../utils/mapper';

export type AssetDetail = {
  name: string;
  assetType: string;
  existentialDeposit: string;
  locked: boolean;
};

export async function getAssetDetail(assetId: string): Promise<AssetDetail> {
  const api = chainCursor.deref().api;
  if (assetId == SYSTEM_ASSET_ID) {
    const defaultAsset = api.registry.chainTokens[0];
    const defaultAssetEd = api.consts.balances.existentialDeposit;
    return {
      name: defaultAsset,
      assetType: 'Token',
      existentialDeposit: defaultAssetEd.toString(),
      locked: false,
    } as AssetDetail;
  }

  const asset = await api.query.assetRegistry.assets(assetId);
  const assetHuman = asset.toHuman() as unknown as AssetDetail;
  assetHuman['existentialDeposit'] = assetHuman.existentialDeposit.replaceAll(',', '');
  return assetHuman;
}

export async function getAssetsDetail(assets: PoolAsset[]) {
  const details: [string, AssetDetail][] = await Promise.all(
    assets.map(async (asset: PoolAsset) => [asset.id, await getAssetDetail(asset.id)])
  );
  return pairs2Map(details);
}

export async function getAssetsBalance(address: string, assets: PoolAsset[]) {
  const balances: [string, Amount][] = await Promise.all(
    assets.map(async (asset: PoolAsset) => [asset.id, await getAccountBalance(address, asset.id)])
  );
  return pairs2Map(balances);
}

export async function getAssetsDollarPrice(assets: PoolAsset[], stableCoinAssetId: string) {
  const router = chainCursor.deref().router;
  const dolarPrices: [string, Amount][] = await Promise.all(
    assets.map(async (asset: PoolAsset) => [asset.id, await router.getBestSpotPrice(asset.id, stableCoinAssetId)])
  );
  return pairs2Map(dolarPrices);
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
