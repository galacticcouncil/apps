import {
  BaseConfig,
  CallType,
  ContractConfig,
  ExtrinsicConfig,
} from '@moonbeam-network/xcm-builder';
import { AssetAmount } from '@moonbeam-network/xcm-types';

import { ExtrinsicTransfer } from './ExtrinsicTransfer';
import { XTokensTransfer } from './XTokensTransfer';

import { XTokens } from '../../contracts';
import { EvmClient } from '../../evm';
import { SubstrateService } from '../../substrate';

export type TransferOptions = {
  evmClient?: EvmClient;
  substrate: SubstrateService;
};

export class TransferAdapter {
  protected evmClient: EvmClient;
  protected substrate: SubstrateService;

  private extrinsicTransfer: ExtrinsicTransfer;
  private xTokensTransfer: XTokensTransfer;

  constructor({ evmClient, substrate }: TransferOptions) {
    this.substrate = substrate;
    this.extrinsicTransfer = new ExtrinsicTransfer(substrate);

    if (evmClient) {
      this.evmClient = evmClient;
      this.xTokensTransfer = new XTokensTransfer();
    }
  }

  async getFee(
    address: string,
    amount: bigint,
    feeBalance: AssetAmount,
    config: BaseConfig,
  ): Promise<AssetAmount> {
    if (config.type === CallType.Evm) {
      const contract = new XTokens(this.evmClient, config as ContractConfig);
      return this.xTokensTransfer.getFee(address, amount, feeBalance, contract);
    }

    return this.extrinsicTransfer.getFee(
      address,
      amount,
      feeBalance,
      config as ExtrinsicConfig,
    );
  }
}
