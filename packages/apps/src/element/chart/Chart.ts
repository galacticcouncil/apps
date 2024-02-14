import { html, css, TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import {
  createChart,
  IChartApi,
  ISeriesApi,
  SingleValueData,
} from 'lightweight-charts';
import { TLRUCache } from '@thi.ng/cache';

import { BaseElement } from 'element/BaseElement';
import { TradeData, TradeDataCursor } from 'db';
import { baseStyles } from 'styles/base.css';
import { humanizeAmount } from 'utils/amount';

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
import { ChartState } from './types';
import { calculateWidth } from './utils';

import './components/ButtonGroup';
import './components/Button';
import './components/states/Error';
import './components/states/Empty';
import './components/states/Loading';

import { Asset, ONE } from '@galacticcouncil/sdk';

const CHART_HEIGHT = 325;
const CHART_TIME_SCALE_HEIGHT = 26;
const CHART_PADDING_RATIO = 0.8;

export abstract class Chart extends BaseElement {
  protected chart: IChartApi = null;
  protected chartContainer: HTMLElement = null;

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

  @property({ type: Object }) assetIn: Asset = null;
  @property({ type: Object }) assetOut: Asset = null;
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

  abstract onPriceSelection(price: string): string;

  abstract initSeries(): void;
  abstract getSeries(): ISeriesApi<any>[];
  abstract getDatasetPrefix(): string;

  abstract pairTemplate(): TemplateResult;
  abstract priceTemplate(): TemplateResult;
  abstract rangeTemplate(): TemplateResult;

  protected abstract loadData(): void;
  protected abstract syncChart(data: TradeData): void;

  protected hasPoolPair(): boolean {
    return this.assetIn != null && this.assetOut != null;
  }

  protected buildDataKey(assetIn: Asset, assetOut: Asset) {
    return [this.getDatasetPrefix(), assetIn.id, assetOut.id]
      .filter(Boolean)
      .join(':');
  }

  protected getDataKey() {
    return this.buildDataKey(this.assetIn, this.assetOut);
  }

  protected getRecord() {
    const cache = TradeDataCursor.deref();
    return cache.get(this.getDataKey());
  }

  protected hasRecord(): boolean {
    const cache = TradeDataCursor.deref();
    return cache.has(this.getDataKey());
  }

  private reverseDataset(data: SingleValueData[]): SingleValueData[] {
    return data.map((d: SingleValueData) => {
      return {
        time: d.time,
        value: ONE.div(d.value).toNumber(),
      } as SingleValueData;
    });
  }

  protected storeRecord(assetIn: Asset, assetOut: Asset, data: TradeData) {
    const cache = TradeDataCursor.deref();
    const key = this.buildDataKey(assetIn, assetOut);
    cache.set(key, data);

    const keySwitch = this.buildDataKey(assetOut, assetIn);
    const primarySwitch = this.reverseDataset(data.primary);
    const secondarySwitch = this.reverseDataset(data.secondary);
    cache.set(keySwitch, {
      primary: primarySwitch,
      secondary: secondarySwitch,
    });
  }

  protected syncPriceLine(id: string, yCoord: number) {
    const lineEl = this.shadowRoot.getElementById(id);
    lineEl.setAttribute('style', 'top: ' + yCoord + 'px;');
  }

  protected syncPriceTag(id: string, yCoord: number, value: number) {
    const tagEl = this.shadowRoot.getElementById(id);
    tagEl.setAttribute('style', 'top: ' + (yCoord - 9) + 'px;');
    tagEl.innerHTML = humanizeAmount(value.toString());
  }

  protected syncPriceScale(max: number, min: number, avg: number) {
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

    this.initSeries();
    this.chart.timeScale().fitContent();

    const selected = this.shadowRoot.getElementById('selected');
    const actual = this.shadowRoot.getElementById('actual');
    const floating = this.shadowRoot.getElementById('floating');

    subscribeCrosshair(
      this.chart,
      this.chartContainer,
      this.getSeries(),
      selected,
      actual,
      floating,
      this.onPriceSelection.bind(this),
    );
  }

  override connectedCallback() {
    super.connectedCallback();
    this.ro.observe(this);
  }

  override disconnectedCallback() {
    this.ro.unobserve(this);
    super.disconnectedCallback();
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
