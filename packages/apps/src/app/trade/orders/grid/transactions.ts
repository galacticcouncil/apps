import { html, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { ColumnDef, Row } from '@tanstack/table-core';
import { ZERO } from '@galacticcouncil/sdk';

import { Datagrid } from 'element/datagrid';
import { formatAmount, humanizeAmount } from 'utils/amount';

import { Order, OrderTransaction } from '../types';

import styles from './transactions.css';

@customElement('gc-orders-grid-tx')
export class OrdersGridTx extends Datagrid<OrderTransaction> {
  @property({ attribute: false }) order: Order = null;

  static styles = [Datagrid.styles, styles];

  protected formatDate(row: Row<OrderTransaction>) {
    const dateStr = row.original.date;
    if (dateStr) {
      return this._dayjs(dateStr).format('DD-MM-YYYY HH:mm');
    } else {
      return 'Now';
    }
  }

  protected formatAmount(row: Row<OrderTransaction>) {
    const received = row.original.amountOut;
    if (received.isEqualTo(ZERO)) {
      return '-';
    }
    const { decimals, symbol } = this.order.assetOut;
    const amount = formatAmount(row.original.amountOut, decimals);
    return [humanizeAmount(amount), symbol].join(' ');
  }

  protected formatPrice(row: Row<OrderTransaction>) {
    const received = row.original.amountOut;
    if (received.isEqualTo(ZERO)) {
      return '-';
    }

    const { assetIn, assetOut } = this.order;

    const aIn = row.original.amountIn.shiftedBy(-1 * assetIn.decimals);
    const aOut = row.original.amountOut.shiftedBy(-1 * assetOut.decimals);

    const price = aIn.div(aOut);
    return [humanizeAmount(price.toFixed()), assetIn.symbol].join(' ');
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

  protected getStatus(row: Row<OrderTransaction>) {
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

  protected defaultColumns(): ColumnDef<OrderTransaction>[] {
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

  protected expandedRowTemplate(_row: Row<OrderTransaction>): TemplateResult {
    return null;
  }
}
