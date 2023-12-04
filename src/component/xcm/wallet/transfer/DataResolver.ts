import { ChainTransferConfig } from '@moonbeam-network/xcm-config';
import { AssetAmount } from '@moonbeam-network/xcm-types';
import { toBigInt } from '@moonbeam-network/xcm-utils';

import { BalanceAdapter } from '../balance';
import { EvmClient } from '../evm';
import { SubstrateService } from '../substrate';

export class DataResolver {
  protected balanceAdapter: BalanceAdapter;
  protected substrate: SubstrateService;

  constructor(evmClient: EvmClient, substrate: SubstrateService) {
    this.balanceAdapter = new BalanceAdapter({ evmClient, substrate });
    this.substrate = substrate;
  }

  async getBalance(
    address: string,
    transferConfig: ChainTransferConfig,
  ): Promise<AssetAmount> {
    const { chain, config } = transferConfig;
    const asset = config.asset;
    const assetId = chain.getBalanceAssetId(asset);
    const balanceConfig = config.balance.build({
      address: address,
      asset: assetId,
    });
    return this.balanceAdapter.getBalance(asset, balanceConfig);
  }

  async getMin(transferConfig: ChainTransferConfig): Promise<AssetAmount> {
    const { chain, config } = transferConfig;
    const asset = config.asset;
    if (config.min) {
      const minAssetId = chain.getMinAssetId(asset);
      const minBalanceConfig = config.min.build({
        asset: minAssetId,
      });
      return this.balanceAdapter.getBalance(asset, minBalanceConfig);
    }
    return this.getAssetMin(transferConfig);
  }

  async getAssetMin(transferConfig: ChainTransferConfig): Promise<AssetAmount> {
    const { chain, config } = transferConfig;
    const asset = config.asset;
    const assetMin = chain.getAssetMin(asset);
    const decimals = this.substrate.getDecimals(asset);

    let balance: bigint = 0n;
    if (assetMin) {
      balance = toBigInt(assetMin, decimals);
    }

    return AssetAmount.fromAsset(asset, {
      amount: balance,
      decimals: decimals,
    });
  }
}
