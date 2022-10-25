import { PoolAsset, TradeType, Transaction } from '@galacticcouncil/sdk';

export enum TradeScreen {
  Settings,
  SelectToken,
  TradeTokens,
}

export type AssetsState = {
  active: string;
  selector: { id: string; asset: string };
  list: PoolAsset[];
  map: Map<string, PoolAsset>;
  pairs: Map<string, PoolAsset[]>;
};

export const DEFAULT_ASSETS_STATE: AssetsState = {
  active: null,
  selector: null,
  list: [],
  map: new Map([]),
  pairs: new Map([]),
};

export type TradeState = {
  calculating: boolean;
  type: TradeType;
  afterSlippage: string;
  transactionFee: string;
  assetIn: PoolAsset;
  amountIn: string;
  amountInUsd: string;
  balanceIn: string;
  assetOut: PoolAsset;
  amountOut: string;
  amountOutUsd: string;
  balanceOut: string;
  spotPrice: string;
  swaps: [];
};

export const DEFAULT_TRADE_STATE: TradeState = {
  calculating: false,
  type: TradeType.Sell,
  afterSlippage: '0',
  transactionFee: '-',
  assetIn: null,
  amountIn: null,
  amountInUsd: '0',
  balanceIn: null,
  assetOut: null,
  amountOut: null,
  amountOutUsd: '0',
  balanceOut: null,
  spotPrice: null,
  swaps: [],
};
