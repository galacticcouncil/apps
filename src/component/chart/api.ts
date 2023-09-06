import { SingleValueData, UTCTimestamp } from 'lightweight-charts';

import { TradeData } from '../../db';
import { buildPriceQuery, queryLbpPrice } from './query';
import { convertToHex } from '../../utils/account';

export class ChartApi {
  private _squidUrl: string;
  private _grafanaUrl: string;
  private _grafanaDsn: number;

  public constructor(squidUrl: string, grafanaUrl: string, grafanaDsn: number) {
    this._squidUrl = squidUrl;
    this._grafanaUrl = grafanaUrl;
    this._grafanaDsn = grafanaDsn;
  }

  getLbpData(poolId: string, onSuccess: (data: TradeData) => void, onError: (error: any) => void) {
    const account32 = convertToHex(poolId);
    console.log(poolId);
    console.log(account32);
    queryLbpPrice(this._squidUrl, account32)
      .then((data) => {
        const datapoints = data.historicalPoolPriceData.map(async (data) => {
          data.assetABalance;
          data.assetBBalance;

          return { time: '2018-03-28', value: 154 } as SingleValueData;
        });

        console.log(data);
        onSuccess({ price: [], volume: null });
      })
      .catch(function (res) {
        console.log(res);
        console.error(res.message);
        onError(res);
      });
  }

  getTradeData(
    assetIn: string,
    assetOut: string,
    endOfDay: string,
    onSuccess: (data: TradeData, assetIn: string, assetOut: string) => void,
    onError: (error: any) => void
  ) {
    fetch(this._grafanaUrl, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        queries: [
          {
            refId: 'price',
            rawSql: buildPriceQuery(assetIn, assetOut, endOfDay),
            format: 'table',
            datasourceId: Number(this._grafanaDsn),
          },
        ],
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        const rawPrice = data.results.price.frames[0].data.values;
        const formattedPrice = this.formatData(rawPrice);
        onSuccess({ price: formattedPrice, volume: null }, assetIn, assetOut);
      })
      .catch(function (res) {
        console.error(res.message);
        onError(res);
      });
  }

  private formatData([ts, value]) {
    return ts.map((obj: number, index: number) => {
      return {
        time: Math.floor(obj / 1000) as UTCTimestamp,
        value: value[index],
      } as SingleValueData;
    });
  }
}
