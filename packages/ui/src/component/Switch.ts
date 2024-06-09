import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { UIGCElement } from './base/UIGCElement';

import styles from './Switch.css';

@customElement('uigc-switch')
export class Switch extends UIGCElement {
  @property({ type: Boolean, reflect: true }) checked = false;
  @property({ type: Boolean, reflect: true }) highlight = false;

  static styles = [UIGCElement.styles, styles];

  override async updated() {
    const switchRoot = this.shadowRoot.querySelector('.switch-root');
    if (this.checked) {
      switchRoot.removeAttribute('checked');
    } else {
      switchRoot.setAttribute('checked', '');
    }

    if (this.highlight) {
      switchRoot.removeAttribute('highlight');
    } else {
      switchRoot.setAttribute('highlight', '');
    }
  }

  render() {
    return html`
      <div class="switch-root">
        <span class="switch-glow"></span>
        <span class="switch-thumb"></span>
      </div>
    `;
  }
}
