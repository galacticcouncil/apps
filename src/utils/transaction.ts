import { Transaction } from '@galacticcouncil/sdk';
import { SubmittableExtrinsic } from '@polkadot/api/promise/types';

export async function getTransactionFee(transaction: Transaction, account: string): Promise<string> {
  const transactionExtrinsic = transaction.get<SubmittableExtrinsic>();
  const { partialFee } = await transactionExtrinsic.paymentInfo(account);
  return partialFee.toHuman();
}
