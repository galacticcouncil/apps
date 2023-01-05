import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { choose } from 'lit/directives/choose.js';
import { when } from 'lit/directives/when.js';
import { classMap } from 'lit/directives/class-map.js';

import * as i18n from 'i18next';

import { baseStyles } from '../base.css';
import { humanizeAmount, subAmounts } from '../../utils/amount';
import { Account, accountCursor } from '../../db';

import { PoolAsset, TradeType } from '@galacticcouncil/sdk';
import { DatabaseController } from '../../db.ctrl';

@customElement('gc-trade-app-main')
export class TradeTokens extends LitElement {
  private account = new DatabaseController<Account>(this, accountCursor);

  @property({ attribute: false }) assets: Map<string, PoolAsset> = new Map([]);
  @property({ attribute: false }) tradeType: TradeType = TradeType.Sell;
  @property({ type: Boolean }) inProgress = false;
  @property({ type: Boolean }) disabled = false;
  @property({ type: String }) assetIn = null;
  @property({ type: String }) assetOut = null;
  @property({ type: String }) amountIn = null;
  @property({ type: String }) amountInUsd = null;
  @property({ type: String }) amountOut = null;
  @property({ type: String }) amountOutUsd = null;
  @property({ type: String }) balanceIn = null;
  @property({ type: String }) balanceOut = null;
  @property({ type: String }) spotPrice = null;
  @property({ type: String }) afterSlippage = '0';
  @property({ type: String }) priceImpactPct = '0';
  @property({ type: String }) tradeFee = '0';
  @property({ type: String }) tradeFeePct = '0';
  @property({ attribute: false }) transactionFee = null;
  @property({ attribute: false }) error = {};
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
        position: relative;
        display: flex;
        padding: 22px 28px;
        box-sizing: border-box;
        align-items: center;
        height: 84px;
      }

      .header uigc-typography {
        margin-top: 5px;
      }

      .transfer {
        display: flex;
        position: relative;
        flex-direction: column;
        padding: 0 14px;
        gap: 14px;
        box-sizing: border-box;
      }

      @media (min-width: 768px) {
        .transfer {
          padding: 0 28px;
        }
      }

      .transfer .divider {
        background: var(--uigc-divider-background);
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

      .transfer uigc-asset-switch {
        background: var(--uigc-asset-switch-background);
      }

      .transfer .switch-button {
        position: absolute;
        left: 14px;
        border-radius: 50%;
      }

      @media (min-width: 768px) {
        .transfer .switch-button {
          left: 28px;
        }
      }

      .transfer .switch-button > img {
        height: 100%;
      }

      .transfer .spot-price {
        position: absolute;
        right: 14px;
        background: #23282b;
        border-radius: 7px;
        display: none;
      }

      @media (min-width: 768px) {
        .transfer .spot-price {
          right: 28px;
        }
      }

      .transfer .spot-price.show {
        display: block;
      }

      .info {
        display: none;
        flex-direction: column;
        margin-top: 10px;
        padding: 0 24px;
        box-sizing: border-box;
      }

      .info.show {
        display: flex;
      }

      @media (min-width: 768px) {
        .info {
          padding: 0 38px;
        }
      }

      .info .row {
        display: flex;
        align-items: center;
        position: relative;
        gap: 5px;
        padding: 4px 0;
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
        text-align: left;
        color: var(--uigc-app-font-color__secondary);
      }

      .info .route-label {
        background: var(--uigc-app-font-color__gradient);
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
        text-align: right;
        color: var(--hex-white);
      }

      .info .value + .highlight {
        color: var(--uigc-app-font-color__primary);
      }

      .info uigc-icon-chevron-right {
        width: 22px;
        height: 22px;
      }

      .info uigc-icon-route {
        margin-left: 12px;
      }

      .error {
        display: none;
        flex-direction: row;
        align-items: center;
        margin: 12px 14px 0;
        padding: 12px 14px;
        background: var(--uigc-app-bg-error);
        border-radius: var(--uigc-app-border-radius-2);
      }

      @media (min-width: 768px) {
        .error {
          margin: 12px 28px 0;
        }
      }

      .error.show {
        display: flex;
      }

      .error span {
        color: var(--hex-white);
        font-weight: 500;
        font-size: 12px;
        line-height: 16px;
      }

      .error uigc-icon-error {
        margin-right: 8px;
      }

      .confirm {
        display: flex;
        padding: 22px 14px;
        box-sizing: border-box;
      }

      @media (min-width: 768px) {
        .confirm {
          padding: 22px 28px;
        }
      }
    `,
  ];

  calculateEffectiveBalance(balance: string, asset: string) {
    if (!this.transactionFee) {
      return;
    }

    const txFee = this.transactionFee[0];
    const txFeeAsset = this.transactionFee[1];
    if (asset == txFeeAsset) {
      const balanceNum = Number(balance);
      const feeNum = Number(txFee);
      const result = balanceNum > feeNum ? balanceNum - feeNum : 0;
      return result.toString();
    } else {
      return balance;
    }
  }

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
        () => html`<uigc-skeleton progress rectangle width="150px" height="14px"></uigc-skeleton>`,
        () =>
          html`<span class="value"
            >${this.afterSlippage ? humanizeAmount(this.afterSlippage) : '0'} ${assetSymbol}
          </span>`
      )}`;
  }

  infoPriceImpactTemplate() {
    return html` <span class="label">Price Impact:</span>
      <span class="grow"></span>
      ${when(
        this.inProgress,
        () => html`<uigc-skeleton progress rectangle width="80px" height="14px"></uigc-skeleton>`,
        () => html`<span class="value">${this.priceImpactPct}%</span>`
      )}`;
  }

  infoTradeFeeTemplate(assetSymbol: string) {
    return html` <span class="label">Trade Fee:</span>
      <span class="grow"></span>
      ${when(
        this.inProgress,
        () => html`<uigc-skeleton progress rectangle width="80px" height="14px"></uigc-skeleton>`,
        () => html`<span class="value">${humanizeAmount(this.tradeFee)} ${assetSymbol}</span>
          <span class="value highlight"> (${this.tradeFeePct}%) </span> `
      )}`;
  }

  infoTransactionFeeTemplate() {
    return html`
      <span class="label">${i18n.t('trade.txFee')}</span>
      <span class="grow"></span>
      ${when(
        this.inProgress,
        () => html`<uigc-skeleton progress rectangle width="80px" height="14px"></uigc-skeleton>`,
        () =>
          html`<span class="value"
            >${this.transactionFee ? this.transactionFee[0] + ' ' + this.transactionFee[1] : '-'}</span
          >`
      )}
    `;
  }

  bestRouteTemplate() {
    return html`
      <span class="value">${this.assetIn}</span>
      ${this.swaps.map(
        (swap: any) =>
          html`
            <uigc-icon-chevron-right></uigc-icon-chevron-right>
            <span class="value">${this.assets.get(swap.assetOut).symbol}</span>
          `
      )}
      <uigc-icon-route></uigc-icon-route>
    `;
  }

  infoBestRouteTemplate() {
    return html`
      <span class="route-label">${i18n.t('trade.bestRoute')}</span>
      <span class="grow"></span>
      ${when(
        this.inProgress,
        () => html`<uigc-skeleton progress width="130px" height="14px"></uigc-skeleton>`,
        () => this.bestRouteTemplate()
      )}
    `;
  }

  render() {
    const assetSymbol = this.tradeType == TradeType.Sell ? this.assetOut : this.assetIn;
    const infoClasses = {
      info: true,
      show: this.swaps.length > 0,
    };
    const spotPriceClasses = {
      'spot-price': true,
      show: this.spotPrice || this.inProgress,
    };
    const errorClasses = {
      error: true,
      show: Object.keys(this.error).length > 0,
    };
    return html`
      <div class="header">
        <uigc-typography variant="title">${i18n.t('trade.title')}</uigc-typography>
        <span class="grow"></span>
        <uigc-icon-button @click=${this.onSettingsClick}>
          <uigc-icon-settings></uigc-icon-settings>
        </uigc-icon-button>
      </div>
      <div class="transfer">
        <uigc-asset-transfer
          id="assetIn"
          title="${i18n.t('trade.payWith')}"
          .asset=${this.assetIn}
          .amount=${this.amountIn}
          .amountUsd=${this.amountInUsd}
          .balance=${this.balanceIn}
          .effectiveBalance=${this.calculateEffectiveBalance(this.balanceIn, this.assetIn)}
          .formatter=${humanizeAmount}
        ></uigc-asset-transfer>
        <div class="switch">
          <div class="divider"></div>
          <uigc-asset-switch class="switch-button"> </uigc-asset-switch>
          <uigc-asset-price
            class=${classMap(spotPriceClasses)}
            .inputAsset=${this.tradeType == TradeType.Sell ? this.assetIn : this.assetOut}
            .outputAsset=${this.tradeType == TradeType.Sell ? this.assetOut : this.assetIn}
            .outputBalance=${humanizeAmount(this.spotPrice)}
            .loading=${this.inProgress}
          >
          </uigc-asset-price>
        </div>
        <uigc-asset-transfer
          id="assetOut"
          title="${i18n.t('trade.youGet')}"
          .asset=${this.assetOut}
          .amount=${this.amountOut}
          .amountUsd=${this.amountOutUsd}
          .balance=${this.balanceOut}
          .effectiveBalance=${this.calculateEffectiveBalance(this.balanceOut, this.assetOut)}
          .formatter=${humanizeAmount}
        ></uigc-asset-transfer>
      </div>
      <div class=${classMap(infoClasses)}>
        <div class="row">${this.infoSlippageTemplate(assetSymbol)}</div>
        <div class="row">${this.infoPriceImpactTemplate()}</div>
        <div class="row">${this.infoTradeFeeTemplate(assetSymbol)}</div>
        <div class="row">${this.infoTransactionFeeTemplate()}</div>
        ${when(
          this.swaps.length > 1 && !this.inProgress,
          () => html` <div class="row">${this.infoBestRouteTemplate()}</div>`
        )}
      </div>
      <div class=${classMap(errorClasses)}>
        <uigc-icon-error></uigc-icon-error>
        <span> ${this.error['balance'] || this.error['trade']} </span>
      </div>
      <div class="grow"></div>
      <uigc-button
        ?disabled=${this.disabled || !this.account.state}
        class="confirm"
        variant="primary"
        fullWidth
        @click=${this.onSwapClick}
        >${this.account.state ? i18n.t('trade.swap') : i18n.t('trade.connect')}</uigc-button
      >
    `;
  }
}
