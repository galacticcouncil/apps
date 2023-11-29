import { PublicClient } from 'viem';

export interface EvmProvider {
  toEvmAddress(address: string): Promise<string>;
  getClient(): PublicClient;
}
