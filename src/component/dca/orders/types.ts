import { AssetMetadata, BigNumber, ZERO } from '@galacticcouncil/sdk';

export type DcaStatus = {
  type: string;
  err?: string;
  desc?: string;
};

export type DcaTransaction = {
  date: string;
  block: number;
  amountIn: BigNumber;
  amountOut: BigNumber;
  status: DcaStatus;
};

export type DcaOrder = {
  id: number;
  assetIn: string;
  assetOut: string;
  assetInMeta: AssetMetadata;
  assetOutMeta: AssetMetadata;
  nextExecution: number;
  nextExecutionBlock: number;
  interval: number;
  amount: BigNumber;
  total: BigNumber;
  remaining: BigNumber;
  received: BigNumber;
  status: DcaStatus;
  transactions: DcaTransaction[];
  hasPendingTx(): boolean;
};

export const PLACEHOLDER = {
  date: null,
  block: 0,
  amountIn: ZERO,
  amountOut: ZERO,
  status: { type: 'TradePending' } as DcaStatus,
} as DcaTransaction;
