const BASE_URL =
  'https://raw.githubusercontent.com/galacticcouncil/intergalactic-asset-metadata/master';

export class MetadataStore {
  private static _instance: MetadataStore = new MetadataStore();
  private _assets: AssetResouce = null;
  private _chains: AssetResouce = null;
  private _metadata: AssetMetadata = null;

  constructor() {
    if (MetadataStore._instance) {
      throw new Error('Use MetadataStore.getInstance() instead of new.');
    }
    MetadataStore._instance = this;
    this.getData('/assets-v2.json', (data) => {
      this._assets = data;
    });
    this.getData('/chains-v2.json', (data) => {
      this._chains = data;
    });
    this.getData('/metadata.json', (data) => {
      this._metadata = data;
    });
  }

  public static getInstance(): MetadataStore {
    return MetadataStore._instance;
  }

  private getData(path: string, cb: (data: any) => void) {
    fetch(BASE_URL + path)
      .then((a) => a.json())
      .then((j) => cb(j));
  }

  private getUrl(data: AssetResouce, item: string): string {
    const { cdn, path, repository } = data;
    if (item) {
      return [cdn['jsDelivr'], repository + '@latest', path, item].join('/');
    }
    return null;
  }

  public asset(
    ecosystem: string,
    chain: string,
    asset: string | { [key: string]: string },
  ): string {
    const { items } = this._assets;
    const id = this.parseAssetId(asset);

    if (id) {
      const key = [ecosystem, chain, 'assets', id].join('/');
      const item = items.find((path) => path.startsWith(key + '/icon'));
      return this.getUrl(this._assets, item);
    }
    return null;
  }

  public chain(ecosystem: string, chain: string): string {
    const { items } = this._chains;
    const key = [ecosystem, chain].join('/');
    const item = items.find((path) => path.startsWith(key + '/icon'));
    return this.getUrl(this._chains, item);
  }

  public externalWhitelist(): string[] {
    const whitelist = this._metadata?.assets.external.whitelist ?? {};
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
