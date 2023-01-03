import { html, css, LitElement, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';

import short from 'short-uuid';
import '@galacticcouncil/ui';

import { signAndSend, signAndSendOb } from '../../api/transaction';
import { txRecord } from '../../utils/event';

import { TxInfo, TxNotification } from './types';
import { Notification, NotificationType } from '../notification/types';

@customElement('gc-transaction-center')
export class TransactionCenter extends LitElement {
  @state() message: TemplateResult = null;
  @state() currentTx: string = null;

  private _handleOnChainTx = (e: CustomEvent<TxInfo>) => this.handleTx(short.generate(), e.detail);
  private _handleCrossChainTx = (e: CustomEvent<TxInfo>) => this.handleTxXcm(short.generate(), e.detail);

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

  private logInBlockMessage(txId: string, hash: string) {
    console.log(`[${txId}] Completed at block hash #${hash}`);
  }

  private logXcmpMessage(txId: string, chain: string, method: string, hash: string) {
    console.log(`[${txId}] Chain: (${chain}) xcmpQueue.${method} with hash #${hash}`);
  }

  handleTx(txId: string, txInfo: TxInfo) {
    signAndSend(
      txInfo.transaction.get(),
      txInfo.account,
      ({ events, status }) => {
        const type = status.type.toLowerCase();
        switch (type) {
          case 'broadcast':
            this.handleBroadcasted(txId, txInfo.notification);
            break;
          case 'inblock':
            this.logInBlockMessage(txId, status.asInBlock.toString());
            const txEvent = txRecord(events).event;
            const txError = 'ExtrinsicFailed' === txEvent.method;
            this.handleInBlock(txId, txInfo.notification, txError);
            break;
        }
      },
      (_error) => {
        this.handleError(txId, txInfo.notification);
      }
    );
  }

  handleTxXcm(txId: string, txInfo: TxInfo) {
    signAndSendOb(
      txInfo.transaction.get(),
      txInfo.account,
      ({ events, status }) => {
        const type = status.type.toLowerCase();
        switch (type) {
          case 'broadcast':
            this.handleBroadcasted(txId, txInfo.notification);
            break;
          case 'inblock':
            this.logInBlockMessage(txId, status.asInBlock.toString());
            const txEvent = txRecord(events).event;
            const txError = 'ExtrinsicFailed' === txEvent.method;
            this.handleInBlock(txId, txInfo.notification, txError);
            break;
        }
      },
      (_error) => {
        this.handleError(txId, txInfo.notification);
      }
    );
  }

  private handleBroadcasted(id: string, notification: TxNotification) {
    this.currentTx = id;
    this.message = this.broadcastTemplate(id, notification.processing);
    this.sendNotification(id, NotificationType.progress, notification.processing, false);
  }

  private handleError(id: string, notification: TxNotification) {
    this.message = this.errorTemplate(id);
    this.sendNotification(id, NotificationType.error, notification.failure, false);
  }

  private handleInBlock(id: string, notification: TxNotification, error: boolean) {
    if (id == this.currentTx) {
      this.closeDialog(id);
    }

    if (error) {
      this.sendNotification(id, NotificationType.error, notification.failure, true);
    } else {
      this.sendNotification(id, NotificationType.success, notification.success, true);
    }
  }

  sendNotification(id: string, type: NotificationType, message: string | TemplateResult, toast: boolean) {
    const options = {
      bubbles: true,
      composed: true,
      detail: {
        id: id,
        timestamp: Date.now(),
        type: type,
        message: message,
        toast: toast,
      } as Notification,
    };
    const notificationEvent = new CustomEvent<Notification>('gc:notification:new', options);
    this.dispatchEvent(notificationEvent);
  }

  closeDialogGracefully(id: string): void {
    const dialog = this.shadowRoot.getElementById(id);
    dialog.removeAttribute('open');
    dialog.remove();
  }

  closeDialog(id: string) {
    this.closeDialogGracefully(id);
    this.message = null;
    this.currentTx = null;
  }

  closeBroadcastDialog(id: string, message: string | TemplateResult) {
    this.closeDialog(id);
    this.sendNotification(id, NotificationType.progress, message, true);
  }

  broadcastTemplate(id: string, message: string | TemplateResult) {
    return html`
      <uigc-dialog
        open
        id=${id}
        timeout="3000"
        @closeable-closed=${(e: CustomEvent) => this.closeBroadcastDialog(id, message)}
      >
        <uigc-circular-progress class="icon"></uigc-circular-progress>
        <uigc-typography variant="title">Submitted</uigc-typography>
        <span>Fantastic! Data has been broadcasted and awaits confirmation on the blockchain.</span>
        <uigc-button variant="secondary" @click=${() => this.closeBroadcastDialog(id, message)}>Close</uigc-button>
      </uigc-dialog>
    `;
  }

  errorTemplate(id: string) {
    return html`
      <uigc-dialog open id=${id}>
        <uigc-icon-error-alt fit class="icon"></uigc-icon-error-alt>
        <uigc-typography variant="title" error>Failed to submit</uigc-typography>
        <span>Unfortunatelly there was an issue while broadcasting your transaction. Please try again later.</span>
        <uigc-button variant="secondary" @click=${() => this.closeDialog(id)}>Close</uigc-button>
      </uigc-dialog>
    `;
  }

  override connectedCallback() {
    super.connectedCallback();
    this.addEventListener('gc:tx:new', this._handleOnChainTx);
    this.addEventListener('gc:tx:newXcm', this._handleCrossChainTx);
  }

  override disconnectedCallback() {
    this.removeEventListener('gc:tx:new', this._handleOnChainTx);
    this.removeEventListener('gc:tx:newXcm', this._handleCrossChainTx);
    super.disconnectedCallback();
  }

  render() {
    return html`
      <div>${this.message}</div>
      <slot></slot>
    `;
  }
}
