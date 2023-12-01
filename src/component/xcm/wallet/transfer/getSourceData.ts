import {
  CallType,
  ContractConfig,
  ExtrinsicConfig,
  FeeConfigBuilder,
  SubstrateQueryConfig,
} from '@moonbeam-network/xcm-builder';
import {
  AssetConfig,
  ConfigBuilder,
  ChainConfig,
  IConfigService,
  TransferConfig,
} from '@moonbeam-network/xcm-config';
import {
  Sdk,
  getSourceData,
  SdkTransferParams,
  TransferData,
} from '@moonbeam-network/xcm-sdk';
import { Asset, AnyChain, AssetAmount } from '@moonbeam-network/xcm-types';
import {
  convertDecimals,
  getPolkadotApi,
  toBigInt,
} from '@moonbeam-network/xcm-utils';

type BalanceFn = (
  asset: Asset,
  chain: AnyChain,
  config: ContractConfig | SubstrateQueryConfig,
) => Promise<AssetAmount>;

/**
 * Return source chain asset balance
 *
 * @param address
 * @param transferConfig
 * @returns
 */
export async function getAssetBalance(
  address: string,
  transferConfig: TransferConfig,
  getBalance: BalanceFn,
): Promise<AssetAmount> {
  const { source, asset } = transferConfig;
  const { chain } = source;

  const assetId = chain.getBalanceAssetId(asset);
  const balanceConfig = source.config.balance.build({
    address: address,
    asset: assetId,
  });
  return getBalance(asset, chain, balanceConfig);
}

/**
 * Return source chain fee balance
 *
 * @param address
 * @param transferConfig
 * @returns
 */
export async function getFeeBalance(
  address: string,
  transferConfig: TransferConfig,
  getBalance: BalanceFn,
): Promise<AssetAmount> {
  const { source, asset } = transferConfig;
  const { chain } = source;

  const assetId = chain.getBalanceAssetId(asset);
  const feeConfig = source.config.fee;

  const feeBalanceConfig = feeConfig.balance.build({
    address: address,
    asset: assetId,
  });
  const feeAsset = feeConfig.asset;
  return getBalance(feeAsset, chain, feeBalanceConfig);
}

// private async getMin(config: AssetConfig, chain: AnyChain): Promise<bigint> {
//   const { asset } = config;
//   if (config.min) {
//     const minAssetId = chain.getMinAssetId(asset);
//     const minConfig = config.min.build({
//       asset: minAssetId,
//     });
//     const balance = await this.getSubstrateBalance(asset, chain, minConfig);
//     return balance.balance;
//   }

//   const min = chain.getAssetMin(config.asset);
//   if (min) {
//     return toBigInt(min, 12);
//   }
//   return 0n;
// }

// private async getFee(config: AssetConfig, chain: AnyChain): Promise<bigint> {
//   if (config.min) {
//     const minAssetId = chain.getMinAssetId(config.asset);
//     const cfg = config.min.build({
//       asset: minAssetId,
//     });
//     const balance = await this.getSubstrateBalance(config.asset, chain, cfg);
//     return balance.balance;
//   }

//   const min = chain.getAssetMin(config.asset);
//   if (min) {
//     return toBigInt(min, 12);
//   }
//   return 0n;
// }
