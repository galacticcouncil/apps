import { html, css, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

import { i18n } from 'localization';
import { translation } from './locales';

import { debounce } from 'ts-debounce';
import { Subscription } from 'rxjs';

import { PoolApp } from 'app/PoolApp';
import { Account } from 'db';
import { TxInfo, TxMessage } from 'signer/types';
import { baseStyles } from 'styles/base.css';
import { headerStyles } from 'styles/header.css';
import { basicLayoutStyles } from 'styles/layout/basic.css';
import { convertAddressSS58, isValidAddress } from 'utils/account';
import { exchangeNative, formatAmount, humanizeAmount } from 'utils/amount';
import { getXcmKey } from 'utils/asset';
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

import {
  SubstrateApis,
  Wallet,
  XCall,
  XData,
  isH160Address,
} from '@galacticcouncil/xcm-sdk';

import { ConfigService } from '@moonbeam-network/xcm-config';
import { AnyChain, AssetAmount } from '@moonbeam-network/xcm-types';
import { toBigInt } from '@moonbeam-network/xcm-utils';

import type {
  PalletAssetsAssetDetails,
  PalletAssetsAssetAccount,
} from '@polkadot/types/lookup';
import { Option } from '@polkadot/types';

import 'element/selector';

import './Form';

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

  private _syncData = null;
  private _syncKey = null;

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

  hasTransferData() {
    return !!this.transfer.xdata;
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

  private getUpdateKey() {
    const { asset, srcChain, destChain } = this.transfer;
    const date = new Date().getTime();
    this._syncKey = `${srcChain?.key}-${destChain?.key}-${asset?.key}-${date}`;
    return this._syncKey;
  }

  private isLastUpdate(update: string) {
    return this._syncKey == update;
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
      inProgress: true,
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
      inProgress: true,
      balance: null,
      srcChain: srcChain,
    });
    this.changeChain();
  }

  private async changeDestinationChain(chain: string) {
    const destChain = chainsMap.get(chain);
    this.resetTransfer({
      inProgress: true,
      balance: null,
      destChain: destChain,
    });
    this.changeChain();
  }

  private async changeAsset(asset: string) {
    const balance = this.xchain.balance.get(asset);
    this.clearErrors();
    this.resetTransfer({
      inProgress: true,
      balance: balance,
      asset: assetsMap.get(asset),
    });
    this._syncData();
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

    if (!this.hasTransferData()) {
      return;
    }

    const { asset, balance, max, min } = this.transfer;
    const amountBN = toBigInt(amount, balance.decimals);
    const maxBN = toBigInt(max.amount, max.decimals);
    const minBN = toBigInt(min.amount, max.decimals);

    if (balance.amount == 0n) {
      this.transfer.error['amount'] = i18n.t('error.balance');
    } else if (amountBN > maxBN) {
      this.transfer.error['amount'] = i18n.t('error.maxAmount', {
        amount: max.toDecimal(),
        asset: asset.originSymbol,
      });
    } else if (amountBN < minBN) {
      this.transfer.error['amount'] = i18n.t('error.minAmount', {
        amount: min.toDecimal(),
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

  processTx(
    account: Account,
    transaction: Transaction,
    transfer: TransferState,
  ) {
    const notification = {
      processing: this.notificationTemplate(transfer, 'notify.processing'),
      success: this.notificationTemplate(transfer, 'notify.success'),
      failure: this.notificationTemplate(transfer, 'notify.error'),
    };

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
          srcChainFeeBalance: srcChainFeeBalance.toDecimal(
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
      const api = await SubstrateApis.getInstance().api(srcChain.ws);
      const assetData = srcChain.assetsData.get(destChainFee.key);
      const response = await api.query.assets.asset<
        Option<PalletAssetsAssetDetails>
      >(assetData.id);
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

    const api = await SubstrateApis.getInstance().api(srcChain.ws);
    const assetData = srcChain.assetsData.get(asset.key);
    const response = await api.query.assets.account<
      Option<PalletAssetsAssetAccount>
    >(assetData.id, account.address);

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

    if (destChain.key !== 'hydradx') {
      this.clearError('hdxEd');
      return;
    }

    const destChainBalance = this.xchain.balanceDest.get(asset.key);
    const isExistingAccount = destChainBalance.amount > 0n;
    const onChainAsset = Array.from(this.assets.registry.values()).find(
      (a) =>
        a.symbol.toLowerCase() === asset.originSymbol.toLowerCase() &&
        a.origin === srcChain.parachainId,
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
  }

  private async validateTransfer() {
    const { asset, destChainFee } = this.transfer;
    await this.validateSrcFee();

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

  private formatAddress(address: string, chain: AnyChain): string {
    if (chain.isEvmParachain()) {
      return convertToH160(address);
    } else {
      return convertAddressSS58(address);
    }
  }

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
    return dest.isEvmParachain() && !isH160Address(address);
  }

  private isSubstrateAddressError(dest: AnyChain, address: string) {
    return (
      dest.isParachain() && dest.key !== 'hydradx' && !isValidAddress(address)
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
    data: XData,
    feeAsset: Asset,
    srcChain: AnyChain,
  ) {
    const account = this.account.state;
    const { max, srcFee, buildCall } = data;
    const feeAssetData = Array.from(srcChain.assetsData.values()).find((a) => {
      return Object.hasOwn(a, 'metadataId')
        ? a.metadataId.toString() === feeAsset.id
        : a.id.toString() === feeAsset.id;
    });
    if (isEvmAccount(account.address)) {
      const apiPool = SubstrateApis.getInstance();
      const api = await apiPool.api(srcChain.ws);
      const evmAddress = convertToH160(account.address);
      const evmClient = this.wallet.getEvmClient(srcChain.key);
      const evmProvider = evmClient.getProvider();
      const call = buildCall(max.toDecimal(max.decimals));
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
      srcChainFee: null,
      destChainFee: null,
      max: null,
      min: null,
      xdata: null,
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
    const destAddr = this.formatAddress(address, destChain);
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

    const { address, srcChain, destChain } = this.transfer;
    const srcAddress = this.formatAddress(account.address, srcChain);
    const destAddr = this.formatAddress(address || account.address, destChain);

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
    const account = this.account.state;

    if (!account) {
      return;
    }

    const { asset, destChain, srcChain } = this.transfer;
    const srcAddr = this.formatAddress(account.address, srcChain);
    const destAddr = this.formatAddress(account.address, destChain);

    const data = await this.wallet.transfer(
      asset,
      srcAddr,
      srcChain,
      destAddr,
      destChain,
    );

    const { balance, srcFee, destFee, max, min } = data;

    let srcChainFee: AssetAmount;
    let srcChainMax: AssetAmount;
    if (srcChain.key == 'hydradx') {
      const feeAssetId = await this.paymentApi.getPaymentFeeAsset(
        account?.address,
      );
      const feeAsset = this.assets.registry.get(feeAssetId);
      srcChainFee = await this.calculateSourceFee(data, feeAsset, srcChain);
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
        destChainFee: destFee,
        xdata: data,
      };
      this.validateAmount();
      this.validateTransfer();
    }
  }

  private async syncData(syncBalance?: boolean) {
    const update = this.getUpdateKey();
    Promise.all([
      syncBalance ? this.syncBalances() : Promise.resolve(undefined),
      this.syncInput(update),
    ])
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
      configService: this.configService,
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
      list: chains.filter((c) => c.ecosystem.toString() === this.ecosystem),
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
    this.ro.observe(this);
  }

  private disconnectSubscriptions() {
    this.resetBalances();
    this.balanceSubscription?.unsubscribe();
    this.balanceDestSubscription?.unsubscribe();
  }

  override disconnectedCallback() {
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

  protected onAssetInputChange({ detail: { value } }) {
    this.updateAmount(value);
    this.validateAmount();
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

    const xData = await this.wallet.transfer(
      asset,
      srcAddr,
      srcChain,
      destAddr,
      destChain,
    );

    const call = xData.buildCall(amount);
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
    return html`
      <uigc-paper class=${classMap(classes)} id="default-tab">
        <gc-xcm-form
          .inProgress=${this.transfer.inProgress}
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
          @transfer-click=${() => this.onTransferClick()}>
          <div class="header" slot="header">
            <uigc-typography gradient variant="title">
              ${i18n.t('header.form')}
            </uigc-typography>
            <span class="grow"></span>
          </div>
        </gc-xcm-form>
      </uigc-paper>
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
