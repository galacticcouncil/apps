import { html, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { classMap } from 'lit/directives/class-map.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

import { i18n } from 'localization';
import { translation } from './locales';

import short from 'short-uuid';

import { debounce } from 'ts-debounce';
import { Subscription } from 'rxjs';
import { WatchBlockNumberReturnType } from 'viem';

import { PoolApp } from 'app/PoolApp';
import { Account, Ecosystem, XStoreUtils, XItemCursor, XItem } from 'db';
import { TxInfo, TxMessage, TxNotification } from 'signer/types';
import { baseStyles, headerStyles, basicLayoutStyles } from 'styles';
import { convertAddressSS58, isValidAddress } from 'utils/account';
import { useH160AddressSpace, useSs58AddressSpace } from 'utils/chain';
import { isApprove, parseSpender, parseAmount } from 'utils/erc20';
import { convertFromH160, convertToH160, isEvmAccount } from 'utils/evm';
import { configureExternal } from 'utils/external';
import {
  EVM_PROVIDERS,
  SUBSTRATE_H160_PROVIDERS,
  WalletProvider,
} from 'utils/wallet';

import '@galacticcouncil/ui';
import { findNestedKey, Asset, Transaction } from '@galacticcouncil/sdk';

import {
  tags as xtags,
  assetsMap,
  chainsMap,
  routesMap,
  validations,
  swaps,
  HydrationConfigService,
} from '@galacticcouncil/xcm-cfg';
import { Wallet, Call, EvmCall } from '@galacticcouncil/xcm-sdk';
import {
  addr,
  big,
  AnyChain,
  AnyEvmChain,
  AssetAmount,
  ChainEcosystem,
  Parachain,
  ConfigBuilder,
} from '@galacticcouncil/xcm-core';

import 'element/selector';

import './Form';
import './transfers';

import { wormhole } from './logo';
import {
  TransferTab,
  ChainState,
  TransferState,
  DEFAULT_CHAIN_STATE,
  DEFAULT_TRANSFER_STATE,
} from './types';

import styles from './App.css';

const Tag = xtags.Tag;

@customElement('gc-xcm')
export class XcmApp extends PoolApp {
  private configService: HydrationConfigService = null;
  private wallet: Wallet = null;
  private xStore: XStoreUtils = new XStoreUtils();

  private _syncData = null;
  private _syncKey = null;
  private _xKey = short.generate();

  private ro = new ResizeObserver((entries) => {
    entries.forEach((_entry) => {
      if (TransferTab.Form == this.tab) {
        const defaultScreen = this.shadowRoot.getElementById('default-tab');
        const tabs = this.shadowRoot.querySelectorAll('.tab:not(#default-tab)');
        tabs.forEach((tab: Element) => {
          tab.setAttribute('style', `height: ${defaultScreen.offsetHeight}px`);
        });
      }
    });
  });

  private shouldPrefill: boolean = true;
  private balanceSubscription: Subscription = null;
  private balanceDestSubscription: Subscription = null;
  private evmBlockSubscription: WatchBlockNumberReturnType = null;

  @property({ type: String }) srcChain: string = null;
  @property({ type: String }) destChain: string = null;
  @property({ type: String }) asset: string = null;
  @property({ type: String }) blacklist: string = null;
  @property({ type: Number }) ss58Prefix: number = null;
  @property({ type: Boolean }) assetCheckEnabled: Boolean = false;

  @state() tab: TransferTab = TransferTab.Form;
  @state() transfer: TransferState = DEFAULT_TRANSFER_STATE;
  @state() xchain: ChainState = DEFAULT_CHAIN_STATE;
  @state() blockNo: Number = null;

  constructor() {
    super();
    this._syncData = debounce(this.syncData, 300);
    i18n.init({
      debug: false,
      lng: 'en',
      postProcess: ['highlight'],
      resources: {
        en: {
          translation: translation.en,
        },
      },
    });
  }

  static styles = [baseStyles, headerStyles, basicLayoutStyles, styles];

  isDestChainSelection(): boolean {
    return this.xchain.selector === this.transfer.destChain.key;
  }

  isTransferEmpty(): boolean {
    return this.transfer.amount == null;
  }

  isEmptyAmount(amount: string): boolean {
    return amount === null || amount === '' || amount === '0';
  }

  hasTransferData() {
    return !!this.transfer.transfer;
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

  setLoading(progress: boolean) {
    this.transfer = {
      ...this.transfer,
      inProgress: progress,
    };
  }

  setProcessing(processing: boolean) {
    this.transfer = {
      ...this.transfer,
      isProcessing: processing,
    };
  }

  setApproving(approving: boolean) {
    this.transfer = {
      ...this.transfer,
      isApproving: approving,
    };
  }

  private addError(key: string, error: string) {
    this.transfer.error = {
      ...this.transfer.error,
      [key]: error,
    };
    this.requestUpdate();
  }

  private clearError(key: string) {
    const { [key]: string, ...rest } = this.transfer.error;
    this.transfer.error = {
      ...rest,
    };
    this.requestUpdate();
  }

  private getUpdateKey() {
    const { srcAsset, srcChain, destChain } = this.transfer;
    const date = new Date().getTime();
    this._syncKey = `${srcChain.key}-${destChain.key}-${srcAsset.key}-${date}`;
    return this._syncKey;
  }

  private isLastUpdate(update: string) {
    return this._syncKey == update;
  }

  private hasEvmSupport(chain: AnyChain) {
    if (chain.key === 'hydration') {
      return true;
    }
    return useH160AddressSpace(chain);
  }

  private hasNativeSupport(chain: AnyChain) {
    return useSs58AddressSpace(chain);
  }

  private isSupportedWallet(chain: AnyChain) {
    const account = this.account.state;

    if (!account) {
      return false;
    }

    const provider: WalletProvider = WalletProvider[account.provider];
    if (isEvmAccount(account.address)) {
      if (chain.isParachain()) {
        return SUBSTRATE_H160_PROVIDERS.includes(provider);
      }
      return this.hasEvmSupport(chain) && EVM_PROVIDERS.includes(provider);
    } else {
      return this.hasNativeSupport(chain);
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

  private async changeChain() {
    this.disconnectSubscriptions();
    this.clearTransferErrors();
    // Sync form
    this.syncChains();
    this._syncData(true);
    // Prefill & validation
    this.prefillAddress();
    this.validateAddress();
  }

  private async switchChains() {
    const { destAsset, destChain, srcChain, srcAsset } = this.transfer;
    const supportedWallet = this.isSupportedWallet(destChain);
    if (!supportedWallet) {
      this.onChangeWallet(destChain);
      return;
    }
    this.resetTransfer({
      destAsset: srcAsset,
      destChain: srcChain,
      srcAsset: destAsset,
      srcChain: destChain,
    });
    this.changeChain();
  }

  private async changeSourceChain(chain: string) {
    const { chains } = this.configService;
    const srcChain = chains.get(chain);
    const supportedWallet = this.isSupportedWallet(srcChain);
    if (!supportedWallet) {
      this.onChangeWallet(srcChain);
      return;
    }
    this.resetTransfer({
      srcChain: srcChain,
    });
    this.changeChain();
  }

  private async changeDestinationChain(chain: string) {
    const { chains } = this.configService;
    const destChain = chains.get(chain);
    this.resetTransfer({
      destChain: destChain,
    });
    this.changeChain();
  }

  private async changeAsset(asset: string) {
    const { destChain, srcChain } = this.transfer;
    const transfer = ConfigBuilder(this.configService)
      .assets()
      .asset(asset)
      .source(srcChain)
      .destination(destChain)
      .build();
    const { source, destination, tags } = transfer.origin.route;
    this.clearTransferErrors();
    this.resetTransfer({
      srcAsset: source.asset,
      destAsset: destination.asset,
      tags: tags || [],
    });
    this._syncData();
  }

  updateAmount(amount: string) {
    if (this.isEmptyAmount(amount)) {
      this.transfer = {
        ...this.transfer,
        amount: null,
        isApprove: false,
      };
    } else {
      this.transfer.amount = amount;
    }
    this.requestUpdate();
  }

  updateSrcFee(fee: bigint) {
    const { srcData } = this.transfer;
    const updatedFee = srcData.fee.copyWith({ amount: fee });

    this.transfer = {
      ...this.transfer,
      srcData: {
        ...srcData,
        fee: updatedFee,
      },
    };
  }

  validateAmount() {
    const { amount, destChain } = this.transfer;

    if (this.isEmptyAmount(amount)) {
      this.clearError('amount');
      return;
    }

    if (!this.hasTransferData()) {
      return;
    }

    const { srcAsset, srcData } = this.transfer;
    const { balance, max, min } = srcData;

    const minWithRelay = min.copyWith({
      amount: destChain.isEvmChain() ? min.amount * 2n : min.amount,
    });

    const amountBn = big.toBigInt(amount, balance.decimals);
    const maxBn = big.toBigInt(max.amount, max.decimals);
    const minBn = big.toBigInt(minWithRelay.amount, min.decimals);

    if (balance.amount == 0n) {
      this.addError('amount', i18n.t('error.balance'));
    } else if (amountBn > maxBn) {
      this.addError(
        'amount',
        i18n.t('error.maxAmount', {
          amount: max.toDecimal(max.decimals),
          asset: srcAsset.originSymbol,
        }),
      );
    } else if (amountBn < minBn) {
      this.addError(
        'amount',
        i18n.t('error.minAmount', {
          amount: minWithRelay.toDecimal(minWithRelay.decimals),
          asset: srcAsset.originSymbol,
        }),
      );
    } else {
      this.clearError('amount');
    }
  }

  notificationTemplate(transfer: TransferState, tKey: string): TxMessage {
    const { amount, srcAsset, srcChain, destChain } = transfer;

    const message = i18n.t(tKey, {
      amount: amount,
      asset: srcAsset.originSymbol,
      srcChain: srcChain.name,
      destChain: destChain.name,
    });

    return {
      message: unsafeHTML(message),
      rawHtml: message,
    } as TxMessage;
  }

  notificationApproveTemplate(transfer: TransferState): TxNotification {
    return {
      processing: this.notificationTemplate(transfer, 'approve.processing'),
      success: this.notificationTemplate(transfer, 'approve.success'),
      failure: this.notificationTemplate(transfer, 'approve.error'),
    } as TxNotification;
  }

  notificationTransferTemplate(transfer: TransferState): TxNotification {
    return {
      processing: this.notificationTemplate(transfer, 'notify.processing'),
      success: this.notificationTemplate(transfer, 'notify.success'),
      failure: this.notificationTemplate(transfer, 'notify.error'),
    } as TxNotification;
  }

  processTx(
    account: Account,
    transaction: Transaction,
    transfer: TransferState,
  ) {
    const call = transaction.get<Call>();
    const notification = isApprove(call)
      ? this.notificationApproveTemplate(transfer)
      : this.notificationTransferTemplate(transfer);

    const { srcChain, srcData, destChain, tags } = transfer;
    const srcChainFeeBalance = this.xchain.balance.get(srcData.fee.key);
    const options = {
      bubbles: true,
      composed: true,
      detail: {
        account: account,
        transaction: transaction,
        notification: notification,
        meta: {
          srcChain: srcChain.key,
          srcChainFee: srcData.fee.toDecimal(srcData.fee.decimals),
          srcChainFeeBalance: srcChainFeeBalance?.toDecimal(
            srcData.fee.decimals,
          ),
          srcChainFeeSymbol: srcData.fee.originSymbol,
          dstChain: destChain.key,
          dstChainFee: srcData.destinationFee.toDecimal(
            srcData.destinationFee.decimals,
          ),
          dstChainFeeSymbol: srcData.destinationFee.originSymbol,
          tags: tags.join(','),
        },
      } as TxInfo,
    };
    this.dispatchEvent(new CustomEvent<TxInfo>('gc:xcm:new', options));
  }

  private async validateTransfer() {
    const { srcData, transfer } = this.transfer;
    const report = await transfer.validate(srcData.fee.amount);
    if (report.length > 0) {
      report.forEach((e) => {
        this.addError(
          'transfer.' + e.error,
          i18n.t('error.' + e.error, {
            amount: e.amount,
            symbol: e.asset,
            chain: e.chain,
          }),
        );
      });
    } else {
      this.clearTransferErrors();
    }
  }

  private clearTransferErrors() {
    const { error } = this.transfer;
    Object.keys(error).forEach((e) => {
      if (e.startsWith('transfer.')) {
        this.clearError(e);
      }
    });
  }

  /**
   * Format account address to correct sdk input
   *
   * @param address - ss58 account address
   * @param chain - chain
   * @returns - valid address fornat for given chain
   */
  private formatAddress(address: string, chain: AnyChain): string {
    if (useH160AddressSpace(chain)) {
      return convertToH160(address);
    } else {
      return convertAddressSS58(address);
    }
  }

  /**
   * Format destination address to correct sdk input
   *
   * @param address - ss58 or h160 dest address
   * @param chain - chain
   * @returns - valid address format for given chain
   */
  private formatDestAddress(address: string, chain: AnyChain): string {
    if (chain.key === 'hydration' && addr.isH160(address)) {
      return convertFromH160(address);
    }
    return address;
  }

  private prefillNative(address: string, chain: AnyChain, ss58prefix?: number) {
    if (this.hasNativeSupport(chain)) {
      return convertAddressSS58(address, ss58prefix ? ss58prefix : undefined);
    } else {
      return null;
    }
  }

  private prefillEvm(address: string, chain: AnyChain) {
    if (this.hasEvmSupport(chain)) {
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
      prefilled = this.prefillNative(
        account.address,
        destChain,
        this.ss58Prefix,
      );
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
    return useH160AddressSpace(dest) && !addr.isH160(address);
  }

  private isSubstrateAddressError(dest: AnyChain, address: string) {
    const h160AddrSpace = useH160AddressSpace(dest) || dest.key === 'hydration';
    return !h160AddrSpace && !isValidAddress(address);
  }

  private isAddressError(address: string) {
    return !isValidAddress(address) && !addr.isH160(address);
  }

  private validateAddress() {
    const { address, destChain } = this.transfer;

    if (address == null || address == '') {
      this.transfer.error['address'] = i18n.t('error.required');
    } else if (this.isEvmAddressError(destChain, address)) {
      this.transfer.error['address'] = i18n.t('error.notEvmAddr');
    } else if (this.isSubstrateAddressError(destChain, address)) {
      this.transfer.error['address'] = i18n.t('error.notNativeAddr');
    } else if (this.isAddressError(address)) {
      this.transfer.error['address'] = i18n.t('error.notValidAddr');
    } else {
      delete this.transfer.error['address'];
    }
  }

  private isToAddressValid() {
    return this.transfer.error['address'] === undefined;
  }

  private resetTransfer(delta: Partial<TransferState>) {
    this.transfer = {
      ...this.transfer,
      ...delta,
      inProgress: true,
      isProcessing: false,
      isApproving: false,
      isApprove: false,
      srcBalance: null,
      srcData: null,
      destBalance: null,
      destData: null,
      transfer: null,
    };
  }

  private resetBalances() {
    this.transfer.srcBalance = null;
    this.transfer.destBalance = null;
    this.xchain.balance = new Map([]);
  }

  private updateBalance(balances: AssetAmount[]) {
    const updated: Map<string, AssetAmount> = new Map([]);
    balances.forEach((balance: AssetAmount) => {
      updated.set(balance.key, balance);
    });

    const { srcAsset } = this.transfer;
    const balance = updated.get(srcAsset.key);

    this.transfer.srcBalance = balance;
    this.xchain.balance = updated;
    this.requestUpdate();
  }

  private async syncBalances() {
    const account = this.account.state;
    if (!account) {
      return;
    }

    const { address } = this.account.state;
    const { srcChain, destChain } = this.transfer;
    const srcAddress = this.formatAddress(address, srcChain);
    const destAddr = this.formatAddress(address, destChain);

    this.balanceSubscription = await this.wallet.subscribeBalance(
      srcAddress,
      srcChain,
      (balances: AssetAmount[]) => {
        this.updateBalance(balances);
        this.syncInputOnBalanceChange();
      },
    );

    if (this.isToAddressValid()) {
      this.balanceDestSubscription = await this.wallet.subscribeBalance(
        destAddr,
        destChain,
        (balances: AssetAmount[]) => this.updateBalanceDest(balances),
      );
    }
  }

  private updateBalanceDest(balances: AssetAmount[]) {
    const updated: Map<string, AssetAmount> = new Map([]);
    balances.forEach((balance: AssetAmount) => {
      updated.set(balance.key, balance);
    });

    const { destAsset } = this.transfer;
    const balance = updated.get(destAsset.key);

    this.transfer.destBalance = balance;
    this.requestUpdate();
  }

  private async syncBalancesOnAddressChange() {
    const account = this.account.state;
    if (!account) {
      return;
    }

    const { address, destChain } = this.transfer;
    const destAddr = this.formatDestAddress(address, destChain);
    this.balanceDestSubscription = await this.wallet.subscribeBalance(
      destAddr,
      destChain,
      (balances: AssetAmount[]) => this.updateBalanceDest(balances),
    );
  }

  private async syncInputOnBalanceChange() {
    const { srcAsset, srcData } = this.transfer;
    const { balance } = this.xchain;

    if (!this.hasTransferData()) {
      return;
    }

    const srcAssetBalance = balance.get(srcAsset.key);
    const srcFeeBalance = balance.get(srcData.fee.key);
    const destFeeBalance = balance.get(srcData.destinationFee.key);

    const hasAssetBalanceChange = !srcAssetBalance.isEqual(srcData.balance);
    const hasFeeBalanceChange = !srcFeeBalance.isEqual(srcData.feeBalance);
    const hasDestFeeBalanceChange = !destFeeBalance.isEqual(
      srcData.destinationFeeBalance,
    );

    const shouldSync =
      hasAssetBalanceChange || hasFeeBalanceChange || hasDestFeeBalanceChange;
    if (shouldSync) {
      const update = this.getUpdateKey();
      this.syncInput(update);
    }
  }

  private async syncInput(update: string) {
    if (!this.hasAccount() || !this.isToAddressValid()) {
      return;
    }

    const { address } = this.account.state;
    const {
      destChain,
      srcAsset,
      srcChain,
      address: destAddress,
    } = this.transfer;

    const srcAddr = this.formatAddress(address, srcChain);
    const destAddr = this.formatDestAddress(destAddress, destChain);

    console.log('Sync started for: ' + update);
    const transfer = await this.wallet.transfer(
      srcAsset,
      srcAddr,
      srcChain,
      destAddr,
      destChain,
    );

    if (this.isLastUpdate(update)) {
      console.log('Sync done: ' + update);
      const { source, destination } = transfer;
      this.transfer = {
        ...this.transfer,
        destBalance: destination.balance,
        destData: destination,
        srcBalance: source.balance,
        srcData: source,
        transfer: transfer,
      };
      this.validateAmount();
      this.validateTransfer();
    }
  }

  private async syncEvmContext() {
    const { srcChain } = this.transfer;
    if (!this.hasEvmAccount() || srcChain.isParachain()) {
      return;
    }

    const { client } = srcChain as AnyEvmChain;
    const provider = client.getProvider();
    this.evmBlockSubscription = provider.watchBlockNumber({
      onBlockNumber: (blockNumber) => {
        console.log(`${srcChain.name} block: ${blockNumber}`);
        this.updateEvmContext(blockNumber);
        this.blockNo = Number(blockNumber);
      },
    });
  }

  private async syncData(syncBalance?: boolean) {
    this.setLoading(true);
    const update = this.getUpdateKey();
    const exec = [this.syncInput(update), this.syncEvmContext()];

    if (syncBalance) {
      exec.push(this.syncBalances());
    }

    Promise.all(exec)
      .then(() => {
        if (this.isLastUpdate(update)) {
          this.setLoading(false);
        }
      })
      .catch((error) => {
        console.error(error);
        if (this.isLastUpdate(update)) {
          this.setLoading(false);
        }
      });
  }

  private syncChains() {
    const { routes } = this.configService;
    const { srcAsset, srcChain, destChain } = this.transfer;

    const srcChainRoutes = routes.get(srcChain.key);
    const srcChainAssetRoutes = srcChainRoutes.getRoutes();

    const destBlacklist = this.parseAsSet(this.blacklist);
    const destChains = srcChainAssetRoutes
      .filter((a) => !destBlacklist.has(a.destination.chain.key))
      .map((a) => a.destination.chain);
    const destChainsUnique = new Set<AnyChain>(destChains);

    const isDestReacheable = destChainsUnique.has(destChain);
    const validDestChain = isDestReacheable
      ? destChain
      : destChainsUnique.values().next().value;

    const srcAssets = srcChainAssetRoutes
      .filter((a) => a.destination.chain === validDestChain)
      .map((a) => a.source.asset);

    const isSupportedAsset = srcAssets.includes(srcAsset);

    let selectedAsset = isSupportedAsset ? srcAsset : srcAssets[0];

    if (!isSupportedAsset && srcChain.key === 'ethereum') {
      selectedAsset = srcAssets.find((a) => a.key === 'eth');
    }

    if (!isSupportedAsset && validDestChain.key === 'ethereum') {
      selectedAsset = srcAssets.find((a) => a.key === 'weth_mwh');
    }

    const transfer = ConfigBuilder(this.configService)
      .assets()
      .asset(selectedAsset)
      .source(srcChain)
      .destination(validDestChain)
      .build();

    this.xchain = {
      ...this.xchain,
      dest: [...destChainsUnique],
      assets: srcAssets,
      balance: new Map([]),
    };

    const { source, destination, tags } = transfer.origin.route;
    this.transfer = {
      ...this.transfer,
      srcAsset: source.asset,
      destAsset: destination.asset,
      destChain: validDestChain,
      tags: tags || [],
    };
  }

  protected onInit(): void {
    this.changeChain();
    const { poolService } = this.chain.state;
    this.wallet = new Wallet({
      configService: this.configService,
      transferValidations: validations,
    });

    // Register chain swaps
    const hydration = this.configService.getChain('hydration');
    const assethub = this.configService.getChain('assethub');

    this.wallet.registerSwaps(
      new swaps.HydrationSwap(hydration, poolService),
      new swaps.AssethubSwap(assethub),
    );
  }

  protected onBlockChange(): void {}

  protected onBalanceUpdate(): void {}

  protected onBroadcastMessage(event: MessageEvent): void {
    if (event.data === 'external-sync') {
      this.initConfig();
      this.changeChain();
    }
  }

  private onAccountChangeSync() {
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
    this.resetBalances();
    super.onAccountChange(prev, curr);
    if (curr && this.wallet) {
      this.onAccountChangeSync();
    }
  }

  private initConfig() {
    this.parseAsList(this.blacklist).forEach((c) => {
      chainsMap.delete(c);
      routesMap.delete(c);
    });
    this.configService = new HydrationConfigService({
      assets: assetsMap,
      chains: chainsMap,
      routes: routesMap,
    });
    configureExternal(this.isTestnet, this.configService);
  }

  private initTransferState() {
    const { assets, chains } = this.configService;
    this.transfer = {
      ...this.transfer,
      srcAsset: assets.get(this.asset),
      srcChain: chains.get(this.srcChain),
      destChain: chains.get(this.destChain),
    };
  }

  private initXChainState() {
    const { chains } = this.configService;
    const chainList = Array.from(chains.values());
    this.xchain = {
      ...this.xchain,
      list: chainList
        .filter((c) => {
          switch (this.ecosystem) {
            case Ecosystem.Polkadot:
              return c.ecosystem === ChainEcosystem.Polkadot || c.isEvmChain();
            case Ecosystem.Kusama:
              return c.ecosystem === ChainEcosystem.Kusama;
            default:
              throw new Error('Unknown ecosystem');
          }
        })
        .sort(function (a, b) {
          if (a.name < b.name) {
            return -1;
          }
          if (a.name > b.name) {
            return 1;
          }
          return 0;
        }),
    };
  }

  override async update(changedProperties: Map<string, unknown>) {
    if (
      changedProperties.has('srcChain') &&
      changedProperties.has('destChain')
    ) {
      this.initConfig();
      this.initTransferState();
      this.initXChainState();
      this.syncChains();
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
    XItemCursor.addWatch(this._xKey, (_id, _prev, curr) => {
      this.setApproving(true);
      this.xStore.add(curr);
    });
    this.ro.observe(this);
  }

  private disconnectSubscriptions() {
    this.resetBalances();
    this.balanceSubscription?.unsubscribe();
    this.balanceDestSubscription?.unsubscribe();
    this.evmBlockSubscription?.();
  }

  override disconnectedCallback() {
    XItemCursor.removeWatch(this._xKey);
    this.ro.unobserve(this);
    this.disconnectSubscriptions();
    super.disconnectedCallback();
  }

  protected onChainClick({ detail: { item } }) {
    this.isDestChainSelection()
      ? this.changeDestinationChain(item.key)
      : this.changeSourceChain(item.key);
    this.changeTab(TransferTab.Form);
  }

  selectChainTab() {
    const active = this.tab === TransferTab.SelectChain;
    const isDest = this.isDestChainSelection();
    const classes = {
      tab: true,
      active: active,
    };
    return html`
      <uigc-paper class=${classMap(classes)}>
        <gc-select-xchain
          .active=${this.tab == TransferTab.SelectChain}
          .chains=${isDest
            ? this.xchain.dest.map((c) => c)
            : this.xchain.list.map((c) => c)}
          .srcChain=${this.transfer.srcChain}
          .destChain=${this.transfer.destChain}
          .selector=${this.xchain.selector}
          @list-item-click=${this.onChainClick}>
          <div class="header section" slot="header">
            <uigc-icon-button
              class="back"
              @click=${() => this.changeTab(TransferTab.Form)}>
              <uigc-icon-back></uigc-icon-back>
            </uigc-icon-button>
            <uigc-typography variant="section">
              ${isDest
                ? i18n.t('header.select.chainDst')
                : i18n.t('header.select.chainSrc')}
            </uigc-typography>
            <span></span>
          </div>
        </gc-select-xchain>
      </uigc-paper>
    `;
  }

  protected onAssetClick({ detail: { symbol } }) {
    this.changeAsset(symbol);
    this.changeTab(TransferTab.Form);
  }

  selectTokenTab() {
    const active = this.tab === TransferTab.SelectToken;
    const classes = {
      tab: true,
      active: active,
    };
    return html`
      <uigc-paper class=${classMap(classes)}>
        <gc-select-xasset
          .assets=${this.xchain.assets}
          .balances=${this.xchain.balance}
          .asset=${this.transfer.srcAsset}
          .chain=${this.transfer.srcChain}
          .ecosystem=${this.ecosystem}
          .registry=${this.assets.registry}
          .registryChain=${this.configService.getChain('hydration')}
          @asset-click=${this.onAssetClick}>
          <div class="header section" slot="header">
            <uigc-icon-button
              class="back"
              @click=${() => this.changeTab(TransferTab.Form)}>
              <uigc-icon-back></uigc-icon-back>
            </uigc-icon-button>
            <uigc-typography variant="section">
              ${i18n.t('header.select')}
            </uigc-typography>
            <span></span>
          </div>
        </gc-select-xasset>
      </uigc-paper>
    `;
  }

  private updateApprovalCtx(call: EvmCall, nonce: number) {
    const approvingTx = this.xStore.transactions.find(
      (tx: XItem) => tx.nonce === nonce && tx.to === call.to,
    );

    const isApproving = approvingTx && call.allowance < parseAmount(call.data);
    this.transfer = {
      ...this.transfer,
      isApproving: isApproving,
      isApprove: true,
    };
  }

  private updateTransferCtx(call: EvmCall, nonce: number) {
    const { srcAsset, srcChain } = this.transfer;
    this.transfer = {
      ...this.transfer,
      isApproving: false,
      isApprove: false,
    };

    const assetId = srcChain.getBalanceAssetId(srcAsset);
    const approvedTx = this.xStore.transactions.filter(
      (tx: XItem) =>
        tx.nonce < nonce &&
        tx.to === assetId &&
        parseSpender(tx.data) === call.to,
    );

    approvedTx.forEach((tx: XItem) => this.xStore.remove(tx.hash));
  }

  private updateEvmContext(blockNumber?: bigint) {
    const { amount, srcChain, transfer } = this.transfer;

    if (
      !srcChain.isEvm() ||
      !this.hasTransferData() ||
      this.isEmptyAmount(amount)
    ) {
      return;
    }

    const { address } = this.account.state;
    const h160Addr = convertToH160(address) as `0x${string}`;

    const { client } = srcChain as AnyEvmChain;
    const provider = client.getProvider();
    provider
      .getTransactionCount({
        address: h160Addr,
        blockNumber: blockNumber,
      })
      .then((nonce) => {
        transfer.buildCall(amount).then((call: EvmCall) => {
          const isApproveCall = isApprove(call);
          if (isApproveCall) {
            this.updateApprovalCtx(call, nonce);
          } else {
            this.updateTransferCtx(call, nonce);
          }

          if (call.to) {
            Promise.all([
              provider.estimateGas({
                account: h160Addr,
                data: call.data,
                to: call.to,
                value: call.value,
              }),
              provider.getGasPrice(),
            ]).then(([gas, gasPrice]) => {
              const fee = gas * gasPrice;
              this.updateSrcFee(fee);
              this.validateTransfer();
            });
          }
        });
      });
  }

  protected onAssetInputChange({ detail: { value } }) {
    this.updateAmount(value);
    this.validateAmount();
    this.updateEvmContext();
  }

  protected onAddressInputChange({ detail: { address } }) {
    this.disablePrefill();
    this.updateAddress(address);
    this.validateAddress();

    this.balanceDestSubscription?.unsubscribe();
    if (this.isToAddressValid()) {
      const update = this.getUpdateKey();
      this.syncInput(update);
      this.syncBalancesOnAddressChange();
    } else {
      this.transfer.destBalance = null;
      this.clearTransferErrors();
    }
  }

  protected onChainSwitchClick({ detail }) {
    this.switchChains();
  }

  protected onChainSelectorClick({ detail: { chain } }) {
    this.xchain.selector = chain;
    this.changeTab(TransferTab.SelectChain);
  }

  async onTransferClick() {
    const account = this.account.state;
    const { address, amount, srcAsset, srcChain, destChain } = this.transfer;

    const srcAddr = this.formatAddress(account.address, srcChain);
    const destAddr = this.formatDestAddress(address, destChain);

    const xTransfer = await this.wallet.transfer(
      srcAsset,
      srcAddr,
      srcChain,
      destAddr,
      destChain,
    );

    const call = await xTransfer.buildCall(amount);
    const transaction = {
      hex: call.data,
      name: 'xcm',
      get: (): Call => {
        return call;
      },
    } as Transaction;
    this.processTx(account, transaction, this.transfer);
  }

  private isFormDisabled() {
    return this.isTransferEmpty() || this.hasError() || !this.hasTransferData();
  }

  private isWormholeTransfer() {
    const { tags } = this.transfer;
    return tags.includes(Tag.Wormhole);
  }

  formTab() {
    const classes = {
      tab: true,
      active: this.tab == TransferTab.Form,
    };
    return html`
      <uigc-paper class=${classMap(classes)} id="default-tab">
        <gc-xcm-form
          .inProgress=${this.transfer.inProgress}
          .isProcessing=${this.transfer.isProcessing}
          .isApproving=${this.transfer.isApproving}
          .isApprove=${this.transfer.isApprove}
          .disabled=${this.isFormDisabled()}
          .address=${this.transfer.address}
          .amount=${this.transfer.amount}
          .srcAsset=${this.transfer.srcAsset}
          .srcBalance=${this.transfer.srcBalance}
          .srcChain=${this.transfer.srcChain}
          .srcData=${this.transfer.srcData}
          .destAsset=${this.transfer.destAsset}
          .destBalance=${this.transfer.destBalance}
          .destChain=${this.transfer.destChain}
          .destData=${this.transfer.destData}
          .tags=${this.transfer.tags}
          .error=${this.transfer.error}
          .ecosystem=${this.ecosystem}
          .registry=${this.assets.registry}
          .registryChain=${this.configService.getChain('hydration')}
          @asset-input-change=${this.onAssetInputChange}
          @address-input-change=${this.onAddressInputChange}
          @asset-switch-click=${this.onChainSwitchClick}
          @asset-selector-click=${() => this.changeTab(TransferTab.SelectToken)}
          @chain-selector-click=${this.onChainSelectorClick}
          @transfer-click=${() => {
            this.setProcessing(true);
            this.onTransferClick()
              .then(() => this.setProcessing(false))
              .catch((err) => {
                console.error(err);
                this.setProcessing(false);
              });
          }}>
          <div class="header" slot="header">
            <uigc-typography variant="title">
              ${i18n.t('header.form')}
            </uigc-typography>
            <span class="grow"></span>
          </div>
        </gc-xcm-form>
      </uigc-paper>
      ${when(
        this.isWormholeTransfer(),
        () => html`
          <div class="logo">
            <span>Powered by</span>
            ${wormhole}
          </div>
        `,
      )}
    `;
  }

  protected validateAssetByOrigin(asset?: Asset, origin?: number) {
    const parachainEntry = findNestedKey(asset?.location, 'parachain');
    return asset?.type === 'External' && parachainEntry?.parachain === origin
      ? asset
      : null;
  }

  assetCheck() {
    if (this.assetCheckEnabled) {
      const { srcAsset } = this.transfer;

      const assethub = this.configService.getChain('assethub') as Parachain;
      const registry = this.configService.getChain('hydration');
      const registryId = registry.getBalanceAssetId(srcAsset);
      const registryAsset = this.assets.registry.get(registryId.toString());

      const assetIn = this.validateAssetByOrigin(
        registryAsset,
        assethub.parachainId,
      );

      if (assetIn) {
        return html`
          <gc-trade-asset-info
            .chain=${assethub}
            .assets=${this.assets.registry}
            .assetIn=${assetIn}></gc-trade-asset-info>
        `;
      }
    }
  }

  render() {
    return html`
      <div class="layout-root">
        ${this.formTab()} ${this.selectChainTab()} ${this.selectTokenTab()}
        ${this.assetCheck()}
      </div>
    `;
  }
}
