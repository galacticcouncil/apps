import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

import './apps/trade';
import './apps/notification';
import './apps/transaction';

@customElement('gc-trade-spa')
export class App extends LitElement {
  render() {
    return html`
      <gc-notification-center>
        <gc-transaction-center>
          <gc-trade-app
            apiAddress="wss://rococo-basilisk-rpc.hydration.dev"
            accountAddress="bXmMqb3jBWToPPXf5RXWgRjFCk3eN9mM9Tqx8uj7MQ9vZ6HEx"
            accountProvider="polkadot-js"
            accountName="testcoco"
          >
          </gc-trade-app>
        </gc-transaction-center>
      </gc-notification-center>
    `;
  }
}
