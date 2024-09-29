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
            rawSql: buildQuery(assetIn, assetOut, from, to, range),
            format: 'table',
            datasourceId: Number(this._grafanaDsn),
          },
        ],
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        const buckets = data.results.buckets.frames[0].data.values;
        const bucketsNorm = this.filterOutliers(buckets);
        const priceDS = this.formatPriceData(bucketsNorm);
        const priceOhlcDS = [];
        const volumeDS = this.formatVolumeData(bucketsNorm);
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

  /**
   * Filter outliers from dataset
   *
   * @param originDs - original bucket frames
   * @param range - selected range
   * @returns buckets without outliers
   */
  private filterOutliers(originDs: any) {
    const [ts, price, volume] = originDs;
    const priceCp = price.concat();
    priceCp.sort((a: number, b: number) => a - b);

    /*
     * Find a generous IQR. This is generous because if (values.length / 4)
     * is not an int, then average the two elements on either
     * side to find q1 is a must. Likewise for q3.
     */
    const q1 = priceCp[Math.floor(priceCp.length / 4)];
    const q3 = priceCp[Math.ceil(priceCp.length * (3 / 4))];
    const iqr = q3 - q1;

    const maxValue = q3 + iqr * 1.5;
    const minValue = q1 - iqr * 1.5;

    const outlierCheckFn = (x: number) => x > maxValue || x < minValue;
    const outliers = price
      .map((p: number, i: number) => ({ p, i }))
      .filter((o: any) => outlierCheckFn(o.p));

    if (outliers.length === 0) {
      return originDs;
    } else {
      console.log('Filtering outliers ' + outliers.length);
    }

    const outliersIndexes = new Set(outliers.map((o: any) => o.i));
    return [
      ts.filter((_: any, i: number) => !outliersIndexes.has(i)),
      price.filter((_: any, i: number) => !outliersIndexes.has(i)),
      volume.filter((_: any, i: number) => !outliersIndexes.has(i)),
    ];
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
