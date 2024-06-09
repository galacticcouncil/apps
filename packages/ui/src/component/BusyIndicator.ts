import { html } from 'lit';
import { customElement } from 'lit/decorators.js';

import { UIGCElement } from './base/UIGCElement';

import styles from './BusyIndicator.css';

@customElement('uigc-busy-indicator')
export class BusyIndicator extends UIGCElement {
  static styles = [UIGCElement.styles, styles];

  render() {
    return html`
      <div class="busy-indicator-root">
        <div
          class="busy-indicator-busy-area"
          tabindex="0"
          role="progressbar"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuetext="Busy"
          title="Please wait">
          <div class="busy-indicator-circles-wrapper">
            <div class="busy-indicator-circle circle-animation-0"></div>
            <div class="busy-indicator-circle circle-animation-1"></div>
            <div class="busy-indicator-circle circle-animation-2"></div>
          </div>
          <slot></slot>
        </div>
      </div>
    `;
  }
}
