import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

import '../component/xcm';

@customElement('gc-xcm-screen')
export class XcmScreen extends LitElement {
  render() {
    return html`
      <gc-xcm-app
        testnet
        fromChain="karura"
        toChain="basilisk"
        chains="basilisk,karura"
        accountAddress="bXhZjWos3qm5MtqLAzrHP4E5jaiL3HzKedWaTQpFxqDFRYj7w"
        accountProvider="polkadot-js"
        accountName="alice"
      ></gc-xcm-app>
    `;
  }
}
