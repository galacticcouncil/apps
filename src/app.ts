import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import './apps/trade';
import './apps/notification';
import './apps/transaction';

@customElement('gc-trade-spa')
export class TradeSpa extends LitElement {
  @property({ type: String }) apiAddress: string = null;
  @property({ type: String }) accountAddress: string = null;
  @property({ type: String }) accountProvider: string = null;
  @property({ type: String }) accountName: string = null;

  render() {
    return html`
      <gc-notification-center>
        <gc-transaction-center>
          <gc-trade-app
            .apiAddress=${this.apiAddress}
            .accountAddress=${this.accountAddress}
            .accountProvider=${this.accountProvider}
            .accountName=${this.accountName}
          >
          </gc-trade-app>
        </gc-transaction-center>
      </gc-notification-center>
    `;
  }
}
