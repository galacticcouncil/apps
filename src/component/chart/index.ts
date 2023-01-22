import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { classMap } from 'lit/directives/class-map.js';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import * as cache from '@thi.ng/cache';

import { createChart, IChartApi, ISeriesApi, UTCTimestamp, TimeRange, SingleValueData } from 'lightweight-charts';

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

const CHART_HEIGHT = 315;

@customElement('gc-trade-chart')
export class TradeChart extends LitElement {
  private chain = new DatabaseController<Chain>(this, chainCursor);
  private data = new cache.TLRUCache<string, SingleValueData[]>(null, { ttl: 1000 * 60 * 60 });

  private chart: IChartApi = null;
  private chartContainer: HTMLElement = null;
  private chartSeries: ISeriesApi<'Area'> = null;
  private ready: boolean = false;
  private ro = new ResizeObserver((entries) => {
    entries.forEach((entry) => {
      const iWidth = window.innerWidth;
      if (iWidth > 1023) {
        this.chart.resize(entry.contentRect.width, CHART_HEIGHT);
      } else if (iWidth < 768) {
        this.chart.resize(entry.contentRect.width - 2 * 14, CHART_HEIGHT);
      } else {
        this.chart.resize(entry.contentRect.width - 2 * 28, CHART_HEIGHT);
      }
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
        display: grid;
        row-gap: 5px;
        color: #fff;
        padding: 0 14px;
        align-items: baseline;
      }

      .summary > :nth-child(1) {
        grid-area: 1 / 1 / 2 / 2;
      }

      .summary > :nth-child(2) {
        grid-area: 1 / 2 / 2 / 3;
      }

      .summary > :nth-child(3) {
        grid-area: 1 / 2 / 2 / 3;
      }

      .summary > :nth-child(4) {
        grid-area: 2 / 1 / 3 / 3;
      }

      .chart {
        height: 100%;
        padding-left: 14px;
      }

      @media (min-width: 768px) {
        .summary {
          padding: 0 28px;
          align-items: center;
        }

        .chart {
          padding-left: 28px;
        }
      }

      @media (min-width: 1024px) {
        .summary {
          padding: 0;
          align-items: center;
        }

        .chart {
          padding-left: 0;
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
        position: relative;
        height: unset;
        box-sizing: border-box;
        font-size: 12px;
        color: #fff;
        text-align: right;
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
        position: absolute;
        right: 3px;
        top: 25px;
      }

      .tooltip .price__selected {
        color: #85d1ff;
      }

      @media (min-width: 1024px) {
        .summary .info {
          font-weight: 500;
          font-size: 30px;
        }

        .summary .desc {
          font-weight: 500;
          font-size: 14px;
        }

        .tooltip {
          height: 35px;
        }

        .tooltip .price {
          font-size: 24px;
        }

        .tooltip .usd {
          top: 28px;
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

    if (!inputAsset?.symbol || !outputAsset?.symbol) {
      return;
    }

    const endOfDay = dayjs().endOf('day').format('YYYY-MM-DDTHH:mm:ss'); // always use end of day so grafana cache query
    query(this.datasourceId, inputAsset.symbol, outputAsset.symbol, endOfDay, (ts, price) => {
      const formattedData = formatData(ts, price);
      const dataKey = this.createDataKey(inputAsset.symbol, outputAsset.symbol);
      this.data.set(dataKey, formattedData);
      this.syncChart(formattedData);
    });
  }

  private syncChart(data: SingleValueData[]) {
    const lastPrice = this.getLastPrice();
    const rangeFrom = this.getRangeFrom();
    const rangeData = data.filter((point: SingleValueData) => point.time > rangeFrom);
    this.chartSeries.setData(rangeData);
    this.chartSeries.update(lastPrice);
    this.chartSeries.applyOptions({
      priceFormat: humanizeScale(this.spotPrice),
      priceLineVisible: true,
      priceLineSource: 1,
    });
    this.chart.timeScale().fitContent();
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
        <div id="selected" class="tooltip skeleton"></div>
        <div id="actual" class="tooltip skeleton">
          ${when(
            this.tradeProgress,
            () => html`
              <uigc-skeleton progress rectangle width="213px" height="20px"></uigc-skeleton>
              <uigc-skeleton class="usd usd-skeleton" progress rectangle width="50px" height="10px"></uigc-skeleton>
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
      </div>
      <div id="chart" class="chart">
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
      </div>
    `;
  }
}
