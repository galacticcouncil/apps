import {
  SingleValueData,
  UTCTimestamp,
  WhitespaceData,
} from 'lightweight-charts';

import { HOUR_MS } from 'utils/time';

export class Bucket {
  private _data: SingleValueData[];
  private _first: SingleValueData;
  private _from: number;

  /**
   * Create a new @see Bucket representing time series data.
   * @param data - Array of datapoints.
   */
  public constructor(data: SingleValueData[]) {
    if (data && data.length > 0) {
      this._data = data;
      this._first = this.first();
      this._from = this.first().time as number;
    } else {
      this._data = [];
    }
  }

  public get data(): SingleValueData[] {
    return this._data;
  }

  /**
   * Generate empty whitespace buckets if no data exist for given period
   * to assure that chart is not spread across entire canvas but keep the
   * given range.
   *
   * @returns chart data with whitespaces if period unknown
   */
  public get dataWithWhitespace(): (SingleValueData | WhitespaceData)[] {
    const firstAsNum = this._first.time as number;
    if (firstAsNum < this._from) {
      return this._data;
    }

    const whiteSpace: (SingleValueData | WhitespaceData)[] = [];

    let curr: number = this.first().time as number;
    while (this._from + HOUR_MS < curr) {
      whiteSpace.unshift({ time: (curr - HOUR_MS) as UTCTimestamp });
      curr = whiteSpace[0].time as number;
    }
    return whiteSpace.concat(this._data);
  }

  public get length(): number {
    return this.data.length;
  }

  public get(index: number): SingleValueData {
    return this.data[index];
  }

  public first(): SingleValueData {
    return this.data[0];
  }

  public last(): SingleValueData {
    return this.data[this.length - 1];
  }

  public value(index: number): number {
    return this.data[index].value;
  }

  public time(index: number): number {
    return this.data[index].time as number;
  }

  public push(value: SingleValueData): number {
    return this.data.push(value);
  }

  public unshift(value: SingleValueData): number {
    return this.data.unshift(value);
  }

  public values(): number[] {
    return this.data.map((svd: SingleValueData) => svd.value);
  }

  public sum(): number {
    return this.values().reduce((acc, cur) => acc + cur, 0);
  }

  public avg(): number {
    return this.length > 0 ? this.sum() / this.length : 0;
  }

  public max(): number {
    return Math.max(...this.values());
  }

  public min(): number {
    return Math.min(...this.values());
  }

  /**
   * Filter range of given buckets
   *
   * @param from - milestone from which we want to display the data
   * @returns filtered chart data
   */
  public withRange(from: number): this {
    const newDataset = this.data.filter(
      (point: SingleValueData) => (point.time as number) > from,
    );
    this._data = newDataset;
    this._from = from;
    return this;
  }

  /**
   * Aggregate raw chart data to buckets based on given granularity.
   *
   * @param granularity - granularity in ms
   * @param aggregator - bucket aggregator fn
   * @param fillLastKnown - if true fill the bucket with last known value if empty, otherwise use zero
   * @returns chart data aggregated in custom buckets
   */
  public aggregate(
    granularity: number = HOUR_MS,
    aggregator: (
      bucketData: SingleValueData[],
      bucket: number,
    ) => SingleValueData = Bucket.maxAggregator,
    fillLastKnown: boolean = false,
  ): this {
    const buckets = this.generateBuckets(granularity);
    const normalizedData: SingleValueData[] = [];
    let prevNonEmpty = this.first().value;
    buckets.forEach((bucket: number) => {
      const bucketData = this.data
        .filter(
          (svd: SingleValueData) =>
            (svd.time as number) > bucket - granularity &&
            (svd.time as number) <= bucket,
        )
        .sort((a, b) => a.value - b.value);

      const next = aggregator(bucketData, bucket);
      let nextValue: number;

      if (next) {
        nextValue = next.value;
        prevNonEmpty = next.value;
      } else if (fillLastKnown) {
        nextValue = prevNonEmpty;
      } else {
        nextValue = 0;
      }

      normalizedData.push({
        time: bucket as UTCTimestamp,
        value: nextValue,
      } as SingleValueData);
    });
    this._data = normalizedData;
    return this;
  }

  public static sumAggregator(
    data: SingleValueData[],
    bucket: number,
  ): SingleValueData {
    return data.reduce(
      (previous: SingleValueData, current: SingleValueData) => {
        return {
          time: bucket as UTCTimestamp,
          value: previous.value + current.value,
        };
      },
      {
        time: bucket as UTCTimestamp,
        value: 0,
      },
    );
  }

  public static maxAggregator(
    data: SingleValueData[],
    _bucket: number,
  ): SingleValueData {
    return data.pop();
  }

  private generateEntryBucket(interval: number): number {
    const start = this.first().time as number;
    return Math.floor(start / interval) * interval;
  }

  private generateBuckets(interval: number) {
    const buckets: number[] = [];
    const bucket: number = this.generateEntryBucket(interval);
    return this.generateBucketsRecur(interval, buckets, bucket);
  }

  private generateBucketsRecur(
    interval: number,
    buckets: number[],
    bucket: number,
  ) {
    const end = this.last().time as number;
    if (bucket > end) {
      return buckets;
    }
    const nextBuckets = buckets.concat(bucket);
    const nextBucket = bucket + interval;
    return this.generateBucketsRecur(interval, nextBuckets, nextBucket);
  }
}
