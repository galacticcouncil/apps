import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { Cursor } from '@thi.ng/atom';
import short from 'short-uuid';

import {
  AccountCursor,
  DcaConfigCursor,
  ExternalAssetCursor,
  StorageKey,
  TradeConfigCursor,
  XStoreCursor,
} from './db';
import { getObj, setObj } from './storage';
import { ExternalAssetConfig } from './types';

@customElement('gc-database-provider')
export class DatabaseProvider extends LitElement {
  private cursors: Map<string, Cursor<any>> = new Map([]);

  private watchId<T>(cursor: Cursor<T>) {
    return cursor.id + '-' + short.generate();
  }

  private register<T>(cursor: Cursor<T>, storageKey: string) {
    const storedVal = getObj<T>(storageKey);
    const defaultVal = cursor.deref();
    if (defaultVal) {
      cursor.reset({ ...defaultVal, ...storedVal });
    } else {
      cursor.reset(storedVal);
    }
  }

  private registerAndSync<T>(cursor: Cursor<T>, storageKey: string) {
    this.register(cursor, storageKey);
    const watchId = this.watchId(cursor);
    cursor.addWatch(watchId, (id, prev, curr) => {
      const prevJson = JSON.stringify(prev);
      const currJson = JSON.stringify(curr);
      if (prevJson !== currJson) {
        console.log(`${id}: ${prevJson} -> ${currJson}`);
        setObj(storageKey, curr);
      }
    });
    this.cursors.set(watchId, cursor);
    console.log(`💾 Sync [${cursor.id}] => ${storageKey} active.`);
  }

  private unregister() {
    for (let [watchId, cursor] of this.cursors) {
      cursor.removeWatch(watchId);
    }
  }

  private async onStorageChange(evt: StorageEvent) {
    if (evt.key === StorageKey.external && evt.newValue) {
      console.log('🔄 Syncing external tokens...');
      const config = JSON.parse(evt.newValue) as ExternalAssetConfig;
      ExternalAssetCursor.reset(config);
    }
  }

  override connectedCallback() {
    super.connectedCallback();
    this.registerAndSync(AccountCursor, StorageKey.account);
    this.registerAndSync(DcaConfigCursor, StorageKey.config.dca);
    this.registerAndSync(TradeConfigCursor, StorageKey.config.trade);
    this.registerAndSync(XStoreCursor, StorageKey.tx.store);
    this.register(ExternalAssetCursor, StorageKey.external);
  }

  override disconnectedCallback() {
    this.unregister();
    window.removeEventListener('storage', this.onStorageChange);
    super.disconnectedCallback();
  }

  render() {
    return html`
      <slot></slot>
    `;
  }
}
