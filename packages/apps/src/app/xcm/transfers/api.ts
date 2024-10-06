import { findNestedKey } from '@galacticcouncil/sdk';
import { chainsMap } from '@galacticcouncil/xcm-cfg';
import {
  addr,
  big,
  mda,
  Abi,
  AnyChain,
  EvmChain,
  Parachain,
  Precompile,
  Wormhole,
} from '@galacticcouncil/xcm-core';
import { TypeRegistry } from '@polkadot/types';
import { XcmVersionedLocation } from '@polkadot/types/lookup';

import {
  createPublicClient,
  decodeEventLog,
  webSocket,
  GetContractEventsParameters,
  TransactionReceipt,
  WatchContractEventReturnType,
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
import {
  Operation,
  WormholeClient,
  WormholeScan,
} from '@galacticcouncil/xcm-sdk';

export class TransferApi {
  private whScan: WormholeScan = null;
  private whClient: WormholeClient = null;

  constructor() {
    this.whScan = new WormholeScan();
    this.whClient = new WormholeClient();
  }

  get chains(): AnyChain[] {
    return Array.from(chainsMap.values()).filter(
      (c) => c.isWormholeChain() && c.key !== 'acala-evm',
    );
  }

  chainById(wormholeId: number): AnyChain {
    return Array.from(chainsMap.values()).find(
      (c) => c.isWormholeChain() && c.getWormholeId() === wormholeId,
    );
  }

  async isTransferComplete(
    transfer: Transfer,
    vaaBytes: string,
  ): Promise<boolean> {
    const { toChain } = transfer.content.payload;
    const ctx = getChainById(toChain);
    return this.whClient.isTransferCompleted(ctx, vaaBytes);
  }

  async getOperations(address: string): Promise<Map<string, Operation>> {
    const fromAddress = mda.calculateMDA(address, '2034', 1);
    const toAddress = convertToH160(address);

    const operations = await Promise.all([
      this.whScan.getOperations({
        address: fromAddress,
        page: '0',
        pageSize: '50',
      }),
      this.whScan.getOperations({
        address: toAddress,
        page: '0',
        pageSize: '50',
      }),
    ]);
    return new Map(operations.flat().map((item) => [item.id, item]));
  }

  async getTransfers(account: string): Promise<Transfer[]> {
    const transfersPerChain = this.chains.map((c) =>
      this.getTransfer(account, c),
    );
    const transfers = await Promise.all(transfersPerChain);
    return transfers.flat();
  }

  async getTransfer(
    account: string,
    chain: AnyChain,
    period = 300n,
  ): Promise<Transfer[]> {
    const ctx = chain as EvmChain;
    const ctxWh = chain as Wormhole;
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
      console.log(tEvt);
      console.log(bEvt);

      return this.parseLogs(chain, tEvt, bEvt);
    });
    return Promise.all(events);
  }

  async subscribeTransfersPull(
    account: string,
    onTransfer: (transfer: Transfer) => void,
  ): Promise<WatchContractEventReturnType[]> {
    return this.chains.map((c: EvmChain) => {
      const provider = c.client.getProvider();
      const client = c.isEvmParachain() ? c.client.getWsProvider() : provider;
      return client.watchBlockNumber({
        onBlockNumber: () => {
          this.getTransfer(account, c, 0n).then((t) => {
            t.forEach((t) => {
              onTransfer(t);
            });
          });
        },
      });
    });
  }

  async subscribeTransfers(
    account: string,
    onTransfer: (transfer: Transfer) => void,
  ): Promise<WatchContractEventReturnType[]> {
    return this.chains.map((c: EvmChain) => {
      const ctxWh = c as Wormhole;
      const provider = c.client.getProvider();
      const tokenBridge = ctxWh.getTokenBridge();
      const address = this.formatAddress(c, account);

      const client = c.isEvmParachain() ? c.client.getWsProvider() : provider;

      // const client = c.isEvmParachain()
      //   ? c.client.getWsProvider()
      //   : createPublicClient({
      //       chain: c.client.chain,
      //       transport: webSocket(
      //         'wss://eth-mainnet.g.alchemy.com/v2/r3zNys83u7ShzRu9FRq18eXmipqwhFEQ',
      //       ),
      //     });

      return client.watchContractEvent({
        abi: Abi.Erc20,
        eventName: 'Transfer',
        args: {
          from: address as `0x${string}`,
          to: tokenBridge as `0x${string}`,
        },
        onError: (error) => console.log(error),
        onLogs: (transferEvents) => {
          console.log(transferEvents);
          transferEvents.forEach((tEvt: TransferLog) => {
            client
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
          });
        },
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
      abi: Abi.TokenBridge,
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
    const tokenAmount = big.toDecimal(value, decimals);
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
      const json = multilocation.toJSON();
      const parachain = this.parseMultilocation('parachain', json);
      const account = this.parseMultilocation('accountId32', json);

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
  private decodeMrlPayload(payload: TransferPayload): XcmVersionedLocation {
    const registry = new TypeRegistry();
    return registry.createType(
      'VersionedMultiLocation',
      payload.payload.replace('0x00', '0x'),
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
