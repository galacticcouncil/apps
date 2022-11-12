import { html, css, LitElement, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';

import '../../component/Dialog';
import '../../component/CircularProgress';
import '../../component/icons/Success';
import '../../component/icons/Error';

import { Notification, NotificationType } from '../notification/types';

@customElement('app-transaction-center')
export class TransactionCenter extends LitElement {
  @state() message: TemplateResult = null;
  @state() currentTx: string = null;

  static styles = [
    css`
      h1 {
        font-weight: 600;
        font-size: 24px;
        line-height: 32px;
        margin-top: 20px;
        margin-bottom: 10px;
      }

      h1.ok {
        background: var(--gradient-label);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      h1.error {
        color: var(--hex-red-400);
      }

      span {
        color: var(--hex-neutral-gray-200);
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
      }

      icon-success,
      icon-error {
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
      <ui-dialog open>
        <ui-circular-progress class="icon" .width=${'135px'} .height=${'135px'}></ui-circular-progress>
        <h1 class="ok">Submiting...</h1>
        <span>Fantastic! Data has been broadcasted and awaits confirmation on the blockchain.</span>
        <ui-button variant="secondary" @click=${() => this.closeBroadcastDialog(n)}>Close</ui-button>
      </ui-dialog>
    `;
  }

  successTemplate(n: Notification) {
    return html`
      <ui-dialog open timeout="6000">
        <icon-success class="icon"></icon-success>
        <h1 class="ok">Submitted</h1>
        <span>Fantastic! Data has been broadcasted and awaits confirmation on the blockchain.</span>
        <ui-button variant="secondary" @click=${() => this.closeDialog()}>Close</ui-button>
      </ui-dialog>
    `;
  }

  errorTemplate(n: Notification) {
    return html`
      <ui-dialog open>
        <icon-error class="icon"></icon-error>
        <h1 class="error">Failed to submit</h1>
        <span>Unfortunatelly there was an issue while broadcasting your transaction. Please try again later.</span>
        <ui-button variant="secondary" @click=${() => this.closeDialog()}>Close</ui-button>
      </ui-dialog>
    `;
  }

  render() {
    return html`
      <div @closeable-closed=${(e: CustomEvent) => this.closeDialog()}>${this.message}</div>
      <slot></slot>
    `;
  }
}
