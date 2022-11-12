import { LitElement, html, css, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';

import humanizeDuration, { HumanizerOptions } from 'humanize-duration';

import '../../component/Toast';
import '../../component/Alert';
import '../../component/Drawer';

import { Notification, NotificationType } from './types';

@customElement('app-notification-center')
export class NotificationCenter extends LitElement {
  @state() snacks: TemplateResult[] = [];
  @state() notifications: Map<string, Notification> = new Map([]);

  static styles = css`
    .notification {
      margin-bottom: 10px;
    }

    .time {
      color: #acb2b5;
    }

    .message {
      color: var(--hex-neutral-gray-100);
    }

    .message .highlight {
      font-weight: 600;
      color: var(--hex-white);
    }
  `;

  constructor() {
    super();
    this.addEventListener('gc:notification', (e: CustomEvent<Notification>) => this.appendNewNotification(e.detail));
  }

  openDrawer() {
    const drawer = this.shadowRoot.querySelector('ui-drawer');
    drawer.setAttribute('open', '');
  }

  appendNewNotification(n: Notification) {
    if (n.toast) {
      const toast = html`
        <ui-toast open timeout="6000" @click=${() => this.openDrawer()}>
          <ui-alert variant=${n.type}> ${this.notificationMessage(n.message)}</ui-alert>
        </ui-toast>
      `;
      this.snacks = [...this.snacks, toast];
    }
    this.notifications.set(n.id, n);
  }

  notificationMessage(message: string | TemplateResult) {
    if (typeof message === 'string') {
      return html` <span class="message">${message}</span> `;
    }
    return html` <span class="message">${message}</span> `;
  }

  notificationTemplate(n: Notification) {
    return html`
      <ui-alert class="notification" variant=${n.type}>
        ${this.notificationMessage(n.message)}
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
