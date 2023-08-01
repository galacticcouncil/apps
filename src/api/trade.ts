import type { PoolAsset, Transaction, Trade, Hop, Amount } from '@galacticcouncil/sdk';
import type { PalletDcaOrder } from '@polkadot/types/lookup';

import { getTradeMaxAmountIn, getTradeMinAmountOut } from './slippage';
import { chainCursor, tradeSettingsCursor } from '../db';
import { formatAmount } from '../utils/amount';

export type TradeInfo = {
  trade: Trade;
  transaction: Transaction;
  slippage: string;
};

export type TradeTwap = {
  trade: Trade;
  tradeReps: number;
  tradeOk: boolean;
  budget: number;
  orderSlippage: Amount;
  order: PalletDcaOrder;
};

export async function getSell(assetIn: PoolAsset, assetOut: PoolAsset, amountIn: string): Promise<TradeInfo> {
  const router = chainCursor.deref().router;
  const bestSell = await router.getBestSell(assetIn.id, assetOut.id, amountIn);
  const slippage = tradeSettingsCursor.deref().slippage;
  const minAmountOut = getTradeMinAmountOut(bestSell, slippage);
  const minAmountOutHuman = formatAmount(minAmountOut.amount, minAmountOut.decimals);
  const transaction = bestSell.toTx(minAmountOut.amount);

  return {
    trade: bestSell,
    transaction: transaction,
    slippage: minAmountOutHuman,
  } as TradeInfo;
}

export async function getBuy(assetIn: PoolAsset, assetOut: PoolAsset, amountOut: string): Promise<TradeInfo> {
  const router = chainCursor.deref().router;
  const bestBuy = await router.getBestBuy(assetIn.id, assetOut.id, amountOut);
  const slippage = tradeSettingsCursor.deref().slippage;
  const maxAmountIn = getTradeMaxAmountIn(bestBuy, slippage);
  const maxAmountInHuman = formatAmount(maxAmountIn.amount, maxAmountIn.decimals);
  const transaction = bestBuy.toTx(maxAmountIn.amount);

  return {
    trade: bestBuy,
    transaction: transaction,
    slippage: maxAmountInHuman,
  } as TradeInfo;
}

export async function getSellTwap(
  assetIn: PoolAsset,
  assetOut: PoolAsset,
  amountIn: number,
  priceImpact: number,
  amountMin: number,
  txFee: number
): Promise<TradeTwap> {
  const noOfTrades = Math.round(priceImpact * 10) || 1;
  const twapTxFee = txFee * 3;
  const twapTxFeeWithRetries = twapTxFee * 2;
  const twapTxFees = twapTxFeeWithRetries * noOfTrades;

  const amountInPerTrade = (amountIn - twapTxFees) / noOfTrades;

  const router = chainCursor.deref().router;
  const bestSell = await router.getBestSell(assetIn.id, assetOut.id, amountInPerTrade.toString());
  const bestSellRoute = bestSell.swaps.map(({ assetIn, assetOut }: Hop) => {
    return { pool: 'Omnipool', assetIn, assetOut };
  });

  const slippage = tradeSettingsCursor.deref().slippage;
  const minAmountOut = getTradeMinAmountOut(bestSell, slippage);
  const isValid = amountInPerTrade > amountMin && noOfTrades > 1;

  return {
    trade: bestSell,
    tradeReps: noOfTrades,
    tradeOk: isValid,
    budget: amountIn,
    orderSlippage: minAmountOut,
    order: {
      Sell: {
        assetIn: assetIn.id,
        assetOut: assetOut.id,
        amountIn: bestSell.amountIn.toString(),
        minAmountOut: minAmountOut.amount.toFixed(),
        route: bestSellRoute,
      },
    } as unknown as PalletDcaOrder,
  } as TradeTwap;
}

export async function getBuyTwap(
  assetIn: PoolAsset,
  assetOut: PoolAsset,
  amountOut: number,
  priceImpact: number,
  amountMin: number,
  txFee: number
): Promise<TradeTwap> {
  const noOfTrades = Math.round(priceImpact * 10) || 1;
  const twapTxFee = txFee * 3;
  const twapTxFeeWithRetries = twapTxFee * 2;
  const twapTxFees = twapTxFeeWithRetries * noOfTrades;

  const amountOutPerTrade = amountOut / noOfTrades;

  const router = chainCursor.deref().router;
  const bestBuy = await router.getBestBuy(assetIn.id, assetOut.id, amountOutPerTrade.toString());
  const bestBuyRoute = bestBuy.swaps.map(({ assetIn, assetOut }: Hop) => {
    return { pool: 'Omnipool', assetIn, assetOut };
  });

  const slippage = tradeSettingsCursor.deref().slippage;
  const maxAmountIn = getTradeMaxAmountIn(bestBuy, slippage);
  const maxAmountInStr = formatAmount(maxAmountIn.amount, maxAmountIn.decimals);
  const maxBudget = Number(maxAmountInStr) * noOfTrades + twapTxFees;
  const isValid = Number(maxAmountInStr) > amountMin && noOfTrades > 1;

  return {
    trade: bestBuy,
    tradeReps: noOfTrades,
    tradeOk: isValid,
    budget: maxBudget,
    orderSlippage: maxAmountIn,
    order: {
      Buy: {
        assetIn: assetIn.id,
        assetOut: assetOut.id,
        amountOut: bestBuy.amountOut.toString(),
        maxAmountIn: maxAmountIn.amount.toFixed(),
        route: bestBuyRoute,
      },
    } as unknown as PalletDcaOrder,
  } as TradeTwap;
}
