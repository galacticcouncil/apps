import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { choose } from 'lit/directives/choose.js';
import { when } from 'lit/directives/when.js';

import { baseStyles } from '../../base.css';

import '../../component/AssetTransfer';
import '../../component/AssetPrice';
import '../../component/AssetSwitch';
import '../../component/Divider';
import '../../component/Paper';
import '../../component/IconButton';
import '../../component/Button';
import '../../component/Skeleton';

import { PoolAsset, TradeType } from '@galacticcouncil/sdk';

@customElement('app-trade-tokens')
export class TradeTokens extends LitElement {
  @property({ attribute: false }) assets: Map<string, PoolAsset> = new Map([]);
  @property({ attribute: false }) tradeType: TradeType = TradeType.Sell;
  @property({ type: Boolean }) inProgress = false;
  @property({ type: String }) assetIn = null;
  @property({ type: String }) assetOut = null;
  @property({ type: String }) amountIn = null;
  @property({ type: String }) amountOut = null;
  @property({ type: String }) balanceIn = null;
  @property({ type: String }) balanceOut = null;
  @property({ type: String }) spotPrice = null;
  @property({ type: String }) afterSlippage = '0';
  @property({ type: String }) priceImpactPct = '0';
  @property({ type: String }) tradeFee = '0';
  @property({ type: String }) tradeFeePct = '0';
  @property({ type: String }) transactionFee = null;
  @property({ attribute: false }) swaps: [] = [];

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
        gap: 5px;
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

      .info .route-label {
        background: var(--gradient-label);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        font-weight: 500;
        font-size: 14px;
        line-height: 22px;
        text-align: center;
      }

      .info .route-icon {
        margin-left: 12px;
      }

      .info .value {
        font-weight: 500;
        font-size: 14px;
        line-height: 22px;
        text-align: center;
        color: var(--hex-white);
      }

      .info .value + .highlight {
        color: var(--hex-primary-success);
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

  onSwapClick(e: any) {
    const options = {
      bubbles: true,
      composed: true,
    };
    this.dispatchEvent(new CustomEvent('swap-clicked', options));
  }

  infoSlippageTemplate(assetSymbol: string) {
    return html` ${choose(this.tradeType, [
        [TradeType.Sell, () => html` <span class="label">Minimum received after slippage:</span>`],
        [TradeType.Buy, () => html` <span class="label">Maximum sent after slippage:</span>`],
      ])}
      <span class="grow"></span>
      ${when(
        this.inProgress,
        () => html`<ui-skeleton progress width="150px" height="14px"></ui-skeleton>`,
        () => html`<span class="value">${this.afterSlippage} ${assetSymbol} </span>`
      )}`;
  }

  infoPriceImpactTemplate() {
    return html` <span class="label">Price Impact:</span>
      <span class="grow"></span>
      ${when(
        this.inProgress,
        () => html`<ui-skeleton progress width="80px" height="14px"></ui-skeleton>`,
        () => html`<span class="value">${this.priceImpactPct}%</span>`
      )}`;
  }

  infoTradeFeeTemplate(assetSymbol: string) {
    return html` <span class="label">Trade Fee:</span>
      <span class="grow"></span>
      ${when(
        this.inProgress,
        () => html`<ui-skeleton progress width="80px" height="14px"></ui-skeleton>`,
        () => html`<span class="value">${this.tradeFee} ${assetSymbol}</span>
          <span class="value highlight">(${this.tradeFeePct}%)</span>`
      )}`;
  }

  infoTransactionFeeTemplate() {
    return html` <span class="label">Transaction Fee:</span>
      <span class="grow"></span>
      ${when(
        this.inProgress,
        () => html`<ui-skeleton progress width="80px" height="14px"></ui-skeleton>`,
        () => html`<span class="value">${this.transactionFee || '-'}</span>`
      )}`;
  }

  bestRouteTemplate() {
    return html` <span class="value">${this.assetIn}</span>
      ${this.swaps.map(
        (swap: any) =>
          html`
            <img src="assets/img/icon/arrow-right.svg" alt="next" />
            <span class="value">${this.assets.get(swap.assetOut).symbol}</span>
          `
      )}
      <img class="route-icon" src="assets/img/icon/route.svg" alt="route" />`;
  }

  infoBestRouteTemplate() {
    return html`
      <span class="route-label">Best Route</span>
      <span class="grow"></span>
      ${when(
        this.inProgress,
        () => html`<ui-skeleton progress width="130px" height="14px"></ui-skeleton>`,
        () => this.bestRouteTemplate()
      )}
    `;
  }

  render() {
    const assetSymbol = this.tradeType == TradeType.Sell ? this.assetOut : this.assetIn;
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
          .balance=${this.balanceIn}
        ></ui-asset-transfer>
        <div class="switch">
          <div class="divider"></div>
          <ui-asset-switch class="switch-button"> </ui-asset-switch>
          ${when(
            this.spotPrice || this.inProgress,
            () => html`
              <ui-asset-price
                .inputAsset=${this.tradeType == TradeType.Sell ? this.assetIn : this.assetOut}
                .outputAsset=${this.tradeType == TradeType.Sell ? this.assetOut : this.assetIn}
                .outputBalance=${this.spotPrice}
                .loading=${this.inProgress}
                class="switch-price"
              >
              </ui-asset-price>
            `
          )}
        </div>
        <ui-asset-transfer
          id="assetOut"
          title="You get"
          .asset=${this.assetOut}
          .amount=${this.amountOut}
          .balance=${this.balanceOut}
        ></ui-asset-transfer>
      </div>
      ${when(
        this.swaps.length > 0,
        () => html`
          <div class="info">
            <div class="row">${this.infoSlippageTemplate(assetSymbol)}</div>
            <div class="row">${this.infoPriceImpactTemplate()}</div>
            <div class="row">${this.infoTradeFeeTemplate(assetSymbol)}</div>
            <div class="row">${this.infoTransactionFeeTemplate()}</div>
            <div class="row">${this.infoBestRouteTemplate()}</div>
          </div>
        `
      )}
      <div class="grow"></div>
      <ui-button class="confirm" variant="primary" fullWidth @click=${this.onSwapClick}>Confirm Swap</ui-button>
    `;
  }
}
