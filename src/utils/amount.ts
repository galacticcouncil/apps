import { Amount, BigNumber, bnum, scale } from '@galacticcouncil/sdk';

export const MIN_NATIVE_AMOUNT = '500000000000000';

export function formatAmount(amount: BigNumber, decimals: number): string {
  return amount.shiftedBy(-1 * decimals).toString();
}

export function humanizeAmount(amount: string): string {
  const amountNo = Number(amount);
  if (Number.isInteger(amountNo)) {
    const formattedNo = new Intl.NumberFormat('en-US').format(amountNo);
    return formattedNo.replaceAll(',', ' ');
  }

  let maxSignDigits: number = 4;
  if (amountNo > 1) {
    const intPartLen = Math.ceil(Math.log10(Number(amountNo) + 1));
    maxSignDigits = maxSignDigits + intPartLen;
  }
  const formattedNo = new Intl.NumberFormat('en-US', {
    maximumSignificantDigits: maxSignDigits,
  }).format(amountNo);
  return formattedNo.replaceAll(',', ' ');
}

export function multipleAmounts(amountA: string, amountB: Amount) {
  const formattedAmountB = formatAmount(amountB.amount, amountB.decimals);
  const amounA = Number(amountA);
  const amounB = Number(formattedAmountB);
  return amounA * amounB;
}

export function toBn(amount: string, decimals: number) {
  const amountBN = scale(bnum(amount), decimals);
  return amountBN.decimalPlaces(0, 1);
}
