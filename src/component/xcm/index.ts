import { LitElement, html, css, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { choose } from 'lit/directives/choose.js';
import { when } from 'lit/directives/when.js';

import { baseStyles } from '../base.css';
import { createBridge } from '../../bridge';
import { DatabaseController } from '../../db.ctrl';
import { Account, accountCursor, bridgeCursor } from '../../db';
import { formatAmount, humanizeAmount, toFN } from '../../utils/amount';

import { Subscription, combineLatest } from 'rxjs';

import '@galacticcouncil/ui';
import { bnum, Transaction } from '@galacticcouncil/sdk';
import { BalanceData, Bridge, Chain, ChainName, CrossChainInputConfigs } from '@galacticcouncil/bridge';
import { SubmittableExtrinsic } from '@polkadot/api/promise/types';

import './transfer-tokens';
import './select-chain';
import './select-token';

import {
  TransferScreen,
  ScreenState,
  ChainState,
  TransferState,
  DEFAULT_SCREEN_STATE,
  DEFAULT_CHAIN_STATE,
  DEFAULT_TRANSFER_STATE,
} from './types';
import { TxInfo } from '../transaction/types';
import { convertAddressSS58 } from '../../utils/account';
import { pairs2Map } from '../../utils/mapper';

@customElement('gc-xcm-app')
export class XcmApp extends LitElement {
  private bridge = new DatabaseController<Bridge>(this, bridgeCursor);

  private input: CrossChainInputConfigs = null;
  private ready: boolean = false;
  private ro = new ResizeObserver((entries) => {
    entries.forEach((entry) => {
      this.screen.height = entry.contentRect.height;
    });
  });
  private disconnectSubscribeBalance: Subscription = null;
  private disconnectSubscribeInput: Subscription = null;

  @state() screen: ScreenState = DEFAULT_SCREEN_STATE;
  @state() transfer: TransferState = DEFAULT_TRANSFER_STATE;
  @state() chain: ChainState = DEFAULT_CHAIN_STATE;

  @property({ type: Boolean }) testnet: Boolean = false;
  @property({ type: String }) srcChain: string = null;
  @property({ type: String }) dstChain: string = null;
  @property({ type: String }) chains: string = null;
  @property({ type: String }) accountAddress: string = null;
  @property({ type: String }) accountProvider: string = null;
  @property({ type: String }) accountName: string = null;

  static styles = [
    baseStyles,
    css`
      :host {
        display: block;
        max-width: 570px;
        margin-left: auto;
        margin-right: auto;
        position: relative;
      }

      uigc-paper {
        width: 100%;
        display: block;
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
    this.screen.active = active;
    this.requestUpdate();
  }

  switchChains() {
    this.transfer = {
      ...this.transfer,
      srcChain: this.transfer.dstChain,
      dstChain: this.transfer.srcChain,
      balance: null,
    };
    this.syncChains();
    this.syncBalances();
    this.syncInput();
  }

  changeSourceChain(chain: string) {
    this.transfer = {
      ...this.transfer,
      srcChain: chain,
      balance: null,
    };
    this.syncChains();
    this.syncBalances();
    this.syncInput();
  }

  changeDestinationChain(chain: string) {
    this.transfer = {
      ...this.transfer,
      dstChain: chain,
      balance: null,
    };
    this.syncChains();
    this.syncBalances();
    this.syncInput();
  }

  changeAsset(asset: string) {
    this.transfer = {
      ...this.transfer,
      asset: asset,
      balance: this.chain.balance.get(asset),
    };
    this.syncInput();
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
      this.transfer.error['address'] = 'Empty address. Please, provide valid recipient network address.';
    } else if (recipientNative == null) {
      this.transfer.error['address'] = 'Incorrect address. Please, review the network address and try again.';
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

    const bridge = bridgeCursor.deref();
    const srcChain = this.transfer.srcChain as ChainName;
    const adapter = bridge.findAdapter(srcChain);
    const asset = adapter.getToken(this.transfer.asset, srcChain);
    const amountFN = toFN(this.transfer.amount, asset.decimals);

    const maxInput = this.input.maxInput;
    const minInput = this.input.minInput;

    if (amountFN.gt(this.input.maxInput)) {
      this.transfer.error['amount'] = 'Max transfer amount is ' + maxInput.toString() + ' ' + this.transfer.asset;
    } else if (amountFN.lt(this.input.minInput)) {
      this.transfer.error['amount'] = 'Min transfer amount is ' + minInput.toString() + ' ' + this.transfer.asset;
    } else {
      delete this.transfer.error['amount'];
    }
    this.requestUpdate();
  }

  notificationTemplate(transfer: TransferState, status: string): TemplateResult {
    return html`
      ${when(
        status,
        () => html` <span>Transfer of</span> `,
        () => html` <span>You transferred</span> `
      )}
      <span class="highlight">${transfer.amount}</span>
      <span class="highlight">${transfer.asset}</span>
      <span>from</span>
      <span class="highlight">${transfer.srcChain}</span>
      <span>to</span>
      <span class="highlight">${transfer.dstChain}</span>
      <span>${status}</span>
    `;
  }

  processTx(account: Account, transaction: Transaction, transfer: TransferState) {
    const notification = {
      processing: this.notificationTemplate(transfer, 'submitted'),
      success: this.notificationTemplate(transfer, 'in block'),
      failure: this.notificationTemplate(transfer, 'failed'),
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
    const bridge = bridgeCursor.deref();
    const account = accountCursor.deref();
    if (account && bridge) {
      const srcChain = this.transfer.srcChain as ChainName;
      const dstChain = this.transfer.dstChain as ChainName;
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
    const bridge = bridgeCursor.deref();
    const srcChain = this.transfer.srcChain as ChainName;
    const dstChain = this.transfer.dstChain as ChainName;
    const availableTokens = bridge.router.getAvailableTokens({
      from: srcChain,
      to: dstChain,
    });
    const allDestChains = bridge.router.getDestinationChains({ from: srcChain });
    const destChains = allDestChains.filter((chain: Chain) => this.chain.list.includes(chain.id));

    this.chain = {
      ...this.chain,
      dest: destChains.map((chain: Chain) => chain.id),
      tokens: availableTokens,
    };

    const asset = this.transfer.asset;
    const isTransferable = availableTokens.includes(asset);
    this.transfer = {
      ...this.transfer,
      asset: isTransferable ? asset : availableTokens[0],
    };
  }

  private resetBalances() {
    this.transfer.balance = null;
    this.chain.balance = new Map([]);
  }

  private syncBalances() {
    const bridge = bridgeCursor.deref();
    const account = accountCursor.deref();

    if (!account) {
      return;
    }

    const srcChain = this.transfer.srcChain as ChainName;
    const asset = this.transfer.asset;
    const adapter = bridge.findAdapter(srcChain);

    const tokenBalanceO = this.chain.tokens.reduce(function (map, token) {
      map[token] = adapter.subscribeTokenBalance(token, account.address);
      return map;
    }, {});

    this.disconnectSubscribeBalance?.unsubscribe();
    this.disconnectSubscribeBalance = combineLatest(tokenBalanceO).subscribe((val) => {
      const balances: Map<string, string> = new Map([]);
      Object.keys(val).forEach((token: string) => {
        const balanceData = val[token] as BalanceData;
        const balance = balanceData.free.toString();
        balances.set(token, balance);
      });
      this.chain.balance = balances;
      this.transfer.balance = balances.get(asset);
      this.requestUpdate();
    });
  }

  private syncInput() {
    const bridge = bridgeCursor.deref();
    const account = accountCursor.deref();

    if (!account) {
      return;
    }

    const srcChain = this.transfer.srcChain as ChainName;
    const dstChain = this.transfer.dstChain as ChainName;
    const adapter = bridge.findAdapter(srcChain);
    const nativeAsset = adapter.getApi().registry.chainTokens[0];
    const nativeAssetDecimals = adapter.getApi().registry.chainDecimals[0];

    const inputConfigO = adapter.subscribeInputConfigs({
      to: dstChain,
      token: this.transfer.asset,
      address: account.address,
      signer: account.address,
    });

    this.disconnectSubscribeInput?.unsubscribe();
    this.disconnectSubscribeInput = inputConfigO.subscribe((config: CrossChainInputConfigs) => {
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
    this.syncBalances();
    this.syncInput();
  }

  override async firstUpdated() {
    const bridge = bridgeCursor.deref();
    if (!bridge) {
      this.chain.list = this.chains ? this.chains.split(',') : [];
      createBridge(this.chain.list, this.testnet);
    }
  }

  private updateAccount() {
    if (this.accountAddress && this.accountProvider) {
      accountCursor.reset({
        address: this.accountAddress,
        provider: this.accountProvider,
        name: this.accountName,
      } as Account);
      this.updateAddress(this.accountAddress);
    } else {
      accountCursor.reset(null);
    }
  }

  override update(changedProperties: Map<string, unknown>) {
    if (changedProperties.has('accountAddress') || changedProperties.has('accountProvider')) {
      this.updateAccount();
      this.resetBalances();
      if (this.ready) {
        this.syncBalances();
        this.syncInput();
      }
    }
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
    if (this.bridge.state && !this.ready) {
      console.log('Initialization...');
      this.ready = true;
      await this.init();
      console.log('Done ✅');
    }
  }

  override connectedCallback() {
    super.connectedCallback();
    this.ro.observe(this);
  }

  override disconnectedCallback() {
    this.ro.unobserve(this);
    this.disconnectSubscribeBalance?.unsubscribe();
    this.disconnectSubscribeInput?.unsubscribe();
    super.disconnectedCallback();
  }

  selectChainTemplate() {
    const isDest = this.chain.selector === this.transfer.dstChain;
    return html`<gc-xcm-app-chain
      style="height: ${this.screen.height}px"
      .chains=${isDest ? this.chain.dest : this.chain.list}
      .srcChain=${this.transfer.srcChain}
      .dstChain=${this.transfer.dstChain}
      .selector=${this.chain.selector}
      @back-clicked=${() => this.changeScreen(TransferScreen.Transfer)}
      @list-item-clicked=${({ detail: { item } }: CustomEvent) => {
        if (isDest) {
          this.changeDestinationChain(item);
        } else {
          this.changeSourceChain(item);
        }
        this.changeScreen(TransferScreen.Transfer);
      }}
    ></gc-xcm-app-chain>`;
  }

  selectTokenTemplate() {
    return html`<gc-xcm-app-token
      style="height: ${this.screen.height}px"
      .assets=${this.chain.tokens}
      .balances=${this.chain.balance}
      .asset=${this.transfer.asset}
      @back-clicked=${() => this.changeScreen(TransferScreen.Transfer)}
      @asset-clicked=${({ detail: { symbol } }: CustomEvent) => {
        this.changeAsset(symbol);
        this.changeScreen(TransferScreen.Transfer);
      }}
    ></gc-xcm-app-token>`;
  }

  transferTokensTemplate() {
    return html`<gc-xcm-app-main
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
    ></gc-xcm-app-main>`;
  }

  render() {
    return html`
      <uigc-paper>
        ${choose(this.screen.active, [
          [TransferScreen.Transfer, () => this.transferTokensTemplate()],
          [TransferScreen.SelectChain, () => this.selectChainTemplate()],
          [TransferScreen.SelectToken, () => this.selectTokenTemplate()],
        ])}
      </uigc-paper>
    `;
  }
}
