import { html, css, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import * as i18n from 'i18next';

import { PoolApp } from '../base/PoolApp';
import { baseStyles } from '../styles/base.css';
import { headerStyles } from '../styles/header.css';
import { basicLayoutStyles } from '../styles/layout/basic.css';

import { Account } from '../../db';
import {
  convertAddressSS58,
  convertFromH160,
  convertToH160,
  isEthAddress,
  isEvmAccount,
  isNativeAddress,
} from '../../utils/account';
import { getRenderString } from '../../utils/dom';

import '@galacticcouncil/ui';
import { Transaction } from '@galacticcouncil/sdk';

import {
  assetsMap,
  chainsMap,
  chainsConfigMap,
  evmChains,
} from '@galacticcouncil/xcm-cfg';
import { SubstrateApis, Wallet, XCall, XData } from '@galacticcouncil/xcm-sdk';

import {
  AssetConfig,
  ConfigService,
  ChainConfig,
} from '@moonbeam-network/xcm-config';

import { Asset, AnyChain, AssetAmount } from '@moonbeam-network/xcm-types';
import { toBigInt } from '@moonbeam-network/xcm-utils';

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
import { DISPATCH_ADDRESS } from '../transaction/signer';

@customElement('gc-xcm-app')
export class XcmApp extends PoolApp {
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

  private shouldPrefill: boolean = true;
  private disconnectBalanceSubscription: Subscription = null;

  @property({ type: String }) srcChain: string = null;
  @property({ type: String }) destChain: string = null;
  @property({ type: String }) blacklist: string = null;

  @state() tab: TransferTab = TransferTab.TransferForm;
  @state() transfer: TransferState = DEFAULT_TRANSFER_STATE;
  @state() xchain: ChainState = DEFAULT_CHAIN_STATE;

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

  isDestChainSelection(): boolean {
    return this.xchain.selector === this.transfer.destChain.key;
  }

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

  disablePrefill() {
    this.shouldPrefill = false;
  }

  private isEvmCompatible(chain: AnyChain) {
    if (chain.key === 'hydradx') {
      return true;
    }
    return chain.isEvmParachain();
  }

  private isNativeCompatible(chain: AnyChain) {
    if (chain.key === 'hydradx') {
      return true;
    }
    return chain.isParachain();
  }

  private isSupportedWallet(chain: AnyChain) {
    const { address } = this.account.state;
    if (isEvmAccount(address)) {
      return this.isEvmCompatible(chain);
    } else {
      return this.isNativeCompatible(chain);
    }
  }

  private onChangeWallet(srcChain: AnyChain) {
    const options = {
      bubbles: true,
      composed: true,
      detail: {
        srcChain: srcChain.key,
      },
    };
    console.log('Wallet change requested from ' + srcChain.key);
    this.dispatchEvent(new CustomEvent('gc:wallet:change', options));
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
    this.syncBalances();
    this.syncInput();
    // Prefill & validation
    this.prefillAddress();
    this.validateAddress();
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
    this.syncBalances();
    this.syncInput();
    // Prefill & validation
    this.prefillAddress();
    this.validateAddress();
  }

  private async changeDestinationChain(chain: string) {
    const destChain = chainsMap.get(chain);
    this.transfer = {
      ...this.transfer,
      destChain: destChain,
      balance: null,
    };

    this.disconnectSubscriptions();
    this.syncBalances();
    this.syncChains();
    this.syncInput();
    // Prefill & validation
    this.prefillAddress();
    this.validateAddress();
  }

  private async changeAsset(asset: string) {
    const balance = this.xchain.balance.get(asset);
    this.transfer = {
      ...this.transfer,
      asset: assetsMap.get(asset),
      balance: balance?.toDecimal(),
      srcChainFee: null,
      destChainFee: null,
    };
    this.syncInput();
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
    const amount = this.transfer.amount;

    if (!amount) {
      delete this.transfer.error['amount'];
      return;
    }

    const { asset, srcChainFee } = this.transfer;
    const { min, max, balance } = this.input;

    const feeBalance = this.xchain.balance.get(srcChainFee.key);

    const amountBN = toBigInt(amount, balance.decimals);
    const maxBN = toBigInt(max.toDecimal(), balance.decimals);
    const minBN = toBigInt(min.toDecimal(), balance.decimals);

    if (amountBN > maxBN) {
      this.transfer.error['amount'] = i18n.t('xcm.error.maxAmount', {
        amount: max.toDecimal(),
        asset: asset.originSymbol,
      });
    } else if (amountBN < minBN) {
      this.transfer.error['amount'] = i18n.t('xcm.error.minAmount', {
        amount: min.toDecimal(),
        asset: asset.originSymbol,
      });
    } else if (feeBalance.amount < srcChainFee.amount) {
      this.transfer.error['amount'] = i18n.t('xcm.error.insufficientFee', {
        asset: feeBalance.originSymbol,
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
    const { srcChain, srcChainFee, destChain, destChainFee } = this.transfer;
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
        meta: {
          srcChain: srcChain.key,
          srcChainFee: srcChainFee.toDecimal(),
          srcChainFeeSymbol: srcChainFee.originSymbol,
          dstChain: destChain.key,
          dstChainFee: destChainFee.toDecimal(),
          dstChainFeeSymbol: destChainFee.originSymbol,
        },
      } as TxInfo,
    };
    this.dispatchEvent(new CustomEvent<TxInfo>('gc:xcm:new', options));
  }

  private formatAddress(address: string, chain: AnyChain): string {
    if (chain.isEvmParachain()) {
      return convertToH160(address);
    } else {
      return convertAddressSS58(address);
    }
  }

  private formatDestAddress(address: string, chain: AnyChain): string {
    if (chain.key === 'hydradx' && isEthAddress(address)) {
      return convertFromH160(address);
    }
    return address;
  }

  private prefillNative(address: string, chain: AnyChain) {
    if (this.isNativeCompatible(chain)) {
      return convertAddressSS58(address);
    } else {
      return null;
    }
  }

  private prefillEvm(address: string, chain: AnyChain) {
    if (this.isEvmCompatible(chain)) {
      return convertToH160(address);
    } else {
      return null;
    }
  }

  private prefillAddress() {
    const account = this.account.state;
    const { destChain } = this.transfer;

    if (!this.shouldPrefill || !account) {
      return;
    }

    let prefilled: string;
    if (isEvmAccount(account.address)) {
      prefilled = this.prefillEvm(account.address, destChain);
    } else {
      prefilled = this.prefillNative(account.address, destChain);
    }

    this.transfer = {
      ...this.transfer,
      address: prefilled,
    };
  }

  private updateAddress(address: string) {
    this.transfer = {
      ...this.transfer,
      address: address,
    };
  }

  private isEvmAddressError(dest: AnyChain, address: string) {
    return dest.isEvmParachain() && !isEthAddress(address);
  }

  private isSubstrateAddressError(dest: AnyChain, address: string) {
    return (
      dest.isParachain() && dest.key !== 'hydradx' && !isNativeAddress(address)
    );
  }

  private isAddressError(address: string) {
    return !isNativeAddress(address) && !isEthAddress(address);
  }

  private validateAddress() {
    const { address, destChain } = this.transfer;

    if (address == null || address == '') {
      this.transfer.error['address'] = i18n.t('xcm.error.required');
    } else if (this.isEvmAddressError(destChain, address)) {
      this.transfer.error['address'] = i18n.t('xcm.error.notEvmAddr');
    } else if (this.isSubstrateAddressError(destChain, address)) {
      this.transfer.error['address'] = i18n.t('xcm.error.notNativeAddr');
    } else if (this.isAddressError(address)) {
      this.transfer.error['address'] = i18n.t('xcm.error.notValidAddr');
    } else {
      delete this.transfer.error['address'];
    }
  }

  async swap() {
    const account = this.account.state;
    const { address, asset, amount, srcChain, srcChainFee, destChain } =
      this.transfer;

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

  private async calculateSourceFee(feeAssetId: string) {
    const account = this.account.state;
    const chain = this.transfer.srcChain;
    const { srcFee, max, transfer } = this.input;

    if (chain.key !== 'hydradx') {
      return srcFee;
    }

    const feeAsset = this.assets.registry.get(feeAssetId);
    const assets = Array.from(chain.assetsData.values());
    const asset = assets.find((a) => a.id.toString() === feeAssetId);

    if (isEvmAccount(account.address)) {
      const evmAddress = convertToH160(account.address);
      const evmClient = this.wallet.getEvmClient(chain.key);
      const evmProvider = evmClient.getProvider();
      const apiPool = SubstrateApis.getInstance();
      const api = await apiPool.api(chain.ws);
      const call = transfer(max.toDecimal());
      try {
        const extrinsic = api.tx(call.data);
        const data = extrinsic.inner.toHex();
        const [gas, gasPrice] = await Promise.all([
          evmProvider.estimateGas({
            account: evmAddress as `0x${string}`,
            data: data as `0x${string}`,
            to: DISPATCH_ADDRESS as `0x${string}`,
          }),
          evmProvider.getGasPrice(),
        ]);
        return AssetAmount.fromAsset(asset.asset, {
          amount: toBigInt(gas * gasPrice, feeAsset.decimals),
          decimals: feeAsset.decimals,
        });
      } catch (error) {
        return AssetAmount.fromAsset(asset.asset, {
          amount: toBigInt(0n, feeAsset.decimals),
          decimals: feeAsset.decimals,
        });
      }
    }

    const fee = this.calculateAssetPrice(feeAsset, srcFee.amount.toString());
    return AssetAmount.fromAsset(asset.asset, {
      amount: toBigInt(fee.toString(), feeAsset.decimals),
      decimals: feeAsset.decimals,
    });
  }

  private resetBalances() {
    this.transfer.balance = null;
    this.xchain.balance = new Map([]);
  }

  private async syncBalances() {
    const { srcChain } = this.transfer;
    const account = this.account.state;

    if (!account) {
      return;
    }

    const srcAddress = this.formatAddress(account.address, srcChain);

    const observer = (val: AssetAmount) => {
      const balances: Map<string, AssetAmount> = new Map(this.xchain.balance);
      balances.set(val.key, val);
      const { asset } = this.transfer;
      const assetBalance = balances.get(asset.key);
      this.xchain.balance = balances;
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
    const account = this.account.state;

    if (!account) {
      return;
    }

    const srcAddr = this.formatAddress(account.address, srcChain);
    const destAddr = this.formatAddress(account.address, destChain);

    this.input = await this.wallet.transfer(
      asset,
      srcAddr,
      srcChain,
      destAddr,
      destChain,
    );

    const { balance, destFee, max } = this.input;

    const feeAssetId = await this.paymentApi.getPaymentFeeAsset(account);
    const srcFee = await this.calculateSourceFee(feeAssetId);
    this.transfer = {
      ...this.transfer,
      balance: balance.toDecimal(),
      effectiveBalance: max.toDecimal(),
      srcChainFee: srcFee,
      destChainFee: destFee,
      destChainSs58Prefix: destChain.ss58Format,
    };
    this.validateAmount();
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

    this.xchain = {
      ...this.xchain,
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

  protected onInit(): void {
    this.configService = new ConfigService({
      assets: assetsMap,
      chains: chainsMap,
      chainsConfig: chainsConfigMap,
    });
    this.wallet = new Wallet({
      configService: this.configService,
      evmChains: evmChains,
    });
    this.prefillAddress();
    this.syncChains();
    this.syncBalances();
    this.syncInput();
  }

  protected onBlockChange(): void {}

  /**
   * Do nothing, asset balance is synced by wallet
   */
  protected onBalanceUpdate(): void {}

  private onAccountChangeGuard() {
    const current = this.transfer.srcChain;
    if (this.isSupportedWallet(current)) {
      this.changeSourceChain(current.key);
    } else {
      this.changeSourceChain(this.srcChain);
    }
  }

  protected override async onAccountChange(
    prev: Account,
    curr: Account,
  ): Promise<void> {
    super.onAccountChange(prev, curr);
    if (curr && this.wallet) {
      this.onAccountChangeGuard();
    } else {
      this.resetBalances();
    }
  }

  override async update(changedProperties: Map<string, unknown>) {
    if (
      changedProperties.has('srcChain') &&
      changedProperties.has('destChain')
    ) {
      this.transfer = {
        ...this.transfer,
        srcChain: chainsMap.get(this.srcChain),
        destChain: chainsMap.get(this.destChain),
      };
    }
    super.update(changedProperties);
  }

  updated(changed: PropertyValues<this>) {
    const srcChain = changed.get('srcChain');
    if (srcChain) {
      this.changeSourceChain(this.srcChain);
    }

    const destChain = changed.get('destChain');
    if (destChain) {
      this.changeDestinationChain(this.destChain);
    }
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

  protected chainClickedListener({ detail: { item } }) {
    this.isDestChainSelection()
      ? this.changeDestinationChain(item)
      : this.changeSourceChain(item);
    this.changeTab(TransferTab.TransferForm);
  }

  selectChainTab() {
    const classes = {
      tab: true,
      active: this.tab == TransferTab.SelectChain,
    };
    const isDest = this.isDestChainSelection();
    return html`<uigc-paper class=${classMap(classes)}>
      <gc-select-chain
        .chains=${isDest
          ? this.xchain.dest.map((c) => c.key)
          : this.xchain.list.map((c) => c.key)}
        .srcChain=${this.transfer.srcChain}
        .destChain=${this.transfer.destChain}
        .selector=${this.xchain.selector}
        @list-item-clicked=${this.chainClickedListener}
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
        .assets=${this.xchain.tokens}
        .balances=${this.xchain.balance}
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
    this.disablePrefill();
    this.updateAddress(address);
    this.validateAddress();
  }

  protected chainSelectorClickedListener({ detail: { chain } }) {
    this.xchain.selector = chain;
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
        .destChainSs58Prefix=${this.transfer.destChain.ss58Format}
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
