import { LitElement, html, css, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { choose } from 'lit/directives/choose.js';
import short from 'short-uuid';

import { baseStyles } from '../base.css';
import { createApi } from '../../chain';
import { DatabaseController } from '../../db.ctrl';
import { Chain, chainCursor, Account, accountCursor, transactionCursor } from '../../db';
import { getPaymentInfo, signAndSend } from '../../api/transaction';
import { getBestSell, getBestBuy } from '../../api/trade';
import { getAssetsBalance, getAssetsPairs } from '../../api/asset';
import { formatAmount, humanizeAmount } from '../../utils/amount';
import { SYSTEM_ASSET_ID } from '../../utils/chain';

import '@galacticcouncil/ui';
import { bnum, PoolAsset, PoolType, scale, TradeType } from '@galacticcouncil/sdk';

import './select-token';
import './settings';
import './trade-tokens';

import {
  TradeScreen,
  ScreenState,
  AssetsState,
  TradeState,
  DEFAULT_SCREEN_STATE,
  DEFAULT_ASSETS_STATE,
  DEFAULT_TRADE_STATE,
} from './types';
import { Notification, NotificationType } from '../notification/types';

@customElement('gc-trade-app')
export class TradeApp extends LitElement {
  private chain = new DatabaseController<Chain>(this, chainCursor);
  private ready: boolean = false;
  private ro = new ResizeObserver((entries) => {
    entries.forEach((entry) => {
      this.screen.height = entry.contentRect.height;
    });
  });
  private disconnectSubscribeNewHeads: () => void = null;

  @state() screen: ScreenState = DEFAULT_SCREEN_STATE;
  @state() assets: AssetsState = DEFAULT_ASSETS_STATE;
  @state() trade: TradeState = DEFAULT_TRADE_STATE;

  @property({ type: String }) apiAddress: string = null;
  @property({ type: String }) accountAddress: string = null;
  @property({ type: String }) accountProvider: string = null;
  @property({ type: String }) accountName: string = null;
  @property({ type: String }) pools: string = null;
  @property({ type: String }) assetIn: string = null;
  @property({ type: String }) assetOut: string = null;

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

      uigc-paper {
        width: 100%;
        display: block;
        border-radius: var(--uigc-app-border-radius);
      }
    `,
  ];

  isSwapSelected(): boolean {
    return this.trade.assetIn != null && this.trade.assetOut != null;
  }

  isSwapEmpty(): boolean {
    return this.trade.amountIn == null && this.trade.amountOut == null;
  }

  isEmptyAmount(amount: string): boolean {
    return amount == '' || amount == '0';
  }

  hasError(): boolean {
    return Object.keys(this.trade.error).length > 0;
  }

  changeScreen(active: TradeScreen) {
    this.screen.active = active;
    this.requestUpdate();
  }

  async calculateBestSell(assetIn: PoolAsset, assetOut: PoolAsset, amountIn: string) {
    const { trade, transaction, slippage } = await getBestSell(assetIn, assetOut, amountIn);
    this.trade = {
      ...this.trade,
      inProgress: false,
      assetIn: assetIn,
      assetOut: assetOut,
      afterSlippage: slippage,
      ...trade,
      amountOut: humanizeAmount(trade.amountOut, true),
    };
    transactionCursor.reset(transaction);
    this.validateTrade(TradeType.Sell);
    console.log(trade);
  }

  async calculateBestBuy(assetIn: PoolAsset, assetOut: PoolAsset, amountOut: string) {
    const { trade, transaction, slippage } = await getBestBuy(assetIn, assetOut, amountOut);
    this.trade = {
      ...this.trade,
      inProgress: false,
      assetIn: assetIn,
      assetOut: assetOut,
      afterSlippage: slippage,
      ...trade,
      amountIn: humanizeAmount(trade.amountIn, true),
    };
    transactionCursor.reset(transaction);
    this.validateTrade(TradeType.Buy);
    console.log(trade);
  }

  switchAndReCalculateSell() {
    this.trade = {
      ...this.trade,
      inProgress: true,
      assetIn: this.trade.assetOut,
      assetOut: this.trade.assetIn,
      balanceIn: this.trade.balanceOut,
      balanceOut: this.trade.balanceIn,
      amountIn: this.trade.amountOut,
      amountOut: null,
    };
    this.calculateBestSell(this.trade.assetIn, this.trade.assetOut, this.trade.amountIn);
  }

  switchAndReCalculateBuy() {
    this.trade = {
      ...this.trade,
      inProgress: true,
      assetIn: this.trade.assetOut,
      assetOut: this.trade.assetIn,
      balanceIn: this.trade.balanceOut,
      balanceOut: this.trade.balanceIn,
      amountIn: null,
      amountOut: this.trade.amountIn,
    };
    this.calculateBestBuy(this.trade.assetIn, this.trade.assetOut, this.trade.amountOut);
  }

  switchAssets() {
    if (!this.isSwapSelected() || this.isSwapEmpty()) {
      this.trade = {
        ...this.trade,
        assetIn: this.trade.assetOut,
        assetOut: this.trade.assetIn,
        balanceIn: this.trade.balanceOut,
        balanceOut: this.trade.balanceIn,
        amountIn: this.trade.amountOut,
        amountOut: this.trade.amountIn,
      };
    } else if (this.trade.assetOut.symbol == this.assets.active) {
      this.switchAndReCalculateSell();
    } else if (this.trade.assetIn.symbol == this.assets.active) {
      this.switchAndReCalculateBuy();
    }
  }

  changeAssetIn(previous: string, asset: PoolAsset) {
    const assetIn = asset;
    const assetOut = this.trade.assetOut;

    // Change without recalculation if amount not set or pair not specified
    if (assetOut == null || this.isSwapEmpty()) {
      this.trade = {
        ...this.trade,
        assetIn: asset,
        balanceIn: null,
      };
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

  changeAssetOut(previous: string, asset: PoolAsset) {
    const assetIn = this.trade.assetIn;
    const assetOut = asset;

    // Change without recalculation if amount not set or pair not specified
    if (assetIn == null || this.isSwapEmpty()) {
      this.trade = {
        ...this.trade,
        assetOut: asset,
        balanceOut: null,
      };
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

  clearAmounts() {
    this.trade = {
      ...this.trade,
      amountIn: null,
      amountOut: null,
      spotPrice: null,
      swaps: [],
    };
  }

  validateEnoughBalance(amount: string, asset: PoolAsset) {
    const assetBalance = this.assets.balance.get(asset.id);
    const assetAmount = scale(bnum(amount), assetBalance.decimals);
    if (assetAmount.gt(assetBalance.amount)) {
      this.trade.error['balance'] = 'Your trade is bigger than your balance';
    } else {
      delete this.trade.error['balance'];
    }
  }

  translateTradeError(error: string): string {
    switch (error) {
      case 'InsufficientTradingAmount':
        return 'Minimal trade limit is not reached';
      case 'MaxOutRatioExceeded':
        return 'Maximal pool trade limit is reached, please split your trade';
      case 'MaxInRatioExceeded':
        return 'Maximal pool trade limit is reached, please split your trade';
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

  updateAmountIn(amount: string) {
    // Wipe the trade info on input clear
    if (this.isEmptyAmount(amount)) {
      this.clearAmounts();
      return;
    }

    if (this.isSwapSelected()) {
      this.trade = {
        ...this.trade,
        inProgress: true,
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
      this.clearAmounts();
      return;
    }

    if (this.isSwapSelected()) {
      this.trade = {
        ...this.trade,
        inProgress: true,
        amountIn: null,
      };
      this.calculateBestBuy(this.trade.assetIn, this.trade.assetOut, amount);
    } else {
      this.trade.amountOut = amount;
    }
  }

  updateBalances() {
    const balanceIn = this.assets.balance.get(this.trade.assetIn?.id);
    const balanceOut = this.assets.balance.get(this.trade.assetOut?.id);
    this.trade = {
      ...this.trade,
      balanceIn: balanceIn && humanizeAmount(formatAmount(balanceIn.amount, balanceIn.decimals)),
      balanceOut: balanceOut && humanizeAmount(formatAmount(balanceOut.amount, balanceOut.decimals)),
    };
  }

  async syncBalances() {
    const account = accountCursor.deref();
    if (account) {
      this.assets.balance = await getAssetsBalance(account.address, this.assets.list);
      this.updateBalances();
    }
  }

  async syncTransactionFee() {
    const account = accountCursor.deref();
    const transaction = transactionCursor.deref();
    if (account && transaction) {
      const { partialFee } = await getPaymentInfo(transaction, account);
      this.trade.transactionFee = partialFee.toHuman();
      this.requestUpdate();
    }
  }

  notificationMessage(t: TradeState, status: string): string {
    return [t.type, t.amountIn, t.assetIn.symbol, 'for', t.amountOut, t.assetOut.symbol, status].join(' ');
  }

  notificationTemplate(trade: TradeState, status: string): TemplateResult {
    return html`
      <span>${trade.type}</span>
      <span class="highlight">${trade.amountIn}</span>
      <span class="highlight">${trade.assetIn.symbol}</span>
      <span>for</span>
      <span class="highlight">${trade.amountOut}</span>
      <span class="highlight">${trade.assetOut.symbol}</span>
      <span>${status}</span>
    `;
  }

  updateTxStatus(id: string, type: NotificationType, trade: TradeState, status: string) {
    const message = this.notificationTemplate(trade, status);
    const options = {
      bubbles: true,
      composed: true,
      detail: { id: id, timestamp: Date.now(), type: type, message: message, toast: true } as Notification,
    };
    this.dispatchEvent(new CustomEvent<Notification>('gc:tx:' + status, options));
  }

  async swap(processingId: string, trade: TradeState) {
    const account = accountCursor.deref();
    const transaction = transactionCursor.deref();
    if (account && transaction) {
      signAndSend(
        transaction,
        account,
        ({ status }) => {
          const type = status.type.toLowerCase();
          switch (type) {
            case 'broadcast':
              this.updateTxStatus(processingId, NotificationType.progress, trade, 'broadcasted');
              break;
            case 'inblock':
              this.updateTxStatus(processingId, NotificationType.success, trade, 'submitted');
              console.log(`Completed at block hash #${status.asInBlock.toString()}`);
              break;
          }
        },
        (error) => {
          this.updateTxStatus(processingId, NotificationType.error, trade, 'failed');
        }
      );
    }
  }

  async init() {
    const router = chainCursor.deref().router;
    const assets = await router.getAllAssets();
    const assetsPairs = await getAssetsPairs(assets);

    this.assets = {
      ...this.assets,
      list: assets,
      map: new Map<string, PoolAsset>(assets.map((i) => [i.id, i])),
      pairs: assetsPairs,
    };
    this.initAssets();
  }

  initAssets() {
    if (this.assetIn == null && this.assetOut == null) {
      this.trade.assetIn = this.assets.map.get(SYSTEM_ASSET_ID);
      return;
    }

    if (this.assetIn) {
      this.trade.assetIn = this.assets.map.get(this.assetIn);
    }
    if (this.assetOut) {
      this.trade.assetOut = this.assets.map.get(this.assetOut);
    }
  }

  async subscribe() {
    const api = chainCursor.deref().api;
    this.disconnectSubscribeNewHeads = await api.rpc.chain.subscribeNewHeads(async (lastHeader) => {
      console.log('Current block: ' + lastHeader.number.toString());
      this.syncBalances();
      this.syncTransactionFee();
    });
  }

  override async firstUpdated() {
    const pools = this.pools ? this.pools.split(',') : [];
    const chain = chainCursor.deref();
    if (!chain) {
      createApi(this.apiAddress, pools as PoolType[], () => {});
    }
  }

  override update(changedProperties: Map<string, unknown>) {
    if (
      changedProperties.has('accountAddress') ||
      changedProperties.has('accountProvider') ||
      changedProperties.has('accountName')
    ) {
      const account = accountCursor.deref();
      accountCursor.reset({
        address: this.accountAddress ?? account?.address,
        provider: this.accountProvider ?? account?.provider,
        name: this.accountName ?? account?.name,
      } as Account);
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
  }

  override disconnectedCallback() {
    this.ro.unobserve(this);
    this.disconnectSubscribeNewHeads?.();
    super.disconnectedCallback();
  }

  settingsTenplate() {
    return html`<gc-trade-app-settings
      style="height: ${this.screen.height}px"
      @back-clicked=${() => this.changeScreen(TradeScreen.TradeTokens)}
    ></gc-trade-app-settings>`;
  }

  selectTokenTenplate() {
    return html`<gc-trade-app-select
      style="height: ${this.screen.height}px"
      .assets=${this.assets.list}
      .pairs=${this.assets.pairs}
      .balances=${this.assets.balance}
      .assetIn=${this.trade.assetIn?.symbol}
      .assetOut=${this.trade.assetOut?.symbol}
      .selector=${this.assets.selector}
      @back-clicked=${() => this.changeScreen(TradeScreen.TradeTokens)}
      @asset-clicked=${(e: CustomEvent) => {
        const { id, asset } = this.assets.selector;
        id == 'assetIn' && this.changeAssetIn(asset, e.detail);
        id == 'assetOut' && this.changeAssetOut(asset, e.detail);
        this.updateBalances();
        this.changeScreen(TradeScreen.TradeTokens);
      }}
    ></gc-trade-app-select>`;
  }

  tradeTokensTenplate() {
    return html`<gc-trade-app-main
      .assets=${this.assets.map}
      .inProgress=${this.trade.inProgress}
      .disabled=${!this.isSwapSelected() || this.isSwapEmpty() || this.hasError()}
      .tradeType=${this.trade.type}
      .assetIn=${this.trade.assetIn?.symbol}
      .assetOut=${this.trade.assetOut?.symbol}
      .amountIn=${this.trade.amountIn}
      .amountOut=${this.trade.amountOut}
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
        id == 'assetIn' && this.validateEnoughBalance(value, this.trade.assetIn);
        id == 'assetOut' && this.updateAmountOut(value);
        id == 'assetOut' && this.validateEnoughBalance(value, this.trade.assetOut);
      }}
      @asset-selector-clicked=${({ detail }: CustomEvent) => {
        this.assets.selector = detail;
        this.changeScreen(TradeScreen.SelectToken);
      }}
      @asset-switch-clicked=${this.switchAssets}
      @settings-clicked=${() => this.changeScreen(TradeScreen.Settings)}
      @swap-clicked=${() => {
        const processingId = short.generate();
        this.swap(processingId, this.trade);
      }}
    ></gc-trade-app-main>`;
  }

  render() {
    return html`
      <uigc-paper>
        ${choose(this.screen.active, [
          [TradeScreen.TradeTokens, () => this.tradeTokensTenplate()],
          [TradeScreen.Settings, () => this.settingsTenplate()],
          [TradeScreen.SelectToken, () => this.selectTokenTenplate()],
        ])}
      </uigc-paper>
    `;
  }
}
