import {
  Amount,
  Asset,
  BigNumber,
  Trade,
  TradeOrder,
  TradeType,
} from '@galacticcouncil/sdk';

export enum TradeTab {
  Chart,
  Form,
  Settings,
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
  spotPrice: null,
  trade: null,
  transactionFee: null,
  type: TradeType.Buy,
  error: {},
};

export type TwapState = {
  inProgress: boolean;
  active: boolean;
  order: TradeOrder;
  orderDuration: number;
};

export const DEFAULT_TWAP_STATE: TwapState = {
  inProgress: false,
  active: true,
  order: null,
  orderDuration: null,
};

export type TransactionFee = {
  asset: Asset;
  amount: BigNumber;
  amountNative: string;
};
