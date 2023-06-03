import type { RegistryError } from '@polkadot/types/types';
import { BN, hexToU8a } from '@polkadot/util';

import { queryScheduled, queryStatus } from './query';
import { Account, chainCursor } from '../../../db';
import { convertToHex } from '../../../utils/account';

import { DcaPosition, DcaStatus } from './types';

const ep = 'https://hydradx-rococo-explorer.play.hydration.cloud/graphql';

export async function getScheduled(account: Account): Promise<DcaPosition[]> {
  const who = convertToHex(account.address);
  const scheduled = await queryScheduled(ep, who);

  const scheduledStatus = await getStatus(account);

  return scheduled.events
    .map((event) => {
      const id = event.args.id;
      const start = event.call.args.startExecutionBlock;
      const { order, period, totalAmount } = event.call.args.schedule;

      return {
        id: id,
        assetIn: order.assetIn.toString(),
        assetOut: order.assetOut.toString(),
        start: start,
        interval: period,
        amount: order.amountIn,
        status: scheduledStatus.get(id),
        transactions: [],
      } as DcaPosition;
    })
    .sort((a, b) => {
      if (a.start > b.start) return -1;
      if (a.start < b.start) return 1;
      return 0;
    });
}

export async function getStatus(account: Account): Promise<Map<number, DcaStatus>> {
  const who = convertToHex(account.address);
  const status = await queryStatus(ep, who);

  const statuses: Map<number, DcaStatus> = new Map([]);
  status.events.map((event) => {
    const type = event.name.replace('DCA.', '');
    let err: string;
    let desc: string;
    const { error, id } = event.args;
    if (error) {
      const decoded: RegistryError = decodeError(error);
      err = decoded.method;
      desc = decoded.docs.join(' ');
    }
    statuses.set(id, { type, err, desc } as DcaStatus);
  });
  return statuses;
}

function decodeError(error: any): RegistryError {
  const api = chainCursor.deref().api;
  const errorU8a = hexToU8a(error.value.error);
  const indexBN = new BN(error.value.index);
  return api.registry.findMetaError({ error: errorU8a, index: indexBN });
}
