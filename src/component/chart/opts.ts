import {
  UTCTimestamp,
  TickMarkType,
  LayoutOptions,
  PriceScaleOptions,
  TimeScaleOptions,
  GridOptions,
  CrosshairOptions,
} from 'lightweight-charts';
import { Range } from './types';

export const layoutOptions = {
  background: {
    color: 'transparent',
  },
  textColor: '#ffffff',
  fontFamily: 'SatoshiVariable',
  fontSize: 12,
} as LayoutOptions;

export const rightPriceScale = {
  scaleMargins: {
    top: 0.2,
    bottom: 0.2,
  },
  visible: false,
  borderVisible: true,
  entireTextOnly: true,
  borderColor: 'rgba(114, 131, 165, 0.6)',
} as PriceScaleOptions;

export const leftPriceScale = {
  visible: false,
} as PriceScaleOptions;

export const timeScale = (range: Range, dayjs) => {
  return {
    visible: false,
    fixLeftEdge: true,
    fixRightEdge: true,
    borderVisible: true,
    borderColor: 'rgba(114, 131, 165, 0.6)',
    timeVisible: true,
    secondsVisible: false,
    tickMarkFormatter: (time: UTCTimestamp, tickMarkType: TickMarkType, locale: string) => {
      switch (tickMarkType) {
        case 2:
          return dayjs.unix(time).utc().format('MMM D');
        case 3:
          return dayjs.unix(time).utc().format('hh: mm');
        default:
          return dayjs.unix(time).utc().format('MMM D');
      }
    },
  } as TimeScaleOptions;
};

export const grid = {
  horzLines: {
    color: 'rgba(133,209,255,0.1)',
    visible: false,
  },
  vertLines: {
    color: '#000524',
    visible: false,
  },
} as GridOptions;

export const crosshair = {
  horzLine: {
    visible: false,
    labelVisible: true,
    labelBackgroundColor: '#66697C',
  },
  vertLine: {
    visible: true,
    labelVisible: true,
    labelBackgroundColor: '#66697C',
  },
} as CrosshairOptions;
