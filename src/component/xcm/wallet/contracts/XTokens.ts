import { ContractConfig } from '@moonbeam-network/xcm-builder';
import { PublicClient } from 'viem';

import abi from './XTokensABI.json';

export class XTokens {
  readonly address = '0x0000000000000000000000000000000000000804';
  readonly #config: ContractConfig;
  readonly #signer: PublicClient;

  constructor(config: ContractConfig, signer: PublicClient) {
    this.#config = config;
    this.#signer = signer;
  }

  async getEstimatedGas(): Promise<bigint> {
    const { func, args } = this.#config;
    console.log({
      address: this.address as `0x${string}`,
      abi: abi,
      functionName: func,
      args: args,
    });
    return await this.#signer.estimateContractGas({
      address: this.address as `0x${string}`,
      abi: abi,
      functionName: func,
      args: args,
      account: '0x26f5C2370e563e9f4dDA435f03A63D7C109D8D04',
    });
  }

  async getGasPrice(): Promise<bigint> {
    return this.#signer.getGasPrice();
  }

  async getFee(amount: bigint): Promise<bigint> {
    console.log('amount: ' + amount);

    if (amount === 0n) {
      return 0n;
    }

    try {
      const estimatedGas = await this.getEstimatedGas();
      const gasPrice = await this.getGasPrice();
      console.log('estGas: ' + estimatedGas);
      console.log('gasPrice: ' + gasPrice);

      return estimatedGas * gasPrice;
    } catch (error) {
      console.log(error);
      throw new Error(
        "Can't get a fee. Make sure that you have enough balance!",
      );
    }
  }
}
