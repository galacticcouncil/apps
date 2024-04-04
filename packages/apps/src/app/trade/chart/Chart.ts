import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import { ISeriesApi, UTCTimestamp, SingleValueData } from 'lightweight-charts';

import {
  Chain,
  ChainCursor,
  DatabaseController,
  TradeData,
  TradeDataCursor,
} from 'db';
import { exchange, humanizeAmount } from 'utils/amount';

import { Amount, Asset } from '@galacticcouncil/sdk';

import { Chart, Bucket } from 'element/chart';
import { DEFAULT_DATASET } from 'element/chart/data';
import { ChartRange, ChartState } from 'element/chart/types';

import { TradeChartApi } from './api';

@customElement('gc-trade-chart')
export class TradeChart extends Chart {
  private chain = new DatabaseController<Chain>(this, ChainCursor);

  private chartApi: TradeChartApi = null;

  private chartPriceSeries: ISeriesApi<'Baseline'> = null;
  private chartPriceOhlcSeries: ISeriesApi<'Candlestick'> = null;
  private chartVolumeSeries: ISeriesApi<'Histogram'> = null;

  private ready: boolean = false;
  private disconnectSubscribeNewHeads: () => void = null;

  @property({ type: String }) grafanaUrl = null;
  @property({ type: Number }) grafanaDsn = null;
  @property({ type: String }) spotPrice = null;
  @property({ type: Boolean }) tradeProgress: Boolean = false;
  @property({ attribute: false }) usdPrice: Map<string, Amount> = new Map([]);

  private calculateDollarPrice(price: string) {
    return exchange(this.usdPrice, this.assetIn, price);
  }

  protected loadData() {
    if (!this.hasPoolPair()) {
      return;
    }

    if (this.hasRecord()) {
      const cachedData = this.getRecord();
      this.syncChart(cachedData);
      return;
    }

    const from = this.getRangeFrom().format('YYYY-MM-DDTHH:mm:ssZ');
    const to = this.getRangeTo().format('YYYY-MM-DDTHH:mm:ssZ');
    this.chartState = ChartState.Loading;
    this.chartApi.getTradeData(
      this.assetIn,
      this.assetOut,
      from,
      to,
      this.chartRange,
      (assetIn, assetOut, data: TradeData) => {
        this.storeRecord(assetIn, assetOut, data);
        if (this.shouldSync(assetIn, assetOut)) {
          this.syncChart(data);
        }
      },
      (_err) => {
        this.chartState = ChartState.Error;
      },
    );
  }

  private getLastPrice(): SingleValueData {
    return {
      time: this._dayjs().unix() as UTCTimestamp,
      value: Number(this.spotPrice),
    } as SingleValueData;
  }

  protected syncChart(data: TradeData) {
    const lastPrice = this.getLastPrice();
    const rangeFrom = this.getRangeFrom().unix();
    const priceBucket = new Bucket(data.primary).withRange(rangeFrom);
    const priceOhlcBucket = data.primaryOhlc.filter(
      (dp) => dp.time > rangeFrom,
    );
    const volumeBucket = new Bucket(data.secondary).withRange(rangeFrom);

    priceBucket.push(lastPrice);
    volumeBucket.push({ time: lastPrice.time, value: 0 });

    if (this.shouldDisplay(data)) {
      this.chartPriceSeries.setData(priceBucket.data);
      if (volumeBucket.length > 50) {
        this.chartPriceOhlcSeries.setData(priceOhlcBucket);
        this.chartVolumeSeries.setData(volumeBucket.data);
      } else {
        this.chartVolumeSeries.setData([]);
      }
      this.chart
        .timeScale()
        .setVisibleLogicalRange({ from: 0.5, to: priceBucket.length - 1.5 });
    } else {
      this.chartState = ChartState.Empty;
      return;
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

  onPriceSelection(price: string): string {
    return this.calculateDollarPrice(price);
  }

  initSeries(): void {
    const theme = this.theme.state;
    this.chartPriceSeries = this.chart.addBaselineSeries({
      visible: true,
      lineWidth: 2,
      topLineColor: theme === 'hdx' ? '#85D1FF' : '#4fffb0',
      topFillColor1:
        theme === 'hdx'
          ? 'rgba(79, 223, 255, 0.31)'
          : 'rgba(79, 255, 176, 0.31)',
      topFillColor2:
        theme === 'hdx' ? 'rgba(79, 223, 255, 0)' : 'rgba(79, 255, 176, 0)',
      bottomLineColor: 'transparent',
      lastValueVisible: false,
      priceLineVisible: false,
      crosshairMarkerRadius: 4,
      crosshairMarkerBorderColor: '#000',
      crosshairMarkerBackgroundColor: '#fff',
    });

    this.chartPriceOhlcSeries = this.chart.addCandlestickSeries({
      visible: false,
      lastValueVisible: false,
      priceLineVisible: false,
      wickVisible: true,
      borderVisible: true,
    });

    const min = new Bucket(DEFAULT_DATASET).min();
    this.chartPriceSeries.setData(DEFAULT_DATASET);
    this.chartPriceSeries.applyOptions({
      baseValue: { type: 'price', price: min },
    });

    this.chartVolumeSeries = this.chart.addHistogramSeries({
      visible: true,
      color:
        theme === 'hdx'
          ? 'rgba(79, 223, 255, 0.31)'
          : 'rgba(79, 255, 176, 0.31)',
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
  }

  getSeries(): ISeriesApi<any>[] {
    return [this.chartPriceSeries, this.chartVolumeSeries];
  }

  getDatasetPrefix(): string {
    return this.chartRange;
  }

  private reverseHistogramDataset(
    volume: SingleValueData[],
    price: SingleValueData[],
  ): SingleValueData[] {
    return volume.map((d: SingleValueData, i: number) => {
      return {
        time: d.time,
        value: d.value / price[i].value,
      } as SingleValueData;
    });
  }

  protected storeRecord(
    assetIn: Asset,
    assetOut: Asset,
    data: TradeData,
  ): void {
    const cache = TradeDataCursor.deref();
    const key = this.buildDataKey(assetIn, assetOut);
    cache.set(key, data);

    const keySwitch = this.buildDataKey(assetOut, assetIn);
    const primarySwitch = this.reverseDataset(data.primary);
    const secondarySwitch = this.reverseHistogramDataset(
      data.secondary,
      data.primary,
    );
    cache.set(keySwitch, {
      primary: primarySwitch,
      primaryOhlc: [],
      secondary: secondarySwitch,
    });
  }

  private async init() {
    this.chartApi = new TradeChartApi(this.grafanaUrl, this.grafanaDsn);
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
    if (this.chart && changedProperties.has('spotPrice')) {
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
        <div class=${classMap(usdClasses)}>
          <span>Price:</span>
          <span>$${humanizeAmount(spotUsd)}</span>
        </div>
      `;
    }
  }

  rangeTemplate() {
    const rangeVal = ChartRange[this.chartRange];
    return html`
      <uigc-range-button-group
        .selected=${rangeVal}
        @range-button-clicked=${({ detail: { value } }) => {
          this.updateRange(value);
          this.loadData();
        }}>
        ${Object.values(ChartRange).map(
          (s: string) =>
            html`
              <uigc-range-button value=${s}>${s}</uigc-range-button>
            `,
        )}
      </uigc-range-button-group>
    `;
  }
}
