import { LitElement, html, PropertyDeclaration } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { accountCursor, initDb } from './db';
import { createApi } from './chain';

import './apps/trade';
import './apps/notification';
import './apps/transaction';

@customElement('gc-trade-app')
export class App extends LitElement {
  @property({ type: String })
  apiAddress: string | null = null;

  @property({ type: Object })
  account: { name: string; address: string; provider: string } | null = null;

  private disconnectDb = initDb();
  private disconnectApi: (() => void) | null = null;

  override async firstUpdated() {
    this.disconnectApi = await createApi(this.apiAddress, () => {});
  }

  override requestUpdate(
    name?: PropertyKey,
    oldValue?: unknown,
    options?: PropertyDeclaration<unknown, unknown>
  ): void {
    console.log("requestUpdate", name, this[name])
    if (name === 'account') {
      accountCursor.reset(this.account);
    }

    return super.requestUpdate(name, oldValue, options);
  }

  override disconnectedCallback(): void {
    this.disconnectDb?.();
    this.disconnectApi?.();
  }

  render() {
    return html`
      <app-notification-center>
        <app-transaction-center>
          <app-trade> </app-trade>
        </app-transaction-center>
      </app-notification-center>
    `;
  }
}
