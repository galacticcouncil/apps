import { Amount, BigNumber, bnum, Trade } from '@galacticcouncil/sdk';

export const PCT_100 = bnum('100');

function calculateSlippage(amount: BigNumber, slippagePct: string): BigNumber {
  const slippage = amount.div(PCT_100).multipliedBy(slippagePct);
  return slippage.decimalPlaces(0, 1);
}

export function getMinAmountOut(sell: Trade, slippagePct: string): Amount {
  const assetOutDecimals = sell.swaps[sell.swaps.length - 1].assetOutDecimals;
  const slippage = calculateSlippage(sell.amountOut, slippagePct);
  const minAmountOut = sell.amountOut.minus(slippage);

  return {
    amount: minAmountOut,
    decimals: assetOutDecimals,
  } as Amount;
}

export function getMaxAmountIn(buy: Trade, slippagePct: string): Amount {
  const assetInDecimals = buy.swaps[0].assetInDecimals;
  const slippage = calculateSlippage(buy.amountIn, slippagePct);
  const maxAmountIn = buy.amountIn.plus(slippage);

  return {
    amount: maxAmountIn,
    decimals: assetInDecimals,
  } as Amount;
}
