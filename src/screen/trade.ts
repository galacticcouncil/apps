import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { BeforeEnterObserver, RouterLocation } from '@vaadin/router';

import { Account, Ecosystem, accountCursor } from '../db';
import { DatabaseController } from '../db.ctrl';
import { ThemeController } from '../theme.ctrl';

import '../component/trade';
import { PoolType } from '@galacticcouncil/sdk';

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
        assetIn=${this.assetIn}
        assetOut=${this.assetOut}
        apiAddress="wss://rpc.basilisk.cloud"
        ecosystem=${Ecosystem.Kusama}
        pools=${PoolType.XYK}
        stableCoinAssetId="14"
        accountAddress=${this.account.state?.address}
        accountProvider=${this.account.state?.provider}
        accountName=${this.account.state?.name}
      ></gc-trade-app>
    `;
  }

  bsxTemplateRococo() {
    return html`
      <gc-trade-app
        assetIn=${this.assetIn}
        assetOut=${this.assetOut}
        apiAddress="wss://basilisk-rococo-rpc.play.hydration.cloud"
        ecosystem=${Ecosystem.Kusama}
        pools=${PoolType.XYK}
        stableCoinAssetId="19"
        accountAddress=${this.account.state?.address}
        accountProvider=${this.account.state?.provider}
        accountName=${this.account.state?.name}
      ></gc-trade-app>
    `;
  }

  hdxTemplate() {
    return html`
      <gc-trade-app
        chart
        twap
        assetIn=${this.assetIn}
        assetOut=${this.assetOut}
        apiAddress="wss://rpc.hydradx.cloud"
        pools=${PoolType.Omni}
        stableCoinAssetId="2"
        accountAddress=${this.account.state?.address}
        accountProvider=${this.account.state?.provider}
        accountName=${this.account.state?.name}
        indexerUrl="https://hydradx-explorer.play.hydration.cloud/graphql"
        grafanaUrl="https://grafana-api.play.hydration.cloud/api/ds/query"
        grafanaDsn="10"
      ></gc-trade-app>
    `;
  }

  hdxTemplateRococo() {
    return html`
      <gc-trade-app
        chart
        twap
        assetIn=${this.assetIn}
        assetOut=${this.assetOut}
        apiAddress="wss://hydradx-rococo-rpc.play.hydration.cloud"
        pools=${[PoolType.Omni, PoolType.LBP].join(',')}
        stableCoinAssetId="2"
        accountAddress=${this.account.state?.address}
        accountProvider=${this.account.state?.provider}
        accountName=${this.account.state?.name}
        indexerUrl="https://hydradx-rococo-explorer.play.hydration.cloud/graphql"
        grafanaUrl="https://grafana-api.play.hydration.cloud/api/ds/query"
        grafanaDsn="11"
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
