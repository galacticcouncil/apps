import {
  AssetMetadata,
  LbpMath,
  ONE,
  PoolAsset,
  TradeType,
  bnum,
  scale,
} from '@galacticcouncil/sdk';
import { ApiPromise } from '@polkadot/api';
import {
  LbpPoolData,
  queryPool,
  queryPoolFirstBlock,
  queryPoolLastBlock,
  queryPoolPrice,
} from './query';
import { getMissingIndexes } from './utils';
import { convertToHex } from '../../../utils/account';

export class LbpChartApi {
  private readonly MAX_FINAL_WEIGHT = scale(bnum(100), 6);
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
    fromBlock: number,
    toBlock: number,
    onSuccess: (prices: [number, number][]) => void,
    onError: (error: any) => void,
  ) {
    const { id, startBlockNumber, endBlockNumber, initialWeight, finalWeight } =
      pool;
    const indexes = getMissingIndexes(fromBlock, toBlock, id);
    queryPoolPrice(this._squidUrl, indexes).then((data) => {
      const datapoints: [number, number][] = data.historicalPoolPriceData.map(
        ({ pool, relayChainBlockHeight }) => {
          const linearWeight = LbpMath.calculateLinearWeights(
            startBlockNumber.toString(),
            endBlockNumber.toString(),
            initialWeight.toString(),
            finalWeight.toString(),
            relayChainBlockHeight.toString(),
          );

          const assetAWeight = bnum(linearWeight);
          const assetBWeight = this.MAX_FINAL_WEIGHT.minus(bnum(assetAWeight));

          const { assetAId, assetABalance, assetBBalance } = pool;
          const accumulatedIn = assetAId.toString() === assetIn.id;

          if (tradeType === TradeType.Buy) {
            const price = LbpMath.getSpotPrice(
              accumulatedIn ? assetBBalance : assetABalance,
              accumulatedIn ? assetABalance : assetBBalance,
              accumulatedIn ? assetBWeight.toString() : assetAWeight.toString(),
              accumulatedIn ? assetAWeight.toString() : assetBWeight.toString(),
              scale(ONE, assetOutMeta.decimals).toString(),
            );
            const priceHuman = bnum(price)
              .shiftedBy(-1 * assetInMeta.decimals)
              .toNumber();
            return [relayChainBlockHeight, priceHuman];
          } else {
            const price = LbpMath.getSpotPrice(
              accumulatedIn ? assetABalance : assetBBalance,
              accumulatedIn ? assetBBalance : assetABalance,
              accumulatedIn ? assetAWeight.toString() : assetBWeight.toString(),
              accumulatedIn ? assetBWeight.toString() : assetAWeight.toString(),
              scale(ONE, assetInMeta.decimals).toString(),
            );
            const priceHuman = bnum(price)
              .shiftedBy(-1 * assetOutMeta.decimals)
              .toNumber();
            return [relayChainBlockHeight, priceHuman];
          }
        },
      );
      onSuccess(datapoints.reverse());
    });
  }

  async getFirstBlock(poolId: string, blockHeight: number) {
    const account32 = convertToHex(poolId);
    const res = await queryPoolFirstBlock(
      this._squidUrl,
      account32,
      blockHeight,
    );
    return res.historicalPoolPriceData[0].paraChainBlockHeight;
  }

  async getLastBlock(poolId: string, blockHeight: number) {
    const account32 = convertToHex(poolId);
    const res = await queryPoolLastBlock(
      this._squidUrl,
      account32,
      blockHeight,
    );
    return res.historicalPoolPriceData[0].paraChainBlockHeight;
  }
}
