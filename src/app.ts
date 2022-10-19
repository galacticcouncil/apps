import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';

import { DatabaseController } from './db.ctrl';
import { readyCursor } from './db';

import './component/BusyIndicator';

@customElement('app-root')
export class App extends LitElement {
  private ready = new DatabaseController<Boolean>(this, readyCursor);

  static styles = css`
    header {
      height: var(--toolbar-height);
    }

    main {
      width: 100%;
    }

    .loading {
      width: 100%;
      height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
  `;

  loadingTemplate() {
    return html`
      <div class="loading">
        <ui-busy-indicator size="large">
          <span>Initializing connection</span>
        </ui-busy-indicator>
      </div>
    `;
  }

  render() {
    return html`
      ${when(
        this.ready.state,
        () => html`
          <header></header>
          <main>
            <slot></slot>
          </main>
          <footer></footer>
        `,
        () => this.loadingTemplate()
      )}
    `;
  }
}
