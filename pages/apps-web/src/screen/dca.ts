import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { BeforeEnterObserver, RouterLocation } from '@vaadin/router';

import {
  Account,
  AccountCursor,
  DatabaseController,
} from '@galacticcouncil/apps';
import { PoolType } from '@galacticcouncil/sdk';

import { ThemeController } from 'theme.ctrl';

@customElement('gc-dca-screen')
export class DcaScreen extends LitElement implements BeforeEnterObserver {
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
      <gc-dca
        chart
        assetIn=${this.assetIn}
        assetOut=${this.assetOut}
        apiAddress="wss://chopsticks.rpc.hydration.cloud"
        pools=${[PoolType.XYK].join(',')}
        stableCoinAssetId="14"
        accountAddress=${this.account.state?.address}
        accountProvider=${this.account.state?.provider}
        accountName=${this.account.state?.name}
        indexerUrl="https://basilisk-explorer.play.hydration.cloud/graphql"
        grafanaUrl="https://grafana.hydradx.cloud/api/ds/query"
        grafanaDsn="5"></gc-dca>
    `;
  }

  hdxTemplate() {
    return html`
      <gc-dca
        chart
        assetIn=${this.assetIn}
        assetOut=${this.assetOut}
        apiAddress="wss://rpc.hydradx.cloud"
        stableCoinAssetId="10"
        accountAddress=${this.account.state?.address}
        accountProvider=${this.account.state?.provider}
        accountName=${this.account.state?.name}
        indexerUrl="https://hydradx-explorer.play.hydration.cloud/graphql"
        grafanaUrl="https://grafana.hydradx.cloud/api/ds/query"
        grafanaDsn="10"></gc-dca>
    `;
  }

  hdxTemplateNice() {
    return html`
      <gc-dca
        chart
        assetIn=${this.assetIn}
        assetOut=${this.assetOut}
        apiAddress="wss://rpc.nice.hydration.cloud"
        stableCoinAssetId="10"
        accountAddress=${this.account.state?.address}
        accountProvider=${this.account.state?.provider}
        accountName=${this.account.state?.name}
        indexerUrl="https://archive.nice.hydration.cloud/graphql"
        grafanaUrl="https://grafana.hydradx.cloud/api/ds/query"
        grafanaDsn="11"></gc-dca>
    `;
  }

  hdxTemplateRococo() {
    return html`
      <gc-dca
        chart
        assetIn=${this.assetIn}
        assetOut=${this.assetOut}
        apiAddress="wss://hydradx-rococo-rpc.play.hydration.cloud"
        stableCoinAssetId="2"
        accountAddress=${this.account.state?.address}
        accountProvider=${this.account.state?.provider}
        accountName=${this.account.state?.name}
        indexerUrl="https://hydradx-rococo-explorer.play.hydration.cloud/graphql"
        grafanaUrl="https://grafana.hydradx.cloud/api/ds/query"
        grafanaDsn="11"></gc-dca>
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
