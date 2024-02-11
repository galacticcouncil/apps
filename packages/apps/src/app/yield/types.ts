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
  interval: '1 month',
  rate: null,
  spotPrice: null,
  tradesNo: null,
  est: null,
  error: {},
};

export const INTERVAL_DCA = [
  '1 week',
  '1 month',
  '6 months',
  '1 year',
] as const;

export const INTERVAL_DCA_MS: Record<IntervalDca, number> = {
  '1 week': WEEK_MS,
  '1 month': MONTH_MS,
  '6 months': MONTH_MS * 6,
  '1 year': DAY_MS * 365,
};

export type IntervalDca = (typeof INTERVAL_DCA)[number];

export const APY: number = 15;

export const APY_DENOMINATOR: Record<IntervalDca, number> = {
  '1 week': 52,
  '1 month': 12,
  '6 months': 2,
  '1 year': 1,
};

export const MIN_TRADE_SIZE = 0.33;
export const MAX_TRADE_SIZE = 10;
