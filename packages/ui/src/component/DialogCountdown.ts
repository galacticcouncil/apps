import { html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { asyncReplace } from 'lit/directives/async-replace.js';
import { when } from 'lit/directives/when.js';

import { UIGCElement } from './base/UIGCElement';

async function* countDown(count: number) {
  while (count >= 0) {
    yield count--;
    await new Promise((r) => setTimeout(r, 1000));
  }
}

@customElement('uigc-dialog-countdown')
export class DialogCountdown extends UIGCElement {
  @property({ type: Number }) timeout = null;
  @state() private timer = null;

  static styles = css`
    :host {
      font-weight: var(--uigc-dialog-cnt-font-weight);
      font-size: var(--uigc-dialog-cnt-font-size);
      line-height: var(--uigc-dialog-cnt-line-height);
      text-align: center;
      color: var(--uigc-dialog-cnt-color);
    }

    :host .countdown-root {
      height: 22px;
      min-width: 120px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .countdown-root span {
      color: var(--uigc-app-font-color__primary);
    }
  `;

  override async firstUpdated() {
    this.timer = countDown(this.timeout / 1000);
  }

  render() {
    return html`
      <div class="countdown-root">
        ${when(
          this.timer,
          () => html`
            Closing window in&nbsp
            <span>${asyncReplace(this.timer)}s</span>
          `,
        )}
      </div>
    `;
  }
}
