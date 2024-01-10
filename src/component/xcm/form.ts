import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { classMap } from 'lit/directives/class-map.js';

import { AnyChain, Asset, AssetAmount } from '@moonbeam-network/xcm-types';

import * as i18n from 'i18next';

import { baseStyles } from '../styles/base.css';
import { formStyles } from '../styles/form.css';

import { Account, accountCursor } from '../../db';
import { DatabaseController } from '../../db.ctrl';
import { isSameAddress } from '../../utils/account';

import '../id/account';

@customElement('gc-xcm-form')
export class XcmForm extends LitElement {
  private account = new DatabaseController<Account>(this, accountCursor);

  @property({ type: Boolean }) disabled = false;
  @property({ type: Boolean }) inProgress = false;
  @property({ type: String }) address = null;
  @property({ type: String }) amount = null;
  @property({ type: Object }) asset: Asset = null;
  @property({ type: Object }) balance: AssetAmount = null;
  @property({ type: Object }) max: AssetAmount = null;
  @property({ type: Object }) srcChain: AnyChain = null;
  @property({ type: Object }) srcChainFee: AssetAmount = null;
  @property({ type: Object }) destChain: AnyChain = null;
  @property({ type: Object }) destChainFee: AssetAmount = null;
  @property({ type: Object }) error = {};

  static styles = [
    baseStyles,
    formStyles,
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

      .spinner {
        width: 16px;
        height: 16px;
        margin-right: 10px;
      }
    `,
  ];

  private isDisabled(): boolean {
    const account = this.account.state;
    return !account || !this.isChainConnected() || !this.isValidAddress();
  }

  private isChainConnected(): boolean {
    return !this.inProgress;
  }

  private isValidAddress(): boolean {
    return this.address && !this.error['address'];
  }

  onTransferClick(e: any) {
    const options = {
      bubbles: true,
      composed: true,
    };
    this.dispatchEvent(new CustomEvent('transfer-click', options));
  }

  maxClickHandler(balance: string, effectiveBalance: string) {
    return function (_e: Event) {
      const amount = effectiveBalance ?? balance;
      const options = {
        bubbles: true,
        composed: true,
        detail: { value: amount },
      };
      this.dispatchEvent(new CustomEvent('asset-input-change', options));
    };
  }

  transferFeeTemplate(label: string, tradeFee: string, assetSymbol: string) {
    if (this.inProgress) {
      return html` <span class="label">${label}</span>
        <span class="grow"></span>
        <uigc-skeleton
          progress
          rectangle
          width="80px"
          height="12px"
        ></uigc-skeleton>`;
    }

    if (tradeFee === '0') {
      return html`
        <span class="label">${label}</span>
        <span class="grow"></span>
        <span class="value">Estimation not available</span>
      `;
    }

    return html` <span class="label">${label}</span>
      <span class="grow"></span>
      ${when(
        tradeFee,
        () => html` <span class="value">${tradeFee} ${assetSymbol}</span>`,
        () => html` <span class="value">-</span>`,
      )}`;
  }

  transferButtonTemplate() {
    if (!this.account.state) {
      return html` <span class="cta">${i18n.t('xcm.connect')}</span>`;
    }

    if (this.isChainConnected()) {
      return html` <span class="cta">${i18n.t('xcm.transfer')}</span>`;
    } else {
      return html`
        <uigc-circular-progress
          slot="icon"
          class="spinner"
        ></uigc-circular-progress>
        <span class="cta"> ${i18n.t('xcm.connecting')}</span>
      `;
    }
  }

  formSelectAssetTemplate() {
    const balance = this.balance?.toDecimal(this.balance.decimals);
    const max = this.max?.toDecimal(this.max.decimals);
    return html`
      <uigc-asset-transfer
        id="asset"
        title="${i18n.t('xcm.asset')}"
        .asset=${this.asset?.originSymbol}
        .amount=${this.amount}
        .unit=${this.asset?.originSymbol}
        ?error=${this.error['amount']}
        .error=${this.error['amount']}
      >
        <uigc-asset slot="asset" symbol=${this.asset?.originSymbol}>
          <uigc-asset-id
            slot="icon"
            symbol=${this.asset?.originSymbol}
          ></uigc-asset-id>
        </uigc-asset>
        <uigc-asset-balance
          slot="balance"
          .balance=${balance}
          .onMaxClick=${this.maxClickHandler(balance, max)}
        ></uigc-asset-balance>
      </uigc-asset-transfer>
    `;
  }

  formSelectChainTemplate() {
    return html`
      <div class="chain">
        <uigc-chain-selector
          title="${i18n.t('xcm.selectSrc')}"
          .chain=${this.srcChain?.key}
        ></uigc-chain-selector>
        <div class="switch__mobile">
          <div class="divider"></div>
          <uigc-asset-switch class="switch"> </uigc-asset-switch>
        </div>
        <uigc-asset-switch basic class="switch__desktop"> </uigc-asset-switch>
        <uigc-chain-selector
          title="${i18n.t('xcm.selectDest')}"
          .chain=${this.destChain?.key}
        ></uigc-chain-selector>
      </div>
    `;
  }

  formAddressTemplate() {
    const error = this.error['address'];
    return html` <uigc-address-input
      id="address"
      title="${i18n.t('xcm.toAddr')}"
      .address=${this.address}
      .chain=${this.destChain}
      ?error=${error}
      .error=${error}
    >
      ${when(
        this.isValidAddress(),
        () =>
          html`
            <gc-account-id
              slot="id"
              .address=${this.address}
              .ss58prefix=${this.destChain.ss58Format}
            ></gc-account-id>
          `,
      )}
    </uigc-address-input>`;
  }

  render() {
    const account = this.account.state;
    const isValidAddr = this.isValidAddress();
    const isSameAddr = isSameAddress(this.address, account?.address);
    const cexWarnClasses = {
      warning: true,
      show: account && isValidAddr && !isSameAddr,
    };
    const ledgerWarnClasses = {
      warning: true,
      show:
        this.srcChain.key === 'polkadot' || this.srcChain.key === 'assethub',
    };
    return html`
      <slot name="header"></slot>
      <div class="transfer">
        <uigc-typography variant="subsection"
          >${i18n.t('xcm.selectChains')}</uigc-typography
        >
        ${this.formSelectChainTemplate()}
        <uigc-typography variant="subsection"
          >${i18n.t('xcm.assetAmount')}</uigc-typography
        >
        ${this.formSelectAssetTemplate()} ${this.formAddressTemplate()}
      </div>
      <div class="info show">
        <div class="row">
          ${this.transferFeeTemplate(
            i18n.t('xcm.sourceFee'),
            this.srcChainFee?.toDecimal(),
            this.srcChainFee?.originSymbol,
          )}
        </div>
        <div class="row">
          ${this.transferFeeTemplate(
            i18n.t('xcm.destFee'),
            this.destChainFee?.toDecimal(),
            this.destChainFee?.originSymbol,
          )}
        </div>
      </div>
      <div class=${classMap(cexWarnClasses)}>
        <uigc-icon-warning></uigc-icon-warning>
        <span> ${i18n.t('xcm.warning.cex')} </span>
      </div>
      <div class=${classMap(ledgerWarnClasses)}>
        <uigc-icon-warning></uigc-icon-warning>
        <span> ${i18n.t('xcm.warning.ledger')} </span>
      </div>
      <div class="grow"></div>
      <uigc-button
        ?disabled=${this.disabled || this.isDisabled()}
        class="confirm"
        variant="primary"
        fullWidth
        @click=${this.onTransferClick}
      >
        ${this.transferButtonTemplate()}
      </uigc-button>
    `;
  }
}
