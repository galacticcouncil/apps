import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

import { Account, accountCursor } from '../db';
import { DatabaseController } from '../db.ctrl';
import { ThemeController } from '../theme.ctrl';

import '../component/xcm';

@customElement('gc-xcm-screen')
export class XcmScreen extends LitElement {
  private theme = new ThemeController(this);
  private account = new DatabaseController<Account>(this, accountCursor);

  bsxTemplate() {
    return html`
      <gc-xcm-app
        srcChain="kusama"
        destChain="basilisk"
        accountAddress=${this.account.state?.address}
        accountProvider=${this.account.state?.provider}
        accountName=${this.account.state?.name}
      ></gc-xcm-app>
    `;
  }

  hdxTemplate() {
    return html`
      <gc-xcm-app
        srcChain="polkadot"
        srcEvmChain="moonbeam"
        destChain="hydradx"
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
