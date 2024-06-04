import { html, css, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';

import { Datagrid } from 'element/datagrid';
import { humanizeAmount } from 'utils/amount';

import { transferStyles } from './datagrid.css';

import { AnyChain } from '@galacticcouncil/xcm-core';
import { ColumnDef, Row } from '@tanstack/table-core';

import 'element/id/AssetIdenticon';

import { Transfer, TransferStatus } from './types';

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

  static styles = [
    Datagrid.styles,
    transferStyles,
    css`
      uigc-logo-chain {
        width: 24px;
      }

      tr td:first-child {
        width: 75px;
      }

      tr td:last-child {
        text-align: right;
      }

      td:first-of-type,
      td:last-of-type {
        padding: 12px 14px;
      }

      @media (min-width: 768px) {
        td:first-of-type,
        td:last-of-type {
          padding: 12px 28px;
        }
      }

      div.status {
        display: inline-flex;
        align-items: center;
      }

      div.alt {
        color: #999ba7;
      }

      div.status.pending > span {
        color: #85d1ff;
      }

      div.status.emitted > span {
        color: #53a4f3;
      }

      div.status.complete > span {
        color: #00ffa0;
      }

      div.status > span {
        margin-left: 3px;
      }
    `,
  ];

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
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none">
          <path
            d="M13.5479 3.38733H11.9297V1.76857H10.311V0.150391H3.69397V1.76857H2.07521V3.38675L0.457031 3.38732V10.0043H2.07521V11.6231H3.69339L3.69396 13.2413H10.311V11.6231H11.9297L11.9292 10.0043H13.5479V3.38733ZM10.1673 11.4794H3.83768V9.86063H2.21892V3.53104H3.8371L3.83767 1.91228H10.1673V3.53046H11.786V9.86005L10.1673 9.86062L10.1673 11.4794Z"
            fill="#85D1FF" />
          <path
            d="M7.07888 6.62308V3.38672H5.31641V8.38555H10.3152V6.62308H7.07888Z"
            fill="#85D1FF" />
        </svg>
        <span>Waiting for VAA</span>
      </div>
    `;
  }

  private emittedTemplate() {
    return html`
      <div class="status emitted">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none">
          <rect
            x="1.33203"
            y="8.4248"
            width="2.61972"
            height="2.61972"
            fill="#53a4f3" />
          <rect
            x="3.95312"
            y="11.0449"
            width="2.61972"
            height="2.61972"
            fill="#53a4f3" />
          <rect
            x="11.8086"
            y="5.80469"
            width="2.61972"
            height="2.61972"
            transform="rotate(90 11.8086 5.80469)"
            fill="#53a4f3" />
          <rect
            x="9.19141"
            y="8.42383"
            width="2.61972"
            height="2.61972"
            transform="rotate(90 9.19141 8.42383)"
            fill="#53a4f3" />
          <rect
            x="6.57031"
            y="11.0439"
            width="2.61972"
            height="2.61972"
            transform="rotate(90 6.57031 11.0439)"
            fill="#53a4f3" />
          <rect
            x="14.4297"
            y="3.18457"
            width="2.61972"
            height="2.61972"
            transform="rotate(90 14.4297 3.18457)"
            fill="#53a4f3" />
        </svg>
        <span>VAA Emitted</span>
      </div>
    `;
  }

  private completedTemplate() {
    return html`
      <div class="status complete">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none">
          <rect
            x="1.33203"
            y="8.4248"
            width="2.61972"
            height="2.61972"
            fill="#00FFA0" />
          <rect
            x="3.95312"
            y="11.0449"
            width="2.61972"
            height="2.61972"
            fill="#00FFA0" />
          <rect
            x="11.8086"
            y="5.80469"
            width="2.61972"
            height="2.61972"
            transform="rotate(90 11.8086 5.80469)"
            fill="#00FFA0" />
          <rect
            x="9.19141"
            y="8.42383"
            width="2.61972"
            height="2.61972"
            transform="rotate(90 9.19141 8.42383)"
            fill="#00FFA0" />
          <rect
            x="6.57031"
            y="11.0439"
            width="2.61972"
            height="2.61972"
            transform="rotate(90 6.57031 11.0439)"
            fill="#00FFA0" />
          <rect
            x="14.4297"
            y="3.18457"
            width="2.61972"
            height="2.61972"
            transform="rotate(90 14.4297 3.18457)"
            fill="#00FFA0" />
        </svg>
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
