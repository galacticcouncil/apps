import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import { DatabaseController } from '../db.ctrl';
import { readyCursor } from '../db';

import '../component/BusyIndicator';

@customElement('app-root')
export class Root extends LitElement {
  private ready = new DatabaseController<Boolean>(this, readyCursor);

  static styles = css`
    .loading {
      display: none;
      flex-direction: column;
      justify-content: center;
      position: absolute;
      top: 50%;
      left: 50%;
      margin-top: -100px;
      margin-left: -100px;
      width: 200px;
      height: 200px;
    }

    .loading.show {
      display: flex;
    }

    .app.hide {
      display: none;
    }
  `;

  render() {
    const loadingClasses = {
      loading: true,
      show: !this.ready.state,
    };
    const appClasses = {
      app: true,
      hide: !this.ready.state,
    };
    return html`
      <div class=${classMap(loadingClasses)}>
        <ui-busy-indicator size="large">
          <span>Initializing connection</span>
        </ui-busy-indicator>
      </div>
      <div class=${classMap(appClasses)}>
        <slot></slot>
      </div>
    `;
  }
}
