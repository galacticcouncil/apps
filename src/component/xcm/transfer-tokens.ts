import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Account, accountCursor } from '../../db';
import { DatabaseController } from '../../db.ctrl';

import { baseStyles } from '../base.css';

@customElement('gc-xcm-app-main')
export class TradeTokens extends LitElement {
  private account = new DatabaseController<Account>(this, accountCursor);

  @property({ type: String }) from = null;
  @property({ type: String }) to = null;
  @property({ type: String }) address = null;
  @property({ type: String }) amount = null;
  @property({ type: String }) asset = null;
  @property({ type: String }) balance = null;
  @property({ type: Boolean }) disabled = false;

  static styles = [
    baseStyles,
    css`
      :host {
        display: flex;
        flex-direction: column;
        height: 100%;
      }

      .header {
        display: flex;
        padding: 22px 28px;
        box-sizing: border-box;
        align-items: center;
        height: 84px;
      }

      .header uigc-typography {
        margin-top: 5px;
      }

      .transfer {
        display: flex;
        flex-direction: column;
        padding: 0 14px;
        box-sizing: border-box;
        row-gap: 11px;
      }

      @media (min-width: 768px) {
        .transfer {
          padding: 0 28px;
        }
      }

      .transfer .chain {
        display: flex;
        justify-content: space-between;
        align-items: center;
        grid-gap: 11px;
      }

      .transfer .switch {
        transform: rotate(270deg);
      }

      .transfer .label {
        font-weight: 500;
        font-size: 14px;
        line-height: 100%;
        color: rgba(255, 255, 255, 0.7);
      }

      .info {
        display: flex;
        flex-direction: column;
        margin-top: 10px;
        padding: 0 24px;
        box-sizing: border-box;
      }

      @media (min-width: 768px) {
        .info {
          padding: 0 38px;
        }
      }

      .info .row {
        display: flex;
        align-items: center;
        position: relative;
        gap: 5px;
        padding: 4px 0;
      }

      .info .row:not(:last-child):after {
        background-color: var(--hex-background-gray-800);
        bottom: 0;
        content: ' ';
        height: 1px;
        position: absolute;
        width: 100%;
      }

      .info .label {
        font-weight: 500;
        font-size: 14px;
        line-height: 22px;
        text-align: left;
        color: var(--hex-neutral-gray-300);
      }

      .info .value {
        font-weight: 500;
        font-size: 14px;
        line-height: 22px;
        text-align: right;
        color: var(--hex-white);
      }

      .confirm {
        display: flex;
        padding: 22px 14px;
        box-sizing: border-box;
      }

      @media (min-width: 768px) {
        .confirm {
          padding: 22px 28px;
        }
      }
    `,
  ];

  transferFeeTemplate(label: string, tradeFee: string, assetSymbol: string) {
    return html` <span class="label">${label}</span>
      <span class="grow"></span>
      <span class="value">${tradeFee} ${assetSymbol}</span>`;
  }

  onSwitchClick(e: any) {
    const options = {
      bubbles: true,
      composed: true,
    };
    this.dispatchEvent(new CustomEvent('chain-switch-clicked', options));
  }

  onTransferClick(e: any) {
    const options = {
      bubbles: true,
      composed: true,
    };
    this.dispatchEvent(new CustomEvent('transfer-clicked', options));
  }

  onMaxClick(e: any) {
    const options = {
      bubbles: true,
      composed: true,
    };
    this.dispatchEvent(new CustomEvent('max-clicked', options));
  }

  render() {
    return html`
      <div class="header">
        <uigc-typography variant="title">Transfer Assets</uigc-typography>
        <span class="grow"></span>
      </div>
      <div class="transfer">
        <uigc-typography variant="subsection">Select chains</uigc-typography>
        <div class="chain">
          <uigc-chain-selector title="Source Chain" .chain=${this.from}></uigc-chain-selector>
          <uigc-asset-switch class="switch"></uigc-asset-switch>
          <uigc-chain-selector title="Destination Chain" .chain=${this.to}></uigc-chain-selector>
        </div>
        <uigc-typography variant="subsection">Define asset and amount</uigc-typography>
        <uigc-asset-transfer
          id="asset"
          title="Asset to transfer"
          .asset=${this.asset}
          .amount=${this.amount}
          .balance=${this.balance}
        ></uigc-asset-transfer>
        <uigc-address-input
          id="address"
          title="To address"
          .address=${accountCursor.deref().address}
        ></uigc-address-input>
      </div>
      <div class="info">
        <div class="row">${this.transferFeeTemplate('Origin Chain Transfer Fee', '0.000006', 'BSX')}</div>
        <div class="row">${this.transferFeeTemplate('Destination Chain Transfer Fee', '0.0001', 'KSM')}</div>
      </div>
      <div class="grow"></div>
      <uigc-button
        ?disabled=${this.disabled || !this.account.state}
        class="confirm"
        variant="primary"
        fullWidth
        @click=${this.onTransferClick}
        >${this.account.state ? 'Transfer' : 'Connect Wallet'}</uigc-button
      >
    `;
  }
}
