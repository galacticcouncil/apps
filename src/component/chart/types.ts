import { SingleValueData } from 'lightweight-charts';

export enum Range {
  'All' = 'All',
  '1w' = '1w',
  '1d' = '1d',
}

export type TradeChartState = {
  range: Range;
  data: Map<string, SingleValueData[]>;
};

export const DEFAULT_TRADE_CHART_STATE: TradeChartState = {
  range: Range['1w'],
  data: new Map([]),
};
