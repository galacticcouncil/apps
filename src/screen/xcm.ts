import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

import '../component/xcm';

@customElement('gc-xcm-screen')
export class XcmScreen extends LitElement {
  render() {
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
}
