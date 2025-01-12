import { memoize1 } from '@thi.ng/memoize';

const BASE_URL =
  'https://raw.githubusercontent.com/galacticcouncil/intergalactic-asset-metadata/master';

export class MetadataStore {
  private static _instance: MetadataStore = new MetadataStore();
  private _assets: AssetResouce = null;
  private _chains: AssetResouce = null;
  private _metadata: AssetMetadata = null;

  private data = memoize1(async (mem: string) => {
    console.log('MetadataStore fetch', mem, '✅');
    return this.getData(mem);
  });

  constructor() {
    if (MetadataStore._instance) {
      throw new Error('Use MetadataStore.getInstance() instead of new.');
    }
    MetadataStore._instance = this;
  }

  public static getInstance(): MetadataStore {
    return MetadataStore._instance;
  }

  private async getData<T>(path: string): Promise<T> {
    const response = await fetch(BASE_URL + path);
    return response.json();
  }

  private async getAssets(): Promise<AssetResouce> {
    if (!this._assets) {
      this._assets = (await this.data('/assets-v2.json')) as AssetResouce;
    }
    return this._assets;
  }

  private async getChains(): Promise<AssetResouce> {
    if (!this._chains) {
      this._chains = (await this.data('/chains-v2.json')) as AssetResouce;
    }
    return this._chains;
  }

  private async getMetadata(): Promise<AssetMetadata> {
    if (!this._metadata) {
      this._metadata = (await this.data('/metadata.json')) as AssetMetadata;
    }
    return this._metadata;
  }

  private getUrl(data: AssetResouce, item: string): string {
    const { cdn, path, repository } = data;
    if (item) {
      return [cdn['jsDelivr'], repository + '@latest', path, item].join('/');
    }
    return null;
  }

  public async asset(
    ecosystem: string,
    chain: string,
    asset: string | { [key: string]: string },
  ): Promise<string> {
    const { items } = await this.getAssets();
    const id = this.parseAssetId(asset);
    if (id) {
      const key = [ecosystem, chain, 'assets', id].join('/');
      const item = items.find((path) => path.startsWith(key + '/icon'));
      return this.getUrl(this._assets, item);
    }
    return null;
  }

  public async chain(ecosystem: string, chain: string): Promise<string> {
    const { items } = await this.getChains();
    const key = [ecosystem, chain].join('/');
    const item = items.find((path) => path.startsWith(key + '/icon'));
    return this.getUrl(this._chains, item);
  }

  public async externalWhitelist(): Promise<string[]> {
    const { assets } = await this.getMetadata();
    const whitelist = assets.external.whitelist ?? {};
    return Object.values(whitelist);
  }

  private parseAssetId(asset: string | { [key: string]: string }) {
    if (typeof asset === 'object') {
      return Object.entries(asset)[0].join('/');
    }

    const assetStr = asset.toString();
    if (assetStr.startsWith('0x')) {
      return assetStr.toLowerCase();
    }
    return assetStr;
  }
}

interface AssetResouce {
  baseUrl: string;
  branch: string;
  cdn: {
    [key: string]: string;
  };
  path: string;
  repository: string;
  items: string[];
}

interface AssetMetadata {
  assets: {
    external: {
      whitelist: {
        [key: string]: string;
      };
    };
  };
}
