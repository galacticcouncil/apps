import { html } from 'lit';
import { customElement } from 'lit/decorators.js';

import { UIGCElement } from './base/UIGCElement';

import styles from './Divider.css';

@customElement('uigc-divider')
export class Divider extends UIGCElement {
  static styles = [UIGCElement.styles, styles];

  render() {
    return html`
      <div class="divider-root"></div>
    `;
  }
}
