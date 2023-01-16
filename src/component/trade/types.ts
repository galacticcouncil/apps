import { Amount, PoolAsset, TradeType } from '@galacticcouncil/sdk';
import { AssetDetail } from '../../api/asset';

export enum TradeScreen {
  Settings,
  SelectToken,
  TradeTokens,
}

export type ScreenState = {
  active: TradeScreen;
  height: number;
};

export const DEFAULT_SCREEN_STATE: ScreenState = {
  active: TradeScreen.TradeTokens,
  height: null,
};

export type AssetSelector = { id: string; asset: string };

export type AssetsState = {
  active: string;
  selector: AssetSelector;
  list: PoolAsset[];
  map: Map<string, PoolAsset>;
  pairs: Map<string, PoolAsset[]>;
  details: Map<string, AssetDetail>;
  balance: Map<string, Amount>;
  usdPrice: Map<string, Amount>;
};

export const DEFAULT_ASSETS_STATE: AssetsState = {
  active: null,
  selector: null,
  list: [],
  map: new Map([]),
  pairs: new Map([]),
  details: new Map([]),
  balance: new Map([]),
  usdPrice: new Map([]),
};

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
