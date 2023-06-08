import { html, css, TemplateResult, CSSResultGroup } from 'lit';
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

import { BaseElement } from '../base/BaseElement';

export abstract class Datagrid<T> extends BaseElement {
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
        padding: 10px 0;
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
        padding: 12px 0;
        padding-right: 0;
        text-align: start;
        vertical-align: middle;
      }

      td.actions {
        width: 0px;
        padding-right: 10px;
      }

      th:first-of-type,
      td:first-of-type {
        padding-left: 16px;
      }

      th:nth-last-of-type(2),
      td:nth-last-of-type(2) {
        text-align: right;
      }

      tr.subRow > td {
        padding: 0 16px;
      }

      @media (min-width: 768px) {
        th {
          padding: 10px 0;
          font-size: 12px;
          line-height: 16px;
          font-weight: 600;
        }

        td {
          padding: 12px 0;
        }

        th:first-of-type,
        td:first-of-type {
          padding-left: 16px;
        }

        th:nth-last-of-type(2),
        td:nth-last-of-type(2) {
          text-align: start;
        }

        tr.subRow > td {
          padding: 0 16px;
        }
      }

      @media (min-width: 1024px) {
        th {
          padding: 10px 0;
        }

        td {
          padding: 12px 0;
        }

        th:first-of-type,
        td:first-of-type {
          padding-left: 32px;
        }

        tr.nested > td {
          padding: 0 32px;
        }
      }

      tr:not(.hasNested) {
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
  protected abstract nestedRowTemplate(row: Row<T>): TemplateResult;

  protected onRowClick: (row: Row<T>) => void = null;
  protected onRowRenderExpand: (row: Row<T>) => boolean = null;

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

  rowExpandTemplate(row: Row<T>) {
    return html`<tr class="expanded sub">
      <td colspan=${row.getAllCells().length}>${this.expandedRowTemplate(row)}</td>
    </tr> `;
  }

  rowNestedTemplate(row: Row<T>) {
    return html`<tr class="nested disabled">
      <td colspan=${row.getAllCells().length}>${this.nestedRowTemplate(row)}</td>
    </tr> `;
  }

  rowTemplate(row: Row<T>, i: number) {
    const expandOnRender = this.onRowRenderExpand?.(row) || false;
    const isNested = !!this.nestedRowTemplate(row);
    const isExpanded = row.getIsSelected() || expandOnRender;
    const classes = {
      hasNested: isNested,
      expanded: isExpanded,
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
      ${when(isNested, () => this.rowNestedTemplate(row))} ${when(isExpanded, () => this.rowExpandTemplate(row))}
    `;
  }

  override update(changedProperties: Map<string, unknown>) {
    const isStateChange = changedProperties.has('tableState');
    const isDataChange = changedProperties.has('defaultData');

    if (isStateChange || isDataChange) {
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
