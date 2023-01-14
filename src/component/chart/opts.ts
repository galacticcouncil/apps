import { ScaleOptions, GridLineOptions } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { enUS } from 'date-fns/locale';

export const xScale: ScaleOptions = {
  type: 'time',
  adapters: {
    date: {
      locale: enUS,
    },
  },
  time: {
    tooltipFormat: 'yyyy-MM-dd HH:mm:ss',
    displayFormats: {
      millisecond: 'HH:mm:ss',
      second: 'HH:mm:ss',
      minute: 'HH:mm',
      hour: 'HH:mm',
      day: 'HH:mm',
      week: 'HH:mm',
      month: 'HH:mm',
      quarter: 'HH:mm',
      year: 'HH:mm',
    },
  },
  ticks: {
    display: true,
    color: '#fff',
    font: {
      family: 'SatoshiVariable',
      weight: '500',
      size: 12,
    },
    maxTicksLimit: 15,
    autoSkip: false,
    maxRotation: 0,
    minRotation: 0,
  },
  grid: {
    display: false,
  } as unknown as GridLineOptions,
  border: {
    display: true,
    color: '#333750',
  },
};

export const yScale: ScaleOptions = {
  ticks: {
    display: true,
    color: '#fff',
    font: {
      family: 'SatoshiVariable',
      weight: '500',
      size: 10,
    },
    align: 'end',
    maxTicksLimit: 3,
    mirror: true,
    padding: -10,
    labelOffset: -10,
  },
  position: 'right',
  grid: {
    display: true,
    drawOnChartArea: true,
    drawTicks: false,
    color: function (context) {
      return 'rgba(133,209,255,0.1)';
    },
  } as unknown as GridLineOptions,
  border: {
    display: true,
    color: '#333750',
  },
};
