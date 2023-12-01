import { AssetConfig } from '@moonbeam-network/xcm-config';
import { AnyChain } from '@moonbeam-network/xcm-types';

function buildBalanceConfig(
  srcAddr: string,
  srcChain: AnyChain,
  assetConfig: AssetConfig,
) {
  const { asset } = assetConfig;
  const assetId = srcChain.getBalanceAssetId(asset);
  const config = assetConfig.balance.build({
    address: srcAddr,
    asset: assetId,
  });
  return { key: asset.key, config };
}
