import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { UIGCElement } from './base/UIGCElement';

import styles from './AssetList.css';
import { when } from 'lit/directives/when';

@customElement('uigc-asset-list')
export class AssetList extends UIGCElement {
  @property({ type: Boolean }) isDisabledAssets = false;

  static styles = [UIGCElement.styles, styles];

  render() {
    return html`
      <div class="list-root">
        <div class="list-header">
          <span>ASSET</span>
          <span>BALANCE</span>
        </div>
        <slot name="selected"></slot>
        <slot></slot>
        ${when(
          this.isDisabledAssets,
          () => html`
            <div class="list-header subheader">
              <span>ASSETS WITHOUT PAIR/POOL</span>
            </div>
          `,
        )}
        <slot name="disabled"></slot>
        <slot name="footer"></slot>
      </div>
    `;
  }
}
