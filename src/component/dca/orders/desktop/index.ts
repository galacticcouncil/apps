import { html, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import { ColumnDef, Row } from '@tanstack/table-core';

import { DcaBaseOrders } from '../base';
import { DcaOrder } from '../types';

import './transactions';

@customElement('gc-dca-orders')
export class DcaOrders extends DcaBaseOrders {
  static styles = [DcaBaseOrders.styles];

  constructor() {
    super();
    this.onRowClick = (row: Row<DcaOrder>) => {
      row.toggleSelected();
      const options = {
        bubbles: true,
        composed: true,
        detail: { id: row.original.id },
      };
      this.dispatchEvent(new CustomEvent('order-clicked', options));
    };
  }

  private actionsRowTemplate(row: Row<DcaOrder>) {
    const classes = {
      expanded: row.getIsSelected(),
    };
    return html` <uigc-icon-dropdown class=${classMap(classes)}></uigc-icon-dropdown> `;
  }

  protected defaultColumns(): ColumnDef<DcaOrder>[] {
    return [
      {
        id: 'pair',
        header: () => 'Pay with / Get',
        cell: ({ row }) => this.pairTemplate(row.original),
      },
      {
        id: 'interval',
        header: () => 'Interval (blocks)',
        accessorKey: 'interval',
      },
      {
        id: 'amount',
        header: () => 'Amount',
        cell: ({ row }) => this.getAmount(row.original),
      },
      {
        id: 'status',
        header: () => 'Status',
        cell: ({ row }) => this.statusTemplate(row.original),
      },
      {
        id: 'actions',
        cell: ({ row }) => this.actionsRowTemplate(row),
      },
    ];
  }

  protected expandedRowTemplate(row: Row<DcaOrder>): TemplateResult {
    return html`
      <div class="row">
        ${this.summaryTemplate(row.original)}
        <div class="transactions">Past transactions</div>
        <gc-dca-transactions
          .position=${row.original}
          .defaultData=${row.original.transactions.slice(0, 10)}
        ></gc-dca-transactions>
      </div>
    `;
  }

  render() {
    return html`
      <slot name="header"></slot>
      ${super.render()}
    `;
  }
}
