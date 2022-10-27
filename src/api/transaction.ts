import type { Transaction } from '@galacticcouncil/sdk';
import type { RuntimeDispatchInfo } from '@polkadot/types/interfaces';
import { getWalletBySource } from '@talismn/connect-wallets';
import { Account, chainCursor } from '../db';

export async function getPaymentInfo(transaction: Transaction, account: Account): Promise<RuntimeDispatchInfo> {
  const api = chainCursor.deref().api;
  const transactionExtrinsic = api.tx(transaction.hex);
  return await transactionExtrinsic.paymentInfo(account.address);
}

export async function signAndSend(transaction: Transaction, account: Account) {
  const api = chainCursor.deref().api;
  const transactionExtrinsic = api.tx(transaction.hex);
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
