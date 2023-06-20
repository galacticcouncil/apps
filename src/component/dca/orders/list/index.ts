import { css, html, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { when } from 'lit/directives/when.js';

import { ColumnDef, Row } from '@tanstack/table-core';

import { headerStyles } from '../../../styles/header.css';

import { DcaBaseDatagrid } from '../datagrid';
import { DcaOrder } from '../types';

import './transactions';

@customElement('gc-dca-list')
export class DcaOrdersList extends DcaBaseDatagrid {
  @state() active: DcaOrder = null;

  static styles = [
    DcaBaseDatagrid.styles,
    headerStyles,
    css`
      .modal {
        position: fixed;
        background: var(--uigc-paper-background);
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        z-index: 10;
        overflow: hidden;
      }

      .row {
        display: flex;
        flex-direction: column;
        height: calc(100% - 64px);
        overflow-y: auto;
        position: relative;
      }

      .summary {
        background-color: rgba(255, 255, 255, 0.03);
      }

      .info {
        display: flex;
        flex-direction: column;
      }

      .status {
        font-size: 14px;
      }

      .overview {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 1fr 1fr;
        row-gap: 20px;
      }

      .overview .label {
        text-transform: uppercase;
      }

      .transactions {
        position: sticky;
        z-index: 1;
        top: 0;
        background-color: var(--uigc-paper-background);
      }
    `,
  ];

  constructor() {
    super();
    this.onRowClick = (row: Row<DcaOrder>) => {
      this.active = row.original;
      const options = {
        bubbles: true,
        composed: true,
        detail: { id: row.original.id },
      };
      this.dispatchEvent(new CustomEvent('order-clicked', options));
    };
  }

  private infoTemplate(order: DcaOrder) {
    return html` <div class="info">
      <span>${this.getAmount(order)}</span>
      ${this.statusTemplate(order)}
    </div>`;
  }

  private actionsTemplate(order: DcaOrder) {
    const classes = {
      right: true,
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
        id: 'info',
        header: () => 'Amount / Status',
        cell: ({ row }) => this.infoTemplate(row.original),
      },
      {
        id: 'actions',
        cell: ({ row }) => this.actionsTemplate(row.original),
      },
    ];
  }

  protected expandedRowTemplate(_row: Row<DcaOrder>): TemplateResult {
    return null;
  }

  private modalRowTemplate() {
    const order = this.active;
    return html`
      <div class="header section">
        <span></span>
        <uigc-typography variant="section">Position details</uigc-typography>
        <uigc-icon-button
          class="close"
          @click=${() => {
            this.active = null;
          }}
        >
          <uigc-icon-close></uigc-icon-close>
        </uigc-icon-button>
      </div>
      <div class="row">
        <div class="overview item">
          ${this.itemTemplate('', this.pairTemplate(order))} ${this.itemTemplate('Status', this.statusTemplate(order))}
          ${this.itemTemplate('Block Interval', order.interval)} ${this.itemTemplate('Amount', this.getAmount(order))}
        </div>
        ${this.summaryTemplate(order)}
        <div class="transactions">Past Transactions</div>
        <gc-dca-list-tx .position=${order}></gc-dca-list-tx>
      </div>
    `;
  }

  override update(changedProperties: Map<string, unknown>) {
    super.update(changedProperties);
    const isDataChange = changedProperties.has('defaultData');
    if (isDataChange && this.active) {
      this.active = this.defaultData.find((order) => order.id == this.active.id);
    }
  }

  render() {
    return html`
      <slot name="header"></slot>
      ${super.render()} ${when(this.active, () => html` <div class="modal">${this.modalRowTemplate()}</div>`)}
    `;
  }
}
