import { css, html, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { ColumnDef, Row } from '@tanstack/table-core';

import { Datagrid } from '../../../datagrid';
import { formatAmount, humanizeAmount } from '../../../../utils/amount';

import { DcaPosition, DcaTransaction } from '../types';
import { ZERO } from '@galacticcouncil/sdk';

@customElement('gc-dca-past-transactions')
export class DcaPastTransactions extends Datagrid<DcaTransaction> {
  @property({ attribute: false }) position: DcaPosition = null;

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

      .error {
        font-size: 10px;
        font-size: 12px;
        display: flex;
        align-items: center;
      }

      .error span {
        color: #ffec8a;
      }

      uigc-icon-warning {
        margin-right: 5px;
      }
    `,
  ];

  protected formatDate(row: Row<DcaTransaction>) {
    const dateStr = row.original.date;
    return this._dayjs(dateStr).format('DD-MM-YYYY HH:mm');
  }

  protected formatAmount(row: Row<DcaTransaction>) {
    const received = row.original.amountOut;
    if (received.isEqualTo(ZERO)) {
      return '-';
    }
    const assetOutMeta = this.position.assetOutMeta;
    const amount = formatAmount(row.original.amountOut, assetOutMeta.decimals);
    return [humanizeAmount(amount), assetOutMeta.symbol].join(' ');
  }

  protected formatPrice(row: Row<DcaTransaction>) {
    const received = row.original.amountOut;
    if (received.isEqualTo(ZERO)) {
      return '-';
    }

    const { assetInMeta, assetOutMeta } = this.position;

    const aIn = row.original.amountIn.shiftedBy(-1 * assetInMeta.decimals);
    const aOut = row.original.amountOut.shiftedBy(-1 * assetOutMeta.decimals);

    const price = aOut.div(aIn);
    return [humanizeAmount(price.toFixed()), assetOutMeta.symbol].join(' ');
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
    ];
  }

  protected expandedRowTemplate(row: Row<DcaTransaction>): TemplateResult {
    return html`
      <div class="error">
        <uigc-icon-warning red></uigc-icon-warning>
        <span>${row.original.status.desc}</span>
      </div>
    `;
  }

  protected nestedRowTemplate(row: Row<DcaTransaction>): TemplateResult {
    if (row.original.status.type == 'TradeFailed') {
      return html`
        <div class="error">
          <uigc-icon-warning></uigc-icon-warning>
          <span>${row.original.status.desc}</span>
        </div>
      `;
    }
    return null;
  }
}
