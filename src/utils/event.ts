import type { EventRecord, Event } from '@polkadot/types/interfaces/system';

export function txRecord(events: EventRecord[]): EventRecord {
  return events.find(
    ({ event: { method, section } }) => section === 'system' && ['ExtrinsicFailed', 'ExtrinsicSuccess'].includes(method)
  );
}

export function xcmpRecord(events: EventRecord[]): EventRecord {
  return events.find(({ event: { section } }) => section === 'xcmpQueue');
}

export function messageHash(event: Event): string {
  return event.data.toHuman()['messageHash'];
}