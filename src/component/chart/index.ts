import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { baseStyles } from '../base.css';

import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  TimeScale,
  Title,
  Filler,
  Tooltip,
  TooltipPositionerFunction,
  ChartType,
  ScaleOptions,
} from 'chart.js';

import { corsairPlugin, tooltipLabel, tooltipLabelPointStyle, tooltipLabelTextColor } from './plugins';
import { dataset } from './data';
import { xScale, yScale } from './opts';

import './selector';

declare module 'chart.js' {
  interface TooltipPositionerMap {
    cursor: TooltipPositionerFunction<ChartType>;
  }
}

Tooltip.positioners.cursor = function (elements, eventPosition) {
  return {
    x: eventPosition.x,
    y: eventPosition.y + 35,
  };
};

@customElement('gc-chart')
export class GcChart extends LitElement {
  private chart: Chart = null;

  @property({ attribute: false }) ts: number[] = [];
  @property({ attribute: false }) price: number[] = [];
  @property({ type: String }) granularity = null;

  constructor() {
    super();
    Chart.register(
      LineController,
      LineElement,
      PointElement,
      LinearScale,
      CategoryScale,
      TimeScale,
      Title,
      Filler,
      Tooltip
    );
  }

  static styles = [
    baseStyles,
    css`
      :host {
        height: 100%;
      }

      .chart {
        height: 100%;
      }
    `,
  ];

  override async firstUpdated() {
    const ctx: CanvasRenderingContext2D = this.shadowRoot.querySelector('canvas').getContext('2d');
    this.chart = new Chart(ctx, {
      type: 'line',
      plugins: [corsairPlugin],
      data: dataset(this.ts, this.price),
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: 28 },
        scales: {
          x: xScale as ScaleOptions,
          y: yScale as ScaleOptions,
        },
        interaction: {
          intersect: false,
          mode: 'index',
        },
        plugins: {
          tooltip: {
            position: 'cursor',
            padding: 10,
            usePointStyle: true,
            callbacks: {
              label: tooltipLabel,
              labelTextColor: tooltipLabelTextColor,
              labelPointStyle: tooltipLabelPointStyle as any,
            },
            backgroundColor: '#000524',
            borderColor: '#85D1FF',
            borderWidth: 2,
            caretSize: 0,
            caretPadding: 7,
          },
        },
      },
    });
  }

  override update(changedProperties: Map<string, unknown>) {
    console.log(changedProperties);
    if (this.chart && changedProperties.has('ts') && changedProperties.has('price')) {
      this.chart.data.labels = this.ts;
      this.chart.data.datasets[0].data = this.price;
      this.chart.update();
    }
    super.update(changedProperties);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.chart.destroy();
  }

  render() {
    return html`
      <div class="chart">
        <canvas></canvas>
      </div>
    `;
  }
}
