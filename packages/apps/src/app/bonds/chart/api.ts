import { Asset } from '@galacticcouncil/sdk';
import { ApiPromise } from '@polkadot/api';

import { convertToHex } from 'utils/account';

import {
  HistoricalPrice,
  LbpPoolData,
  LbpPool,
  queryPool,
  queryPoolFirstBlock,
  queryPoolLastBlock,
  queryPoolPrice,
  queryPools,
} from './query';
import {
  getBlockPrice,
  getMissingBlocks,
  getMissingIndexes,
  getPoolMaturity,
} from './utils';
import { HistoricalBalance } from './types';

export class BondsChartApi {
  private _api: ApiPromise;
  private _squidUrl: string;

  public constructor(api: ApiPromise, squidUrl: string) {
    this._api = api;
    this._squidUrl = squidUrl;
  }

  async getPoolData(poolId: string): Promise<LbpPoolData> {
    const account32 = convertToHex(poolId);
    const lbpPoolData = await this._api.query.lbp.poolData(poolId);
    if (lbpPoolData.isSome) {
      const { start, end, initialWeight, finalWeight } = lbpPoolData.unwrap();
      return {
        id: account32,
        startBlockNumber: Number(start.toString()),
        endBlockNumber: Number(end.toString()),
        initialWeight: initialWeight.toNumber(),
        finalWeight: finalWeight.toNumber(),
      } as LbpPoolData;
    }

    const pools = await queryPool(this._squidUrl, account32);
    const poolData = pools.lbpPool;
    return poolData;
  }

  async getPoolPair(assetIn: string, assetOut: string): Promise<LbpPool> {
    const poolsMatrix = await Promise.all([
      await queryPools(this._squidUrl, assetIn, assetOut),
      await queryPools(this._squidUrl, assetOut, assetIn),
    ]);

    const pools = poolsMatrix.find((pools) => pools.length > 0);

    return pools && pools[0];
  }

  async getPoolPrices(
    pool: LbpPoolData,
    assetIn: Asset,
    assetOut: Asset,
    fromBlock: HistoricalPrice,
    toBlock: HistoricalPrice,
    onSuccess: (
      assetIn: Asset,
      assetOut: Asset,
      balance: HistoricalBalance,
    ) => void,
    onError: (error: any) => void,
  ) {
    const maturity = getPoolMaturity(pool, toBlock);
    const indexes = getMissingIndexes(
      fromBlock.paraChainBlockHeight,
      toBlock.paraChainBlockHeight,
      pool.id,
      maturity,
    );
    queryPoolPrice(indexes).then(({ lbpPools }) => {
      const lastBlock = lbpPools[0];

      const datapoints: [number, number][] = lbpPools.nodes.map(
        ({ relayChainBlockHeight, lbpPoolAssetsDataByPoolId }) => {
          const [balanceA, balanceB] = lbpPoolAssetsDataByPoolId.nodes;
          const price = {
            relayChainBlockHeight,
            assetABalance: balanceB.balances.free,
            assetBBalance: balanceA.balances.free,
          };
          return getBlockPrice(assetIn, assetOut, price, pool);
        },
      );

      const historicalBalance = {
        dataset: datapoints.reverse(),
        lastBlock: lastBlock,
      } as HistoricalBalance;
      onSuccess(assetIn, assetOut, historicalBalance);
    });
  }

  getPoolPredictionPrices(
    pool: LbpPoolData,
    assetIn: Asset,
    assetOut: Asset,
    lastKnownBlock: HistoricalPrice,
  ) {
    const maturity = 1 - getPoolMaturity(pool, lastKnownBlock);
    return getMissingBlocks(
      lastKnownBlock.relayChainBlockHeight,
      pool.endBlockNumber,
      maturity,
    ).map((block) => {
      return getBlockPrice(
        assetIn,
        assetOut,
        { ...lastKnownBlock, relayChainBlockHeight: block },
        pool,
      );
    });
  }

  async getFirstBlock(
    poolId: string,
    blockHeight: number,
  ): Promise<HistoricalPrice> {
    const account32 = convertToHex(poolId);
    const res = await queryPoolFirstBlock(
      this._squidUrl,
      account32,
      blockHeight,
    ).then();
    return res.lbpPoolHistoricalData.nodes[0];
  }

  async getLastBlock(
    poolId: string,
    blockHeight: number,
  ): Promise<HistoricalPrice> {
    const account32 = convertToHex(poolId);
    const res = await queryPoolLastBlock(
      this._squidUrl,
      account32,
      blockHeight,
    );
    return res.lbpPoolHistoricalData.nodes[0];
  }
}
