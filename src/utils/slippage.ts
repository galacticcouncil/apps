import { Amount, BigNumber, bnum, Trade } from '@galacticcouncil/sdk';

export const PCT_100 = bnum('100');

function calculateSlippage(amount: BigNumber, slippagePct: string): BigNumber {
  const slippage = amount.div(PCT_100).multipliedBy(slippagePct);
  return slippage.decimalPlaces(0, 1);
}

export function getTradeMinAmountOut(sell: Trade, slippagePct: string): Amount {
  const assetOutDecimals = sell.swaps[sell.swaps.length - 1].assetOutDecimals;
  return getMinAmountOut(sell.amountOut, assetOutDecimals, slippagePct);
}

export function getMinAmountOut(amountOut: BigNumber, assetOutDecimals: number, slippagePct: string): Amount {
  const slippage = calculateSlippage(amountOut, slippagePct);
  const minAmountOut = amountOut.minus(slippage);

  return {
    amount: minAmountOut,
    decimals: assetOutDecimals,
  } as Amount;
}

export function getTradeMaxAmountIn(buy: Trade, slippagePct: string): Amount {
  const assetInDecimals = buy.swaps[0].assetInDecimals;
  return getMaxAmountIn(buy.amountIn, assetInDecimals, slippagePct);
}

export function getMaxAmountIn(amountIn: BigNumber, assetInDecimals: number, slippagePct: string): Amount {
  const slippage = calculateSlippage(amountIn, slippagePct);
  const maxAmountIn = amountIn.plus(slippage);

  return {
    amount: maxAmountIn,
    decimals: assetInDecimals,
  } as Amount;
}
