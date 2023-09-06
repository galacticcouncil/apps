import { property } from 'lit/decorators.js';

import { Account, accountCursor } from '../../db';
import { DatabaseController } from '../../db.ctrl';
import { BaseElement } from './BaseElement';

import short from 'short-uuid';

export abstract class BaseApp extends BaseElement {
  protected account = new DatabaseController<Account>(this, accountCursor);
  private watchId: string;

  @property({ type: String }) accountAddress: string = null;
  @property({ type: String }) accountProvider: string = null;
  @property({ type: String }) accountName: string = null;
  @property({ type: String }) indexerUrl: string = null;
  @property({ type: String }) grafanaUrl: string = null;
  @property({ type: Number }) grafanaDsn: number = null;
  @property({ type: String }) squidUrl: string = null;

  constructor() {
    super();
    this.watchId = 'account-watch-' + short.generate();
  }

  protected abstract onAccountChange(prev: Account, curr: Account): Promise<void>;

  hasAccount(): boolean {
    return !!this.account.state;
  }

  private updateAccount() {
    if (this.accountAddress && this.accountProvider) {
      accountCursor.reset({
        address: this.accountAddress,
        provider: this.accountProvider,
        name: this.accountName,
      } as Account);
    } else {
      accountCursor.reset(null);
    }
  }

  override update(changedProperties: Map<string, unknown>) {
    if (changedProperties.has('accountAddress') || changedProperties.has('accountProvider')) {
      this.updateAccount();
    }
    super.update(changedProperties);
  }

  override connectedCallback() {
    super.connectedCallback();
    accountCursor.addWatch(this.watchId, (_id, prev, curr) => {
      if (prev?.address !== curr?.address) {
        this.onAccountChange(prev, curr);
      }
    });
  }

  override disconnectedCallback() {
    accountCursor.removeWatch(this.watchId);
    super.disconnectedCallback();
  }
}
