import { BigNumber } from '@galacticcouncil/sdk';

export function formatAmount(amount: BigNumber, decimals: number): string {
  return amount.shiftedBy(-1 * decimals).toString();
}

export function humanizeAmount(amount: string, input?: boolean): string {
  const amountNo = Number(amount);
  let maxSignDigits: number = 4;
  if (amountNo > 1) {
    const intPartLen = Math.ceil(Math.log10(Number(amountNo) + 1));
    maxSignDigits = maxSignDigits + intPartLen;
  }
  const formattedNo = new Intl.NumberFormat('en-US', { maximumSignificantDigits: maxSignDigits }).format(amountNo);
  if (input) {
    return formattedNo.replaceAll(',', '');
  }
  return formattedNo.replaceAll(',', ' ');
}
