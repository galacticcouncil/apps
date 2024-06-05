import { html, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { UIGCElement } from './base/UIGCElement';

import styles from './Progress.css';

@customElement('uigc-progress')
export class Progress extends UIGCElement {
  @property({ type: Number }) duration = null;

  static styles = [UIGCElement.styles, unsafeCSS(styles)];

  override async firstUpdated() {
    const progress = this.shadowRoot.querySelector('.progress-root');
    if (this.duration) {
      progress.setAttribute(
        'style',
        '--duration: ' + this.duration / 1000 + ';',
      );
    }
  }

  render() {
    return html`
      <div class="progress-root"></div>
    `;
  }
}
