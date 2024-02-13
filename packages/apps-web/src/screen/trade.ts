import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { BeforeEnterObserver, RouterLocation } from '@vaadin/router';

import {
  Account,
  AccountCursor,
  DatabaseController,
  Ecosystem,
} from '@galacticcouncil/apps';

import { ThemeController } from 'theme.ctrl';

@customElement('gc-trade-screen')
export class TradeScreen extends LitElement implements BeforeEnterObserver {
  private theme = new ThemeController(this);
  private account = new DatabaseController<Account>(this, AccountCursor);

  @state() assetIn: string = null;
  @state() assetOut: string = null;

  async onBeforeEnter(location: RouterLocation) {
    const queryParams = new URLSearchParams(location.search);
    this.assetIn = queryParams.get('assetIn');
    this.assetOut = queryParams.get('assetOut');
  }

  bsxTemplate() {
    return html`
      <gc-trade
        chart
        assetIn=${this.assetIn}
        assetOut=${this.assetOut}
        apiAddress="wss://chopsticks.rpc.hydration.cloud"
        ecosystem=${Ecosystem.Kusama}
        stableCoinAssetId="14"
        accountAddress=${this.account.state?.address}
        accountProvider=${this.account.state?.provider}
        accountName=${this.account.state?.name}
        indexerUrl="https://basilisk-explorer.play.hydration.cloud/graphql"
        grafanaUrl="https://grafana-api.play.hydration.cloud/api/ds/query"
        grafanaDsn="5"></gc-trade>
    `;
  }

  bsxTemplateRococo() {
    return html`
      <gc-trade
        assetIn=${this.assetIn}
        assetOut=${this.assetOut}
        apiAddress="wss://basilisk-rococo-rpc.play.hydration.cloud"
        ecosystem=${Ecosystem.Kusama}
        stableCoinAssetId="19"
        accountAddress=${this.account.state?.address}
        accountProvider=${this.account.state?.provider}
        accountName=${this.account.state?.name}></gc-trade>
    `;
  }

  hdxTemplate() {
    return html`
      <gc-trade
        chart
        twap
        assetIn=${this.assetIn}
        assetOut=${this.assetOut}
        apiAddress="wss://rpc.hydradx.cloud"
        stableCoinAssetId="10"
        accountAddress=${this.account.state?.address}
        accountProvider=${this.account.state?.provider}
        accountName=${this.account.state?.name}
        indexerUrl="https://hydradx-explorer.play.hydration.cloud/graphql"
        grafanaUrl="https://grafana-api.play.hydration.cloud/api/ds/query"
        grafanaDsn="10"></gc-trade>
    `;
  }

  hdxTemplateRococo() {
    return html`
      <gc-trade
        chart
        twap
        assetIn=${this.assetIn}
        assetOut=${this.assetOut}
        apiAddress="wss://rpc.nice.hydration.cloud"
        stableCoinAssetId="10"
        accountAddress=${this.account.state?.address}
        accountProvider=${this.account.state?.provider}
        accountName=${this.account.state?.name}
        indexerUrl="https://archive.nice.hydration.cloud/graphql"
        grafanaUrl="https://grafana-api.play.hydration.cloud/api/ds/query"
        grafanaDsn="11"></gc-trade>
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
