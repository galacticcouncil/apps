import { html, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { Datagrid } from 'element/datagrid';
import { humanizeAmount } from 'utils/amount';

import { AnyChain } from '@galacticcouncil/xcm-core';
import { ColumnDef, Row } from '@tanstack/table-core';

import 'element/id/AssetIdenticon';

import { Transfer, TransferStatus } from '../types';

import styles from './TransfersDatagrid.css';

@customElement('gc-transfers-grid')
export class TransfersDatagrid extends Datagrid<Transfer> {
  @property({ type: Boolean }) isMobile = false;

  constructor() {
    super();
    this.onRowClick = (row: Row<Transfer>) => {
      const url =
        'https://wormholescan.io/#/tx/' +
        row.original.sourceChain.transaction.txHash;
      window.open(url);
    };
  }

  static styles = [Datagrid.styles, styles];

  protected pairTemplate(transfer: Transfer) {
    const { content } = transfer;
    const { fromChain, toChain } = content.info;

    return html`
      <div class="pair">
        ${this.chainTemplate(fromChain)}
        <uigc-icon-arrow alt></uigc-icon-arrow>
        ${this.chainTemplate(toChain)}
      </div>
    `;
  }

  private chainTemplate(chain: AnyChain) {
    return html`
      <uigc-logo-chain .chain=${chain.key}></uigc-logo-chain>
    `;
  }

  protected itemTemplate(label: string, value: any) {
    return html`
      <div>
        <span class="label">${label}</span>
        <span class="value">${value}</span>
      </div>
    `;
  }

  protected getAmount(transfer: Transfer) {
    const { data } = transfer;
    return [humanizeAmount(data.tokenAmount), data.symbol].join(' ');
  }

  protected getTime(transfer: Transfer) {
    const info = transfer.sourceChain.timestamp;
    return html`
      <span>
        ${this._humanizer.humanize(Date.now() - Number(info) * 1000, {
          round: true,
          largest: 1,
        })}
        ago
      </span>
    `;
  }

  protected getStatusSm(transfer: Transfer) {
    return html`
      <div>${this.getAmount(transfer)}</div>
      <div class="alt">${this.getTime(transfer)}</div>
      <div>${this.getStatus(transfer)}</div>
    `;
  }

  protected getStatus(transfer: Transfer) {
    const info = transfer.content.info;
    switch (info.status) {
      case TransferStatus.Completed:
        return this.completedTemplate();
      case TransferStatus.VaaEmitted:
        return this.emittedTemplate();
      case TransferStatus.WaitingForVaa:
        return this.pendingTemplate();
      default:
        return '-';
    }
  }

  private pendingTemplate() {
    return html`
      <div class="status pending">
        <span>Waiting for VAA</span>
      </div>
    `;
  }

  private emittedTemplate() {
    return html`
      <div class="status emitted">
        <span>VAA Emitted</span>
      </div>
    `;
  }

  private completedTemplate() {
    return html`
      <div class="status complete">
        <span>Completed</span>
      </div>
    `;
  }

  protected defaultColumns(): ColumnDef<Transfer>[] {
    if (this.isMobile) {
      return [
        {
          id: 'pair',
          header: () => 'From / To',
          cell: ({ row }) => this.pairTemplate(row.original),
        },
        {
          id: 'status',
          header: () => 'Status',
          cell: ({ row }) => this.getStatusSm(row.original),
        },
      ];
    }
    return [
      {
        id: 'pair',
        header: () => 'From / To',
        cell: ({ row }) => this.pairTemplate(row.original),
      },
      {
        id: 'time',
        header: () => 'Time',
        cell: ({ row }) => this.getTime(row.original),
      },
      {
        id: 'amount',
        header: () => 'Amount',
        cell: ({ row }) => this.getAmount(row.original),
      },
      {
        id: 'status',
        header: () => 'Status',
        cell: ({ row }) => this.getStatus(row.original),
      },
    ];
  }

  protected expandedRowTemplate(row: Row<Transfer>): TemplateResult {
    throw new Error('Method not implemented.');
  }

  render() {
    return html`
      ${super.render()}
    `;
  }
}
