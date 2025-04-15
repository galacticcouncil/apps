import { html, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { Datagrid } from 'element/datagrid';
import { getChainEcosystem, getChainId } from 'utils/chain';
import { humanizeAmount } from 'utils/amount';

import { AnyChain, Wormhole } from '@galacticcouncil/xcm-core';

import { ColumnDef, Row } from '@tanstack/table-core';

import 'element/id/AssetIdenticon';

import styles from './RedeemDatagrid.css';

import { RedeemApi } from './api';
import { StandartizedOperation, TransferStatus } from '../types';

@customElement('gc-redeem-grid')
export class RedeemDatagrid extends Datagrid<StandartizedOperation> {
  private redeemApi: RedeemApi = null;

  @property({ type: Boolean }) isMobile = false;

  constructor() {
    super();
    this.redeemApi = new RedeemApi();
  }

  static styles = [Datagrid.styles, styles];

  protected fromTemplate(operation: StandartizedOperation) {
    const { info } = operation;

    return html`
      <div class="pair">
        ${this.chainTemplate(info.fromChain)}
        <div class="summary">
          <span>${this.fromLink(operation)}</span>
          <span>${this.getAmount(operation)}</span>
        </div>
      </div>
    `;
  }

  protected fromLink(operation: StandartizedOperation) {
    const { info } = operation;
    const { from, fromChain } = info;

    const id = Wormhole.fromChain(fromChain).getWormholeId();
    const address = this.shortenAddress(from);

    let link: string;
    switch (id) {
      case 1:
        link = 'https://solscan.io/account/';
        break;
      case 2:
        link = 'https://etherscan.io/address/';
        break;
      default:
        link = undefined;
    }

    if (link) {
      return html`
        <a href="${link}${from}" target="_blank">${address}</a>
      `;
    }
    return address;
  }

  protected toTemplate(operation: StandartizedOperation) {
    const { info } = operation;
    const { to, toChain } = info;

    const link = 'https://hydration.subscan.io/account/';
    const address = this.shortenAddress(to);

    return html`
      <div class="pair">
        ${this.chainTemplate(toChain)}
        <div class="summary">
          <span>
            <a href="${link}${to}?tab=xcm_transfer" target="_blank">
              ${address}
            </a>
          </span>
        </div>
      </div>
    `;
  }

  protected txHashTemplate(operation: StandartizedOperation) {
    const { sourceChain } = operation;

    const txHash = sourceChain.transaction.txHash;
    return html`
      <a href="https://wormholescan.io/#/tx/${txHash}" target="_blank">
        ${this.shortenAddress(txHash)}
      </a>
    `;
  }

  private shortenAddress(address: string) {
    if (!address || address.length < 10) return address;

    const start = address.slice(0, 6);
    const end = address.slice(-6);
    return `${start}...${end}`;
  }

  private chainTemplate(chain: AnyChain) {
    return html`
      <uigc-logo-chain
        .ecosystem=${getChainEcosystem(chain)}
        .chain=${getChainId(chain)}></uigc-logo-chain>
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

  protected getAmount(operation: StandartizedOperation) {
    const { data } = operation;
    return [humanizeAmount(data.tokenAmount), data.symbol].join(' ');
  }

  protected getTime(operation: StandartizedOperation) {
    const { sourceChain } = operation;
    const date = new Date(sourceChain.timestamp);
    return html`
      <span>
        ${this._humanizer.humanize(Date.now() - Number(date), {
          round: true,
          largest: 1,
        })}
        ago
      </span>
    `;
  }

  protected getActions(operation: StandartizedOperation) {
    return html`
      <uigc-button
        class="confirm"
        variant=${'secondary'}
        size="micro"
        fullWidth
        @click=${() => {
          this.redeemApi.checkAndRedeem(
            operation.vaa.raw,
            '0x7C0350baEd3A5016faE4560C6293d8AC8a16354F',
          );
        }}>
        Redeem
      </uigc-button>
    `;
  }

  protected getStatus(operation: StandartizedOperation) {
    const info = operation.info;
    switch (info.status) {
      case TransferStatus.Completed:
        return this.completedTemplate();
      case TransferStatus.WaitingForVaa:
        return this.pendingTemplate();
      case TransferStatus.VaaEmitted:
        return this.getActions(operation);
      default:
        return '-';
    }
  }

  private pendingTemplate() {
    return html`
      <div class="status processing">
        <span>Processing</span>
      </div>
    `;
  }

  private completedTemplate() {
    return html`
      <div class="status complete">
        <span>Completed</span>
      </div>
    `;
  }

  protected defaultColumns(): ColumnDef<StandartizedOperation>[] {
    if (this.isMobile) {
      return [
        {
          id: 'txHash',
          header: () => 'Tx hash',
          cell: ({ row }) => this.txHashTemplate(row.original),
        },
        {
          id: 'from',
          header: () => 'From',
          cell: ({ row }) => this.fromTemplate(row.original),
        },
        {
          id: 'to',
          header: () => 'To',
          cell: ({ row }) => this.toTemplate(row.original),
        },
        {
          id: 'time',
          header: () => 'Time',
          cell: ({ row }) => this.getTime(row.original),
        },
        {
          id: 'status',
          header: () => '',
          cell: ({ row }) => this.getStatus(row.original),
        },
      ];
    }
    return [
      {
        id: 'txHash',
        header: () => 'Tx hash',
        cell: ({ row }) => this.txHashTemplate(row.original),
      },
      {
        id: 'from',
        header: () => 'From',
        cell: ({ row }) => this.fromTemplate(row.original),
      },
      {
        id: 'to',
        header: () => 'To',
        cell: ({ row }) => this.toTemplate(row.original),
      },
      {
        id: 'time',
        header: () => 'Time',
        cell: ({ row }) => this.getTime(row.original),
      },
      {
        id: 'status',
        header: () => '',
        cell: ({ row }) => this.getStatus(row.original),
      },
    ];
  }

  protected expandedRowTemplate(
    row: Row<StandartizedOperation>,
  ): TemplateResult {
    throw new Error('Method not implemented.');
  }

  render() {
    return html`
      <slot name="header"></slot>
      <slot name="tabs"></slot>
      ${super.render()}
      <slot name="placeholder"></slot>
    `;
  }
}
