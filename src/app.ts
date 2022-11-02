import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

import { createApi } from './chain';

import './apps/trade';
import './apps/notification-center';
import './apps/root';

@customElement('gc-trade-app')
export class App extends LitElement {
  override async firstUpdated() {
    createApi('wss://rococo-basilisk-rpc.hydration.dev', () => {});
  }

  render() {
    return html`
      <app-root>
        <app-notification-center>
          <app-trade></app-trade>
        </app-notification-center>
      </app-root>
    `;
  }
}
