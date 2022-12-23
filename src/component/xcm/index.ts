import { LitElement, html, css, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { choose } from 'lit/directives/choose.js';

import { baseStyles } from '../base.css';
import { createApi } from '../../chain';
import { DatabaseController } from '../../db.ctrl';
import { Chain, chainCursor, Account, accountCursor } from '../../db';

import '@galacticcouncil/ui';
import { ApiProvider, Bridge, ChainName } from '@galacticcouncil/bridge';
import { RococoAdapter } from '@galacticcouncil/bridge/build/src/adapters/polkadot';
import { KaruraAdapter } from '@galacticcouncil/bridge/build/src/adapters/acala';
import { BasiliskAdapter } from '@galacticcouncil/bridge/build/src/adapters/hydradx';

import { firstValueFrom } from 'rxjs';

import './transfer-tokens';

import { Notification, NotificationType } from '../notification/types';
import { DEFAULT_SCREEN_STATE, ScreenState, TransferScreen, DEFAULT_TRANSFER_STATE, TransferState } from './types';
import { PoolType, Transaction } from '@galacticcouncil/sdk';

@customElement('gc-xcm-app')
export class XcmApp extends LitElement {
  private chain = new DatabaseController<Chain>(this, chainCursor);

  private tx: Transaction = null;
  private ready: boolean = false;
  private ro = new ResizeObserver((entries) => {
    entries.forEach((entry) => {
      this.screen.height = entry.contentRect.height;
    });
  });
  private disconnectSubscribeNewHeads: () => void = null;
  
  private adapters = {
    rococo: new RococoAdapter(),
    karura: new KaruraAdapter(),
    basilisk: new BasiliskAdapter(),
  };

  @state() screen: ScreenState = DEFAULT_SCREEN_STATE;
  @state() transfer: TransferState = DEFAULT_TRANSFER_STATE;

  @property({ type: String }) apiAddress: string = null;
  @property({ type: String }) accountAddress: string = null;
  @property({ type: String }) accountProvider: string = null;
  @property({ type: String }) accountName: string = null;
  @property({ type: String }) pools: string = null;

  static styles = [
    baseStyles,
    css`
      :host {
        display: block;
        max-width: 520px;
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

  switchChains() {}

  changeChainIn(previous: string) {}

  changeChainOut(previous: string) {}

  clearAmounts() {}

  updateAmount(amount: string) {
    if (this.isEmptyAmount(amount)) {
      this.clearAmounts();
      return;
    }
    this.transfer.amount = amount;
    this.requestUpdate();
  }

  async syncBalances() {
    const account = accountCursor.deref();
    if (account) {
      const fromChain = this.transfer.fromChain;
      const asset = this.transfer.asset;
      const balance = (await firstValueFrom(
        this.adapters[fromChain.name].subscribeTokenBalance(asset, accountCursor.deref().address)
      )) as any;
      this.transfer.balance = balance.free.toString();
      this.requestUpdate();
    }
  }

  notificationTemplate(transfer: TransferState, status: string): TemplateResult {
    return html`
      <span>Transfer of</span>
      <span class="highlight">${transfer.amount}</span>
      <span class="highlight">${transfer.asset}</span>
      <span>from</span>
      <span class="highlight">${transfer.fromChain.name}</span>
      <span>to</span>
      <span class="highlight">${transfer.toChain.name}</span>
      <span>${status}</span>
    `;
  }

  updateTxStatus(id: string, type: NotificationType, transfer: TransferState, status: string) {
    const message = this.notificationTemplate(transfer, status);
    const options = {
      bubbles: true,
      composed: true,
      detail: { id: id, timestamp: Date.now(), type: type, message: message, toast: true } as Notification,
    };
    this.dispatchEvent(new CustomEvent<Notification>('gc:tx:' + status, options));
  }

  async swap() {
    const account = accountCursor.deref();
    if (account && this.tx) {
      //this.processTx(account, this.tx, this.trade);
    }
  }

  async init() {
    new Bridge({
      adapters: Object.values(this.adapters),
    });

    const provider = new ApiProvider();
    const chains = Object.keys(this.adapters) as ChainName[];
    const observe = provider.connectFromChain(chains, {
      karura: ['wss://karura-rococo-rpc.aca-staging.network/ws'],
      basilisk: ['wss://basilisk-rococo-rpc.play.hydration.cloud'],
      rococo: ['wss://rococo-rpc.polkadot.io'],
    });

    await firstValueFrom(observe);

    const fromChain = this.transfer.fromChain;
    const api = provider.getApi(fromChain.name);
    await Promise.all(chains.map(() => this.adapters[fromChain.name].setApi(api)));
  }

  async subscribe() {
    const api = chainCursor.deref().api;
    this.disconnectSubscribeNewHeads = await api.rpc.chain.subscribeNewHeads(async (lastHeader) => {
      console.log('Current block: ' + lastHeader.number.toString());
      this.syncBalances();
    });
  }

  override async firstUpdated() {
    const pools = this.pools ? this.pools.split(',') : [];
    const chain = chainCursor.deref();
    if (!chain) {
      createApi(this.apiAddress, pools as PoolType[], () => {});
    }
  }

  override update(changedProperties: Map<string, unknown>) {
    if (
      changedProperties.has('accountAddress') ||
      changedProperties.has('accountProvider') ||
      changedProperties.has('accountName')
    ) {
      const account = accountCursor.deref();
      accountCursor.reset({
        address: this.accountAddress ?? account?.address,
        provider: this.accountProvider ?? account?.provider,
        name: this.accountName ?? account?.name,
      } as Account);
    }
    super.update(changedProperties);
  }

  override async updated() {
    if (this.chain.state && !this.ready) {
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
    this.disconnectSubscribeNewHeads?.();
    super.disconnectedCallback();
  }

  transferTokensTemplate() {
    return html`<gc-xcm-app-main
      .origin=${this.transfer.fromChain.asset}
      .destination=${this.transfer.toChain.asset}
      .asset=${this.transfer.asset}
      .amount=${this.transfer.amount}
      .balance=${this.transfer.balance}
      .address=${accountCursor.deref().address}
      @asset-input-changed=${({ detail: { id, asset, value } }: CustomEvent) => {
        this.updateAmount(value);
      }}
      @chain-switch-clicked=${this.switchChains}
      @transfer-clicked=${() => this.swap()}
      }}
    ></gc-xcm-app-main>`;
  }

  render() {
    return html`
      <uigc-paper>
        ${choose(this.screen.active, [[TransferScreen.Transfer, () => this.transferTokensTemplate()]])}
      </uigc-paper>
    `;
  }
}
