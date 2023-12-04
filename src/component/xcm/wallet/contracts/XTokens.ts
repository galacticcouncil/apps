import { ContractConfig } from '@moonbeam-network/xcm-builder';
import { PublicClient } from 'viem';
import { EvmClient } from '../evm';

import abi from './XTokensABI.json';

export class XTokens {
  readonly address = '0x0000000000000000000000000000000000000804';
  readonly #provider: PublicClient;

  constructor(client: EvmClient) {
    this.validateClient(client);
    this.#provider = client.getProvider();
  }

  private validateClient(client: EvmClient) {
    if (!client) {
      throw new Error(`No EVM client found`);
    }
  }

  async getEstimatedGas(
    address: string,
    config: ContractConfig,
  ): Promise<bigint> {
    const { func, args } = config;
    return await this.#provider.estimateContractGas({
      address: this.address as `0x${string}`,
      abi: abi,
      functionName: func,
      args: args,
      account: address,
    });
  }

  async getGasPrice(): Promise<bigint> {
    return this.#provider.getGasPrice();
  }

  async getFee(
    address: string,
    amount: bigint,
    config: ContractConfig,
  ): Promise<bigint> {
    if (amount === 0n) {
      return 0n;
    }

    try {
      const estimatedGas = await this.getEstimatedGas(address, config);
      const gasPrice = await this.getGasPrice();
      return estimatedGas * gasPrice;
    } catch (error) {
      console.log(error);
      throw new Error(
        "Can't get a fee. Make sure that you have enough balance!",
      );
    }
  }
}
