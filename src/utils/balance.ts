import { BigNumber } from '@galacticcouncil/sdk';

const ED_FACTOR = 0.5; // ED Factor 50%

export function calculateEffectiveBalance(
  free: string,
  asset: string,
  assetEd: string,
  txFeeAsset: string,
  txFee: string
) {
  if (asset == txFeeAsset) {
    const balance = new BigNumber(free);
    const fee = new BigNumber(txFee);
    const edFactor = new BigNumber(assetEd).multipliedBy(ED_FACTOR);
    const minDeposit = fee.plus(edFactor);
    if (balance.gt(minDeposit)) {
      return balance.minus(minDeposit).toFixed();
    } else {
      return balance.toFixed();
    }
  }
  return free;
}
