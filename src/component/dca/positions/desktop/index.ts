import { html, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import { ColumnDef, Row } from '@tanstack/table-core';

import { DcaBasePositions } from '../base';
import { DcaPosition } from '../types';

import './transactions';

@customElement('gc-dca-positions')
export class DcaPositions extends DcaBasePositions {
  static styles = [DcaBasePositions.styles];

  constructor() {
    super();
    this.onRowClick = (row: Row<DcaPosition>) => {
      row.toggleSelected();
      const options = {
        bubbles: true,
        composed: true,
        detail: { id: row.original.id },
      };
      this.dispatchEvent(new CustomEvent('dca-clicked', options));
    };
  }

  private actionsRowTemplate(row: Row<DcaPosition>) {
    const classes = {
      expanded: row.getIsSelected(),
    };
    return html` <uigc-icon-dropdown class=${classMap(classes)}></uigc-icon-dropdown> `;
  }

  protected defaultColumns(): ColumnDef<DcaPosition>[] {
    return [
      {
        id: 'pair',
        header: () => 'Pay With / Get',
        cell: ({ row }) => this.pairTemplate(row.original),
      },
      {
        id: 'interval',
        header: () => 'Block Interval',
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

  protected expandedRowTemplate(row: Row<DcaPosition>): TemplateResult {
    return html`
      <div class="row">
        ${this.summaryTemplate(row.original)}
        <div class="transactions">Past Transactions</div>
        <gc-dca-past-transactions
          .position=${row.original}
          .defaultData=${row.original.transactions.slice(0, 10)}
        ></gc-dca-past-transactions>
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
