import { BigNumber } from '@galacticcouncil/sdk';

export function formatAmount(amount: BigNumber, decimals: number): string {
  return amount.shiftedBy(-1 * decimals).toString();
}
