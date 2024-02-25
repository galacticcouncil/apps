import { BigNumber, Humanizer, Transaction } from '@galacticcouncil/sdk';

export interface Twap extends Humanizer {
  amountIn: BigNumber;
  amountOut: BigNumber;
  maxAmountIn: BigNumber;
  minAmountOut: BigNumber;
  priceImpactPct: number;
  reps: number;
  time: number;
  tradeFee: BigNumber;
  error: TwapError;
  estimateFee(txfee: BigNumber): BigNumber;
  toTx(address: string, maxRetries: number): Transaction;
  toHuman(): any;
}

export enum TwapError {
  OrderTooSmall = 'OrderTooSmall',
  OrderTooBig = 'OrderTooBig',
  OrderImpactTooBig = 'OrderImpactTooBig',
}
