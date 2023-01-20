import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { classMap } from 'lit/directives/class-map.js';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import * as cache from '@thi.ng/cache';

import {
  createChart,
  IChartApi,
  ISeriesApi,
  IPriceLine,
  UTCTimestamp,
  TimeRange,
  SingleValueData,
} from 'lightweight-charts';

import { baseStyles } from '../base.css';
import { Chain, chainCursor } from '../../db';
import { DatabaseController } from '../../db.ctrl';
import { humanizeAmount, multipleAmounts } from '../../utils/amount';

import { formatData, query } from './data';
import { humanizeScale } from './utils';
import { subscribeCrosshair } from './plugins';
import { Range } from './types';
import { crosshair, grid, layoutOptions, leftPriceScale, rightPriceScale, timeScale } from './opts';

import './range/ButtonGroup';
import './range/Button';

import { Amount, PoolAsset, TradeType } from '@galacticcouncil/sdk';

const dayRange = () => {
  return {
    from: dayjs().subtract(1, 'day').unix() as UTCTimestamp,
    to: dayjs().unix() as UTCTimestamp,
  } as TimeRange;
};

const weekRange = () => {
  return {
    from: dayjs().subtract(1, 'week').unix() as UTCTimestamp,
    to: dayjs().unix() as UTCTimestamp,
  } as TimeRange;
};

const CHART_HEIGHT = 315;

@customElement('gc-trade-chart')
export class TradeChart extends LitElement {
  private chain = new DatabaseController<Chain>(this, chainCursor);
  private data = new cache.TLRUCache<string, SingleValueData[]>(null, { ttl: 1000 * 60 * 60 });

  private chart: IChartApi = null;
  private chartContainer: HTMLElement = null;
  private chartSeries: ISeriesApi<'Area'> = null;
  private chartPriceLine: IPriceLine = null;
  private ready: boolean = false;
  private ro = new ResizeObserver((entries) => {
    entries.forEach((entry) => {
      this.chart.resize(entry.contentRect.width, CHART_HEIGHT);
    });
  });
  private disconnectSubscribeNewHeads: () => void = null;

  @state() range: Range = Range['1w'];

  @property({ type: Number }) datasourceId = null;
  @property({ attribute: false }) tradeType: TradeType = TradeType.Buy;
  @property({ type: Boolean }) tradeProgress: Boolean = false;
  @property({ type: Object }) assetIn: PoolAsset = null;
  @property({ type: Object }) assetOut: PoolAsset = null;
  @property({ type: String }) spotPrice = null;
  @property({ attribute: false }) usdPrice: Map<string, Amount> = new Map([]);

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
        height: 80px;
        display: flex;
        flex-direction: column;
        row-gap: 5px;
        color: #fff;
        padding: 14px;
      }

      .chart {
        height: 100%;
        padding: 0 14px;
      }

      @media (min-width: 768px) {
        .summary {
          padding: 0 0 28px 0;
        }

        .chart {
          padding: 0;
        }
      }

      .summary .info {
        font-family: 'FontOver';
        font-style: normal;
        font-weight: 500;
        font-size: 20px;
        line-height: 100%;
      }

      .summary .desc {
        font-family: 'ChakraPetch';
        font-style: normal;
        font-weight: 500;
        font-size: 12px;
        line-height: 100%;
      }

      .tooltip {
        position: absolute;
        box-sizing: border-box;
        font-size: 12px;
        color: #fff;
        text-align: right;
        z-index: 1000;
        top: 94px;
        right: 14px;
        pointer-events: none;
      }

      .tooltip .price {
        font-family: 'FontOver';
        font-style: normal;
        font-weight: 500;
        font-size: 20px;
        line-height: 130%;
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

      @media (min-width: 768px) {
        .tooltip {
          top: 0;
          right: 0;
        }

        .summary .info {
          font-weight: 500;
          font-size: 30px;
        }

        .summary .desc {
          font-weight: 500;
          font-size: 14px;
        }

        .tooltip .price {
          font-size: 24px;
        }
      }

      .skeleton {
        display: flex;
        flex-direction: column;
        align-items: end;
      }

      .usd-skeleton {
        margin-top: 2px;
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
    return this.data.has(this.dataKey());
  }

  private fetchData() {
    if (this.hasRecord()) {
      const cachedData = this.data.get(this.dataKey());
      this.syncChart(cachedData);
      return;
    }

    const inputAsset = this.tradeType == TradeType.Buy ? this.assetIn : this.assetOut;
    const outputAsset = this.tradeType == TradeType.Buy ? this.assetOut : this.assetIn;

    const endOfDay = dayjs().endOf('day').format('YYYY-MM-DDTHH:mm:ss'); // always use end of day so grafana cache query
    query(this.datasourceId, inputAsset.symbol, outputAsset.symbol, endOfDay, (ts, price) => {
      const formattedData = formatData(ts, price);
      const dataKey = this.createDataKey(inputAsset.symbol, outputAsset.symbol);
      this.data.set(dataKey, formattedData);
      this.syncChart(formattedData);
      this.syncChartRange();
    });
  }

  private syncChart(data: SingleValueData[]) {
    this.chartSeries.setData(data);
    this.chartSeries.update({
      time: dayjs().unix() as UTCTimestamp,
      value: this.spotPrice,
    });
    this.chartSeries.applyOptions({
      priceFormat: humanizeScale(this.spotPrice),
      priceLineVisible: false,
      priceLineSource: 1,
    });
  }

  private syncChartRange() {
    const range = this.range;
    switch (range) {
      case Range['1d']:
        this.chart.timeScale().setVisibleRange(dayRange());
        break;
      case Range['1w']:
        this.chart.timeScale().setVisibleRange(weekRange());
        break;
      default:
        this.chart.timeScale().fitContent();
        break;
    }
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
    });

    const selected = this.shadowRoot.getElementById('selected');
    const actual = this.shadowRoot.getElementById('actual');
    subscribeCrosshair(this.chart, this.chartContainer, this.chartSeries, selected, actual, (price) =>
      this.calculateDollarPrice(price)
    );
  }

  async subscribe() {
    const api = chainCursor.deref().api;
    this.disconnectSubscribeNewHeads = await api.rpc.chain.subscribeNewHeads(async (lastHeader) => {
      if (this.hasRecord()) {
        const cachedData = this.data.get(this.dataKey());
        this.syncChart(cachedData);
      }
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

  handleResize(_evt: UIEvent) {
    const newWidth = window.innerWidth - 540;
    if (newWidth < 640) {
      this.chart.resize(window.innerWidth - 540, CHART_HEIGHT);
      this.chart.timeScale().scrollToPosition(0, false);
    }
  }

  override connectedCallback() {
    super.connectedCallback();
    this.ro.observe(this);
    window.addEventListener('resize', (evt) => this.handleResize(evt));
  }

  override disconnectedCallback() {
    // this.chart.remove(); Destroy chart
    this.ro.unobserve(this);
    this.disconnectSubscribeNewHeads?.();
    super.disconnectedCallback();
    window.removeEventListener('resize', this.handleResize);
  }

  render() {
    const usdClasses = {
      usd: true,
      hidden: this.usdPrice.size == 0,
    };
    const priceClasses = {
      price: true,
      hidden: !this.spotPrice,
    };
    const spotUsd = this.spotPrice ? this.calculateDollarPrice(this.spotPrice) : null;
    const rangeVal = Range[this.range];
    return html`
      <slot name="header"></slot>
      <div class="summary">
        ${when(
          this.assetIn || this.assetOut,
          () => html` <div class="info">${this.assetIn.symbol ?? '-'} / ${this.assetOut.symbol ?? '-'}</div>`,
          () => html` <div class="info">Loading...</div>`
        )}
        <uigc-range-button-group
          selected=${rangeVal}
          @range-button-clicked=${(e: CustomEvent) => {
            this.range = Range[e.detail.value];
            this.requestUpdate();
            this.syncChartRange();
          }}
        >
          ${Object.values(Range).map((s: string) => html` <uigc-range-button value=${s}>${s}</uigc-range-button> `)}
        </uigc-range-button-group>
      </div>
      <div id="chart" class="chart"></div>
      <div id="selected" class="tooltip skeleton"></div>
      <div id="actual" class="tooltip skeleton">
        ${when(
          this.tradeProgress,
          () => html`
            <uigc-skeleton progress rectangle width="213px" height="30px"></uigc-skeleton>
            <uigc-skeleton class="usd-skeleton" progress rectangle width="50px" height="14px"></uigc-skeleton>
          `,
          () => html`
            <div class=${classMap(priceClasses)}>
              ${humanizeAmount(this.spotPrice)}
              <span class="asset">
                ${this.tradeType == TradeType.Sell ? this.assetOut?.symbol : this.assetIn?.symbol}</span
              >
            </div>
            <div class=${classMap(usdClasses)}>≈$${humanizeAmount(spotUsd)}</div>
          `
        )}
      </div>
    `;
  }
}
