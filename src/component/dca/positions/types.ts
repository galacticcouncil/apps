import { AssetMetadata, BigNumber } from "@galacticcouncil/sdk";

export type DcaStatus = {
  type: string;
  err?: string;
  desc?: string;
};

export type DcaTransaction = {
  date: string;
  block: number;
  amountIn: BigNumber
  amountOut: BigNumber
  status: DcaStatus;
};

export type DcaPosition = {
  id: number;
  assetIn: string;
  assetOut: string;
  assetInMeta: AssetMetadata;
  assetOutMeta: AssetMetadata;
  start: number;
  nextExecution: number;
  nextExecutionBlock: number;
  interval: number;
  amount: BigNumber;
  total: BigNumber;
  status: DcaStatus;
  transactions: DcaTransaction[];
};
