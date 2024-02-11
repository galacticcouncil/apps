import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';

import { UIGCElement } from './base/UIGCElement';

import './CircularProgress';
import { amountFormatter } from './utils/formatters';

@customElement('uigc-asset-price')
export class AssetPrice extends UIGCElement {
  @property({ type: String }) inputAsset = null;
  @property({ type: String }) outputAsset = null;
  @property({ type: String }) outputBalance = null;
  @property({ type: Boolean }) loading = false;
  @property({ attribute: false }) formatter = null;

  static styles = [
    UIGCElement.styles,
    css`
      .chip-root {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        padding: 0 14px;
        gap: 5px;
        height: 28px;
        background: var(--uigc-asset-price-background);
        border-radius: var(--uigc-asset-price-border-radius);
        border: var(--uigc-asset-price-border);
      }

      span {
        font-weight: 500;
        font-size: 11px;
        line-height: 15px;
      }

      span:not(.highlight) {
        color: var(--hex-white);
      }

      .highlight {
        color: var(--uigc-asset-price__highlight-color);
      }

      .progress {
        position: relative;
      }

      .progress-text {
        margin-left: 6px;
      }
    `,
  ];

  render() {
    const formatterFn = this.formatter ? this.formatter : amountFormatter;
    return html`
      ${when(
        this.loading,
        () => html`
          <div class="chip-root">
            <span class="progress">
              <uigc-circular-progress size="small"></uigc-circular-progress>
            </span>
            <span class="progress-text">Fetching the best price...</span>
          </div>
        `,
        () => html`
          <div class="chip-root">
            <span>Price:</span>
            <span class="highlight">1 ${this.inputAsset}</span>
            <span>=</span>
            <span>
              ${this.outputBalance ? formatterFn(this.outputBalance) : '-'}
            </span>
            <span>${this.outputAsset}</span>
          </div>
        `,
      )}
    `;
  }
}
