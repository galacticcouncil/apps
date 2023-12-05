import { AssetAmount } from '@moonbeam-network/xcm-types';

export interface TransferInput {
  balance: AssetAmount;
  max: AssetAmount;
  min: AssetAmount;
  srcFee: AssetAmount;
  destFee: AssetAmount;
  // swap(amount: bigint | number | string): Promise<string>;
  // calldata(amount: bigint | number | string): Promise<string>;
}
