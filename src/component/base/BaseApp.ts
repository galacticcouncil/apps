import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';

import { Account, accountCursor } from '../../db';
import { DatabaseController } from '../../db.ctrl';

export abstract class BaseApp extends LitElement {
  protected account = new DatabaseController<Account>(this, accountCursor);

  @property({ type: String }) accountAddress: string = null;
  @property({ type: String }) accountProvider: string = null;
  @property({ type: String }) accountName: string = null;

  protected abstract onAccountChange(prev: Account, curr: Account): Promise<void>;

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
    accountCursor.addWatch('account-watch', (_id, prev, curr) => this.onAccountChange(prev, curr));
  }

  override disconnectedCallback() {
    accountCursor.removeWatch('account-watch');
    super.disconnectedCallback();
  }
}
