import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

import { baseStyles } from 'styles';

import styles from './Loading.css';

@customElement('gc-chart-loading')
export class ChartLoading extends LitElement {
  static styles = [baseStyles, styles];

  render() {
    return html`
      <div class="loading">
        <div class="loading-1"></div>
        <div class="loading-2"></div>
        <div class="loading-3"></div>
        <div class="loading-4"></div>
      </div>
    `;
  }
}
