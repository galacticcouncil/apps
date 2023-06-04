import { css, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { ColumnDef, Row } from '@tanstack/table-core';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import { Datagrid } from '../../../datagrid';
import { formatAmount, humanizeAmount } from '../../../../utils/amount';

import { DcaPosition, DcaTransaction } from '../types';

@customElement('gc-dca-past-transactions')
export class DcaPastTransactions extends Datagrid<DcaTransaction> {
  @property({ attribute: false }) position: DcaPosition = null;

  constructor() {
    super();
    dayjs.extend(utc);
  }

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
    `,
  ];

  protected formatDate(row: Row<DcaTransaction>) {
    const dateStr = row.original.date;
    return dayjs(dateStr).format('DD-MM-YYYY HH:mm');
  }

  protected formatAmount(row: Row<DcaTransaction>) {
    const assetOutMeta = this.position.assetOutMeta;
    const amount = formatAmount(row.original.amountOut, assetOutMeta.decimals);
    return [humanizeAmount(amount), assetOutMeta.symbol].join(' ');
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
        id: 'status',
        header: () => '',
        cell: ({ row }) => row.original.status.err,
      },
    ];
  }

  protected expandedRowTemplate(_row: Row<DcaTransaction>): TemplateResult {
    return null;
  }
}
