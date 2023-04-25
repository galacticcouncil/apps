import { SingleValueData, WhitespaceData, UTCTimestamp } from 'lightweight-charts';

const MINUTE_MS = 1 * 60;
const HOUR_MS = MINUTE_MS * 60;

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
    this._from = from;
    return this;
  }

  public withGaps(fillLastKnown?: boolean): this {
    const buckets = this.generateBuckets(HOUR_MS);
    const normalizedData: SingleValueData[] = [];
    let prevNonEmpty = this.first().value;
    buckets.forEach((bucket: number) => {
      const next = this.data.filter((svd: SingleValueData) => svd.time == bucket)[0];
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

  public fixWhitespace(): (SingleValueData | WhitespaceData)[] {
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
