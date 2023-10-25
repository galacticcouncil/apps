import { html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import {
  AssetMetadata,
  PoolAsset,
  PoolBase,
  PoolType,
} from '@galacticcouncil/sdk';

import * as i18n from 'i18next';

import './chart';
import { LbpChartApi } from './chart/api';

import '../trade/form';
import '../trade/settings';
import '../selector/asset';

import { TradeApp } from '../trade';
import { TradeTab } from '../trade/types';
import { LbpApi } from '../../api/lbp';

@customElement('gc-lbp-app')
export class LbpApp extends TradeApp {
  protected lbpApi: LbpApi = null;
  protected lbpChartApi: LbpChartApi = null;

  @state() lbpSwap = null;
  @state() lbp = {
    id: null as string,
    accumulated: null as string,
    accumulatedMeta: null as AssetMetadata,
    distributed: null as string,
    distributedMeta: null as AssetMetadata,
    pools: [] as PoolBase[],
  };

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

  protected override async getListAlt() {
    const { api } = this.chain.state;
    this.lbpApi = new LbpApi(api, this.router);
    const pools = await this.lbpApi.getPools();
    return pools.map((pool) => pool.tokens[1]);
  }

  protected override async onInit(): Promise<void> {
    super.onInit();

    const { api } = this.chain.state;
    this.lbpApi = new LbpApi(api, this.router);
    this.lbpChartApi = new LbpChartApi(api, this.squidUrl);

    const pools = await this.lbpApi.getPools();
    const pair = await this.lbpChartApi.getPoolPair(
      this.assetIn,
      this.assetOut,
    );

    const pairMetadata = await this.assetApi.getMetadataById([
      this.assetIn,
      this.assetOut,
    ]);

    const accumulatedId = pair.assetAId.toString();
    const distributedId = pair.assetBId.toString();
    const accumulatedMeta = pairMetadata.get(accumulatedId);
    const distributedMeta = pairMetadata.get(distributedId);

    this.lbp = {
      ...this.lbp,
      id: pair.id,
      accumulated: pair.assetAId.toString(),
      distributed: pair.assetBId.toString(),
      accumulatedMeta: accumulatedMeta,
      distributedMeta: distributedMeta,
      pools: pools,
    };
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
        .assetInMeta=${this.lbp.accumulatedMeta}
        .assetOut=${this.lbp.distributed}
        .assetOutMeta=${this.lbp.distributedMeta}
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
