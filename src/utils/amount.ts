import { Amount, BigNumber, bnum, scale } from '@galacticcouncil/sdk';
import { FN } from '@galacticcouncil/bridge';

export function formatAmount(amount: BigNumber, decimals: number): string {
  return amount.shiftedBy(-1 * decimals).toString();
}

export function humanizeAmount(amount: string): string {
  const amountNo = Number(amount);
  let maxSignDigits: number = 4;
  if (amountNo > 1) {
    const intPartLen = Math.ceil(Math.log10(Number(amountNo) + 1));
    maxSignDigits = maxSignDigits + intPartLen;
  }
  const formattedNo = new Intl.NumberFormat('en-US', { maximumSignificantDigits: maxSignDigits }).format(amountNo);
  return formattedNo.replaceAll(',', ' ');
}

export function multipleAmounts(amountA: string, amountB: Amount) {
  const formattedAmountB = formatAmount(amountB.amount, amountB.decimals);
  const amounA = Number(amountA);
  const amounB = Number(formattedAmountB);
  return amounA * amounB;
}

export function toFN(amount: string, decimals: number) {
  const amountBN = scale(bnum(amount), decimals);
  return FN._fromBN(amountBN, decimals);
}
