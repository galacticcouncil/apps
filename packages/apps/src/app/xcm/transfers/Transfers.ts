import { html, css, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { WatchContractEventReturnType } from 'viem';

import { BaseApp } from 'app/BaseApp';
import { Account } from 'db';

import { TransferApi } from './api';
import { Transfer, TransferStatus } from './types';

import '@galacticcouncil/ui';
import { Operation } from '@galacticcouncil/xcm-sdk';

import './TransfersDatagrid';

@customElement('gc-transfers')
export class Transfers extends BaseApp {
  private transferApi: TransferApi = null;
  private transferSubs: WatchContractEventReturnType[] = [];

  @property({ type: Number }) blockNo = null;

  @state() transfers: Transfer[] = [];
  @state() width: number = window.innerWidth;

  static styles = [
    css`
      @media (min-width: 1024px) {
        :host {
          min-height: 350px;
        }
      }

      .transfers {
        background: var(--uigc-app-background-color);
        overflow: hidden;
        position: relative;
        display: block;
      }

      @media (min-width: 480px) {
        .transfers {
          border-radius: var(--uigc-app-border-radius);
        }

        .transfers:before {
          content: '';
          border-radius: var(--uigc-app-border-radius);
          position: absolute;
          inset: 0px;

          padding: 1px;

          background: linear-gradient(
            180deg,
            rgba(152, 176, 214, 0.27) 0%,
            rgba(163, 177, 199, 0.15) 66.67%,
            rgba(158, 167, 180, 0.2) 100%
          );

          -webkit-mask: var(--uigc-paper-mask);
          -webkit-mask-composite: xor;
          mask: var(--uigc-paper-mask);
          mask-composite: exclude;
          pointer-events: none;
        }
      }
    `,
  ];

  private resetTransfers() {
    this.transfers = [];
  }

  private async syncTransfers() {
    if (!this.hasAccount()) {
      return;
    }

    const account = this.account.state;
    this.transferSubs.forEach((s) => s());
    this.transferSubs = await this.transferApi.subscribeTransfers(
      account.address,
      (t) => {
        console.log(t);
        t.content.info.status = TransferStatus.WaitingForVaa;
        this.transfers = [t, ...this.transfers];
      },
    );

    Promise.all([
      this.transferApi.getTransfers(account.address),
      this.transferApi.getOperations(account.address),
    ]).then(([transfers, operations]) => {
      this.transfers = transfers.sort(
        (a, b) =>
          Number(b.sourceChain.timestamp) - Number(a.sourceChain.timestamp),
      );
      this.syncStatus(operations);
    });
  }

  private async getStatus(transfer: Transfer, operation: Operation) {
    if (operation) {
      const isComplete = await this.transferApi.isTransferComplete(
        transfer,
        operation.vaa.raw,
      );
      return isComplete ? TransferStatus.Completed : TransferStatus.VaaEmitted;
    } else {
      return TransferStatus.WaitingForVaa;
    }
  }

  private async syncStatus(operations: Map<string, Operation>) {
    const updated = this.transfers.map(async (transfer: Transfer) => {
      const { id, content } = transfer;
      if (content.info.status === TransferStatus.Completed) {
        return transfer;
      }

      const operation = operations.get(id);
      const status = await this.getStatus(transfer, operation);
      transfer.content.info.status = status;
      return transfer;
    });
    this.transfers = await Promise.all(updated);
  }

  private async init() {
    this.transferApi = new TransferApi();
  }

  protected async onAccountChange(prev: Account, curr: Account): Promise<void> {
    if (curr) {
      this.syncTransfers();
    } else {
      this.resetTransfers();
    }
  }

  private updateTransfers() {
    if (!this.hasAccount()) {
      return;
    }

    const account = this.account.state;
    const pending = this.transfers.filter(
      (t) => t.content.info?.status !== TransferStatus.Completed,
    );
    if (pending.length > 0) {
      console.log(pending.length + ' pending transfers...');
      this.transferApi.getOperations(account.address).then((operactions) => {
        this.syncStatus(operactions);
      });
    } else {
      this.syncStatus(new Map());
    }
  }

  updated(changed: PropertyValues<this>) {
    const blockNo = changed.get('blockNo');
    if (blockNo) {
      this.updateTransfers();
    }
  }

  onResize(_evt: UIEvent) {
    this.width = window.innerWidth;
  }

  override connectedCallback() {
    super.connectedCallback();
    window.addEventListener('resize', (evt) => this.onResize(evt));
    this.init();
    this.syncTransfers();
  }

  override disconnectedCallback() {
    this.transferSubs.forEach((s) => s());
    window.removeEventListener('resize', this.onResize);
    super.disconnectedCallback();
  }

  render() {
    const data = this.transfers;
    if (data.length === 0) {
      return null;
    }

    if (this.width > 768) {
      return html`
        <gc-transfers-grid
          class="transfers"
          .defaultData=${data}
          .showHeader=${false}></gc-transfers-grid>
      `;
    } else {
      return html`
        <gc-transfers-grid
          class="transfers"
          .defaultData=${data}
          .isMobile=${true}
          .showHeader=${false}></gc-transfers-grid>
      `;
    }
  }
}
