import { OhlcData, SingleValueData, UTCTimestamp } from 'lightweight-charts';

import { Asset } from '@galacticcouncil/sdk';
import { TradeData } from 'db';
import { ChartRange } from 'element/chart/types';

import { buildQuery } from './query';

export class TradeChartApi {
  private _grafanaUrl: string;
  private _grafanaDsn: number;

  public constructor(grafanaUrl: string, grafanaDsn: number) {
    this._grafanaUrl = grafanaUrl;
    this._grafanaDsn = grafanaDsn;
  }

  getTradeData(
    assetIn: Asset,
    assetOut: Asset,
    from: string,
    to: string,
    range: ChartRange,
    onSuccess: (assetIn: Asset, assetOut: Asset, price: TradeData) => void,
    onError: (error: any) => void,
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
            refId: 'buckets',
            rawSql: buildQuery(assetIn.id, assetOut.id, from, to, range),
            format: 'table',
            datasourceId: Number(this._grafanaDsn),
          },
        ],
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        const buckets = data.results.buckets.frames[0].data.values;
        const priceDS = this.formatPriceData(buckets);
        const priceOhlcDS = [];
        const volumeDS = this.formatVolumeData(buckets);
        onSuccess(assetIn, assetOut, {
          primary: priceDS,
          primaryOhlc: priceOhlcDS,
          secondary: volumeDS,
        });
      })
      .catch(function (res) {
        console.error(res.message);
        onError(res);
      });
  }

  private formatPriceData([ts, price, _volume]) {
    return ts.map((obj: number, index: number) => {
      return {
        time: Math.floor(obj / 1000) as UTCTimestamp,
        value: price[index],
      } as SingleValueData;
    });
  }

  private formatVolumeData([ts, _price, volume]) {
    return ts.map((obj: number, index: number) => {
      return {
        time: Math.floor(obj / 1000) as UTCTimestamp,
        value: volume[index],
      } as SingleValueData;
    });
  }

  private formatOhlcData([ts, _value, low, high, open, close]) {
    return ts.map((obj: number, index: number) => {
      return {
        time: Math.floor(obj / 1000) as UTCTimestamp,
        low: low[index],
        high: high[index],
        open: open[index],
        close: close[index],
      } as OhlcData;
    });
  }
}
