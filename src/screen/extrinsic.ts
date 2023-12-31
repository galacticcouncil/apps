import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

import { Account, accountCursor } from '../db';
import { DatabaseController } from '../db.ctrl';

import '../component/extrinsic';

@customElement('gc-extrinsic-screen')
export class ExtrinsicScreen extends LitElement {
  private account = new DatabaseController<Account>(this, accountCursor);

  hdxTemplate() {
    return html`
      <gc-extrinsic-app
        apiAddress="wss://rpc.hydradx.cloud"
        accountAddress=${this.account.state?.address}
        accountProvider=${this.account.state?.provider}
        accountName=${this.account.state?.name}
      ></gc-extrinsic-app>
    `;
  }

  render() {
    return this.hdxTemplate();
  }
}
