import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

import { ThemeController, setObj } from '@galacticcouncil/apps';

import external from 'config/external.degen.json';

@customElement('gc-root')
export class Root extends LitElement {
  private theme = new ThemeController(this);

  private setUpStorage() {
    if (this.theme.state == 'hdx') {
      setObj('external-tokens', external);
    }
  }

  override connectedCallback() {
    super.connectedCallback();
    this.setUpStorage();
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
  }

  render() {
    return html`
      <gc-notification-center>
        <gc-transaction-center>
          <gc-context-provider>
            <slot></slot>
          </gc-context-provider>
        </gc-transaction-center>
      </gc-notification-center>
    `;
  }
}
