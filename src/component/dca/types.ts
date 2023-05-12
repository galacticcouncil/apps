import { PoolAsset } from '@galacticcouncil/sdk';

export enum DcaTab {
  TradeChart,
  InvestForm,
  InvestPositions,
  SelectAsset,
}

export type InvestState = {
    assetIn: PoolAsset;
    assetOut: PoolAsset;
    amountIn: string;
    amountOut: string;
    amountInUsd: string;
    spotPrice: string;
    tradeFee: string;
    tradeFeePct: string;
  };
  
  export const DEFAULT_INVEST_STATE: InvestState = {
    assetIn: null,
    assetOut: null,
    amountIn: null,
    amountOut: null,
    amountInUsd: null,
    spotPrice: null,
    tradeFee: null,
    tradeFeePct: '0',
  };
