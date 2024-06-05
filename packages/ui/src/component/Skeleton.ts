import { html, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { UIGCElement } from './base/UIGCElement';

import styles from './Skeleton.css';

@customElement('uigc-skeleton')
export class Skeleton extends UIGCElement {
  @property({ type: String }) width = null;
  @property({ type: String }) height = null;

  static styles = [UIGCElement.styles, unsafeCSS(styles)];

  override async firstUpdated() {
    const span = this.shadowRoot.querySelector('span');
    span.style.width = this.width;
    span.style.height = this.height;
  }

  render() {
    return html`
      <span></span>
    `;
  }
}
