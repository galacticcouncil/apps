import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { BeforeEnterObserver, RouterLocation } from '@vaadin/router';

import {
  chain,
  Account,
  AccountCursor,
  ChainCursor,
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
        apiAddress="wss://rpc.basilisk.cloud"
        ecosystem=${Ecosystem.Kusama}
        stableCoinAssetId="14"
        accountAddress=${this.account.state?.address}
        accountProvider=${this.account.state?.provider}
        accountName=${this.account.state?.name}
        indexerUrl="https://basilisk-explorer.play.hydration.cloud/graphql"
        grafanaUrl="https://grafana.hydradx.cloud/api/ds/query"
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
        twapOn
        apiAddress="wss://hydration-rpc.n.dwellir.com"
        assetIn=${this.assetIn}
        assetOut=${this.assetOut}
        stableCoinAssetId="10"
        accountAddress=${this.account.state?.address}
        accountProvider=${this.account.state?.provider}
        accountName=${this.account.state?.name}
        indexerUrl="https://hydradx-explorer.play.hydration.cloud/graphql"
        grafanaUrl="https://grafana.hydradx.cloud/api/ds/query"
        grafanaDsn="10"></gc-trade>
      <button
        style="display:none"
        @click=${() => {
          chain
            .createChainCtx(
              'wss://hydration-rpc.n.dwellir.com',
              Ecosystem.Polkadot,
            )
            .then((chain) => {
              ChainCursor.reset(chain);
              console.log('Chain ctx set');
            });
        }}>
        Chain CTX Load
      </button>
    `;
  }

  hdxTemplateRococo() {
    return html`
      <gc-trade
        chart
        twapOn
        assetIn=${this.assetIn}
        assetOut=${this.assetOut}
        apiAddress="wss://rpc.nice.hydration.cloud"
        isTestnet
        stableCoinAssetId="10"
        accountAddress=${this.account.state?.address}
        accountProvider=${this.account.state?.provider}
        accountName=${this.account.state?.name}
        indexerUrl="https://archive.nice.hydration.cloud/graphql"
        grafanaUrl="https://grafana.hydradx.cloud/api/ds/query"
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
