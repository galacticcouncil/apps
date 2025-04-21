export const INIT_DATE = '2023-01-06T13:00:00.000Z';

export enum ChartState {
  Error,
  Empty,
  Loading,
  Loaded,
}

export enum ChartRange {
  '1h' = '1h',
  '1d' = '1d',
  '1w' = '1w',
  '1m' = '1m',
  '1y' = '1y',
  'All' = 'All',
}
