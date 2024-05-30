import { findNestedKey } from '@galacticcouncil/sdk';
import { chainsMap } from '@galacticcouncil/xcm-cfg';
import {
  addr,
  mda,
  Abi,
  AnyChain,
  EvmChain,
  Parachain,
  Precompile,
  WormholeChain,
} from '@galacticcouncil/xcm-core';
import { toDecimal } from '@moonbeam-network/xcm-utils';
import { TypeRegistry } from '@polkadot/types';
import { XcmVersionedMultiLocation } from '@polkadot/types/lookup';
import { encoding } from '@wormhole-foundation/sdk-base';
import { keccak256 } from '@wormhole-foundation/sdk-connect';
import { deserialize } from '@wormhole-foundation/sdk-definitions';

import {
  createPublicClient,
  decodeEventLog,
  encodeFunctionData,
  GetContractEventsParameters,
  TransactionReceipt,
  WatchContractEventReturnType,
  webSocket,
} from 'viem';

import { convertToH160 } from 'utils/evm';

import {
  Transfer,
  TransferData,
  TransferInfo,
  TransferLog,
  TransferPayload,
} from './types';
import { getChainById } from './utils';

export class TransferApi {
  private _wormholeApi: string;

  public constructor(wormholeApi: string) {
    this._wormholeApi = wormholeApi;
  }

  get chains(): AnyChain[] {
    return Array.from(chainsMap.values()).filter((c) => {
      const ctxWh = c as EvmChain;
      return ctxWh.defWormhole && ctxWh.key !== 'acala-evm';
    });
  }

  private buildUrl(params: Record<string, string>): string {
    return (
      [this._wormholeApi, '/api/v1/operations', '?'].join('') +
      new URLSearchParams({
        ...params,
        page: '0',
        pageSize: '50',
        sortOrder: 'DESC',
      }).toString()
    );
  }

  async getOperations(address: string): Promise<Map<string, Transfer>> {
    const fromHydraDX = this.buildUrl({
      address: mda.calculateMDA(address, '2034', 1),
    });

    const toHydraDX = this.buildUrl({
      address: convertToH160(address),
    });

    const operations = await Promise.all([
      fetch(fromHydraDX),
      fetch(toHydraDX),
    ]);

    const jsons = operations.map(async (o) => await o.json());
    const data = await Promise.all(jsons);
    const transfers = data.map((d) => d.operations as Transfer[]).flat();
    return new Map(transfers.map((item) => [item.id, item]));
  }

  async getTransfers(account: string): Promise<Transfer[]> {
    const transfersPerChain = this.chains.map((c) =>
      this.getTransfer(account, c),
    );
    const transfers = await Promise.all(transfersPerChain);
    return transfers.flat();
  }

  async isTransferComplete(
    transfer: Transfer,
    vaaBytes: string,
  ): Promise<boolean> {
    const { toChain } = transfer.content.payload;
    const ctx = getChainById(toChain);
    const ctxWh = ctx as WormholeChain;
    const provider = ctx.client.getProvider();
    const tokenBridge = ctxWh.getTokenBridge();

    const vaaArray = encoding.b64.decode(vaaBytes);
    const vaaArrayDes = deserialize('Uint8Array', vaaArray);
    const vaaDigestArray = keccak256(vaaArrayDes.hash);
    const vaaDigest = encoding.hex.encode(vaaDigestArray);

    const payload = await provider.readContract({
      address: tokenBridge as `0x${string}`,
      abi: Abi.Bridge,
      functionName: 'isTransferCompleted',
      args: ['0x' + vaaDigest],
    });
    return payload as boolean;
  }

  redeemTransfer(transfer: Transfer, vaaBytes: string): string {
    const { toChain, to } = transfer.content.payload;
    const ctx = getChainById(toChain);

    const vaaArray = encoding.b64.decode(vaaBytes);
    const vaaHex = encoding.hex.encode(vaaArray);

    if (ctx.key === 'moonbeam' && addr.toNative(to) === Precompile.Bridge) {
      return encodeFunctionData({
        abi: Abi.Gmp,
        functionName: 'wormholeTransferERC20',
        args: ['0x' + vaaHex],
      });
    }

    return encodeFunctionData({
      abi: Abi.TokenBridge,
      functionName: 'completeTransfer',
      args: ['0x' + vaaHex],
    });
  }

  async getTransfer(
    account: string,
    chain: AnyChain,
    period = 300n,
  ): Promise<Transfer[]> {
    const ctx = chain as EvmChain;
    const ctxWh = chain as WormholeChain;
    const provider = ctx.client.getProvider();
    const tokenBridge = ctxWh.getTokenBridge();
    const blockNo = await provider.getBlockNumber();
    const address = this.formatAddress(chain, account);

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

  async subscribeTransfers(
    account: string,
    onTransfer: (transfer: Transfer) => void,
  ): Promise<WatchContractEventReturnType[]> {
    return this.chains.map((c: EvmChain) => {
      const ctxWh = c as WormholeChain;
      const provider = c.client.getProvider();
      const tokenBridge = ctxWh.getTokenBridge();
      const address = this.formatAddress(c, account);

      const client = c.isEvmParachain()
        ? createPublicClient({
            chain: c.client.chain,
            transport: webSocket(),
          })
        : provider;

      return client.watchContractEvent({
        abi: Abi.Erc20,
        eventName: 'Transfer',
        args: {
          from: address as `0x${string}`,
          to: tokenBridge as `0x${string}`,
        },
        onError: (error) => console.log(error),
        onLogs: (transferEvents) =>
          transferEvents.forEach((tEvt: TransferLog) => {
            provider
              .waitForTransactionReceipt({
                hash: tEvt.transactionHash,
              })
              .then((tx: TransactionReceipt) => {
                return tx.logs.find((log: TransferLog) => {
                  try {
                    decodeEventLog({
                      abi: Abi.Meta,
                      data: log.data,
                      topics: log.topics,
                    });
                    return log;
                  } catch (error) {}
                });
              })
              .then((bEvt: TransferLog) => this.parseLogs(c, tEvt, bEvt))
              .then((t) => onTransfer(t));
          }),
      });
    });
  }

  private async parseLogs(
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
    const emitterAddressHex = addr.toHex(emitterAddress).substring(2);
    const value = tArgs.args['value'] as bigint;
    const sequence = bArgs.args['sequence'] as bigint;

    const transferPayload = bPayload as TransferPayload;
    return {
      content: {
        payload: bPayload,
        info: this.getTransferInfo(from, chain, transferPayload),
      },
      data: this.getTransferData(value, transferPayload),
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

  private getTransferData(
    value: bigint,
    payload: TransferPayload,
  ): TransferData {
    const { tokenAddress, tokenChain } = payload;
    const chain = getChainById(tokenChain);
    const token = addr.toNative(tokenAddress);
    const { asset, decimals } = Array.from(chain.assetsData.values()).find(
      (a) => a.id.toString().toLowerCase() === token.toLowerCase(),
    );
    const tokenAmount = toDecimal(value, decimals);
    return {
      symbol: asset.originSymbol,
      tokenAmount: tokenAmount,
    } as TransferData;
  }

  private getTransferInfo(
    from: string,
    fromChain: AnyChain,
    payload: TransferPayload,
  ): TransferInfo {
    const isMrl = this.isMrlPayload(payload);
    if (isMrl) {
      const multilocation = this.decodeMrlPayload(payload);
      const parachain = this.parseMultilocation(
        'parachain',
        multilocation.toJSON(),
      );
      const account = this.parseMultilocation(
        'accountId32',
        multilocation.toJSON(),
      );

      return {
        from: from,
        fromChain: fromChain,
        to: account && account['id'],
        toChain: Array.from(chainsMap.values()).find(
          (c) => c instanceof Parachain && c.parachainId === parachain,
        ),
      } as TransferInfo;
    }

    return {
      from: from,
      fromChain:
        fromChain.key === 'moonbeam' ? chainsMap.get('hydradx') : fromChain,
      to: addr.toNative(payload.to),
      toChain: getChainById(payload.toChain),
    } as TransferInfo;
  }

  /**
   * Chech whether transferWithPayload with MRL info
   *
   * @param payload - transfer payload
   * @returns true if mrl payload, otherwise false
   */
  private isMrlPayload(payload: TransferPayload): boolean {
    const { payloadID, to, toChain } = payload;
    return (
      payloadID === 3 &&
      toChain === 16 &&
      addr.toNative(to) === Precompile.Bridge
    );
  }

  /**
   * Decode MRL payload
   *
   * @param payload - transfer payload
   * @returns xcm versioned multilocation
   */
  private decodeMrlPayload(
    payload: TransferPayload,
  ): XcmVersionedMultiLocation {
    const registry = new TypeRegistry();
    return registry.createType(
      'VersionedMultiLocation',
      payload.payload.replace('0x00', '0x'),
    ) as unknown as XcmVersionedMultiLocation;
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

  /**
   * Format hydradx 7KAT address to correct block explorer format
   *
   * @param chain - source chain
   * @param address - hydradx substrate address
   * @returns - corresponding h160 block explorer address
   */
  private formatAddress(chain: AnyChain, address: string): string {
    if (chain.key === 'moonbeam') {
      return mda.calculateMDA(address, '2034', 1);
    }
    return convertToH160(address);
  }
}
