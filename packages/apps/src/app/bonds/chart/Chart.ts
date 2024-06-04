import { html, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import { ISeriesApi, SingleValueData } from 'lightweight-charts';

import { TimeApi } from 'api/time';
import { Chain, ChainCursor, DatabaseController, TradeData } from 'db';
import { exchange, humanizeAmount } from 'utils/amount';

import { Amount, PoolType } from '@galacticcouncil/sdk';

import { Chart, Bucket } from 'element/chart';
import { DEFAULT_DATASET } from 'element/chart/data';
import { ChartState } from 'element/chart/types';

import { BondsChartApi } from './api';

@customElement('gc-bonds-chart')
export class BondsChart extends Chart {
  protected chain = new DatabaseController<Chain>(this, ChainCursor);

  protected chartApi: BondsChartApi = null;
  protected timeApi: TimeApi = null;

  private chartPriceSeries: ISeriesApi<'Baseline'> = null;
  private chartPredictionSeries: ISeriesApi<'Baseline'> = null;

  private ready: boolean = false;
  private disconnectSubscribeNewHeads: () => void = null;

  @property({ type: String }) poolId: string = null;
  @property({ type: String }) spotPrice = null;
  @property({ type: String }) squidUrl = null;
  @property({ type: Boolean }) tradeProgress: Boolean = false;
  @property({ attribute: false }) usdPrice: Map<string, Amount> = new Map([]);

  private calculateDollarPrice(price: string) {
    return exchange(this.usdPrice, this.assetIn, price);
  }

  protected async loadData() {
    if (!this.hasPoolPair()) {
      return;
    }

    // TODO: Rework caching
    if (!this.hasRecord()) {
      this.chartState = ChartState.Loading;
    }

    const pool = await this.chartApi.getPoolData(this.poolId);
    const [fromBlock, toBlock] = await Promise.all([
      this.chartApi.getFirstBlock(this.poolId, pool.startBlockNumber),
      this.chartApi.getLastBlock(this.poolId, pool.endBlockNumber),
    ]);

    const relayBlockTime = await this.timeApi.getBlockTimestamp();
    const relayBlockHeight = await this.timeApi.getRelayBlockHeight();

    const toDatapoints = (dataset: [number, number][]) => {
      return dataset.map(([relayHeight, price]) => {
        const time = this.timeApi.blockToTime(relayHeight, {
          height: relayBlockHeight,
          date: relayBlockTime,
        });
        return { time: time, value: price } as SingleValueData;
      });
    };

    this.chartApi.getPoolPrices(
      pool,
      this.assetIn,
      this.assetOut,
      fromBlock,
      toBlock,
      (assetIn, assetOut, { dataset, lastBlock }) => {
        let prediction = [];
        if (pool.endBlockNumber > relayBlockHeight) {
          prediction = this.chartApi.getPoolPredictionPrices(
            pool,
            this.assetIn,
            this.assetOut,
            lastBlock,
          );
        }

        const primaryDataset = toDatapoints(dataset);
        const secondaryDataset = toDatapoints(prediction);
        const datasets = {
          primary: primaryDataset,
          primaryOhlc: [],
          secondary: secondaryDataset,
        };

        this.storeRecord(assetIn, assetOut, datasets);
        if (this.shouldSync(assetIn, assetOut)) {
          this.syncChart(datasets);
        }
      },
      (_err) => {
        this.chartState = ChartState.Error;
      },
    );
  }

  protected syncChart(data: TradeData) {
    const priceBucket = new Bucket(data.primary);
    const predictionBucket = new Bucket(data.secondary);
    this.chartPriceSeries.setData(priceBucket.data);
    this.chartPredictionSeries.setData(predictionBucket.data);
    this.chart.timeScale().setVisibleLogicalRange({
      from: 0.5,
      to: priceBucket.length + predictionBucket.length - 1.5,
    });

    const max = priceBucket.max();
    const min =
      predictionBucket.length > 0 ? predictionBucket.min() : priceBucket.min();
    const mid = (max - min) / 2 + min;
    this.chartPriceSeries.applyOptions({
      baseValue: { type: 'price', price: min },
    });
    this.syncPriceScale(max, min, mid);
    this.chartState = ChartState.Loaded;
  }

  onPriceSelection(price: string): string {
    return this.calculateDollarPrice(price);
  }

  initSeries(): void {
    this.chartPriceSeries = this.chart.addBaselineSeries({
      lineWidth: 2,
      topLineColor: '#aaeefc',
      topFillColor1: 'transparent',
      topFillColor2: 'transparent',
      bottomLineColor: 'transparent',
      lastValueVisible: false,
      priceLineVisible: false,
      crosshairMarkerRadius: 4,
      crosshairMarkerBorderColor: '#000',
      crosshairMarkerBackgroundColor: '#fff',
    });

    const min = new Bucket(DEFAULT_DATASET).min();
    this.chartPriceSeries.setData(DEFAULT_DATASET);
    this.chartPriceSeries.applyOptions({
      baseValue: { type: 'price', price: min },
    });

    this.chartPredictionSeries = this.chart.addBaselineSeries({
      lineWidth: 2,
      lineStyle: 2,
      topLineColor: '#7990AC',
      topFillColor1: 'transparent',
      topFillColor2: 'transparent',
      bottomLineColor: 'transparent',
      lastValueVisible: false,
      priceLineVisible: false,
      crosshairMarkerRadius: 4,
      crosshairMarkerBorderColor: '#000',
      crosshairMarkerBackgroundColor: '#fff',
    });
  }

  getSeries(): ISeriesApi<any>[] {
    return [this.chartPriceSeries, this.chartPredictionSeries];
  }

  getDatasetPrefix(): string {
    return PoolType.LBP;
  }

  private async init() {
    const { api } = this.chain.state;
    this.chartApi = new BondsChartApi(api, this.squidUrl);
    this.timeApi = new TimeApi(api);
  }

  private async subscribe() {
    const { api } = this.chain.state;
    this.disconnectSubscribeNewHeads = await api.rpc.chain.subscribeNewHeads(
      async (lastHeader) => {
        this.loadData();
      },
    );
  }

  override async updated() {
    if (this.chain.state && !this.ready) {
      this.ready = true;
      this.init();
      this.subscribe();
    }
  }

  override update(changedProperties: Map<string, unknown>) {
    if (this.chart && changedProperties.has('usdPrice')) {
      this.loadData();
    }
    if (
      this.chart &&
      changedProperties.has('assetIn') &&
      changedProperties.has('assetOut')
    ) {
      this.loadData();
    }
    super.update(changedProperties);
  }

  override connectedCallback() {
    super.connectedCallback();
  }

  override disconnectedCallback() {
    this.disconnectSubscribeNewHeads?.();
    super.disconnectedCallback();
  }

  pairTemplate() {
    if (this.assetIn || this.assetOut) {
      const inputAsset = this.assetIn?.symbol;
      const outputAsset = this.assetOut?.symbol;
      return html`
        <div class="pair">${outputAsset ?? '-'} / ${inputAsset ?? '-'}</div>
      `;
    } else {
      return html`
        <uigc-skeleton
          class="skeleton"
          progress
          rectangle
          width="150px"
          height="24px"></uigc-skeleton>
      `;
    }
  }

  private isActivePool() {
    const { secondary } = this.getRecord();
    return secondary.length > 0;
  }

  private getSpotPrice() {
    if (this.isActivePool()) {
      return this.spotPrice;
    }
    const { primary } = this.getRecord();
    return primary[primary.length - 1].value;
  }

  priceTemplate() {
    if (!this.hasPoolPair()) {
      return;
    }

    if (this.tradeProgress || !this.getRecord()) {
      return html`
        <uigc-skeleton
          progress
          rectangle
          width="150px"
          height="18px"></uigc-skeleton>
      `;
    } else {
      const spotPrice = this.getSpotPrice();
      const spotPriceUsd = this.calculateDollarPrice(spotPrice.toString());
      const usdClasses = {
        usd: true,
        hidden: this.usdPrice.size == 0,
      };
      return html`
        <div class="price">
          ${humanizeAmount(spotPrice.toString())}
          <span class="asset">${this.assetIn.symbol}</span>
        </div>
        <div class=${classMap(usdClasses)}>
          ≈$${humanizeAmount(spotPriceUsd)}
        </div>
      `;
    }
  }

  rangeTemplate(): TemplateResult {
    return html`
      <span></span>
    `;
  }
}
