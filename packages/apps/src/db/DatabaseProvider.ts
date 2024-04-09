import { customElement } from 'lit/decorators.js';
import { Cursor } from '@thi.ng/atom';

import { Database, DatabaseKey } from './db';
import { getObj, setObj } from './storage';

import { BaseElement } from 'element/BaseElement';

@customElement('gc-database-provider')
export class DatabaseProvider extends BaseElement {
  private cursors: Cursor<any>[] = [];

  private register<T>(cursor: Cursor<T>, key: string) {
    const storedVal = getObj<T>(key);
    const defaultVal = cursor.deref();
    cursor.reset({ ...defaultVal, ...storedVal });
    cursor.addWatch(key, (id, prev, curr) => {
      const prevJson = JSON.stringify(prev);
      const currJson = JSON.stringify(curr);
      if (prevJson !== currJson) {
        console.log(`${id}: ${prevJson} -> ${currJson}`);
        setObj(key, curr);
      }
    });
    this.cursors.push(cursor);
  }

  override connectedCallback() {
    super.connectedCallback();
    this.register(Database.account, DatabaseKey.account);
    this.register(Database.config.dca, DatabaseKey.config.dca);
    this.register(Database.config.trade, DatabaseKey.config.trade);
    this.register(Database.config.external, DatabaseKey.config.external);
    this.cursors.forEach((c: Cursor<any>) => console.log(c.id));
  }

  override disconnectedCallback() {
    this.cursors.forEach((c: Cursor<any>) => c.removeWatch(c.id));
    super.disconnectedCallback();
  }
}
