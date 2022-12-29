import { LitElement, html, css, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { choose } from 'lit/directives/choose.js';

import { baseStyles } from '../base.css';
import { createBridge } from '../../bridge';
import { DatabaseController } from '../../db.ctrl';
import { Account, accountCursor, bridgeCursor } from '../../db';
import { toFN } from '../../utils/amount';

import { Subscription } from 'rxjs';

import '@galacticcouncil/ui';
import { Transaction } from '@galacticcouncil/sdk';
import { Bridge, Chain, ChainName } from '@galacticcouncil/bridge/build';
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

@customElement('gc-xcm-app')
export class XcmApp extends LitElement {
  private bridge = new DatabaseController<Bridge>(this, bridgeCursor);

  private ready: boolean = false;
  private ro = new ResizeObserver((entries) => {
    entries.forEach((entry) => {
      this.screen.height = entry.contentRect.height;
    });
  });
  private disconnectSubscribeBalance: Subscription = null;

  @state() screen: ScreenState = DEFAULT_SCREEN_STATE;
  @state() transfer: TransferState = DEFAULT_TRANSFER_STATE;
  @state() chain: ChainState = DEFAULT_CHAIN_STATE;

  @property({ type: Boolean }) testnet: Boolean = false;
  @property({ type: String }) fromChain: string = null;
  @property({ type: String }) toChain: string = null;
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

  isEmptyAmount(amount: string): boolean {
    return amount == '' || amount == '0';
  }

  changeScreen(active: TransferScreen) {
    this.screen.active = active;
    this.requestUpdate();
  }

  switchChains() {
    this.transfer = {
      ...this.transfer,
      fromChain: this.transfer.toChain,
      toChain: this.transfer.fromChain,
    };
    this.syncChain();
  }

  changeFromChain(chain: string) {
    const bridge = bridgeCursor.deref();
    const fromChain = chain as ChainName;
    const toChain = this.transfer.toChain as ChainName;
    const availableTokens = bridge.router.getAvailableTokens({ from: fromChain, to: toChain });
    const allDestChains = bridge.router.getDestinationChains({ from: fromChain });
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
      fromChain: chain,
    };
  }

  changeToChain(chain: string) {
    const bridge = bridgeCursor.deref();
    const fromChain = this.transfer.fromChain as ChainName;
    const toChain = chain as ChainName;
    const availableTokens = bridge.router.getAvailableTokens({ from: fromChain, to: toChain });
    this.chain = {
      ...this.chain,
      tokens: availableTokens,
    };

    const asset = this.transfer.asset;
    const isTransferable = availableTokens.includes(asset);
    this.transfer = {
      ...this.transfer,
      asset: isTransferable ? asset : availableTokens[0],
      toChain: chain,
    };
  }

  changeAsset(asset: string) {
    this.transfer = {
      ...this.transfer,
      asset: asset,
    };
  }

  clearAmount() {}

  updateAmount(amount: string) {
    if (this.isEmptyAmount(amount)) {
      this.clearAmount();
      return;
    }
    this.transfer.amount = amount;
    this.requestUpdate();
  }

  notificationTemplate(transfer: TransferState, status: string): TemplateResult {
    return html`
      <span>Transfer of</span>
      <span class="highlight">${transfer.amount}</span>
      <span class="highlight">${transfer.asset}</span>
      <span>from</span>
      <span class="highlight">${transfer.fromChain}</span>
      <span>to</span>
      <span class="highlight">${transfer.toChain}</span>
      <span>${status}</span>
    `;
  }

  processTx(account: Account, transaction: Transaction, transfer: TransferState) {
    const notification = {
      processing: this.notificationTemplate(transfer, 'submitted'),
      success: this.notificationTemplate(transfer, 'succesfull'),
      failure: this.notificationTemplate(transfer, 'failed'),
    };
    const options = {
      bubbles: true,
      composed: true,
      detail: { account: account, transaction: transaction, notification: notification } as TxInfo,
    };
    this.dispatchEvent(new CustomEvent<TxInfo>('gc:tx:newXcm', options));
  }

  async swap() {
    const account = accountCursor.deref();
    const bridge = bridgeCursor.deref();
    if (account && bridge) {
      const fromChain = this.transfer.fromChain as ChainName;
      const toChain = this.transfer.toChain as ChainName;
      const adapter = bridge.findAdapter(fromChain);
      const asset = adapter.getToken(this.transfer.asset, toChain);
      const tx: any = adapter.createTx({
        to: toChain,
        token: asset.symbol,
        amount: toFN(this.transfer.amount, asset.decimals),
        address: account.address,
        signer: account.address,
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

  syncChain() {
    const bridge = bridgeCursor.deref();
    const fromChain = this.transfer.fromChain as ChainName;
    const toChain = this.transfer.toChain as ChainName;
    const availableTokens = bridge.router.getAvailableTokens({ from: fromChain, to: toChain });
    const allDestChains = bridge.router.getDestinationChains({ from: fromChain });
    const destChains = allDestChains.filter((chain: Chain) => this.chain.list.includes(chain.id));

    this.chain = {
      ...this.chain,
      dest: destChains.map((chain: Chain) => chain.id),
      tokens: availableTokens,
    };

    if (!availableTokens.includes(this.transfer.asset)) {
      this.transfer.asset = availableTokens[0];
    }
  }

  async init() {
    this.syncChain();
    console.log(this.chain);
  }

  subscribeBalance() {
    const bridge = bridgeCursor.deref();
    const fromChain = this.transfer.fromChain as ChainName;
    const adapter = bridge.findAdapter(fromChain);
    this.disconnectSubscribeBalance = adapter
      .subscribeTokenBalance(this.transfer.asset, accountCursor.deref().address)
      .subscribe((val) => {
        this.transfer.balance = val.free.toString();
        this.requestUpdate();
      });
  }

  async subscribe() {
    this.subscribeBalance();
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
    } else {
      accountCursor.reset(null);
    }
  }

  override update(changedProperties: Map<string, unknown>) {
    if (changedProperties.has('accountAddress') || changedProperties.has('accountProvider')) {
      this.updateAccount();
    }
    if (changedProperties.has('fromChain') || changedProperties.has('toChain')) {
      this.transfer = {
        ...this.transfer,
        fromChain: this.fromChain,
        toChain: this.toChain,
      };
    }
    super.update(changedProperties);
  }

  override async updated() {
    if (this.bridge.state && !this.ready) {
      console.log('Initialization...');
      this.ready = true;
      await this.init();
      await this.subscribe();
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
    super.disconnectedCallback();
  }

  selectChainTemplate() {
    const isDest = this.chain.selector === this.transfer.toChain;
    return html`<gc-xcm-app-chain
      style="height: ${this.screen.height}px"
      .chains=${isDest ? this.chain.dest : this.chain.list}
      .fromChain=${this.transfer.fromChain}
      .toChain=${this.transfer.toChain}
      .selector=${this.chain.selector}
      @back-clicked=${() => this.changeScreen(TransferScreen.Transfer)}
      @list-item-clicked=${({ detail: { item } }: CustomEvent) => {
        /*         console.log('Dest: ' + isDest);
        console.log(item); */
        if (isDest) {
          this.changeToChain(item);
        } else {
          this.changeFromChain(item);
        }
        this.changeScreen(TransferScreen.Transfer);
      }}
    ></gc-xcm-app-chain>`;
  }

  selectTokenTemplate() {
    return html`<gc-xcm-app-token
      style="height: ${this.screen.height}px"
      .assets=${this.chain.tokens}
      .asset=${this.transfer.asset}
      @back-clicked=${() => this.changeScreen(TransferScreen.Transfer)}
      @asset-clicked=${({ detail: { symbol } }: CustomEvent) => {
        /*         const { id, asset } = this.assets.selector;
        id == 'assetIn' && this.changeAssetIn(asset, e.detail);
        id == 'assetOut' && this.changeAssetOut(asset, e.detail); */
/*         console.log(e.detail);
 */        //this.updateBalances();
        this.changeAsset(symbol);
        this.changeScreen(TransferScreen.Transfer);
      }}
    ></gc-xcm-app-token>`;
  }

  transferTokensTemplate() {
    return html`<gc-xcm-app-main
      .from=${this.transfer.fromChain}
      .to=${this.transfer.toChain}
      .asset=${this.transfer.asset}
      .amount=${this.transfer.amount}
      .balance=${this.transfer.balance}
      .address=${accountCursor.deref().address}
      @asset-input-changed=${({ detail: { id, asset, value } }: CustomEvent) => {
        this.updateAmount(value);
      }}
      @asset-switch-clicked=${this.switchChains}
      @asset-selector-clicked=${({ detail }: CustomEvent) => {
        this.changeScreen(TransferScreen.SelectToken);
      }}
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
