import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { BeforeEnterObserver, RouterLocation } from '@vaadin/router';

import {
  Account,
  AccountCursor,
  DatabaseController,
} from '@galacticcouncil/apps';

@customElement('gc-bonds-screen')
export class BondsScreen extends LitElement implements BeforeEnterObserver {
  private account = new DatabaseController<Account>(this, AccountCursor);

  @state() assetIn: string = null;
  @state() assetOut: string = null;

  async onBeforeEnter(location: RouterLocation) {
    const queryParams = new URLSearchParams(location.search);
    this.assetIn = queryParams.get('assetIn');
    this.assetOut = queryParams.get('assetOut');
  }

  hdxTemplate() {
    return html`
      <gc-bonds
        chart
        assetIn=${this.assetIn}
        assetOut=${this.assetOut}
        apiAddress="wss://rpc.hydradx.cloud"
        stableCoinAssetId="10"
        accountAddress=${this.account.state?.address}
        accountProvider=${this.account.state?.provider}
        accountName=${this.account.state?.name}
        squidUrl="https://galacticcouncil.squids.live/hydration-pools:prod/api/graphql"></gc-bonds>
    `;
  }

  hdxTemplateRococo() {
    return html`
      <gc-bonds
        chart
        assetIn=${this.assetIn}
        assetOut=${this.assetOut}
        apiAddress="wss://rpc.nice.hydration.cloud"
        stableCoinAssetId="10"
        accountAddress=${this.account.state?.address}
        accountProvider=${this.account.state?.provider}
        accountName=${this.account.state?.name}
        squidUrl="https://data-squid.nice.hydration.cloud/graphql"></gc-bonds>
    `;
  }

  render() {
    return this.hdxTemplate();
  }
}
