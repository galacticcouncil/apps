import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { choose } from 'lit/directives/choose.js';
import { when } from 'lit/directives/when.js';
import { classMap } from 'lit/directives/class-map.js';

import * as i18n from 'i18next';

import { baseStyles } from '../styles/base.css';
import { formStyles } from '../styles/form.css';

import { humanizeAmount } from '../../utils/amount';
import { Account, accountCursor } from '../../db';

import { PoolAsset, TradeType } from '@galacticcouncil/sdk';
import { DatabaseController } from '../../db.ctrl';
import { TransactionFee } from './types';

@customElement('gc-trade-form')
export class TradeForm extends LitElement {
  private account = new DatabaseController<Account>(this, accountCursor);

  @property({ attribute: false }) assets: Map<string, PoolAsset> = new Map([]);
  @property({ attribute: false }) pairs: Map<string, PoolAsset[]> = new Map([]);
  @property({ attribute: false }) tradeType: TradeType = TradeType.Buy;
  @property({ type: Boolean }) inProgress = false;
  @property({ type: Boolean }) disabled = false;
  @property({ type: Boolean }) switchAllowed = true;
  @property({ type: Object }) assetIn: PoolAsset = null;
  @property({ type: Object }) assetOut: PoolAsset = null;
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
  @property({ attribute: false }) tradeFeeRange = null;
  @property({ attribute: false }) transactionFee: TransactionFee = null;
  @property({ attribute: false }) error = {};
  @property({ attribute: false }) swaps: [] = [];

  static styles = [
    baseStyles,
    formStyles,
    css`
      :host {
        display: flex;
        flex-direction: column;
        height: 100%;
      }

      .transfer {
        display: flex;
        position: relative;
        flex-direction: column;
        padding: 0 14px;
        gap: 14px;
        box-sizing: border-box;
      }

      @media (max-width: 480px) {
        .transfer {
          padding: 0;
        }
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

      .info .route-label {
        background: var(--uigc-app-font-color__gradient);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        font-weight: 500;
        font-size: 12px;
        line-height: 100%;
        text-align: center;
      }

      .info .route-icon {
        margin-left: 12px;
      }

      .info uigc-icon-chevron-right {
        width: 22px;
        height: 22px;
      }

      .info uigc-icon-route {
        margin-left: 12px;
      }

      .indicator {
        display: flex;
        padding: 1px 2px;
        align-items: flex-start;
        gap: 1px;
      }

      .indicator > span {
        width: 16px;
        height: 6px;
        background: rgba(135, 139, 163, 0.2);
      }

      .indicator.low > span:nth-of-type(1) {
        background: #30ffb1;
      }

      .indicator.medium span:nth-of-type(2) {
        background: #f7bf06;
      }

      .indicator.high span:nth-of-type(3) {
        background: #ff931e;
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

  maxClickHandler(id: string, asset: PoolAsset) {
    return function (_e: Event) {
      const options = {
        bubbles: true,
        composed: true,
        detail: { id: id, asset: asset },
      };
      this.dispatchEvent(new CustomEvent('asset-max-clicked', options));
    };
  }

  infoSlippageTemplate(assetSymbol: string) {
    return html` ${choose(this.tradeType, [
        [TradeType.Sell, () => html` <span class="label">Minimum received:</span>`],
        [TradeType.Buy, () => html` <span class="label">Maximum sent:</span>`],
      ])}
      <span class="grow"></span>
      ${when(
        this.inProgress,
        () => html`<uigc-skeleton progress rectangle width="150px" height="12px"></uigc-skeleton>`,
        () =>
          html`<span class="value"
            >${this.afterSlippage ? humanizeAmount(this.afterSlippage) : '0'} ${assetSymbol}
          </span>`
      )}`;
  }

  infoPriceImpactTemplate() {
    return html` <span class="label">${i18n.t('trade.priceImpact')}</span>
      <span class="grow"></span>
      ${when(
        this.inProgress,
        () => html`<uigc-skeleton progress rectangle width="80px" height="12px"></uigc-skeleton>`,
        () => html`<span class="value">${this.priceImpactPct}%</span>`
      )}`;
  }

  infoTradeFeeDetail(assetSymbol: string) {
    if (this.inProgress) {
      return html`<uigc-skeleton progress rectangle width="80px" height="12px"></uigc-skeleton>`;
    }

    if (this.tradeFeeRange) {
      const max = this.tradeFeeRange[1];
      const min = this.tradeFeeRange[0];
      const fraction = (max - min) / 3;
      const mediumLow = min + fraction;
      const mediumHigh = max - fraction;
      const fee = Number(this.tradeFeePct);
      const indicatorClasses = {
        indicator: true,
        low: fee < mediumLow,
        medium: fee >= mediumLow && fee <= mediumHigh,
        high: fee > mediumHigh,
      };
      return html` <span class="value">${humanizeAmount(this.tradeFee)} ${assetSymbol}</span>
        <span class="value highlight"> (${this.tradeFeePct}%) </span>
        <span class=${classMap(indicatorClasses)}>
          <span></span>
          <span></span>
          <span></span>
        </span>`;
    }

    return html`<span class="value">${humanizeAmount(this.tradeFee)} ${assetSymbol}</span>
      <span class="value highlight"> (${this.tradeFeePct}%) </span> `;
  }

  infoTradeFeeTemplate(assetSymbol: string) {
    return html`
      <span class="label">${i18n.t('trade.tradeFee')}</span>
      <span class="grow"></span>
      ${this.infoTradeFeeDetail(assetSymbol)}
    `;
  }

  infoTransactionFeeTemplate() {
    return html`
      <span class="label">${i18n.t('trade.txFee')}</span>
      <span class="grow"></span>
      ${when(
        this.inProgress,
        () => html`<uigc-skeleton progress rectangle width="80px" height="12px"></uigc-skeleton>`,
        () =>
          html`<span class="value"
            >${this.transactionFee
              ? humanizeAmount(this.transactionFee.amount) + ' ' + this.transactionFee.asset
              : '-'}</span
          >`
      )}
    `;
  }

  bestRouteTemplate() {
    const bestRoute = this.swaps.map((swap: any) => this.assets.get(swap.assetOut).symbol);
    this.tradeType == TradeType.Buy && bestRoute.reverse();
    return html`
      <span class="value">${this.assetIn.symbol}</span>
      ${bestRoute.map(
        (poolAsset: string) =>
          html`
            <uigc-icon-chevron-right></uigc-icon-chevron-right>
            <span class="value">${poolAsset}</span>
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
    const assetSymbol = this.tradeType == TradeType.Sell ? this.assetOut?.symbol : this.assetIn?.symbol;
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
      show: Object.keys(this.error).length > 0 && this.swaps.length > 0,
    };
    return html`
      <slot name="header"></slot>
      <div class="transfer">
        <uigc-asset-transfer
          id="assetIn"
          title="${i18n.t('trade.payWith')}"
          .asset=${this.assetIn?.symbol}
          .amount=${this.amountIn}
          .amountUsd=${this.amountInUsd}
        >
          <uigc-asset-balance
            slot="balance"
            .balance=${this.balanceIn}
            .formatter=${humanizeAmount}
            .onMaxClick=${this.maxClickHandler('assetIn', this.assetIn)}
          ></uigc-asset-balance>
        </uigc-asset-transfer>
        <div class="switch">
          <div class="divider"></div>
          <uigc-asset-switch class="switch-button" ?disabled=${!this.switchAllowed}> </uigc-asset-switch>
          <uigc-asset-price
            class=${classMap(spotPriceClasses)}
            .inputAsset=${this.tradeType == TradeType.Sell ? this.assetIn?.symbol : this.assetOut?.symbol}
            .outputAsset=${this.tradeType == TradeType.Sell ? this.assetOut?.symbol : this.assetIn?.symbol}
            .outputBalance=${this.spotPrice}
            .loading=${this.inProgress}
          >
          </uigc-asset-price>
        </div>
        <uigc-asset-transfer
          id="assetOut"
          title="${i18n.t('trade.youGet')}"
          .asset=${this.assetOut?.symbol}
          .amount=${this.amountOut}
          .amountUsd=${this.amountOutUsd}
        >
          <uigc-asset-balance
            slot="balance"
            .balance=${this.balanceOut}
            .formatter=${humanizeAmount}
            .onMaxClick=${this.maxClickHandler('assetOut', this.assetOut)}
          ></uigc-asset-balance>
        </uigc-asset-transfer>
      </div>
      <div class=${classMap(infoClasses)}>
        <div class="row">${this.infoSlippageTemplate(assetSymbol)}</div>
        <div class="row">${this.infoPriceImpactTemplate()}</div>
        <div class="row">${this.infoTradeFeeTemplate(assetSymbol)}</div>
        <div class="row">${this.infoTransactionFeeTemplate()}</div>
        ${when(this.swaps.length > 1, () => html` <div class="row">${this.infoBestRouteTemplate()}</div>`)}
      </div>
      <div class=${classMap(errorClasses)}>
        <uigc-icon-error></uigc-icon-error>
        <span> ${this.error['pool'] || this.error['trade'] || this.error['balance']} </span>
      </div>
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
