import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { choose } from 'lit/directives/choose.js';

import { baseStyles } from '../base.css';

import { DatabaseController } from '../db.ctrl';
import { Chain, chainCursor, readyCursor, accountCursor, transactionCursor } from '../db';
import { getPaymentInfo } from '../api/transaction';
import { getBestSell, getBestBuy } from '../api/trade';

import { getBalance } from '../api/asset';

import { formatAmount } from '../utils/amount';
import { pairsById, assetsById } from '../utils/assets';
import { SYSTEM_ASSET_ID } from '../utils/chain';

import '../component/Paper';

import './trade/select-token';
import './trade/settings';
import './trade/trade-tokens';

import { TradeScreen, AssetsState, TradeState, DEFAULT_ASSETS_STATE, DEFAULT_TRADE_STATE } from './trade.d';
import { PoolAsset } from '@galacticcouncil/sdk';

@customElement('app-trade')
export class Trade extends LitElement {
  private chain = new DatabaseController<Chain>(this, chainCursor);

  @state() screen: TradeScreen = TradeScreen.TradeTokens;
  @state() assets: AssetsState = DEFAULT_ASSETS_STATE;
  @state() trade: TradeState = DEFAULT_TRADE_STATE;

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

      ui-paper {
        max-height: 650px;
        width: 100%;
        display: block;
      }
    `,
  ];

  changeScreen(active: TradeScreen) {
    this.screen = active;
  }

  isSwapSelected(): boolean {
    return this.trade.assetIn != null && this.trade.assetOut != null;
  }

  isSwapEmpty(): boolean {
    return this.trade.amountIn == null && this.trade.amountOut == null;
  }

  isEmptyAmount(amount: string): boolean {
    return amount == '' || amount == '0';
  }

  async calculateBestSell(assetIn: PoolAsset, assetOut: PoolAsset, amountIn: string) {
    const { trade, transaction, slippage } = await getBestSell(assetIn, assetOut, amountIn);
    this.trade = {
      ...this.trade,
      calculating: false,
      assetIn: assetIn,
      assetOut: assetOut,
      afterSlippage: slippage,
      ...trade,
    };
    transactionCursor.reset(transaction);
    console.log(trade);
  }

  async calculateBestBuy(assetIn: PoolAsset, assetOut: PoolAsset, amountOut: string) {
    const { trade, transaction, slippage } = await getBestBuy(assetIn, assetOut, amountOut);
    this.trade = {
      ...this.trade,
      calculating: false,
      assetIn: assetIn,
      assetOut: assetOut,
      afterSlippage: slippage,
      ...trade,
    };
    transactionCursor.reset(transaction);
    console.log(trade);
  }

  switchAndReCalculateSell() {
    this.trade = {
      ...this.trade,
      calculating: true,
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
      calculating: true,
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

  async updateBalances() {
    const account = accountCursor.deref();
    if (account == null) {
      return;
    }
    const balances = await Promise.all([
      await getBalance(account, this.trade.assetIn?.id),
      await getBalance(account, this.trade.assetOut?.id),
    ]);
    const balanceIn = formatAmount(balances[0].amount, balances[0].decimals);
    const balanceOut = formatAmount(balances[1].amount, balances[1].decimals);
    this.trade = {
      ...this.trade,
      balanceIn: balanceIn,
      balanceOut: balanceOut,
    };
  }

  changeAssetIn(asset: PoolAsset) {
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

    if (asset.symbol == this.assets.active) {
      this.trade = {
        ...this.trade,
        calculating: true,
        assetIn: asset,
        balanceIn: null,
        amountOut: null,
      };
      this.calculateBestSell(assetIn, assetOut, this.trade.amountIn);
    } else {
      this.trade = {
        ...this.trade,
        calculating: true,
        assetIn: asset,
        balanceIn: null,
        amountIn: null,
      };
      this.calculateBestBuy(assetIn, assetOut, this.trade.amountOut);
    }
  }

  changeAssetOut(asset: PoolAsset) {
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

    if (asset.symbol == this.assets.active) {
      this.trade = {
        ...this.trade,
        calculating: true,
        assetOut: asset,
        balanceOut: null,
        amountIn: null,
      };
      this.calculateBestBuy(assetIn, assetOut, this.trade.amountOut);
    } else {
      this.trade = {
        ...this.trade,
        calculating: true,
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

  updateAmountIn(amount: string) {
    // Wipe the trade info on input clear
    if (this.isEmptyAmount(amount)) {
      this.clearAmounts();
      return;
    }

    if (this.isSwapSelected()) {
      this.trade = {
        ...this.trade,
        calculating: true,
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
        calculating: true,
        amountIn: null,
      };
      this.calculateBestBuy(this.trade.assetIn, this.trade.assetOut, amount);
    } else {
      this.trade.amountOut = amount;
    }
  }

  async init() {
    const router = chainCursor.deref().router;
    const assets = await router.getAllAssets();
    const pairs: [string, PoolAsset[]][] = await Promise.all(
      assets.map(async (asset: PoolAsset) => [asset.id, await router.getAssetPairs(asset.id)])
    );

    this.assets = {
      ...this.assets,
      list: assets,
      map: assetsById(assets),
      pairs: pairsById(pairs),
    };

    this.trade.assetIn = this.assets.map.get(SYSTEM_ASSET_ID);
    readyCursor.reset(true);
  }

  async subscribe() {
    const api = chainCursor.deref().api;
    await api.rpc.chain.subscribeNewHeads(async (lastHeader) => {
      console.log('Current block: ' + lastHeader.number.toString());
      this.updateBalances();
      // TODO: Sync trade
    });
  }

  async updated() {
    if (this.chain.state && !readyCursor.deref()) {
      console.log('Initialization...');
      await this.init();
      await this.subscribe();
      console.log('Done ✅');
    }
  }

  settingsTenplate() {
    return html`<app-settings
      @back-clicked=${(e: CustomEvent) => this.changeScreen(TradeScreen.TradeTokens)}
    ></app-settings>`;
  }

  selectTokenTenplate() {
    return html`<app-select-token
      .assets=${this.assets.list}
      .pairs=${this.assets.pairs}
      .assetIn=${this.trade.assetIn?.symbol}
      .assetOut=${this.trade.assetOut?.symbol}
      .change=${this.assets.selector}
      @back-clicked=${(e: CustomEvent) => this.changeScreen(TradeScreen.TradeTokens)}
      @asset-clicked=${(e: CustomEvent) => {
        this.assets.selector.id == 'assetIn' && this.changeAssetIn(e.detail);
        this.assets.selector.id == 'assetOut' && this.changeAssetOut(e.detail);
        this.updateBalances();
        this.changeScreen(TradeScreen.TradeTokens);
      }}
    ></app-select-token>`;
  }

  tradeTokensTenplate() {
    return html`<app-trade-tokens
      .assets=${this.assets.map}
      .assetIn=${this.trade.assetIn?.symbol}
      .amountIn=${this.trade.amountIn}
      .balanceIn=${this.trade.balanceIn}
      .assetOut=${this.trade.assetOut?.symbol}
      .amountOut=${this.trade.amountOut}
      .balanceOut=${this.trade.balanceOut}
      .spotPrice=${this.trade.spotPrice}
      .tradeType=${this.trade.type}
      .afterSlippage=${this.trade.afterSlippage}
      .transactionFee=${this.trade.transactionFee}
      .swaps=${this.trade.swaps}
      .calculating=${this.trade.calculating}
      @asset-input-changed=${({ detail: { id, asset, value } }: CustomEvent) => {
        this.assets.active = asset;
        id == 'assetIn' && this.updateAmountIn(value);
        id == 'assetOut' && this.updateAmountOut(value);
      }}
      @asset-selector-clicked=${({ detail }: CustomEvent) => {
        this.assets.selector = detail;
        this.changeScreen(TradeScreen.SelectToken);
      }}
      @asset-switch-clicked=${this.switchAssets}
      @settings-clicked=${(e: CustomEvent) => this.changeScreen(TradeScreen.Settings)}
    ></app-trade-tokens>`;
  }

  render() {
    return html`
      <ui-paper>
        ${choose(this.screen, [
          [TradeScreen.TradeTokens, () => this.tradeTokensTenplate()],
          [TradeScreen.Settings, () => this.settingsTenplate()],
          [TradeScreen.SelectToken, () => this.selectTokenTenplate()],
        ])}
      </ui-paper>
    `;
  }
}
