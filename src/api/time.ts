import { chainCursor } from '../db';

export const SECOND_MS = 1000;
export const MINUTE_MS = SECOND_MS * 60;
export const HOUR_MS = MINUTE_MS * 60;
export const DAY_MS = HOUR_MS * 24;
export const WEEK_MS = DAY_MS * 7;
export const MONTH_MS = DAY_MS * 30;

export const INTERVAL = ['1h', '2h', '4h', '8h', '12h', '24h'] as const;

export const INTERVAL_MS: Record<Interval, number> = {
  '1h': HOUR_MS,
  '2h': HOUR_MS * 2,
  '4h': HOUR_MS * 4,
  '8h': HOUR_MS * 8,
  '12h': HOUR_MS * 12,
  '24h': HOUR_MS * 24,
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

export async function toBlockNo(msec: number) {
  const blockTime = await getBlockTime();
  const noOfBlocks = msec / blockTime;
  return Math.floor(noOfBlocks);
}

export async function toTimestamp(blockNumberAt: number) {
  const api = chainCursor.deref().api;

  const blockTime = await getBlockTime();
  const now = await api.query.timestamp.now();
  const blockNumberNow = await api.query.system.number();

  const diff = (blockNumberAt - blockNumberNow.toNumber()) * blockTime;
  return now.toNumber() + diff;
}