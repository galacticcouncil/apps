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
        const bucketsNorm = this.filterOutliers(buckets, 3.5);
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
   * Effect of changing the iqr (interquartile range) multiplier:
   *
   * [1.5] Standard threshold — flags typical outliers (used in box plots, common in stats)
   * [2.0–3.0] More tolerant — only filters values that are more obviously extreme
   * [3.5] Very loose — almost nothing gets filtered out unless it's way outside the norm
   *
   * @param originDs - original bucket frames
   * @param iqrMultiplies - iqr multiplier (default to 1.5)
   * @returns buckets without outliers
   */
  private filterOutliers(originDs: any, iqrMultiplies = 1.5) {
    const [ts, price, volume] = originDs;
    const priceCp = price.slice().sort((a: number, b: number) => a - b);

    const quantile = (arr: number[], q: number) => {
      const pos = (arr.length - 1) * q;
      const base = Math.floor(pos);
      const rest = pos - base;
      if (arr[base + 1] !== undefined) {
        return arr[base] + rest * (arr[base + 1] - arr[base]);
      } else {
        return arr[base];
      }
    };

    const q1 = quantile(priceCp, 0.25);
    const q3 = quantile(priceCp, 0.75);
    const iqr = q3 - q1;

    const maxValue = q3 + iqr * iqrMultiplies;
    const minValue = q1 - iqr * iqrMultiplies;

    //console.log('Q1:', q1, 'Q3:', q3, 'Min:', minValue, 'Max:', maxValue);

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
