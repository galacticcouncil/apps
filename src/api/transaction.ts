import { getWalletBySource } from '@talismn/connect-wallets';
import type { Transaction } from '@galacticcouncil/sdk';
import type { SubmittableExtrinsic } from '@polkadot/api/promise/types';
import type { RuntimeDispatchInfo } from '@polkadot/types/interfaces';
import type { ISubmittableResult } from '@polkadot/types/types';
import type { Account } from '../db';

export async function getPaymentInfo(transaction: Transaction, account: Account): Promise<RuntimeDispatchInfo> {
  const transactionExtrinsic = transaction.get<SubmittableExtrinsic>();
  return await transactionExtrinsic.paymentInfo(account.address);
}

export async function signAndSend(transaction: Transaction, account: Account) {
  const transactionExtrinsic = transaction.get<SubmittableExtrinsic>();
  const wallet = getWalletBySource(account.provider);
  await wallet.enable('test1');

  transactionExtrinsic
    .signAndSend(account.address, { signer: wallet.signer }, ({ status }) => {
      if (status.isInBlock) {
        console.log(`Completed at block hash #${status.asInBlock.toString()}`);
      } else {
        console.log(`Current status: ${status.type}`);
      }
    })
    .catch((error: any) => {
      console.log(':( transaction failed', error);
    });
}
