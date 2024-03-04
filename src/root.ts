import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

import './component/notification';
import './component/transaction';

@customElement('gc-root')
export class Root extends LitElement {
  render() {
    console.log('test');
    return html`
      <gc-notification-center>
        <gc-transaction-center>
          <slot></slot>
        </gc-transaction-center>
      </gc-notification-center>
    `;
  }
}
