import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { Cursor } from '@thi.ng/atom';
import short from 'short-uuid';

import {
  AccountCursor,
  ChainCursor,
  DcaConfigCursor,
  ExternalAssetCursor,
  StorageKey,
  TradeConfigCursor,
  XStoreCursor,
} from 'db';
import { getObj, setObj } from 'db/storage';
import { ExternalAssetConfig } from 'db/types';

@customElement('gc-context-provider')
export class ContextProvider extends LitElement {
  private cursors: Map<string, Cursor<any>> = new Map([]);
  private channel = new BroadcastChannel('ctx-channel');

  private watchId<T>(cursor: Cursor<T>) {
    return cursor.id + '-' + short.generate();
  }

  private reset<T>(cursor: Cursor<T>, key: string) {
    const storedVal = getObj<T>(key);
    const defaultVal = cursor.deref();
    if (defaultVal) {
      cursor.reset({ ...defaultVal, ...storedVal });
    } else {
      cursor.reset(storedVal);
    }
  }

  private syncStorage<T>(cursor: Cursor<T>, key: string) {
    this.reset(cursor, key);
    const watchId = this.watchId(cursor);
    cursor.addWatch(watchId, (id, prev, curr) => {
      const prevJson = JSON.stringify(prev);
      const currJson = JSON.stringify(curr);
      if (prevJson !== currJson) {
        console.log(`${id}: ${prevJson} -> ${currJson}`);
        setObj(key, curr);
      }
    });
    this.cursors.set(watchId, cursor);
    console.log(`💾 Sync [${cursor.id}] => ${key} active.`);
  }

  private syncRegistry(cursor: Cursor<ExternalAssetConfig>, key: string) {
    this.reset(cursor, key);
    const watchId = this.watchId(cursor);
    cursor.addWatch(watchId, (_id, _prev, curr) => {
      const chain = ChainCursor.deref();
      if (chain) {
        console.log('🔄 Syncing external tokens...');
        const { isTestnet, poolService } = chain;
        const config = isTestnet
          ? curr.state.tokens['testnet']
          : curr.state.tokens['mainnet'];
        poolService.syncRegistry(config).then(() => {
          this.channel.postMessage('external-sync');
        });
      }
    });
    this.cursors.set(watchId, cursor);
  }

  private unregister() {
    for (let [watchId, cursor] of this.cursors) {
      cursor.removeWatch(watchId);
    }
  }

  override connectedCallback() {
    super.connectedCallback();
    this.syncStorage(AccountCursor, StorageKey.account);
    this.syncStorage(DcaConfigCursor, StorageKey.config.dca);
    this.syncStorage(TradeConfigCursor, StorageKey.config.trade);
    this.syncStorage(XStoreCursor, StorageKey.tx.store);
    this.syncRegistry(ExternalAssetCursor, StorageKey.external);
  }

  override disconnectedCallback() {
    this.unregister();
    this.channel.close();
    super.disconnectedCallback();
  }

  render() {
    return html`
      <slot></slot>
    `;
  }
}
