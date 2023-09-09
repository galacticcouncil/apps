export const keepRecords = 50;

export const getMissingIndexes = (startBlock: number, endBlock: number, poolId: string): string[] => {
  const missingIndexes = [];
  const missingBlocksAmount = endBlock - startBlock;
  const divisionMultiplier = missingBlocksAmount < keepRecords ? 1 : Math.floor(missingBlocksAmount / keepRecords);

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
