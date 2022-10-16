import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { choose } from 'lit/directives/choose.js';

import { baseStyles } from '../base.css';

import { DatabaseController } from '../db.ctrl';
import { apiCursor, Api, readyCursor } from '../db';
import { getSellInfo, getBuyInfo } from '../client/router';

import '../component/paper';

import './trade/select-token';
import './trade/settings';
import './trade/trade-tokens';
import './trade/trade-tokens';

import { BigNumber, bnum, PoolAsset, TradeType } from '@galacticcouncil/sdk';

enum TradeScreen {
  Settings,
  SelectToken,
  TradeTokens,
}

const SYSTEM_ASSET_ID = '0';

@customElement('app-trade')
export class Trade extends LitElement {
  private db = new DatabaseController<Api>(this, apiCursor);

  @state() screen = {
    active: TradeScreen.TradeTokens,
    detail: null,
  };

  @state() assets = {
    active: null,
    list: [],
    map: {},
  };

  @state() trade = {
    calculating: false,
    type: TradeType.Sell,
    afterSlippage: '0',
    transactionFee: '0',
    assetIn: null,
    amountIn: null,
    amountInUsd: '0',
    assetOut: null,
    amountOut: null,
    amountOutUsd: '0',
    spotPrice: null,
    swaps: [],
  };

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

  changeScreen(active: TradeScreen, detail: any) {
    this.screen = { active: active, detail: detail };
  }

  isSwapSelected(): boolean {
    return this.trade.assetIn && this.trade.assetOut;
  }

  isSwapEmpty(): boolean {
    return this.trade.amountIn == null && this.trade.amountOut == null;
  }

  isEmptyAmount(amount: string): boolean {
    return amount == '' || amount == '0';
  }

  async calculateSpotPrice(assetInId: string, assetOutId: string) {
    const spotPrice = await this.db.state.router.getBestSpotPrice(assetInId, assetOutId);
    return spotPrice.amount.shiftedBy(-1 * spotPrice.decimals).toString();
  }

  calculateSlippage(amount: BigNumber) {
    const slippagePct = window.localStorage.getItem('trade.settings.slippage');
    const slippage = amount.div(bnum('100')).multipliedBy(slippagePct);
    return slippage.decimalPlaces(0, 1);
  }

  async calculateBestSell(assetIn: PoolAsset, assetOut: PoolAsset, amountIn: string) {
    const bestSell = await this.db.state.router.getBestSell(assetIn.id, assetOut.id, amountIn);
    const bestSellInfo = await getSellInfo(bestSell, 'bXn8P59QmseUpCWTw4rf46bBL1VFP48qmvKSoUJefVMTKR9Jp');
    const bestSellHuman = bestSell.toHuman();

    this.trade = {
      ...this.trade,
      calculating: false,
      assetIn: assetIn,
      assetOut: assetOut,
      ...bestSellInfo,
      ...bestSellHuman,
    };
    this.assets.active = assetIn.symbol;
    console.log(bestSellHuman);
  }

  async calculateBestBuy(assetIn: PoolAsset, assetOut: PoolAsset, amountOut: string) {
    const bestBuy = await this.db.state.router.getBestBuy(assetIn.id, assetOut.id, amountOut);
    const bestBuyInfo = await getBuyInfo(bestBuy, 'bXn8P59QmseUpCWTw4rf46bBL1VFP48qmvKSoUJefVMTKR9Jp');
    const bestBuyHuman = bestBuy.toHuman();

    this.trade = {
      ...this.trade,
      calculating: false,
      assetIn: assetIn,
      assetOut: assetOut,
      ...bestBuyInfo,
      ...bestBuyHuman,
    };
    this.assets.active = assetOut.symbol;
    console.log(bestBuyHuman);
  }

  switchAndReCalculateSell() {
    this.trade = {
      ...this.trade,
      calculating: true,
      assetIn: this.trade.assetOut,
      assetOut: this.trade.assetIn,
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
      amountIn: null,
      amountOut: this.trade.amountIn,
    };
    this.calculateBestBuy(this.trade.assetIn, this.trade.assetOut, this.trade.amountOut);
  }

  switchAssets() {
    if (!this.isSwapSelected()) {
      this.trade = {
        ...this.trade,
        assetIn: this.trade.assetOut,
        assetOut: this.trade.assetIn,
        amountIn: this.trade.amountOut,
        amountOut: this.trade.amountIn,
      };
    } else if (this.trade.assetOut.symbol == this.assets.active) {
      this.switchAndReCalculateSell();
    } else if (this.trade.assetIn.symbol == this.assets.active) {
      this.switchAndReCalculateBuy();
    }
  }

  changeAssetIn(changeDetail: any, asset: any) {
    if (changeDetail.id == 'assetIn') {
      const assetIn = asset;
      const assetOut = this.trade.assetOut;

      if (assetOut == null || this.isSwapEmpty()) {
        this.trade = {
          ...this.trade,
          assetIn: asset,
        };
        return;
      }

      if (changeDetail.asset == this.assets.active) {
        this.trade = {
          ...this.trade,
          calculating: true,
          assetIn: asset,
          amountOut: null,
        };
        this.calculateBestSell(assetIn, assetOut, this.trade.amountIn);
      } else {
        this.trade = {
          ...this.trade,
          calculating: true,
          assetIn: asset,
          amountIn: null,
        };
        this.calculateBestBuy(assetIn, assetOut, this.trade.amountOut);
      }
    }
  }

  changeAssetOut(changeDetail: any, asset: any) {
    if (changeDetail.id == 'assetOut') {
      const assetIn = this.trade.assetIn;
      const assetOut = asset;

      if (assetIn == null || this.isSwapEmpty()) {
        this.trade = {
          ...this.trade,
          assetOut: asset,
        };
        return;
      }

      if (changeDetail.asset == this.assets.active) {
        this.trade = {
          ...this.trade,
          calculating: true,
          assetOut: asset,
          amountIn: null,
        };
        this.calculateBestBuy(assetIn, assetOut, this.trade.amountOut);
      } else {
        this.trade = {
          ...this.trade,
          calculating: true,
          assetOut: asset,
          amountOut: null,
        };
        this.calculateBestSell(assetIn, assetOut, this.trade.amountIn);
      }
    }
  }

  updateAmountIn(updateDetail: any) {
    console.log(updateDetail);
    if (updateDetail.id == 'assetIn') {
      if (this.isEmptyAmount(updateDetail.value)) {
        this.trade = {
          ...this.trade,
          amountOut: null,
          spotPrice: null,
          swaps: [],
        };
        return;
      }

      if (this.isSwapSelected()) {
        this.trade = {
          ...this.trade,
          calculating: true,
          amountOut: null,
        };
        this.calculateBestSell(this.trade.assetIn, this.trade.assetOut, updateDetail.value);
      } else {
        this.trade.amountIn = updateDetail.value;
        this.assets.active = updateDetail.asset;
      }
    }
  }

  updateAmountOut(updateDetail: any) {
    if (updateDetail.id == 'assetOut') {
      if (this.isEmptyAmount(updateDetail.value)) {
        this.trade = {
          ...this.trade,
          amountIn: null,
          spotPrice: null,
          swaps: [],
        };
        return;
      }

      if (this.isSwapSelected()) {
        this.trade = {
          ...this.trade,
          calculating: true,
          amountIn: null,
        };
        this.calculateBestBuy(this.trade.assetIn, this.trade.assetOut, updateDetail.value);
      } else {
        this.trade.amountOut = updateDetail.value;
        this.assets.active = updateDetail.asset;
      }
    }
  }

  async updated() {
    if (this.db.state && !readyCursor.deref()) {
      console.log('Initialization...');
      const router = this.db.state.router;
      const assets = await router.getAllAssets();
      const assetIn = assets.filter((a: PoolAsset) => a.id == SYSTEM_ASSET_ID)[0];
      this.trade = {
        ...this.trade,
        assetIn: assetIn,
      };

      const assetMap = new Map<string, string>(assets.map((i) => [i.id, i.symbol]));
      this.assets = {
        ...this.assets,
        list: assets,
        map: assetMap,
      };
      readyCursor.reset(true);
    }
  }

  settingsTenplate() {
    return html`<app-settings
      @back-clicked=${(e: CustomEvent) => this.changeScreen(TradeScreen.TradeTokens, e.detail)}
    ></app-settings>`;
  }

  selectTokenTenplate(detail: any) {
    return html`<app-select-token
      .assets=${this.assets.list}
      @back-clicked=${(e: CustomEvent) => this.changeScreen(TradeScreen.TradeTokens, e.detail)}
      @asset-clicked=${(e: CustomEvent) => {
        this.changeAssetIn(detail, e.detail);
        this.changeAssetOut(detail, e.detail);
        this.changeScreen(TradeScreen.TradeTokens, null);
      }}
    ></app-select-token>`;
  }

  tradeTokensTenplate() {
    return html`<app-trade-tokens
      .assets=${this.assets.map}
      .assetIn=${this.trade.assetIn?.symbol}
      .amountIn=${this.trade.amountIn}
      .assetOut=${this.trade.assetOut?.symbol}
      .amountOut=${this.trade.amountOut}
      .spotPrice=${this.trade.spotPrice}
      .tradeType=${this.trade.type}
      .afterSlippage=${this.trade.afterSlippage}
      .transactionFee=${this.trade.transactionFee}
      .swaps=${this.trade.swaps}
      .calculating=${this.trade.calculating}
      @asset-input-changed=${(e: CustomEvent) => {
        this.updateAmountIn(e.detail);
        this.updateAmountOut(e.detail);
      }}
      @asset-selector-clicked=${(e: CustomEvent) => {
        this.changeScreen(TradeScreen.SelectToken, e.detail);
      }}
      @asset-switch-clicked=${this.switchAssets}
      @settings-clicked=${(e: CustomEvent) => this.changeScreen(TradeScreen.Settings, e.detail)}
    ></app-trade-tokens>`;
  }

  render() {
    return html`
      <ui-paper>
        ${choose(this.screen.active, [
          [TradeScreen.TradeTokens, () => this.tradeTokensTenplate()],
          [TradeScreen.Settings, () => this.settingsTenplate()],
          [TradeScreen.SelectToken, () => this.selectTokenTenplate(this.screen.detail)],
        ])}
      </ui-paper>
    `;
  }
}
