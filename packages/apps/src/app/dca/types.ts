import { Asset } from '@galacticcouncil/sdk';
import { DAY_MS, HOUR_MS, WEEK_MS } from '../../utils/time';

export enum DcaTab {
  TradeChart,
  DcaForm,
  DcaSettings,
  DcaPositions,
  SelectAsset,
}

export type DcaState = {
  assetIn: Asset;
  assetOut: Asset;
  amountIn: string;
  amountInMin: string;
  amountInBudget: string;
  amountInUsd: string;
  balanceIn: string;
  interval: IntervalDca;
  intervalMultiplier: number;
  frequency: number;
  frequencyManual: number;
  frequencyRange: [number, number];
  spotPrice: string;
  tradeFee: string;
  tradeFeePct: string;
  tradesNo: number;
  error: {};
};

export const DEFAULT_DCA_STATE: DcaState = {
  assetIn: null,
  assetOut: null,
  amountIn: null,
  amountInMin: null,
  amountInBudget: null,
  amountInUsd: null,
  balanceIn: null,
  interval: 'day',
  intervalMultiplier: 1,
  frequency: null,
  frequencyManual: null,
  frequencyRange: [null, null],
  spotPrice: null,
  tradeFee: null,
  tradeFeePct: '0',
  tradesNo: null,
  error: {},
};

export const INTERVAL_DCA = ['hour', 'day', 'week'] as const;

export const INTERVAL_DCA_MS: Record<IntervalDca, number> = {
  hour: HOUR_MS,
  day: DAY_MS,
  week: WEEK_MS,
};

export type IntervalDca = (typeof INTERVAL_DCA)[number];
