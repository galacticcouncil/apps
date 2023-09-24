import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { classMap } from 'lit/directives/class-map.js';

import * as i18n from 'i18next';

import { baseStyles } from '../styles/base.css';
import { formStyles } from '../styles/form.css';

import { Account, accountCursor, xChainCursor } from '../../db';
import { DatabaseController } from '../../db.ctrl';
import { capitalize } from '../../utils/text';
import { isSameAddress, isValidAddress } from '../../utils/account';

import '../id/account';

@customElement('gc-xcm-form')
export class XcmForm extends LitElement {
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
    `,
  ];

  transferFeeTemplate(label: string, tradeFee: string, assetSymbol: string) {
    return html` <span class="label">${label}</span>
      <span class="grow"></span>
      ${when(
        tradeFee,
        () => html` <span class="value">${tradeFee} ${assetSymbol}</span>`,
        () => html` <span class="value">-</span>`,
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

  onTransferClick(e: any) {
    const options = {
      bubbles: true,
      composed: true,
    };
    this.dispatchEvent(new CustomEvent('transfer-clicked', options));
  }

  maxClickHandler(balance: string, effectiveBalance: string) {
    return function (_e: Event) {
      const amount = effectiveBalance ?? balance;
      const options = {
        bubbles: true,
        composed: true,
        detail: { value: amount },
      };
      this.dispatchEvent(new CustomEvent('asset-input-changed', options));
    };
  }

  render() {
    const isUserAddr = isSameAddress(
      this.address,
      accountCursor.deref()?.address,
    );
    const isValidAddr = isValidAddress(this.address);
    const warningClasses = {
      warning: true,
      show: accountCursor.deref() && isValidAddr && !isUserAddr,
    };
    return html`
      <slot name="header"></slot>
      <div class="transfer">
        <uigc-typography variant="subsection"
          >${i18n.t('xcm.selectChains')}</uigc-typography
        >
        <div class="chain">
          <uigc-chain-selector
            title="${i18n.t('xcm.selectSrc')}"
            .chain=${this.srcChain}
          ></uigc-chain-selector>
          <div class="switch__mobile">
            <div class="divider"></div>
            <uigc-asset-switch class="switch"> </uigc-asset-switch>
          </div>
          <uigc-asset-switch basic class="switch__desktop"> </uigc-asset-switch>
          <uigc-chain-selector
            title="${i18n.t('xcm.selectDest')}"
            .chain=${this.dstChain}
          ></uigc-chain-selector>
        </div>
        <uigc-typography variant="subsection"
          >${i18n.t('xcm.assetAmount')}</uigc-typography
        >
        <uigc-asset-transfer
          id="asset"
          title="${i18n.t('xcm.asset')}"
          .asset=${this.asset}
          .amount=${this.amount}
          .unit=${this.asset}
          ?error=${this.error['amount']}
          .error=${this.error['amount']}
        >
          <uigc-asset slot="asset" symbol=${this.asset}>
            <uigc-asset-id slot="icon" symbol=${this.asset}></uigc-asset-id>
          </uigc-asset>
          <uigc-asset-balance
            slot="balance"
            .balance=${this.balance}
            .onMaxClick=${this.maxClickHandler(
              this.balance,
              this.effectiveBalance,
            )}
          ></uigc-asset-balance>
        </uigc-asset-transfer>
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
                <gc-account-id
                  slot="id"
                  .address=${this.address}
                  .ss58prefix=${this.dstChainSs58Prefix}
                ></gc-account-id>
              `,
          )}
        </uigc-address-input>
      </div>
      <div class="info show">
        <div class="row">
          ${this.transferFeeTemplate(
            i18n.t('xcm.sourceFee'),
            this.srcChainFee,
            this.nativeAsset,
          )}
        </div>
        <div class="row">
          ${this.transferFeeTemplate(
            i18n.t('xcm.destFee'),
            this.dstChainFee,
            this.asset,
          )}
        </div>
      </div>
      <div class=${classMap(warningClasses)}>
        <uigc-icon-warning></uigc-icon-warning>
        <span>
          ${i18n.t('xcm.warning', {
            asset: this.asset,
            chain: capitalize(this.dstChain),
          })}
        </span>
      </div>
      <div class="grow"></div>
      <uigc-button
        ?disabled=${this.disabled ||
        !this.account.state ||
        !this.isChainConnected()}
        class="confirm"
        variant="primary"
        fullWidth
        @click=${this.onTransferClick}
        >${this.transferButtonText()}</uigc-button
      >
    `;
  }
}
