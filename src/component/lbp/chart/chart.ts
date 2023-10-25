import { html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import {
  createChart,
  IChartApi,
  ISeriesApi,
  SingleValueData,
} from 'lightweight-charts';

import { baseStyles } from '../../styles/base.css';
import { TimeApi } from '../../../api/time';
import { Chain, TradeData, chainCursor, tradeDataCursor } from '../../../db';
import { DatabaseController } from '../../../db.ctrl';
import { humanizeAmount, multipleAmounts } from '../../../utils/amount';

import { LbpChartApi } from './api';
import { Bucket } from '../../chart/bucket';
import { DEFAULT_DATASET } from '../../chart/data';
import {
  crosshair,
  grid,
  layoutOptions,
  leftPriceScale,
  rightPriceScale,
  timeScale,
} from '../../chart/opts';
import { subscribeCrosshair } from '../../chart/plugins';
import { calculateWidth } from '../../chart/utils';
import { ChartState } from '../../chart/types';
import { chartStyles } from '../../chart/chart.css';

import '../../chart/states/error';
import '../../chart/states/empty';
import '../../chart/states/loading';

import { Amount, AssetMetadata, PoolType } from '@galacticcouncil/sdk';

import { BaseElement } from '../../base/BaseElement';

const CHART_HEIGHT = 325;
const CHART_TIME_SCALE_HEIGHT = 26;
const CHART_PADDING_RATIO = 0.8;

@customElement('gc-lbp-chart')
export class LbpChart extends BaseElement {
  protected chain = new DatabaseController<Chain>(this, chainCursor);

  protected chartApi: LbpChartApi = null;
  protected timeApi: TimeApi = null;

  protected chart: IChartApi = null;
  private chartContainer: HTMLElement = null;
  private chartPriceSeries: ISeriesApi<'Baseline'> = null;
  private chartPredictionSeries: ISeriesApi<'Baseline'> = null;
  private ready: boolean = false;
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
  private disconnectSubscribeNewHeads: () => void = null;

  @state() chartState: ChartState = ChartState.Loading;
  @state() chartData: TradeData = null;

  @property({ type: String }) squidUrl = null;
  @property({ type: Boolean }) tradeProgress: Boolean = false;
  @property({ type: String }) poolId: string = null;
  @property({ type: String }) assetIn: string = null;
  @property({ type: String }) assetOut: string = null;
  @property({ type: Object }) assetInMeta: AssetMetadata = null;
  @property({ type: Object }) assetOutMeta: AssetMetadata = null;
  @property({ attribute: false }) usdPrice: Map<string, Amount> = new Map([]);

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

    const usdPrice = this.usdPrice.get(this.assetIn);
    if (usdPrice == null) {
      return price;
    }
    return multipleAmounts(price, usdPrice).toString();
  }

  private hasPoolPair(): boolean {
    return this.assetIn != null && this.assetOut != null;
  }

  private getDataKey() {
    return [PoolType.LBP, this.assetIn, this.assetOut].join(':');
  }

  private getRecord() {
    const cache = tradeDataCursor.deref();
    return cache.get(this.getDataKey());
  }

  private hasRecord() {
    const cache = tradeDataCursor.deref();
    return cache.has(this.getDataKey());
  }

  private storeRecord(data: TradeData) {
    const cache = tradeDataCursor.deref();
    cache.set(this.getDataKey(), data);
  }

  private async loadData() {
    console.log('load');
    if (!this.hasPoolPair()) {
      return;
    }

    if (this.hasRecord()) {
      const cachedData = this.getRecord();
      this.syncChart(cachedData);
      return;
    }

    this.chartState = ChartState.Loading;
    const pool = await this.chartApi.getPoolData(this.poolId);
    console.log(pool);
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
      this.assetInMeta,
      this.assetOutMeta,
      fromBlock,
      toBlock,
      ({ dataset, lastBlock }) => {
        console.log(dataset);
        let prediction = [];
        if (pool.endBlockNumber > relayBlockHeight) {
          prediction = this.chartApi.getPoolPredictionPrices(
            pool,
            this.assetInMeta,
            this.assetOutMeta,
            lastBlock,
          );
        }
        console.log('Prediction:');
        console.log(prediction);

        const primaryDataset = toDatapoints(dataset);
        const secondaryDataset = toDatapoints(prediction);
        const datasets = {
          primary: primaryDataset,
          secondary: secondaryDataset,
        };
        this.storeRecord(datasets);
        this.syncChart(datasets);
        this.chartData = datasets;
      },
      (_err) => {
        this.chartState = ChartState.Error;
      },
    );
  }

  private syncChart(data: TradeData) {
    const priceBucket = new Bucket(data.primary);
    const predictionBucket = new Bucket(data.secondary);

    this.chartPriceSeries.setData(priceBucket.data);
    this.chartPredictionSeries.setData(predictionBucket.data);
    this.chart.timeScale().setVisibleLogicalRange({
      from: 0.5,
      to: priceBucket.length + predictionBucket.length - 1.5,
    });

    const max = priceBucket.max();
    const min = priceBucket.min();
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

  async init() {
    const { api } = this.chain.state;
    this.chartApi = new LbpChartApi(api, this.squidUrl);
    this.timeApi = new TimeApi(api);
  }

  async subscribe() {
    const api = chainCursor.deref().api;
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
    if (this.chart && changedProperties.has('spotPrice')) {
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
      const inputAsset = this.assetInMeta?.symbol;
      const outputAsset = this.assetOutMeta?.symbol;
      return html`<div class="pair">
        ${outputAsset ?? '-'} / ${inputAsset ?? '-'}
      </div>`;
    } else {
      return html`<uigc-skeleton
        class="skeleton"
        progress
        rectangle
        width="150px"
        height="24px"
      ></uigc-skeleton>`;
    }
  }

  priceTemplate() {
    if (!this.hasPoolPair()) {
      return;
    }

    const primaryDataset = this.chartData?.primary;
    if (this.tradeProgress || !primaryDataset) {
      return html`<uigc-skeleton
        progress
        rectangle
        width="150px"
        height="18px"
      ></uigc-skeleton>`;
    } else {
      const spotPrice = primaryDataset[primaryDataset.length - 1].value;
      const spotPriceUsd = this.calculateDollarPrice(spotPrice.toString());
      const usdClasses = {
        usd: true,
        hidden: this.usdPrice.size == 0,
      };
      return html`<div class="price">
          ${humanizeAmount(spotPrice.toString())}
          <span class="asset"> ${this.assetInMeta?.symbol}</span>
        </div>
        <div class=${classMap(usdClasses)}>
          ≈$${humanizeAmount(spotPriceUsd)}
        </div>`;
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
      <span id="${priceTagId}" class=${classMap(priceTagClasses)}> </span>
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
    return html`<div id="backdrop" class="backdrop">
      ${this.priceScaleTemplate('maxTag', 'maxLine')}
      ${this.priceScaleTemplate('midTag', 'midLine')}
      ${this.priceScaleTemplate('minTag', 'minLine')}
      <gc-chart-empty class=${classMap(chartEmptyClasses)}></gc-chart-empty>
      <gc-chart-error class=${classMap(chartErrorClasses)}></gc-chart-error>
      <uigc-busy-indicator
        class=${classMap(chartLoadingClasses)}
      ></uigc-busy-indicator>
    </div>`;
  }

  render() {
    const chartClasses = {
      chart: true,
      loading:
        this.chartState != ChartState.Loaded ||
        tradeDataCursor.deref().length == 0,
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
