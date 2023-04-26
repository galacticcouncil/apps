import { SingleValueData, UTCTimestamp } from 'lightweight-charts';

export const MINUTE_MS = 1 * 60;
export const HOUR_MS = MINUTE_MS * 60;
export const DAY_MS = HOUR_MS * 24;

export class Bucket {
  private _data: SingleValueData[];

  /**
   * Create a new @see Bucket representing time series data.
   * @param data - Array of datapoints.
   */
  public constructor(data: SingleValueData[]) {
    if (data && data.length > 0) {
      this._data = data;
    } else {
      this._data = [];
    }
  }

  public get data(): SingleValueData[] {
    return this._data;
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

  public withRange(from: number): this {
    const newDataset = this.data.filter((point: SingleValueData) => (point.time as number) > from);
    this._data = newDataset;
    return this;
  }

  public aggregate(
    granularity: number = HOUR_MS,
    aggregator: (bucketData: SingleValueData[], bucket: number) => SingleValueData = Bucket.maxAggregator,
    fillLastKnown: boolean = false
  ): this {
    const buckets = this.generateBuckets(granularity);
    const normalizedData: SingleValueData[] = [];
    let prevNonEmpty = this.first().value;
    buckets.forEach((bucket: number) => {
      const bucketData = this.data
        .filter((svd: SingleValueData) => (svd.time as number) > bucket - granularity && (svd.time as number) <= bucket)
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

  public static sumAggregator(data: SingleValueData[], bucket: number): SingleValueData {
    return data.reduce(
      (previous: SingleValueData, current: SingleValueData) => {
        return { time: bucket as UTCTimestamp, value: previous.value + current.value };
      },
      {
        time: bucket as UTCTimestamp,
        value: 0,
      }
    );
  }

  public static maxAggregator(data: SingleValueData[], _bucket: number): SingleValueData {
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

  private generateBucketsRecur(interval: number, buckets: number[], bucket: number) {
    const end = this.last().time as number;
    if (bucket > end) {
      return buckets;
    }
    const nextBuckets = buckets.concat(bucket);
    const nextBucket = bucket + interval;
    return this.generateBucketsRecur(interval, nextBuckets, nextBucket);
  }
}
