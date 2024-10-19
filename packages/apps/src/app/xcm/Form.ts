import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { classMap } from 'lit/directives/class-map.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { map } from 'lit/directives/map.js';

import { Asset as RegAsset } from '@galacticcouncil/sdk';
import {
  AnyChain,
  Asset,
  AssetAmount,
  Parachain,
} from '@galacticcouncil/xcm-core';
import {
  TransferDestinationData,
  TransferSourceData,
} from '@galacticcouncil/xcm-sdk';

import * as i18n from 'i18next';

import { Account, AccountCursor, DatabaseController, Ecosystem } from 'db';
import { baseStyles, formStyles } from 'styles';
import { isSameAddress } from 'utils/account';
import { humanizeAmount } from 'utils/amount';
import { getChainAssetId, getChainEcosystem, getChainId } from 'utils/chain';

import 'element/id';

import styles from './Form.css';

@customElement('gc-xcm-form')
export class XcmForm extends LitElement {
  private account = new DatabaseController<Account>(this, AccountCursor);

  @property({ type: Boolean }) disabled = false;
  @property({ type: Boolean }) inProgress = false;
  @property({ type: Boolean }) isProcessing = false;
  @property({ type: Boolean }) isApproving = false;
  @property({ type: Boolean }) isApprove = false;
  @property({ type: String }) address = null;
  @property({ type: String }) amount = null;
  @property({ type: Object }) srcAsset: Asset = null;
  @property({ type: Object }) srcBalance: AssetAmount = null;
  @property({ type: Object }) srcChain: AnyChain = null;
  @property({ type: Object }) srcData: TransferSourceData = null;
  @property({ type: Object }) destAsset: Asset = null;
  @property({ type: Object }) destBalance: AssetAmount = null;
  @property({ type: Object }) destChain: AnyChain = null;
  @property({ type: Object }) destData: TransferDestinationData = null;
  @property({ attribute: false }) ecosystem: Ecosystem = Ecosystem.Polkadot;
  @property({ attribute: false }) registry: Map<string, RegAsset> = new Map([]);
  @property({ attribute: false }) registryChain: AnyChain = null;

  @property({ attribute: false }) error = {};

  static styles = [baseStyles, formStyles, styles];

  private isDisabled(): boolean {
    const account = this.account.state;
    return (
      !account ||
      !this.isChainConnected() ||
      !this.isValidAddress() ||
      this.isProcessing ||
      this.isApproving
    );
  }

  private isChainConnected(): boolean {
    return !this.inProgress;
  }

  /**
   * Check whether we use relayer to redeem funds on dest chain.
   *
   * @returns true for every evm dest chains ATM
   */
  private isRelayerTransfer(): boolean {
    return this.destChain.isEvmChain();
  }

  private isValidAddress(): boolean {
    return this.address && !this.error['address'];
  }

  private isTransferLoaded(): boolean {
    return !!this.srcData && !!this.destData;
  }

  private isRegistryLoaded(): boolean {
    return this.registry.size > 0;
  }

  private getDestinationAmount(): string {
    if (!this.isTransferLoaded()) {
      return null;
    }

    const { destinationFee } = this.srcData;
    if (this.amount && this.srcAsset.isEqual(destinationFee)) {
      const destFee = destinationFee.toDecimal(destinationFee.decimals);
      const amountMinusFee = Number(this.amount) - Number(destFee);
      return amountMinusFee > 0 ? amountMinusFee.toString() : null;
    }
    return null;
  }

  private getBalanceSafe(balance: AssetAmount): string {
    if (balance) {
      return balance.toDecimal(balance.decimals);
    }
    return null;
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

  transferFeeTemplate(label: string, fee: AssetAmount, free = false) {
    if (this.inProgress) {
      return html`
        <span class="label">${label}</span>
        <span class="grow"></span>
        <uigc-skeleton
          progress
          rectangle
          width="80px"
          height="12px"></uigc-skeleton>
      `;
    }

    if (free) {
      return html`
        <span class="label">${label}</span>
        <span class="grow"></span>
        <span class="value">FREE</span>
      `;
    }

    if (!fee) {
      return html`
        <span class="label">${label}</span>
        <span class="grow"></span>
        <span class="value">-</span>
      `;
    }

    const { amount, decimals, originSymbol } = fee;
    const formatted = fee.toDecimal(decimals);

    if (amount === 0n) {
      return html`
        <span class="label">${label}</span>
        <span class="grow"></span>
        <span class="value">Estimation not available</span>
      `;
    }

    return html`
      <span class="label">${label}</span>
      <span class="grow"></span>
      <span class="value">${humanizeAmount(formatted)} ${originSymbol}</span>
    `;
  }

  transferButtonTemplate() {
    if (!this.account.state) {
      return html`
        <span class="cta">${i18n.t('form.cta.connect')}</span>
      `;
    }

    if (this.isProcessing) {
      return html`
        <uigc-circular-progress
          slot="icon"
          class="spinner"></uigc-circular-progress>
        <span class="cta">${i18n.t('form.cta.processing')}</span>
      `;
    }

    if (this.isApproving) {
      return html`
        <uigc-circular-progress
          slot="icon"
          class="spinner"></uigc-circular-progress>
        <span class="cta">${i18n.t('form.cta.approving')}</span>
      `;
    }

    if (this.isChainConnected()) {
      return html`
        <span class="cta">
          ${this.isApprove
            ? i18n.t('form.cta.approve')
            : i18n.t('form.cta.transfer')}
        </span>
      `;
    } else {
      return html`
        <uigc-circular-progress
          slot="icon"
          class="spinner"></uigc-circular-progress>
        <span class="cta">${i18n.t('form.cta.connecting')}</span>
      `;
    }
  }

  transferSwapTemplate() {
    if (this.srcData?.feeSwap) {
      const { feeSwap } = this.srcData;
      const { aIn, aOut } = feeSwap;
      const info = i18n.t('info.swap', {
        amount: aOut.toDecimal(aOut.decimals),
        symbol: aOut.originSymbol,
        fee: aIn.originSymbol,
        chain:
          this.destChain.key === 'ethereum' ? 'Moonbeam' : this.destChain.name,
      });
      return html`
        <span>${unsafeHTML(info)}</span>
      `;
    }
  }

  transferErrorTemplate() {
    return html`
      <div class="errors">
        ${map(Object.keys(this.error), (k) => {
          if (k.startsWith('transfer.')) {
            return html`
              <span>${unsafeHTML(this.error[k])}</span>
            `;
          }
        })}
      </div>
    `;
  }

  formAssetLoadingTemplate() {
    return html`
      <div class="loading" slot="asset">
        <uigc-skeleton
          circle
          progress
          width="32px"
          height="32px"></uigc-skeleton>
        <span class="title">
          <uigc-skeleton
            progress
            rectangle
            width="40px"
            height="16px"></uigc-skeleton>
          <uigc-skeleton
            progress
            rectangle
            width="50px"
            height="8px"></uigc-skeleton>
        </span>
      </div>
    `;
  }

  formAssetTemplate(asset: Asset, chain: AnyChain) {
    if (this.registry.size > 0) {
      if (chain.isEvmChain()) {
        return html`
          <uigc-asset slot="asset" symbol=${asset.originSymbol}>
            <uigc-asset-id
              slot="icon"
              ecosystem=${getChainEcosystem(chain)}
              chain=${getChainId(chain)}
              chainOrigin=${getChainId(chain)}
              .asset=${getChainAssetId(chain, asset)}></uigc-asset-id>
          </uigc-asset>
        `;
      }

      const registryId = this.registryChain.getBalanceAssetId(asset);
      const registryAsset = this.registry.get(registryId.toString());
      return html`
        <gc-asset-identicon
          slot="asset"
          .asset=${registryAsset}
          .assets=${this.registry}
          .ecosystem=${this.ecosystem}></gc-asset-identicon>
      `;
    }
    return this.formAssetLoadingTemplate();
  }

  formSelectSourceAssetTemplate() {
    let assetBalance = this.getBalanceSafe(this.srcBalance);
    let assetMax = null;
    if (this.srcData) {
      const { max } = this.srcData;
      assetMax = max?.toDecimal(max?.decimals);
    }

    return html`
      <uigc-asset-transfer
        id="asset"
        title=${i18n.t('form.assetSrc.label')}
        .asset=${this.srcAsset?.originSymbol}
        .amount=${this.amount}
        .unit=${this.srcAsset?.originSymbol}
        ?selectable=${this.isRegistryLoaded()}
        .selectable=${this.isRegistryLoaded()}
        ?error=${this.error['amount']}
        .error=${this.error['amount']}>
        ${this.formAssetTemplate(this.srcAsset, this.srcChain)}
        <uigc-asset-balance
          slot="balance"
          .balance=${assetBalance}
          .onMaxClick=${this.maxClickHandler(assetBalance, assetMax)}
          ?disabled=${!this.isTransferLoaded()}></uigc-asset-balance>
      </uigc-asset-transfer>
    `;
  }

  formSelectDestAssetTemplate() {
    let amount = this.getDestinationAmount();
    let assetBalance = this.getBalanceSafe(this.destBalance);

    return html`
      <uigc-asset-transfer
        id="assetOut"
        title=${i18n.t('form.assetDst.label')}
        .asset=${this.destAsset?.originSymbol}
        .amount=${amount}
        .unit=${this.destAsset?.originSymbol}
        ?selectable=${false}
        .selectable=${false}
        ?readonly=${true}
        .readonly=${true}>
        ${this.formAssetTemplate(this.destAsset, this.destChain)}
        <uigc-asset-balance
          slot="balance"
          .visible=${false}
          .balance=${assetBalance}></uigc-asset-balance>
      </uigc-asset-transfer>
    `;
  }

  formSelectSourceChainTemplate() {
    return html`
      <uigc-chain-selector
        title=${i18n.t('form.chainSrc.label')}
        .chain=${this.srcChain.key}>
        <uigc-chain
          slot="chain"
          .name=${this.srcChain.name}
          .ecosystem=${getChainEcosystem(this.srcChain)}
          .chain=${getChainId(this.srcChain)}></uigc-chain>
      </uigc-chain-selector>
    `;
  }

  formSelectDestChainTemplate() {
    return html`
      <uigc-chain-selector
        title=${i18n.t('form.chainDst.label')}
        .chain=${this.destChain.key}>
        <uigc-chain
          slot="chain"
          .name=${this.destChain.name}
          .ecosystem=${getChainEcosystem(this.destChain)}
          .chain=${getChainId(this.destChain)}></uigc-chain>
      </uigc-chain-selector>
    `;
  }

  formAddressTemplate() {
    const error = this.error['address'];
    const ss58prefix =
      this.destChain instanceof Parachain ? this.destChain.ss58Format : null;
    return html`
      <uigc-address-input
        id="address"
        title="${i18n.t('form.address.label')}"
        .address=${this.address}
        .chain=${this.destChain}
        ?error=${error}
        .error=${error}>
        ${when(
          this.isValidAddress(),
          () =>
            html`
              <gc-account-identicon
                slot="id"
                .address=${this.address}
                .ss58prefix=${ss58prefix}></gc-account-identicon>
            `,
        )}
      </uigc-address-input>
    `;
  }

  render() {
    const account = this.account.state;
    const isValidAddr = this.isValidAddress();
    const isSameAddr = isSameAddress(this.address, account?.address);
    const hasTransferError = Object.keys(this.error).some((e) =>
      e.startsWith('transfer.'),
    );
    const swapInfoClasses = {
      alert: true,
      info: true,
      show: !!this.srcData?.feeSwap?.enabled,
    };
    const errWarnClasses = {
      alert: true,
      error: true,
      show: hasTransferError,
    };
    const cexWarnClasses = {
      alert: true,
      warning: true,
      show: account && isValidAddr && !isSameAddr,
    };
    return html`
      <slot name="header"></slot>
      <div class="transfer">
        ${this.formSelectSourceChainTemplate()}
        ${this.formSelectSourceAssetTemplate()}
      </div>
      <div class="switch">
        <div class="divider left"></div>
        <uigc-asset-switch basic></uigc-asset-switch>
        <div class="divider right"></div>
      </div>
      <div class="transfer">
        ${this.formSelectDestChainTemplate()}
        ${this.formSelectDestAssetTemplate()} ${this.formAddressTemplate()}
      </div>
      <div class="info show">
        <div class="row">
          ${this.transferFeeTemplate(
            i18n.t('form.info.sourceFee'),
            this.srcData?.fee,
          )}
        </div>
        ${when(
          !this.isApprove,
          () =>
            html`
              <div class="row">
                ${this.transferFeeTemplate(
                  this.isRelayerTransfer()
                    ? i18n.t('form.info.relayerFee')
                    : i18n.t('form.info.destFee'),
                  this.srcData?.destinationFee,
                  this.srcChain.isEvmChain(),
                )}
              </div>
            `,
        )}
      </div>
      <div class=${classMap(swapInfoClasses)}>
        <uigc-icon-info></uigc-icon-info>
        ${this.transferSwapTemplate()}
      </div>
      <div class=${classMap(cexWarnClasses)}>
        <uigc-icon-warning></uigc-icon-warning>
        <span>${i18n.t('warning.cex')}</span>
      </div>
      <div class=${classMap(errWarnClasses)}>
        <uigc-icon-error></uigc-icon-error>
        ${this.transferErrorTemplate()}
      </div>
      <div class="grow"></div>
      <uigc-button
        ?disabled=${this.disabled || this.isDisabled()}
        class="confirm"
        variant="primary"
        fullWidth
        @click=${this.onTransferClick}>
        ${this.transferButtonTemplate()}
      </uigc-button>
    `;
  }
}
