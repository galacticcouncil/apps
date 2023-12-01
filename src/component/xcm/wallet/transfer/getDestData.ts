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

/**
 * Return destination chain fee
 *
 * @param transferConfig
 * @returns
 */
async function getDestinationFee(
  transferConfig: TransferConfig,
): Promise<AssetAmount> {
  const { source, destination } = transferConfig;
  const { config } = source;

  const { asset, amount } = config.destinationFee;

  const polkadot = await this.getPolkadotService(destination.chain);
  const decimals = await polkadot.getDecimals(asset);

  if (Number.isFinite(amount)) {
    return AssetAmount.fromAsset(asset, {
      amount: toBigInt(amount as number, decimals),
      decimals,
    });
  }

  const feeConfigBuilder = amount as FeeConfigBuilder;
  const feeConfig = feeConfigBuilder.build({
    api: polkadot.api,
    asset: polkadot.chain.getAssetId(asset),
  });
  const feeBalance = await feeConfig.call();
  return AssetAmount.fromAsset(asset, {
    amount: feeBalance,
    decimals,
  });
}
