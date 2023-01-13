import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';

import { baseStyles } from '../base.css';

import { Amount } from '@galacticcouncil/sdk';
import { humanizeAmount, multipleAmounts } from '../../utils/amount';

import '../chart';

const PERIOD_OPTS = ['All', '24h', '12h', '6h', '3h', '1h'];

@customElement('gc-trade-chart')
export class TradeChart extends LitElement {
  @state() period: String = PERIOD_OPTS[3];

  @property({ type: Object }) data = {};
  @property({ type: String }) assetIn = null;
  @property({ type: String }) assetOut = null;
  @property({ type: String }) spotPrice = null;
  @property({ attribute: false }) usdPrice: Map<string, Amount> = new Map([]);

  static styles = [
    baseStyles,
    css`
      :host {
        display: flex;
        flex-direction: column;
        height: 100%;
      }

      .header {
        height: 80px;
        padding: 28px;
        display: flex;
        justify-content: space-between;
        color: #fff;
      }

      .header > .left {
        display: grid;
        grid-row-gap: 5px;
        text-align: left;
      }

      .header .info {
        font-family: 'FontOver';
        font-style: normal;
        font-weight: 500;
        font-size: 30px;
        line-height: 100%;
      }

      .header .desc {
        font-family: 'ChakraPetch';
        font-style: normal;
        font-weight: 500;
        font-size: 14px;
        line-height: 100%;
      }

      .header .price {
        font-family: 'FontOver';
        font-style: normal;
        font-weight: 500;
        font-size: 24px;
        line-height: 130%;
      }

      .header .spotPrice {
        font-family: 'ChakraPetch';
        font-style: normal;
        font-weight: 500;
        font-size: 14px;
        line-height: 100%;
      }

      .header > .right {
        display: block;
        text-align: right;
      }

      .chart {
        height: 100%;
      }

      uigc-toggle-button {
        font-family: 'ChakraPetch';
        font-weight: 500;
        font-size: 11px;
        padding: 0 2px;
        margin-left: -2px;
      }
    `,
  ];

  calculateDollarPrice(asset: string, amount: string) {
    if (this.usdPrice.size == 0) {
      return null;
    }

    const usdPrice = this.usdPrice.get(asset);
    if (usdPrice == null) {
      return Number(amount).toFixed(4);
    }
    return multipleAmounts(amount, usdPrice).toFixed(2);
  }

  render() {
    const spotUsd = this.spotPrice ? this.calculateDollarPrice(this.assetOut, this.spotPrice) : null;
    return html`
      <div class="header">
        <div class="left">
          ${when(
            this.assetIn || this.assetOut,
            () => html` <div class="info">${this.assetIn ?? '-'} / ${this.assetOut ?? '-'}</div>`,
            () => html` <div class="info">Loading...</div>`
          )}
          <uigc-period-selector
            selected=${this.period}
            @toggle-button-clicked=${(e: CustomEvent) => {
              this.period = e.detail.value;
            }}
          >
            ${PERIOD_OPTS.map(
              (s: string) => html` <uigc-toggle-button size="small" value=${s}>${s}</uigc-toggle-button> `
            )}
          </uigc-period-selector>
        </div>
        ${when(
          this.spotPrice,
          () => html` <div class="right">
            <div class="price">${humanizeAmount(this.spotPrice)} ${this.assetOut}</div>
            <div class="spotPrice">$${humanizeAmount(spotUsd)}</div>
          </div>`
        )}
      </div>
      <gc-chart .data=${this.data}></gc-chart>
    `;
  }
}
