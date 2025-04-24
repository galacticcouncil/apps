import { Asset, BigNumber, ZERO } from '@galacticcouncil/sdk';

export type OrderStatus = {
  type: string;
  err?: string;
  desc?: string;
};

export type OrderTransaction = {
  date: string;
  block: number;
  amountIn: BigNumber;
  amountOut: BigNumber;
  status: OrderStatus;
};

export type Order = {
  id: number;
  assetIn: Asset;
  assetOut: Asset;
  nextExecution: number;
  nextExecutionBlock: number;
  interval: number;
  amount: BigNumber;
  total: BigNumber;
  remaining: BigNumber;
  received: BigNumber;
  status: OrderStatus;
  transactions: OrderTransaction[];
  hasPendingTx(): boolean;
};

export const PLACEHOLDER = {
  date: null,
  block: 0,
  amountIn: ZERO,
  amountOut: ZERO,
  status: { type: 'TradePending' } as OrderStatus,
} as OrderTransaction;
