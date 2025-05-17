import { BigNumber } from '@galacticcouncil/sdk';
import { ApiPromise } from '@polkadot/api';

import { BLOCK_TIME_RELAY_CHAIN } from 'utils/time';

export class TimeApi {
  private _api: ApiPromise;

  public constructor(api: ApiPromise) {
    this._api = api;
  }

  async getRelayBlockHeight(): Promise<number> {
    const validationData =
      await this._api.query.parachainSystem.validationData();
    const { relayParentNumber } = validationData.unwrap();
    return relayParentNumber.toNumber();
  }

  async getBlockTimestamp(blockNumber?: number): Promise<number> {
    if (blockNumber != null) {
      const blockHash = await this._api.rpc.chain.getBlockHash(blockNumber);
      const apiAt = await this._api.at(blockHash);
      const now = await apiAt.query.timestamp.now();
      return now.toNumber();
    }
    const now = await this._api.query.timestamp.now();
    return now.toNumber();
  }

  async getBlockTime(): Promise<number> {
    const time = this._api.consts.aura.slotDuration;
    return time.toNumber();
  }

  async getBlockTimeV1(blockNumberSub = 100000): Promise<number> {
    const [now, block] = await Promise.all([
      await this._api.query.timestamp.now(),
      await this._api.query.system.number(),
    ]);

    const blockNumberAt = block.subn(blockNumberSub);
    const blockHashAt = await this._api.rpc.chain.getBlockHash(blockNumberAt);
    const apiAt = await this._api.at(blockHashAt);
    const apiAtTs = await apiAt.query.timestamp.now();
    const diff = now.sub(apiAtTs);
    console.log(diff.divn(blockNumberSub).toNumber());
    return diff.divn(blockNumberSub).toNumber();
  }

  async toTimestamp(blockTime: number, blockNumberAt: number): Promise<number> {
    const [now, block] = await Promise.all([
      await this._api.query.timestamp.now(),
      await this._api.query.system.number(),
    ]);
    const diff = (blockNumberAt - block.toNumber()) * blockTime;
    return now.toNumber() + diff;
  }

  toBlockPeriod(blockTime: number, periodMsec: number): number {
    const noOfBlocks = periodMsec / blockTime;
    return Math.floor(noOfBlocks);
  }

  blockToTime(
    blockHeight: number,
    knownBlock: {
      height: number;
      date: number;
    },
  ): number {
    const blockDiff = Math.abs(blockHeight - knownBlock.height);
    const msSinceKnownBlock = new BigNumber(blockDiff)
      .multipliedBy(BLOCK_TIME_RELAY_CHAIN)
      .toNumber();
    const ms = new Date(
      blockHeight > knownBlock.height
        ? knownBlock.date + msSinceKnownBlock
        : knownBlock.date - msSinceKnownBlock,
    ).getTime();
    return Math.floor(ms / 1000);
  }
}
