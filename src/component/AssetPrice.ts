import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { themeStyles } from './styles/theme.css';
import { baseStyles } from './styles/base.css';

@customElement('ui-asset-price')
export class AssetPrice extends LitElement {
  @property({ type: String }) inputAsset = 'BSX';
  @property({ type: String }) outputAsset = 'aUSD';
  @property({ type: String }) outputBalance = '121343434';

  static styles = [
    baseStyles,
    themeStyles,
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
    `,
  ];

  render() {
    return html`
      <div class="chip-root">
        <span>Price:</span>
        <span class="entry">1 ${this.inputAsset}</span>
        <span>=</span>
        <span>${this.outputBalance} </span>
        <span>${this.outputAsset}</span>
      </div>
    `;
  }
}
