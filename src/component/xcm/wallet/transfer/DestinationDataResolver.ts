import { FeeConfigBuilder } from '@moonbeam-network/xcm-builder';
import { ChainTransferConfig } from '@moonbeam-network/xcm-config';
import { AssetAmount } from '@moonbeam-network/xcm-types';
import { toBigInt } from '@moonbeam-network/xcm-utils';

import { EvmClient } from '../evm';
import { SubstrateService } from '../substrate';

import { DataResolver } from './DataResolver';

export class DestinationDataResolver extends DataResolver {
  constructor(evmClient: EvmClient, substrate: SubstrateService) {
    super(evmClient, substrate);
  }

  async getFee(transferConfig: ChainTransferConfig): Promise<AssetAmount> {
    const { config } = transferConfig;
    const { asset, amount } = config.destinationFee;
    const decimals = this.substrate.getDecimals(asset);

    if (Number.isFinite(amount)) {
      return AssetAmount.fromAsset(asset, {
        amount: toBigInt(amount as number, decimals),
        decimals,
      });
    }

    const feeConfigBuilder = amount as FeeConfigBuilder;
    const feeConfig = feeConfigBuilder.build({
      api: this.substrate.api,
      asset: this.substrate.chain.getAssetId(asset),
    });
    const feeBalance = await feeConfig.call();
    return AssetAmount.fromAsset(asset, {
      amount: feeBalance,
      decimals,
    });
  }

  async calculateMin(
    balance: AssetAmount,
    fee: AssetAmount,
    min: AssetAmount,
  ): Promise<AssetAmount> {
    const ed = this.substrate.existentialDeposit;
    const zero = balance.copyWith({
      amount: 0n,
    });
    const result = zero
      .toBig()
      .plus(balance.isSame(fee) ? fee.toBig() : 0n)
      .plus(
        balance.isSame(ed) && balance.toBig().lt(ed.toBig()) ? ed.toBig() : 0n,
      )
      .plus(balance.toBig().lt(min.toBig()) ? min.toBig() : 0n);

    return balance.copyWith({
      amount: BigInt(result.toFixed()),
    });
  }
}
