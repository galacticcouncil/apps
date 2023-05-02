import { html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { classMap } from 'lit/directives/class-map.js';

import * as i18n from 'i18next';

import { PoolElement } from '../base/PoolElement';
import { baseStyles } from '../styles/base.css';
import { headerStyles } from '../styles/header.css';
import { tradeLayoutStyles } from '../styles/layout/trade.css';

import { Account } from '../../db';
import { calculateEffectiveBalance } from '../../api/balance';
import { getFeePaymentAsset, getPaymentInfo } from '../../api/transaction';
import { getBestSell, getBestBuy, TradeInfo } from '../../api/trade';
import { formatAmount, humanizeAmount, multipleAmounts } from '../../utils/amount';
import { isAssetInAllowed, isAssetOutAllowed } from '../../utils/asset';
import { updateQueryParams } from '../../utils/url';
import { getRenderString } from '../../utils/dom';

import '@galacticcouncil/ui';
import {
  Amount,
  bnum,
  ONE,
  PoolAsset,
  scale,
  SYSTEM_ASSET_DECIMALS,
  SYSTEM_ASSET_ID,
  TradeType,
  Transaction,
} from '@galacticcouncil/sdk';

import './select-token';
import './settings';
import './trade-tokens';
import '../chart';

import { AssetSelector, TradeScreen, TradeState, DEFAULT_TRADE_STATE, TransactionFee } from './types';
import { TxInfo, TxNotificationMssg } from '../transaction/types';

@customElement('gc-trade-app')
export class TradeApp extends PoolElement {
  private tx: Transaction = null;

  @state() screen: TradeScreen = TradeScreen.TradeTokens;
  @state() trade: TradeState = { ...DEFAULT_TRADE_STATE };
  @state() asset = {
    active: null as string,
    selector: null as AssetSelector,
  };

  @property({ type: String }) assetIn: string = null;
  @property({ type: String }) assetOut: string = null;
  @property({ type: Number }) chartDatasourceId: number = null;
  @property({ type: Boolean }) chart: Boolean = false;

  static styles = [
    baseStyles,
    headerStyles,
    tradeLayoutStyles,
    css`
      :host {
        max-width: 480px;
      }
    `,
  ];

  isSwapSelected(): boolean {
    return this.trade.assetIn != null && this.trade.assetOut != null;
  }

  isSwapEmpty(): boolean {
    return this.trade.amountIn == null && this.trade.amountOut == null;
  }

  isSwitchEnabled(): boolean {
    const assetIn = this.trade.assetIn?.id;
    const assetOut = this.trade.assetOut?.id;

    if (!assetIn || !assetOut) {
      return true;
    }

    const assetInAllowed = isAssetInAllowed(this.assets.list, this.assets.pairs, assetOut);
    const assetOutAllowed = isAssetOutAllowed(this.assets.list, this.assets.pairs, assetIn);
    return assetInAllowed && assetOutAllowed;
  }

  isEmptyAmount(amount: string): boolean {
    return amount == '' || amount == '0';
  }

  isPoolError(): boolean {
    const assetIn = this.trade.assetIn?.id;
    const assetOut = this.trade.assetOut?.id;

    if (!assetIn || !assetOut) {
      return false;
    }

    const assetInAllowed = isAssetInAllowed(this.assets.list, this.assets.pairs, assetIn);
    const assetOutAllowed = isAssetOutAllowed(this.assets.list, this.assets.pairs, assetOut);
    return assetIn === assetOut || !assetInAllowed || !assetOutAllowed;
  }

  hasError(): boolean {
    return Object.keys(this.trade.error).length > 0;
  }

  changeScreen(active: TradeScreen) {
    this.screen = active;
    this.requestUpdate();
  }

  private async safeSell(assetIn: PoolAsset, assetOut: PoolAsset, amountIn: string): Promise<TradeInfo> {
    try {
      return await getBestSell(assetIn, assetOut, amountIn);
    } catch (error) {
      console.error(error);
      this.resetTrade();
    }
  }

  async calculateBestSell(assetIn: PoolAsset, assetOut: PoolAsset, amountIn: string) {
    const { trade, transaction, slippage } = await this.safeSell(assetIn, assetOut, amountIn);
    const amountInUsd = this.calculateDollarPrice(assetIn, trade.amountIn);
    const amountOutUsd = this.calculateDollarPrice(assetOut, trade.amountOut);

    // Disable overriding of active asset amount (assetIn) if typing
    const tradeState = Object.assign({}, trade);
    delete tradeState.amountIn;

    this.trade = {
      ...this.trade,
      inProgress: false,
      assetIn: assetIn,
      amountInUsd: humanizeAmount(amountInUsd),
      assetOut: assetOut,
      amountOutUsd: humanizeAmount(amountOutUsd),
      afterSlippage: slippage,
      ...tradeState,
    };
    this.tx = transaction;
    this.validateTrade(TradeType.Sell);
    this.validateEnoughBalance();
    this.syncTransactionFee();
    console.log(trade);
  }

  private async safeBuy(assetIn: PoolAsset, assetOut: PoolAsset, amountOut: string): Promise<TradeInfo> {
    try {
      return await getBestBuy(assetIn, assetOut, amountOut);
    } catch (error) {
      console.error(error);
      this.resetTrade();
    }
  }

  async calculateBestBuy(assetIn: PoolAsset, assetOut: PoolAsset, amountOut: string) {
    const { trade, transaction, slippage } = await this.safeBuy(assetIn, assetOut, amountOut);
    const amountInUsd = this.calculateDollarPrice(assetIn, trade.amountIn);
    const amountOutUsd = this.calculateDollarPrice(assetOut, trade.amountOut);

    // Disable overriding of active asset amount (assetOut) if typing
    const tradeState = Object.assign({}, trade);
    delete tradeState.amountOut;

    this.trade = {
      ...this.trade,
      inProgress: false,
      assetIn: assetIn,
      amountInUsd: humanizeAmount(amountInUsd),
      assetOut: assetOut,
      amountOutUsd: humanizeAmount(amountOutUsd),
      afterSlippage: slippage,
      ...tradeState,
    };
    this.tx = transaction;
    this.validateTrade(TradeType.Buy);
    this.validateEnoughBalance();
    this.syncTransactionFee();
    console.log(trade);
  }

  private recalculateBestSell() {
    this.calculateBestSell(this.trade.assetIn, this.trade.assetOut, this.trade.amountIn);
  }

  private recalculateBestBuy() {
    this.calculateBestBuy(this.trade.assetIn, this.trade.assetOut, this.trade.amountOut);
  }

  private recalculateTrade() {
    if (!this.isSwapSelected() || this.isSwapEmpty() || this.isPoolError()) {
      return;
    } else if (this.trade.assetIn.symbol == this.asset.active) {
      this.recalculateBestSell();
    } else if (this.trade.assetOut.symbol == this.asset.active) {
      this.recalculateBestBuy();
    }
  }

  private async recalculateSpotPrice() {
    const assetIn = this.trade.assetIn;
    const assetOut = this.trade.assetOut;

    if (!assetIn || !assetOut) {
      return;
    }

    const router = this.chain.state.router;
    const price: Amount = await router.getBestSpotPrice(assetIn.id, assetOut.id);
    let spotPrice: string;
    if (this.trade.type == TradeType.Buy) {
      spotPrice = scale(ONE, price.decimals).div(price.amount).toFixed();
    } else {
      spotPrice = formatAmount(price.amount, price.decimals);
    }

    this.trade = {
      ...this.trade,
      inProgress: false,
      spotPrice: spotPrice,
    };
  }

  private switchAssets(amountIn: string, amountOut: string, progress: boolean) {
    this.trade = {
      ...this.trade,
      inProgress: progress,
      assetIn: this.trade.assetOut,
      assetOut: this.trade.assetIn,
      balanceIn: this.trade.balanceOut,
      balanceOut: this.trade.balanceIn,
      amountIn: amountIn,
      amountOut: amountOut,
    };
  }

  switch() {
    if (!this.isSwapSelected()) {
      this.switchAssets(this.trade.amountOut, this.trade.amountIn, false);
    } else if (!this.isSwitchEnabled()) {
      return;
    } else if (this.isSwapEmpty()) {
      this.switchAssets(this.trade.amountOut, this.trade.amountIn, true);
      this.recalculateSpotPrice();
    } else if (this.trade.assetOut.symbol == this.asset.active) {
      this.switchAssets(this.trade.amountOut, null, true);
      this.recalculateBestSell();
    } else if (this.trade.assetIn.symbol == this.asset.active) {
      this.switchAssets(null, this.trade.amountIn, true);
      this.recalculateBestBuy();
    }
  }

  private async changeAssetIn(previous: string, asset: PoolAsset) {
    const assetIn = asset;
    const assetOut = this.trade.assetOut;

    // Switch if selecting the same asset
    if (assetIn.id === assetOut?.id) {
      this.switch();
      return;
    }

    // Change without recalculation if pair not specified
    if (assetOut == null) {
      this.trade = {
        ...this.trade,
        assetIn: asset,
        balanceIn: null,
      };
      return;
    }

    // Recalculate only spot price if amount not set
    if (this.isSwapEmpty()) {
      this.trade = {
        ...this.trade,
        assetIn: asset,
        balanceOut: null,
      };
      this.recalculateSpotPrice();
      return;
    }

    if (previous == this.asset.active) {
      this.trade = {
        ...this.trade,
        inProgress: true,
        assetIn: asset,
        balanceIn: null,
        amountOut: null,
      };
      this.asset.active = assetIn.symbol;
      this.calculateBestSell(assetIn, assetOut, this.trade.amountIn);
    } else {
      this.trade = {
        ...this.trade,
        inProgress: true,
        assetIn: asset,
        balanceIn: null,
        amountIn: null,
      };
      this.calculateBestBuy(assetIn, assetOut, this.trade.amountOut);
    }
  }

  private async changeAssetOut(previous: string, asset: PoolAsset) {
    const assetIn = this.trade.assetIn;
    const assetOut = asset;

    // Switch if selecting the same asset
    if (assetOut.id === assetIn?.id) {
      this.switch();
      return;
    }

    // Change without recalculation if pair not specified
    if (assetIn == null) {
      this.trade = {
        ...this.trade,
        assetOut: asset,
        balanceOut: null,
      };
      return;
    }

    // Recalculate only spot price if amount not set
    if (this.isSwapEmpty()) {
      this.trade = {
        ...this.trade,
        inProgress: true,
        assetOut: asset,
        balanceOut: null,
      };
      this.recalculateSpotPrice();
      return;
    }

    if (previous == this.asset.active) {
      this.trade = {
        ...this.trade,
        inProgress: true,
        assetOut: asset,
        balanceOut: null,
        amountIn: null,
      };
      this.asset.active = assetOut.symbol;
      this.calculateBestBuy(assetIn, assetOut, this.trade.amountOut);
    } else {
      this.trade = {
        ...this.trade,
        inProgress: true,
        assetOut: asset,
        balanceOut: null,
        amountOut: null,
      };
      this.calculateBestSell(assetIn, assetOut, this.trade.amountIn);
    }
  }

  validateEnoughBalance() {
    const assetIn = this.trade.assetIn?.id;
    const ammountIn = this.trade.amountIn;
    const account = this.account.state;

    if (!assetIn || !ammountIn || !account) {
      return;
    }

    const balanceIn = this.assets.balance.get(assetIn);
    const amount = scale(bnum(ammountIn), balanceIn.decimals);
    if (amount.gt(balanceIn.amount)) {
      this.trade.error['balance'] = i18n.t('trade.error.balance');
    } else {
      delete this.trade.error['balance'];
    }
    this.requestUpdate();
  }

  translateTradeError(error: string): string {
    switch (error) {
      case 'InsufficientTradingAmount':
        return i18n.t('trade.error.insufficientTradingAmount');
      case 'MaxOutRatioExceeded':
        return i18n.t('trade.error.maxOutRatioExceeded');
      case 'MaxInRatioExceeded':
        return i18n.t('trade.error.maxInRatioExceeded');
    }
  }

  validateTrade(type: TradeType) {
    if (this.trade.swaps.length === 0) {
      return;
    }
    const swaps = type == TradeType.Buy ? this.trade.swaps.reverse() : this.trade.swaps;
    const swapWithError: any = swaps.find((swap: any) => swap.errors.length > 0);
    if (swapWithError) {
      this.trade.error['trade'] = this.translateTradeError(swapWithError.errors[0]);
    } else {
      delete this.trade.error['trade'];
    }
  }

  validatePool() {
    if (this.isPoolError()) {
      this.trade.error['pool'] = i18n.t('trade.error.invalidPair');
      this.resetTrade();
    } else {
      delete this.trade.error['pool'];
    }
  }

  private resetTrade(withError?: boolean) {
    delete this.trade.error['balance'];
    delete this.trade.error['trade'];
    this.trade = {
      ...this.trade,
      inProgress: false,
      amountIn: null,
      amountInUsd: null,
      amountOut: null,
      amountOutUsd: null,
      error: withError ? [] : this.trade.error,
      swaps: [],
    };
  }

  updateAmountIn(amount: string) {
    // Wipe the trade info on input clear
    if (this.isEmptyAmount(amount)) {
      this.resetTrade();
      return;
    }

    if (this.isSwapSelected() && !this.isPoolError()) {
      this.trade = {
        ...this.trade,
        inProgress: true,
        amountIn: amount,
        amountOut: null,
      };
      this.calculateBestSell(this.trade.assetIn, this.trade.assetOut, amount);
    } else {
      this.trade.amountIn = amount;
    }
  }

  updateAmountOut(amount: string) {
    // Wipe the trade info on input clear
    if (this.isEmptyAmount(amount)) {
      this.resetTrade();
      return;
    }

    if (this.isSwapSelected() && !this.isPoolError()) {
      this.trade = {
        ...this.trade,
        inProgress: true,
        amountIn: null,
        amountOut: amount,
      };
      this.calculateBestBuy(this.trade.assetIn, this.trade.assetOut, amount);
    } else {
      this.trade.amountOut = amount;
    }
  }

  private resetBalances() {
    this.trade.balanceIn = null;
    this.trade.balanceOut = null;
  }

  private updateBalances() {
    const balanceIn = this.assets.balance.get(this.trade.assetIn?.id);
    const balanceOut = this.assets.balance.get(this.trade.assetOut?.id);
    this.trade = {
      ...this.trade,
      balanceIn: balanceIn && formatAmount(balanceIn.amount, balanceIn.decimals),
      balanceOut: balanceOut && formatAmount(balanceOut.amount, balanceOut.decimals),
    };
  }

  async syncBalances() {
    const account = this.account.state
    if (account) {
      this.updateBalances();
      this.validateEnoughBalance();
    }
  }

  async calculateTransactionFee(feeSystem: string, feeAssetId: string): Promise<TransactionFee> {
    const feeSystemAmount = feeSystem.split(' ')[0];
    const feeAssetSymbol = this.assets.map.get(feeAssetId).symbol;
    const feeAssetEd = this.assets.details.get(feeAssetId).existentialDeposit;
    const feeAssetEdBN = bnum(feeAssetEd.toString());

    if (feeAssetId == SYSTEM_ASSET_ID) {
      const ed = formatAmount(feeAssetEdBN, SYSTEM_ASSET_DECIMALS);
      return { amount: feeSystemAmount, asset: feeAssetSymbol, ed: ed } as TransactionFee;
    }

    const router = this.chain.state.router;
    const feeAssetPrice = await router.getBestSpotPrice(SYSTEM_ASSET_ID, feeAssetId);
    const fee = multipleAmounts(feeSystemAmount, feeAssetPrice);
    const ed = formatAmount(feeAssetEdBN, feeAssetPrice.decimals);
    return { amount: fee.toString(), asset: feeAssetSymbol, ed: ed } as TransactionFee;
  }

  async syncTransactionFee() {
    const account = this.account.state
    if (account) {
      const { partialFee } = await getPaymentInfo(this.tx, account);
      const feeAssetId = await getFeePaymentAsset(account);
      const feeSystem = partialFee.toHuman();
      this.trade.transactionFee = await this.calculateTransactionFee(feeSystem, feeAssetId);
      this.requestUpdate();
    }
  }

  async updateMaxAmountIn(asset: PoolAsset) {
    const account = this.account.state
    const feeAssetId = await getFeePaymentAsset(account);

    if (asset.id !== feeAssetId) {
      this.updateAmountIn(this.trade.balanceIn);
      return;
    }

    const { transaction } = await this.safeSell(this.trade.assetIn, this.trade.assetOut, ONE.toFixed());
    const { partialFee } = await getPaymentInfo(transaction, account);
    const feeSystem = partialFee.toHuman();
    const txFee = await this.calculateTransactionFee(feeSystem, feeAssetId);

    const eb = calculateEffectiveBalance(
      this.trade.balanceIn,
      this.trade.assetIn.symbol,
      txFee.ed,
      txFee.asset,
      txFee.amount
    );
    this.updateAmountIn(eb);
  }

  async updateMaxAmountOut(asset: PoolAsset) {
    const account = this.account.state
    const feeAssetId = await getFeePaymentAsset(account);

    if (asset.id !== feeAssetId) {
      this.updateAmountOut(this.trade.balanceOut);
      return;
    }

    const { transaction } = await this.safeBuy(this.trade.assetIn, this.trade.assetOut, ONE.toFixed());
    const { partialFee } = await getPaymentInfo(transaction, account);
    const feeSystem = partialFee.toHuman();
    const txFee = await this.calculateTransactionFee(feeSystem, feeAssetId);

    const eb = calculateEffectiveBalance(
      this.trade.balanceOut,
      this.trade.assetOut.symbol,
      txFee.ed,
      txFee.asset,
      txFee.amount
    );
    this.updateAmountOut(eb);
  }

  notificationTemplate(trade: TradeState, status: string): TxNotificationMssg {
    const isSell: boolean = trade.type == TradeType.Sell;
    const amountIn = trade.amountIn;
    const assetIn = trade.assetIn.symbol;
    const amountOut = trade.amountOut;
    const assetOut = trade.assetOut.symbol;
    const template = html`
      <span>${status ? trade.type : isSell ? 'You sold' : 'You bought'}</span>
      <span class="highlight">${humanizeAmount(isSell ? amountIn : amountOut)}</span>
      <span class="highlight">${isSell ? assetIn : assetOut}</span>
      <span>${'for'}</span>
      <span class="highlight">${humanizeAmount(isSell ? amountOut : amountIn)}</span>
      <span class="highlight">${isSell ? assetOut : assetIn}</span>
      <span>${status}</span>
    `;
    return {
      message: template,
      rawHtml: getRenderString(template),
    } as TxNotificationMssg;
  }

  processTx(account: Account, transaction: Transaction, trade: TradeState) {
    const notification = {
      processing: this.notificationTemplate(trade, 'submitted'),
      success: this.notificationTemplate(trade, null),
      failure: this.notificationTemplate(trade, 'failed'),
    };
    const options = {
      bubbles: true,
      composed: true,
      detail: { account: account, transaction: transaction, notification: notification } as TxInfo,
    };
    this.dispatchEvent(new CustomEvent<TxInfo>('gc:tx:new', options));
  }

  async swap() {
    const account = this.account.state
    if (account && this.tx) {
      this.processTx(account, this.tx, this.trade);
    }
  }

  private updateAsset(asset: string, assetKey: string) {
    if (asset) {
      this.trade[assetKey] = this.assets.map.get(asset);
    } else {
      this.trade[assetKey] = null;
    }
  }

  protected onInit(): void {
    if (!this.assetIn && !this.assetOut) {
      this.trade.assetIn = this.assets.map.get(this.stableCoinAssetId);
      this.trade.assetOut = this.assets.map.get(SYSTEM_ASSET_ID);
    } else {
      this.updateAsset(this.assetIn, 'assetIn');
      this.updateAsset(this.assetOut, 'assetOut');
    }
    this.recalculateSpotPrice();
    this.validatePool();
  }

  protected onBlockChange(): void {
    this.syncBalances();
    this.recalculateTrade();
  }

  protected override async onAccountChange(prev: Account, curr: Account): Promise<void> {
    await super.onAccountChange(prev, curr);
    this.resetBalances();
    this.syncBalances();
    if (curr == null) {
      this.resetTrade();
    }
  }

  private onResize(_evt: UIEvent) {
    if (window.innerWidth > 1023 && TradeScreen.TradeChart == this.screen) {
      this.changeScreen(TradeScreen.TradeTokens);
    }
  }

  override connectedCallback() {
    super.connectedCallback();
    window.addEventListener('resize', (evt) => this.onResize(evt));
    this.resetTrade(true);
  }

  override disconnectedCallback() {
    this.disconnectSubscribeNewHeads?.();
    window.removeEventListener('resize', this.onResize);
    super.disconnectedCallback();
  }

  settingsTemplate() {
    const classes = {
      tab: true,
      main: true,
      active: this.screen == TradeScreen.Settings,
    };
    return html` <uigc-paper class=${classMap(classes)}>
      <gc-trade-app-settings @slippage-changed=${() => this.recalculateTrade()}>
        <div class="header section" slot="header">
          <uigc-icon-button class="back" @click=${() => this.changeScreen(TradeScreen.TradeTokens)}>
            <uigc-icon-back></uigc-icon-back>
          </uigc-icon-button>
          <uigc-typography variant="section">${i18n.t('trade.settings.title')}</uigc-typography>
          <span></span>
        </div>
      </gc-trade-app-settings>
    </uigc-paper>`;
  }

  selectTokenTemplate() {
    const classes = {
      tab: true,
      main: true,
      active: this.screen == TradeScreen.SelectToken,
    };
    return html` <uigc-paper class=${classMap(classes)}>
      <gc-trade-app-select
        .assets=${this.assets.list}
        .pairs=${this.assets.pairs}
        .details=${this.assets.details}
        .balances=${this.assets.balance}
        .usdPrice=${this.assets.usdPrice}
        .assetIn=${this.trade.assetIn?.symbol}
        .assetOut=${this.trade.assetOut?.symbol}
        .switchAllowed=${this.isSwitchEnabled()}
        .selector=${this.asset.selector}
        @asset-clicked=${(e: CustomEvent) => {
          const { id, asset } = this.asset.selector;
          id == 'assetIn' && this.changeAssetIn(asset, e.detail);
          id == 'assetOut' && this.changeAssetOut(asset, e.detail);
          this.updateBalances();
          this.validatePool();
          updateQueryParams({
            assetIn: this.trade.assetIn?.id,
            assetOut: this.trade.assetOut?.id,
          });
          this.changeScreen(TradeScreen.TradeTokens);
        }}
      >
        <div class="header section" slot="header">
          <uigc-icon-button class="back" @click=${() => this.changeScreen(TradeScreen.TradeTokens)}>
            <uigc-icon-back></uigc-icon-back>
          </uigc-icon-button>
          <uigc-typography variant="section">${i18n.t('trade.selectAsset')}</uigc-typography>
          <span></span>
        </div>
      </gc-trade-app-select>
    </uigc-paper>`;
  }

  tradeTokensTemplate() {
    const classes = {
      tab: true,
      main: true,
      active: this.screen == TradeScreen.TradeTokens,
    };
    return html` <uigc-paper class=${classMap(classes)} id="default-screen">
      <gc-trade-app-main
        .assets=${this.assets.map}
        .pairs=${this.assets.pairs}
        .inProgress=${this.trade.inProgress}
        .disabled=${!this.isSwapSelected() || this.isSwapEmpty() || this.hasError() || !this.tx}
        .switchAllowed=${this.isSwitchEnabled()}
        .tradeType=${this.trade.type}
        .assetIn=${this.trade.assetIn}
        .assetOut=${this.trade.assetOut}
        .amountIn=${this.trade.amountIn}
        .amountInUsd=${this.trade.amountInUsd}
        .amountOut=${this.trade.amountOut}
        .amountOutUsd=${this.trade.amountOutUsd}
        .balanceIn=${this.trade.balanceIn}
        .balanceOut=${this.trade.balanceOut}
        .spotPrice=${this.trade.spotPrice}
        .afterSlippage=${this.trade.afterSlippage}
        .priceImpactPct=${this.trade.priceImpactPct}
        .tradeFee=${this.trade.tradeFee}
        .tradeFeePct=${this.trade.tradeFeePct}
        .transactionFee=${this.trade.transactionFee}
        .error=${this.trade.error}
        .swaps=${this.trade.swaps}
        @asset-input-changed=${({ detail: { id, asset, value } }: CustomEvent) => {
          this.asset.active = asset;
          id == 'assetIn' && this.updateAmountIn(value);
          id == 'assetOut' && this.updateAmountOut(value);
          this.validateEnoughBalance();
        }}
        @asset-max-clicked=${({ detail: { id, asset } }: CustomEvent) => {
          this.asset.active = asset.symbol;
          id == 'assetIn' && this.updateMaxAmountIn(asset);
          id == 'assetOut' && this.updateMaxAmountOut(asset);
        }}
        @asset-selector-clicked=${({ detail }: CustomEvent) => {
          this.asset.selector = detail;
          this.changeScreen(TradeScreen.SelectToken);
        }}
        @asset-switch-clicked=${() => {
          this.switch();
          this.validatePool();
          updateQueryParams({
            assetIn: this.trade.assetIn?.id,
            assetOut: this.trade.assetOut?.id,
          });
        }}
        @swap-clicked=${() => this.swap()}
      >
        <div class="header" slot="header">
          <uigc-typography variant="title" gradient>${i18n.t('trade.title')}</uigc-typography>
          <span class="grow"></span>
          <uigc-icon-button basic class="chart-btn" @click=${() => this.changeScreen(TradeScreen.TradeChart)}>
            <uigc-icon-chart></uigc-icon-chart>
          </uigc-icon-button>
          <uigc-icon-button basic @click=${() => this.changeScreen(TradeScreen.Settings)}>
            <uigc-icon-settings></uigc-icon-settings>
          </uigc-icon-button>
        </div>
      </gc-trade-app-main>
    </uigc-paper>`;
  }

  tradeChartTemplate() {
    const classes = {
      tab: true,
      chart: true,
      active: this.screen == TradeScreen.TradeChart,
    };
    return html` <uigc-paper class=${classMap(classes)}>
      ${when(
        this.chart,
        () => html`
          <gc-trade-chart
            .datasourceId=${this.chartDatasourceId}
            .tradeType=${this.trade.type}
            .tradeProgress=${this.trade.inProgress}
            .assetIn=${this.trade.assetIn}
            .assetOut=${this.trade.assetOut}
            .spotPrice=${this.trade.spotPrice}
            .usdPrice=${this.assets.usdPrice}
            .details=${this.assets.details}
          >
            <div class="header section" slot="header">
              <uigc-icon-button class="back" @click=${() => this.changeScreen(TradeScreen.TradeTokens)}>
                <uigc-icon-back></uigc-icon-back>
              </uigc-icon-button>
              <uigc-typography variant="section">${i18n.t('chart.title')}</uigc-typography>
              <span></span>
            </div>
          </gc-trade-chart>
        `
      )}
    </uigc-paper>`;
  }

  render() {
    return html`
      <div class="layout-root">
        ${this.tradeChartTemplate()} ${this.tradeTokensTemplate()} ${this.settingsTemplate()}
        ${this.selectTokenTemplate()}
      </div>
    `;
  }
}
