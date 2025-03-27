import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

import {
  HumanizeDurationLanguage,
  HumanizeDuration,
} from 'humanize-duration-ts';

export abstract class BaseElement extends LitElement {
  @property({ attribute: false }) atokens: Map<string, string> = new Map([]);

  protected _langService: HumanizeDurationLanguage = null;
  protected _humanizer: HumanizeDuration = null;
  protected _dayjs = null;

  constructor() {
    super();
    dayjs.extend(utc);
    dayjs.extend(timezone);
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
    this._dayjs = dayjs;
  }

  parseAsList(args: string) {
    return args ? args.split(',') : [];
  }

  parseAsSet(args: string) {
    if (args) {
      const list = this.parseAsList(args);
      return new Set<string>(list);
    }
    return new Set<string>();
  }

  parseJson<T>(json: string): T {
    try {
      return JSON.parse(json) as T;
    } catch {
      return null;
    }
  }
}
