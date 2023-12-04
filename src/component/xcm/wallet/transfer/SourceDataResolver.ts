import { ContractConfig, ExtrinsicConfig } from '@moonbeam-network/xcm-builder';
import { ChainTransferConfig } from '@moonbeam-network/xcm-config';
import { AnyChain, AssetAmount } from '@moonbeam-network/xcm-types';

import { EvmClient } from '../evm';
import { SubstrateService } from '../substrate';

import { DataResolver } from './DataResolver';

export class SourceDataResolver extends DataResolver {
  constructor(evmClient: EvmClient, substrate: SubstrateService) {
    super(evmClient, substrate);
  }

  async getFee(
    address: string,
    amount: bigint,
    feeBalance: AssetAmount,
    destAddress: string,
    destChain: AnyChain,
    destFee: AssetAmount,
    transferConfig: ChainTransferConfig,
  ): Promise<AssetAmount> {
    const config = await this.buildTransferData(
      amount,
      destAddress,
      destChain,
      destFee,
      transferConfig,
    );
    return this.balanceAdapter.getFee(address, amount, feeBalance, config);
  }

  async getFeeBalance(
    address: string,
    transferConfig: ChainTransferConfig,
  ): Promise<AssetAmount> {
    const { chain, config } = transferConfig;
    if (config.fee) {
      const feeAsset = config.fee.asset;
      const feeAssetId = chain.getBalanceAssetId(feeAsset);
      const feeBalanceConfig = config.fee.balance.build({
        address: address,
        asset: feeAssetId,
      });
      return this.balanceAdapter.getBalance(feeAsset, feeBalanceConfig);
    }
    return this.getBalance(address, transferConfig);
  }

  async calculateMax(
    balance: AssetAmount,
    fee: AssetAmount,
    min: AssetAmount,
  ): Promise<AssetAmount> {
    const ed = this.substrate.existentialDeposit;
    const result = balance
      .toBig()
      .minus(min.toBig())
      .minus(balance.isSame(ed) ? ed.toBig() : 0n)
      .minus(balance.isSame(fee) ? fee.toBig() : 0n);
    return balance.copyWith({
      amount: result.lt(0) ? 0n : BigInt(result.toFixed()),
    });
  }

  private async buildTransferData(
    amount: bigint,
    destAddress: string,
    destChain: AnyChain,
    destFee: AssetAmount,
    transferConfig: ChainTransferConfig,
  ): Promise<ExtrinsicConfig | ContractConfig> {
    const { config } = transferConfig;
    if (config.extrinsic) {
      return this.buildExtrinsic(
        amount,
        destAddress,
        destChain,
        destFee,
        transferConfig,
      );
    }

    if (config.contract) {
      return this.buildContract(
        amount,
        destAddress,
        destChain,
        destFee,
        transferConfig,
      );
    }
    throw new Error('Either contract or extrinsic must be provided');
  }

  private async buildExtrinsic(
    amount: bigint,
    destAddress: string,
    destChain: AnyChain,
    destFee: AssetAmount,
    transferConfig: ChainTransferConfig,
  ): Promise<ExtrinsicConfig> {
    const { chain, config } = transferConfig;
    const assetId = chain.getAssetId(config.asset);
    const feeAssetId = chain.getAssetId(destFee);

    const palletInstance = chain.getAssetPalletInstance(config.asset);
    return config.extrinsic.build({
      address: destAddress,
      amount: amount,
      asset: assetId,
      destination: destChain,
      fee: destFee.amount,
      feeAsset: feeAssetId,
      palletInstance: palletInstance,
      source: chain,
    });
  }

  private async buildContract(
    amount: bigint,
    destAddress: string,
    destChain: AnyChain,
    destFee: AssetAmount,
    transferConfig: ChainTransferConfig,
  ): Promise<ContractConfig> {
    const { chain, config } = transferConfig;

    const assetId = chain.getAssetId(config.asset);
    const feeAssetId = chain.getAssetId(destFee);

    return config.contract.build({
      address: destAddress,
      amount: amount,
      asset: assetId,
      destination: destChain,
      fee: destFee.amount,
      feeAsset: feeAssetId,
    });
  }
}
