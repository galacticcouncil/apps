import { html } from 'lit';
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
  @property({ type: Number }) iconCount = 0;
  @property({ type: Boolean }) isATokenPool = false;

  static styles = [UIGCElement.styles, styles];

  override async updated() {
    const iconSlot: HTMLSlotElement =
      this.shadowRoot.querySelector('slot[name=icon]');
    const icons = iconSlot.assignedElements();

    this.iconCount = icons.length;

    if (icons.length > 1) {
      this.multi = true;
    } else {
      this.multi = false;
    }
  }

  renderIcon() {
    if (this.multi && this.isATokenPool) {
      return html`
        <span class="atoken-container" data-count=${this.iconCount}>
          <slot name="icon"></slot>
        </span>
      `;
    }

    return html`
      <slot name="icon"></slot>
    `;
  }

  render() {
    return html`
      ${this.renderIcon()}
      <span class="title">
        <span class="code">${this.symbol.replace('-Pool-', '-Pool ')}</span>
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
