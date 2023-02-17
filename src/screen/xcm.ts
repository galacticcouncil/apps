import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

import { ThemeController } from '../theme.ctrl';

import '../component/xcm';

@customElement('gc-xcm-screen')
export class XcmScreen extends LitElement {
  private theme = new ThemeController(this);

  bsxTemplate() {
    return html`
      <gc-xcm-app
        srcChain="kusama"
        dstChain="basilisk"
        chains="basilisk,karura,kusama,tinkernet,statemine"
        accountAddress="bXieCAR98oWxVhRog5fCyTNkTquvFAonLPC2pLE1Qd1jgsK9f"
        accountProvider="talisman"
        accountName="nohaapav"
      ></gc-xcm-app>
    `;
  }

  hdxTemplate() {
    return html`
      <gc-xcm-app
        srcChain="polkadot"
        dstChain="hydradx"
        chains="polkadot,hydradx,acala"
        accountAddress="7NPoMQbiA6trJKkjB35uk96MeJD4PGWkLQLH7k7hXEkZpiba"
        accountProvider="polkadot-js"
        accountName="alice"
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
