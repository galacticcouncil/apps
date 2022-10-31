import { LitElement, html, css, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';

import { TradeNotification } from './notification';
import { DatabaseController } from './db.ctrl';
import { readyCursor } from './db';

import humanizeDuration, { HumanizerOptions } from 'humanize-duration';

import './component/BusyIndicator';
import './component/Toast';
import './component/Alert';
import './component/Drawer';

import { AlertVariant } from './component/Alert';

@customElement('app-root')
export class App extends LitElement {
  private ready = new DatabaseController<Boolean>(this, readyCursor);

  @state() snacks: TemplateResult[] = [];
  @state() notifications: Map<string, TradeNotification> = new Map([]);

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

    .time {
      color: #acb2b5;
    }

    .notification {
      margin-bottom: 10px;
    }
  `;

  onNotificationClick() {
    const drawer = this.shadowRoot.querySelector('ui-drawer');
    drawer.setAttribute('open', '');
  }

  appendNewNotification({ id, timeout, variant, mssg, status }) {
    const toast = html`
      <ui-toast open timeout=${timeout} @click=${() => this.onNotificationClick()}>
        <ui-alert variant=${variant}>
          <span> ${mssg} </span>
        </ui-alert>
      </ui-toast>
    `;
    const notification = {
      id: id,
      timestamp: Date.now(),
      message: mssg + ' ' + status,
      variant: variant,
    } as TradeNotification;
    this.snacks = [...this.snacks, toast];
    this.notifications.set(notification.id, notification);
  }

  loadingTemplate() {
    return html`
      <div class="loading">
        <ui-busy-indicator size="large">
          <span>Initializing connection</span>
        </ui-busy-indicator>
      </div>
    `;
  }

  notificationTemplate(n: TradeNotification) {
    return html`
      <ui-alert class="notification" variant=${n.variant}>
        <span>${n.message}</span>
        <span class="time">${humanizeDuration(Date.now() - n.timestamp, { round: true })} ago</span>
      </ui-alert>
    `;
  }

  render() {
    return html`
      ${when(
        this.ready.state,
        () => html`
          <header></header>
          <main @trade-notification=${(e: CustomEvent) => this.appendNewNotification(e.detail)}>
            <slot></slot>
          </main>
          <footer>${this.snacks}</footer>
          <ui-drawer>
            <span slot="title">Recent Activities</span>
            ${[...this.notifications.values()]
              .filter((n: TradeNotification) => n.variant == AlertVariant.progress)
              .sort((t1, t2) => t2.timestamp - t1.timestamp)
              .map((n: TradeNotification) => this.notificationTemplate(n))}
            ${[...this.notifications.values()]
              .filter((n: TradeNotification) => n.variant != AlertVariant.progress)
              .sort((t1, t2) => t2.timestamp - t1.timestamp)
              .map((n: TradeNotification) => this.notificationTemplate(n))}
          </ui-drawer>
        `,
        () => this.loadingTemplate()
      )}
    `;
  }
}
