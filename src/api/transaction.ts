import type { Transaction } from '@galacticcouncil/sdk';
import type { RuntimeDispatchInfo } from '@polkadot/types/interfaces';
import type { ISubmittableResult } from '@polkadot/types/types';
import { SubmittableExtrinsic } from '@polkadot/api/promise/types';
import { getWalletBySource } from '@talismn/connect-wallets';
import { Account, chainCursor } from '../db';

export async function getPaymentInfo(transaction: Transaction, account: Account): Promise<RuntimeDispatchInfo> {
  const api = chainCursor.deref().api;
  const transactionExtrinsic = api.tx(transaction.hex);
  return await transactionExtrinsic.paymentInfo(account.address);
}

export async function signAndSendTx(
  transaction: Transaction,
  account: Account,
  onStatusChange: (status: ISubmittableResult) => void,
  onError: (error: unknown) => void
) {
  const api = chainCursor.deref().api;
  const transactionExtrinsic = api.tx(transaction.hex);
  signAndSend(transactionExtrinsic, account, onStatusChange, onError);
}

export async function signAndSend(
  extrinsic: SubmittableExtrinsic,
  account: Account,
  onStatusChange: (status: ISubmittableResult) => void,
  onError: (error: unknown) => void
) {
  const wallet = getWalletBySource(account.provider);
  await wallet.enable('test1');
  console.log(extrinsic);
  extrinsic.signAndSend(account.address, { signer: wallet.signer }, onStatusChange).catch((error: any) => {
    onError(error);
  });
}

export async function signAndSendOb(
  extrinsic: SubmittableExtrinsic,
  account: Account,
  onStatusChange: (status: ISubmittableResult) => void,
  onError: (error: unknown) => void
) {
  const wallet = getWalletBySource(account.provider);
  await wallet.enable('test1');
  const o: any = extrinsic.signAndSend(account.address, { signer: wallet.signer });
  o.subscribe({
    next: onStatusChange,
    error: (err: any) => onError(err),
    complete: () => console.log('Observer got a complete notification'),
  });
}
