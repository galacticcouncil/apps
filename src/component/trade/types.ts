import { PoolAsset, TradeType } from '@galacticcouncil/sdk';

export type AssetSelector = { id: string; asset: string };

export enum TradeScreen {
  Settings,
  SelectToken,
  TradeTokens,
  TradeChart,
}

export type TransactionFee = { amount: string; asset: string; ed: string };

export type TradeState = {
  inProgress: boolean;
  type: TradeType;
  assetIn: PoolAsset;
  assetOut: PoolAsset;
  amountIn: string;
  amountOut: string;
  balanceIn: string;
  balanceOut: string;
  amountInUsd: string;
  amountOutUsd: string;
  spotPrice: string;
  afterSlippage: string;
  priceImpactPct: string;
  tradeFee: string;
  tradeFeePct: string;
  transactionFee: TransactionFee;
  swaps: [];
  error: {};
};

export const DEFAULT_TRADE_STATE: TradeState = {
  inProgress: false,
  type: TradeType.Buy,
  assetIn: null,
  assetOut: null,
  amountIn: null,
  amountOut: null,
  balanceIn: null,
  balanceOut: null,
  amountInUsd: null,
  amountOutUsd: null,
  spotPrice: null,
  afterSlippage: '0',
  priceImpactPct: '0',
  tradeFee: null,
  tradeFeePct: '0',
  transactionFee: null,
  swaps: [],
  error: {},
};
