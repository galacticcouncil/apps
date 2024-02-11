import { Amount, Asset, BigNumber, TradeType } from '@galacticcouncil/sdk';

import { TradeTwap } from '../../api/trade';

export enum TradeTab {
  TradeChart,
  TradeForm,
  TradeSettings,
  SelectAsset,
}

export type TransactionFee = {
  asset: Asset;
  amount: BigNumber;
  amountNative: string;
};

export type TradeState = {
  inProgress: boolean;
  afterSlippage: string;
  afterSlippageUsd: string;
  assetIn: Asset;
  assetOut: Asset;
  amountIn: string;
  amountInUsd: string;
  amountOut: string;
  amountOutUsd: string;
  balanceIn: Amount;
  balanceOut: Amount;
  priceImpactPct: string;
  spotPrice: string;
  tradeFee: string;
  tradeFeePct: string;
  tradeFeeRange: [number, number];
  transactionFee: TransactionFee;
  type: TradeType;
  swaps: [];
  error: {};
};

export const DEFAULT_TRADE_STATE: TradeState = {
  inProgress: false,
  afterSlippage: '0',
  afterSlippageUsd: '0',
  assetIn: null,
  assetOut: null,
  amountIn: null,
  amountInUsd: null,
  amountOut: null,
  amountOutUsd: null,
  balanceIn: null,
  balanceOut: null,
  priceImpactPct: '0',
  spotPrice: null,
  tradeFee: null,
  tradeFeePct: '0',
  tradeFeeRange: null,
  transactionFee: null,
  type: TradeType.Buy,
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
  active: true,
  twap: null,
};
