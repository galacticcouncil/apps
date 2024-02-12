import { html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import {
  createChart,
  IChartApi,
  ISeriesApi,
  SingleValueData,
  UTCTimestamp,
} from 'lightweight-charts';

import { TimeApi } from 'api/time';
import { Chain, ChainCursor, TradeData, TradeDataCursor } from 'db';
import { DatabaseController } from 'db.ctrl';
import { BaseElement } from 'element/BaseElement';
import { baseStyles } from 'styles/base.css';
import { humanizeAmount, multipleAmounts } from 'utils/amount';

import { Bucket } from 'app/trade/chart';
import { chartStyles } from 'app/trade/chart/chart.css';
import { DEFAULT_DATASET } from 'app/trade/chart/data';
import {
  crosshair,
  grid,
  layoutOptions,
  leftPriceScale,
  rightPriceScale,
  timeScale,
} from 'app/trade/chart/opts';
import { subscribeCrosshair } from 'app/trade/chart/plugins';
import { calculateWidth } from 'app/trade/chart/utils';
import { ChartState } from 'app/trade/chart/types';
import 'app/trade/chart/components/states';

import { Amount, Asset, PoolType } from '@galacticcouncil/sdk';

import { ChartApi } from './api';

const CHART_HEIGHT = 325;
const CHART_TIME_SCALE_HEIGHT = 26;
const CHART_PADDING_RATIO = 0.8;

@customElement('gc-bonds-chart')
export class BondsChart extends BaseElement {
  protected chain = new DatabaseController<Chain>(this, ChainCursor);

  protected chartApi: ChartApi = null;
  protected timeApi: TimeApi = null;
  protected chart: IChartApi = null;

  private chartContainer: HTMLElement = null;
  private chartPriceSeries: ISeriesApi<'Baseline'> = null;
  private chartPredictionSeries: ISeriesApi<'Baseline'> = null;
  private ro = new ResizeObserver((entries) => {
    entries.forEach((entry) => {
      const iWidth = window.innerWidth;

      if (entry.contentRect.width <= 0) {
        return;
      }

      if (iWidth > 1023) {
        this.chart.resize(entry.contentRect.width, CHART_HEIGHT);
      } else if (iWidth < 768) {
        const chartWidth = calculateWidth(entry);
        this.chart.resize(chartWidth - 2 * 14, entry.contentRect.height - 180);
      } else {
        const chartWidth = calculateWidth(entry);
        this.chart.resize(chartWidth - 2 * 28, entry.contentRect.height - 180);
      }
      this.loadData();
    });
  });
  private ready: boolean = false;
  private disconnectSubscribeNewHeads: () => void = null;

  @property({ type: Object }) assetIn: Asset = null;
  @property({ type: Object }) assetOut: Asset = null;
  @property({ type: String }) poolId: string = null;
  @property({ type: String }) spotPrice = null;
  @property({ type: String }) squidUrl = null;
  @property({ type: Boolean }) tradeProgress: Boolean = false;
  @property({ attribute: false }) usdPrice: Map<string, Amount> = new Map([]);

  @state() chartState: ChartState = ChartState.Loading;

  static styles = [
    baseStyles,
    chartStyles,
    css`
      :host {
        display: flex;
        flex-direction: column;
        height: 100%;
        position: relative;
      }
    `,
  ];

  private calculateDollarPrice(price: string) {
    if (this.usdPrice.size == 0) {
      return null;
    }

    const usdPrice = this.usdPrice.get(this.assetIn.id);
    if (usdPrice == null) {
      return price;
    }
    return multipleAmounts(price, usdPrice).toString();
  }

  private hasPoolPair(): boolean {
    return this.assetIn != null && this.assetOut != null;
  }

  private getDataKey() {
    return [PoolType.LBP, this.assetIn.id, this.assetOut.id].join(':');
  }

  private getRecord(): TradeData {
    const cache = TradeDataCursor.deref();
    return cache.get(this.getDataKey());
  }

  private hasRecord(): boolean {
    const cache = TradeDataCursor.deref();
    return cache.has(this.getDataKey());
  }

  private storeRecord(data: TradeData) {
    const cache = TradeDataCursor.deref();
    cache.set(this.getDataKey(), data);
  }

  private async loadData() {
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
      ({ dataset, lastBlock }) => {
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
          secondary: secondaryDataset,
        };
        this.storeRecord(datasets);
        this.syncChart(datasets);
      },
      (_err) => {
        this.chartState = ChartState.Error;
      },
    );
  }

  private syncChart(data: TradeData) {
    const lastPrice = this.getLastPrice();
    const priceBucket = new Bucket(data.primary);
    const predictionBucket = new Bucket(data.secondary);

    /* 
    let predictionBucket: Bucket;
    if (data.secondary.length > 0) {
      priceBucket.push(lastPrice);
      const predictionData = data.secondary.filter(
        (dp) => dp.time >= lastPrice.time,
      );
      predictionBucket = new Bucket(predictionData);
      predictionBucket.unshift(lastPrice);
    } else {
      predictionBucket = new Bucket(data.secondary);
    } 
    */

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

  private syncPriceLine(id: string, yCoord: number) {
    const lineEl = this.shadowRoot.getElementById(id);
    lineEl.setAttribute('style', 'top: ' + yCoord + 'px;');
  }

  private syncPriceTag(id: string, yCoord: number, value: number) {
    const tagEl = this.shadowRoot.getElementById(id);
    tagEl.setAttribute('style', 'top: ' + (yCoord - 9) + 'px;');
    tagEl.innerHTML = humanizeAmount(value.toString());
  }

  private syncPriceScale(max: number, min: number, avg: number) {
    const backdropEl = this.shadowRoot.getElementById('backdrop');
    const canvasHeight = backdropEl.offsetHeight - CHART_TIME_SCALE_HEIGHT;

    const maxYCoord = canvasHeight - canvasHeight * CHART_PADDING_RATIO - 1;
    const minYCoord = canvasHeight * CHART_PADDING_RATIO - 1;
    const midYCoord = (maxYCoord - minYCoord) / 2 + minYCoord;

    this.syncPriceLine('maxLine', maxYCoord);
    this.syncPriceLine('minLine', minYCoord);
    this.syncPriceLine('midLine', midYCoord);

    this.syncPriceTag('maxTag', maxYCoord, max);
    this.syncPriceTag('minTag', minYCoord, min);
    this.syncPriceTag('midTag', midYCoord, avg);
  }

  private isActivePool() {
    const { secondary } = this.getRecord();
    return secondary.length > 0;
  }

  private getLastPrice(): SingleValueData {
    return {
      time: this._dayjs().unix() as UTCTimestamp,
      value: Number(this.getSpotPrice()),
    } as SingleValueData;
  }

  private getSpotPrice() {
    if (this.isActivePool()) {
      return this.spotPrice;
    }
    const { primary } = this.getRecord();
    return primary[primary.length - 1].value;
  }

  override async firstUpdated() {
    this.chartContainer = this.shadowRoot.getElementById('chart');
    this.chart = createChart(this.chartContainer, {
      layout: layoutOptions,
      rightPriceScale: rightPriceScale,
      leftPriceScale: leftPriceScale,
      timeScale: timeScale(this._dayjs),
      grid: grid,
      crosshair: crosshair,
      handleScale: false,
      handleScroll: false,
    });

    this.chartPriceSeries = this.chart.addBaselineSeries({
      lineWidth: 2,
      topLineColor: '#85D1FF',
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
    this.chart.timeScale().fitContent();

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

    const selected = this.shadowRoot.getElementById('selected');
    const actual = this.shadowRoot.getElementById('actual');
    const floating = this.shadowRoot.getElementById('floating');

    subscribeCrosshair(
      this.chart,
      this.chartContainer,
      [this.chartPriceSeries, this.chartPredictionSeries],
      selected,
      actual,
      floating,
      (price) => this.calculateDollarPrice(price),
    );
  }

  private async init() {
    const { api } = this.chain.state;
    this.chartApi = new ChartApi(api, this.squidUrl);
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
    this.ro.observe(this);
  }

  override disconnectedCallback() {
    this.ro.unobserve(this);
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

  priceScaleTemplate(priceTagId: string, priceLineId: string) {
    const priceLineClasses = {
      'price-line': true,
    };
    const priceTagClasses = {
      'price-tag': true,
      show: this.chartState == ChartState.Loaded,
    };
    return html`
      <span id="${priceTagId}" class=${classMap(priceTagClasses)}></span>
      <span id="${priceLineId}" class=${classMap(priceLineClasses)}></span>
    `;
  }

  backdropTemplate() {
    const chartErrorClasses = {
      show: this.chartState == ChartState.Error,
    };
    const chartEmptyClasses = {
      show: this.chartState == ChartState.Empty,
    };
    const chartLoadingClasses = {
      show: this.chartState == ChartState.Loading && this.hasPoolPair(),
    };
    return html`
      <div id="backdrop" class="backdrop">
        ${this.priceScaleTemplate('maxTag', 'maxLine')}
        ${this.priceScaleTemplate('midTag', 'midLine')}
        ${this.priceScaleTemplate('minTag', 'minLine')}
        <gc-chart-empty class=${classMap(chartEmptyClasses)}></gc-chart-empty>
        <gc-chart-error class=${classMap(chartErrorClasses)}></gc-chart-error>
        <uigc-busy-indicator
          class=${classMap(chartLoadingClasses)}></uigc-busy-indicator>
      </div>
    `;
  }

  render() {
    const chartClasses = {
      chart: true,
      loading:
        this.chartState != ChartState.Loaded ||
        TradeDataCursor.deref().length == 0,
    };
    return html`
      <slot name="header"></slot>
      <div class="summary">
        <div>${this.pairTemplate()}</div>
        <div></div>
        <div id="selected" class="tooltip skeleton"></div>
        <div id="actual" class="tooltip skeleton">${this.priceTemplate()}</div>
      </div>
      <div class=${classMap(chartClasses)}>
        <div id="chart">
          <div id="floating" class="tooltip-floating"></div>
          ${this.backdropTemplate()}
        </div>
      </div>
    `;
  }
}
