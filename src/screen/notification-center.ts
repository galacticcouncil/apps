import { LitElement, html, css, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';

import humanizeDuration, { HumanizerOptions } from 'humanize-duration';

import '../component/Toast';
import '../component/Alert';
import '../component/Drawer';

export enum NotificationType {
  success = 'success',
  error = 'error',
  progress = 'progress',
  default = '',
}

export type Notification = {
  id: string;
  timestamp: number;
  message: string;
  type: NotificationType;
};

@customElement('app-notification-center')
export class NotificationCenter extends LitElement {
  @state() snacks: TemplateResult[] = [];
  @state() notifications: Map<string, Notification> = new Map([]);

  static styles = css`
    .notification {
      margin-bottom: 10px;
    }

    .notification .time {
      color: #acb2b5;
    }
  `;

  constructor() {
    super();
    this.addEventListener('trade-notification', (e: CustomEvent<Notification>) => this.appendNewNotification(e.detail));
  }

  openDrawer() {
    const drawer = this.shadowRoot.querySelector('ui-drawer');
    drawer.setAttribute('open', '');
  }

  appendNewNotification(n: Notification) {
    const toast = html`
      <ui-toast open @click=${() => this.openDrawer()}>
        <ui-alert variant=${n.type}>
          <span> ${n.message} </span>
        </ui-alert>
      </ui-toast>
    `;
    this.snacks = [...this.snacks, toast];
    this.notifications.set(n.id, n);
  }

  notificationTemplate(n: Notification) {
    return html`
      <ui-alert class="notification" variant=${n.type}>
        <span>${n.message}</span>
        <span class="time">${humanizeDuration(Date.now() - n.timestamp, { round: true })} ago</span>
      </ui-alert>
    `;
  }

  render() {
    return html`
      ${this.snacks}
      <ui-drawer>
        <span slot="title">Recent Activities</span>
        ${[...this.notifications.values()]
          .filter((n: Notification) => n.type == NotificationType.progress)
          .sort((t1, t2) => t2.timestamp - t1.timestamp)
          .map((n: Notification) => this.notificationTemplate(n))}
        ${[...this.notifications.values()]
          .filter((n: Notification) => n.type != NotificationType.progress)
          .sort((t1, t2) => t2.timestamp - t1.timestamp)
          .map((n: Notification) => this.notificationTemplate(n))}
      </ui-drawer>
      <slot></slot>
    `;
  }
}
