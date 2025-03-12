import { html, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { choose } from 'lit/directives/choose.js';
import { when } from 'lit/directives/when.js';
import { classMap } from 'lit/directives/class-map.js';

import * as i18n from 'i18next';

import { BaseElement } from 'element/BaseElement';
import {
  Account,
  AccountCursor,
  DatabaseController,
  Ecosystem,
  TradeConfig,
  TradeConfigCursor,
} from 'db';
import { baseStyles, formStyles } from 'styles';
import { exchange, formatAmount, humanizeAmount } from 'utils/amount';
import { isAToken } from 'utils/asset';

import {
  Amount,
  Asset,
  BigNumber,
  ONE,
  Swap,
  Trade,
  TradeType,
  bnum,
  calculateDiffToRef,
} from '@galacticcouncil/sdk';

import { TransactionFee, TwapOrder, TwapError } from './types';

import styles from './Form.css';

@customElement('gc-trade-form')
export class TradeForm extends BaseElement {
  private account = new DatabaseController<Account>(this, AccountCursor);
  private tradeConfig = new DatabaseController<TradeConfig>(
    this,
    TradeConfigCursor,
  );

  @property({ attribute: false }) assets: Map<string, Asset> = new Map([]);
  @property({ attribute: false }) usdPrice: Map<string, Amount> = new Map([]);
  @property({ attribute: false }) ecosystem: Ecosystem = Ecosystem.Polkadot;
  @property({ type: Boolean }) inProgress = false;
  @property({ type: Boolean }) disabled = false;
  @property({ type: Boolean }) loaded = false;
  @property({ type: Boolean }) readonly = false;
  @property({ type: Boolean }) switchAllowed = true;
  @property({ type: Object }) assetIn: Asset = null;
  @property({ type: Object }) assetOut: Asset = null;
  @property({ type: String }) amountIn = null;
  @property({ type: String }) amountOut = null;
  @property({ type: Object }) balanceIn: Amount = null;
  @property({ type: Object }) balanceOut: Amount = null;
  @property({ type: Object }) maxAmountIn: Amount = null;
  @property({ type: Object }) minAmountOut: Amount = null;
  @property({ type: String }) spotPrice = null;
  @property({ attribute: false }) trade: Trade = null;
  @property({ attribute: false }) tradeType: TradeType = TradeType.Buy;
  @property({ attribute: false }) transactionFee: TransactionFee = null;
  @property({ attribute: false }) twap: TwapOrder = null;
  @property({ type: Boolean }) twapAllowed = false;
  @property({ type: Boolean }) twapProgress = false;
  @property({ attribute: false }) error = {};

  @state() twapEnabled: boolean = false;
  @state() isPriceReversed: boolean = false;

  static styles = [baseStyles, formStyles, styles];

  private isTwapError(): boolean {
    return this.twap && !!this.twap?.error;
  }

  private isSellTwap(): boolean {
    return this.twapEnabled && this.tradeType === TradeType.Sell;
  }

  private isBuyTwap(): boolean {
    return this.twapEnabled && this.tradeType === TradeType.Buy;
  }

  private hasGeneralError(): boolean {
    const generalErrors = Object.assign({}, this.error);
    delete generalErrors['balance'];
    return Object.keys(generalErrors).length > 0;
  }

  private hasTradeError(): boolean {
    return Object.keys(this.error).length > 0;
  }

  private hasTradeRoute(): boolean {
    return this.trade?.swaps.length > 0;
  }

  private hasTwapError(): boolean {
    const generalErrors = Object.assign({}, this.error);
    delete generalErrors['trade'];
    const hasError = Object.keys(generalErrors).length > 0;
    const hasTwapError = this.twapEnabled && !!this.twap?.error;
    return hasError || hasTwapError;
  }

  private isDisabled(): boolean {
    if (this.twapEnabled) {
      return this.disabled || this.hasTwapError();
    }
    return this.disabled || this.hasTradeError();
  }

  private isSignificantPriceImpact(impact: number): boolean {
    return Number(impact) <= -1;
  }

  private enableTwap() {
    if (!this.isTwapError()) {
      this.twapEnabled = true;
      this.requestUpdate();
    }
  }

  private disableTwap() {
    this.twapEnabled = false;
    this.requestUpdate();
  }

  private getPriceImpact() {
    if (this.twapEnabled) {
      return this.twap?.priceImpactPct;
    }
    return this.trade?.priceImpactPct;
  }

  private getTradeFee(): string {
    if (this.twapEnabled) {
      const twap = this.twap?.toHuman();
      return twap?.tradeFee;
    }
    const trade = this.trade?.toHuman();
    return trade?.tradeFee;
  }

  private getTradeSpotPrice(): string {
    const trade = this.trade.toHuman();
    return this.tradeType === TradeType.Sell
      ? ONE.div(trade.spotPrice)
      : trade.spotPrice;
  }

  private getTradeFeePct(): number {
    const trade = this.trade?.toHuman();
    return trade?.tradeFeePct;
  }

  private getTradeFeeIntervals(min: number, max: number, num = 3): number[] {
    const { log2 } = Math;
    return Array.from(
      { length: num + 1 },
      (_, index) => 2 ** (log2(min) + (index / num) * (log2(max) - log2(min))),
    );
  }

  private getSwapSlippage(): string {
    const out =
      this.tradeType === TradeType.Sell ? this.minAmountOut : this.maxAmountIn;
    return out ? formatAmount(out.amount, out.decimals) : null;
  }

  private getTwapSlippage(): string {
    const { maxAmountIn, minAmountOut } = this.twap.toHuman();
    return this.tradeType === TradeType.Sell ? minAmountOut : maxAmountIn;
  }

  private getSwapPrice(): string {
    return this.tradeType === TradeType.Sell ? this.amountOut : this.amountIn;
  }

  private getSwapUsdPrice(): string {
    return this.tradeType === TradeType.Sell
      ? exchange(this.usdPrice, this.assetOut, this.amountOut)
      : exchange(this.usdPrice, this.assetIn, this.amountIn);
  }

  private getTwapPrice(): string {
    const { amountIn, amountOut } = this.twap.toHuman();
    return this.tradeType === TradeType.Sell ? amountOut : amountIn;
  }

  private getTwapUsdPrice(): string {
    const { amountIn, amountOut } = this.twap.toHuman();
    const amountInUsd = exchange(this.usdPrice, this.assetIn, amountIn);
    const amountOutUsd = exchange(this.usdPrice, this.assetOut, amountOut);
    return this.tradeType === TradeType.Sell ? amountOutUsd : amountInUsd;
  }

  private getSlippage(): string {
    if (this.twapEnabled) {
      return this.getTwapSlippage();
    }
    return this.getSwapSlippage();
  }

  private getBestRoute(): string[] {
    return this.trade?.swaps.map(
      (swap: Swap) => this.assets.get(swap.assetOut).symbol,
    );
  }

  private calculateTwapPctDiff() {
    const twapPrice = this.getTwapSlippage();
    const swapPrice = this.getSwapSlippage();
    const swapPriceBN = bnum(swapPrice);
    const twapPriceBN = bnum(twapPrice);
    if (this.tradeType === TradeType.Sell) {
      return calculateDiffToRef(twapPriceBN, swapPriceBN).toNumber();
    } else {
      return calculateDiffToRef(swapPriceBN, twapPriceBN).toNumber();
    }
  }

  private calculateTwapPriceDiff() {
    const twapPrice = this.getTwapUsdPrice();
    const swapPrice = this.getSwapUsdPrice();
    const swapPriceBN = bnum(swapPrice);
    const twapPriceBN = bnum(twapPrice);
    if (this.tradeType === TradeType.Sell) {
      return twapPriceBN.minus(swapPriceBN).toNumber();
    } else {
      return swapPriceBN.minus(twapPriceBN).toNumber();
    }
  }

  onCtaClick(e: any) {
    const options = {
      bubbles: true,
      composed: true,
    };

    if (this.twapEnabled) {
      this.dispatchEvent(new CustomEvent('twap-click', options));
    } else {
      this.dispatchEvent(new CustomEvent('swap-click', options));
    }
  }

  onSlippageClick(e: any) {
    const options = {
      bubbles: true,
      composed: true,
    };
    this.dispatchEvent(new CustomEvent('slippage-click', options));
  }

  maxClickHandler(id: string, asset: Asset) {
    return function (_e: Event) {
      const options = {
        bubbles: true,
        composed: true,
        detail: { id: id, asset: asset },
      };
      this.dispatchEvent(new CustomEvent('asset-max-click', options));
    };
  }

  infoSlippageTemplate(assetSymbol: string) {
    const amount: string = this.getSlippage();

    let temp: TemplateResult = null;
    if (this.twapEnabled) {
      temp = this.infoTwapSlippagePctTemplate();
    }

    const minReceived = html`
      <span class="label">${i18n.t('form.info.minReceived')}</span>
    `;
    const maxSent = html`
      <span class="label">${i18n.t('form.info.maxSent')}</span>
    `;

    return html`
      ${choose(this.tradeType, [
        [TradeType.Sell, () => minReceived],
        [TradeType.Buy, () => maxSent],
      ])}
      <span class="grow"></span>
      ${when(
        this.inProgress,
        () =>
          html`
            <uigc-skeleton
              progress
              rectangle
              width="150px"
              height="12px"></uigc-skeleton>
          `,
        () =>
          html`
            <span class="value">
              ${amount ? humanizeAmount(amount) : '0'} ${assetSymbol} ${temp}
            </span>
          `,
      )}
    `;
  }

  infoPriceImpactTemplate() {
    const priceImpact = this.getPriceImpact();
    const priceImpactClasses = {
      value: true,
      text_error: this.isSignificantPriceImpact(priceImpact),
    };
    return html`
      <span class="label">${i18n.t('form.info.priceImpact')}</span>
      <span class="grow"></span>
      ${when(
        this.inProgress,
        () =>
          html`
            <uigc-skeleton
              progress
              rectangle
              width="80px"
              height="12px"></uigc-skeleton>
          `,
        () =>
          html`
            <span class=${classMap(priceImpactClasses)}>${priceImpact}%</span>
          `,
      )}
    `;
  }

  infoTradeFeeDetail(assetSymbol: string) {
    if (this.inProgress) {
      return html`
        <uigc-skeleton
          progress
          rectangle
          width="80px"
          height="12px"></uigc-skeleton>
      `;
    }

    const tradeFee: string = this.getTradeFee();
    const tradeFeePct: number = this.getTradeFeePct();
    const tradeFeeRange: [number, number] = this.trade?.toHuman().tradeFeeRange;

    if (tradeFeeRange) {
      const [min, max] = tradeFeeRange;
      const [, mediumLow, mediumHigh] = this.getTradeFeeIntervals(min, max);
      const indicatorClasses = {
        indicator: true,
        low: tradeFeePct < mediumLow,
        medium: tradeFeePct >= mediumLow && tradeFeePct <= mediumHigh,
        high: tradeFeePct > mediumHigh,
      };
      return html`
        <span class="value">${humanizeAmount(tradeFee)} ${assetSymbol}</span>
        <span class="value highlight">(${tradeFeePct}%)</span>
        <span class=${classMap(indicatorClasses)}>
          <span></span>
          <span></span>
          <span></span>
        </span>
      `;
    }

    return html`
      <span class="value">${humanizeAmount(tradeFee)} ${assetSymbol}</span>
      <span class="value highlight">(${tradeFeePct}%)</span>
    `;
  }

  infoTradeFeeTemplate(assetSymbol: string) {
    return html`
      <span class="label">${i18n.t('form.info.tradeFee')}</span>
      <span class="grow"></span>
      ${this.infoTradeFeeDetail(assetSymbol)}
    `;
  }

  infoTransactionFeeTemplate() {
    let feeAsset: Asset;
    let feeBN: BigNumber;
    let fee: string;

    if (this.transactionFee) {
      const { amount, asset } = this.transactionFee;
      feeAsset = asset;
      feeBN = amount;
      fee = formatAmount(amount, feeAsset.decimals);
    }

    if (fee === '0') {
      return html`
        <span class="label">${i18n.t('form.info.transactionFee')}</span>
        <span class="grow"></span>
        <span class="value">Estimation not available</span>
      `;
    }

    if (this.twapEnabled && fee) {
      const fee = this.twap.estimateFee(feeBN);
      const feeMin = formatAmount(fee, feeAsset.decimals);
      return html`
        <span class="label">${i18n.t('form.info.transactionFeeMin')}</span>
        <span class="grow"></span>
        <span class="value">
          ${humanizeAmount(feeMin) + ' ' + feeAsset.symbol}
        </span>
      `;
    }

    return html`
      <span class="label">${i18n.t('form.info.transactionFee')}</span>
      <span class="grow"></span>
      ${when(
        this.inProgress,
        () =>
          html`
            <uigc-skeleton
              progress
              rectangle
              width="80px"
              height="12px"></uigc-skeleton>
          `,
        () =>
          html`
            <span class="value">
              ${this.transactionFee
                ? humanizeAmount(fee) + ' ' + feeAsset.symbol
                : '-'}
            </span>
          `,
      )}
    `;
  }

  bestRouteTemplate() {
    const bestRoute = this.getBestRoute();
    return html`
      <span class="value">${this.assetIn.symbol}</span>
      ${bestRoute.map(
        (poolAsset: string) =>
          html`
            <uigc-icon-chevron-right></uigc-icon-chevron-right>
            <span class="value">${poolAsset}</span>
          `,
      )}
      <uigc-icon-route></uigc-icon-route>
    `;
  }

  infoBestRouteTemplate() {
    return html`
      <span class="route-label">${i18n.t('form.info.bestRoute')}</span>
      <span class="grow"></span>
      ${when(
        this.inProgress,
        () =>
          html`
            <uigc-skeleton progress width="130px" height="14px"></uigc-skeleton>
          `,
        () => this.bestRouteTemplate(),
      )}
    `;
  }

  infoTwapSlippageTemplate() {
    const twapDiff = this.calculateTwapPriceDiff();
    const twapDiffAbs = Math.abs(twapDiff);
    const twapSellSymbol = twapDiff >= 0 ? '+$' : '-$';
    const twapBuySymbol = twapDiff > 0 ? '-$' : '+$';
    const twapSymbol =
      this.tradeType === TradeType.Sell ? twapSellSymbol : twapBuySymbol;
    const twapClasses = {
      value: true,
      highlight: true,
      positive: twapDiff > 0,
      negative: twapDiff < 0,
    };
    return html`
      <span class=${classMap(twapClasses)}>
        (${twapSymbol}${humanizeAmount(twapDiffAbs.toString(), 2)})
      </span>
    `;
  }

  infoTwapSlippagePctTemplate() {
    const twapDiff = this.calculateTwapPctDiff();
    const twapDiffAbs = Math.abs(twapDiff);
    const twapSellSymbol = twapDiff >= 0 ? '+' : '-';
    const twapBuySymbol = twapDiff > 0 ? '-' : '+';
    const twapSymbol =
      this.tradeType === TradeType.Sell ? twapSellSymbol : twapBuySymbol;
    const twapClasses = {
      value: true,
      highlight: true,
      positive: twapDiff > 0,
      negative: twapDiff < 0,
    };
    return html`
      <span class=${classMap(twapClasses)}>(${twapSymbol}${twapDiffAbs}%)</span>
    `;
  }

  formAssetTemplate(asset: Asset) {
    if (this.loaded) {
      return html`
        <gc-asset-identicon
          slot="asset"
          .asset=${asset}
          .assets=${this.assets}
          .ecosystem=${this.ecosystem}></gc-asset-identicon>
      `;
    }
    return this.formAssetLoadingTemplate();
  }

  formAssetBalanceTemplate(id: string, asset: Asset, balance: Amount) {
    return html`
      <uigc-asset-balance
        slot="balance"
        .balance=${balance && formatAmount(balance.amount, balance.decimals)}
        .formatter=${humanizeAmount}
        .onMaxClick=${this.maxClickHandler(id, asset)}
        ?disabled=${this.readonly || !this.transactionFee}
        @asset-max-click=${() => {
          this.twapEnabled = false;
        }}></uigc-asset-balance>
    `;
  }

  formAssetLoadingTemplate() {
    return html`
      <div class="loading" slot="asset">
        <uigc-skeleton
          circle
          progress
          width="32px"
          height="32px"></uigc-skeleton>
        <span class="title">
          <uigc-skeleton
            progress
            rectangle
            width="40px"
            height="16px"></uigc-skeleton>
          <uigc-skeleton
            progress
            rectangle
            width="50px"
            height="8px"></uigc-skeleton>
        </span>
      </div>
    `;
  }

  formAssetInTemplate() {
    let amountIn: string = this.amountIn;
    let amountInUsd: string = exchange(this.usdPrice, this.assetIn, amountIn);

    if (this.isBuyTwap()) {
      const twap = this.twap.toHuman();
      amountIn = twap.amountIn;
      amountInUsd = exchange(this.usdPrice, this.assetIn, amountIn);
    }

    const amountUsdHuman = amountInUsd ? humanizeAmount(amountInUsd, 2) : null;
    const error = this.error['balance'];
    return html`
      <uigc-asset-transfer
        id="assetIn"
        title=${i18n.t('form.assetIn.label')}
        ?readonly=${this.readonly || !this.loaded}
        .readonly=${this.readonly || !this.loaded}
        ?selectable=${!this.readonly && this.loaded}
        .selectable=${!this.readonly && this.loaded}
        ?error=${error}
        .error=${error}
        .asset=${this.assetIn?.symbol}
        .amount=${amountIn}
        .amountUsd=${amountUsdHuman}
        @asset-input-change=${() => {
          this.twapEnabled = false;
        }}>
        ${this.formAssetTemplate(this.assetIn)}
        ${this.formAssetBalanceTemplate(
          'assetIn',
          this.assetIn,
          this.balanceIn,
        )}
      </uigc-asset-transfer>
    `;
  }

  formAssetOutTemplate() {
    let amountOut: string = this.amountOut;
    let amountOutUsd: string = exchange(
      this.usdPrice,
      this.assetOut,
      amountOut,
    );

    if (this.isSellTwap()) {
      const twap = this.twap.toHuman();
      amountOut = twap.amountOut;
      amountOutUsd = exchange(this.usdPrice, this.assetOut, amountOut);
    }

    return html`
      <uigc-asset-transfer
        id="assetOut"
        title=${i18n.t('form.assetOut.label')}
        ?readonly=${this.readonly || !this.loaded}
        .readonly=${this.readonly || !this.loaded}
        ?selectable=${!this.readonly && this.loaded}
        .selectable=${!this.readonly && this.loaded}
        .asset=${this.assetOut?.symbol}
        .amount=${amountOut}
        .amountUsd=${humanizeAmount(amountOutUsd, 2)}
        @asset-input-change=${() => {
          this.twapEnabled = false;
        }}>
        ${this.formAssetTemplate(this.assetOut)}
        ${this.formAssetBalanceTemplate(
          'assetOut',
          this.assetOut,
          this.balanceOut,
        )}
      </uigc-asset-transfer>
    `;
  }

  formSwitch() {
    const spotPriceClasses = {
      'spot-price': true,
      show: this.spotPrice || this.inProgress,
    };

    const spotPrice = this.trade ? this.getTradeSpotPrice() : this.spotPrice;
    const spotPriceFmt = this.isPriceReversed ? ONE.div(spotPrice) : spotPrice;
    const inputSymbol = this.isPriceReversed
      ? this.assetIn?.symbol
      : this.assetOut?.symbol;
    const outputSymbol = this.isPriceReversed
      ? this.assetOut?.symbol
      : this.assetIn?.symbol;

    return html`
      <div class="switch">
        <div class="divider"></div>
        <uigc-asset-switch
          class="switch-button"
          ?disabled=${!this.switchAllowed || this.readonly}
          @asset-switch-click=${() => {
            this.twapEnabled = false;
            this.isPriceReversed = false;
          }}></uigc-asset-switch>
        <uigc-asset-price
          class=${classMap(spotPriceClasses)}
          .inputAsset=${inputSymbol}
          .outputAsset=${outputSymbol}
          .outputBalance=${spotPriceFmt}
          .loading=${this.inProgress}
          @click=${() => {
            this.isPriceReversed = !this.isPriceReversed;
          }}></uigc-asset-price>
      </div>
    `;
  }

  formTradeOptionLabel() {
    return html`
      <div class="label">
        <span>${i18n.t('form.opts')}</span>
        <span class="tooltip">
          <uigc-icon-info></uigc-icon-info>
          <span class="text">
            <span><b>${i18n.t('form.swap.title')}</b></span>
            <span>${i18n.t('form.swap.desc')}</span>
            <br />
            <span><b>${i18n.t('form.twap.title')}</b></span>
            <span>${i18n.t('form.twap.desc')}</span>
          </span>
        </span>
      </div>
    `;
  }

  formTradeOptionSkeleton(title: string, desc: string) {
    return html`
      <div class="form-option skeleton">
        <div class="left">
          <span class="title">${title}</span>
          <span class="desc">${desc}</span>
        </div>
        <div class="right">
          <span class="price">
            <uigc-skeleton
              progress
              rectangle
              width="130px"
              height="20px"></uigc-skeleton>
          </span>
          <span class="usd">
            <uigc-skeleton
              progress
              rectangle
              width="70px"
              height="14px"></uigc-skeleton>
          </span>
        </div>
      </div>
    `;
  }

  formSwapOption(assetSymbol: string) {
    if (this.inProgress) {
      return this.formTradeOptionSkeleton(
        i18n.t('form.swap.title'),
        i18n.t('form.swap.info'),
      );
    }

    const price = this.getSwapPrice();
    const priceUsd = this.getSwapUsdPrice();
    const swapClasses = {
      'form-option': true,
      active: !this.twapEnabled,
      hidden: !(this.trade?.swaps.length > 0 && this.twapAllowed),
    };
    return html`
      <div
        class=${classMap(swapClasses)}
        @click=${() => this.transactionFee && this.disableTwap()}>
        <div class="left">
          <span class="title">${i18n.t('form.swap.title')}</span>
          <span class="desc">${i18n.t('form.swap.info')}</span>
        </div>
        <div class="right">
          <span class="price">${humanizeAmount(price)} ${assetSymbol}</span>
          <span class="usd">≈ ${humanizeAmount(priceUsd, 2)} USD</span>
        </div>
      </div>
    `;
  }

  formTwapOption(assetSymbol: string) {
    if (this.twapProgress || !this.twap) {
      return this.formTradeOptionSkeleton(
        i18n.t('form.twap.title'),
        i18n.t('form.twap.info', {
          timeframe: 'N/A',
          interpolation: { escapeValue: false },
        }),
      );
    }

    if (this.twap && this.twap.error === TwapError.OrderTooBig) {
      return this.formTwapOptionError(assetSymbol);
    }

    const { time } = this.twap.toHuman();
    const price = this.getTwapPrice();
    const priceUsd = this.getTwapUsdPrice();
    const timeframe = this._humanizer.humanize(time, {
      round: true,
      largest: 2,
      units: ['h', 'm'],
    });

    const twapClasses = {
      'form-option': true,
      active: this.twapEnabled,
      hidden: !(this.trade?.swaps.length > 0 && this.twapAllowed),
      disabled: this.isTwapError(),
    };

    return html`
      <div
        class=${classMap(twapClasses)}
        @click=${() => this.transactionFee && this.enableTwap()}>
        <div class="left">
          <span class="title">${i18n.t('form.twap.title')}</span>
          <span class="desc">${i18n.t('form.twap.info', { timeframe })}</span>
        </div>
        <div class="right">
          <span class="price">
            ${humanizeAmount(price.toString())} ${assetSymbol}
          </span>
          <span class="usd">
            <span>≈ ${humanizeAmount(priceUsd, 2)} USD</span>
            ${this.infoTwapSlippageTemplate()}
          </span>
        </div>
      </div>
    `;
  }

  formTwapOptionError(assetSymbol: string) {
    return html`
      <div class="form-option disabled">
        <div class="left">
          <span class="title">${i18n.t('twap.split')}</span>
          <span class="desc">
            ${i18n.t('twap.splitDescr', {
              timeframe: 'N/A',
              interpolation: { escapeValue: false },
            })}
          </span>
        </div>
        <div class="right">
          <span class="price">0 ${assetSymbol}</span>
          <span class="usd">≈ 0 USD</span>
        </div>
      </div>
    `;
  }

  formTwapSlippageWarning() {
    const { slippageTwap } = this.tradeConfig.state;
    const priceImpact = this.trade?.priceImpactPct;
    const priceImpactAbs = Math.abs(priceImpact);
    const slippageWarnClasses = {
      alert: true,
      warning: true,
      show:
        this.twapEnabled &&
        priceImpactAbs < 5 &&
        Number(slippageTwap) < priceImpactAbs,
    };
    return html`
      <div class=${classMap(slippageWarnClasses)}>
        <uigc-icon-warning></uigc-icon-warning>
        <div>
          <span>${i18n.t('warn.changeSlippage')}</span>
          <a @click=${this.onSlippageClick} class="link">Adjust slippage</a>
        </div>
      </div>
    `;
  }

  formTwapDcaWarning() {
    const priceImpact = this.trade?.priceImpactPct;
    const priceImpactAbs = Math.abs(priceImpact);
    const dcaWarnClasses = {
      alert: true,
      warning: true,
      show: this.twapEnabled && priceImpactAbs > 5,
    };
    return html`
      <div class=${classMap(dcaWarnClasses)}>
        <uigc-icon-warning></uigc-icon-warning>
        <div>
          <span>${i18n.t('warn.useDca')}</span>
          <a href="/trade/dca" class="link">Go to DCA</a>
        </div>
      </div>
    `;
  }

  formATokenWarning() {
    const aTokenWarnClasses = {
      alert: true,
      warning: true,
      show: isAToken(this.assetIn),
    };
    return html`
      <div class=${classMap(aTokenWarnClasses)}>
        <uigc-icon-warning></uigc-icon-warning>
        <span>${i18n.t('warn.aToken')}</span>
      </div>
    `;
  }

  render() {
    const assetSymbol =
      this.tradeType == TradeType.Sell
        ? this.assetOut?.symbol
        : this.assetIn?.symbol;
    const ctaClasses = {
      cta: true,
      cta__twap: this.twapEnabled,
    };
    const optionsClasses = {
      options: true,
      transfer: true,
      show: this.hasTradeRoute() && this.twapAllowed,
    };
    const infoClasses = {
      info: true,
      show: this.hasTradeRoute(),
    };
    const errorClasses = {
      alert: true,
      error: true,
      show: !this.twapEnabled && this.hasGeneralError(),
    };
    return html`
      <slot name="header"></slot>
      <div class="transfer">
        ${this.formAssetInTemplate()} ${this.formSwitch()}
        ${this.formAssetOutTemplate()}
      </div>
      <div class=${classMap(optionsClasses)}>
        ${this.formTradeOptionLabel()} ${this.formSwapOption(assetSymbol)}
        ${this.formTwapOption(assetSymbol)}
      </div>
      ${this.formTwapSlippageWarning()} ${this.formTwapDcaWarning()}
      ${this.formATokenWarning()}
      <div class=${classMap(infoClasses)}>
        <div class="row">${this.infoSlippageTemplate(assetSymbol)}</div>
        <div class="row">${this.infoPriceImpactTemplate()}</div>
        <div class="row">${this.infoTradeFeeTemplate(assetSymbol)}</div>
        <div class="row">${this.infoTransactionFeeTemplate()}</div>
        ${when(
          this.hasTradeRoute(),
          () =>
            html`
              <div class="row route">${this.infoBestRouteTemplate()}</div>
            `,
        )}
      </div>
      <div class=${classMap(errorClasses)}>
        <uigc-icon-error></uigc-icon-error>
        <span>${this.error['pool'] || this.error['trade']}</span>
      </div>
      <uigc-button
        ?disabled=${this.readonly || this.isDisabled()}
        class="confirm"
        variant="primary"
        fullWidth
        @click=${this.onCtaClick}>
        <div class=${classMap(ctaClasses)}>
          <span class="swap">
            ${this.account.state
              ? i18n.t('form.cta.swap')
              : i18n.t('form.cta.connect')}
          </span>
          <span class="twap">
            ${this.account.state
              ? i18n.t('form.cta.twap')
              : i18n.t('form.cta.connect')}
          </span>
        </div>
      </uigc-button>
    `;
  }
}
