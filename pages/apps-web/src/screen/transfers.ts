import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { BeforeEnterObserver, RouterLocation } from '@vaadin/router';

import {
  chain,
  Account,
  AccountCursor,
  ChainCursor,
  DatabaseController,
  Ecosystem,
} from '@galacticcouncil/apps';

import { ThemeController } from 'theme.ctrl';

@customElement('gc-transfers-screen')
export class TransfersScreen extends LitElement {
  private theme = new ThemeController(this);

  render() {
    return html`
      <gc-redeem></gc-redeem>
    `;
  }
}
