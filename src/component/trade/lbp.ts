import { html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import * as i18n from 'i18next';

import './form';
import './settings';
import '../chart';
import '../selector/asset';

import { TradeApp } from '.';
import { ONE, PoolAsset, PoolType, TradeType } from '@galacticcouncil/sdk';
import { TradeTab } from './types';

@customElement('gc-lbp-app')
export class LbpApp extends TradeApp {
  @state() lbpSwap = null;

  protected async recalculateSpotPrice() {
    const assetIn = this.trade.assetIn;
    const assetOut = this.trade.assetOut;

    if (!assetIn || !assetOut) {
      return;
    }

    let trade: any;
    if (this.trade.type == TradeType.Buy) {
      trade = await this.router.getBestBuy(assetIn.id, assetOut.id, ONE);
    } else {
      trade = await this.router.getBestSell(assetIn.id, assetOut.id, ONE);
    }

    const tradeHuman = trade.toHuman();
    this.lbpSwap = tradeHuman.swaps.find(
      (swap: any) => swap.pool === PoolType.LBP,
    );

    this.trade = {
      ...this.trade,
      inProgress: false,
      spotPrice: tradeHuman.spotPrice,
    };
  }

  protected async calculateSell(
    assetIn: PoolAsset,
    assetOut: PoolAsset,
    amountIn: string,
  ) {
    await super.calculateSell(assetIn, assetOut, amountIn);
    this.lbpSwap = this.trade.swaps.find(
      (swap: any) => swap.pool === PoolType.LBP,
    );
  }

  protected async calculateBuy(
    assetIn: PoolAsset,
    assetOut: PoolAsset,
    amountOut: string,
  ) {
    await super.calculateBuy(assetIn, assetOut, amountOut);
    this.lbpSwap = this.trade.swaps.find(
      (swap: any) => swap.pool === PoolType.LBP,
    );
  }

  tradeChartTab() {
    const assetIn = this.assets.map.get(this.lbpSwap?.assetIn);
    const assetOut = this.assets.map.get(this.lbpSwap?.assetOut);
    const classes = {
      tab: true,
      chart: true,
      active: this.tab == TradeTab.TradeChart,
    };
    return html` <uigc-paper class=${classMap(classes)}>
      <gc-lbp-chart
        .squidUrl=${this.squidUrl}
        .tradeType=${this.trade.type}
        .tradeProgress=${this.trade.inProgress}
        .poolId=${this.lbpSwap?.poolId}
        .assetIn=${assetIn}
        .assetOut=${assetOut}
        .spotPrice=${this.lbpSwap?.spotPrice}
        .usdPrice=${this.assets.usdPrice}
        .details=${this.assets.details}
        .meta=${this.assets.meta}
      >
        <div class="header section" slot="header">
          <uigc-icon-button
            class="back"
            @click=${() => this.changeTab(TradeTab.TradeForm)}
          >
            <uigc-icon-back></uigc-icon-back>
          </uigc-icon-button>
          <uigc-typography variant="section"
            >${i18n.t('chart.title')}</uigc-typography
          >
          <span></span>
        </div>
      </gc-lbp-chart>
    </uigc-paper>`;
  }

  render() {
    return html`
      <div class="layout-root">
        ${this.tradeChartTab()} ${this.tradeFormTab()}
        ${this.tradeSettingsTab()} ${this.selectAssetTab()}
      </div>
    `;
  }
}
