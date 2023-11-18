import { PoolToken } from '@galacticcouncil/sdk';
import { Interval } from '../../api/time';

export enum DcaTab {
  TradeChart,
  DcaForm,
  DcaSettings,
  DcaPositions,
  SelectAsset,
}

export type DcaState = {
  assetIn: PoolToken;
  assetOut: PoolToken;
  amountIn: string;
  amountInBudget: string;
  amountInUsd: string;
  balanceIn: string;
  interval: Interval;
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
