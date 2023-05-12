import { html } from 'lit';

import { Row } from '@tanstack/table-core';
import { Datagrid } from '../../datagrid';

import { Position } from './model';
import { positionsStyles } from './styles.css';

export abstract class DcaBasePositions extends Datagrid<Position> {
  static styles = [Datagrid.styles, positionsStyles];

  protected pairRowTemplate(row: Row<Position>) {
    return html`
      <div class="pair">
        <uigc-logo-asset fit asset=${row.original.assetIn}></uigc-logo-asset>
        <uigc-icon-arrow alt></uigc-icon-arrow>
        <uigc-logo-asset fit asset=${row.original.assetOut}></uigc-logo-asset>
      </div>
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

  protected getBudget(row: Row<Position>) {
    return [row.original.budget.remaining, '/', row.original.budget.total, row.original.assetOut].join(' ');
  }

  protected getAmount(row: Row<Position>) {
    return [row.original.amount, row.original.assetIn].join(' ');
  }

  protected getNextExecution(row: Row<Position>) {
    return row.original.nextExecution;
  }

  protected getInterval(row: Row<Position>) {
    return row.original.interval;
  }

  protected getStatus(row: Row<Position>) {
    return row.original.status;
  }

  protected summaryTemplate(row: Row<Position>) {
    return html`
      <div class="summary item">
        ${this.itemTemplate('Remaining / Total Budget', this.getBudget(row))}
        ${this.itemTemplate('Next Execution', this.getNextExecution(row))}
        <uigc-button variant="secondary" size="small">Actions</uigc-button>
      </div>
    `;
  }
}
