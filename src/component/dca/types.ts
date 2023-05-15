import { PoolAsset } from '@galacticcouncil/sdk';

export enum DcaTab {
  TradeChart,
  InvestForm,
  InvestPositions,
  SelectAsset,
}

export const INVEST_INTERVAL = ['day', 'week', 'month'] as const;
export type InvestInterval = typeof INVEST_INTERVAL[number];

export type InvestState = {
  assetIn: PoolAsset;
  assetOut: PoolAsset;
  amountIn: string;
  amountInBudget: string;
  amountInUsd: string;
  interval: InvestInterval;
  maxPrice: string;
  spotPrice: string;
  tradeFee: string;
  tradeFeePct: string;
};

export const DEFAULT_INVEST_STATE: InvestState = {
  assetIn: null,
  assetOut: null,
  amountIn: null,
  amountInBudget: null,
  amountInUsd: null,
  interval: "week",
  maxPrice: null,
  spotPrice: null,
  tradeFee: null,
  tradeFeePct: '0',
};
