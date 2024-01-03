import { html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { Asset, PoolToken, PoolBase, PoolType } from '@galacticcouncil/sdk';

import * as i18n from 'i18next';

import './chart';
import { LbpChartApi } from './chart/api';

import '../trade/form';
import '../trade/settings';
import '../selector/asset';

import { TradeApp } from '../trade';
import { TradeTab } from '../trade/types';
import { LbpApi } from '../../api/lbp';
import { convertToHex } from '../../utils/account';
import { updateQueryParams } from '../../utils/url';

@customElement('gc-lbp-app')
export class LbpApp extends TradeApp {
  protected lbpApi: LbpApi = null;
  protected lbpChartApi: LbpChartApi = null;
  protected ready: boolean = false;

  @state() lbpSwap = null;
  @state() lbp = {
    id: null as string,
    accumulated: null as Asset,
    distributed: null as Asset,
    pools: [] as PoolBase[],
    assets: [] as PoolToken[],
  };

  protected async calculateSell(
    assetIn: Asset,
    assetOut: Asset,
    amountIn: string,
  ) {
    await super.calculateSell(assetIn, assetOut, amountIn);
    this.lbpSwap = this.trade.swaps.find(
      (swap: any) => swap.pool === PoolType.LBP,
    );
  }

  protected async calculateBuy(
    assetIn: Asset,
    assetOut: Asset,
    amountOut: string,
  ) {
    await super.calculateBuy(assetIn, assetOut, amountOut);
    this.lbpSwap = this.trade.swaps.find(
      (swap: any) => swap.pool === PoolType.LBP,
    );
  }

  protected async recalculateSpotPrice() {
    if (this.isTradeable()) {
      super.recalculateSpotPrice();
    }
  }

  protected updateQuery() {
    const { assetIn, assetOut } = this.trade;
    this.lbp.pools.forEach((pool) => {
      const [accumulated, distributed] = pool.tokens;
      if (assetIn.id === distributed.id || assetOut.id === distributed.id) {
        this.lbpChartApi
          .getPoolPair(accumulated.id, distributed.id)
          .then((pair) => {
            updateQueryParams({
              assetIn: accumulated.id,
              assetOut: distributed.id,
            });

            this.lbp = {
              ...this.lbp,
              id: pair.id,
              accumulated: accumulated,
              distributed: distributed,
            };

            const options = {
              bubbles: true,
              composed: true,
              detail: { assetIn: accumulated.id, assetOut: distributed.id },
            };
            this.dispatchEvent(new CustomEvent('gc:query:update', options));
          });
      }
    });
  }

  protected override async onInit(): Promise<void> {
    super.onInit();

    const { api, router } = this.chain.state;

    this.lbpApi = new LbpApi(api, router);
    this.lbpChartApi = new LbpChartApi(api, this.squidUrl);

    const [pools, pair] = await Promise.all([
      await this.lbpApi.getPools(),
      await this.lbpChartApi.getPoolPair(this.assetIn, this.assetOut),
    ]);

    const accumulatedId = pair.assetAId.toString();
    const distributedId = pair.assetBId.toString();
    const accumulatedAsset = this.assets.registry.get(accumulatedId);
    const distributedAsset = this.assets.registry.get(distributedId);

    if (this.lbp.pools.length === 0) {
      this.trade.assetOut = distributedAsset;
    }

    this.lbp = {
      ...this.lbp,
      id: pair.id,
      accumulated: accumulatedAsset,
      distributed: distributedAsset,
      pools: pools,
      assets: pools.map((pool) => pool.tokens[1]),
    };
    this.ready = true;
    this.syncBalances();
  }

  protected isTradeable() {
    const { assetOut } = this.trade;
    return this.assets.tradeable.map((a) => a.id).includes(assetOut?.id);
  }

  protected isActive() {
    const { id, pools } = this.lbp;
    return pools.map((a) => convertToHex(a.address)).includes(id);
  }

  protected isFormLoaded() {
    return super.isFormLoaded() && this.ready;
  }

  protected isFormReadOnly() {
    if (this.isActive()) {
      return false;
    }
    return true;
  }

  selectAssetTab() {
    const classes = {
      tab: true,
      main: true,
      active: this.tab == TradeTab.SelectAsset,
    };
    return html` <uigc-paper class=${classMap(classes)}>
      <gc-select-asset
        .assets=${this.assets.tradeable}
        .assetsAlt=${this.lbp.assets}
        .pairs=${this.assets.pairs}
        .balances=${this.assets.balance}
        .usdPrice=${this.assets.usdPrice}
        .assetIn=${this.trade.assetIn}
        .assetOut=${this.trade.assetOut}
        .switchAllowed=${this.isSwitchEnabled()}
        .selector=${this.asset.selector}
        @asset-clicked=${this.assetClickedListener}
      >
        <div class="header section" slot="header">
          <uigc-icon-button
            class="back"
            @click=${() => this.changeTab(TradeTab.TradeForm)}
          >
            <uigc-icon-back></uigc-icon-back>
          </uigc-icon-button>
          <uigc-typography variant="section"
            >${i18n.t('trade.selectAsset')}</uigc-typography
          >
          <span></span>
        </div>
      </gc-select-asset>
    </uigc-paper>`;
  }

  tradeChartTab() {
    const classes = {
      tab: true,
      chart: true,
      active: this.tab == TradeTab.TradeChart,
    };
    return html` <uigc-paper class=${classMap(classes)}>
      <gc-lbp-chart
        .squidUrl=${this.squidUrl}
        .tradeProgress=${this.trade.inProgress}
        .poolId=${this.lbp.id}
        .assetIn=${this.lbp.accumulated}
        .assetOut=${this.lbp.distributed}
        .usdPrice=${this.assets.usdPrice}
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
