import { Asset } from '@galacticcouncil/sdk';
import { HOUR_MS } from '../../utils/time';

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
  amountInBudget: string;
  amountInUsd: string;
  balanceIn: string;
  interval: IntervalDca;
  intervalBlock: number;
  maxPrice: string;
  spotPrice: string;
  tradeFee: string;
  tradeFeePct: string;
  est: number;
  error: {};
};

export const DEFAULT_DCA_STATE: DcaState = {
  assetIn: null,
  assetOut: null,
  amountIn: null,
  amountInBudget: null,
  amountInUsd: null,
  balanceIn: null,
  interval: '1h',
  intervalBlock: null,
  maxPrice: null,
  spotPrice: null,
  tradeFee: null,
  tradeFeePct: '0',
  est: null,
  error: {},
};

export const INTERVAL_DCA = ['1h', '2h', '4h', '8h', '12h', '24h'] as const;

export const INTERVAL_DCA_MS: Record<IntervalDca, number> = {
  '1h': HOUR_MS,
  '2h': HOUR_MS * 2,
  '4h': HOUR_MS * 4,
  '8h': HOUR_MS * 8,
  '12h': HOUR_MS * 12,
  '24h': HOUR_MS * 24,
};

export type IntervalDca = (typeof INTERVAL_DCA)[number];
