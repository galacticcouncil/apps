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
    assets: [],
    assetIn: null,
    amountIn: 0,
    assetOut: null,
    amountOut: 0,
    spotPrice: { in: null, out: null, price: '0' },
  };

  changeScreen(active: TradeScreen, detail: any) {
    this.screen = { active: active, detail: detail };
  }

  switchAssets() {
    const assetIn = this.trade.assetIn;
    const assetOut = this.trade.assetOut;

    this.trade = {
      ...this.trade,
      assets: this.trade.assets,
      assetIn: assetOut,
      assetOut: assetIn,
    };
    console.log('Switching ' + assetIn.symbol + ' for ' + assetOut.symbol);
  }

  changeAssetIn(changeDetail: any, asset: any) {
    if (changeDetail.id == 'assetIn') {
      this.trade = {
        ...this.trade,
        assetIn: asset,
      };
      console.log('Changing ' + changeDetail.asset + ' for ' + asset.symbol);
    }
  }

  changeAssetOut(changeDetail: any, asset: any) {
    if (changeDetail.id == 'assetOut') {
      this.trade = {
        ...this.trade,
        assetOut: asset,
      };
      console.log('Changing ' + changeDetail.asset + ' for ' + asset.symbol);
    }
  }

  async calculateBestSell(amountIn: string) {
    const bestSell = await this.db.state.router.getBestSell(this.trade.assetIn.id, this.trade.assetOut.id, amountIn);
    const bestSellHuman = bestSell.toHuman();

    this.trade = {
      ...this.trade,
      amountOut: bestSellHuman.amountOut,
      spotPrice: {
        in: this.trade.assetIn.symbol,
        out: this.trade.assetOut.symbol,
        price: bestSellHuman.spotPrice,
      },
    };
    console.log(bestSellHuman);
  }

  async calculateBestBuy(amountOut: string) {
    const bestBuy = await this.db.state.router.getBestBuy(this.trade.assetIn.id, this.trade.assetOut.id, amountOut);
    const bestBuyHuman = bestBuy.toHuman();

    this.trade = {
      ...this.trade,
      amountIn: bestBuyHuman.amountIn,
      spotPrice: {
        in: this.trade.assetOut.symbol,
        out: this.trade.assetIn.symbol,
        price: bestBuyHuman.spotPrice,
      },
    };
    console.log(bestBuyHuman);
  }

  async updateAmountIn(updateDetail: any) {
    if (updateDetail.id == 'assetIn') {
      this.calculateBestSell(updateDetail.value);
    }
  }

  async updateAmountOut(updateDetail: any) {
    if (updateDetail.id == 'assetOut') {
      this.calculateBestBuy(updateDetail.value);
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
