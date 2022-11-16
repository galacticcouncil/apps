import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { Account } from './db';

import './apps/trade';
import './apps/notification';
import './apps/transaction';

@customElement('gc-trade-spa')
export class TradeSpa extends LitElement {
  @property({ type: String }) apiAddress: string = null;
  @property({ type: Object }) account: Account = null;

  render() {
    return html`
      <gc-notification-center>
        <gc-transaction-center>
          <gc-trade-app .apiAddress=${this.apiAddress} .account=${this.account}> </gc-trade-app>
        </gc-transaction-center>
      </gc-notification-center>
    `;
  }
}
