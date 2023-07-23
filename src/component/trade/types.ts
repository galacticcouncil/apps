import { PoolAsset, Trade, TradeType } from '@galacticcouncil/sdk';

export enum TradeTab {
  TradeChart,
  TradeForm,
  TradeSettings,
  SelectAsset,
}

export type TransactionFee = { amount: string; asset: string; ed: string };

export type TradeSplit = { amount: string; noOfTrades: number };

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
  tradeFeeRange: [number, number];
  tradeSplitInfo: TradeSplit;
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
  tradeFeeRange: null,
  tradeSplitInfo: null,
  transactionFee: null,
  swaps: [],
  error: {},
};
