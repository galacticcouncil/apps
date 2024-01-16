import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { BeforeEnterObserver, RouterLocation } from '@vaadin/router';

import { Account, accountCursor } from '../db';
import { DatabaseController } from '../db.ctrl';
import { ThemeController } from '../theme.ctrl';

import '../component/xcm';

@customElement('gc-xcm-screen')
export class XcmScreen extends LitElement implements BeforeEnterObserver {
  private theme = new ThemeController(this);
  private account = new DatabaseController<Account>(this, accountCursor);

  @state() srcChain: string = null;
  @state() destChain: string = null;
  @state() asset: string = null;

  async onBeforeEnter(location: RouterLocation) {
    const queryParams = new URLSearchParams(location.search);
    this.srcChain = queryParams.get('srcChain');
    this.destChain = queryParams.get('destChain');
    this.asset = queryParams.get('asset');
  }

  bsxTemplate() {
    return html`
      <gc-xcm-app
        srcChain="kusama"
        destChain="basilisk"
        accountAddress=${this.account.state?.address}
        accountProvider=${this.account.state?.provider}
        accountName=${this.account.state?.name}
        apiAddress="wss://rpc.basilisk.cloud"
        stableCoinAssetId="14"
      ></gc-xcm-app>
    `;
  }

  hdxTemplate() {
    return html`
      <gc-xcm-app
        srcChain=${this.srcChain || 'polkadot'}
        destChain=${this.destChain || 'hydradx'}
        asset=${this.asset}
        accountAddress=${this.account.state?.address}
        accountProvider=${this.account.state?.provider}
        accountName=${this.account.state?.name}
        apiAddress="wss://rpc.hydradx.cloud"
        stableCoinAssetId="10"
      ></gc-xcm-app>
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
