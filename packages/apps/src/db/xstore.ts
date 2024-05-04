import { AccountCursor, XApproveStoreCursor } from './db';

export class XStoreUtils {
  static transactions(): string[] {
    const { address } = AccountCursor.deref();
    const store = XApproveStoreCursor.deref();
    return store[address] || [];
  }

  static add(hash: string): void {
    console.log('Storing approve TX: ' + hash);
    const { address } = AccountCursor.deref();
    const txs = XStoreUtils.transactions();
    XApproveStoreCursor.resetIn([address], txs.concat(hash));
  }

  static remove(hash: string): void {
    console.log('Removing approve TX: ' + hash);
    const { address } = AccountCursor.deref();
    const txs = XStoreUtils.transactions();
    const txsClone = [...txs];
    const txIndex = txsClone.indexOf(hash, 0);
    if (txIndex > -1) {
      txsClone.splice(txIndex, 1);
      XApproveStoreCursor.resetIn([address], txsClone);
    }
  }
}
