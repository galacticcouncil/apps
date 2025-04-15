import { findNestedKey } from '@galacticcouncil/sdk';

import { chainsMap } from '@galacticcouncil/xcm-cfg';
import {
  Abi,
  AnyChain,
  EvmParachain,
  Parachain,
  Precompile,
  Wormhole,
} from '@galacticcouncil/xcm-core';
import {
  Operation,
  OperationPayload,
  WormholeClient,
  WormholeScan,
} from '@galacticcouncil/xcm-sdk';

import { TypeRegistry } from '@polkadot/types';
import { XcmVersionedLocation } from '@polkadot/types/lookup';

import { signAndSend } from './signer';
import { getChainById } from '../utils';
import { StandartizedOperation, TransferLog, TransferStatus } from '../types';
import { WatchContractEventReturnType } from 'viem';

export class RedeemApi {
  private whScan: WormholeScan = null;
  private whClient: WormholeClient = null;

  constructor() {
    this.whScan = new WormholeScan();
    this.whClient = new WormholeClient();
  }

  get chains(): AnyChain[] {
    return Array.from(chainsMap.values());
  }

  chainById(wormholeId: number): AnyChain {
    return Array.from(chainsMap.values()).find(
      (c) =>
        Wormhole.isKnown(c) &&
        Wormhole.fromChain(c).getWormholeId() === wormholeId,
    );
  }

  async isTransferComplete(operation: Operation): Promise<boolean> {
    const { content, vaa } = operation;
    const ctx = getChainById(content.payload.toChain);
    return this.whClient.isTransferCompleted(ctx, vaa.raw);
  }

  subscribeRedeem(
    onTransfer: (vaa: string, txHash: string) => void,
  ): WatchContractEventReturnType {
    const ctx = chainsMap.get('moonbeam') as EvmParachain;
    const client = ctx.client.getWsProvider();
    return client.watchContractEvent({
      abi: Abi.TokenBridge,
      eventName: 'TransferRedeemed',
      args: {},
      onError: (error: any) => console.log(error),
      onLogs: (transferEvents) => {
        console.log(transferEvents);
        transferEvents.forEach((tEvt: TransferLog) => {
          const { transactionHash } = tEvt;
          const { emitterAddress, emitterChainId, sequence } = tEvt['args'];
          const id = [
            emitterChainId,
            emitterAddress.toLowerCase(),
            sequence,
          ].join('/');
          onTransfer(id, transactionHash);
        });
      },
    });
  }

  /**
   * Check transfer status & redeem the funds if VAA emitted
   *
   * @param txHash - wormhole transaction hash
   * @param address - signer address
   */
  async checkAndRedeem(txHash: string, address: string) {
    const { id, vaa } = await this.whScan.getVaaByTxHash(txHash);
    const { content } = await this.whScan.getOperation(id);
    const { payload } = content;
    const chain = this.chainById(payload.toChain)!;
    const isCompleted = await this.whClient.isTransferCompleted(chain, vaa);
    console.log('Transfer completed: ' + isCompleted);

    // Call redeem if transfer not completed
    if (!isCompleted) {
      const call = this.whScan.isMrlTransfer(payload)
        ? this.whClient.redeemMrl(address, vaa)
        : this.whClient.redeem(chain, address, vaa);
      signAndSend(
        address,
        call,
        chain,
        (hash) => {
          console.log('TxHash: ' + hash);
        },
        (receipt) => {
          console.log(receipt);
        },
        (error) => {
          console.error(error);
        },
      );
    }
  }

  async getOperations(): Promise<StandartizedOperation[]> {
    const operations = await this.whScan.getOperations({
      address: '0x0000000000000000000000000000000000000816',
      page: '0',
      pageSize: '50',
    });

    const minus24Hrs = Date.now() - 1000 * 60 * 60 * 24;

    return operations
      .filter((o) => {
        const { content, sourceChain } = o;
        const isMrl = this.isMrlPayload(content.payload);
        const bridgedAt = new Date(sourceChain.timestamp);
        return isMrl && Number(bridgedAt) > minus24Hrs;
      })
      .map((o) => {
        const { content, sourceChain } = o;
        const { payload } = content;

        const decoded = this.decodeMrlPayload(payload.payload).toJSON();
        const parachain = this.parseMultilocation('parachain', decoded);
        const receiver = this.parseMultilocation('accountId32', decoded);

        const from = this.chains.find(
          (c) =>
            Wormhole.isKnown(c) &&
            Wormhole.fromChain(c).getWormholeId() === payload.tokenChain,
        );

        const to = this.chains.find(
          (c) => c instanceof Parachain && c.parachainId === parachain,
        );

        return {
          ...o,
          info: {
            from: sourceChain.from,
            fromChain: from,
            to: receiver && receiver['id'],
            toChain: to,
            status: this.getStatus(o),
          },
        };
      });
  }

  private getStatus(operation: Operation) {
    if (operation.vaa) {
      const isCompleted =
        operation['targetChain'] &&
        operation['targetChain'].status === 'completed';
      return isCompleted ? TransferStatus.Completed : TransferStatus.VaaEmitted;
    } else {
      return TransferStatus.WaitingForVaa;
    }
  }

  /**
   * Chech whether transferWithPayload with MRL info
   *
   * @param payload - transfer payload
   * @returns true if mrl payload, otherwise false
   */
  private isMrlPayload(contentPayload: OperationPayload): boolean {
    const { payloadType, toAddress, toChain } = contentPayload;
    return (
      payloadType === 3 &&
      toChain === 16 &&
      this.toNative(toAddress) === Precompile.Bridge
    );
  }

  /**
   * Decode MRL payload
   *
   * @param payload - transfer payload
   * @returns xcm versioned multilocation
   */
  private decodeMrlPayload(payload: string): XcmVersionedLocation {
    const registry = new TypeRegistry();
    return registry.createType(
      'VersionedMultiLocation',
      '0x' + payload.substring(2),
    ) as unknown as XcmVersionedLocation;
  }

  /**
   * Parse multilocation JSON
   *
   * @param key - attr key
   * @param multilocation - multilocation JSON
   * @returns parsed arg if exist, otherwise undefined
   */
  private parseMultilocation(key: string, multilocation?: any) {
    if (location) {
      const entry = findNestedKey(multilocation, key);
      return entry && entry[key];
    } else {
      return undefined;
    }
  }

  private toNative(wormholeAddress: string) {
    return '0x' + wormholeAddress.substring(26);
  }
}
