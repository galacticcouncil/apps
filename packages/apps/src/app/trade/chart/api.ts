import { SingleValueData, UTCTimestamp } from 'lightweight-charts';

import { Asset } from '@galacticcouncil/sdk';
import { TradeData } from 'db';

import { buildPriceQuery } from './query';

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
    endOfDay: string,
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
            rawSql: buildPriceQuery(assetIn.symbol, assetOut.symbol, endOfDay),
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
        onSuccess(assetIn, assetOut, {
          primary: formattedPrice,
          secondary: [],
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
}
