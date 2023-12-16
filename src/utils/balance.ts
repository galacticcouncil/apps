import { BigNumber } from '@galacticcouncil/sdk';

const ED_FACTOR = 0.5; // ED Factor 50%

export function calculateEffectiveBalance(
  free: BigNumber,
  asset: string,
  fee: BigNumber,
  feeAsset: string,
  feeAssetEd: BigNumber,
): BigNumber {
  if (asset == feeAsset) {
    const edFactor = feeAssetEd.multipliedBy(ED_FACTOR);
    const min = fee.plus(edFactor);
    if (free.gt(min)) {
      return free.minus(min);
    } else {
      return free;
    }
  }
  return free;
}
