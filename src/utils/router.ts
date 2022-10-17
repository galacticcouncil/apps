import { BigNumber, bnum, PoolAsset, Trade } from '@galacticcouncil/sdk';
import { SubmittableExtrinsic } from '@polkadot/api/promise/types';

export const DEFAULT_SLIPPAGE = '0.5';

function calculateSlippage(amount: BigNumber): BigNumber {
  const slippagePct = window.localStorage.getItem('trade.settings.slippage') || DEFAULT_SLIPPAGE;
  const slippage = amount.div(bnum('100')).multipliedBy(slippagePct);
  return slippage.decimalPlaces(0, 1);
}

function formatAmount(amount: BigNumber, decimals: number) {
  return amount.shiftedBy(-1 * decimals).toString();
}

export function pairsById(pairs: [string, PoolAsset[]][]): Map<string, PoolAsset[]> {
  const result = new Map<string, PoolAsset[]>();
  pairs.forEach((pair: [string, PoolAsset[]]) => result.set(pair[0], pair[1]));
  return result;
}

export function assetsById(assets: PoolAsset[]): Map<string, PoolAsset> {
  return new Map<string, PoolAsset>(assets.map((i) => [i.id, i]));
}

export async function getSellInfo(sell: Trade, account: string) {
  const assetOutDecimals = sell.swaps[sell.swaps.length - 1].assetOutDecimals;

  const slippage = calculateSlippage(sell.amountOut);
  const minAmountOut = sell.amountOut.minus(slippage);
  const minAmountOutHuman = formatAmount(minAmountOut, assetOutDecimals);

  const transaction = sell.toTx(minAmountOut);
  const transactionExtrinsic = transaction.get<SubmittableExtrinsic>();
  const { partialFee } = await transactionExtrinsic.paymentInfo(account);

  return {
    afterSlippage: minAmountOutHuman,
    transactionFee: partialFee.toHuman(),
  };
}

export async function getBuyInfo(buy: Trade, account: string) {
  const assetInDecimals = buy.swaps[0].assetInDecimals;

  const slippage = calculateSlippage(buy.amountIn);
  const maxAmountIn = buy.amountIn.plus(slippage);
  const maxAmountInHuman = formatAmount(maxAmountIn, assetInDecimals);

  const transaction = buy.toTx(maxAmountIn);
  const transactionExtrinsic = transaction.get<SubmittableExtrinsic>();
  const { partialFee } = await transactionExtrinsic.paymentInfo(account);

  return {
    afterSlippage: maxAmountInHuman,
    transactionFee: partialFee.toHuman(),
  };
}
