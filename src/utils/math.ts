import { bnum } from '@galacticcouncil/sdk';

/**
 * Percentage Difference Formula
 *
 * (|𝑉1−𝑉2| / [(𝑉1+𝑉2)/2]) × 100
 *
 * @param v1 - amount 1
 * @param v2 - amoun t2
 * @returns Percentage difference
 */
export function calculatePercentageDifference(v1: number, v2: number): number {
  const _v1 = bnum(v1);
  const _v2 = bnum(v2);
  const impact = _v1.minus(_v2).abs().div(_v1.plus(_v2).div(2)).multipliedBy(100);
  return impact.decimalPlaces(2).toNumber();
}
