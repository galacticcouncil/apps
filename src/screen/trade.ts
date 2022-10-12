import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { choose } from 'lit/directives/choose.js';

import { baseStyles } from '../base.css';

import { DatabaseController } from '../db.ctrl';
import { apiCursor, Api, readyCursor } from '../db';

import '../component/paper';

import './trade/select-token';
import './trade/settings';
import './trade/trade-tokens';
import './trade/trade-tokens';

import { PoolAsset, TradeType } from '@galacticcouncil/sdk';

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

  @state() trade = {
    type: TradeType.Sell,
    assets: [],
    active: null,
    assetIn: null,
    amountIn: '0',
    amountInUsd: '0',
    assetOut: null,
    amountOut: '0',
    amountOutUsd: '0',
    spotPrice: '0',
  };

  static styles = [
    baseStyles,
    css`
      :host {
        display: block;
        max-width: 595px;
        margin-left: auto;
        margin-right: auto;
        position: relative;
      }

      ui-paper {
        height: 650px;
        width: 100%;
        display: flex;
        flex-direction: column;
      }
    `,
  ];

  changeScreen(active: TradeScreen, detail: any) {
    this.screen = { active: active, detail: detail };
  }

  async calculateSpotPrice(assetInId: string, assetOutId: string) {
    const spotPrice = await this.db.state.router.getBestSpotPrice(assetInId, assetOutId);
    return spotPrice.amount.shiftedBy(-1 * spotPrice.decimals).toString();
  }

  async calculateBestSell(assetIn: PoolAsset, assetOut: PoolAsset, amountIn: string) {
    const bestSell = await this.db.state.router.getBestSell(assetIn.id, assetOut.id, amountIn);
    const bestSellHuman = bestSell.toHuman();

    this.trade = {
      ...this.trade,
      active: assetIn.symbol,
      assetIn: assetIn,
      assetOut: assetOut,
      ...bestSellHuman,
    };
    console.log(bestSellHuman);
  }

  async calculateBestBuy(assetIn: PoolAsset, assetOut: PoolAsset, amountOut: string) {
    const bestBuy = await this.db.state.router.getBestBuy(assetIn.id, assetOut.id, amountOut);
    const bestBuyHuman = bestBuy.toHuman();

    this.trade = {
      ...this.trade,
      active: assetOut.symbol,
      assetIn: assetIn,
      assetOut: assetOut,
      ...bestBuyHuman,
    };
    console.log(bestBuyHuman);
  }

  switchAndReCalculateSell(assetIn: PoolAsset, assetOut: PoolAsset) {
    if (assetIn.symbol == this.trade.active) {
      this.calculateBestSell(assetIn, assetOut, this.trade.amountOut);
    }
  }

  switchAndReCalculateBuy(assetIn: PoolAsset, assetOut: PoolAsset) {
    if (assetOut.symbol == this.trade.active) {
      this.calculateBestBuy(assetIn, assetOut, this.trade.amountIn);
    }
  }

  switchAssets() {
    const assetIn = this.trade.assetOut;
    const assetOut = this.trade.assetIn;

    this.switchAndReCalculateSell(assetIn, assetOut);
    this.switchAndReCalculateBuy(assetIn, assetOut);
  }

  changeAssetIn(changeDetail: any, asset: any) {
    if (changeDetail.id == 'assetIn') {
      const assetIn = asset;
      const assetOut = this.trade.assetOut;

      if (changeDetail.asset == this.trade.active) {
        this.calculateBestSell(assetIn, assetOut, this.trade.amountIn);
      } else {
        this.calculateBestBuy(assetIn, assetOut, this.trade.amountOut);
      }
    }
  }

  changeAssetOut(changeDetail: any, asset: any) {
    if (changeDetail.id == 'assetOut') {
      const assetIn = this.trade.assetIn;
      const assetOut = asset;

      if (changeDetail.asset == this.trade.active) {
        this.calculateBestBuy(assetIn, assetOut, this.trade.amountOut);
      } else {
        this.calculateBestSell(assetIn, assetOut, this.trade.amountIn);
      }
    }
  }

  updateAmountIn(updateDetail: any) {
    if (updateDetail.id == 'assetIn') {
      this.calculateBestSell(this.trade.assetIn, this.trade.assetOut, updateDetail.value);
    }
  }

  updateAmountOut(updateDetail: any) {
    if (updateDetail.id == 'assetOut') {
      this.calculateBestBuy(this.trade.assetIn, this.trade.assetOut, updateDetail.value);
    }
  }

  async updated() {
    if (this.db.state && !readyCursor.deref()) {
      console.log('Initialization...');
      const assets = await this.db.state.router.getAllAssets();
      const systemAsset = assets.filter((a: PoolAsset) => a.id == SYSTEM_ASSET_ID)[0];
      const systemAssetPairs = await this.db.state.router.getAssetPairs(SYSTEM_ASSET_ID);

      const assetIn = systemAsset;
      const assetOut = systemAssetPairs[0];
      const spotPrice = await this.calculateSpotPrice(assetIn.id, assetOut.id);

      this.trade = {
        ...this.trade,
        assets: assets,
        assetIn: assetIn,
        assetOut: assetOut,
        spotPrice: spotPrice,
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
      .assets=${this.trade.assets}
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
      .assetIn=${this.trade.assetIn?.symbol}
      .amountIn=${this.trade.amountIn}
      .assetOut=${this.trade.assetOut?.symbol}
      .amountOut=${this.trade.amountOut}
      .spotPrice=${this.trade.spotPrice}
      .tradeType=${this.trade.type}
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
        ${choose(
          this.screen.active,
          [
            [TradeScreen.Settings, () => this.settingsTenplate()],
            [TradeScreen.SelectToken, () => this.selectTokenTenplate(this.screen.detail)],
          ],
          () => this.tradeTokensTenplate()
        )}
      </ui-paper>
    `;
  }
}
