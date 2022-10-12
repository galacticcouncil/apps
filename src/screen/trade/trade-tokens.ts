import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { choose } from 'lit/directives/choose.js';

import { baseStyles } from '../../base.css';

import '../../component/AssetTransfer';
import '../../component/AssetPrice';
import '../../component/AssetSwitch';
import '../../component/Divider';
import '../../component/Paper';
import '../../component/IconButton';
import '../../component/Button';

import { TradeType } from '@galacticcouncil/sdk';

@customElement('app-trade-tokens')
export class TradeTokens extends LitElement {
  @property({ type: String }) assetIn = null;
  @property({ type: String }) amountIn = '0';
  @property({ type: String }) assetOut = null;
  @property({ type: String }) amountOut = '0';
  @property({ type: String }) spotPrice = '0';
  @property({ attribute: false }) tradeType = TradeType.Sell;

  static styles = [
    baseStyles,
    css`
      :host {
        display: flex;
        flex-direction: column;
        height: 100%;
      }

      .header {
        display: flex;
        padding: 22px 28px;
        box-sizing: border-box;
      }

      .header h1 {
        background: var(--gradient-label);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .transfer {
        display: flex;
        flex-direction: column;
        padding: 0 28px;
        gap: 14px;
        box-sizing: border-box;
      }

      .transfer .divider {
        background: rgba(var(--rgb-primary-450), 0.12);
        height: 1px;
        width: 100%;
        left: 0;
        position: absolute;
      }

      .transfer .switch {
        align-items: center;
        display: flex;
        height: 43px;
        justify-content: space-between;
        width: 100%;
      }

      .transfer .switch-button {
        position: absolute;
        left: 14px;
        border-radius: 50%;
        background: var(--hex-poison-green);
      }

      .transfer .switch-button > img {
        height: 100%;
      }

      .transfer .switch-price {
        position: absolute;
        right: 14px;
        background: #23282b;
        border-radius: 7px;
      }

      .info {
        display: flex;
        flex-direction: column;
        margin-top: 10px;
        padding: 0 38px;
        box-sizing: border-box;
      }

      .info .row {
        display: flex;
        align-items: center;
        height: 30px;
        position: relative;
      }

      .info .row:not(:last-child):after {
        background-color: var(--hex-background-gray-800);
        bottom: 0;
        content: ' ';
        height: 1px;
        position: absolute;
        width: 100%;
      }

      .info .label {
        font-weight: 500;
        font-size: 14px;
        line-height: 22px;
        text-align: center;
        color: var(--hex-neutral-gray-300);
      }

      .info .value {
        font-weight: 500;
        font-size: 14px;
        line-height: 22px;
        text-align: center;
        color: var(--hex-white);
      }

      .confirm {
        display: flex;
        padding: 22px 28px;
        box-sizing: border-box;
      }
    `,
  ];

  onSettingsClick(e: any) {
    const options = {
      bubbles: true,
      composed: true,
    };
    this.dispatchEvent(new CustomEvent('settings-clicked', options));
  }

  render() {
    return html`
      <div class="header">
        <h1>Trade Tokens</h1>
        <span class="grow"></span>
        <ui-icon-button @click=${this.onSettingsClick}>
          <img src="assets/img/icon/settings.svg" alt="settings" />
        </ui-icon-button>
      </div>
      <div class="transfer">
        <ui-asset-transfer
          id="assetIn"
          title="Pay with"
          .asset=${this.assetIn}
          .amount=${this.amountIn}
        ></ui-asset-transfer>
        <div class="switch">
          <div class="divider"></div>
          <ui-asset-switch class="switch-button"> </ui-asset-switch>
          <ui-asset-price
            .inputAsset=${this.tradeType == TradeType.Sell ? this.assetIn : this.assetOut}
            .outputAsset=${this.tradeType == TradeType.Sell ? this.assetOut : this.assetIn}
            .outputBalance=${this.spotPrice}
            class="switch-price"
          >
          </ui-asset-price>
        </div>
        <ui-asset-transfer
          id="assetOut"
          title="You get"
          .asset=${this.assetOut}
          .amount=${this.amountOut}
        ></ui-asset-transfer>
      </div>
      <div class="info">
        <div class="row">
          ${choose(this.tradeType, [
            [TradeType.Sell, () => html` <span class="label">Minimum received after slippage:</span>`],
            [TradeType.Buy, () => html` <span class="label">Maximum sent after slippage:</span>`],
          ])}
          <span class="grow"></span>
          <span class="value">124343 ${this.assetOut} </span>
        </div>
        <div class="row">
          <span class="label">Trade Fee:</span>
          <span class="grow"></span>
          <span class="value">124343 ${this.assetOut}</span>
        </div>
        <div class="row">
          <span class="label">Transaction Fee:</span>
          <span class="grow"></span>
          <span class="value">124343 ${this.assetOut}</span>
        </div>
      </div>
      <div class="grow"></div>
      <ui-button class="confirm" variant="primary" fullWidth>Confirm Swap</ui-button>
    `;
  }
}
