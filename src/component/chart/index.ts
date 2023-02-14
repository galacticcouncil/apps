import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import { createChart, IChartApi, ISeriesApi, UTCTimestamp, SingleValueData } from 'lightweight-charts';

import { baseStyles } from '../base.css';
import { Chain, chainCursor, TradeData, tradeDataCursor } from '../../db';
import { DatabaseController } from '../../db.ctrl';
import { humanizeAmount, multipleAmounts } from '../../utils/amount';

import { Bucket } from './bucket';
import { DEFAULT_DATASET, INIT_DATE, query } from './data';
import { subscribeCrosshair } from './plugins';
import { calculateWidth } from './utils';
import { ChartState, Range } from './types';
import { crosshair, grid, layoutOptions, leftPriceScale, rightPriceScale, timeScale } from './opts';

import './range/ButtonGroup';
import './range/Button';
import './states/error';
import './states/empty';
import './states/loading';

import { Amount, PoolAsset, TradeType } from '@galacticcouncil/sdk';
import { AssetDetail } from '../../api/asset';

const CHART_HEIGHT = 345;
const CHART_TIME_SCALE_HEIGHT = 26;
const CHART_PADDING_RATIO = 0.8;
const MIN_DATAPOINTS = 5;

@customElement('gc-trade-chart')
export class TradeChart extends LitElement {
  private chain = new DatabaseController<Chain>(this, chainCursor);

  private chart: IChartApi = null;
  private chartContainer: HTMLElement = null;
  private chartPriceSeries: ISeriesApi<'Area'> = null;
  private chartVolumeSeries: ISeriesApi<'Histogram'> = null;
  private ready: boolean = false;
  private ro = new ResizeObserver((entries) => {
    entries.forEach((entry) => {
      const iWidth = window.innerWidth;
      if (iWidth > 1023) {
        this.chart.resize(entry.contentRect.width, CHART_HEIGHT);
      } else if (iWidth < 768) {
        const chartWidth = calculateWidth(entry);
        this.chart.resize(chartWidth - 2 * 14, entry.contentRect.height - 180);
      } else {
        const chartWidth = calculateWidth(entry);
        this.chart.resize(chartWidth - 2 * 28, entry.contentRect.height - 180);
      }
      this.fetchData();
    });
  });
  private disconnectSubscribeNewHeads: () => void = null;

  @state() range: Range = Range['1w'];
  @state() chartState: ChartState = ChartState.Loading;

  @property({ type: Number }) datasourceId = null;
  @property({ attribute: false }) tradeType: TradeType = TradeType.Buy;
  @property({ type: Boolean }) tradeProgress: Boolean = false;
  @property({ type: Object }) assetIn: PoolAsset = null;
  @property({ type: Object }) assetOut: PoolAsset = null;
  @property({ type: String }) spotPrice = null;
  @property({ attribute: false }) usdPrice: Map<string, Amount> = new Map([]);
  @property({ attribute: false }) details: Map<string, AssetDetail> = new Map([]);

  constructor() {
    super();
    dayjs.extend(utc);
  }

  static styles = [
    baseStyles,
    css`
      :host {
        display: flex;
        flex-direction: column;
        height: 100%;
        position: relative;
      }

      .summary {
        display: grid;
        row-gap: 10px;
        grid-template-areas:
          'pair range'
          'price price';
        color: #fff;
        padding: 0 14px;
        align-items: center;
      }

      .summary > div:nth-child(1) {
        grid-area: pair;
      }

      .summary > div:nth-child(2) {
        grid-area: range;
        text-align: right;
      }

      .summary > div:nth-child(3) {
        grid-area: price;
        text-align: left;
        height: 40px;
      }

      .summary > div:nth-child(4) {
        grid-area: price;
        text-align: left;
        height: 40px;
      }

      .chart {
        height: 100%;
        position: relative;
        padding: 0 14px;
        display: flex;
        flex-direction: column;
        margin-top: 8px;
      }

      @media (max-width: 480px) {
        .summary {
          padding: 20px 14px 0;
        }
      }

      @media (min-width: 768px) {
        .summary {
          padding: 0 28px;
        }

        .chart {
          padding: 0 28px;
        }
      }

      @media (min-width: 1024px) {
        .summary {
          padding: 28px 0 0;
        }

        .chart {
          padding: 0;
        }
      }

      .summary .pair {
        font-family: 'ChakraPetch';
        font-style: normal;
        font-weight: 700;
        font-size: 18px;
        line-height: 100%;
      }

      .summary .desc {
        font-family: 'ChakraPetch';
        font-style: normal;
        font-weight: 500;
        font-size: 14px;
        line-height: 100%;
        color: rgba(255, 255, 255, 0.6);
      }

      .tooltip {
        position: relative;
        box-sizing: border-box;
        font-size: 12px;
        color: #fff;
        text-align: right;
        pointer-events: none;
      }

      .tooltip .price {
        font-family: 'ChakraPetch';
        font-style: normal;
        font-weight: 600;
        font-size: 18px;
        line-height: 100%;
        color: #85d1ff;
      }

      .tooltip .usd {
        font-family: 'ChakraPetch';
        font-style: normal;
        font-weight: 500;
        font-size: 14px;
        line-height: 100%;
        color: rgba(255, 255, 255, 0.4);
      }

      .tooltip-floating {
        width: 96px;
        padding: 5px 0;
        //background-color: #000524;
        position: absolute;
        top: 12px;
        left: 12px;
        display: none;
        flex-direction: column;
        box-sizing: border-box;
        z-index: 5;
        pointer-events: none;
        border-radius: 2px;
        font-family: 'ChakraPetch';
        font-weight: 700;
        font-size: 12px;
        color: rgba(255, 255, 255, 0.4);
        text-align: center;
        line-height: 120%;
      }

      .tooltip-floating .time {
        font-size: 18px;
        font-weight: 600;
        color: #ecedef;
        line-height: 130%;
      }

      @media (min-width: 1024px) {
        .summary .pair {
          font-size: 19px;
        }

        .tooltip .price {
          font-size: 24px;
        }
      }

      .skeleton {
        display: flex;
        flex-direction: column;
      }

      .usd-skeleton {
        margin-top: 2px;
      }

      .backdrop {
        display: block;
        position: absolute;
        width: 100%;
        height: 100%;
      }

      .loading .backdrop {
        display: block;
        z-index: 2;
      }

      .loading .tv-lightweight-charts {
        filter: blur(8px);
      }

      uigc-busy-indicator {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 55px;
        height: 16px;
        margin-top: -8px;
        margin-left: -22.5px;
      }

      gc-chart-empty,
      gc-chart-error,
      uigc-busy-indicator {
        display: none;
      }

      #chart {
        position: relative;
      }

      .price-line {
        display: none;
        position: absolute;
        left: 0;
        color: red;
        border-top: 1px dashed #000524;
        width: 100%;
        z-index: 2;
      }

      .price-tag {
        display: none;
        position: absolute;
        left: 0;
        font-family: 'SatoshiVariable';
        font-style: normal;
        font-weight: 500;
        font-size: 12px;
        color: #fff;
        z-index: 3;
        padding: 0 4px;
      }

      .price-tag:hover {
        background: #000524;
        cursor: pointer;
      }

      .price-tag:hover + .price-line {
        display: block;
      }

      .show {
        display: block;
      }
    `,
  ];

  private calculateDollarPrice(price: string) {
    if (this.usdPrice.size == 0) {
      return null;
    }

    const spotPriceAsset = this.tradeType == TradeType.Buy ? this.assetIn : this.assetOut;
    const usdPrice = this.usdPrice.get(spotPriceAsset.id);

    if (usdPrice == null) {
      return Number(price).toFixed(4);
    }
    return multipleAmounts(price, usdPrice).toFixed(2);
  }

  /**
   * Create composite key for pair dataset. Keys are stored as Buys.
   *
   * @param inputAsset - Trade input asset
   * @param outputAsset - Trade output asset
   * @returns - composite key with semicolon between assets
   */
  private createDataKey(inputAsset: string, outputAsset: string) {
    return inputAsset + ':' + outputAsset;
  }

  /**
   * Return composite key for dataset pair. In case of sell assets are switched.
   *
   * @returns composite key representing assetIn:assetOut
   */
  private dataKey() {
    return this.tradeType == TradeType.Buy
      ? this.assetIn?.symbol + ':' + this.assetOut?.symbol
      : this.assetOut?.symbol + ':' + this.assetIn?.symbol;
  }

  private hasRecord() {
    return tradeDataCursor.deref().has(this.dataKey());
  }

  private fetchData() {
    if (this.hasRecord()) {
      const cachedData = tradeDataCursor.deref().get(this.dataKey());
      this.syncChart(cachedData);
      return;
    }

    const inputAsset = this.tradeType == TradeType.Buy ? this.assetIn : this.assetOut;
    const outputAsset = this.tradeType == TradeType.Buy ? this.assetOut : this.assetIn;

    if (!inputAsset?.symbol || !outputAsset?.symbol) {
      return;
    }

    const endOfDay = dayjs().endOf('day').format('YYYY-MM-DDTHH:mm:ss'); // always use end of day so grafana cache query
    this.chartState = ChartState.Loading;
    query(
      this.datasourceId,
      inputAsset.symbol,
      outputAsset.symbol,
      endOfDay,
      (data: TradeData) => {
        const dataKey = this.createDataKey(inputAsset.symbol, outputAsset.symbol);
        tradeDataCursor.deref().set(dataKey, data);
        this.syncChart(data);
      },
      (_err) => {
        this.chartState = ChartState.Error;
      }
    );
  }

  private syncChart(data: TradeData) {
    const lastPrice = this.getLastPrice();
    const rangeFrom = this.getRangeFrom();
    const priceBucket = new Bucket(data.price).withRange(rangeFrom);
    //const volumeBucket = new Bucket(data.volume).withRange(rangeFrom);

    if (priceBucket.length <= MIN_DATAPOINTS) {
      this.chartState = ChartState.Empty;
      return;
    } else {
      //const priceBucketData = priceBucket.withGaps(true).fixWhitespace();
      //const volumeBucketData = volumeBucket.withGaps().data;

      this.chart.timeScale().setVisibleLogicalRange({ from: 0.5, to: priceBucket.length - 0.5 });
      this.chartPriceSeries.setData(priceBucket.data);
      this.chartPriceSeries.update(lastPrice);
      //this.chartVolumeSeries.setData(volumeBucketData);
    }

    const max = priceBucket.max();
    const min = priceBucket.min();
    const avg = priceBucket.avg();

    this.syncPriceScale(max, min, avg);
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
    const avgYCoord = (minYCoord - maxYCoord) / 2 + maxYCoord;

    this.syncPriceLine('maxLine', maxYCoord);
    this.syncPriceLine('minLine', minYCoord);
    this.syncPriceLine('avgLine', avgYCoord);

    this.syncPriceTag('maxTag', maxYCoord, max);
    this.syncPriceTag('minTag', minYCoord, min);
    this.syncPriceTag('avgTag', avgYCoord, avg);
  }

  private getRangeFrom(): UTCTimestamp {
    const range = this.range;
    switch (range) {
      case Range['1d']:
        return dayjs().subtract(1, 'day').unix() as UTCTimestamp;
      case Range['1w']:
        return dayjs().subtract(1, 'week').unix() as UTCTimestamp;
      default:
        return dayjs(INIT_DATE).unix() as UTCTimestamp;
    }
  }

  private getLastPrice(): SingleValueData {
    return {
      time: dayjs().unix() as UTCTimestamp,
      value: this.spotPrice,
    } as SingleValueData;
  }

  override async firstUpdated() {
    this.chartContainer = this.shadowRoot.getElementById('chart');
    this.chart = createChart(this.chartContainer, {
      layout: layoutOptions,
      rightPriceScale: rightPriceScale,
      leftPriceScale: leftPriceScale,
      timeScale: timeScale(this.range, dayjs),
      grid: grid,
      crosshair: crosshair,
      handleScale: false,
      handleScroll: false,
    });

    this.chartPriceSeries = this.chart.addAreaSeries({
      topColor: 'rgba(79, 223, 255, 0.31)',
      bottomColor: 'rgba(79, 234, 255, 0)',
      lineColor: '#85D1FF',
      lineWidth: 2,
      lastValueVisible: false,
      priceLineVisible: false,
      crosshairMarkerRadius: 4,
      crosshairMarkerBorderColor: '#000',
      crosshairMarkerBackgroundColor: '#fff',
    });
    this.chartPriceSeries.setData(DEFAULT_DATASET);
    this.chart.timeScale().fitContent();

    this.chartVolumeSeries = this.chart.addHistogramSeries({
      color: '#85D1FF',
      lastValueVisible: false,
      priceLineVisible: false,
      priceFormat: {
        type: 'volume',
      },
      priceScaleId: '',
      scaleMargins: {
        top: 0.8,
        bottom: 0,
      },
    });

    const selected = this.shadowRoot.getElementById('selected');
    const actual = this.shadowRoot.getElementById('actual');
    const floating = this.shadowRoot.getElementById('floating');

    subscribeCrosshair(this.chart, this.chartContainer, this.chartPriceSeries, selected, actual, floating, (price) =>
      this.calculateDollarPrice(price)
    );
  }

  async subscribe() {
    const api = chainCursor.deref().api;
    this.disconnectSubscribeNewHeads = await api.rpc.chain.subscribeNewHeads(async (lastHeader) => {
      this.fetchData();
    });
  }

  override async updated() {
    if (this.chain.state && !this.ready) {
      this.ready = true;
      this.subscribe();
    }
  }

  override update(changedProperties: Map<string, unknown>) {
    if (this.chart && changedProperties.has('spotPrice')) {
      this.fetchData();
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
      const inputAsset = this.tradeType == TradeType.Sell ? this.assetIn?.symbol : this.assetOut?.symbol;
      const outputAsset = this.tradeType == TradeType.Sell ? this.assetOut?.symbol : this.assetIn?.symbol;
      return html`<div class="pair">${inputAsset ?? '-'} / ${outputAsset ?? '-'}</div>`;
    } else {
      return html`<uigc-skeleton class="skeleton" progress rectangle width="150px" height="24px"></uigc-skeleton>`;
    }
  }

  priceTemplate() {
    const usdClasses = {
      usd: true,
      hidden: this.usdPrice.size == 0,
    };
    const spotUsd = this.spotPrice ? this.calculateDollarPrice(this.spotPrice) : null;
    if (this.tradeProgress || !this.spotPrice) {
      return html`<uigc-skeleton progress rectangle width="150px" height="24px"></uigc-skeleton>`;
    } else {
      return html`<div class="price">
          ${humanizeAmount(this.spotPrice)}
          <span class="asset"> ${this.tradeType == TradeType.Sell ? this.assetOut?.symbol : this.assetIn?.symbol}</span>
        </div>
        <div class=${classMap(usdClasses)}>≈$${humanizeAmount(spotUsd)}</div>`;
    }
  }

  rangeTemplate() {
    const rangeVal = Range[this.range];
    return html`<uigc-range-button-group
      selected=${rangeVal}
      @range-button-clicked=${(e: CustomEvent) => {
        this.range = Range[e.detail.value];
        this.requestUpdate();
        this.fetchData();
      }}
    >
      ${Object.values(Range).map((s: string) => html` <uigc-range-button value=${s}>${s}</uigc-range-button> `)}
    </uigc-range-button-group>`;
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
      show: this.chartState == ChartState.Loading,
    };
    return html`<div id="backdrop" class="backdrop">
      ${this.priceScaleTemplate('maxTag', 'maxLine')} ${this.priceScaleTemplate('avgTag', 'avgLine')}
      ${this.priceScaleTemplate('minTag', 'minLine')}
      <gc-chart-empty class=${classMap(chartEmptyClasses)}></gc-chart-empty>
      <gc-chart-error class=${classMap(chartErrorClasses)}></gc-chart-error>
      <uigc-busy-indicator class=${classMap(chartLoadingClasses)}></uigc-busy-indicator>
    </div>`;
  }

  render() {
    const chartClasses = {
      chart: true,
      loading: this.chartState != ChartState.Loaded || tradeDataCursor.deref().length == 0,
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
