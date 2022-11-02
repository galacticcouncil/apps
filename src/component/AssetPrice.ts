import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';

import { baseStyles } from './styles/base.css';
import { themeStyles } from './styles/theme.css';
import { fontStyles } from './styles/font.css';

import './CircularProgress';

@customElement('ui-asset-price')
export class AssetPrice extends LitElement {
  @property({ type: String }) inputAsset = null;
  @property({ type: String }) outputAsset = null;
  @property({ type: String }) outputBalance = null;
  @property({ type: Boolean }) loading = false;

  static styles = [
    baseStyles,
    themeStyles,
    fontStyles,
    css`
      .chip-root {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        padding: 2px 14px;
        gap: 5px;
        height: 28px;
        background: rgba(var(--rgb-primary-100), 0.06);
        border-radius: 7px;
      }

      span {
        font-weight: 500;
        font-size: 11px;
        line-height: 15px;
      }

      span:not(.entry) {
        color: var(--hex-white);
      }

      .entry {
        color: var(--hex-primary-300);
      }

      .progress {
        position: relative;
        margin-left: 8px;
      }

      .progress-text {
        margin-left: 6px;
      }
    `,
  ];

  render() {
    return html`
      ${when(
        this.loading,
        () => html`<div class="chip-root">
          <span class="progress"> <ui-circular-progress size="small" progress="true"></ui-circular-progress> </span>
          <span class="progress-text">Fetching the best price...</span>
        </div>`,
        () => html` <div class="chip-root">
          <span>Price:</span>
          <span class="entry">1 ${this.inputAsset}</span>
          <span>=</span>
          <span>${this.outputBalance} </span>
          <span>${this.outputAsset}</span>
        </div>`
      )}
    `;
  }
}
