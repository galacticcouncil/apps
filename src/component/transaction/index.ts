import { html, css, LitElement, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';

import '@galacticcouncil/ui';

import { Notification, NotificationType } from '../notification/types';

@customElement('gc-transaction-center')
export class TransactionCenter extends LitElement {
  @state() message: TemplateResult = null;
  @state() currentTx: string = null;

  static styles = [
    css`
      uigc-typography {
        margin-top: 20px;
        margin-bottom: 10px;
      }

      span {
        color: var(--uigc-app-font-color__alternative);
        font-weight: 400;
        font-size: 16px;
        line-height: 22px;
        text-align: center;
        margin-top: 20px;
        margin-bottom: 40px;
        padding-left: 20px;
        padding-right: 20px;
      }

      .icon {
        padding-top: 50px;
        width: 135px;
        height: 135px;
      }
    `,
  ];

  constructor() {
    super();
    this.addEventListener('gc:tx:broadcasted', (e: CustomEvent<Notification>) => this.handleBroadcasted(e.detail));
    this.addEventListener('gc:tx:submitted', (e: CustomEvent<Notification>) => this.handleSubmitted(e.detail));
    this.addEventListener('gc:tx:failed', (e: CustomEvent<Notification>) => this.handleError(e.detail));
  }

  handleBroadcasted(n: Notification) {
    this.currentTx = n.id;
    this.message = this.broadcastTemplate(n);
    this.sendNotification(n.id, NotificationType.progress, n.message, false);
  }

  handleError(n: Notification) {
    this.message = this.errorTemplate(n);
    this.sendNotification(n.id, NotificationType.error, n.message, false);
  }

  handleSubmitted(n: Notification) {
    if (n.id == this.currentTx) {
      this.message = this.successTemplate(n);
      this.sendNotification(n.id, NotificationType.success, n.message, false);
    } else {
      this.sendNotification(n.id, NotificationType.success, n.message, true);
    }
  }

  sendNotification(id: string, type: NotificationType, message: string | TemplateResult, toast: boolean) {
    const options = {
      bubbles: true,
      composed: true,
      detail: { id: id, timestamp: Date.now(), type: type, message: message, toast: toast } as Notification,
    };
    this.dispatchEvent(new CustomEvent<Notification>('gc:notification', options));
  }

  closeDialog() {
    this.message = null;
    this.currentTx = null;
  }

  closeBroadcastDialog(n: Notification) {
    this.closeDialog();
    this.sendNotification(n.id, NotificationType.progress, n.message, true);
  }

  broadcastTemplate(n: Notification) {
    return html`
      <uigc-dialog open>
        <uigc-circular-progress class="icon"></uigc-circular-progress>
        <uigc-typography variant="title">Submitting...</uigc-typography>
        <span>Fantastic! Data has been broadcasted and awaits confirmation on the blockchain.</span>
        <uigc-button variant="secondary" @click=${() => this.closeBroadcastDialog(n)}>Close</uigc-button>
      </uigc-dialog>
    `;
  }

  successTemplate(n: Notification) {
    return html`
      <uigc-dialog open timeout="6000">
        <uigc-icon-success-alt fit class="icon"></uigc-icon-success-alt>
        <uigc-typography variant="title">Submitted</uigc-typography>
        <span>Fantastic! Data has been broadcasted and awaits confirmation on the blockchain.</span>
        <uigc-button variant="secondary" @click=${() => this.closeDialog()}>Close</uigc-button>
      </uigc-dialog>
    `;
  }

  errorTemplate(n: Notification) {
    return html`
      <uigc-dialog open>
        <uigc-icon-error-alt fit class="icon"></uigc-icon-error-alt>
        <uigc-typography variant="title" error>Failed to submit</uigc-typography>
        <span>Unfortunatelly there was an issue while broadcasting your transaction. Please try again later.</span>
        <uigc-button variant="secondary" @click=${() => this.closeDialog()}>Close</uigc-button>
      </uigc-dialog>
    `;
  }

  render() {
    return html`
      <div @closeable-closed=${(e: CustomEvent) => this.closeDialog()}>${this.message}</div>
      <slot></slot>
    `;
  }
}
