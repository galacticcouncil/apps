import { property } from 'lit/decorators.js';

import short from 'short-uuid';

import { Account, AccountCursor, DatabaseController, Ecosystem } from 'db';
import { isEvmAccount } from 'utils/evm';
import { BaseElement } from 'element/BaseElement';

export abstract class BaseApp extends BaseElement {
  protected account = new DatabaseController<Account>(this, AccountCursor);

  private watchId: string;

  @property({ type: String }) accountAddress: string = null;
  @property({ type: String }) accountProvider: string = null;
  @property({ type: String }) accountName: string = null;
  @property({ type: String }) ecosystem: Ecosystem = Ecosystem.Polkadot;
  @property({ type: Boolean }) isTestnet: boolean = false;
  @property({ type: String }) grafanaUrl: string = null;
  @property({ type: Number }) grafanaDsn: number = null;
  @property({ type: String }) indexerUrl: string = null;
  @property({ type: String }) squidUrl: string = null;

  constructor() {
    super();
    this.watchId = 'account-watch-' + short.generate();
  }

  protected abstract onAccountChange(
    prev: Account,
    curr: Account,
  ): Promise<void>;

  hasAccount(): boolean {
    return !!this.account.state;
  }

  hasEvmAccount(): boolean {
    if (this.hasAccount()) {
      const { address } = this.account.state;
      return isEvmAccount(address);
    }
    return false;
  }

  getShortened(address: string): string {
    return address.substring(0, 10).concat('...');
  }

  private updateAccount() {
    if (this.accountAddress && this.accountProvider) {
      AccountCursor.reset({
        address: this.accountAddress,
        provider: this.accountProvider,
        name: this.accountName,
      } as Account);
    } else {
      AccountCursor.reset(null);
    }
  }

  override update(changedProperties: Map<string, unknown>) {
    if (
      changedProperties.has('accountAddress') ||
      changedProperties.has('accountProvider')
    ) {
      this.updateAccount();
    }
    super.update(changedProperties);
  }

  override connectedCallback() {
    super.connectedCallback();
    AccountCursor.addWatch(this.watchId, (_id, prev, curr) => {
      if (prev?.address !== curr?.address) {
        this.onAccountChange(prev, curr);
      }
    });
  }

  override disconnectedCallback() {
    AccountCursor.removeWatch(this.watchId);
    super.disconnectedCallback();
  }
}
