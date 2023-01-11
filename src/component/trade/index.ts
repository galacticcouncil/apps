import { LitElement, html, css, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { choose } from 'lit/directives/choose.js';
import { when } from 'lit/directives/when.js';

import * as i18n from 'i18next';

import { baseStyles } from '../base.css';
import { createApi } from '../../chain';
import { DatabaseController } from '../../db.ctrl';
import { Chain, chainCursor, Account, accountCursor } from '../../db';
import { getFeePaymentAsset, getPaymentInfo } from '../../api/transaction';
import { getBestSell, getBestBuy, TradeInfo } from '../../api/trade';
import { getAssetsBalance, getAssetsDetail, getAssetsDollarPrice, getAssetsPairs } from '../../api/asset';
import { formatAmount, humanizeAmount, multipleAmounts } from '../../utils/amount';
import { isAssetInAllowed, isAssetOutAllowed } from '../../utils/asset';

import '@galacticcouncil/ui';
import {
  Amount,
  bnum,
  PoolAsset,
  PoolType,
  scale,
  SYSTEM_ASSET_DECIMALS,
  SYSTEM_ASSET_ID,
  TradeType,
  Transaction,
} from '@galacticcouncil/sdk';

import './select-token';
import './settings';
import './trade-tokens';
import './chart';

import {
  TradeScreen,
  ScreenState,
  AssetsState,
  TradeState,
  DEFAULT_SCREEN_STATE,
  DEFAULT_ASSETS_STATE,
  DEFAULT_TRADE_STATE,
  TransactionFee,
} from './types';
import { TxInfo } from '../transaction/types';

@customElement('gc-trade-app')
export class TradeApp extends LitElement {
  private chain = new DatabaseController<Chain>(this, chainCursor);

  private tx: Transaction = null;
  private ready: boolean = false;
  private ro = new ResizeObserver((entries) => {
    entries.forEach((entry) => {
      this.screen.height = entry.contentRect.height;
    });
  });
  private disconnectSubscribeNewHeads: () => void = null;

  @state() screen: ScreenState = { ...DEFAULT_SCREEN_STATE };
  @state() assets: AssetsState = { ...DEFAULT_ASSETS_STATE };
  @state() trade: TradeState = { ...DEFAULT_TRADE_STATE };

  @property({ type: String }) apiAddress: string = null;
  @property({ type: String }) accountAddress: string = null;
  @property({ type: String }) accountProvider: string = null;
  @property({ type: String }) accountName: string = null;
  @property({ type: String }) pools: string = null;
  @property({ type: String }) assetIn: string = null;
  @property({ type: String }) assetOut: string = null;
  @property({ type: String }) stableCoinAssetId: string = null;
  @property({ type: Boolean }) chart: Boolean = false;

  static styles = [
    baseStyles,
    css`
      :host {
        display: block;
        max-width: 520px;
        margin-left: auto;
        margin-right: auto;
        position: relative;
      }

      :host([chart]) {
        max-width: 1170px;
      }

      :host([chart]) > div {
        display: grid;
        grid-template-columns: 1fr 520px;
        grid-column-gap: 10px;
      }

      uigc-paper {
        display: block;
        border-radius: none;
      }

      uigc-paper.chart {
        background: #000524;
        height: 500px;
        box-shadow: none;
      }

      @media (min-width: 768px) {
        uigc-paper {
          border-radius: var(--uigc-app-border-radius);
        }
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
    this.screen.active = active;
    this.requestUpdate();
  }

  private calculateDollarPrice(asset: PoolAsset, amount: string) {
    if (this.stableCoinAssetId == asset.id) {
      return Number(amount).toFixed(2);
    }
    const usdPrice = this.assets.usdPrice.get(asset.id);
    return multipleAmounts(amount, usdPrice).toFixed(2);
  }

  async calculateBestSell(assetIn: PoolAsset, assetOut: PoolAsset, amountIn: string) {
    let tradeInfo: TradeInfo;
    try {
      tradeInfo = await getBestSell(assetIn, assetOut, amountIn);
    } catch (error) {
      console.error(error);
      this.resetTrade();
      return;
    }

    const { trade, transaction, slippage } = tradeInfo;
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
    console.log(trade);
  }

  async calculateBestBuy(assetIn: PoolAsset, assetOut: PoolAsset, amountOut: string) {
    let tradeInfo: TradeInfo;
    try {
      tradeInfo = await getBestBuy(assetIn, assetOut, amountOut);
    } catch (error) {
      console.error(error);
      this.resetTrade();
      return;
    }

    const { trade, transaction, slippage } = tradeInfo;
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
    } else if (this.trade.assetIn.symbol == this.assets.active) {
      this.recalculateBestSell();
    } else if (this.trade.assetOut.symbol == this.assets.active) {
      this.recalculateBestBuy();
    }
  }

  private async recalculateSpotPrice() {
    const assetIn = this.trade.assetIn;
    const assetOut = this.trade.assetOut;
    const router = chainCursor.deref().router;

    let spotPrice: string;
    if (this.trade.type == TradeType.Buy) {
      // SDK getBestSpotPrice support sell only atm
      const buy = await router.getBestBuy(assetIn.id, assetOut.id, 1);
      spotPrice = buy.toHuman().spotPrice;
    } else {
      const price = await router.getBestSpotPrice(assetIn.id, assetOut.id);
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
    } else if (this.trade.assetOut.symbol == this.assets.active) {
      this.switchAssets(this.trade.amountOut, null, true);
      this.recalculateBestSell();
    } else if (this.trade.assetIn.symbol == this.assets.active) {
      this.switchAssets(null, this.trade.amountIn, true);
      this.recalculateBestBuy();
    }
  }

  private async changeAssetIn(previous: string, asset: PoolAsset) {
    const assetIn = asset;
    const assetOut = this.trade.assetOut;

    // Switch if selecting the same asset for sell
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

    if (previous == this.assets.active) {
      this.trade = {
        ...this.trade,
        inProgress: true,
        assetIn: asset,
        balanceIn: null,
        amountOut: null,
      };
      this.assets.active = assetIn.symbol;
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

    // Switch if selecting the same asset for buy
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

    if (previous == this.assets.active) {
      this.trade = {
        ...this.trade,
        inProgress: true,
        assetOut: asset,
        balanceOut: null,
        amountIn: null,
      };
      this.assets.active = assetOut.symbol;
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

    if (!assetIn || !ammountIn || !accountCursor.deref()) {
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
    this.assets.balance = new Map([]);
  }

  updateBalances() {
    const balanceIn = this.assets.balance.get(this.trade.assetIn?.id);
    const balanceOut = this.assets.balance.get(this.trade.assetOut?.id);
    this.trade = {
      ...this.trade,
      balanceIn: balanceIn && formatAmount(balanceIn.amount, balanceIn.decimals),
      balanceOut: balanceOut && formatAmount(balanceOut.amount, balanceOut.decimals),
    };
  }

  async syncBalances() {
    const account = accountCursor.deref();
    if (account) {
      this.assets.balance = await getAssetsBalance(account.address, this.assets.list);
      this.updateBalances();
      this.validateEnoughBalance();
    }
  }

  async syncDolarPrice() {
    this.assets.usdPrice = await getAssetsDollarPrice(this.assets.list, this.stableCoinAssetId);
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

    const router = chainCursor.deref().router;
    const feeAssetPrice = await router.getBestSpotPrice(SYSTEM_ASSET_ID, feeAssetId);
    const fee = multipleAmounts(feeSystemAmount, feeAssetPrice);
    const ed = formatAmount(feeAssetEdBN, feeAssetPrice.decimals);
    return { amount: fee.toString(), asset: feeAssetSymbol, ed: ed } as TransactionFee;
  }

  async syncTransactionFee() {
    const account = accountCursor.deref();
    if (account && this.tx) {
      const { partialFee } = await getPaymentInfo(this.tx, account);
      const feeAssetId = await getFeePaymentAsset(account);
      const feeSystem = partialFee.toHuman();
      this.trade.transactionFee = await this.calculateTransactionFee(feeSystem, feeAssetId);
      this.requestUpdate();
    }
  }

  notificationMessage(t: TradeState, status: string): string {
    const isSell: boolean = t.type == TradeType.Sell;
    const amountIn = t.amountIn;
    const assetIn = t.assetIn.symbol;
    const amountOut = t.amountOut;
    const assetOut = t.assetOut.symbol;
    return [
      t.type,
      humanizeAmount(isSell ? amountIn : amountOut),
      isSell ? assetIn : assetOut,
      'for',
      humanizeAmount(isSell ? amountOut : amountIn),
      isSell ? assetOut : assetIn,
      status,
    ].join(' ');
  }

  notificationTemplate(trade: TradeState, status: string): TemplateResult {
    const isSell: boolean = trade.type == TradeType.Sell;
    const amountIn = trade.amountIn;
    const assetIn = trade.assetIn.symbol;
    const amountOut = trade.amountOut;
    const assetOut = trade.assetOut.symbol;
    return html`
      ${when(
        status,
        () => html` <span>${trade.type}</span> `,
        () => html` <span>You ${isSell ? 'sold' : 'bought'}</span> `
      )}
      <span class="highlight">${humanizeAmount(isSell ? amountIn : amountOut)}</span>
      <span class="highlight">${isSell ? assetIn : assetOut}</span>
      <span>for</span>
      <span class="highlight">${humanizeAmount(isSell ? amountOut : amountIn)}</span>
      <span class="highlight">${isSell ? assetOut : assetIn}</span>
      <span>${status}</span>
    `;
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
    const account = accountCursor.deref();
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

  initAssets() {
    if (!this.assetIn && !this.assetOut) {
      this.trade.assetIn = this.assets.map.get(this.stableCoinAssetId);
      this.trade.assetOut = this.assets.map.get(SYSTEM_ASSET_ID);
      this.recalculateSpotPrice();
      return;
    }
    this.updateAsset(this.assetIn, 'assetIn');
    this.updateAsset(this.assetOut, 'assetOut');
    this.validatePool();
  }

  async init() {
    const router = chainCursor.deref().router;
    const assets = await router.getAllAssets();
    const assetsPairs = await getAssetsPairs(assets);
    const assetsDetails = await getAssetsDetail(assets);

    this.assets = {
      ...this.assets,
      list: assets,
      map: new Map<string, PoolAsset>(assets.map((i) => [i.id, i])),
      pairs: assetsPairs,
      details: assetsDetails,
    };
    this.initAssets();
  }

  async subscribe() {
    const api = chainCursor.deref().api;
    this.disconnectSubscribeNewHeads = await api.rpc.chain.subscribeNewHeads(async (lastHeader) => {
      console.log('Current block: ' + lastHeader.number.toString());
      this.syncBalances();
      this.syncDolarPrice();
      this.syncTransactionFee();
      this.recalculateTrade();
    });
  }

  override async firstUpdated() {
    const pools = this.pools ? this.pools.split(',') : [];
    const chain = chainCursor.deref();
    if (!chain) {
      createApi(this.apiAddress, pools as PoolType[], () => {});
    }
  }

  private updateAccount() {
    if (this.accountAddress && this.accountProvider) {
      accountCursor.reset({
        address: this.accountAddress,
        provider: this.accountProvider,
        name: this.accountName,
      } as Account);
    } else {
      accountCursor.reset(null);
      this.resetTrade();
    }
  }

  override update(changedProperties: Map<string, unknown>) {
    if (changedProperties.has('accountAddress') || changedProperties.has('accountProvider')) {
      this.updateAccount();
      this.resetBalances();
    }
    super.update(changedProperties);
  }

  override async updated() {
    if (this.chain.state && !this.ready) {
      console.log('Initialization...');
      this.ready = true;
      await this.init();
      await this.subscribe();
      console.log('Done ✅');
    }
  }

  override connectedCallback() {
    super.connectedCallback();
    this.ro.observe(this);
    this.resetTrade(true);
  }

  override disconnectedCallback() {
    this.ro.unobserve(this);
    this.disconnectSubscribeNewHeads?.();
    super.disconnectedCallback();
  }

  settingsTemplate() {
    return html`<gc-trade-app-settings
      style="height: ${this.screen.height}px"
      @back-clicked=${() => this.changeScreen(TradeScreen.TradeTokens)}
      @slippage-changed=${() => this.recalculateTrade()}
    ></gc-trade-app-settings>`;
  }

  selectTokenTemplate() {
    return html`<gc-trade-app-select
      style="height: ${this.screen.height}px"
      .assets=${this.assets.list}
      .pairs=${this.assets.pairs}
      .balances=${this.assets.balance}
      .usdPrice=${this.assets.usdPrice}
      .assetIn=${this.trade.assetIn?.symbol}
      .assetOut=${this.trade.assetOut?.symbol}
      .selector=${this.assets.selector}
      @back-clicked=${() => this.changeScreen(TradeScreen.TradeTokens)}
      @asset-clicked=${(e: CustomEvent) => {
        const { id, asset } = this.assets.selector;
        id == 'assetIn' && this.changeAssetIn(asset, e.detail);
        id == 'assetOut' && this.changeAssetOut(asset, e.detail);
        this.updateBalances();
        this.validatePool();
        this.changeScreen(TradeScreen.TradeTokens);
      }}
    ></gc-trade-app-select>`;
  }

  tradeTokensTemplate() {
    return html`<gc-trade-app-main
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
        this.assets.active = asset;
        id == 'assetIn' && this.updateAmountIn(value);
        id == 'assetOut' && this.updateAmountOut(value);
        this.validateEnoughBalance();
      }}
      @asset-selector-clicked=${({ detail }: CustomEvent) => {
        this.assets.selector = detail;
        this.changeScreen(TradeScreen.SelectToken);
      }}
      @asset-switch-clicked=${() => {
        this.switch();
        this.validatePool();
      }}
      @settings-clicked=${() => this.changeScreen(TradeScreen.Settings)}
      @swap-clicked=${() => this.swap()}
    ></gc-trade-app-main>`;
  }

  render() {
    return html`
      <div>
        ${when(
          this.chart,
          () => html` <uigc-paper class="chart">
            <gc-trade-chart
              .assetIn=${this.trade.assetIn?.symbol}
              .assetOut=${this.trade.assetOut?.symbol}
              .spotPrice=${this.trade.spotPrice}
              .usdPrice=${this.assets.usdPrice}
            ></gc-trade-chart>
          </uigc-paper>`
        )}
        <uigc-paper class="main">
          ${choose(this.screen.active, [
            [TradeScreen.TradeTokens, () => this.tradeTokensTemplate()],
            [TradeScreen.Settings, () => this.settingsTemplate()],
            [TradeScreen.SelectToken, () => this.selectTokenTemplate()],
          ])}
        </uigc-paper>
      </div>
    `;
  }
}
