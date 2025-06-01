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

@customElement('gc-xcm-screen')
export class XcmScreen extends LitElement implements BeforeEnterObserver {
  private theme = new ThemeController(this);
  private account = new DatabaseController<Account>(this, AccountCursor);

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
      <gc-xcm
        srcChain="kusama"
        destChain="basilisk"
        accountAddress=${this.account.state?.address}
        accountProvider=${this.account.state?.provider}
        accountName=${this.account.state?.name}
        apiAddress="wss://rpc.basilisk.cloud"
        ecosystem=${Ecosystem.Kusama}
        stableCoinAssetId="14"></gc-xcm>
    `;
  }

  hdxTemplate() {
    return html`
      <gc-xcm
        srcChain=${this.srcChain || 'assethub'}
        destChain=${this.destChain || 'hydration'}
        asset=${this.asset}
        accountAddress=${this.account.state?.address}
        accountProvider=${this.account.state?.provider}
        accountName=${this.account.state?.name}
        blacklist=""
        apiAddress="wss://hydration-rpc.n.dwellir.com"
        stableCoinAssetId="10"
        ss58Prefix="63"></gc-xcm>
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
