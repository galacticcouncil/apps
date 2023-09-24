import { LitElement } from 'lit';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import {
  HumanizeDurationLanguage,
  HumanizeDuration,
} from 'humanize-duration-ts';

export class BaseElement extends LitElement {
  protected _langService: HumanizeDurationLanguage = null;
  protected _humanizer: HumanizeDuration = null;
  protected _dayjs = null;

  constructor() {
    super();
    this._langService = new HumanizeDurationLanguage();
    this._langService.addLanguage('shortEn', {
      y: () => 'y',
      mo: () => 'mo',
      w: () => 'w',
      d: () => 'd',
      h: () => 'h',
      m: () => 'm',
      s: () => 's',
      ms: () => 'ms',
      decimal: '2',
    });
    this._humanizer = new HumanizeDuration(this._langService);
    this._dayjs = dayjs.extend(utc);
  }

  parseListArgs(list: string) {
    return list ? list.split(',') : [];
  }
}
