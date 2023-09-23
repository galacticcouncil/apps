import { HistoricalPrice } from './query';

export interface HistoricalBalance {
  dataset: [number, number][];
  lastBlock: HistoricalPrice;
}
