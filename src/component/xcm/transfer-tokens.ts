import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import { Account, accountCursor } from '../../db';
import { DatabaseController } from '../../db.ctrl';
import { convertAddressSS58 } from '../../utils/account';

import { baseStyles } from '../base.css';

@customElement('gc-xcm-app-main')
export class TradeTokens extends LitElement {
  private account = new DatabaseController<Account>(this, accountCursor);

  @property({ type: String }) srcChain = null;
  @property({ type: String }) dstChain = null;
  @property({ type: String }) amount = null;
  @property({ type: String }) address = null;
  @property({ type: String }) asset = null;
  @property({ type: String }) balance = null;
  @property({ type: String }) effectiveBalance = null;
  @property({ type: String }) nativeAsset = null;
  @property({ type: String }) srcChainFee = null;
  @property({ type: String }) dstChainFee = null;
  @property({ type: String }) dstChainSs58Prefix = null;
  @property({ type: String }) error = null;
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

      .error {
        display: none;
        flex-direction: row;
        align-items: center;
        margin: 12px 14px 0;
        padding: 12px 14px;
        background: var(--uigc-app-bg-error);
        border-radius: var(--uigc-app-border-radius-2);
      }

      @media (min-width: 768px) {
        .error {
          margin: 12px 28px 0;
        }
      }

      .error.show {
        display: flex;
      }

      .error span {
        color: var(--hex-white);
        font-weight: 500;
        font-size: 12px;
        line-height: 16px;
      }

      .error uigc-icon-error {
        margin-right: 8px;
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

  getNativeAddress() {
    if (this.address && this.dstChainSs58Prefix) {
      return convertAddressSS58(this.address, this.dstChainSs58Prefix);
    }
    return null;
  }

  render() {
    const errorClasses = {
      error: true,
      show: this.error,
    };
    return html`
      <div class="header">
        <uigc-typography variant="title">Transfer Assets</uigc-typography>
        <span class="grow"></span>
      </div>
      <div class="transfer">
        <uigc-typography variant="subsection">Select chains</uigc-typography>
        <div class="chain">
          <uigc-chain-selector title="Source Chain" .chain=${this.srcChain}></uigc-chain-selector>
          <uigc-asset-switch basic class="switch"></uigc-asset-switch>
          <uigc-chain-selector title="Destination Chain" .chain=${this.dstChain}></uigc-chain-selector>
        </div>
        <uigc-typography variant="subsection">Define asset and amount</uigc-typography>
        <uigc-asset-transfer
          id="asset"
          title="Asset to transfer"
          .asset=${this.asset}
          .amount=${this.amount}
          .balance=${this.balance}
          .effectiveBalance=${this.effectiveBalance}
        ></uigc-asset-transfer>
        <uigc-address-input
          id="address"
          title="To address"
          .address=${this.address}
          .chain=${this.dstChain}
          .nativeAddress=${this.getNativeAddress()}
          @address-input-changed=${({ detail: { address } }: CustomEvent) => {
            this.address = address;
          }}
        ></uigc-address-input>
      </div>
      <div class="info">
        <div class="row">
          ${this.transferFeeTemplate('Source Chain Transfer Fee', this.srcChainFee, this.nativeAsset)}
        </div>
        <div class="row">
          ${this.transferFeeTemplate('Destination Chain Transfer Fee', this.dstChainFee, this.asset)}
        </div>
      </div>
      <div class=${classMap(errorClasses)}>
        <uigc-icon-error></uigc-icon-error>
        <span> ${this.error} </span>
      </div>
      <div class="grow"></div>
      <uigc-button
        ?disabled=${this.disabled || !this.account.state || !this.getNativeAddress()}
        class="confirm"
        variant="primary"
        fullWidth
        @click=${this.onTransferClick}
        >${this.account.state ? 'Transfer' : 'Connect Wallet'}</uigc-button
      >
    `;
  }
}
