import { ContractConfig } from '@moonbeam-network/xcm-builder';
import { PublicClient, parseAbi } from 'viem';
import { EvmClient } from '../evm';

const ABI = parseAbi([
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
]);

export class Erc20 {
  readonly #config: ContractConfig;
  readonly #provider: PublicClient;

  constructor(config: ContractConfig, client: EvmClient) {
    this.#config = config;
    this.#provider = client.getProvider();
  }

  async getBalance(): Promise<bigint> {
    const { address, args } = this.#config;
    const [recipient] = args;

    return await this.#provider.readContract({
      address: address as `0x${string}`,
      abi: ABI,
      functionName: 'balanceOf',
      args: [recipient as `0x${string}`],
    });
  }

  async getDecimals(): Promise<number> {
    const { address } = this.#config;

    return await this.#provider.readContract({
      address: address as `0x${string}`,
      abi: ABI,
      functionName: 'decimals',
    });
  }
}
