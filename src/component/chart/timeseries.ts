import { SingleValueData, UTCTimestamp } from 'lightweight-charts';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

export class Vector {
  private _data: SingleValueData[];

  /**
   * Create a new @see Vector representing time series data.
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

  public value(index: number): number | null {
    return this.data[index].value;
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

  public hourly(mode: string = 'last'): Vector {
    return this.convertToFrequency(mode, (curr: UTCTimestamp, last: UTCTimestamp) => {
      const currHour = dayjs.unix(curr).utc().hour();
      const lastHour = dayjs.unix(last).utc().hour();
      return currHour === (lastHour + 1) % 24;
    });
  }

  public daily(mode: string = 'last'): Vector {
    return this.convertToFrequency(mode, (curr: UTCTimestamp, last: UTCTimestamp) => {
      const currDay = dayjs.unix(curr).utc().day();
      const lastDay = dayjs.unix(last).utc().day();
      return currDay === (lastDay + 1) % 7;
    });
  }

  public weekly(mode: string = 'last'): Vector {
    return this.convertToFrequency(mode, (curr: UTCTimestamp, last: UTCTimestamp) => {
      const currDay = dayjs.unix(curr).utc().day();
      const currDate = dayjs.unix(curr).utc().date();
      const lastDay = dayjs.unix(last).utc().day();
      const lastDate = dayjs.unix(last).utc().date();
      return currDay == lastDay && currDate != lastDate;
    });
  }

  /**
   * For the mode of operation, the vector is split into chunks where each chunk starts when the converter returns true.
   * This operation starts from the last reference period of the vector and proceeds in descending order by time. Any chunk
   * that does not have the same size as the latest chunk will be removed.
   *
   * @param mode
   * @param converter
   * @returns
   */
  public convertToFrequency(mode: string, converter: (curr: UTCTimestamp, last: UTCTimestamp) => boolean): Vector {
    const split = Vector.frequencySplit(this, converter);
    const join = Vector.frequencyJoin(split, mode);
    return join;
  }

  private static frequencyJoin(split: Vector[], mode?: string): Vector {
    const modes: { [mode: string]: (vector: Vector) => SingleValueData } = {
      last: (vector: Vector) => {
        return vector.get(vector.length - 1);
      },
      sum: (vector: Vector) => {
        return Vector.newDatapoint(vector.get(vector.length - 1), vector.sum());
      },
      average: (vector: Vector) => {
        return Vector.newDatapoint(vector.get(vector.length - 1), vector.average());
      },
      max: (vector: Vector) => {
        return Vector.newDatapoint(vector.get(vector.length - 1), vector.max());
      },
      min: (vector: Vector) => {
        return Vector.newDatapoint(vector.get(vector.length - 1), vector.min());
      },
    };
    return new Vector(split.map((chunk) => modes[mode || 'last'](chunk)));
  }

  private static frequencySplit(
    vector: Vector,
    converter: (curr: UTCTimestamp, last: UTCTimestamp) => boolean
  ): Vector[] {
    let result = [];
    const data = vector.data.slice().reverse(); // Sort descending by time.

    let curr = data[0];
    let last = data[1];
    if (curr === undefined || last == undefined) {
      return [];
    }

    let next = [];

    for (let p = 0; p < data.length; p++) {
      last = data[p];
      const startNewChunk = converter(curr.time as UTCTimestamp, last.time as UTCTimestamp);
      if (startNewChunk) {
        result.push(new Vector(next.reverse()));
        next = [];
        curr = data[p];
      }
      next.push(data[p]);
    }

    if (next.length > 0) {
      result.push(new Vector(next.reverse()));
    }
    return result.reverse();
  }

  public static newDatapoint(point: SingleValueData, newValue: number): SingleValueData {
    return {
      time: point.time,
      value: newValue,
    } as SingleValueData;
  }
}
