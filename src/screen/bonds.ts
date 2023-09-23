import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { BeforeEnterObserver, RouterLocation } from '@vaadin/router';

import { Account, accountCursor } from '../db';
import { DatabaseController } from '../db.ctrl';

import '../component/trade-bonds';
import { PoolType } from '@galacticcouncil/sdk';

@customElement('gc-bonds-screen')
export class BondsScreen extends LitElement implements BeforeEnterObserver {
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
      <gc-bonds-app
        chart
        assetIn=${this.assetIn}
        assetOut=${this.assetOut}
        apiAddress="wss://rpc.hydradx.cloud"
        pools=${[PoolType.Omni, PoolType.LBP].join(',')}
        stableCoinAssetId="2"
        accountAddress=${this.account.state?.address}
        accountProvider=${this.account.state?.provider}
        accountName=${this.account.state?.name}
        squidUrl="https://hydra-rococo-data-squid.play.hydration.cloud/graphql"
      ></gc-bonds-app>
    `;
  }

  hdxTemplateRococo() {
    return html`
      <gc-bonds-app
        chart
        assetIn=${this.assetIn}
        assetOut=${this.assetOut}
        apiAddress="wss://hydradx-rococo-rpc.play.hydration.cloud"
        pools=${[PoolType.Omni, PoolType.LBP].join(',')}
        stableCoinAssetId="2"
        accountAddress=${this.account.state?.address}
        accountProvider=${this.account.state?.provider}
        accountName=${this.account.state?.name}
        squidUrl="https://hydra-rococo-data-squid.play.hydration.cloud/graphql"
      ></gc-bonds-app>
    `;
  }

  render() {
    return this.hdxTemplateRococo();
  }
}
