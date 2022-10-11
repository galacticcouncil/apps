import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { choose } from 'lit/directives/choose.js';

import { DatabaseController } from '../db.ctrl';
import { apiCursor, Api, readyCursor } from '../db';

import './trade/select-token';
import './trade/settings';
import './trade/trade-tokens';
import { PoolAsset } from '@galacticcouncil/sdk';

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
    inputAsset: null,
    assets: [],
    assetIn: null,
    amountIn: '0',
    assetOut: null,
    amountOut: '0',
    spotPrice: { in: null, out: null, price: '0' },
  };

  changeScreen(active: TradeScreen, detail: any) {
    this.screen = { active: active, detail: detail };
  }

  async calculateBestSell(assetIn: PoolAsset, assetOut: PoolAsset, amountIn: string) {
    const bestSell = await this.db.state.router.getBestSell(assetIn.id, assetOut.id, amountIn);
    const bestSellHuman = bestSell.toHuman();

    this.trade = {
      ...this.trade,
      inputAsset: assetIn.symbol,
      assetIn: assetIn,
      amountIn: amountIn,
      assetOut: assetOut,
      amountOut: bestSellHuman.amountOut,
      spotPrice: {
        in: assetIn.symbol,
        out: assetOut.symbol,
        price: bestSellHuman.spotPrice,
      },
    };
    console.log(bestSellHuman);
  }

  async calculateBestBuy(assetIn: PoolAsset, assetOut: PoolAsset, amountOut: string) {
    const bestBuy = await this.db.state.router.getBestBuy(assetIn.id, assetOut.id, amountOut);
    const bestBuyHuman = bestBuy.toHuman();

    this.trade = {
      ...this.trade,
      inputAsset: assetOut.symbol,
      assetIn: assetIn,
      amountIn: bestBuyHuman.amountIn,
      assetOut: assetOut,
      amountOut: amountOut,
      spotPrice: {
        in: assetOut.symbol,
        out: assetIn.symbol,
        price: bestBuyHuman.spotPrice,
      },
    };
    console.log(bestBuyHuman);
  }

  switchAndReCalculateSell(assetIn: PoolAsset, assetOut: PoolAsset) {
    if (assetIn.symbol == this.trade.inputAsset) {
      this.calculateBestSell(assetIn, assetOut, this.trade.amountOut);
    }
  }

  switchAndReCalculateBuy(assetIn: PoolAsset, assetOut: PoolAsset) {
    if (assetOut.symbol == this.trade.inputAsset) {
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

      if (changeDetail.asset == this.trade.inputAsset) {
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

      if (changeDetail.asset == this.trade.inputAsset) {
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
      const spotPrice = await this.db.state.router.getBestSpotPrice(assetIn.id, assetOut.id);
      const spotPriceHuman = spotPrice.amount.shiftedBy(-1 * spotPrice.decimals).toString();

      this.trade = {
        ...this.trade,
        assets: assets,
        assetIn: assetIn,
        assetOut: assetOut,
        spotPrice: { in: assetIn.symbol, out: assetOut.symbol, price: spotPriceHuman },
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
      ${choose(
        this.screen.active,
        [
          [TradeScreen.Settings, () => this.settingsTenplate()],
          [TradeScreen.SelectToken, () => this.selectTokenTenplate(this.screen.detail)],
        ],
        () => this.tradeTokensTenplate()
      )}
    `;
  }
}
