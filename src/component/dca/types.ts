import { PoolAsset } from '@galacticcouncil/sdk';
import { Interval } from '../../api/time';

export enum DcaTab {
  TradeChart,
  DcaForm,
  DcaPositions,
  SelectAsset,
}

export type DcaState = {
  assetIn: PoolAsset;
  assetOut: PoolAsset;
  amountIn: string;
  amountInBudget: string;
  amountInUsd: string;
  interval: Interval;
  maxPrice: string;
  spotPrice: string;
  tradeFee: string;
  tradeFeePct: string;
};

export const DEFAULT_DCA_STATE: DcaState = {
  assetIn: null,
  assetOut: null,
  amountIn: null,
  amountInBudget: null,
  amountInUsd: null,
  interval: 'week',
  maxPrice: null,
  spotPrice: null,
  tradeFee: null,
  tradeFeePct: '0',
};
