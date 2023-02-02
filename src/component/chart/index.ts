import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { classMap } from 'lit/directives/class-map.js';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import { createChart, IChartApi, ISeriesApi, UTCTimestamp, SingleValueData } from 'lightweight-charts';

import { baseStyles } from '../base.css';
import { Chain, chainCursor, tradeDataCursor } from '../../db';
import { DatabaseController } from '../../db.ctrl';
import { humanizeAmount, multipleAmounts } from '../../utils/amount';

import { DEFAULT_DATASET, formatData, query } from './data';
import { subscribeCrosshair } from './plugins';
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
const MAX_PAPER_WIDTH = 480;
const MIN_DATAPOINTS = 5;

@customElement('gc-trade-chart')
export class TradeChart extends LitElement {
  private chain = new DatabaseController<Chain>(this, chainCursor);

  private chart: IChartApi = null;
  private chartContainer: HTMLElement = null;
  private chartSeries: ISeriesApi<'Area'> = null;
  private ready: boolean = false;
  private ro = new ResizeObserver((entries) => {
    entries.forEach((entry) => {
      const iWidth = window.innerWidth;
      if (iWidth > 1023) {
        this.chart.resize(entry.contentRect.width, CHART_HEIGHT);
      } else if (iWidth < 480) {
        this.chart.resize(entry.contentRect.width - 2 * 14, entry.contentRect.height - 170);
      } else if (iWidth < 768) {
        this.chart.resize(entry.contentRect.width - 2 * 14, entry.contentRect.height - 150);
      } else {
        const crv = entry.contentRect.width;
        const chartWidth = crv > MAX_PAPER_WIDTH ? MAX_PAPER_WIDTH : crv;
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
        grid-gap: 2px;
        grid-template-areas:
          'pair price'
          'desc price';
        color: #fff;
        padding: 0 14px;
      }

      .summary > div:nth-child(1) {
        grid-area: pair;
      }

      .summary > div:nth-child(2) {
        grid-area: desc;
      }

      .summary > div:nth-child(3) {
        grid-area: price;
        align-items: flex-end;
      }

      .summary > div:nth-child(4) {
        grid-area: price;
        align-items: flex-end;
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
          padding: 26px 0 0;
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
      }

      .tooltip .usd {
        font-family: 'ChakraPetch';
        font-style: normal;
        font-weight: 500;
        font-size: 14px;
        line-height: 100%;
      }

      .tooltip .price__selected {
        color: #85d1ff;
      }

      .tooltip-floating {
        width: 96px;
        padding: 5px 0;
        //background-color: #000524;
        position: absolute;
        display: none;
        flex-direction: column;
        row-gap: 5px;
        box-sizing: border-box;
        font-size: 14px;
        color: #fff;
        text-align: center;
        z-index: 5;
        top: 12px;
        left: 12px;
        pointer-events: none;
        border-radius: 2px;
        font-weight: 700;
        line-height: 16px;
        font-family: 'SatoshiVariable';
      }

      .tooltip-floating .time {
        font-size: 18px;
        font-weight: 900;
      }

      @media (min-width: 1024px) {
        .summary .pair {
          font-size: 24px;
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

      .spot-tag {
        display: none;
        position: absolute;
        left: 0;
        font-family: 'SatoshiVariable';
        font-style: normal;
        font-weight: 500;
        font-size: 12px;
        color: #000;
        z-index: 3;
        padding: 0 4px;
        background: #85d1ff;
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
      (ts, price) => {
        const formattedData = formatData(ts, price);
        const dataKey = this.createDataKey(inputAsset.symbol, outputAsset.symbol);
        tradeDataCursor.deref().set(dataKey, formattedData);
        this.syncChart(formattedData);
      },
      (_err) => {
        this.chartState = ChartState.Error;
      }
    );
  }

  private syncChart(data: SingleValueData[]) {
    const lastPrice = this.getLastPrice();
    const rangeFrom = this.getRangeFrom();
    const rangeData = data.filter((point: SingleValueData) => point.time > rangeFrom);

    if (rangeData.length <= MIN_DATAPOINTS) {
      this.chartState = ChartState.Empty;
      return;
    } else {
      this.chart.timeScale().setVisibleLogicalRange({ from: 0.5, to: rangeData.length - 0.5 });
      this.chartSeries.setData(rangeData);
      this.chartSeries.update(lastPrice);
    }
    this.chartSeries.applyOptions({
      priceLineVisible: true,
      priceLineSource: 1,
    });

    const max = Math.max(...rangeData.map((p: SingleValueData) => p.value));
    const min = Math.min(...rangeData.map((p: SingleValueData) => p.value));
    const sum = rangeData.map((svd: SingleValueData) => svd.value).reduce((v1: number, v2: number) => v1 + v2, 0);
    const avg = sum / rangeData.length || 0;
    this.syncPriceScale(max, min, avg);
    this.chartState = ChartState.Loaded;
  }

  syncPriceLine(id: string, yCoord: number) {
    const lineEl = this.shadowRoot.getElementById(id);
    lineEl.setAttribute('style', 'top: ' + yCoord + 'px;');
  }

  syncPriceTag(id: string, yCoord: number, value: number) {
    const tagEl = this.shadowRoot.getElementById(id);
    tagEl.setAttribute('style', 'top: ' + (yCoord - 9) + 'px;');
    tagEl.innerHTML = humanizeAmount(value.toString());
  }

  syncPriceScale(max: number, min: number, avg: number) {
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
        return 0 as UTCTimestamp;
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

    this.chartSeries = this.chart.addAreaSeries({
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
    this.chartSeries.setData(DEFAULT_DATASET);
    this.chart.timeScale().fitContent();

    const selected = this.shadowRoot.getElementById('selected');
    const actual = this.shadowRoot.getElementById('actual');
    const floating = this.shadowRoot.getElementById('floating');

    subscribeCrosshair(this.chart, this.chartContainer, this.chartSeries, selected, actual, floating, (price) =>
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
    const priceLineClasses = {
      'price-line': true,
    };
    const priceTagClasses = {
      'price-tag': true,
      show: this.chartState == ChartState.Loaded,
    };
    const spotTagClasses = {
      'spot-tag': true,
      show: this.chartState == ChartState.Loaded,
    };
    return html`<div id="backdrop" class="backdrop">
      <span id="maxTag" class=${classMap(priceTagClasses)}> </span>
      <span id="maxLine" class=${classMap(priceLineClasses)}></span>
      <span id="avgTag" class=${classMap(priceTagClasses)}></span>
      <span id="avgLine" class=${classMap(priceLineClasses)}></span>
      <span id="minTag" class=${classMap(priceTagClasses)}></span>
      <span id="minLine" class=${classMap(priceLineClasses)}></span>
      <span id="spotTag" class=${classMap(spotTagClasses)}></span>
      <gc-chart-empty class=${classMap(chartEmptyClasses)}></gc-chart-empty>
      <gc-chart-error class=${classMap(chartErrorClasses)}></gc-chart-error>
      <uigc-busy-indicator class=${classMap(chartLoadingClasses)}></uigc-busy-indicator>
    </div>`;
  }

  private formatAssetName(asset: PoolAsset) {
    const name = this.details.get(asset.id)?.name ?? '-';
    return name.replace(/ *\([^)]*\) */g, '');
  }

  render() {
    const usdClasses = {
      usd: true,
      hidden: this.usdPrice.size == 0,
    };
    const chartClasses = {
      chart: true,
      loading: this.chartState != ChartState.Loaded || tradeDataCursor.deref().length == 0,
    };
    const spotUsd = this.spotPrice ? this.calculateDollarPrice(this.spotPrice) : null;
    const rangeVal = Range[this.range];
    return html`
      <slot name="header"></slot>
      <div class="summary">
        <div>
          ${when(
            this.assetIn || this.assetOut,
            () => html` <div class="pair">${this.assetIn.symbol ?? '-'} / ${this.assetOut.symbol ?? '-'}</div>`,
            () => html` <uigc-skeleton class="skeleton" progress rectangle width="150px" height="24px"></uigc-skeleton>`
          )}
        </div>
        <div>
          ${when(
            this.assetIn || this.assetOut,
            () => html` <div class="pair-detail">
              ${this.formatAssetName(this.assetIn)} / ${this.formatAssetName(this.assetOut)}
            </div>`,
            () => html` <uigc-skeleton class="skeleton" progress rectangle width="130px" height="21px"></uigc-skeleton>`
          )}
        </div>
        <div id="selected" class="tooltip skeleton"></div>
        <div id="actual" class="tooltip skeleton">
          ${when(
            this.tradeProgress || !this.spotPrice,
            () => html` <uigc-skeleton progress rectangle width="150px" height="24px"></uigc-skeleton> `,
            () => html`
              <div class="price">
                ${humanizeAmount(this.spotPrice)}
                <span class="asset">
                  ${this.tradeType == TradeType.Sell ? this.assetOut?.symbol : this.assetIn?.symbol}</span
                >
              </div>
              <div class=${classMap(usdClasses)}>≈$${humanizeAmount(spotUsd)}</div>
            `
          )}
        </div>
      </div>

      <div class=${classMap(chartClasses)}>
        <uigc-range-button-group
          selected=${rangeVal}
          @range-button-clicked=${(e: CustomEvent) => {
            this.range = Range[e.detail.value];
            this.requestUpdate();
            this.fetchData();
          }}
        >
          ${Object.values(Range).map((s: string) => html` <uigc-range-button value=${s}>${s}</uigc-range-button> `)}
        </uigc-range-button-group>
        <div id="chart">
          <div id="floating" class="tooltip-floating"></div>
          ${this.backdropTemplate()}
        </div>
      </div>
    `;
  }
}
