import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { BeforeEnterObserver, RouterLocation } from '@vaadin/router';

import { Account, accountCursor } from '../db';
import { DatabaseController } from '../db.ctrl';

import '../component/dca';

@customElement('gc-dca-screen')
export class DcaScreen extends LitElement implements BeforeEnterObserver {
  private account = new DatabaseController<Account>(this, accountCursor);

  @state() assetIn: string = null;
  @state() assetOut: string = null;

  async onBeforeEnter(location: RouterLocation) {
    const queryParams = new URLSearchParams(location.search);
    this.assetIn = queryParams.get('assetIn');
    this.assetOut = queryParams.get('assetOut');
  }

  hdxTemplate() {
    return html`
      <gc-dca-app
        chart
        chartDatasourceId="10"
        apiAddress="wss://rococo-hydradx-rpc.hydration.dev"
        accountAddress=${this.account.state?.address}
        accountProvider=${this.account.state?.provider}
        accountName=${this.account.state?.name}
        pools="Omni"
        stableCoinAssetId="2"
        indexerUrl=${'https://hydradx-rococo-explorer.play.hydration.cloud/graphql'}
        assetIn=${this.assetIn}
        assetOut=${this.assetOut}
      ></gc-dca-app>
    `;
  }

  render() {
    return this.hdxTemplate();
  }
}
