import type { EventRecord } from '@polkadot/types/interfaces/system';

export function infoRecord(events: EventRecord[]): EventRecord {
  return events.find(
    ({ event: { method, section } }) => section === 'system' && ['ExtrinsicFailed', 'ExtrinsicSuccess'].includes(method)
  );
}
