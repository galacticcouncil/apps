import { html, css } from 'lit';

import { Row } from '@tanstack/table-core';
import { Datagrid } from '../../datagrid';

import { Position } from './model';
import { positionsStyles } from './base.css';

export abstract class DcaBasePositions extends Datagrid<Position> {
  static styles = [
    Datagrid.styles,
    positionsStyles,
    css`
      uigc-button svg {
        margin-right: -8px;
      }

      uigc-button path {
        stroke: var(--uigc-app-font-color__primary);
        transition: 0.2s ease-in-out;
      }

      uigc-button:hover path {
        stroke: #fff;
        transition: 0.2s ease-in-out;
      }
    `,
  ];

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
        <uigc-button variant="secondary" size="small"
          >Actions
          <svg hdx="" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M7.99414 10.5L11.9994 13.5L16.0046 10.5"
              stroke="#fff"
              stroke-width="2"
              stroke-linecap="square"
            ></path>
          </svg>
        </uigc-button>
      </div>
    `;
  }
}
