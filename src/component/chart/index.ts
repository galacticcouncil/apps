import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { classMap } from 'lit/directives/class-map.js';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import {
  createChart,
  IChartApi,
  ISeriesApi,
  IPriceLine,
  UTCTimestamp,
  TimeRange,
  PriceLineOptions,
  LineStyle,
} from 'lightweight-charts';

import { baseStyles } from '../base.css';
import { Chain, chainCursor } from '../../db';
import { DatabaseController } from '../../db.ctrl';
import { humanizeAmount, multipleAmounts } from '../../utils/amount';

import { formatData, query } from './data';
import { humanizeScale } from './utils';
import { subscribeCrosshair } from './plugins';
import { DEFAULT_TRADE_CHART_STATE, TradeChartState, Range } from './types';
import { crosshair, grid, layoutOptions, leftPriceScale, rightPriceScale, timeScale } from './opts';

import './range/ButtonGroup';
import './range/Button';

import { Amount, PoolAsset, TradeType } from '@galacticcouncil/sdk';

const dayRange = () => {
  return {
    from: dayjs().subtract(1, 'day').unix() as UTCTimestamp,
    to: dayjs().local().unix() as UTCTimestamp,
  } as TimeRange;
};

const weekRange = () => {
  return {
    from: dayjs().subtract(1, 'week').unix() as UTCTimestamp,
    to: dayjs().local().unix() as UTCTimestamp,
  } as TimeRange;
};

@customElement('gc-trade-chart')
export class TradeChart extends LitElement {
  private chain = new DatabaseController<Chain>(this, chainCursor);

  private chart: IChartApi = null;
  private chartContainer: HTMLElement = null;
  private chartSeries: ISeriesApi<'Area'> = null;
  private chartPriceLine: IPriceLine = null;
  private ready: boolean = false;
  private ro: ResizeObserver = new ResizeObserver((entries) => {
    if (entries.length === 0 || entries[0].target !== this.chartContainer) {
      return;
    }
    const newRect = entries[0].contentRect;
    this.chart.applyOptions({ height: newRect.height, width: newRect.width });
  });
  private disconnectSubscribeNewHeads: () => void = null;

  @state() chartState: TradeChartState = { ...DEFAULT_TRADE_CHART_STATE };

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

      .header {
        height: 80px;
        padding: 28px 28px 28px 0;
        display: flex;
        flex-direction: column;
        row-gap: 5px;
        color: #fff;
      }

      .header .info {
        font-family: 'FontOver';
        font-style: normal;
        font-weight: 500;
        font-size: 30px;
        line-height: 100%;
      }

      .header .desc {
        font-family: 'ChakraPetch';
        font-style: normal;
        font-weight: 500;
        font-size: 14px;
        line-height: 100%;
      }

      .chart {
        height: 100%;
      }

      .tooltip {
        position: absolute;
        padding: 28px;
        box-sizing: border-box;
        font-size: 12px;
        color: #fff;
        text-align: right;
        z-index: 1000;
        top: 0;
        right: 0;
        pointer-events: none;
      }

      .tooltip .price {
        font-family: 'FontOver';
        font-style: normal;
        font-weight: 500;
        font-size: 24px;
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

  private hasData() {
    return this.chartState.ts.length > 0 && this.chartState.price.length > 0;
  }

  private fetchData() {
    const inputAsset = this.tradeType == TradeType.Buy ? this.assetIn : this.assetOut;
    const outputAsset = this.tradeType == TradeType.Buy ? this.assetOut : this.assetIn;

    query(this.datasourceId, inputAsset.symbol, outputAsset.symbol, (ts, price) => {
      this.chartState = {
        ...this.chartState,
        ts: ts,
        price: price,
      };
      this.syncChart();
      this.syncChartRange();
    });
  }

  private reverseData() {
    const priceReverted = this.chartState.price.map((price: number) => {
      return 1 / price;
    });
    this.chartState = {
      ...this.chartState,
      price: priceReverted,
    };
    this.syncChart();
  }

  private syncChart() {
    const formattedData = formatData(this.chartState.ts, this.chartState.price);
    this.chartSeries.setData(formattedData);
    this.chartSeries.applyOptions({
      priceFormat: humanizeScale(this.spotPrice),
      priceLineVisible: false,
      priceLineSource: 1,
    });
    this.syncPriceLine();
  }

  private syncChartRange() {
    const range = this.chartState.range;
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

  private syncPriceLine() {
    this.chartPriceLine && this.chartSeries.removePriceLine(this.chartPriceLine);
    this.chartPriceLine = this.chartSeries.createPriceLine({
      price: this.spotPrice,
      color: '#85D1FF',
      lineStyle: LineStyle.Dashed,
      axisLabelVisible: true,
    } as PriceLineOptions);
  }

  override async firstUpdated() {
    this.chartContainer = this.shadowRoot.getElementById('chart');
    this.chart = createChart(this.chartContainer, {
      layout: layoutOptions,
      rightPriceScale: rightPriceScale,
      leftPriceScale: leftPriceScale,
      timeScale: timeScale(this.chartState.range, dayjs),
      grid: grid,
      crosshair: crosshair,
    });

    this.chartSeries = this.chart.addAreaSeries({
      topColor: 'rgba(79, 223, 255, 0.31)',
      bottomColor: 'rgba(79, 234, 255, 0)',
      lineColor: '#85D1FF',
      lineWidth: 2,
      // Disable default price line
      crosshairMarkerVisible: false,
      lastValueVisible: false,
      priceLineVisible: false,
    });

    const selected = this.shadowRoot.getElementById('selected');
    const actual = this.shadowRoot.getElementById('actual');
    subscribeCrosshair(this.chart, this.chartContainer, this.chartSeries, selected, actual, (price) =>
      this.calculateDollarPrice(price)
    );
    this.ro.observe(this.chartContainer);
  }

  async subscribe() {
    const api = chainCursor.deref().api;
    this.disconnectSubscribeNewHeads = await api.rpc.chain.subscribeNewHeads(async (lastHeader) => {
      if (this.hasData()) {
        this.syncPriceLine();
      }
    });
  }

  override async updated() {
    if (this.chain.state && !this.ready) {
      console.log(this.ready);
      this.ready = true;
      this.subscribe();
      console.log('Chart ready ✅');
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
  }

  override disconnectedCallback() {
    //this.chart.remove();
    this.ro.unobserve(this.chartContainer);
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
    const rangeVal = Range[this.chartState.range];
    return html`
      <div class="header">
        ${when(
          this.assetIn || this.assetOut,
          () => html` <div class="info">${this.assetIn.symbol ?? '-'} / ${this.assetOut.symbol ?? '-'}</div>`,
          () => html` <div class="info">Loading...</div>`
        )}
        <uigc-range-button-group
          selected=${rangeVal}
          @range-button-clicked=${(e: CustomEvent) => {
            this.chartState.range = Range[e.detail.value];
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
