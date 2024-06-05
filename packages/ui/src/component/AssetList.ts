import { html, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';

import { UIGCElement } from './base/UIGCElement';

import styles from './AssetList.css';

@customElement('uigc-asset-list')
export class AssetList extends UIGCElement {
  static styles = [UIGCElement.styles, unsafeCSS(styles)];

  render() {
    return html`
      <div class="list-root">
        <div class="list-header">
          <span>ASSET</span>
          <span>BALANCE</span>
        </div>
        <slot name="selected"></slot>
        <slot></slot>
        <div class="list-header subheader">
          <span>ASSETS WITHOUT PAIR/POOL</span>
        </div>
        <slot name="disabled"></slot>
        <slot name="footer"></slot>
      </div>
    `;
  }
}
