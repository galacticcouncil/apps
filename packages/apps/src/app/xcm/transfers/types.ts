import { AnyChain } from '@galacticcouncil/xcm-core';
import { Log } from 'viem';

export type Transfer = {
  id: string;
  data: TransferData;
  emitterChain: number;
  emitterAddress: TransferEmmiter;
  sequence: string;
  sourceChain: TransferChain;
  content: TransferContent;
  vaa: {
    raw: string;
  };
};

export type TransferEmmiter = {
  hex: string;
  native: `0x${string}`;
};

export type TransferData = {
  symbol: string;
  tokenAmount: string;
};

export type TransferChain = {
  chainId: number;
  timestamp: string | bigint;
  transaction: TransferTx;
  from: `0x${string}`;
};

export type TransferTx = {
  txHash: `0x${string}`;
};

export type TransferContent = {
  payload: TransferPayload;
  info: TransferInfo;
};

export type TransferInfo = {
  from: string;
  fromChain: AnyChain;
  to: string;
  toChain: AnyChain;
  status?: TransferStatus;
};

export enum TransferStatus {
  WaitingForVaa,
  VaaEmitted,
  Completed,
}

export type TransferPayload = {
  amount: bigint;
  payloadID: number;
  payload?: `0x${string}`;
  to: `0x${string}`;
  toChain: number;
  tokenAddress: `0x${string}`;
  tokenChain: number;
};

export type TransferLog = Log<
  bigint,
  number,
  true,
  undefined,
  boolean,
  unknown[],
  string
>;
