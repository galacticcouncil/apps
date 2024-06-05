import { html, unsafeCSS, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { when } from 'lit/directives/when.js';

import { ColumnDef, Row } from '@tanstack/table-core';

import { headerStyles } from 'styles';

import { OrdersDatagrid } from '../OrdersDatagrid';
import { Order } from '../types';

import './transactions';

import styles from './index.css';

@customElement('gc-orders-list')
export class OrdersList extends OrdersDatagrid {
  @state() active: Order = null;

  static styles = [
    OrdersDatagrid.styles,
    unsafeCSS(headerStyles),
    unsafeCSS(styles),
  ];

  constructor() {
    super();
    this.onRowClick = (row: Row<Order>) => {
      this.active = row.original;
      const options = {
        bubbles: true,
        composed: true,
        detail: { id: row.original.id },
      };
      this.dispatchEvent(new CustomEvent('order-click', options));
    };
  }

  private infoTemplate(order: Order) {
    return html`
      <div class="info">
        <span>${this.getAmount(order)}</span>
        ${this.statusTemplate(order)}
      </div>
    `;
  }

  private actionsTemplate(order: Order) {
    const classes = {
      right: true,
    };
    return html`
      <uigc-icon-dropdown class=${classMap(classes)}></uigc-icon-dropdown>
    `;
  }

  protected defaultColumns(): ColumnDef<Order>[] {
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

  protected expandedRowTemplate(_row: Row<Order>): TemplateResult {
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
          }}>
          <uigc-icon-close></uigc-icon-close>
        </uigc-icon-button>
      </div>
      <div class="row">
        <div class="overview item">
          ${this.itemTemplate('', this.pairTemplate(order))}
          ${this.itemTemplate('Status', this.statusTemplate(order))}
          ${this.itemTemplate('Block Interval', order.interval)}
          ${this.itemTemplate('Amount', this.getAmount(order))}
        </div>
        ${this.summaryTemplate(order)}
        <div class="transactions">Past Transactions</div>
        <gc-orders-list-tx .order=${order}></gc-orders-list-tx>
      </div>
    `;
  }

  override update(changedProperties: Map<string, unknown>) {
    super.update(changedProperties);
    const isDataChange = changedProperties.has('defaultData');
    if (isDataChange && this.active) {
      this.active = this.defaultData.find(
        (order) => order.id == this.active.id,
      );
    }
  }

  render() {
    return html`
      <slot name="header"></slot>
      <slot name="tabs"></slot>
      ${super.render()}
      ${when(
        this.defaultData.length === 0,
        () =>
          html`
            <slot name="empty"></slot>
          `,
      )}
      ${when(
        this.active,
        () =>
          html`
            <div class="modal">${this.modalRowTemplate()}</div>
          `,
      )}
    `;
  }
}
