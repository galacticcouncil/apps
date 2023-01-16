export enum Range {
  'All' = 'All',
  '1w' = '1w',
  '1d' = '1d',
}

export type TradeChartState = {
  ts: number[];
  price: number[];
  range: Range;
};

export const DEFAULT_TRADE_CHART_STATE: TradeChartState = {
  ts: [],
  price: [],
  range: Range['1w'],
};
