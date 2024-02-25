import {
  Amount,
  Asset,
  BigNumber,
  Trade,
  TradeType,
} from '@galacticcouncil/sdk';

import { Twap } from 'api/trade/types';

export enum TradeTab {
  TradeChart,
  TradeForm,
  TradeSettings,
  SelectAsset,
}

export type TradeState = {
  inProgress: boolean;
  assetIn: Asset;
  assetOut: Asset;
  amountIn: string;
  amountOut: string;
  balanceIn: Amount;
  balanceOut: Amount;
  maxAmountIn: Amount;
  minAmountOut: Amount;
  spotPrice: string;
  trade: Trade;
  transactionFee: TransactionFee;
  type: TradeType;
  error: {};
};

export const DEFAULT_TRADE_STATE: TradeState = {
  inProgress: false,
  assetIn: null,
  assetOut: null,
  amountIn: null,
  amountOut: null,
  balanceIn: null,
  balanceOut: null,
  maxAmountIn: null,
  minAmountOut: null,
  spotPrice: null,
  trade: null,
  transactionFee: null,
  type: TradeType.Buy,
  error: {},
};

export type TwapState = {
  inProgress: boolean;
  active: boolean;
  twap: Twap;
};

export const DEFAULT_TWAP_STATE: TwapState = {
  inProgress: false,
  active: true,
  twap: null,
};

export type TransactionFee = {
  asset: Asset;
  amount: BigNumber;
  amountNative: string;
};
