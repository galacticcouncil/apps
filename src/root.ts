import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { BeforeEnterObserver, RouterLocation } from '@vaadin/router';

import './component/notification';
import './component/transaction';

@customElement('gc-root')
export class Root extends LitElement implements BeforeEnterObserver {
  async onBeforeEnter(location: RouterLocation) {
    const theme = new URLSearchParams(location.search).get('theme');
    document.querySelector('html').setAttribute('theme', theme || 'hdx');
  }

  render() {
    return html`
      <gc-notification-center>
        <gc-transaction-center>
          <slot></slot>
        </gc-transaction-center>
      </gc-notification-center>
    `;
  }
}
