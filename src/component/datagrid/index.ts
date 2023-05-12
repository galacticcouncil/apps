import { LitElement, html, css, TemplateResult, CSSResultGroup } from 'lit';
import { property, state } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { classMap } from 'lit/directives/class-map.js';

import { baseStyles } from '../styles/base.css';

import {
  Cell,
  ColumnDef,
  Header,
  HeaderGroup,
  Row,
  Table,
  TableState,
  getCoreRowModel,
  getFilteredRowModel,
  getExpandedRowModel,
} from '@tanstack/table-core';
import { useLitTable, flexRender } from './utils';

export abstract class Datagrid<T> extends LitElement {
  @state() table: Table<T> = null;
  @state() tableState: TableState | {} = {};

  @property({ attribute: false }) defaultData: T[] = [];

  private ro = new ResizeObserver((entries) => {
    entries.forEach((_entry) => {});
  });

  static styles = [
    baseStyles,
    css`
      :host {
        font-family: var(--uigc-app-font);
      }

      table {
        width: 100%;
        border-spacing: 0;
        color: var(--hex-white);
        border-collapse: collapse;
      }

      th {
        padding: 10px 0 10px 16px;
        line-height: 14px;
        font-size: 11px;
        font-weight: 500;
        text-transform: uppercase;
        text-align: start;
        color: var(--hex-basic-600);
        white-space: nowrap;
        cursor: pointer;
      }

      td {
        padding: 12px 16px;
        padding-right: 0;
        text-align: start;
        vertical-align: middle;
      }

      th:nth-last-of-type(2),
      td:nth-last-of-type(2) {
        text-align: right;
      }

      @media (min-width: 768px) {
        th {
          padding: 10px 32px;
          font-size: 12px;
          line-height: 16px;
          font-weight: 600;
        }

        td {
          padding: 12px 32px;
        }

        th:nth-last-of-type(2),
        td:nth-last-of-type(2) {
          text-align: start;
        }
      }

      tr {
        border-bottom: 1px solid rgba(255, 255, 255, 0.06);
      }

      tr:not(.sub):not(.disabled):hover {
        background: rgba(var(--rgb-white), 0.06);
        cursor: pointer;
      }

      tr.expanded {
        background: rgba(255, 255, 255, 0.03);
      }

      tr.expanded td[colspan] {
        padding: 0;
      }

      td.actions {
        width: 0px;
        padding-right: 10px;
      }

      uigc-icon-dropdown {
        opacity: 0.5;
        display: block;
        text-align: center;
        width: 24px;
      }

      uigc-icon-dropdown.expanded {
        opacity: 1;
        transform: rotate(180deg);
      }

      uigc-icon-dropdown.right {
        transform: rotate(270deg);
      }
    `,
  ] as CSSResultGroup;

  protected abstract defaultColumns(): ColumnDef<T>[];
  protected abstract expandedRowTemplate(row: Row<T>): TemplateResult;

  protected onRowClick: (row: Row<T>) => void = null;

  protected initTable() {
    this.table = useLitTable<T>({
      state: this.tableState,
      data: this.defaultData,
      columns: this.defaultColumns(),
      getCoreRowModel: getCoreRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      getExpandedRowModel: getExpandedRowModel(),
      onStateChange: (updater) => {
        this.tableState = typeof updater === 'function' ? updater(this.table.getState()) : updater;
      },
    });
  }

  override async firstUpdated() {
    this.initTable();
  }

  headerTemplate(headerGroup: HeaderGroup<T>) {
    return html`
      <tr>
        ${headerGroup.headers.map((header: Header<T, unknown>) => {
          return html` <th>${flexRender(header.column.columnDef.header, header.getContext())}</th> `;
        })}
      </tr>
    `;
  }

  rowTemplate(row: Row<T>, i: number) {
    const classes = {
      expanded: row.getIsSelected(),
      disabled: !this.onRowClick,
    };
    return html`
      <tr class=${classMap(classes)} @click=${() => this.onRowClick?.(row)}>
        ${row.getVisibleCells().map((cell: Cell<T, unknown>) => {
          const collDef = cell.column.columnDef;
          const tdClass = collDef.id == 'actions' ? 'actions' : null;
          return html` <td class=${tdClass}>${flexRender(collDef.cell, cell.getContext())}</td> `;
        })}
      </tr>
      ${when(
        row.getIsSelected(),
        () =>
          html`<tr class="expanded sub">
            <td colspan=${row.getAllCells().length}>${this.expandedRowTemplate(row)}</td>
          </tr> `
      )}
    `;
  }

  update(changedProperties: Map<string, unknown>) {
    const isStateChange = changedProperties.has('tableState');
    if (isStateChange) {
      this.initTable();
    }
    super.update(changedProperties);
  }

  override connectedCallback() {
    super.connectedCallback();
    this.ro.observe(this);
  }

  override disconnectedCallback() {
    this.ro.unobserve(this);
    super.disconnectedCallback();
  }

  render() {
    return html`
      <table>
        <thead>
          ${this.table?.getHeaderGroups().map((hg) => {
            return this.headerTemplate(hg);
          })}
        </thead>
        <tbody>
          ${this.table?.getRowModel().rows.map((row, i) => {
            return this.rowTemplate(row, i);
          })}
        </tbody>
      </table>
    `;
  }
}
