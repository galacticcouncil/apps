import { SingleValueData, UTCTimestamp } from 'lightweight-charts';

const MINUTE_MS = 1 * 60;
const HOUR_MS = MINUTE_MS * 60;
const DAY_MS = HOUR_MS * 24;
const WEEK_MS = DAY_MS * 7;
const MONTH_MS = WEEK_MS * 30;

const granularity2ms: Record<string, number> = {
  '1m': MINUTE_MS,
  '15m': MINUTE_MS * 15,
  '30m': MINUTE_MS * 30,
  '45m': MINUTE_MS * 45,
  '1h': HOUR_MS,
  '1d': DAY_MS,
  '1w': WEEK_MS,
  '30d': MONTH_MS,
};

export class Bucket {
  private _data: SingleValueData[];
  private _start: number;
  private _end: number;

  /**
   * Create a new @see Bucket representing time series data.
   * @param data - Array of datapoints.
   */
  public constructor(data: SingleValueData[]) {
    if (data && data.length > 0) {
      this._data = data;
      this._start = this.first().time as number;
      this._end = this.last().time as number;
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

  public values(): number[] {
    return this.data.map((svd: SingleValueData) => svd.value);
  }

  public sum(): number {
    return this.values().reduce((acc, cur) => acc + cur, 0);
  }

  public average(): number | null {
    return this.length > 0 ? this.sum() / this.length : null;
  }

  public max(): number {
    return Math.max(...this.values());
  }

  public min(): number {
    return Math.min(...this.values());
  }

  public static lastAggregator = (chunk: SingleValueData[]) => chunk[chunk.length - 1]?.value || 0;
  public static minAggregator = (chunk: SingleValueData[]) => Math.min(...chunk.map((c) => c.value));
  public static maxAggregator = (chunk: SingleValueData[]) => Math.max(...chunk.map((c) => c.value));
  public static sumAggregator = (chunk: SingleValueData[]) => chunk.map((c) => c.value).reduce((a, b) => a + b, 0);

  public convertToFrequency(granularity: string, aggregator: (chunk: SingleValueData[]) => number) {
    const buckets = this.generateBuckets(granularity);
    const normalizedData: SingleValueData[] = [];
    let prevBucket = 0;
    buckets.forEach((bucket: number) => {
      const nextChunk = this.data.filter((svd: SingleValueData) => svd.time > prevBucket && svd.time <= bucket);
      const value = aggregator(nextChunk);
      normalizedData.push({
        time: bucket as UTCTimestamp,
        value: value,
      } as SingleValueData);
      prevBucket = bucket;
    });
    return normalizedData;
  }

  public static fixEmptyBuckets(data: SingleValueData[], currentValue: number) {
    const reversed: SingleValueData[] = data.reverse();
    let lastVal = currentValue;
    reversed.map((svd: SingleValueData) => {
      if (svd.value == 0) {
        svd.value = lastVal;
      } else {
        lastVal = svd.value;
      }
      return svd;
    });
    return reversed.reverse();
  }

  private generateEntryBucket(interval: number): number {
    return Math.floor(this._start / interval) * interval;
  }

  private generateBuckets(granularity: string) {
    const interval = granularity2ms[granularity];
    const buckets: number[] = [];
    const bucket: number = this.generateEntryBucket(interval);
    return this.generateBucketsRecur(interval, buckets, bucket);
  }

  private generateBucketsRecur(interval: number, buckets: number[], bucket: number) {
    if (bucket > this._end) {
      return buckets;
    }
    const nextBuckets = buckets.concat(bucket);
    const nextBucket = bucket + interval;
    return this.generateBucketsRecur(interval, nextBuckets, nextBucket);
  }
}
