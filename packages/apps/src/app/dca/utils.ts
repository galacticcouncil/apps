import { MINUTE_MS } from 'utils/time';
import { INTERVAL_DCA_MS, IntervalDca } from './types';

export function getPeriod(multiplier: number, interval: IntervalDca) {
  const periodMsec = multiplier * INTERVAL_DCA_MS[interval];
  return periodMsec / MINUTE_MS;
}
