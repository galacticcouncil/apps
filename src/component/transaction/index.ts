import { html, css, LitElement, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';

import type { ISubmittableResult } from '@polkadot/types/types';

import * as i18n from 'i18next';
import short from 'short-uuid';
import '@galacticcouncil/ui';

import { signAndSend, signAndSendOb } from '../../api/transaction';
import { txRecord } from '../../utils/event';

import { TxInfo, TxNotification } from './types';
import { Notification, NotificationType } from '../notification/types';

@customElement('gc-transaction-center')
export class TransactionCenter extends LitElement {
  private txBroadcasted: Set<string> = new Set([]);

  @state() message: TemplateResult = null;
  @state() currentTx: string = null;

  private _handleOnChainTx = (e: CustomEvent<TxInfo>) => this.handleTx(short.generate(), e.detail);
  private _handleCrossChainTx = (e: CustomEvent<TxInfo>) => this.handleTxXcm(short.generate(), e.detail);

  static styles = [
    css`
      uigc-typography {
        margin-top: 20px;
        margin-bottom: 10px;
        text-align: center;
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

  private blockMeta(result: ISubmittableResult, blockHash: string): Record<string, string> {
    const meta: Record<string, string> = {};
    meta['blockHash'] = blockHash;
    meta['txIndex'] = result.txIndex.toString();
    return meta;
  }

  handleTx(txId: string, txInfo: TxInfo) {
    signAndSend(
      txInfo.transaction,
      txInfo.account,
      (res) => {
        const { events, status } = res;
        const type = status.type.toLowerCase();
        switch (type) {
          case 'broadcast':
            this.handleBroadcasted(txId, txInfo.notification);
            break;
          case 'inblock':
            const blockHash = status.asInBlock.toString();
            const meta = this.blockMeta(res, blockHash);
            this.logInBlockMessage(txId, blockHash);
            const txEvent = txRecord(events).event;
            const txError = 'ExtrinsicFailed' === txEvent.method;
            this.handleInBlock(txId, txInfo.notification, txError, meta);
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
      (res) => {
        const { events, status } = res;
        const type = status.type.toLowerCase();
        switch (type) {
          case 'broadcast':
            this.handleBroadcasted(txId, txInfo.notification);
            break;
          case 'inblock':
            const blockHash = status.asInBlock.toString();
            const meta = this.blockMeta(res, blockHash);
            this.logInBlockMessage(txId, blockHash);
            const txEvent = txRecord(events).event;
            const txError = 'ExtrinsicFailed' === txEvent.method;
            this.handleInBlock(txId, txInfo.notification, txError, meta);
            break;
        }
      },
      (_error) => {
        this.handleError(txId, txInfo.notification);
      }
    );
  }

  private handleBroadcasted(id: string, { processing }: TxNotification) {
    const isBroadcasted = this.txBroadcasted.has(id);
    if (isBroadcasted) {
      return;
    } else {
      this.txBroadcasted.add(id);
    }
    this.currentTx = id;
    this.message = this.broadcastTemplate(id, processing.message);
    this.sendNotification(id, NotificationType.progress, processing.message, false);
  }

  private handleError(id: string, { failure }: TxNotification) {
    this.message = this.errorTemplate(id);
    this.sendNotification(id, NotificationType.error, failure.message, false);
  }

  private handleInBlock(
    id: string,
    { success, failure }: TxNotification,
    error: boolean,
    meta?: Record<string, string>
  ) {
    if (id == this.currentTx) {
      this.closeDialog(id);
    }

    if (error) {
      this.sendNotification(id, NotificationType.error, failure.message, true, meta);
    } else {
      this.sendNotification(id, NotificationType.success, success.message, true, meta);
    }
  }

  sendNotification(
    id: string,
    type: NotificationType,
    message: string | TemplateResult,
    toast: boolean,
    meta?: Record<string, string>
  ) {
    const options = {
      bubbles: true,
      composed: true,
      detail: {
        id: id,
        timestamp: Date.now(),
        type: type,
        message: message,
        toast: toast,
        meta: meta,
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
        <uigc-typography variant="title">${i18n.t('tx.submitted')}</uigc-typography>
        <span>${i18n.t('tx.submittedText')}</span>
        <uigc-button variant="secondary" @click=${() => this.closeBroadcastDialog(id, message)}
          >${i18n.t('tx.close')}</uigc-button
        >
      </uigc-dialog>
    `;
  }

  errorTemplate(id: string) {
    return html`
      <uigc-dialog open id=${id}>
        <uigc-icon-error-alt fit class="icon"></uigc-icon-error-alt>
        <uigc-typography variant="title" error>${i18n.t('tx.failed')}</uigc-typography>
        <span>${i18n.t('tx.failedText')}</span>
        <uigc-button variant="secondary" @click=${() => this.closeDialog(id)}>${i18n.t('tx.close')}</uigc-button>
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
