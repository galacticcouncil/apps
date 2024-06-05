import { html, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';

import { UIGCElement } from './base/UIGCElement';

import './AssetId';

import styles from './Asset.css';

@customElement('uigc-asset')
export class Asset extends UIGCElement {
  @property({ type: String }) symbol = null;
  @property({ type: String }) desc = null;
  @property({ type: Boolean, reflect: true }) multi = false;

  static styles = [UIGCElement.styles, unsafeCSS(styles)];

  override async updated() {
    const iconSlot: HTMLSlotElement =
      this.shadowRoot.querySelector('slot[name=icon]');
    const icons = iconSlot.assignedElements();

    if (icons.length > 1) {
      this.multi = true;
    } else {
      this.multi = false;
    }
  }

  render() {
    return html`
      <slot name="icon"></slot>
      <span class="title">
        <span class="code">${this.symbol}</span>
        ${when(
          this.desc,
          () =>
            html`
              <span class="desc">${this.desc}</span>
            `,
        )}
      </span>
      <slot></slot>
    `;
  }
}
