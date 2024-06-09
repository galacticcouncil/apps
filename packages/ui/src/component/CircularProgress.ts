import { html } from 'lit';
import { customElement } from 'lit/decorators.js';

import { UIGCElement } from './base/UIGCElement';

import styles from './CircularProgress.css';

@customElement('uigc-circular-progress')
export class CircularProgress extends UIGCElement {
  static styles = styles;

  render() {
    return html`
      <span class="progress-root"></span>
    `;
  }
}
