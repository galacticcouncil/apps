import { AccountCursor, XStoreCursor } from './db';
import { XItem } from './types';

export class XStoreUtils {
  get account() {
    return AccountCursor.deref();
  }

  get store() {
    return XStoreCursor.deref();
  }

  get transactions(): XItem[] {
    const { address } = this.account;
    return this.store[address] || [];
  }

  add(tx: XItem): void {
    console.log('Storing approve TX: ' + tx.hash);
    const { address } = this.account;
    XStoreCursor.resetIn([address], this.transactions.concat(tx));
  }

  remove(hash: string): void {
    console.log('Removing approve TX: ' + hash);
    const { address } = this.account;
    const txClone = [...this.transactions];
    const txIndex = txClone.findIndex((tx) => tx.hash === hash);
    if (txIndex > -1) {
      txClone.splice(txIndex, 1);
      XStoreCursor.resetIn([address], txClone);
    }
  }
}
