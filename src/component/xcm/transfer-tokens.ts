import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { classMap } from 'lit/directives/class-map.js';

import * as i18n from 'i18next';

import { Account, accountCursor } from '../../db';
import { DatabaseController } from '../../db.ctrl';

import { baseStyles } from '../base.css';
import { capitalize } from '../../utils/text';

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
  @property({ type: Object }) error = {};
  @property({ type: Boolean }) disabled = false;
  @property({ type: Boolean }) warning = false;

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
        margin-top: 35px;
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

      .warning {
        display: none;
        flex-direction: row;
        align-items: center;
        margin: 12px 14px 0;
        padding: 12px 14px;
        background: var(--uigc-app-bg-warning);
        border-radius: var(--uigc-app-border-radius-2);
      }

      @media (min-width: 768px) {
        .warning {
          margin: 12px 28px 0;
        }
      }

      .warning.show {
        display: flex;
      }

      .warning span {
        color: var(--hex-white);
        font-weight: 500;
        font-size: 12px;
        line-height: 16px;
      }

      .warning uigc-icon-warning {
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
      ${when(
        tradeFee,
        () => html` <span class="value">${tradeFee} ${assetSymbol}</span>`,
        () => html` <span class="value">-</span>`
      )}`;
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
    const warningClasses = {
      warning: true,
      show: this.dstChain == 'acala' && this.asset == 'DAI',
    };
    return html`
      <div class="header">
        <uigc-typography gradient variant="title">${i18n.t('xcm.title')}</uigc-typography>
        <span class="grow"></span>
      </div>
      <div class="transfer">
        <uigc-typography variant="subsection">${i18n.t('xcm.selectChains')}</uigc-typography>
        <div class="chain">
          <uigc-chain-selector title="${i18n.t('xcm.source')}" .chain=${this.srcChain}></uigc-chain-selector>
          <uigc-asset-switch basic class="switch"></uigc-asset-switch>
          <uigc-chain-selector title="${i18n.t('xcm.dest')}" .chain=${this.dstChain}></uigc-chain-selector>
        </div>
        <uigc-typography variant="subsection">${i18n.t('xcm.assetAmount')}</uigc-typography>
        <uigc-asset-transfer
          id="asset"
          title="${i18n.t('xcm.asset')}"
          .asset=${this.asset}
          .amount=${this.amount}
          .balance=${this.balance}
          .effectiveBalance=${this.effectiveBalance}
          ?error=${this.error['amount']}
          .error=${this.error['amount']}
        ></uigc-asset-transfer>
        <uigc-address-input
          id="address"
          title="${i18n.t('xcm.toAddr')}"
          .address=${this.address}
          .chain=${this.dstChain}
          ?error=${this.error['address']}
          .error=${this.error['address']}
        ></uigc-address-input>
      </div>
      <div class="info">
        <div class="row">${this.transferFeeTemplate(i18n.t('xcm.sourceFee'), this.srcChainFee, this.nativeAsset)}</div>
        <div class="row">${this.transferFeeTemplate(i18n.t('xcm.destFee'), this.dstChainFee, this.asset)}</div>
      </div>
      <div class=${classMap(warningClasses)}>
        <uigc-icon-warning></uigc-icon-warning>
        <span> ${i18n.t('xcm.warning', { asset: this.asset, chain: capitalize(this.dstChain) })} </span>
      </div>
      <div class="grow"></div>
      <uigc-button
        ?disabled=${this.disabled || !this.account.state}
        class="confirm"
        variant="primary"
        fullWidth
        @click=${this.onTransferClick}
        >${this.account.state ? i18n.t('xcm.transfer') : i18n.t('xcm.connect')}</uigc-button
      >
    `;
  }
}
