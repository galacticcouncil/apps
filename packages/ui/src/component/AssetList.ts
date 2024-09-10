import { html } from 'lit';
import { customElement } from 'lit/decorators.js';

import { UIGCElement } from './base/UIGCElement';

import styles from './AssetList.css';

@customElement('uigc-asset-list')
export class AssetList extends UIGCElement {
  static styles = [UIGCElement.styles, styles];

  render() {
    return html`
      <div class="list-root">
        <div class="list-header">
          <span>ASSET</span>
          <span>BALANCE</span>
        </div>
        <slot></slot>
        <slot name="footer"></slot>
      </div>
    `;
  }
}
