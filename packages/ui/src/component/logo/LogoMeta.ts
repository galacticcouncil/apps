const BASE_URL =
  'https://raw.githubusercontent.com/galacticcouncil/intergalactic-asset-metadata/master';

export class LogoMeta {
  private static _instance: LogoMeta = new LogoMeta();
  private _assets: LogoData = null;
  private _chains: LogoData = null;

  constructor() {
    if (LogoMeta._instance) {
      throw new Error('Use LogoMeta.getInstance() instead of new.');
    }
    LogoMeta._instance = this;
    this.getData('/assets.json', (data) => {
      this._assets = data;
    });
    this.getData('/chains.json', (data) => {
      this._chains = data;
    });
  }

  public static getInstance(): LogoMeta {
    return LogoMeta._instance;
  }

  private getData(path: string, cb: (data: LogoData) => void) {
    fetch(BASE_URL + path)
      .then((a) => a.json())
      .then((j) => cb(j));
  }

  private getUrl(data: LogoData, key: string): string {
    const { branch, cdn, path, repository, items } = data;
    const item = items[key];
    if (item) {
      return [cdn['jsDelivr'], repository + '@' + branch, path, item.path].join(
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
}

export interface LogoData {
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
