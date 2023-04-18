import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { BeforeEnterObserver, RouterLocation } from '@vaadin/router';

import { Account, accountCursor } from '../db';
import { DatabaseController } from '../db.ctrl';
import { ThemeController } from '../theme.ctrl';

import '../component/trade';

@customElement('gc-trade-screen')
export class TradeScreen extends LitElement implements BeforeEnterObserver {
  private theme = new ThemeController(this);
  private account = new DatabaseController<Account>(this, accountCursor);

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
        accountAddress=${this.account.state?.address}
        accountProvider=${this.account.state?.provider}
        accountName=${this.account.state?.name}
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
        accountAddress=${this.account.state?.address}
        accountProvider=${this.account.state?.provider}
        accountName=${this.account.state?.name}
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
