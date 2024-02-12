import { html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import {
  createChart,
  IChartApi,
  ISeriesApi,
  UTCTimestamp,
  SingleValueData,
} from 'lightweight-charts';

import { BaseElement } from 'element/BaseElement';
import { Chain, ChainCursor, TradeData, TradeDataCursor } from 'db';
import { DatabaseController } from 'db.ctrl';
import { baseStyles } from 'styles/base.css';
import { humanizeAmount, multipleAmounts } from 'utils/amount';

import { ChartApi } from './api';
import { Bucket } from './bucket';
import { DEFAULT_DATASET } from './data';
import { chartStyles } from './chart.css';
import {
  crosshair,
  grid,
  layoutOptions,
  leftPriceScale,
  rightPriceScale,
  timeScale,
} from './opts';
import { subscribeCrosshair } from './plugins';
import { INIT_DATE } from './query';
import { ChartState, Range } from './types';
import { calculateWidth } from './utils';

import './components/ButtonGroup';
import './components/Button';
import './components/states/Error';
import './components/states/Empty';
import './components/states/Loading';

import { Amount, Asset } from '@galacticcouncil/sdk';

const CHART_HEIGHT = 325;
const CHART_TIME_SCALE_HEIGHT = 26;
const CHART_PADDING_RATIO = 0.8;
const MIN_DATAPOINTS = 6;

@customElement('gc-trade-chart')
export class TradeChart extends BaseElement {
  private chain = new DatabaseController<Chain>(this, ChainCursor);

  private chartApi: ChartApi = null;
  private chart: IChartApi = null;

  private chartContainer: HTMLElement = null;
  private chartPriceSeries: ISeriesApi<'Baseline'> = null;
  private chartVolumeSeries: ISeriesApi<'Histogram'> = null;
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

  @state() range: Range = Range['1w'];
  @state() chartState: ChartState = ChartState.Loading;

  @property({ type: Boolean }) tradeProgress: Boolean = false;
  @property({ type: String }) grafanaUrl = null;
  @property({ type: Number }) grafanaDsn = null;
  @property({ type: Object }) assetIn: Asset = null;
  @property({ type: Object }) assetOut: Asset = null;
  @property({ type: String }) spotPrice = null;
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
    return [this.assetIn.id, this.assetOut.id].join(':');
  }

  private getRecord() {
    const cache = TradeDataCursor.deref();
    return cache.get(this.getDataKey());
  }

  private hasRecord() {
    const cache = TradeDataCursor.deref();
    return cache.has(this.getDataKey());
  }

  private storeRecord(data: TradeData) {
    const cache = TradeDataCursor.deref();
    cache.set(this.getDataKey(), data);
  }

  private loadData() {
    if (!this.hasPoolPair()) {
      return;
    }

    if (this.hasRecord()) {
      const cachedData = this.getRecord();
      this.syncChart(cachedData);
      return;
    }

    const endOfDay = this._dayjs().endOf('day').format('YYYY-MM-DDTHH:mm:ss'); // always use end of day so grafana cache query
    this.chartState = ChartState.Loading;
    this.chartApi.getTradeData(
      this.assetIn.symbol,
      this.assetOut.symbol,
      endOfDay,
      (data: TradeData) => {
        this.storeRecord(data);
        this.syncChart(data);
      },
      (_err) => {
        this.chartState = ChartState.Error;
      },
    );
  }

  private syncChart(data: TradeData) {
    const lastPrice = this.getLastPrice();
    const rangeFrom = this.getRangeFrom();
    const priceBucket = new Bucket(data.primary).withRange(rangeFrom);
    priceBucket.push(lastPrice);

    if (priceBucket.length <= MIN_DATAPOINTS) {
      this.chartState = ChartState.Empty;
      return;
    } else {
      this.chartPriceSeries.setData(priceBucket.data);
      this.chart
        .timeScale()
        .setVisibleLogicalRange({ from: 0.5, to: priceBucket.length - 1.5 });
    }

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

  private getRangeFrom(): UTCTimestamp {
    const range = this.range;
    switch (range) {
      case Range['1d']:
        return this._dayjs().subtract(1, 'day').unix() as UTCTimestamp;
      case Range['1w']:
        return this._dayjs().subtract(1, 'week').unix() as UTCTimestamp;
      case Range['1m']:
        return this._dayjs().subtract(1, 'month').unix() as UTCTimestamp;
      default:
        return this._dayjs(INIT_DATE).unix() as UTCTimestamp;
    }
  }

  private getLastPrice(): SingleValueData {
    return {
      time: this._dayjs().unix() as UTCTimestamp,
      value: Number(this.spotPrice),
    } as SingleValueData;
  }

  override async firstUpdated() {
    this.chartApi = new ChartApi(this.grafanaUrl, this.grafanaDsn);
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
      topFillColor1: 'rgba(79, 223, 255, 0.31)',
      topFillColor2: 'rgba(79, 234, 255, 0',
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

    this.chartVolumeSeries = this.chart.addHistogramSeries({
      color: '#85D1FF',
      lastValueVisible: false,
      priceLineVisible: false,
      priceFormat: {
        type: 'volume',
      },
      priceScaleId: '',
    });

    this.chartVolumeSeries.priceScale().applyOptions({
      scaleMargins: {
        top: 0.8,
        bottom: 0,
      },
    });

    const selected = this.shadowRoot.getElementById('selected');
    const actual = this.shadowRoot.getElementById('actual');
    const floating = this.shadowRoot.getElementById('floating');

    subscribeCrosshair(
      this.chart,
      this.chartContainer,
      [this.chartPriceSeries],
      selected,
      actual,
      floating,
      (price) => this.calculateDollarPrice(price),
    );
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

    const spotUsd = this.spotPrice
      ? this.calculateDollarPrice(this.spotPrice)
      : null;
    if (this.tradeProgress || !this.spotPrice) {
      return html`
        <uigc-skeleton
          progress
          rectangle
          width="150px"
          height="18px"></uigc-skeleton>
      `;
    } else {
      const usdClasses = {
        usd: true,
        hidden: this.usdPrice.size == 0,
      };
      return html`
        <div class="price">
          ${humanizeAmount(this.spotPrice)}
          <span class="asset">${this.assetIn.symbol}</span>
        </div>
        <div class=${classMap(usdClasses)}>≈$${humanizeAmount(spotUsd)}</div>
      `;
    }
  }

  rangeTemplate() {
    const rangeVal = Range[this.range];
    return html`
      <uigc-range-button-group
        selected=${rangeVal}
        @range-button-clicked=${(e: CustomEvent) => {
          this.range = Range[e.detail.value];
          this.requestUpdate();
          this.loadData();
        }}>
        ${Object.values(Range).map(
          (s: string) =>
            html`
              <uigc-range-button value=${s}>${s}</uigc-range-button>
            `,
        )}
      </uigc-range-button-group>
    `;
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
        <div>${this.rangeTemplate()}</div>
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
