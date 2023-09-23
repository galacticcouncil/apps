import { AssetMetadata, PoolAsset, TradeType } from '@galacticcouncil/sdk';
import { ApiPromise } from '@polkadot/api';
import {
  HistoricalPrice,
  LbpPoolData,
  queryPool,
  queryPoolFirstBlock,
  queryPoolLastBlock,
  queryPoolPrice,
} from './query';
import {
  getBlockPrice,
  getMissingBlocks,
  getMissingIndexes,
  getPoolMaturity,
} from './utils';
import { convertToHex } from '../../../utils/account';
import { HistoricalBalance } from './types';

export class LbpChartApi {
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
    const [poolData] = pools.lbpPoolData;
    return poolData;
  }

  async getPoolPrices(
    pool: LbpPoolData,
    tradeType: TradeType,
    assetIn: PoolAsset,
    assetInMeta: AssetMetadata,
    assetOutMeta: AssetMetadata,
    fromBlock: HistoricalPrice,
    toBlock: HistoricalPrice,
    onSuccess: (balance: HistoricalBalance) => void,
    onError: (error: any) => void,
  ) {
    const maturity = getPoolMaturity(pool, toBlock);
    const indexes = getMissingIndexes(
      fromBlock.paraChainBlockHeight,
      toBlock.paraChainBlockHeight,
      pool.id,
      maturity,
    );
    queryPoolPrice(this._squidUrl, indexes).then(
      ({ historicalPoolPriceData }) => {
        const lastBlock = historicalPoolPriceData[0];
        const datapoints: [number, number][] = historicalPoolPriceData.map(
          (price) => {
            return getBlockPrice(
              assetIn,
              assetInMeta,
              assetOutMeta,
              price,
              pool,
              tradeType,
            );
          },
        );
        const historicalBalance = {
          dataset: datapoints.reverse(),
          lastBlock: lastBlock,
        } as HistoricalBalance;
        onSuccess(historicalBalance);
      },
    );
  }

  getPoolPredictionPrices(
    pool: LbpPoolData,
    tradeType: TradeType,
    assetIn: PoolAsset,
    assetInMeta: AssetMetadata,
    assetOutMeta: AssetMetadata,
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
        assetInMeta,
        assetOutMeta,
        { ...lastKnownBlock, relayChainBlockHeight: block },
        pool,
        tradeType,
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
    return res.historicalPoolPriceData[0];
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
    return res.historicalPoolPriceData[0];
  }
}
