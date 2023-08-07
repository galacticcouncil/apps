import { Amount, PoolAsset, TradeType } from '@galacticcouncil/sdk';
import { PalletDcaOrder } from '@polkadot/types/lookup';

import { TradeTwap } from '../../api/trade';

export enum TradeTab {
  TradeChart,
  TradeForm,
  TradeSettings,
  SelectAsset,
}

export type TransactionFee = { asset: string; amount: string; amountNative: string; ed: string };

export type TradeSplit = {
  inProgress: boolean;
  active: boolean;
  amountIn: string;
  maxBudget: number;
  noOfReps: number;
  orderSlippage: Amount;
  order: PalletDcaOrder;
};

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
  transactionFee: null,
  swaps: [],
  error: {},
};

export type TradeTwapState = {
  inProgress: boolean;
  active: boolean;
  twap: TradeTwap;
};

export const DEFAULT_TWAP_STATE: TradeTwapState = {
  inProgress: false,
  active: false,
  twap: null,
};
