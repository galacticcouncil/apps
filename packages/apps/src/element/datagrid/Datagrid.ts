import { html, CSSResultGroup, TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { classMap } from 'lit/directives/class-map.js';

import { baseStyles } from 'styles';
import { BaseElement } from 'element/BaseElement';

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

import styles from './Datagrid.css';

export abstract class Datagrid<T> extends BaseElement {
  @state() table: Table<T> = null;
  @state() tableState: TableState | {} = {};

  @property({ attribute: false }) defaultData: T[] = [];
  @property({ type: Boolean }) showHeader = true;

  private ro = new ResizeObserver((entries) => {
    entries.forEach((_entry) => {});
  });

  static styles = [baseStyles, styles] as CSSResultGroup;

  protected abstract defaultColumns(): ColumnDef<T>[];
  protected abstract expandedRowTemplate(row: Row<T>): TemplateResult;

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
        this.tableState =
          typeof updater === 'function'
            ? updater(this.table.getState())
            : updater;
      },
    });
  }

  override async firstUpdated() {
    this.initTable();
  }

  headerTemplate(headerGroup: HeaderGroup<T>) {
    if (this.showHeader) {
      return html`
        <tr>
          ${headerGroup.headers.map((header: Header<T, unknown>) => {
            return html`
              <th>
                ${flexRender(
                  header.column.columnDef.header,
                  header.getContext(),
                )}
              </th>
            `;
          })}
        </tr>
      `;
    }
  }

  rowExpandTemplate(row: Row<T>) {
    return html`
      <tr class="expanded sub">
        <td colspan=${row.getAllCells().length}>
          ${this.expandedRowTemplate(row)}
        </td>
      </tr>
    `;
  }

  rowTemplate(row: Row<T>, i: number) {
    const expandOnRender = this.onRowRenderExpand?.(row) || false;
    const isExpanded = row.getIsSelected() || expandOnRender;
    const classes = {
      expanded: isExpanded,
      disabled: !this.onRowClick,
    };
    return html`
      <tr class=${classMap(classes)} @click=${() => this.onRowClick?.(row)}>
        ${row.getVisibleCells().map((cell: Cell<T, unknown>) => {
          const collDef = cell.column.columnDef;
          const tdClass = collDef.id == 'actions' ? 'actions' : null;
          return html`
            <td class=${tdClass}>
              ${flexRender(collDef.cell, cell.getContext())}
            </td>
          `;
        })}
      </tr>
      ${when(isExpanded, () => this.rowExpandTemplate(row))}
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
