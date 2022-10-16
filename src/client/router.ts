import { BigNumber, bnum, Trade } from '@galacticcouncil/sdk';
import { SubmittableExtrinsic } from '@polkadot/api/promise/types';

function calculateSlippage(amount: BigNumber): BigNumber {
  const slippagePct = window.localStorage.getItem('trade.settings.slippage') || '0.5';
  const slippage = amount.div(bnum('100')).multipliedBy(slippagePct);
  return slippage.decimalPlaces(0, 1);
}

export async function calculateSpotPrice(assetInId: string, assetOutId: string) {
  const spotPrice = await this.db.state.router.getBestSpotPrice(assetInId, assetOutId);
  return spotPrice.amount.shiftedBy(-1 * spotPrice.decimals).toString();
}

export async function getSellInfo(sell: Trade, account: string) {
  const assetOutDecimals = sell.swaps[sell.swaps.length - 1].assetOutDecimals;

  const slippage = calculateSlippage(sell.amountOut);
  const minAmountOut = sell.amountOut.minus(slippage);
  const minAmountOutHuman = minAmountOut.shiftedBy(-1 * assetOutDecimals).toString();

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
  const maxAmountInHuman = maxAmountIn.shiftedBy(-1 * assetInDecimals).toString();

  const transaction = buy.toTx(maxAmountIn);
  const transactionExtrinsic = transaction.get<SubmittableExtrinsic>();
  const { partialFee } = await transactionExtrinsic.paymentInfo(account);

  return {
    afterSlippage: maxAmountInHuman,
    transactionFee: partialFee.toHuman(),
  };
}
