import { OhlcData, SingleValueData, UTCTimestamp } from 'lightweight-charts';

import { Asset } from '@galacticcouncil/sdk';
import { TradeData } from 'db';
import { ChartRange } from 'element/chart/types';

import { buildPriceQuery, buildVolumeQuery } from './query';

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
            refId: 'price',
            rawSql: buildPriceQuery(assetIn.id, assetOut.id, from, to, range),
            format: 'table',
            datasourceId: Number(this._grafanaDsn),
          },
          {
            refId: 'volume',
            rawSql: buildVolumeQuery(assetIn.id, assetOut.id, from, to, range),
            format: 'table',
            datasourceId: Number(this._grafanaDsn),
          },
        ],
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        const rawPrice = data.results.price.frames[0].data.values;
        const rawVolume = data.results.volume?.frames[0].data.values;
        const priceDS = this.formatData(rawPrice);
        const priceOhlcDS = this.formatOhlcData(rawPrice);
        const volumeDS = this.formatVolumeData(rawPrice, rawVolume);
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

  private formatData([ts, value]) {
    return ts.map((obj: number, index: number) => {
      return {
        time: Math.floor(obj / 1000) as UTCTimestamp,
        value: value[index],
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

  private formatVolumeData([_, _value, _low, _high, open, close], [ts, value]) {
    return ts.map((obj: number, index: number) => {
      return {
        time: Math.floor(obj / 1000) as UTCTimestamp,
        value: value[index],
        // OHLC color: open[index] > close[index] ? '#ef5350' : '#26a69a',
      } as unknown as OhlcData;
    });
  }
}
