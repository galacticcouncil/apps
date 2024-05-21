import '@polkadot/api-augment';

import { html, css, PropertyValues } from 'lit';
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
import { baseStyles } from 'styles/base.css';
import { headerStyles } from 'styles/header.css';
import { basicLayoutStyles } from 'styles/layout/basic.css';
import {
  EVM_NATIVE_ASSET_ID,
  convertAddressSS58,
  isValidAddress,
} from 'utils/account';
import { exchangeNative, formatAmount, humanizeAmount } from 'utils/amount';
import { getXcmKey } from 'utils/asset';
import { isApprove, parseSpender, parseAmount } from 'utils/erc20';
import { calculateEffectiveBalance } from 'utils/balance';
import {
  convertFromH160,
  convertToH160,
  isEvmAccount,
  DISPATCH_ADDRESS,
} from 'utils/evm';

import '@galacticcouncil/ui';
import {
  Asset,
  BigNumber,
  ONE,
  SYSTEM_ASSET_DECIMALS,
  SYSTEM_ASSET_ID,
  Transaction,
  scale,
} from '@galacticcouncil/sdk';

import {
  assetsMap,
  chainsMap,
  chainsConfigMap,
} from '@galacticcouncil/xcm-cfg';

import { Wallet, XCall, XCallEvm, XTransfer } from '@galacticcouncil/xcm-sdk';

import {
  AnyChain,
  AnyEvmChain,
  AnyParachain,
  AssetAmount,
  ChainEcosystem,
  ConfigService,
  EvmParachain,
  Parachain,
  isH160Address,
} from '@galacticcouncil/xcm-core';

import { toBigInt } from '@moonbeam-network/xcm-utils';

import type {
  PalletAssetsAssetDetails,
  PalletAssetsAssetAccount,
} from '@polkadot/types/lookup';
import { Option } from '@polkadot/types';

import 'element/selector';

import './Form';

import { wormhole } from './logo';
import {
  TransferTab,
  ChainState,
  TransferState,
  DEFAULT_CHAIN_STATE,
  DEFAULT_TRANSFER_STATE,
} from './types';

@customElement('gc-xcm')
export class XcmApp extends PoolApp {
  private configService: ConfigService = null;
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

  @state() tab: TransferTab = TransferTab.Form;
  @state() transfer: TransferState = DEFAULT_TRANSFER_STATE;
  @state() xchain: ChainState = DEFAULT_CHAIN_STATE;

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

  static styles = [
    baseStyles,
    headerStyles,
    basicLayoutStyles,
    css`
      :host {
        max-width: 570px;
      }

      .logo {
        padding: 16px 0;
        display: flex;
        text-align: center;
        align-items: center;
        justify-content: center;
      }

      .logo svg {
        margin-left: 8px;
      }

      .logo span {
        font-family: var(--uigc-app-font);
        color: var(--hex-background-gray-500);
        font-size: 14px;
        font-style: normal;
        font-weight: 600;
        line-height: 100%;
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
    return amount === null || amount === '' || amount === '0';
  }

  hasTransferData() {
    return !!this.transfer.xTransfer;
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

  private getUpdateKey() {
    const { asset, srcChain, destChain } = this.transfer;
    const date = new Date().getTime();
    this._syncKey = `${srcChain?.key}-${destChain?.key}-${asset?.key}-${date}`;
    return this._syncKey;
  }

  private isLastUpdate(update: string) {
    return this._syncKey == update;
  }

  private hasH160AddrSupport(chain: AnyChain) {
    if (chain instanceof EvmParachain) {
      return chain.h160AccOnly;
    }
    return chain.isEvmChain();
  }

  private isEvmCompatible(chain: AnyChain) {
    if (chain.key === 'hydradx') {
      return true;
    }
    return this.hasH160AddrSupport(chain);
  }

  private isNativeCompatible(chain: AnyChain) {
    if (chain instanceof EvmParachain) {
      return !chain.h160AccOnly;
    }
    return chain.isParachain();
  }

  private isSupportedWallet(chain: AnyChain) {
    const account = this.account.state;

    if (!account) {
      return false;
    }

    if (isEvmAccount(account.address)) {
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

  private async changeChain() {
    this.disconnectSubscriptions();
    this.clearErrors();
    // Sync form
    this.syncChains();
    this._syncData(true);
    // Prefill & validation
    this.prefillAddress();
    this.validateAddress();
  }

  private async switchChains() {
    const { destChain, srcChain } = this.transfer;
    const supportedWallet = this.isSupportedWallet(destChain);
    if (!supportedWallet) {
      this.onChangeWallet(destChain);
      return;
    }
    this.resetTransfer({
      balance: null,
      destChain: srcChain,
      srcChain: destChain,
    });
    this.changeChain();
  }

  private async changeSourceChain(chain: string) {
    const srcChain = chainsMap.get(chain);
    const supportedWallet = this.isSupportedWallet(srcChain);
    if (!supportedWallet) {
      this.onChangeWallet(srcChain);
      return;
    }
    this.resetTransfer({
      balance: null,
      srcChain: srcChain,
    });
    this.changeChain();
  }

  private async changeDestinationChain(chain: string) {
    const destChain = chainsMap.get(chain);
    this.resetTransfer({
      balance: null,
      destChain: destChain,
    });
    this.changeChain();
  }

  private async changeAsset(asset: string) {
    const balance = this.xchain.balance.get(asset);
    this.clearErrors();
    this.resetTransfer({
      balance: balance,
      asset: assetsMap.get(asset),
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
    const { srcChainFee } = this.transfer;
    this.transfer = {
      ...this.transfer,
      srcChainFee: srcChainFee.copyWith({ amount: fee }),
    };
  }

  validateAmount() {
    const { amount, destChain } = this.transfer;

    if (this.isEmptyAmount(amount)) {
      delete this.transfer.error['amount'];
      return;
    }

    if (!this.hasTransferData()) {
      return;
    }

    const { asset, balance, max, min } = this.transfer;
    const minWithRelay = min.copyWith({
      amount: destChain.isEvmChain() ? min.amount * 2n : min.amount,
    });

    const amountBn = toBigInt(amount, balance.decimals);
    const maxBn = toBigInt(max.amount, max.decimals);
    const minBn = toBigInt(minWithRelay.amount, max.decimals);

    if (balance.amount == 0n) {
      this.transfer.error['amount'] = i18n.t('error.balance');
    } else if (amountBn > maxBn) {
      this.transfer.error['amount'] = i18n.t('error.maxAmount', {
        amount: max.toDecimal(),
        asset: asset.originSymbol,
      });
    } else if (amountBn < minBn) {
      this.transfer.error['amount'] = i18n.t('error.minAmount', {
        amount: minWithRelay.toDecimal(),
        asset: asset.originSymbol,
      });
    } else {
      delete this.transfer.error['amount'];
    }
    this.requestUpdate();
  }

  notificationTemplate(transfer: TransferState, tKey: string): TxMessage {
    const { amount, asset, srcChain, destChain } = transfer;

    const message = i18n.t(tKey, {
      amount: amount,
      asset: asset.originSymbol,
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
    const call = transaction.get<XCall>();
    const notification = isApprove(call)
      ? this.notificationApproveTemplate(transfer)
      : this.notificationTransferTemplate(transfer);

    const { srcChain, srcChainFee, destChain, destChainFee } = transfer;
    const srcChainFeeBalance = this.xchain.balance.get(srcChainFee.key);
    const options = {
      bubbles: true,
      composed: true,
      detail: {
        account: account,
        transaction: transaction,
        notification: notification,
        meta: {
          srcChain: srcChain.key,
          srcChainFee: srcChainFee.toDecimal(srcChainFee.decimals),
          srcChainFeeBalance: srcChainFeeBalance?.toDecimal(
            srcChainFee.decimals,
          ),
          srcChainFeeSymbol: srcChainFee.originSymbol,
          dstChain: destChain.key,
          dstChainFee: destChainFee.toDecimal(destChainFee.decimals),
          dstChainFeeSymbol: destChainFee.originSymbol,
        },
      } as TxInfo,
    };
    this.dispatchEvent(new CustomEvent<TxInfo>('gc:xcm:new', options));
  }

  private async validateSrcFee() {
    console.log('[validation] => Fee (SRC)');
    const { srcChain, srcChainFee } = this.transfer;

    const skipValidationFor = new Set(['bifrost', 'hydradx']);
    if (skipValidationFor.has(srcChain.key)) {
      this.clearError('feeSrc');
      return;
    }

    const srcFeeBalance = this.xchain.balance.get(srcChainFee.key);
    if (srcFeeBalance && srcFeeBalance.amount < srcChainFee.amount) {
      const srcFeeBalanceFmt = srcFeeBalance.toDecimal(srcFeeBalance.decimals);
      console.log(' Balance: ' + srcFeeBalanceFmt);
      const amount = srcChainFee.toDecimal(srcChainFee.decimals);
      const symbol = srcChainFee.originSymbol;
      const chain = srcChain.name;
      this.addError(
        'feeSrc',
        i18n.t('error.transfer.fee', {
          amount,
          symbol,
          chain,
        }),
      );
    } else {
      this.clearError('feeSrc');
    }
  }

  private async validateDestFee() {
    console.log('[validation] => Fee (DEST)');
    const { srcChain, destChainFee } = this.transfer;
    const destFeeBalance = this.xchain.balance.get(destChainFee.key);

    let ed = 0n;
    if (srcChain.key === 'assethub') {
      const chain = srcChain as Parachain;
      const api = await chain.api;
      const assetId = chain.getAssetId(destChainFee);
      const response = await api.query.assets.asset<
        Option<PalletAssetsAssetDetails>
      >(assetId);
      const details = response.unwrap();
      ed = details.minBalance.toBigInt();
    }

    const minBalance = destChainFee.copyWith({
      amount: destChainFee.amount + ed,
    });

    if (destFeeBalance && destFeeBalance.amount < minBalance.amount) {
      const destFeeBalanceFmt = destFeeBalance.toDecimal(
        destFeeBalance.decimals,
      );
      console.log(' Balance: ' + destFeeBalanceFmt);
      const amount = minBalance.toDecimal(destChainFee.decimals);
      const symbol = minBalance.originSymbol;
      const chain = srcChain.name;
      this.addError(
        'feeDest',
        i18n.t('error.transfer.feeDest', {
          amount,
          symbol,
          chain,
        }),
      );
    } else {
      this.clearError('feeDest');
    }
  }

  private async validateHubEd() {
    console.log('[validation] => AssetHub ED');
    const { destChain } = this.transfer;
    const destChainDotBalance = this.xchain.balanceDest.get('dot');

    if (
      destChain.key === 'assethub' &&
      destChainDotBalance &&
      destChainDotBalance.amount === 0n
    ) {
      const dotBalanceFmt = destChainDotBalance.toDecimal(
        destChainDotBalance.decimals,
      );
      const dotEd = '0.01';
      console.log(' DOT min: ' + dotEd);
      console.log(' DOT balance: ' + dotBalanceFmt);
      this.addError(
        'hubEd',
        i18n.t('error.transfer.ed', {
          amount: '0.01',
          symbol: 'DOT',
          chain: 'AssetHub',
        }),
      );
    } else {
      this.clearError('hubEd');
    }
  }

  private async validateHubFrozen() {
    console.log('[validation] => AssetHub FROZEN');
    const { asset, srcChain } = this.transfer;
    const account = this.account.state;

    if (srcChain.key !== 'assethub' || !account) {
      this.clearError('hubFrozen');
      return;
    }

    const chain = srcChain as Parachain;
    const api = await chain.api;
    const assetId = chain.getAssetId(asset);
    const response = await api.query.assets.account<
      Option<PalletAssetsAssetAccount>
    >(assetId, account.address);

    if (response.isEmpty) {
      this.clearError('hubFrozen');
      return;
    }

    const details = response.unwrap();
    console.log(' Asset: ' + asset.originSymbol);
    console.log(' Status: ' + details.status.toHuman());
    if (details.status.isFrozen) {
      this.addError(
        'hubFrozen',
        i18n.t('error.transfer.frozen', {
          symbol: asset.originSymbol,
          chain: srcChain.name,
        }),
      );
    } else {
      this.clearError('hubFrozen');
    }
  }

  private async validateHydraEd() {
    console.log('[validation] => HydraDX ED');
    const { router } = this.chain.state;
    const { asset, address, srcChain, destChain } = this.transfer;

    if (destChain.key !== 'hydradx' || srcChain.isEvmChain()) {
      this.clearError('hdxEd');
      return;
    }

    const chain = srcChain as Parachain;
    const destChainBalance = this.xchain.balanceDest.get(asset.key);
    const isExistingAccount = destChainBalance.amount > 0n;
    const onChainAsset = Array.from(this.assets.registry.values()).find(
      (a) =>
        a.symbol.toLowerCase() === asset.originSymbol.toLowerCase() &&
        a.origin === chain.parachainId,
    );
    const isSufficient = onChainAsset ? onChainAsset.isSufficient : true;
    console.log(' Is sufficient: ' + isSufficient);
    console.log(' Is existing acc: ' + isExistingAccount);
    if (isSufficient || isExistingAccount) {
      this.clearError['hdxEd'];
      return;
    }

    const addr = this.formatDestAddress(address, destChain);
    const feeAssetId = await this.paymentApi.getPaymentFeeAsset(addr);
    const feeAsset = this.assets.registry.get(feeAssetId);
    const feeAssetKey = getXcmKey(feeAsset);
    const feeAssetBalance = this.xchain.balanceDest.get(feeAssetKey);
    const feeAssetBalanceBN = new BigNumber(feeAssetBalance.amount.toString());

    const feeNativeEd = ONE.multipliedBy(1.1);
    let feeAssetSpot: BigNumber;

    if (SYSTEM_ASSET_ID === feeAssetId) {
      feeAssetSpot = scale(ONE, SYSTEM_ASSET_DECIMALS);
    } else {
      const price = await router.getBestSpotPrice(SYSTEM_ASSET_ID, feeAssetId);
      feeAssetSpot = price.amount;
    }

    const feeAssetEd = feeNativeEd.times(feeAssetSpot);
    const feeAssetNotSuffient = feeAssetEd.gt(feeAssetBalanceBN);
    const feeAssetEdFmt = formatAmount(feeAssetEd, feeAssetBalance.decimals);
    const feeAssetBalanceFmt = feeAssetBalance.toDecimal(
      feeAssetBalance.decimals,
    );

    console.log(' Fee asset: ' + feeAsset.symbol);
    console.log(' Fee asset min: ' + feeAssetEdFmt);
    console.log(' Fee asset balance: ' + feeAssetBalanceFmt);
    if (feeAssetNotSuffient) {
      this.addError(
        'hdxEd',
        i18n.t('error.transfer.ed', {
          amount: humanizeAmount(feeAssetEdFmt),
          symbol: feeAsset.symbol,
          chain: 'HydraDX',
        }),
      );
    } else {
      this.clearError('hdxEd');
    }
  }

  private async validateHydraMrlFee() {
    console.log('[validation] => HydraDX MRL Fee');
    const { srcChain, destChain } = this.transfer;
    const glmrBalance = this.xchain.balance.get('glmr');

    if (
      srcChain.key === 'hydradx' &&
      destChain.isEvmChain() &&
      glmrBalance.amount < 1000000000000000000n
    ) {
      const glmrBalanceFmt = glmrBalance.toDecimal(glmrBalance.decimals);
      const glmrFee = '1';
      console.log(' GLMR fee: ' + glmrFee);
      console.log(' GLMR balance: ' + glmrBalanceFmt);
      this.addError(
        'hdxMrlFee',
        i18n.t('error.transfer.fee', {
          amount: '1',
          symbol: 'GLMR',
          chain: 'HydraDX',
        }),
      );
    } else {
      this.clearError('hdxMrlFee');
    }
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

  private async clearErrors() {
    this.clearError('feeSrc');
    this.clearError('feeDest');
    this.clearError('hubEd');
    this.clearError('hubFrozen');
    this.clearError('hdxEd');
    this.clearError('hdxMrlFee');
  }

  private async validateTransfer() {
    const { asset, destChainFee } = this.transfer;
    await this.validateSrcFee();
    await this.validateHydraMrlFee();

    // No need for additional checks, exit & clean
    const isSufficientPaymentAsset = asset.isEqual(destChainFee);
    if (isSufficientPaymentAsset) {
      return;
    }

    await this.validateDestFee();
    await this.validateHubEd();
    await this.validateHubFrozen();
    await this.validateHydraEd();
  }

  /**
   * Format account address to correct sdk input
   *
   * @param address - ss58 account address
   * @param chain - chain
   * @returns - valid account address for given chain
   */
  private formatAddress(address: string, chain: AnyChain): string {
    if (this.hasH160AddrSupport(chain)) {
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
   * @returns - valid dest address for given chain
   */
  private formatDestAddress(address: string, chain: AnyChain): string {
    if (chain.key === 'hydradx' && isH160Address(address)) {
      return convertFromH160(address);
    }
    return address;
  }

  private prefillNative(address: string, chain: AnyChain, ss58prefix?: number) {
    if (this.isNativeCompatible(chain)) {
      return convertAddressSS58(address, ss58prefix ? ss58prefix : undefined);
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
    return this.hasH160AddrSupport(dest) && !isH160Address(address);
  }

  private isSubstrateAddressError(dest: AnyChain, address: string) {
    return (
      dest instanceof Parachain &&
      !['hydradx', 'moonbeam', 'acala-evm'].includes(dest.key) &&
      !isValidAddress(address)
    );
  }

  private isAddressError(address: string) {
    return !isValidAddress(address) && !isH160Address(address);
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

  private async calculateSourceFee(
    xTransfer: XTransfer,
    feeAsset: Asset,
    srcChain: AnyParachain,
  ) {
    const account = this.account.state;
    const { max, srcFee } = xTransfer;
    const feeAssetData = Array.from(srcChain.assetsData.values()).find((a) => {
      return Object.hasOwn(a, 'metadataId')
        ? a.metadataId.toString() === feeAsset.id
        : a.id.toString() === feeAsset.id;
    });
    if (isEvmAccount(account.address) && feeAsset.id === EVM_NATIVE_ASSET_ID) {
      const chain = srcChain as EvmParachain;
      const api = await chain.api;
      const evmAddress = convertToH160(account.address);
      const evmProvider = chain.client.getProvider();
      const call = await xTransfer.buildCall(max.toDecimal(max.decimals));
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
        return AssetAmount.fromAsset(feeAssetData.asset, {
          amount: toBigInt(gas * gasPrice, feeAsset.decimals),
          decimals: feeAsset.decimals,
        });
      } catch (error) {
        return AssetAmount.fromAsset(feeAssetData.asset, {
          amount: toBigInt(0n, feeAsset.decimals),
          decimals: feeAsset.decimals,
        });
      }
    }

    const fee = exchangeNative(
      this.assets.nativePrice,
      feeAsset,
      srcFee.amount.toString(),
    );
    return AssetAmount.fromAsset(feeAssetData.asset, {
      amount: toBigInt(fee.toString(), 0),
      decimals: feeAsset.decimals,
    });
  }

  private updateBalance(balances: AssetAmount[]) {
    const { asset, balance, max } = this.transfer;
    const updated: Map<string, AssetAmount> = new Map([]);
    balances.forEach((balance: AssetAmount) => {
      updated.set(balance.key, balance);
    });

    const newBalance = updated.get(asset.key);
    this.transfer.balance = newBalance;
    this.xchain.balance = updated;

    if (this.hasTransferData() && balance) {
      const diff = newBalance.amount - balance.amount || 0n;
      const newMax = max.amount + diff;
      this.transfer.max = max.copyWith({
        amount: newMax < 0 ? 0n : newMax,
      });
    }
    this.validateAmount();
  }

  private updateBalanceDest(balances: AssetAmount[]) {
    const updated: Map<string, AssetAmount> = new Map([]);
    balances.forEach((balance: AssetAmount) => {
      updated.set(balance.key, balance);
    });
    this.xchain.balanceDest = updated;
  }

  private resetTransfer(delta: Partial<TransferState>) {
    this.transfer = {
      ...this.transfer,
      ...delta,
      inProgress: true,
      isProcessing: false,
      isApproving: false,
      isApprove: false,
      srcChainFee: null,
      destChainFee: null,
      max: null,
      min: null,
      xTransfer: null,
    };
  }

  private resetBalances() {
    this.transfer.balance = null;
    this.xchain.balance = new Map([]);
    this.xchain.balanceDest = new Map([]);
  }

  private async syncBalancesOnAddressChange() {
    this.balanceDestSubscription?.unsubscribe();
    const account = this.account.state;
    if (!account) {
      return;
    }

    const { address, destChain } = this.transfer;
    const destAddr = this.formatDestAddress(address, destChain);
    this.balanceDestSubscription = await this.wallet.subscribeBalance(
      destAddr,
      destChain,
      (balances: AssetAmount[]) => {
        this.updateBalanceDest(balances);
        this.validateTransfer();
      },
    );
  }

  private async syncBalances() {
    const account = this.account.state;
    if (!account) {
      return;
    }

    const { srcChain, destChain } = this.transfer;
    const srcAddress = this.formatAddress(account.address, srcChain);
    const destAddr = this.formatAddress(account.address, destChain);

    this.balanceSubscription = await this.wallet.subscribeBalance(
      srcAddress,
      srcChain,
      (balances: AssetAmount[]) => this.updateBalance(balances),
    );
    this.balanceDestSubscription = await this.wallet.subscribeBalance(
      destAddr,
      destChain,
      (balances: AssetAmount[]) => this.updateBalanceDest(balances),
    );
  }

  private async syncInput(update: string) {
    if (!this.hasAccount()) {
      return;
    }

    const { address } = this.account.state;
    const { asset, destChain, srcChain } = this.transfer;
    const srcAddr = this.formatAddress(address, srcChain);
    const destAddr = this.formatAddress(address, destChain);

    const xTransfer = await this.wallet.transfer(
      asset,
      srcAddr,
      srcChain,
      destAddr,
      destChain,
    );

    const { balance, srcFee, dstFee, max, min } = xTransfer;

    let srcChainFee: AssetAmount;
    let srcChainMax: AssetAmount;
    if (srcChain.key == 'hydradx') {
      const feeAssetId = await this.paymentApi.getPaymentFeeAsset(address);
      const feeAsset = this.assets.registry.get(feeAssetId);
      srcChainFee = await this.calculateSourceFee(
        xTransfer,
        feeAsset,
        srcChain as EvmParachain,
      );
      const eb = calculateEffectiveBalance(
        new BigNumber(balance.amount.toString()),
        balance.originSymbol,
        new BigNumber(srcChainFee.amount.toString()),
        srcChainFee.originSymbol,
        new BigNumber(feeAsset.existentialDeposit),
      ).decimalPlaces(0, 1);
      srcChainMax = balance.copyWith({
        amount: BigInt(eb.toFixed()),
      });
    } else {
      srcChainFee = srcFee;
      srcChainMax = max;
    }

    if (this.isLastUpdate(update)) {
      this.transfer = {
        ...this.transfer,
        balance: balance,
        max: srcChainMax,
        min: min,
        srcChainFee: srcChainFee,
        destChainFee: dstFee,
        xTransfer: xTransfer,
      };
      this.validateAmount();
      this.validateTransfer();
    }
  }

  private async syncEvmContext() {
    const { srcChain } = this.transfer;
    if (!this.hasEvmAccount()) {
      return;
    }

    const { client } = srcChain as AnyEvmChain;
    const provider = client.getProvider();
    this.evmBlockSubscription = provider.watchBlockNumber({
      onBlockNumber: (blockNumber) => {
        console.log(`${srcChain.name} block: ${blockNumber}`);
        this.updateEvmContext(blockNumber);
      },
    });
  }

  private async syncData(syncBalance?: boolean) {
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
    const { srcChain, destChain, asset } = this.transfer;

    const srcChainCfg = chainsConfigMap.get(srcChain.key);
    const srcChainAssetsCfg = srcChainCfg.getAssetsConfigs();

    const destChains = srcChainAssetsCfg.map((a) => a.destination);
    const destChainsUnique = new Set<AnyChain>(destChains);

    const isDestValid = destChainsUnique.has(destChain);
    const validDestChain = isDestValid
      ? destChain
      : destChainsUnique.values().next().value;

    const supportedAssets = srcChainAssetsCfg
      .filter((a) => a.destination === validDestChain)
      .map((a) => a.asset);

    const selectedAsset = supportedAssets.includes(asset)
      ? asset
      : supportedAssets[0];

    this.xchain = {
      ...this.xchain,
      dest: [...destChainsUnique],
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
      config: this.configService,
    });
    this.changeChain();
  }

  protected onBlockChange(): void {}

  /**
   * Do nothing, asset balance is synced by wallet
   */
  protected onBalanceUpdate(): void {}

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
    this.blacklist?.split(',').forEach((c) => {
      chainsMap.delete(c);
      chainsConfigMap.delete(c);
    });
  }

  private initTransferState() {
    this.transfer = {
      ...this.transfer,
      srcChain: chainsMap.get(this.srcChain),
      destChain: chainsMap.get(this.destChain),
      asset: assetsMap.get(this.asset),
    };
  }

  private initXChainState() {
    const chains = Array.from(chainsMap.values());
    this.xchain = {
      ...this.xchain,
      list: chains
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
    const classes = {
      tab: true,
      active: this.tab == TransferTab.SelectChain,
    };
    const isDest = this.isDestChainSelection();
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
    const classes = {
      tab: true,
      active: this.tab == TransferTab.SelectToken,
    };
    return html`
      <uigc-paper class=${classMap(classes)}>
        <gc-select-xasset
          .active=${this.tab == TransferTab.SelectToken}
          .assets=${this.xchain.tokens}
          .balances=${this.xchain.balance}
          .asset=${this.transfer.asset}
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

  private updateApprovalCtx(call: XCallEvm, nonce: number) {
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

  private updateTransferCtx(call: XCallEvm, nonce: number) {
    const { asset, srcChain } = this.transfer;
    this.transfer = {
      ...this.transfer,
      isApproving: false,
      isApprove: false,
    };

    const assetId = srcChain.getBalanceAssetId(asset);
    const approvedTx = this.xStore.transactions.filter(
      (tx: XItem) =>
        tx.nonce < nonce &&
        tx.to === assetId &&
        parseSpender(tx.data) === call.to,
    );

    approvedTx.forEach((tx: XItem) => this.xStore.remove(tx.hash));
  }

  private updateEvmContext(blockNumber?: bigint) {
    const { amount, srcChain, xTransfer } = this.transfer;

    if (
      !srcChain.isEvmChain() ||
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
        xTransfer.buildCall(amount).then((call: XCallEvm) => {
          const isApproveCall = isApprove(call);
          if (isApproveCall) {
            this.updateApprovalCtx(call, nonce);
          } else {
            this.updateTransferCtx(call, nonce);
          }

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
            this.validateSrcFee();
          });
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
    if (this.isToAddressValid()) {
      this.syncBalancesOnAddressChange();
    } else {
      this.clearError('hubEd');
      this.clearError('hdxEd');
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
    const { address, asset, amount, srcChain, destChain } = this.transfer;

    const srcAddr = this.formatAddress(account.address, srcChain);
    const destAddr = this.formatDestAddress(address, destChain);

    const xTransfer = await this.wallet.transfer(
      asset,
      srcAddr,
      srcChain,
      destAddr,
      destChain,
    );

    const call = await xTransfer.buildCall(amount);
    const transaction = {
      hex: call.data,
      name: 'xcm',
      get: (): XCall => {
        return call;
      },
    } as Transaction;
    this.processTx(account, transaction, this.transfer);
  }

  private isFormDisabled() {
    return this.isTransferEmpty() || this.hasError() || !this.hasTransferData();
  }

  formTab() {
    const classes = {
      tab: true,
      active: this.tab == TransferTab.Form,
    };
    const { srcChain, destChain } = this.transfer;
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
          .asset=${this.transfer.asset}
          .balance=${this.transfer.balance}
          .srcChain=${this.transfer.srcChain}
          .srcChainFee=${this.transfer.srcChainFee}
          .destChain=${this.transfer.destChain}
          .destChainFee=${this.transfer.destChainFee}
          .max=${this.transfer.max}
          .error=${this.transfer.error}
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
            <uigc-typography gradient variant="title">
              ${i18n.t('header.form')}
            </uigc-typography>
            <span class="grow"></span>
          </div>
        </gc-xcm-form>
      </uigc-paper>
      ${when(
        srcChain?.isEvmChain() || destChain?.isEvmChain(),
        () => html`
          <div class="logo">
            <span>Powered by</span>
            ${wormhole}
          </div>
        `,
      )}
    `;
  }

  render() {
    return html`
      <div class="layout-root">
        ${this.formTab()} ${this.selectChainTab()} ${this.selectTokenTab()}
      </div>
    `;
  }
}
