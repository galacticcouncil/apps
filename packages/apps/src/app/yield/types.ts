import {
  Asset,
  BigNumber,
  Humanizer,
  Trade,
  Transaction,
} from '@galacticcouncil/sdk';
import { DAY_MS, MONTH_MS, WEEK_MS } from '../../utils/time';

export enum DcaTab {
  Chart,
  Form,
  Settings,
  SelectAsset,
}

export type DcaState = {
  assetIn: Asset;
  assetOut: Asset;
  amountIn: string;
  balanceIn: string;
  interval: IntervalDca;
  spotPrice: string;
  rate: number;
  order: DcaYieldOrder;
  error: {};
};

export const DEFAULT_DCA_STATE: DcaState = {
  assetIn: null,
  assetOut: null,
  amountIn: null,
  balanceIn: null,
  interval: '1 month',
  spotPrice: null,
  rate: null,
  order: null,
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

export interface DcaYieldOrder extends Humanizer {
  amountIn: BigNumber;
  amountInYield: BigNumber;
  tradesNo: number;
  toTx(address: string, maxRetries: number, trade: Trade): Transaction;
  toHuman(): any;
}
