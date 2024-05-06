import { AccountCursor, XApproveStoreCursor } from './db';

export class XStoreUtils {
  get account() {
    return AccountCursor.deref();
  }

  get store() {
    return XApproveStoreCursor.deref();
  }

  get transactions(): string[] {
    const { address } = this.account;
    return this.store[address] || [];
  }

  add(hash: string): void {
    console.log('Storing approve TX: ' + hash);
    const { address } = this.account;
    XApproveStoreCursor.resetIn([address], this.transactions.concat(hash));
  }

  remove(hash: string): void {
    console.log('Removing approve TX: ' + hash);
    const { address } = this.account;
    const txClone = [...this.transactions];
    const txIndex = txClone.indexOf(hash, 0);
    if (txIndex > -1) {
      txClone.splice(txIndex, 1);
      XApproveStoreCursor.resetIn([address], txClone);
    }
  }
}
