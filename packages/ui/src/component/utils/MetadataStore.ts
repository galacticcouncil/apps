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
    this.getData('/assets.json', (data) => {
      this._assets = data;
    });
    this.getData('/chains.json', (data) => {
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

  private getUrl(data: AssetResouce, key: string): string {
    const { cdn, path, repository, items } = data;
    const item = items[key];
    if (item) {
      return [cdn['jsDelivr'], repository + '@latest', path, item.path].join(
        '/',
      );
    }
    return null;
  }

  public asset(key: string): string {
    return this.getUrl(this._assets, key);
  }

  public chain(key: string): string {
    return this.getUrl(this._chains, key);
  }

  public externalWhitelist(): string[] {
    const whitelist = this._metadata?.assets.external.whitelist ?? {};
    return Object.values(whitelist);
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
  items: {
    [key: string]: {
      path: string;
    };
  };
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
