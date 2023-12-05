import { AssetAmount } from '@moonbeam-network/xcm-types';

import { XTokens } from '../../contracts';
import { TransferProvider } from '../types';

export class XTokensTransfer implements TransferProvider<XTokens> {
  async getFee(
    address: string,
    amount: bigint,
    feeBalance: AssetAmount,
    contract: XTokens,
  ): Promise<AssetAmount> {
    const fee = await contract.getFee(address, amount);
    return feeBalance.copyWith({
      amount: fee,
    });
  }
}
