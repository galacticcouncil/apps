import { css, html, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { when } from 'lit/directives/when.js';

import { ColumnDef, Row } from '@tanstack/table-core';

import { headerStyles } from '../../../styles/header.css';

import { DcaBasePositions } from '../base';
import { DcaPosition } from '../types';

import './transactions';

@customElement('gc-dca-positions-mob')
export class DcaPositionsMob extends DcaBasePositions {
  @state() active: DcaPosition = null;

  static styles = [
    DcaBasePositions.styles,
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
    this.onRowClick = (row: Row<DcaPosition>) => {
      this.active = row.original;
      const options = {
        bubbles: true,
        composed: true,
        detail: { id: row.original.id },
      };
      this.dispatchEvent(new CustomEvent('dca-clicked', options));
    };
  }

  private infoTemplate(position: DcaPosition) {
    return html` <div class="info">
      <span>${this.getAmount(position)}</span>
      ${this.statusTemplate(position)}
    </div>`;
  }

  private actionsTemplate(position: DcaPosition) {
    const classes = {
      right: true,
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

  protected expandedRowTemplate(_row: Row<DcaPosition>): TemplateResult {
    return null;
  }

  protected nestedRowTemplate(_row: Row<DcaPosition>): TemplateResult {
    return null;
  }

  private modalRowTemplate() {
    const position = this.active;
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
          ${this.itemTemplate('', this.pairTemplate(position))}
          ${this.itemTemplate('Status', this.statusTemplate(position))}
          ${this.itemTemplate('Block Interval', position.interval)} ${this.itemTemplate('Amount', this.getAmount(position))}
        </div>
        ${this.summaryTemplate(position)}
        <div class="transactions">Past Transactions</div>
        <gc-dca-past-transactions-mob .position=${position}></gc-dca-past-transactions-mob>
      </div>
    `;
  }

  override update(changedProperties: Map<string, unknown>) {
    super.update(changedProperties);
    const isDataChange = changedProperties.has('defaultData');
    if (isDataChange && this.active) {
      this.active = this.defaultData.find((position) => position.id == this.active.id);
    }
  }

  render() {
    return html`
      <slot name="header"></slot>
      ${super.render()} ${when(this.active, () => html` <div class="modal">${this.modalRowTemplate()}</div>`)}
    `;
  }
}
