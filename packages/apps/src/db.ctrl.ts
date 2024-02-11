import { ReactiveController, ReactiveControllerHost } from 'lit';
import type { Cursor } from '@thi.ng/atom/cursor';

import short from 'short-uuid';

export class DatabaseController<T> implements ReactiveController {
  private readonly host: ReactiveControllerHost;
  private watchId: string;
  private cursor: Cursor<T>;

  state: T = null;

  constructor(host: ReactiveControllerHost, cursor: Cursor<T>) {
    this.state = cursor.deref();
    this.host = host;
    this.watchId = short.generate();
    this.cursor = cursor;
    host.addController(this);
  }

  hostConnected() {
    this.cursor.addWatch(this.watchId, (id, prev, curr) => {
      this.state = curr;
      this.host.requestUpdate();
    });
  }

  hostDisconnected() {
    this.cursor.removeWatch(this.watchId);
  }
}
