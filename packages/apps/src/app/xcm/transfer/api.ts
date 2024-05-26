import { chainsMap } from '@galacticcouncil/xcm-cfg';
import {
  Abi,
  AnyChain,
  EvmChain,
  Precompile,
  WormholeChain,
  calculateMDA,
} from '@galacticcouncil/xcm-core';
import { toDecimal } from '@moonbeam-network/xcm-utils';
import { TypeRegistry } from '@polkadot/types';
import { encoding } from '@wormhole-foundation/sdk-base';

import { convertToH160 } from 'utils/evm';

import { Transfer, TransferData, TransferLog, TransferPayload } from './types';
import {
  decodeEventLog,
  GetContractEventsParameters,
  WatchContractEventReturnType,
} from 'viem';

export class TransferApi {
  private _wormholeApi: string;

  public constructor(wormholeApi: string) {
    this._wormholeApi = wormholeApi;
  }

  async getOperations(address: string): Promise<Transfer[]> {
    const url =
      [this._wormholeApi, '/api/v1/operations', '?'].join('') +
      new URLSearchParams({
        address: address,
        page: '0',
        pageSize: '50',
        sortOrder: 'DESC',
      }).toString();

    const data = await fetch(url, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'GET',
    });

    const dataJson = await data.json();
    return dataJson['operations'] as Transfer[];
  }

  private getAddress(chain: AnyChain, address: string): string {
    if (chain.key === 'moonbeam') {
      return calculateMDA(address, '2034', 1);
    }
    return convertToH160(address);
  }

  private getChain(wormholeId: number): EvmChain {
    return Array.from(chainsMap.values()).find((c) => {
      const ctxWh = c as EvmChain;
      return ctxWh?.defWormhole?.id === wormholeId;
    }) as EvmChain;
  }

  private getChains(): AnyChain[] {
    return Array.from(chainsMap.values()).filter((c) => {
      const ctxWh = c as EvmChain;
      return ctxWh.defWormhole && ctxWh.key !== 'acala-evm';
    });
  }

  private getTransferData(
    value: bigint,
    payload: TransferPayload,
  ): TransferData {
    const { tokenAddress, tokenChain } = payload;
    const chain = this.getChain(tokenChain);
    const token = this.toNativeAddress(tokenAddress);
    const { asset, decimals } = Array.from(chain.assetsData.values()).find(
      (a) => a.id.toString().toLowerCase() === token.toLowerCase(),
    );
    const tokenAmount = toDecimal(value, decimals);
    return {
      symbol: asset.originSymbol,
      tokenAmount: tokenAmount,
    } as TransferData;
  }

  private isMrlPayload(payload: TransferPayload): boolean {
    const { payloadID, to, toChain } = payload;
    return payloadID === 3 && toChain === 16 && to === Precompile.Bridge;
  }

  private decodeMrlPayload(payload: TransferPayload) {
    const payloadArray = encoding.b64.decode(payload.payload);
    const payloadHex = encoding.hex.encode(payloadArray);
    const registry = new TypeRegistry();
    const multilocation = registry.createType(
      'VersionedMultiLocation',
      '0x' + payloadHex.substring(2),
    );
    return multilocation.toJSON();
  }

  async getTransfers(account: string): Promise<Transfer[]> {
    const transfersPerChain = this.getChains().map((c) =>
      this.getTransfer(account, c),
    );
    const transfers = await Promise.all(transfersPerChain);
    return transfers.flat();
  }

  async subscribeTransfers(
    account: string,
    onTransfer: (transfer: Transfer) => void,
  ): Promise<WatchContractEventReturnType[]> {
    return this.getChains().map((c: EvmChain) => {
      const ctxWh = c as WormholeChain;
      const provider = c.client.getProvider();
      const tokenBridge = ctxWh.getTokenBridge();
      const address = this.getAddress(c, account);
      return provider.watchContractEvent({
        abi: Abi.Erc20,
        eventName: 'Transfer',
        args: {
          from: address as `0x${string}`,
          to: tokenBridge as `0x${string}`,
        },
        onLogs: (transferEvents) =>
          transferEvents.forEach((tEvt: TransferLog) => {
            provider
              .getContractEvents({
                abi: Abi.Meta,
                eventName: 'LogMessagePublished',
                args: {
                  sender: tokenBridge as `0x${string}`,
                },
                blockHash: tEvt.blockHash,
              })
              .then((bridgeEvents) =>
                bridgeEvents.find(
                  (bEvt) => bEvt.transactionHash === tEvt.transactionHash,
                ),
              )
              .then((bEvt) => this.parseLogs(c, tEvt, bEvt))
              .then((t) => onTransfer(t));
          }),
      });
    });
  }

  async getTransfer(
    account: string,
    chain: AnyChain,
    period = 3000n,
  ): Promise<Transfer[]> {
    const ctx = chain as EvmChain;
    const ctxWh = chain as WormholeChain;
    const provider = ctx.client.getProvider();
    const tokenBridge = ctxWh.getTokenBridge();
    const blockNo = await provider.getBlockNumber();
    const address = this.getAddress(chain, account);

    const range = {
      fromBlock: blockNo - period,
      toBlock: 'latest',
    } as Partial<GetContractEventsParameters>;
    const [transferEvents, bridgeEvents] = await Promise.all([
      provider.getContractEvents({
        abi: Abi.Erc20,
        eventName: 'Transfer',
        args: {
          from: address as `0x${string}`,
          to: tokenBridge as `0x${string}`,
        },
        ...range,
      }),
      provider.getContractEvents({
        abi: Abi.Meta,
        eventName: 'LogMessagePublished',
        args: {
          sender: tokenBridge as `0x${string}`,
        },
        ...range,
      }),
    ]);

    const events = transferEvents.map(async (tEvt) => {
      const bEvt = bridgeEvents.find(
        (bEvt) => bEvt.transactionHash === tEvt.transactionHash,
      );
      return this.parseLogs(chain, tEvt, bEvt);
    });
    return Promise.all(events);
  }

  async parseLogs(
    chain: AnyChain,
    tEvt: TransferLog,
    bEvt: TransferLog,
  ): Promise<Transfer> {
    const ctx = chain as EvmChain;
    const provider = ctx.client.getProvider();
    const tokenBridge = ctx.getTokenBridge();
    const chainId = ctx.getWormholeId();

    const block = await provider.getBlock({
      blockNumber: bEvt.blockNumber,
    });

    const tArgs = decodeEventLog({
      abi: Abi.Erc20,
      data: tEvt.data,
      topics: tEvt.topics,
    });

    const bArgs = decodeEventLog({
      abi: Abi.Meta,
      data: bEvt.data,
      topics: bEvt.topics,
    });

    const bArgsPayload = bArgs.args['payload'] as string;
    const bPayload = await provider.readContract({
      address: tokenBridge as `0x${string}`,
      abi: Abi.Bridge,
      functionName: bArgsPayload.startsWith('0x03')
        ? 'parseTransferWithPayload'
        : 'parseTransfer',
      args: [bArgsPayload],
    });

    const from = tArgs.args['from'] as `0x${string}`;
    const emitterAddress = tArgs.args['to'] as `0x${string}`;
    const emitterAddressHex = this.toHexAddress(emitterAddress).substring(2);
    const value = tArgs.args['value'] as bigint;
    const sequence = bArgs.args['sequence'] as bigint;

    return {
      content: {
        payload: bPayload,
      },
      data: this.getTransferData(value, bPayload as TransferPayload),
      emitterChain: chainId,
      emitterAddress: {
        hex: emitterAddressHex.toLowerCase(),
        native: emitterAddress.toLowerCase(),
      },
      id: [chainId, emitterAddressHex.toLowerCase(), sequence].join('/'),
      sequence: sequence.toString(),
      sourceChain: {
        chainId: chainId,
        timestamp: block.timestamp,
        transaction: {
          txHash: tEvt.transactionHash,
        },
        from: from.toLowerCase(),
      },
    } as Transfer;
  }

  /**
   * Format address in 32 bytes (left padded)
   *
   * @param address 20 bytes 0x address
   * @returns 32 bytes 0x address
   */
  private toHexAddress(address: string) {
    return '0x000000000000000000000000' + address.substring(2);
  }

  /**
   * Format address in 20 bytes
   *
   * @param address 32 bytes lef padded 0x address
   * @returns 20 bytes 0x address
   */
  private toNativeAddress(address: string) {
    return '0x' + address.substring(26);
  }
}
