import { Asset, LbpMath, ONE, bnum, scale } from '@galacticcouncil/sdk';
import { HistoricalPrice, LbpPoolData } from './query';

const KEEP_RECORD = 50;
const MAX_FINAL_WEIGHT = scale(bnum(100), 6);

export const getPoolMaturity = (pool: LbpPoolData, price: HistoricalPrice) => {
  const { relayChainBlockHeight } = price;
  const { startBlockNumber, endBlockNumber } = pool;

  return (
    (relayChainBlockHeight - startBlockNumber) /
    (endBlockNumber - startBlockNumber)
  );
};

export const getBlockPrice = (
  assetIn: Asset,
  assetOut: Asset,
  historicalPrice: HistoricalPrice,
  pool: LbpPoolData,
): [number, number] => {
  const { relayChainBlockHeight } = historicalPrice;
  const { assetABalance, assetBBalance } = historicalPrice;
  const { startBlockNumber, endBlockNumber, initialWeight, finalWeight } = pool;
  const linearWeight = LbpMath.calculateLinearWeights(
    startBlockNumber.toString(),
    endBlockNumber.toString(),
    initialWeight.toString(),
    finalWeight.toString(),
    relayChainBlockHeight.toString(),
  );

  const assetAWeight = bnum(linearWeight);
  const assetBWeight = MAX_FINAL_WEIGHT.minus(bnum(assetAWeight));

  const price = LbpMath.getSpotPrice(
    assetBBalance,
    assetABalance,
    assetBWeight.toString(),
    assetAWeight.toString(),
    scale(ONE, assetOut.decimals).toString(),
  );
  const priceHuman = bnum(price)
    .shiftedBy(-1 * assetIn.decimals)
    .toNumber();
  return [relayChainBlockHeight, priceHuman];
};

export const getMissingIndexes = (
  startBlock: number,
  endBlock: number,
  poolId: string,
  poolMaturity: number,
): string[] => {
  const keepRecord = Math.round(poolMaturity * KEEP_RECORD);
  const missingIndexes = [];
  const missingBlocksAmount = endBlock - startBlock;
  const divisionMultiplier =
    missingBlocksAmount < keepRecord
      ? 1
      : Math.floor(missingBlocksAmount / keepRecord);

  for (let i = startBlock; i < endBlock; i++) {
    if (
      i % divisionMultiplier === 0 ||
      (i === startBlock && i % divisionMultiplier !== 0) ||
      (i === endBlock && i % divisionMultiplier !== 0)
    ) {
      missingIndexes.push(poolId + '-' + i);
    }
  }

  return missingIndexes;
};

export const getMissingBlocks = (
  startBlock: number,
  endBlock: number,
  poolMaturity: number,
): number[] => {
  const keepRecord = Math.round(poolMaturity * KEEP_RECORD);
  const missingBlocksAmount = endBlock - startBlock;
  const divisionMultiplier =
    missingBlocksAmount < keepRecord
      ? 1
      : Math.floor(missingBlocksAmount / keepRecord);

  const missingBlocks: number[] = [];

  for (let i = startBlock; i < endBlock; i++) {
    if (
      i % divisionMultiplier === 0 ||
      i === startBlock ||
      i === endBlock - 1
    ) {
      missingBlocks.push(i);
    }
  }

  return missingBlocks;
};
