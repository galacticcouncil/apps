import { html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { Asset, PoolToken, PoolBase, PoolType } from '@galacticcouncil/sdk';

import { i18n } from 'localization';
import { translation } from './locales';

import { TradeApp } from 'app/trade';
import { TradeTab } from 'app/trade/types';

import { convertToHex } from 'utils/account';
import { updateQueryParams } from 'utils/url';

import { BondsApi } from './api';
import { BondsChartApi } from './chart';

import './Settings';

@customElement('gc-bonds')
export class BondsApp extends TradeApp {
  protected bondsApi: BondsApi = null;
  protected chartApi: BondsChartApi = null;
  protected ready: boolean = false;

  @state() lbpSwap = null;
  @state() lbp = {
    id: null as string,
    accumulated: null as Asset,
    distributed: null as Asset,
    pools: [] as PoolBase[],
    assets: [] as PoolToken[],
  };

  constructor() {
    super();
    i18n.init({
      debug: false,
      lng: 'en',
      postProcess: ['highlight'],
      resources: {
        en: {
          translation: translation.en,
        },
      },
    });
  }

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
        this.chartApi
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

    this.bondsApi = new BondsApi(api, router);
    this.chartApi = new BondsChartApi(api, this.squidUrl);

    const [pools, pair] = await Promise.all([
      await this.bondsApi.getPools(),
      await this.chartApi.getPoolPair(this.assetIn, this.assetOut),
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

  protected isActiveCampaign() {
    const { id, pools } = this.lbp;
    return pools.map((a) => convertToHex(a.address)).includes(id);
  }

  protected isFormLoaded() {
    return super.isFormLoaded() && this.ready;
  }

  protected isFormReadOnly() {
    if (this.isActiveCampaign()) {
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
    return html`
      <uigc-paper class=${classMap(classes)}>
        <gc-select-asset
          .assetIn=${this.trade.assetIn}
          .assetOut=${this.trade.assetOut}
          .assets=${this.assets.tradeable}
          .assetsAlt=${this.lbp.assets}
          .balances=${this.assets.balance}
          .pairs=${this.assets.pairs}
          .usdPrice=${this.assets.usdPrice}
          .switchAllowed=${this.isSwitchEnabled()}
          .selector=${this.asset.selector}
          @asset-click=${this.onAssetClick}>
          <div class="header section" slot="header">
            <uigc-icon-button
              class="back"
              @click=${() => this.changeTab(TradeTab.TradeForm)}>
              <uigc-icon-back></uigc-icon-back>
            </uigc-icon-button>
            <uigc-typography variant="section">
              ${i18n.t('trade.selectAsset')}
            </uigc-typography>
            <span></span>
          </div>
        </gc-select-asset>
      </uigc-paper>
    `;
  }

  tradeChartTab() {
    const classes = {
      tab: true,
      chart: true,
      active: this.tab == TradeTab.TradeChart,
    };
    return html`
      <uigc-paper class=${classMap(classes)}>
        <gc-bonds-chart
          .assetIn=${this.lbp.accumulated}
          .assetOut=${this.lbp.distributed}
          .poolId=${this.lbp.id}
          .squidUrl=${this.squidUrl}
          .spotPrice=${this.trade.spotPrice}
          .tradeProgress=${this.trade.inProgress}
          .usdPrice=${this.assets.usdPrice}>
          <div class="header section" slot="header">
            <uigc-icon-button
              class="back"
              @click=${() => this.changeTab(TradeTab.TradeForm)}>
              <uigc-icon-back></uigc-icon-back>
            </uigc-icon-button>
            <uigc-typography variant="section">
              ${i18n.t('header.chart')}
            </uigc-typography>
            <span></span>
          </div>
        </gc-bonds-chart>
      </uigc-paper>
    `;
  }

  tradeSettingsTab() {
    const classes = {
      tab: true,
      main: true,
      active: this.tab == TradeTab.TradeSettings,
    };
    return html`
      <uigc-paper class=${classMap(classes)}>
        <gc-bonds-settings @slippage-change=${() => this.recalculateTrade()}>
          <div class="header section" slot="header">
            <uigc-icon-button
              class="back"
              @click=${() => this.changeTab(TradeTab.TradeForm)}>
              <uigc-icon-back></uigc-icon-back>
            </uigc-icon-button>
            <uigc-typography variant="section">
              ${i18n.t('header.settings')}
            </uigc-typography>
            <span></span>
          </div>
        </gc-bonds-settings>
      </uigc-paper>
    `;
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
