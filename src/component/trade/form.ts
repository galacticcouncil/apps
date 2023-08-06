import { html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { choose } from 'lit/directives/choose.js';
import { when } from 'lit/directives/when.js';
import { classMap } from 'lit/directives/class-map.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

import * as i18n from 'i18next';

import { baseStyles } from '../styles/base.css';
import { formStyles } from '../styles/form.css';

import { Account, accountCursor } from '../../db';
import { DatabaseController } from '../../db.ctrl';
import { TradeTwap, TradeTwapError } from '../../api/trade';
import { humanizeAmount, multipleAmounts } from '../../utils/amount';

import { PoolAsset, TradeType, bnum, calculateDiffToRef } from '@galacticcouncil/sdk';
import { TransactionFee } from './types';

import { BaseElement } from '../base/BaseElement';

@customElement('gc-trade-form')
export class TradeForm extends BaseElement {
  private account = new DatabaseController<Account>(this, accountCursor);

  @state() twapEnabled: boolean = false;

  @property({ attribute: false }) assets: Map<string, PoolAsset> = new Map([]);
  @property({ attribute: false }) pairs: Map<string, PoolAsset[]> = new Map([]);
  @property({ attribute: false }) tradeType: TradeType = TradeType.Buy;
  @property({ type: Boolean }) inProgress = false;
  @property({ type: Boolean }) disabled = false;
  @property({ type: Boolean }) switchAllowed = true;
  @property({ attribute: false }) twap: TradeTwap = null;
  @property({ type: Boolean }) twapAllowed = false;
  @property({ type: Boolean }) twapProgress = false;
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

      .info .positive {
        color: #30ffb1;
      }

      .info .negative {
        color: #ff6868;
      }

      .cta {
        overflow: hidden;
        width: 100%;
        height: 50px;
        margin: -16px;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
      }

      .cta > span {
        position: absolute;
        transition: top 0.3s;
        -moz-transition: top 0.3s;
        -webkit-transition: top 0.3s;
        -o-transition: top 0.3s;
        -ms-transition: top 0.3s;
      }

      .cta > span.swap {
        top: 16px;
      }

      .cta > span.twap {
        top: 56px;
      }

      .cta__twap > span.swap {
        top: -56px;
      }

      .cta__twap > span.twap {
        top: 16px;
      }

      .hidden {
        display: none;
      }

      .summary div.skeleton {
        gap: 5px;
        display: flex;
        flex-direction: column;
      }
    `,
  ];

  private hasGeneralError(): boolean {
    const generalErrors = Object.assign({}, this.error);
    delete generalErrors['balance'];
    return Object.keys(generalErrors).length > 0;
  }

  private hasTradeError(): boolean {
    return Object.keys(this.error).length > 0;
  }

  private hasTwapError(): boolean {
    const generalErrors = Object.assign({}, this.error);
    delete generalErrors['trade'];
    const hasError = Object.keys(generalErrors).length > 0;
    const hasTwapError = this.twapEnabled && !!this.twap?.tradeError;
    return hasError || hasTwapError;
  }

  private isDisabled(): boolean {
    if (this.twapEnabled) {
      return this.disabled || this.hasTwapError();
    }
    return this.disabled || this.hasTradeError();
  }

  private isSignificantPriceImpact(): boolean {
    return Number(this.priceImpactPct) <= -1;
  }

  private toggleTwap() {
    this.twapEnabled = !this.twapEnabled;
    const options = {
      bubbles: true,
      composed: true,
      detail: { active: this.twapEnabled },
    };
    this.dispatchEvent(new CustomEvent('twap-toggled', options));
  }

  private calculateTwapPrice() {
    const { tradeReps, orderSlippage, budget } = this.twap;
    if (this.tradeType === TradeType.Sell) {
      return multipleAmounts(tradeReps.toString(), orderSlippage);
    } else {
      return budget;
    }
  }

  private calculateTwapPriceDiff(twapPrice: number) {
    const swapPrice = Number(this.afterSlippage);
    const swapPriceBN = bnum(swapPrice);
    const twapPriceBN = bnum(twapPrice);
    if (this.tradeType === TradeType.Sell) {
      return calculateDiffToRef(twapPriceBN, swapPriceBN).toNumber();
    } else {
      return calculateDiffToRef(swapPriceBN, twapPriceBN).toNumber();
    }
  }

  onSettingsClick(e: any) {
    const options = {
      bubbles: true,
      composed: true,
    };
    this.dispatchEvent(new CustomEvent('settings-clicked', options));
  }

  onCtaClick(e: any) {
    const options = {
      bubbles: true,
      composed: true,
    };

    if (this.twapEnabled) {
      this.dispatchEvent(new CustomEvent('twap-clicked', options));
    } else {
      this.dispatchEvent(new CustomEvent('swap-clicked', options));
    }
  }

  onSetupClick(e: any) {
    const options = {
      bubbles: true,
      composed: true,
    };
    this.dispatchEvent(new CustomEvent('setup-clicked', options));
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
    const priceImpactClasses = {
      value: true,
      text_error: this.isSignificantPriceImpact(),
    };
    return html` <span class="label">${i18n.t('trade.priceImpact')}</span>
      <span class="grow"></span>
      ${when(
        this.inProgress,
        () => html`<uigc-skeleton progress rectangle width="80px" height="12px"></uigc-skeleton>`,
        () => html`<span class=${classMap(priceImpactClasses)}>${this.priceImpactPct}%</span>`
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

  infoTwapSummaryTemplate() {
    if (this.twapProgress || !this.twap) {
      return html` <span class="label">${i18n.t('twap.summary')}</span>
        <div class="skeleton">
          <uigc-skeleton progress rectangle width="200px" height="21px"></uigc-skeleton>
          <uigc-skeleton progress rectangle width="250px" height="14px"></uigc-skeleton>
          <uigc-skeleton progress rectangle width="250px" height="14px"></uigc-skeleton>
        </div>`;
    }

    const { tradeReps, tradeTime, trade, tradeError, budget } = this.twap;
    const tradeHuman = trade.toHuman();
    const timeframe = this._humanizer.humanize(tradeTime, { round: true, largest: 2 });

    if (tradeError) {
      return html`
        <span class="label">${i18n.t('twap.summary')}</span>
        <span class="message">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M6 4H20V6H22V12H14V14H20V16H16V18H14V20H2V8H4V6H6V4ZM8 10H10V8H8V10Z" fill="#FF6868" />
          </svg>
          ${choose(tradeError, [
            [
              TradeTwapError.OrderTooSmall,
              () => html` <span class="label">${i18n.t('twap.error.minOrderSize')}</span>`,
            ],
            [TradeTwapError.OrderTooBig, () => html` <span class="label">${i18n.t('twap.error.maxOrderSize')}</span>`],
            [
              TradeTwapError.OrderImpactTooBig,
              () => html` <span class="label">${i18n.t('twap.error.maxOrderSize')}</span>`,
            ],
          ])}
        </span>
      `;
    } else {
      return html`
        <span class="label">${i18n.t('twap.summary')}</span>
        <span>
          <span class="value">${tradeReps} trades</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="6" height="7" viewBox="0 0 6 7" fill="none">
            <line x1="0.353553" y1="1.16671" x2="5.13786" y2="5.95101" stroke="#878C9E" />
            <line x1="5.22074" y1="1.07743" x2="0.436439" y2="5.86173" stroke="#878C9E" />
          </svg>
          <span class="value">${humanizeAmount(tradeHuman.amountIn)} ${this.assetIn?.symbol}</span>
        </span>
        <span class="value small">${unsafeHTML(i18n.t('twap.timeframe', { timeframe: timeframe }))}</span>
        <span class="value small"
          >${unsafeHTML(
            i18n.t('twap.totalAmount', {
              amount: humanizeAmount(budget.toString()),
              symbol: this.assetIn?.symbol,
            })
          )}</span
        >
      `;
    }
  }

  infoTwapSlippageTemplate(assetSymbol: string) {
    return html` ${choose(this.tradeType, [
        [TradeType.Sell, () => html` <span class="label">${i18n.t('twap.minReceived')}</span>`],
        [TradeType.Buy, () => html` <span class="label">${i18n.t('twap.maxSpent')}:</span>`],
      ])}
      <span class="grow"></span>
      ${when(
        this.twapProgress || !this.twap,
        () => html`<uigc-skeleton progress rectangle width="150px" height="12px"></uigc-skeleton>`,
        () => {
          const { tradeError } = this.twap;
          const twapPrice = this.calculateTwapPrice();
          const twapDiff = this.calculateTwapPriceDiff(twapPrice);
          const twapDiffAbs = Math.abs(twapDiff);
          const twapSellSymbol = twapDiff >= 0 ? '+' : '-';
          const twapBuySymbol = twapDiff > 0 ? '-' : '+';
          const twapSymbol = this.tradeType === TradeType.Sell ? twapSellSymbol : twapBuySymbol;
          const twapClasses = {
            hidden: !!tradeError,
            value: true,
            positive: twapDiff > 0,
            negative: twapDiff < 0,
          };

          return html`<span class="value"
              >${tradeError ? '-' : humanizeAmount(twapPrice.toString()) + assetSymbol}</span
            >
            <span class=${classMap(twapClasses)}>(${twapSymbol}${twapDiffAbs}%)</span>`;
        }
      )}`;
  }

  formAssetInTemplate() {
    const error = this.error['balance'];
    return html` <uigc-asset-transfer
      id="assetIn"
      title="${i18n.t('trade.payWith')}"
      ?error=${error}
      .error=${error}
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
    </uigc-asset-transfer>`;
  }

  formAssetOutTemplate() {
    return html` <uigc-asset-transfer
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
    </uigc-asset-transfer>`;
  }

  formSwitch() {
    const spotPriceClasses = {
      'spot-price': true,
      show: this.spotPrice || this.inProgress,
    };
    return html`
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
    `;
  }

  formTwapSwitch() {
    const smartSplitClasses = {
      'form-switch': true,
      hidden: !(this.swaps.length > 0 && this.twapAllowed),
    };
    return html`
      <div class=${classMap(smartSplitClasses)}>
        <div>
          <span class="title">${i18n.t('twap.title')}</span>
          <span class="desc">${i18n.t('twap.desc')}</span>
          <span></span>
        </div>
        <uigc-switch
          .checked=${this.twapEnabled}
          ?disabled=${!this.transactionFee}
          ?highlight=${this.isSignificantPriceImpact()}
          size="small"
          @click=${() => this.transactionFee && this.toggleTwap()}
        ></uigc-switch>
      </div>
    `;
  }

  render() {
    const assetSymbol = this.tradeType == TradeType.Sell ? this.assetOut?.symbol : this.assetIn?.symbol;
    const ctaClasses = {
      cta: true,
      cta__twap: this.twapEnabled,
    };
    const twapClasses = {
      info: true,
      show: this.swaps.length > 0 && this.twapEnabled,
    };
    const swapClasses = {
      info: true,
      show: this.swaps.length > 0 && !this.twapEnabled,
    };
    const errorClasses = {
      error: true,
      show: this.swaps.length > 0 && !this.twapEnabled && this.hasGeneralError(),
    };
    return html`
      <slot name="header"></slot>
      <div class="transfer">
        ${this.formAssetInTemplate()} ${this.formSwitch()} ${this.formAssetOutTemplate()} ${this.formTwapSwitch()}
      </div>
      <div class=${classMap(twapClasses)}>
        <div class="row summary show">${this.infoTwapSummaryTemplate()}</div>
        <div class="row">${this.infoTwapSlippageTemplate(assetSymbol)}</div>
      </div>
      <div class=${classMap(swapClasses)}>
        <div class="row">${this.infoSlippageTemplate(assetSymbol)}</div>
        <div class="row">${this.infoPriceImpactTemplate()}</div>
        <div class="row">${this.infoTradeFeeTemplate(assetSymbol)}</div>
        <div class="row">${this.infoTransactionFeeTemplate()}</div>
        ${when(this.swaps.length > 1, () => html` <div class="row">${this.infoBestRouteTemplate()}</div>`)}
      </div>
      <div class=${classMap(errorClasses)}>
        <uigc-icon-error></uigc-icon-error>
        <span> ${this.error['pool'] || this.error['trade']} </span>
      </div>
      <uigc-button ?disabled=${this.isDisabled()} class="confirm" variant="primary" fullWidth @click=${this.onCtaClick}>
        <div class=${classMap(ctaClasses)}>
          <span class="swap">${this.account.state ? i18n.t('trade.swap') : i18n.t('trade.connect')}</span>
          <span class="twap">${this.account.state ? i18n.t('trade.twap') : i18n.t('trade.connect')}</span>
        </div>
      </uigc-button>
    `;
  }
}
