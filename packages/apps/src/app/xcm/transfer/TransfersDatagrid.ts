import { html, css, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';

import { Datagrid } from 'element/datagrid';
import { humanizeAmount } from 'utils/amount';

import { transferStyles } from './datagrid.css';
import { Transfer } from './types';

import { chainsMap } from '@galacticcouncil/xcm-cfg';
import { AnyChain, WormholeChain } from '@galacticcouncil/xcm-core';

import 'element/id/AssetIdenticon';
import { ColumnDef, Row } from '@tanstack/table-core';

@customElement('gc-transfers-grid')
export class TransfersDatagrid extends Datagrid<Transfer> {
  static styles = [
    Datagrid.styles,
    transferStyles,
    css`
      uigc-logo-chain {
        width: 24px;
      }
    `,
  ];

  private getWormholeChains(): WormholeChain[] {
    return Array.from(chainsMap.values()).filter((c) => {
      const whc = c as WormholeChain;
      try {
        whc.getWormholeId();
        return true;
      } catch {
        return false;
      }
    }) as WormholeChain[];
  }

  protected pairTemplate(transfer: Transfer) {
    const { sourceChain, content } = transfer;
    const srcChain = this.getWormholeChains().find(
      (c) => c.getWormholeId() === sourceChain.chainId,
    );
    const dstChain = this.getWormholeChains().find(
      (c) => c.getWormholeId() === content.payload.toChain,
    );

    return html`
      <div class="pair">
        ${this.chainTemplate(srcChain as AnyChain)}
        <uigc-icon-arrow alt></uigc-icon-arrow>
        ${this.chainTemplate(dstChain as AnyChain)}
      </div>
    `;
  }

  private chainTemplate(chain: AnyChain) {
    return html`
      <uigc-logo-chain .chain=${chain.key}></uigc-logo-chain>
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

  protected getAmount(transfer: Transfer) {
    const { data } = transfer;
    return [humanizeAmount(data.tokenAmount), data.symbol].join(' ');
  }

  protected getStatus(transfer: Transfer) {
    return 'status';
  }

  protected defaultColumns(): ColumnDef<Transfer>[] {
    return [
      {
        id: 'pair',
        header: () => 'From / To',
        cell: ({ row }) => this.pairTemplate(row.original),
      },
      {
        id: 'amount',
        header: () => 'Amount',
        cell: ({ row }) => this.getAmount(row.original),
      },
      {
        id: 'status',
        header: () => 'Status',
        cell: ({ row }) => this.getStatus(row.original),
      },
    ];
  }

  protected expandedRowTemplate(row: Row<Transfer>): TemplateResult {
    throw new Error('Method not implemented.');
  }

  render() {
    return html`
      <slot name="header"></slot>
      ${super.render()}
      ${when(
        this.defaultData.length === 0,
        () =>
          html`
            <slot name="empty"></slot>
          `,
      )}
    `;
  }
}
