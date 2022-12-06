import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

import '../component/trade';

@customElement('gc-trade-screen')
export class TradeScreen extends LitElement {
  render() {
    return html`
      <gc-trade-app
        apiAddress="wss://hydradx-devnet-rpc.play.hydration.cloud"
        accountAddress="7NPoMQbiA6trJKkjB35uk96MeJD4PGWkLQLH7k7hXEkZpiba"
        accountProvider="polkadot-js"
        accountName="alice"
        pools="Omni"
      ></gc-trade-app>
    `;
  }
}
