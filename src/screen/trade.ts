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
    assetOut: null,
  };

  changeScreen(active: TradeScreen, detail: any) {
    this.screen = { active: active, detail: detail };
  }

  switchAssets() {
    const assetIn = this.trade.assetIn;
    const assetOut = this.trade.assetOut;

    this.trade = {
      assets: this.trade.assets,
      assetIn: assetOut,
      assetOut: assetIn,
    };
    console.log('Switching ' + assetIn.symbol + ' for ' + assetOut.symbol);
  }

  changeAsset(changeDetail: any, asset: any) {
    if (changeDetail.id == 'assetIn') {
      this.trade = {
        ...this.trade,
        assetIn: asset,
      };
    }
    if (changeDetail.id == 'assetOut') {
      this.trade = {
        ...this.trade,
        assetOut: asset,
      };
    }
    console.log('Changing ' + changeDetail.asset + ' for ' + asset.symbol);
  }

  async updated() {
    if (this.db.state && !readyCursor.deref()) {
      console.log('Initialization...');
      const assets = await this.db.state.router.getAllAssets();
      const systemAsset = assets.filter((a: PoolAsset) => a.id == SYSTEM_ASSET_ID)[0];
      const systemAssetPairs = await this.db.state.router.getAssetPairs(SYSTEM_ASSET_ID);

      const assetIn = systemAsset;
      const assetOut = systemAssetPairs[0];
      this.trade = {
        assets: assets,
        assetIn: assetIn,
        assetOut: assetOut,
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
        this.changeAsset(detail, e.detail);
        this.changeScreen(TradeScreen.TradeTokens, null);
      }}
    ></app-select-token>`;
  }

  tradeTokensTenplate() {
    return html`<app-trade-tokens
      .assetIn=${this.trade.assetIn?.symbol}
      .assetOut=${this.trade.assetOut?.symbol}
      @asset-input-changed=${(e: CustomEvent) => {
        console.log(e.detail);
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
