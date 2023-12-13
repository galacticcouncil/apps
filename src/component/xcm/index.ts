import { html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import * as i18n from 'i18next';

import { BaseApp } from '../base/BaseApp';
import { baseStyles } from '../styles/base.css';
import { headerStyles } from '../styles/header.css';
import { basicLayoutStyles } from '../styles/layout/basic.css';

import { Account, walletCursor } from '../../db';
import {
  convertFromH160,
  convertToH160,
  isEthAddress,
  isValidAddress,
} from '../../utils/account';
import { toBn } from '../../utils/amount';
import { getRenderString } from '../../utils/dom';

import '@galacticcouncil/ui';
import { bnum, Transaction } from '@galacticcouncil/sdk';

import {
  assetsMap,
  chainsMap,
  chainsConfigMap,
  evmChains,
} from '@galacticcouncil/xcm-cfg';
import { Wallet, XCall, XData } from '@galacticcouncil/xcm-sdk';

import {
  AssetConfig,
  ConfigService,
  ChainConfig,
} from '@moonbeam-network/xcm-config';

import { Asset, AnyChain, AssetAmount } from '@moonbeam-network/xcm-types';

import './form';
import '../selector/token';
import '../selector/chain';

import { Subscription } from 'rxjs';

import {
  TransferTab,
  ChainState,
  TransferState,
  DEFAULT_CHAIN_STATE,
  DEFAULT_TRANSFER_STATE,
} from './types';
import { TxInfo, TxNotificationMssg } from '../transaction/types';

@customElement('gc-xcm-app')
export class XcmApp extends BaseApp {
  private configService: ConfigService = null;
  private wallet: Wallet = null;

  private input: XData = null;
  private ro = new ResizeObserver((entries) => {
    entries.forEach((_entry) => {
      if (TransferTab.TransferForm == this.tab) {
        const defaultScreen = this.shadowRoot.getElementById('default-tab');
        const tabs = this.shadowRoot.querySelectorAll('.tab:not(#default-tab)');
        tabs.forEach((tab: Element) => {
          tab.setAttribute('style', `height: ${defaultScreen.offsetHeight}px`);
        });
      }
    });
  });

  private disconnectBalanceSubscription: Subscription = null;

  @property({ type: String }) srcChain: string = null;
  @property({ type: String }) srcEvmChain: string = null;
  @property({ type: String }) destChain: string = null;
  @property({ type: String }) evmChains: string = null;
  @property({ type: String }) blacklist: string = null;

  @state() tab: TransferTab = TransferTab.TransferForm;
  @state() transfer: TransferState = DEFAULT_TRANSFER_STATE;
  @state() chain: ChainState = DEFAULT_CHAIN_STATE;

  static styles = [
    baseStyles,
    headerStyles,
    basicLayoutStyles,
    css`
      :host {
        max-width: 570px;
      }
    `,
  ];

  isTransferEmpty(): boolean {
    return this.transfer.amount == null;
  }

  isEmptyAmount(amount: string): boolean {
    return amount == '' || amount == '0';
  }

  hasError(): boolean {
    return Object.keys(this.transfer.error).length > 0;
  }

  changeTab(active: TransferTab) {
    this.tab = active;
    this.requestUpdate();
  }

  private isEvmCompatible(chain: AnyChain) {
    if (chain.key === 'hydradx') {
      return true;
    }
    return chain.isEvmParachain();
  }

  private isSubstrateCompatible(chain: AnyChain) {
    if (chain.key === 'hydradx') {
      return true;
    }
    return chain.isParachain();
  }

  private isSupportedWallet(srcChain: AnyChain) {
    if (this.hasEvmAccount()) {
      return this.isEvmCompatible(srcChain);
    } else if (this.hasSubstrateAccount()) {
      return this.isSubstrateCompatible(srcChain);
    } else {
      return true;
    }
  }

  private onChangeWallet(srcChain: AnyChain) {
    const requiredWallet = srcChain.isParachain() ? 'substrate' : 'evm';
    alert('Please change your wallet to ' + requiredWallet.toUpperCase());
    const options = {
      bubbles: true,
      composed: true,
    };
    this.dispatchEvent(new CustomEvent<TxInfo>('gc:wallet:change', options));
  }

  private async switchChains() {
    const { destChain, srcChain } = this.transfer;

    const supportedWallet: boolean = this.isSupportedWallet(destChain);
    if (!supportedWallet) {
      this.onChangeWallet(destChain);
      return;
    }

    this.transfer = {
      ...this.transfer,
      srcChain: destChain,
      destChain: srcChain,
      balance: null,
    };
    this.disconnectSubscriptions();
    this.syncChains();
    this.validateAddress();
    await this.syncBalances();
    await this.syncInput();
  }

  private async changeSourceChain(chain: string) {
    const srcChain = chainsMap.get(chain);

    const supportedWallet: boolean = this.isSupportedWallet(srcChain);
    if (!supportedWallet) {
      this.onChangeWallet(srcChain);
      return;
    }

    this.transfer = {
      ...this.transfer,
      srcChain: srcChain,
      balance: null,
    };
    this.disconnectSubscriptions();
    this.syncChains();
    await this.syncBalances();
    await this.syncInput();
  }

  private async changeDestinationChain(chain: string) {
    const srcChain = chainsMap.get(chain);
    this.transfer = {
      ...this.transfer,
      destChain: srcChain,
      balance: null,
    };
    this.disconnectSubscriptions();
    this.syncChains();
    this.validateAddress();
    await this.syncBalances();
    await this.syncInput();
  }

  private async changeAsset(asset: string) {
    this.transfer = {
      ...this.transfer,
      asset: assetsMap.get(asset),
      balance: this.chain.balance.get(asset).toDecimal(),
      srcChainFee: null,
      destChainFee: null,
    };
    await this.syncInput();
  }

  updateAddress(address: string) {
    this.transfer = {
      ...this.transfer,
      address: address,
    };
    this.requestUpdate();
  }

  validateAddress() {
    const { address, destChain } = this.transfer;
    if (address == null || address == '') {
      this.transfer.error['address'] = i18n.t('xcm.error.required');
    } else if (destChain.isEvmParachain() && !isEthAddress(address)) {
      this.transfer.error['address'] = i18n.t('xcm.error.addrIncorrect');
    } else if (!isValidAddress(address)) {
      this.transfer.error['address'] = i18n.t('xcm.error.addrIncorrect');
    } else {
      delete this.transfer.error['address'];
    }
  }

  updateAmount(amount: string) {
    if (this.isEmptyAmount(amount)) {
      this.transfer.amount = null;
    } else {
      this.transfer.amount = amount;
    }
    this.requestUpdate();
  }

  validateAmount() {
    const ammount = this.transfer.amount;

    if (!ammount) {
      delete this.transfer.error['amount'];
      return;
    }

    const decimals = this.input.balance.decimals;
    const amountBN = toBn(ammount, decimals);

    const { min, max } = this.input;
    const minBN = bnum(min.amount.toString());
    const maxBN = bnum(max.amount.toString());

    if (amountBN.gt(maxBN)) {
      this.transfer.error['amount'] = i18n.t('xcm.error.maxAmount', {
        amount: max.toDecimal(),
        asset: this.transfer.asset.originSymbol,
      });
    } else if (amountBN.lt(minBN)) {
      this.transfer.error['amount'] = i18n.t('xcm.error.minAmount', {
        amount: min.toDecimal(),
        asset: this.transfer.asset.originSymbol,
      });
    } else {
      delete this.transfer.error['amount'];
    }
    this.requestUpdate();
  }

  notificationTemplate(
    transfer: TransferState,
    status: string,
  ): TxNotificationMssg {
    const template = html`
      <span
        >${status
          ? i18n.t('xcm.notify.sending')
          : i18n.t('xcm.notify.sent')}</span
      >
      <span class="highlight">${transfer.amount}</span>
      <span class="highlight">${transfer.asset.originSymbol}</span>
      <span>${i18n.t('xcm.notify.from')}</span>
      <span class="highlight">${transfer.srcChain.name}</span>
      <span>${i18n.t('xcm.notify.to')}</span>
      <span class="highlight">${transfer.destChain.name}</span>
      <span>${status}</span>
    `;
    return {
      message: template,
      rawHtml: getRenderString(template),
    } as TxNotificationMssg;
  }

  processTx(
    account: Account,
    transaction: Transaction,
    transfer: TransferState,
  ) {
    const { srcChain, destChain } = this.transfer;
    const notification = {
      processing: this.notificationTemplate(
        transfer,
        i18n.t('xcm.tx.submitted'),
      ),
      success: this.notificationTemplate(transfer, i18n.t('xcm.tx.inBlock')),
      failure: this.notificationTemplate(transfer, i18n.t('xcm.tx.failed')),
    };
    const options = {
      bubbles: true,
      composed: true,
      detail: {
        account: account,
        transaction: transaction,
        notification: notification,
        meta: { srcChain: srcChain.key, dstChain: destChain.key },
      } as TxInfo,
    };
    this.dispatchEvent(new CustomEvent<TxInfo>('gc:xcm:new', options));
  }

  private formatAddress(address: string, chain: AnyChain): string {
    if (chain.isEvmParachain()) {
      return convertToH160(address);
    } else {
      return address;
    }
  }

  private formatDestAddress(address: string, chain: AnyChain): string {
    if (isEthAddress(address) && chain.isParachain()) {
      return convertFromH160(address);
    } else {
      return address;
    }
  }

  async swap() {
    const account = this.account.state;
    const { address, asset, amount, srcChain, destChain } = this.transfer;

    const srcAddr = this.formatAddress(account.address, srcChain);
    const destAddr = this.formatDestAddress(address, destChain);

    const xData = await this.wallet.transfer(
      asset,
      srcAddr,
      srcChain,
      destAddr,
      destChain,
    );

    const call = xData.transfer(amount);
    const transaction = {
      hex: call.data,
      name: 'xcm',
      get: (): XCall => {
        return call;
      },
    } as Transaction;
    this.processTx(account, transaction, this.transfer);
  }

  private resetBalances() {
    this.transfer.balance = null;
    this.chain.balance = new Map([]);
  }

  private async syncBalances() {
    const { srcChain } = this.transfer;
    const { address } = this.account.state;

    const srcAddress = this.formatAddress(address, srcChain);

    const observer = (val: AssetAmount) => {
      const balances: Map<string, AssetAmount> = new Map(this.chain.balance);
      balances.set(val.key, val);
      const { asset } = this.transfer;
      const assetBalance = balances.get(asset.key);
      this.chain.balance = balances;
      this.transfer.balance = assetBalance?.toDecimal();
      this.requestUpdate();
    };

    this.disconnectBalanceSubscription = await this.wallet.subscribeBalance(
      srcAddress,
      srcChain,
      observer,
    );
  }

  private async syncInput() {
    const { srcChain, destChain, asset } = this.transfer;
    const { address } = this.account.state;

    const srcAddr = this.formatAddress(address, srcChain);
    const destAddr = this.formatAddress(address, destChain);

    const xData = await this.wallet.transfer(
      asset,
      srcAddr,
      srcChain,
      destAddr,
      destChain,
    );

    const { balance, srcFee, destFee } = xData;

    this.input = xData;
    this.transfer = {
      ...this.transfer,
      balance: balance.toDecimal(),
      srcChainFee: srcFee,
      destChainFee: destFee,
      destChainSs58Prefix: destChain.ss58Format,
    };
  }

  private syncChains() {
    const { srcChain, destChain, asset } = this.transfer;

    const srcChainCfg: ChainConfig = chainsConfigMap.get(srcChain.key);
    const srcChainAssetCfg: AssetConfig[] = srcChainCfg.getAssetsConfigs();

    const destChains: AnyChain[] = srcChainAssetCfg.map((a) => a.destination);
    const destChainsList = new Set<AnyChain>(destChains);

    const isDestValid: boolean = destChainsList.has(destChain);
    const validDestChain: AnyChain = isDestValid
      ? destChain
      : destChainsList.values().next().value;

    const supportedAssets: Asset[] = srcChainAssetCfg
      .filter((a) => a.destination === validDestChain)
      .map((a) => a.asset);

    const isTransferable = supportedAssets.includes(asset);
    const selectedAsset = isTransferable ? asset : supportedAssets[0];

    this.chain = {
      ...this.chain,
      dest: [...destChainsList],
      tokens: supportedAssets,
      balance: new Map([]),
    };

    this.transfer = {
      ...this.transfer,
      asset: selectedAsset,
      balance: null,
      srcChainFee: null,
      destChain: validDestChain,
      destChainFee: null,
    };
  }

  override async firstUpdated() {
    this.configService = new ConfigService({
      assets: assetsMap,
      chains: chainsMap,
      chainsConfig: chainsConfigMap,
    });
    this.wallet = new Wallet({
      configService: this.configService,
      evmChains: evmChains,
    });
    walletCursor.reset(this.wallet);
    this.syncChains();
    this.syncBalances();
    this.syncInput();
  }

  override async update(changedProperties: Map<string, unknown>) {
    if (
      changedProperties.has('srcChain') ||
      changedProperties.has('srcEvmChain') ||
      changedProperties.has('destChain')
    ) {
      const srcChain = this.hasEvmAccount() ? this.srcEvmChain : this.srcChain;
      this.transfer = {
        ...this.transfer,
        srcChain: chainsMap.get(srcChain),
        destChain: chainsMap.get(this.destChain),
      };
    }
    super.update(changedProperties);
  }

  override async updated() {}

  protected async onAccountChange(prev: Account, curr: Account): Promise<void> {
    this.resetBalances();
    curr && this.updateAddress(curr.address);

    await this.syncBalances();
    await this.syncInput();
  }

  override connectedCallback() {
    super.connectedCallback();
    this.ro.observe(this);
  }

  private disconnectSubscriptions() {
    this.disconnectBalanceSubscription?.unsubscribe();
  }

  override disconnectedCallback() {
    this.ro.unobserve(this);
    this.disconnectSubscriptions();
    super.disconnectedCallback();
  }

  protected listItemClickedListener(isDest: boolean) {
    const changeChainFn = isDest
      ? this.changeDestinationChain.bind(this)
      : this.changeSourceChain.bind(this);
    return function ({ detail: { item } }) {
      changeChainFn(item);
      this.changeTab(TransferTab.TransferForm);
    };
  }

  selectChainTab() {
    const classes = {
      tab: true,
      active: this.tab == TransferTab.SelectChain,
    };
    const isDest = this.chain.selector === this.transfer.destChain.key;
    return html`<uigc-paper class=${classMap(classes)}>
      <gc-select-chain
        .chains=${isDest
          ? this.chain.dest.map((c) => c.key)
          : this.chain.list.map((c) => c.key)}
        .srcChain=${this.transfer.srcChain}
        .destChain=${this.transfer.destChain}
        .selector=${this.chain.selector}
        @list-item-clicked=${this.listItemClickedListener(isDest)}
      >
        <div class="header section" slot="header">
          <uigc-icon-button
            class="back"
            @click=${() => this.changeTab(TransferTab.TransferForm)}
          >
            <uigc-icon-back></uigc-icon-back>
          </uigc-icon-button>
          <uigc-typography variant="section"
            >${isDest
              ? i18n.t('xcm.selectDest')
              : i18n.t('xcm.selectSrc')}</uigc-typography
          >
          <span></span>
        </div>
      </gc-select-chain>
    </uigc-paper>`;
  }

  protected assetClickedListener({ detail: { symbol } }) {
    this.changeAsset(symbol);
    this.changeTab(TransferTab.TransferForm);
  }

  selectTokenTab() {
    const classes = {
      tab: true,
      active: this.tab == TransferTab.SelectToken,
    };
    return html`<uigc-paper class=${classMap(classes)}>
      <gc-select-token
        .assets=${this.chain.tokens}
        .balances=${this.chain.balance}
        .asset=${this.transfer.asset}
        @asset-clicked=${this.assetClickedListener}
      >
        <div class="header section" slot="header">
          <uigc-icon-button
            class="back"
            @click=${() => this.changeTab(TransferTab.TransferForm)}
          >
            <uigc-icon-back></uigc-icon-back>
          </uigc-icon-button>
          <uigc-typography variant="section"
            >${i18n.t('xcm.selectAsset')}</uigc-typography
          >
          <span></span>
        </div>
      </gc-select-token>
    </uigc-paper>`;
  }

  protected assetInputChangedListener({ detail: { value } }) {
    this.updateAmount(value);
    this.validateAmount();
  }

  protected addressInputChangedListener({ detail: { address } }) {
    this.updateAddress(address);
    this.validateAddress();
  }

  protected chainSelectorClickedListener({ detail: { chain } }) {
    this.chain.selector = chain;
    this.changeTab(TransferTab.SelectChain);
  }

  private isFormDisabled() {
    return this.isTransferEmpty() || this.hasError();
  }

  xcmFormTab() {
    const classes = {
      tab: true,
      active: this.tab == TransferTab.TransferForm,
    };
    return html` <uigc-paper class=${classMap(classes)} id="default-tab">
      <gc-xcm-form
        .disabled=${this.isFormDisabled()}
        .address=${this.transfer.address}
        .amount=${this.transfer.amount}
        .asset=${this.transfer.asset}
        .balance=${this.transfer.balance}
        .effectiveBalance=${this.transfer.effectiveBalance}
        .srcChain=${this.transfer.srcChain}
        .srcChainFee=${this.transfer.srcChainFee}
        .destChain=${this.transfer.destChain}
        .destChainFee=${this.transfer.destChainFee}
        .destChainSs58Prefix=${this.transfer.destChainSs58Prefix}
        .error=${this.transfer.error}
        @asset-input-changed=${this.assetInputChangedListener}
        @address-input-changed=${this.addressInputChangedListener}
        @asset-switch-clicked=${this.switchChains}
        @asset-selector-clicked=${() => this.changeTab(TransferTab.SelectToken)}
        @chain-selector-clicked=${this.chainSelectorClickedListener}
        @transfer-clicked=${() => this.swap()}
      >
        <div class="header" slot="header">
          <uigc-typography gradient variant="title"
            >${i18n.t('xcm.title')}</uigc-typography
          >
          <span class="grow"></span>
        </div>
      </gc-xcm-form>
    </uigc-paper>`;
  }

  render() {
    return html`
      <div class="layout-root">
        ${this.xcmFormTab()} ${this.selectChainTab()} ${this.selectTokenTab()}
      </div>
    `;
  }
}
