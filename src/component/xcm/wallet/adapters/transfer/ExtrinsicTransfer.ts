import { ExtrinsicConfig } from '@moonbeam-network/xcm-builder';
import { AssetAmount } from '@moonbeam-network/xcm-types';

import { SubstrateService } from '../../substrate';
import { TransferProvider } from '../types';

export class ExtrinsicTransfer implements TransferProvider<ExtrinsicConfig> {
  readonly #substrate: SubstrateService;

  constructor(substrate: SubstrateService) {
    this.#substrate = substrate;
  }

  async getFee(
    address: string,
    amount: bigint,
    feeBalance: AssetAmount,
    config: ExtrinsicConfig,
  ): Promise<AssetAmount> {
    const fee = await this.#substrate.getFee(address, config);
    return feeBalance.copyWith({
      amount: fee,
    });
  }
}
