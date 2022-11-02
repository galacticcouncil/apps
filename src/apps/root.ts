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
      width: 100%;
      height: 100vh;
      display: none;
      flex-direction: column;
      justify-content: center;
    }

    .loading.show {
      display: flex;
    }
  `;

  render() {
    const classes = {
      loading: true,
      show: !this.ready.state,
    };
    return html`
      <div class=${classMap(classes)}>
        <ui-busy-indicator size="large">
          <span>Initializing connection</span>
        </ui-busy-indicator>
      </div>
      <slot></slot>
    `;
  }
}
