import {
  AssetMetadata,
  LbpMath,
  ONE,
  PoolAsset,
  TradeType,
  bnum,
  scale,
} from '@galacticcouncil/sdk';
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
  assetIn: PoolAsset,
  assetInMeta: AssetMetadata,
  assetOutMeta: AssetMetadata,
  historicalPrice: HistoricalPrice,
  pool: LbpPoolData,
  tradeType: TradeType,
): [number, number] => {
  const { relayChainBlockHeight } = historicalPrice;
  const { assetAId, assetABalance, assetBBalance } = historicalPrice.pool;
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

  const isAccumulatedIn = assetAId.toString() === assetIn.id;
  const balanceA = isAccumulatedIn ? assetABalance : assetBBalance;
  const balanceB = isAccumulatedIn ? assetBBalance : assetABalance;
  const weightA = isAccumulatedIn ? assetAWeight : assetBWeight;
  const weightB = isAccumulatedIn ? assetBWeight : assetAWeight;

  if (tradeType === TradeType.Buy) {
    const price = LbpMath.getSpotPrice(
      balanceB,
      balanceA,
      weightB.toString(),
      weightA.toString(),
      scale(ONE, assetOutMeta.decimals).toString(),
    );
    const priceHuman = bnum(price)
      .shiftedBy(-1 * assetInMeta.decimals)
      .toNumber();
    return [relayChainBlockHeight, priceHuman];
  } else {
    const price = LbpMath.getSpotPrice(
      balanceA,
      balanceB,
      weightA.toString(),
      weightB.toString(),
      scale(ONE, assetInMeta.decimals).toString(),
    );
    const priceHuman = bnum(price)
      .shiftedBy(-1 * assetOutMeta.decimals)
      .toNumber();
    return [relayChainBlockHeight, priceHuman];
  }
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
