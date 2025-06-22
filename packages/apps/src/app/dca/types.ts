import { Amount, Asset, TradeDcaOrder } from '@galacticcouncil/sdk';

import { DAY_MS, HOUR_MS, WEEK_MS } from '../../utils/time';

export enum DcaTab {
  Chart,
  Form,
  Settings,
  SelectAsset,
}

export type DcaState = {
  inProgress: boolean;
  assetIn: Asset;
  assetOut: Asset;
  amountIn: string;
  balanceIn: Amount;
  interval: IntervalDca;
  intervalMultiplier: number;
  frequency: number;
  spotPrice: string;
  order: TradeDcaOrder;
  error: {};
};

export const DEFAULT_DCA_STATE: DcaState = {
  inProgress: false,
  assetIn: null,
  assetOut: null,
  amountIn: null,
  balanceIn: null,
  interval: 'day',
  intervalMultiplier: 1,
  frequency: null,
  spotPrice: null,
  order: null,
  error: {},
};

export const INTERVAL_DCA = ['hour', 'day', 'week'] as const;

export const INTERVAL_DCA_MS: Record<IntervalDca, number> = {
  hour: HOUR_MS,
  day: DAY_MS,
  week: WEEK_MS,
};

export type IntervalDca = (typeof INTERVAL_DCA)[number];
export type FrequencyUnit = 'min' | 'hour' | 'day';
