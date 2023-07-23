import type { PoolAsset, Transaction } from '@galacticcouncil/sdk';
import { getTradeMaxAmountIn, getTradeMinAmountOut } from './slippage';
import { chainCursor, tradeSettingsCursor } from '../db';
import { formatAmount } from '../utils/amount';
import { TradeSplit } from '../component/trade/types';

export type TradeInfo = {
  trade: any;
  tradeSplit: boolean;
  transaction: Transaction;
  slippage: string;
};

export async function getBestSell(assetIn: PoolAsset, assetOut: PoolAsset, amountIn: string): Promise<TradeInfo> {
  const router = chainCursor.deref().router;
  const bestSell = await router.getBestSell(assetIn.id, assetOut.id, amountIn);
  const bestSellHuman = bestSell.toHuman();

  const { slippage, smartSplit, priceImpactThreshold } = tradeSettingsCursor.deref();

  const minAmountOut = getTradeMinAmountOut(bestSell, slippage);
  const minAmountOutHuman = formatAmount(minAmountOut.amount, minAmountOut.decimals);
  const transaction = bestSell.toTx(minAmountOut.amount);
  const tradeSplit = smartSplit && bestSell.priceImpactPct > Number(priceImpactThreshold);

  return {
    trade: bestSellHuman,
    tradeSplit: tradeSplit,
    transaction: transaction,
    slippage: minAmountOutHuman,
  } as TradeInfo;
}

export async function getBestBuy(assetIn: PoolAsset, assetOut: PoolAsset, amountOut: string): Promise<TradeInfo> {
  const router = chainCursor.deref().router;
  const bestBuy = await router.getBestBuy(assetIn.id, assetOut.id, amountOut);
  const bestBuyHuman = bestBuy.toHuman();

  const { slippage, smartSplit, priceImpactThreshold } = tradeSettingsCursor.deref();

  const maxAmountIn = getTradeMaxAmountIn(bestBuy, slippage);
  const maxAmountInHuman = formatAmount(maxAmountIn.amount, maxAmountIn.decimals);
  const transaction = bestBuy.toTx(maxAmountIn.amount);
  const tradeSplit = smartSplit && bestBuy.priceImpactPct > Number(priceImpactThreshold);

  return {
    trade: bestBuyHuman,
    tradeSplit: tradeSplit,
    transaction: transaction,
    slippage: maxAmountInHuman,
  } as TradeInfo;
}
