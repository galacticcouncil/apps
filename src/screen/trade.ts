import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { BeforeEnterObserver, RouterLocation } from '@vaadin/router';

import '../component/trade';

@customElement('gc-trade-screen')
export class TradeScreen extends LitElement implements BeforeEnterObserver {
  @state() assetIn: string = null;
  @state() assetOut: string = null;

  async onBeforeEnter(location: RouterLocation) {
    const queryParams = new URLSearchParams(location.search);
    this.assetIn = queryParams.get('assetIn');
    this.assetOut = queryParams.get('assetOut');
  }

  render() {
    return html`
      <gc-trade-app
        apiAddress="wss://hydradx-rococo-rpc.play.hydration.cloud"
        accountAddress="7NPoMQbiA6trJKkjB35uk96MeJD4PGWkLQLH7k7hXEkZpiba"
        accountProvider="polkadot-js"
        accountName="alice"
        pools="Omni"
        stableCoinAssetId="2"
        assetIn=${this.assetIn}
        assetOut=${this.assetOut}
      ></gc-trade-app>
    `;
  }
}
