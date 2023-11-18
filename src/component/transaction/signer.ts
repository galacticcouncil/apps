import { Transaction } from '@galacticcouncil/sdk';
import type { ISubmittableResult } from '@polkadot/types/types';
import { SubmittableExtrinsic } from '@polkadot/api/promise/types';
import { getWalletBySource } from '@talismn/connect-wallets';

import { Account, chainCursor } from '../../db';

export async function signAndSend(
  transaction: Transaction,
  account: Account,
  onStatusChange: (status: ISubmittableResult) => void,
  onError: (error: unknown) => void,
) {
  const api = chainCursor.deref().api;
  const transactionExtrinsic = api.tx(transaction.hex);
  const wallet = getWalletBySource(account.provider);
  await wallet.enable('HydraDX');
  const nextNonce = await api.rpc.system.accountNextIndex(account.address);

  transactionExtrinsic
    .signAndSend(
      account.address,
      { signer: wallet.signer, nonce: nextNonce },
      onStatusChange,
    )
    .catch((error: any) => {
      onError(error);
    });
}

export async function signAndSendOb(
  extrinsic: SubmittableExtrinsic,
  account: Account,
  onStatusChange: (status: ISubmittableResult) => void,
  onError: (error: unknown) => void,
) {
  const wallet = getWalletBySource(account.provider);
  await wallet.enable('HydraDX');

  const o: any = extrinsic.signAndSend(account.address, {
    signer: wallet.signer,
  });
  o.subscribe({
    next: onStatusChange,
    error: (err: any) => onError(err),
    complete: () => console.log('Observer got a complete notification'),
  });
}
