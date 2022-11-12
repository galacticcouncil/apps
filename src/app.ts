import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

import { createApi } from './chain';

import './apps/trade';
import './apps/notification';
import './apps/transaction';

@customElement('gc-trade-app')
export class App extends LitElement {
  override async firstUpdated() {
    createApi('wss://rococo-basilisk-rpc.hydration.dev', () => {});
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
