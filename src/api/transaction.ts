import type { Transaction } from '@galacticcouncil/sdk';
import type { RuntimeDispatchInfo } from '@polkadot/types/interfaces';
import type { ISubmittableResult } from '@polkadot/types/types';
import { getWalletBySource } from '@talismn/connect-wallets';
import { Account, chainCursor } from '../db';

export async function getFeePaymentAsset(account: Account): Promise<string> {
  const api = chainCursor.deref().api;
  const feeAsset = await api.query.multiTransactionPayment.accountCurrencyMap(account.address);
  return feeAsset.toString();
}

export async function getPaymentInfo(transaction: Transaction, account: Account): Promise<RuntimeDispatchInfo> {
  const api = chainCursor.deref().api;
  const transactionExtrinsic = api.tx(transaction.hex);
  return await transactionExtrinsic.paymentInfo(account.address);
}

export async function signAndSend(
  transaction: Transaction,
  account: Account,
  onStatusChange: (status: ISubmittableResult) => void,
  onError: (error: unknown) => void
) {
  const api = chainCursor.deref().api;
  const transactionExtrinsic = api.tx(transaction.hex);
  const wallet = getWalletBySource(account.provider);
  await wallet.enable('test1');
  const nextNonce = await api.rpc.system.accountNextIndex(account.address);

  transactionExtrinsic
    .signAndSend(account.address, { signer: wallet.signer, nonce: nextNonce }, onStatusChange)
    .catch((error: any) => {
      onError(error);
    });
}
