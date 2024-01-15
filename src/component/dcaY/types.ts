import { Asset } from '@galacticcouncil/sdk';
import { DAY_MS, MONTH_MS, WEEK_MS } from '../../utils/time';

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
  amountInYield: string;
  amountInFrom: string;
  balanceIn: string;
  interval: IntervalDca;
  rate: number;
  spotPrice: string;
  tradesNo: number;
  est: number;
  error: {};
};

export const DEFAULT_DCA_STATE: DcaState = {
  assetIn: null,
  assetOut: null,
  amountIn: null,
  amountInYield: null,
  amountInFrom: null,
  balanceIn: null,
  interval: 'month',
  rate: null,
  spotPrice: null,
  tradesNo: null,
  est: null,
  error: {},
};

export const INTERVAL_DCA = ['week', 'month', '6 months', 'year'] as const;
export const INTERVAL_DCA_MS: Record<IntervalDca, number> = {
  week: WEEK_MS,
  month: MONTH_MS,
  '6 months': MONTH_MS * 6,
  year: DAY_MS * 365,
};

export type IntervalDca = (typeof INTERVAL_DCA)[number];

export const APY: number = 15;

export const APY_DENOMINATOR: Record<IntervalDca, number> = {
  week: 52,
  month: 12,
  '6 months': 2,
  year: 1,
};

export const MIN_TRADE_SIZE = 0.33;
export const MAX_TRADE_SIZE = 10;
