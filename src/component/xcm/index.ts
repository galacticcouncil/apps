import { html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import * as i18n from 'i18next';

import { AccountElement } from '../base/AccountElement';
import { baseStyles } from '../styles/base.css';
import { headerStyles } from '../styles/header.css';
import { basicLayoutStyles } from '../styles/layout/basic.css';

import { initAdapterConnection, initBridge } from '../../bridge';
import { DatabaseController } from '../../db.ctrl';
import { Account, XChain, xChainCursor } from '../../db';
import { formatAmount, humanizeAmount, toFN } from '../../utils/amount';
import { convertAddressSS58 } from '../../utils/account';
import { getRenderString } from '../../utils/dom';

import { Subscription, combineLatest } from 'rxjs';

import '@galacticcouncil/ui';
import { bnum, Transaction } from '@galacticcouncil/sdk';
import { BalanceData, Chain, ChainId, InputConfig } from '@galacticcouncil/bridge';
import { SubmittableExtrinsic } from '@polkadot/api/promise/types';

import './transfer-tokens';
import './select-chain';
import './select-token';

import { TransferScreen, ChainState, TransferState, DEFAULT_CHAIN_STATE, DEFAULT_TRANSFER_STATE } from './types';
import { TxInfo, TxNotificationMssg } from '../transaction/types';

@customElement('gc-xcm-app')
export class XcmApp extends AccountElement {
  private xChain = new DatabaseController<XChain>(this, xChainCursor);

  private input: InputConfig = null;
  private ready: boolean = false;
  private ro = new ResizeObserver((entries) => {
    entries.forEach((_entry) => {
      if (TransferScreen.Transfer == this.screen) {
        const defaultScreen = this.shadowRoot.getElementById('default-screen');
        const tabs = this.shadowRoot.querySelectorAll('.tab:not(#default-screen)');
        tabs.forEach((tab: Element) => {
          tab.setAttribute('style', `height: ${defaultScreen.offsetHeight}px`);
        });
      }
    });
  });
  private disconnectSubscribeBalance: Subscription = null;
  private disconnectSubscribeInput: Subscription = null;

  @state() screen: TransferScreen = TransferScreen.Transfer;
  @state() transfer: TransferState = DEFAULT_TRANSFER_STATE;
  @state() chain: ChainState = DEFAULT_CHAIN_STATE;

  @property({ type: Boolean }) testnet: Boolean = false;
  @property({ type: String }) srcChain: string = null;
  @property({ type: String }) dstChain: string = null;
  @property({ type: String }) chains: string = null;

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

  changeScreen(active: TransferScreen) {
    this.screen = active;
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
      srcChain: chain,
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
      dstChain: chain,
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
      asset: asset,
      balance: this.chain.balance.get(asset),
      srcChainFee: null,
      dstChainFee: null,
    };
    this.disconnectSubscriptions();
    await this.syncBalances();
    await this.syncInput();
  }

  updateAddress(address: string) {
    const recipientNative = convertAddressSS58(address, Number(this.transfer.dstChainSs58Prefix));
    this.transfer = {
      ...this.transfer,
      address: recipientNative ? recipientNative : address,
    };
  }

  validateAddress() {
    const recipient = this.transfer.address;
    const recipientNative = convertAddressSS58(recipient, Number(this.transfer.dstChainSs58Prefix));

    if (recipient == null || recipient == '') {
      this.transfer.error['address'] = i18n.t('xcm.error.required');
    } else if (recipientNative == null) {
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

  validateTransferAmount() {
    const ammount = this.transfer.amount;

    if (!ammount) {
      delete this.transfer.error['amount'];
      return;
    }

    const bridge = this.xChain.state.bridge;
    const srcChain = this.transfer.srcChain as ChainId;
    const adapter = bridge.findAdapter(srcChain);
    const asset = adapter.getToken(this.transfer.asset, srcChain);
    const amountFN = toFN(this.transfer.amount, asset.decimals);

    const maxInput = this.input.maxInput;
    const minInput = this.input.minInput;

    if (amountFN.gt(this.input.maxInput)) {
      this.transfer.error['amount'] = i18n.t('xcm.error.maxAmount', { amount: maxInput, asset: this.transfer.asset });
    } else if (amountFN.lt(this.input.minInput)) {
      this.transfer.error['amount'] = i18n.t('xcm.error.minAmount', { amount: minInput, asset: this.transfer.asset });
    } else {
      delete this.transfer.error['amount'];
    }
    this.requestUpdate();
  }

  notificationTemplate(transfer: TransferState, status: string): TxNotificationMssg {
    const template = html`
      <span>${status ? i18n.t('xcm.notify.sending') : i18n.t('xcm.notify.sent')}</span>
      <span class="highlight">${transfer.amount}</span>
      <span class="highlight">${transfer.asset}</span>
      <span>${i18n.t('xcm.notify.from')}</span>
      <span class="highlight">${transfer.srcChain}</span>
      <span>${i18n.t('xcm.notify.to')}</span>
      <span class="highlight">${transfer.dstChain}</span>
      <span>${status}</span>
    `;
    return {
      message: template,
      rawHtml: getRenderString(template),
    } as TxNotificationMssg;
  }

  processTx(account: Account, transaction: Transaction, transfer: TransferState) {
    const notification = {
      processing: this.notificationTemplate(transfer, i18n.t('xcm.tx.submitted')),
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
        meta: { srcChain: transfer.srcChain, dstChain: transfer.dstChain },
      } as TxInfo,
    };
    this.dispatchEvent(new CustomEvent<TxInfo>('gc:tx:newXcm', options));
  }

  async swap() {
    const bridge = this.xChain.state.bridge;
    const account = this.account.state;
    if (account && bridge) {
      const srcChain = this.transfer.srcChain as ChainId;
      const dstChain = this.transfer.dstChain as ChainId;
      const adapter = bridge.findAdapter(srcChain);
      const asset = adapter.getToken(this.transfer.asset, srcChain);
      const tx: any = adapter.createTx({
        to: dstChain,
        token: asset.symbol,
        amount: toFN(this.transfer.amount, asset.decimals),
        address: this.transfer.address,
        signer: this.transfer.address,
      });

      const transaction = {
        hex: tx.toHex(),
        name: 'xcm',
        get: (): SubmittableExtrinsic => {
          return tx;
        },
      } as Transaction;
      this.processTx(account, transaction, this.transfer);
    }
  }

  private syncChains() {
    const bridge = this.xChain.state.bridge;
    const srcChain = this.transfer.srcChain as ChainId;
    const dstChain = this.transfer.dstChain as ChainId;

    const destChainsConfig = bridge.router.getDestinationChains({ from: srcChain });
    const destChains = destChainsConfig.filter((chain: Chain) => this.chain.list.includes(chain.id));
    const destChainsList = destChains.map((chain: Chain) => chain.id);

    const isDestValid = destChainsList.includes(dstChain);
    const validDstChain = isDestValid ? dstChain : destChains[0].id;

    const availableTokens = bridge.router.getAvailableTokens({
      from: srcChain,
      to: validDstChain as ChainId,
    });

    this.chain = {
      ...this.chain,
      dest: destChainsList,
      tokens: availableTokens,
      balance: new Map([]),
    };

    const asset = this.transfer.asset;
    const isTransferable = availableTokens.includes(asset);
    this.transfer = {
      ...this.transfer,
      asset: isTransferable ? asset : availableTokens[0],
      dstChain: validDstChain,
      balance: null,
      srcChainFee: null,
      dstChainFee: null,
    };
  }

  private resetBalances() {
    this.transfer.balance = null;
    this.chain.balance = new Map([]);
  }

  private async syncBalances() {
    const bridge = this.xChain.state.bridge;
    const account = this.account.state;

    if (!account) {
      return;
    }

    const srcChain = this.transfer.srcChain as ChainId;
    const asset = this.transfer.asset;
    const adapter = bridge.findAdapter(srcChain);
    await initAdapterConnection(adapter, this.testnet);

    const tokenBalanceO = this.chain.tokens.reduce(function (map, token) {
      map[token] = adapter.subscribeTokenBalance(token, account.address);
      return map;
    }, {});

    this.disconnectSubscribeBalance = combineLatest(tokenBalanceO).subscribe((val) => {
      const balances: Map<string, string> = new Map([]);
      Object.keys(val).forEach((token: string) => {
        const balanceData = val[token] as BalanceData;
        const balance = balanceData.available.toString();
        balances.set(token, balance);
      });
      this.chain.balance = balances;
      this.transfer.balance = balances.get(asset);
      this.requestUpdate();
    });
  }

  private async syncInput() {
    const bridge = this.xChain.state.bridge;
    const account = this.account.state;

    if (!account) {
      return;
    }

    const srcChain = this.transfer.srcChain as ChainId;
    const dstChain = this.transfer.dstChain as ChainId;
    const adapter = bridge.findAdapter(srcChain);
    await initAdapterConnection(adapter, this.testnet);
    const nativeAsset = adapter.getApi().registry.chainTokens[0];
    const nativeAssetDecimals = adapter.getApi().registry.chainDecimals[0];

    const inputConfigO = adapter.subscribeInputConfig({
      to: dstChain,
      token: this.transfer.asset,
      address: account.address,
      signer: account.address,
    });

    this.disconnectSubscribeInput = inputConfigO.subscribe((config: InputConfig) => {
      this.input = config;
      const srcChainFeeBN = bnum(config.estimateFee);
      const srcChainFeeFormatted = formatAmount(srcChainFeeBN, nativeAssetDecimals);
      this.transfer = {
        ...this.transfer,
        nativeAsset: nativeAsset,
        effectiveBalance: config.maxInput.toString(),
        srcChainFee: humanizeAmount(srcChainFeeFormatted),
        dstChainFee: config.destFee.balance.toString(),
        dstChainSs58Prefix: config.ss58Prefix.toString(),
      };
      this.updateAddress(this.transfer.address);
      this.validateTransferAmount();
    });
  }

  async init() {
    this.syncChains();
    await this.syncBalances();
    await this.syncInput();
  }

  override async firstUpdated() {
    const xChain = this.xChain.state;
    if (!xChain) {
      this.chain.list = this.chains ? this.chains.split(',') : [];
      initBridge(this.chain.list);
    }
  }

  override async update(changedProperties: Map<string, unknown>) {
    if (changedProperties.has('srcChain') || changedProperties.has('dstChain')) {
      this.transfer = {
        ...this.transfer,
        srcChain: this.srcChain,
        dstChain: this.dstChain,
      };
    }
    super.update(changedProperties);
  }

  override async updated() {
    if (this.xChain.state && !this.ready) {
      console.log('Initialization...');
      this.ready = true;
      await this.init();
      console.log('Done ✅');
    }
  }

  protected async onAccountChange(prev: Account, curr: Account): Promise<void> {
    this.resetBalances();
    curr && this.updateAddress(curr.address);

    if (this.ready) {
      await this.syncBalances();
      await this.syncInput();
    }
  }

  override connectedCallback() {
    super.connectedCallback();
    this.ro.observe(this);
  }

  private disconnectSubscriptions() {
    this.disconnectSubscribeBalance?.unsubscribe();
    this.disconnectSubscribeInput?.unsubscribe();
  }

  override disconnectedCallback() {
    this.ro.unobserve(this);
    this.disconnectSubscriptions();
    super.disconnectedCallback();
  }

  selectChainTemplate() {
    const classes = {
      tab: true,
      active: this.screen == TransferScreen.SelectChain,
    };
    const isDest = this.chain.selector === this.transfer.dstChain;
    return html`<uigc-paper class=${classMap(classes)}>
      <gc-xcm-app-chain
        .chains=${isDest ? this.chain.dest : this.chain.list}
        .srcChain=${this.transfer.srcChain}
        .dstChain=${this.transfer.dstChain}
        .selector=${this.chain.selector}
        @list-item-clicked=${({ detail: { item } }: CustomEvent) => {
          if (isDest) {
            this.changeDestinationChain(item);
          } else {
            this.changeSourceChain(item);
          }
          this.changeScreen(TransferScreen.Transfer);
        }}
      >
        <div class="header section" slot="header">
          <uigc-icon-button class="back" @click=${() => this.changeScreen(TransferScreen.Transfer)}>
            <uigc-icon-back></uigc-icon-back>
          </uigc-icon-button>
          <uigc-typography variant="section">${isDest ? i18n.t('xcm.dest') : i18n.t('xcm.source')}</uigc-typography>
          <span></span>
        </div>
      </gc-xcm-app-chain>
    </uigc-paper>`;
  }

  selectTokenTemplate() {
    const classes = {
      tab: true,
      active: this.screen == TransferScreen.SelectToken,
    };
    return html`<uigc-paper class=${classMap(classes)}>
      <gc-xcm-app-token
        .assets=${this.chain.tokens}
        .balances=${this.chain.balance}
        .asset=${this.transfer.asset}
        @asset-clicked=${({ detail: { symbol } }: CustomEvent) => {
          this.changeAsset(symbol);
          this.changeScreen(TransferScreen.Transfer);
        }}
      >
        <div class="header section" slot="header">
          <uigc-icon-button class="back" @click=${() => this.changeScreen(TransferScreen.Transfer)}>
            <uigc-icon-back></uigc-icon-back>
          </uigc-icon-button>
          <uigc-typography variant="section">${i18n.t('xcm.selectAsset')}</uigc-typography>
          <span></span>
        </div>
      </gc-xcm-app-token>
    </uigc-paper>`;
  }

  transferTokensTemplate() {
    const classes = {
      tab: true,
      active: this.screen == TransferScreen.Transfer,
    };
    return html` <uigc-paper class=${classMap(classes)} id="default-screen">
      <gc-xcm-app-main
        .disabled=${this.isTransferEmpty() || this.hasError()}
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
        @asset-input-changed=${({ detail: { value } }: CustomEvent) => {
          this.updateAmount(value);
          this.validateTransferAmount();
        }}
        @address-input-changed=${({ detail: { address } }: CustomEvent) => {
          this.updateAddress(address);
          this.validateAddress();
        }}
        @asset-switch-clicked=${this.switchChains}
        @asset-selector-clicked=${() => this.changeScreen(TransferScreen.SelectToken)}
        @chain-selector-clicked=${({ detail: { chain } }: CustomEvent) => {
          this.chain.selector = chain;
          this.changeScreen(TransferScreen.SelectChain);
        }}
        @transfer-clicked=${() => this.swap()}
      >
        <div class="header" slot="header">
          <uigc-typography gradient variant="title">${i18n.t('xcm.title')}</uigc-typography>
          <span class="grow"></span>
        </div>
      </gc-xcm-app-main>
    </uigc-paper>`;
  }

  render() {
    return html`
      <div class="layout-root">
        ${this.transferTokensTemplate()} ${this.selectChainTemplate()} ${this.selectTokenTemplate()}
      </div>
    `;
  }
}
