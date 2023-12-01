import { html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import * as i18n from 'i18next';

import { BaseApp } from '../base/BaseApp';
import { baseStyles } from '../styles/base.css';
import { headerStyles } from '../styles/header.css';
import { basicLayoutStyles } from '../styles/layout/basic.css';

import { DatabaseController } from '../../db.ctrl';
import { Account, XChain, xChainCursor } from '../../db';
import { formatAmount, humanizeAmount } from '../../utils/amount';
import { convertAddressSS58, convertToH160 } from '../../utils/account';
import { getRenderString } from '../../utils/dom';

import '@galacticcouncil/ui';
import { bnum, HYDRADX_SS58_PREFIX, Transaction } from '@galacticcouncil/sdk';

import { assetsMap, chainsMap, chainsConfigMap } from '@galacticcouncil/xcm';

import {
  AssetConfig,
  ConfigService,
  ChainConfig,
} from '@moonbeam-network/xcm-config';

import {
  Sdk,
  Signers,
  TransferData,
  getSourceData,
} from '@moonbeam-network/xcm-sdk';
import { Asset, AnyChain } from '@moonbeam-network/xcm-types';
import { getPolkadotApi } from '@moonbeam-network/xcm-utils';

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
  AccountBalance,
} from './types';
import { TxInfo, TxNotificationMssg } from '../transaction/types';

import { XcmWallet } from './wallet';
import { Balance } from './wallet/types';
import { acala, hydradx, moonbeam } from './wallet/evm/chains';

@customElement('gc-xcm-app')
export class XcmApp extends BaseApp {
  private configService = new ConfigService({
    assets: assetsMap,
    chains: chainsMap,
    chainsConfig: chainsConfigMap,
  });

  private wallet: XcmWallet = null;

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
  @property({ type: String }) dstChain: string = null;
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

  private async switchChains() {
    this.transfer = {
      ...this.transfer,
      srcChain: this.transfer.dstChain,
      dstChain: this.transfer.srcChain,
      balance: null,
    };
    this.disconnectSubscriptions();
    this.syncChains();
    await this.syncBalances();
    await this.syncInput();
  }

  private async changeSourceChain(chain: string) {
    this.transfer = {
      ...this.transfer,
      srcChain: chainsMap.get(chain),
      balance: null,
    };
    this.disconnectSubscriptions();
    this.syncChains();
    await this.syncBalances();
    await this.syncInput();
  }

  private async changeDestinationChain(chain: string) {
    this.transfer = {
      ...this.transfer,
      dstChain: chainsMap.get(chain),
      balance: null,
    };
    this.disconnectSubscriptions();
    this.syncChains();
    await this.syncBalances();
    await this.syncInput();
  }

  private async changeAsset(asset: string) {
    this.transfer = {
      ...this.transfer,
      asset: assetsMap.get(asset),
      balance: this.chain.balance.get(asset),
      srcChainFee: null,
      dstChainFee: null,
    };
    await this.syncInput();
  }

  private formatAddress(address: string, chain: AnyChain): string {
    if (chain.key === 'moonbeam') {
      return '0x26f5C2370e563e9f4dDA435f03A63D7C109D8D04';
    }

    if (chain.isEvmParachain()) {
      return address;
    } else {
      return convertAddressSS58(address, chain.ss58Format);
    }
  }

  private async syncBalances() {
    const { srcChain } = this.transfer;
    const { address } = this.account.state;

    const srcChainConfig = chainsConfigMap.get(srcChain.key);
    const srcAddress = this.formatAddress(address, srcChain);

    const observer = (val: Balance) => {
      console.log(val.key, '=>', val.amount);
      const balances: Map<string, string> = new Map(this.chain.balance);
      balances.set(val.key, val.amount.toString());
      this.chain.balance = balances;
    };

    this.disconnectBalanceSubscription = await this.wallet.subscribeBalance(
      srcAddress,
      srcChainConfig,
      observer,
    );
  }

  private async syncInput() {
    const { srcChain, dstChain, asset } = this.transfer;
    const { address, provider } = this.account.state;

    console.time('connection');
    const [srcApi, dstApi] = await Promise.all([
      getPolkadotApi(srcChain.ws),
      getPolkadotApi(dstChain.ws),
    ]);
    console.timeEnd('connection');

    const srcAddr = this.formatAddress(address, srcChain);
    const dstAddr = this.formatAddress(address, dstChain);

    console.log(srcAddr);
    console.log(dstAddr);

    await this.wallet.getSourceData(
      asset,
      dstAddr,
      dstChain,
      srcAddr,
      srcChain,
    );

    const txData = await this.wallet.getTransferData(
      srcAddr,
      srcChain,
      dstAddr,
      dstChain,
      asset,
    );
    console.log(txData);

    let dstAddress: string;
    if (dstChain.isEvmParachain()) {
      dstAddress = convertToH160(address);
    } else {
      dstAddress = convertAddressSS58(address, dstChain.ss58Format);
    }

    const { source, destination } = txData;
    const srcFee = source.fee;
    const dstFee = destination.fee;

    this.transfer = {
      ...this.transfer,
      address: dstAddress,
      balance: source.balance.toDecimal(),
      nativeAsset: srcFee.originSymbol,
      srcChainFee: srcFee.toDecimal(),
      dstChainFee: dstFee.toDecimal(),
    };
  }

  private syncChains() {
    const { srcChain, dstChain, asset } = this.transfer;

    const srcChainCfg: ChainConfig = chainsConfigMap.get(srcChain.key);
    const srcChainAssetCfg: AssetConfig[] = srcChainCfg.getAssetsConfigs();

    const destChains: AnyChain[] = srcChainAssetCfg.map((a) => a.destination);
    const destChainsList = new Set<AnyChain>(destChains);

    const isDestValid: boolean = destChainsList.has(dstChain);
    const validDstChain: AnyChain = isDestValid
      ? dstChain
      : destChainsList.values().next().value;

    const supportedAssets: Asset[] = srcChainAssetCfg
      .filter((a) => a.destination === validDstChain)
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
      dstChain: validDstChain,
      balance: null,
      srcChainFee: null,
      dstChainFee: null,
    };
  }

  override async firstUpdated() {
    this.wallet = new XcmWallet({
      configService: this.configService,
      evmChains: {
        acala: acala,
        moonbeam: moonbeam,
        hydradx: hydradx,
      },
    });
    this.syncChains();
    this.syncBalances();
    this.syncInput();
  }

  override async update(changedProperties: Map<string, unknown>) {
    if (
      changedProperties.has('srcChain') ||
      changedProperties.has('dstChain')
    ) {
      this.transfer = {
        ...this.transfer,
        srcChain: chainsMap.get(this.srcChain),
        dstChain: chainsMap.get(this.dstChain),
      };
    }
    super.update(changedProperties);
  }

  override async updated() {
    /*  if (this.xChain.state && !this.ready) {
      console.log('Initialization...');
      this.ready = true;
      await this.init();
      console.log('Done ✅');
    } */
  }

  protected async onAccountChange(prev: Account, curr: Account): Promise<void> {
    /*   this.resetBalances();
    curr && this.updateAddress(curr.address);

    if (this.ready) {
      await this.syncBalances();
      await this.syncInput();
    } */
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
    return function ({ detail: { item } }) {
      if (isDest) {
        this.changeDestinationChain(item);
      } else {
        this.changeSourceChain(item);
      }
      this.changeTab(TransferTab.TransferForm);
    };
  }

  selectChainTab() {
    const classes = {
      tab: true,
      active: this.tab == TransferTab.SelectChain,
    };
    const isDest = this.chain.selector === this.transfer.dstChain.key;
    return html`<uigc-paper class=${classMap(classes)}>
      <gc-select-chain
        .chains=${isDest
          ? this.chain.dest.map((c) => c.key)
          : this.chain.list.map((c) => c.key)}
        .srcChain=${this.transfer.srcChain}
        .dstChain=${this.transfer.dstChain}
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
    /*  this.updateAmount(value);
    this.validateTransferAmount(); */
  }

  protected addressInputChangedListener({ detail: { address } }) {
    /*  this.updateAddress(address);
    this.validateAddress(); */
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
        .srcChain=${this.transfer.srcChain}
        .dstChain=${this.transfer.dstChain}
        .asset=${this.transfer.asset}
        .amount=${this.transfer.amount}
        .balance=${this.transfer.balance}
        .effectiveBalance=${this.transfer.effectiveBalance}
        .nativeAsset=${this.transfer.nativeAsset}
        .srcChainFee=${this.transfer.srcChainFee}
        .dstChainFee=${this.transfer.dstChainFee}
        .dstChainSs58Prefix=${this.transfer.dstChainSs58Prefix}
        .error=${this.transfer.error}
        .address=${this.transfer.address}
        @asset-input-changed=${this.assetInputChangedListener}
        @address-input-changed=${this.addressInputChangedListener}
        @asset-switch-clicked=${this.switchChains}
        @asset-selector-clicked=${() => this.changeTab(TransferTab.SelectToken)}
        @chain-selector-clicked=${this.chainSelectorClickedListener}
        @transfer-clicked=${() => console.log('transfer clicked')}
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
