import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { BeforeEnterObserver, RouterLocation } from '@vaadin/router';

import { ThemeController } from '../theme.ctrl';

import '../component/trade';

@customElement('gc-trade-screen')
export class TradeScreen extends LitElement implements BeforeEnterObserver {
  private theme = new ThemeController(this);

  @state() assetIn: string = null;
  @state() assetOut: string = null;

  async onBeforeEnter(location: RouterLocation) {
    const queryParams = new URLSearchParams(location.search);
    this.assetIn = queryParams.get('assetIn');
    this.assetOut = queryParams.get('assetOut');
  }

  bsxTemplate() {
    return html`
      <gc-trade-app
        apiAddress="wss://rpc.basilisk.cloud"
        accountAddress="bXieCAR98oWxVhRog5fCyTNkTquvFAonLPC2pLE1Qd1jgsK9f"
        accountProvider="talisman"
        accountName="nohaapav"
        pools="XYK"
        stableCoinAssetId="14"
        assetIn=${this.assetIn}
        assetOut=${this.assetOut}
      ></gc-trade-app>
    `;
  }

  hdxTemplate() {
    return html`
      <gc-trade-app
        chart
        chartDatasourceId="10"
        apiAddress="wss://rpc.hydradx.cloud"
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

  render() {
    if (this.theme.state == 'hdx') {
      return this.hdxTemplate();
    } else {
      return this.bsxTemplate();
    }
  }
}
