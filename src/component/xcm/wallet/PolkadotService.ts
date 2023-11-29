import {
  ExtrinsicConfig,
  SubstrateQueryConfig,
} from '@moonbeam-network/xcm-builder';
import { IConfigService } from '@moonbeam-network/xcm-config';
import { AnyParachain, Asset, AssetAmount } from '@moonbeam-network/xcm-types';
import { getPolkadotApi } from '@moonbeam-network/xcm-utils';
import { ApiPromise } from '@polkadot/api';
import { SubmittableExtrinsic } from '@polkadot/api/promise/types';

export class PolkadotService {
  readonly api: ApiPromise;

  readonly chain: AnyParachain;

  readonly configService: IConfigService;

  constructor(
    api: ApiPromise,
    chain: AnyParachain,
    configService: IConfigService,
  ) {
    this.api = api;
    this.chain = chain;
    this.configService = configService;
  }

  static async create(
    chain: AnyParachain,
    configService: IConfigService,
  ): Promise<PolkadotService> {
    return new PolkadotService(
      await getPolkadotApi(chain.ws),
      chain,
      configService,
    );
  }

  get decimals(): number {
    return this.api.registry.chainDecimals.at(0) || 12;
  }

  get asset(): Asset {
    const symbol = this.api.registry.chainTokens.at(0);
    const key = symbol?.toString().toLowerCase();

    if (!key) {
      throw new Error('No native token found');
    }

    const asset = this.configService.getAsset(key);
    if (!asset) {
      throw new Error(`No asset found for key "${key}"`);
    }

    return asset;
  }

  get existentialDeposit(): AssetAmount {
    const existentialDeposit = this.api.consts.balances?.existentialDeposit;
    const amount = existentialDeposit?.toBigInt() || 0n;
    return AssetAmount.fromAsset(this.asset, {
      amount,
      decimals: this.decimals,
    });
  }

  async getAssetDecimals(asset: Asset): Promise<number> {
    return this.chain.getAssetDecimals(asset) || this.decimals;
  }

  async query(config: SubstrateQueryConfig): Promise<bigint> {
    const response = await this.api.query[config.module][config.func](
      ...config.args,
    );
    return config.transform(response);
  }

  getExtrinsic(config: ExtrinsicConfig): SubmittableExtrinsic {
    const fn = this.api.tx[config.module][config.func];
    const args = config.getArgs(fn);
    return fn(...args);
  }

  async getFee(account: string, config: ExtrinsicConfig): Promise<bigint> {
    const extrinsic = this.getExtrinsic(config);
    const info = await extrinsic.paymentInfo(account, { nonce: -1 });
    return info.partialFee.toBigInt();
  }
}
