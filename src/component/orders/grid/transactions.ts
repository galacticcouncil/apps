import { css, html, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { ColumnDef, Row } from '@tanstack/table-core';

import { Datagrid } from '../../datagrid';
import { formatAmount, humanizeAmount } from '../../../utils/amount';

import { DcaOrder, DcaTransaction } from '../types';
import { ZERO } from '@galacticcouncil/sdk';

@customElement('gc-dca-grid-tx')
export class DcaOrdersGridTx extends Datagrid<DcaTransaction> {
  @property({ attribute: false }) order: DcaOrder = null;

  static styles = [
    Datagrid.styles,
    css`
      tbody tr {
        color: #b2b6c5;
      }

      tbody tr:last-child {
        border-bottom: none;
      }

      tr {
        cursor: default;
      }

      .status {
        font-weight: 500;
        font-size: 13px;
        line-height: 100%;
        display: flex;
        align-items: center;
        height: 20px;
      }

      .error span {
        color: #ffec8a;
      }

      .success span {
        color: #30ffb1;
      }

      .pending span {
        color: #85d1ff;
      }

      uigc-icon-success {
        width: 30px;
        margin-left: -3px;
      }

      uigc-icon-warning {
        margin-right: 3px;
      }

      uigc-circular-progress {
        width: 18px;
        height: 18px;
        margin-right: 6px;
        margin-left: 3px;
      }
    `,
  ];

  protected formatDate(row: Row<DcaTransaction>) {
    const dateStr = row.original.date;
    if (dateStr) {
      return this._dayjs(dateStr).format('DD-MM-YYYY HH:mm');
    } else {
      return 'Now';
    }
  }

  protected formatAmount(row: Row<DcaTransaction>) {
    const received = row.original.amountOut;
    if (received.isEqualTo(ZERO)) {
      return '-';
    }
    const assetOutMeta = this.order.assetOutMeta;
    const amount = formatAmount(row.original.amountOut, assetOutMeta.decimals);
    return [humanizeAmount(amount), assetOutMeta.symbol].join(' ');
  }

  protected formatPrice(row: Row<DcaTransaction>) {
    const received = row.original.amountOut;
    if (received.isEqualTo(ZERO)) {
      return '-';
    }

    const { assetInMeta, assetOutMeta } = this.order;

    const aIn = row.original.amountIn.shiftedBy(-1 * assetInMeta.decimals);
    const aOut = row.original.amountOut.shiftedBy(-1 * assetOutMeta.decimals);

    const price = aIn.div(aOut);
    return [humanizeAmount(price.toFixed()), assetInMeta.symbol].join(' ');
  }

  errorStatusTemplate(error: string) {
    return html`
      <div class="status error">
        <uigc-icon-warning fit></uigc-icon-warning>
        <span>${error}</span>
      </div>
    `;
  }

  successStatusTemplate() {
    return html`
      <div class="status success">
        <uigc-icon-success></uigc-icon-success>
        <span>Success</span>
      </div>
    `;
  }

  pendingStatusTemplate() {
    return html`
      <div class="status pending">
        <uigc-circular-progress></uigc-circular-progress>
        <span>Pending</span>
      </div>
    `;
  }

  protected getStatus(row: Row<DcaTransaction>) {
    const tx = row.original;
    const err = tx.status.err;
    const type = tx.status.type;

    if (err) {
      return this.errorStatusTemplate(err);
    }

    if ('TradePending' === type) {
      return this.pendingStatusTemplate();
    }

    return this.successStatusTemplate();
  }

  protected defaultColumns(): ColumnDef<DcaTransaction>[] {
    return [
      {
        id: 'date',
        header: () => 'Date',
        cell: ({ row }) => this.formatDate(row),
      },
      {
        id: 'received',
        header: () => 'Received',
        cell: ({ row }) => this.formatAmount(row),
      },
      {
        id: 'price',
        header: () => 'Price',
        cell: ({ row }) => this.formatPrice(row),
      },
      {
        id: 'status',
        header: () => 'Status',
        cell: ({ row }) => this.getStatus(row),
      },
    ];
  }

  protected expandedRowTemplate(_row: Row<DcaTransaction>): TemplateResult {
    return null;
  }
}
