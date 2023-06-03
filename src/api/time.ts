import { chainCursor } from '../db';

export const SECOND_MS = 1000;
export const MINUTE_MS = SECOND_MS * 60;
export const HOUR_MS = MINUTE_MS * 60;
export const DAY_MS = HOUR_MS * 24;
export const WEEK_MS = DAY_MS * 7;
export const MONTH_MS = DAY_MS * 30;

export const INTERVAL = ['day', 'week', 'month'] as const;

const INTERVAL_MS: Record<Interval, number> = {
  day: DAY_MS,
  month: MONTH_MS,
  week: WEEK_MS,
};

export type Interval = (typeof INTERVAL)[number];

export async function getTimestamp(blockNumber?: number) {
  const api = chainCursor.deref().api;

  if (blockNumber != null) {
    const blockHash = await api.rpc.chain.getBlockHash(blockNumber);
    const apiAt = await api.at(blockHash);
    const now = await apiAt.query.timestamp.now();
    return now.toNumber();
  }

  const now = await api.query.timestamp.now();
  return now.toNumber();
}

export async function getBlockTime(blockNumberSub = 100000) {
  const api = chainCursor.deref().api;

  const now = await api.query.timestamp.now();

  const blockNumber = await api.query.system.number();
  const blockNumberAt = blockNumber.subn(blockNumberSub);
  const blockHashAt = await api.rpc.chain.getBlockHash(blockNumberAt);

  const apiAt = await api.at(blockHashAt);
  const apiAtTs = await apiAt.query.timestamp.now();
  const diff = now.sub(apiAtTs);
  return diff.divn(blockNumberSub).toNumber();
}

export async function toBlockNo(intervalMs: number) {
  const blockTime = await getBlockTime();
  const noOfBlocks = intervalMs / blockTime;
  return Math.floor(noOfBlocks);
}

export async function intervalAsBlockNo(interval: Interval) {
  const intervalMs = INTERVAL_MS[interval];
  return toBlockNo(intervalMs);
}