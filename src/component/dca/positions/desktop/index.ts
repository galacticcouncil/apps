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
    };
  }

  private amountRowTemplate(row: Row<DcaPosition>) {
    return html` <span>${row.original.amount + ' ' + row.original.assetIn}</span> `;
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
        header: () => 'Invest / Get',
        cell: ({ row }) => this.pairRowTemplate(row),
      },
      {
        id: 'interval',
        header: () => 'Interval',
        accessorKey: 'interval',
      },
      {
        id: 'amount',
        header: () => 'Amount',
        cell: ({ row }) => this.amountRowTemplate(row),
      },
      {
        id: 'status',
        header: () => 'Status',
        cell: ({ row }) => this.statusRowTemplate(row),
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
        ${this.summaryTemplate(row)}
        <div class="transactions">Past Transactions</div>
        <gc-dca-past-transactions .defaultData=${row.original.transactions}></gc-dca-past-transactions>
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
