import { PriceFormat } from 'lightweight-charts';

export function humanizeScale(amount: string): PriceFormat {
  const amountNo = Number(amount);
  let maxSignDigits: number = 4;
  if (amountNo > 1) {
    return {
      type: 'price',
      precision: 2,
      minMove: 0.01,
    } as PriceFormat;
  }
  return {
    type: 'price',
    precision: maxSignDigits,
    minMove: 0.0001,
  } as PriceFormat;
}
