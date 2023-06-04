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
  est: string;
};

export const DEFAULT_DCA_STATE: DcaState = {
  assetIn: null,
  assetOut: null,
  amountIn: null,
  amountInBudget: null,
  amountInUsd: null,
  interval: '1h',
  maxPrice: null,
  spotPrice: null,
  tradeFee: null,
  tradeFeePct: '0',
  est: null,
};
