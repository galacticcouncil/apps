import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { classMap } from 'lit/directives/class-map.js';

import * as i18n from 'i18next';

import { Account, accountCursor, xChainCursor } from '../../db';
import { DatabaseController } from '../../db.ctrl';

import { baseStyles } from '../base.css';
import { capitalize } from '../../utils/text';
import { isSameAddress, isValidAddress } from '../../utils/account';

import '../identicon';

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

      .transfer {
        display: flex;
        flex-direction: column;
        padding: 0 14px;
        box-sizing: border-box;
        row-gap: 11px;
        position: relative;
      }

      .transfer .chain {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        grid-gap: 11px;
      }

      .transfer .label {
        font-weight: 500;
        font-size: 14px;
        line-height: 100%;
        color: rgba(255, 255, 255, 0.7);
      }

      .transfer .divider {
        background: var(--uigc-divider-background);
        height: 1px;
        width: 100%;
        left: 0;
        position: absolute;
      }

      .transfer .switch__desktop {
        display: none;
      }

      .transfer .switch__mobile {
        display: block;
        align-items: center;
        display: flex;
        height: 43px;
        justify-content: center;
        width: 100%;
      }

      .transfer uigc-asset-switch.switch {
        background: var(--uigc-asset-switch-background);
        position: absolute;
      }

      @media (min-width: 480px) {
        .transfer .chain {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          grid-gap: 11px;
        }

        .transfer .switch__desktop {
          display: block;
          transform: rotate(270deg);
        }

        .transfer .switch__mobile {
          display: none;
        }
      }

      @media (min-width: 768px) {
        .transfer {
          padding: 0 28px;
        }
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

      @media (max-width: 480px) {
        .info {
          padding: 0 14px;
        }
      }

      .info .row {
        display: flex;
        align-items: center;
        position: relative;
        gap: 5px;
        height: 24px;
      }

      .info .row:not(:last-child):after {
        background-color: var(--uigc-divider-color);
        bottom: 0;
        content: ' ';
        height: 1px;
        position: absolute;
        width: 100%;
      }

      .info .label {
        font-weight: 500;
        font-size: 12px;
        line-height: 100%;
        text-align: left;
        color: var(--uigc-app-font-color__secondary);
      }

      .info .value {
        font-weight: 500;
        font-size: 12px;
        line-height: 100%;
        text-align: right;
        color: var(--hex-white);
      }

      .warning {
        display: none;
        flex-direction: row;
        align-items: center;
        line-height: 16px;
        margin: 5px 14px 0;
        padding: 0 14px;
        background: var(--uigc-app-bg-warning);
        border-radius: var(--uigc-app-border-radius-2);
      }

      @media (min-width: 768px) {
        .warning {
          margin: 5px 28px 0;
        }
      }

      .warning.show {
        padding: 10px;
        animation: scale 0.25s;
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
        padding: 11px 14px 22px 14px;
        box-sizing: border-box;
      }

      @media (min-width: 768px) {
        .confirm {
          padding: 11px 28px 22px 28px;
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

  isChainConnected(): boolean {
    const chainAdapter = xChainCursor.deref().bridge.findAdapter(this.srcChain);
    const chainApi = chainAdapter.getApi();
    return chainApi && chainApi.isConnected;
  }

  transferButtonText(): string {
    if (!this.account.state) {
      return i18n.t('xcm.connect');
    }

    if (this.isChainConnected()) {
      return i18n.t('xcm.transfer');
    } else {
      return i18n.t('xcm.connecting');
    }
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
    const isUserAddr = isSameAddress(this.address, accountCursor.deref()?.address);
    const isValidAddr = isValidAddress(this.address);
    const warningClasses = {
      warning: true,
      show: accountCursor.deref() && isValidAddr && !isUserAddr,
    };
    return html`
      <slot name="header"></slot>
      <div class="transfer">
        <uigc-typography variant="subsection">${i18n.t('xcm.selectChains')}</uigc-typography>
        <div class="chain">
          <uigc-chain-selector title="${i18n.t('xcm.source')}" .chain=${this.srcChain}></uigc-chain-selector>
          <div class="switch__mobile">
            <div class="divider"></div>
            <uigc-asset-switch class="switch"> </uigc-asset-switch>
          </div>
          <uigc-asset-switch basic class="switch__desktop"> </uigc-asset-switch>
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
        >
          ${when(
            isValidAddr && this.dstChainSs58Prefix,
            () =>
              html`
                <gc-identicon slot="id" .address=${this.address} .ss58prefix=${this.dstChainSs58Prefix}></gc-identicon>
              `
          )}
        </uigc-address-input>
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
        ?disabled=${this.disabled || !this.account.state || !this.isChainConnected()}
        class="confirm"
        variant="primary"
        fullWidth
        @click=${this.onTransferClick}
        >${this.transferButtonText()}</uigc-button
      >
    `;
  }
}
