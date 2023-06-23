import { SingleValueData, UTCTimestamp } from 'lightweight-charts';

import { TradeData } from '../../db';
import { buildPriceQuery, buildVolumeQuery } from './query';

export class ChartApi {
  private _grafanaUrl: string;
  private _grafanaDsn: number;

  public constructor(grafanaUrl: string, grafanaDsn: number) {
    this._grafanaUrl = grafanaUrl;
    this._grafanaDsn = grafanaDsn;
  }

  getTradeData(
    assetIn: string,
    assetOut: string,
    endOfDay: string,
    onSuccess: (data: TradeData) => void,
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
            datasourceId: this._grafanaDsn,
          },
          /* {
            refId: 'volume',
            rawSql: buildVolumeQuery(assetIn, assetOut, endOfDay),
            format: 'table',
            datasourceId: datasourceId,
          }, */
        ],
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        const rawPrice = data.results.price.frames[0].data.values;
        const formattedPrice = this.formatData(rawPrice);
        // const rawVolume = data.results.volume?.frames[0].data.values;
        // const formattedVolume = formatData(rawVolume);
        onSuccess({ price: formattedPrice, volume: null });
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
