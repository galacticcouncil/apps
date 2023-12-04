import { ContractConfig } from '@moonbeam-network/xcm-builder';
import { PublicClient, parseAbi } from 'viem';
import { EvmClient } from '../evm';

const ABI = parseAbi([
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
]);

export class Erc20a {
  readonly #provider: PublicClient;
  readonly #config: ContractConfig;

  constructor(client: EvmClient, config: ContractConfig) {
    this.validateClient(client);
    this.validateConfig(config);
    this.#config = config;
    this.#provider = client.getProvider();
  }

  private validateClient(client: EvmClient) {
    if (!client) {
      throw new Error(`No EVM client found`);
    }
  }

  private validateConfig(config: ContractConfig) {
    if (!config.address) {
      throw new Error('Erc20 address is required');
    }
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
