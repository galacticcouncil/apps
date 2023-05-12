import { html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { classMap } from 'lit/directives/class-map.js';

import * as i18n from 'i18next';

import { PoolApp } from '../base/PoolApp';
import { baseStyles } from '../styles/base.css';
import { headerStyles } from '../styles/header.css';
import { tradeLayoutStyles } from '../styles/layout/trade.css';

import { Account } from '../../db';

import '@galacticcouncil/ui';
import { PoolAsset, Transaction, SYSTEM_ASSET_ID, Amount } from '@galacticcouncil/sdk';

import './form';
import './positions/desktop';
import './positions/mobile';
import '../selector/asset';

import { defaultData } from './positions/model';

import { DcaTab, InvestState, DEFAULT_INVEST_STATE } from './types';
import { TxInfo, TxNotificationMssg } from '../transaction/types';
import { AssetSelector } from '../selector/types';
import { formatAmount } from '../../utils/amount';

@customElement('gc-dca-app')
export class DcaApp extends PoolApp {
  private tx: Transaction = null;

  @state() tab: DcaTab = DcaTab.InvestForm;
  @state() invest: InvestState = { ...DEFAULT_INVEST_STATE };
  @state() asset = {
    selector: null as AssetSelector,
  };
  @state() width: number = window.innerWidth;

  @property({ type: String }) assetIn: string = null;
  @property({ type: String }) assetOut: string = null;
  @property({ type: Number }) chartDatasourceId: number = null;
  @property({ type: Boolean }) chart: Boolean = false;

  static styles = [
    baseStyles,
    headerStyles,
    tradeLayoutStyles,
    css`
      :host {
        max-width: 480px;
      }

      .positions {
        background: var(--uigc-app-background-color);
        overflow: hidden;
      }

      .positions .title {
        color: var(--uigc-app-font-color__primary);
        font-family: var(--uigc-app-font-secondary);
        font-weight: var(--uigc-typography__title-font-weight);
        padding: 0 5px;
      }

      .positions uigc-typography {
        font-size: 15px;
      }

      @media (min-width: 480px) {
        .positions {
          border-radius: var(--uigc-app-border-radius);
        }
      }
    `,
  ];

  isEmptyAmount(amount: string): boolean {
    return amount == '' || amount == '0';
  }

  changeTab(active: DcaTab) {
    this.tab = active;
    this.requestUpdate();
  }

  private async recalculateSpotPrice() {
    const assetIn = this.invest.assetIn;
    const assetOut = this.invest.assetOut;

    if (!assetIn || !assetOut) {
      return;
    }

    const router = this.chain.state.router;
    const price: Amount = await router.getBestSpotPrice(assetIn.id, assetOut.id);
    const spotPrice: string = formatAmount(price.amount, price.decimals);

    this.invest = {
      ...this.invest,
      spotPrice: spotPrice,
    };
  }

  private switch() {
    this.invest = {
      ...this.invest,
      assetIn: this.invest.assetOut,
      assetOut: this.invest.assetIn,
    };
    this.recalculateSpotPrice();
  }

  private async changeAssetIn(previous: string, asset: PoolAsset) {
    const assetIn = asset;
    const assetOut = this.invest.assetOut;

    // Switch if selecting the same asset
    if (assetIn.id === assetOut?.id) {
      this.switch();
      return;
    }

    this.invest = {
      ...this.invest,
      assetIn: asset,
    };
  }

  private async changeAssetOut(previous: string, asset: PoolAsset) {
    const assetIn = this.invest.assetIn;
    const assetOut = asset;

    // Switch if selecting the same asset
    if (assetOut.id === assetIn?.id) {
      this.switch();
      return;
    }

    this.invest = {
      ...this.invest,
      assetOut: asset,
    };
  }

  updateAmountIn(amount: string) {
    this.invest = {
      ...this.invest,
      amountIn: amount,
    };
  }

  updateAmountOut(amount: string) {
    this.invest = {
      ...this.invest,
      amountOut: amount,
    };
  }

  private updateAsset(asset: string, assetKey: string) {
    if (asset) {
      this.invest[assetKey] = this.assets.map.get(asset);
    } else {
      this.invest[assetKey] = null;
    }
  }

  protected onInit(): void {
    if (!this.assetIn && !this.assetOut) {
      this.invest.assetIn = this.assets.map.get(this.stableCoinAssetId);
      this.invest.assetOut = this.assets.map.get(SYSTEM_ASSET_ID);
    } else {
      this.updateAsset(this.assetIn, 'assetIn');
      this.updateAsset(this.assetOut, 'assetOut');
    }
    this.recalculateSpotPrice();
  }

  protected onBlockChange(): void {}

  protected async onAccountChange(prev: Account, curr: Account): Promise<void> {
    super.onAccountChange(prev, curr);
  }

  onResize(_evt: UIEvent) {
    if (window.innerWidth > 1023 && DcaTab.TradeChart == this.tab) {
      this.changeTab(DcaTab.InvestForm);
    }
    this.width = window.innerWidth;
  }

  override connectedCallback() {
    super.connectedCallback();
    window.addEventListener('resize', (evt) => this.onResize(evt));
  }

  override disconnectedCallback() {
    window.removeEventListener('resize', this.onResize);
    super.disconnectedCallback();
  }

  selectAssetTab() {
    const classes = {
      tab: true,
      main: true,
      active: this.tab == DcaTab.SelectAsset,
    };
    return html` <uigc-paper class=${classMap(classes)}>
      <gc-select-asset
        .assets=${this.assets.list}
        .pairs=${this.assets.pairs}
        .details=${this.assets.details}
        .balances=${this.assets.balance}
        .usdPrice=${this.assets.usdPrice}
        .switchAllowed=${false}
        .selector=${this.asset.selector}
        @asset-clicked=${(e: CustomEvent) => {
          const { id, asset } = this.asset.selector;
          id == 'assetIn' && this.changeAssetIn(asset, e.detail);
          id == 'assetGet' && this.changeAssetOut(asset, e.detail);
          this.changeTab(DcaTab.InvestForm);
        }}
      >
        <div class="header section" slot="header">
          <uigc-icon-button class="back" @click=${() => this.changeTab(DcaTab.InvestForm)}>
            <uigc-icon-back></uigc-icon-back>
          </uigc-icon-button>
          <uigc-typography variant="section">${i18n.t('dca.selectAsset')}</uigc-typography>
          <span></span>
        </div>
      </gc-select-asset>
    </uigc-paper>`;
  }

  investFormTab() {
    const classes = {
      tab: true,
      main: true,
      active: this.tab == DcaTab.InvestForm,
    };
    return html` <uigc-paper class=${classMap(classes)} id="default-tab">
      <gc-dca-form
        .assets=${this.assets.map}
        .pairs=${this.assets.pairs}
        .assetIn=${this.invest.assetIn}
        .assetOut=${this.invest.assetOut}
        .amountIn=${this.invest.amountIn}
        .amountInUsd=${this.invest.amountInUsd}
        .amountOut=${this.invest.amountOut}
        .tradeFee=${this.invest.tradeFee}
        .tradeFeePct=${this.invest.tradeFeePct}
        @asset-input-changed=${({ detail: { id, asset, value } }: CustomEvent) => {
          console.log(id);
          console.log(value);

          id == 'assetIn' && this.updateAmountIn(value);
          id == 'assetGet' && this.updateAmountOut(value);
        }}
        @asset-selector-clicked=${({ detail }: CustomEvent) => {
          this.asset.selector = detail;
          this.changeTab(DcaTab.SelectAsset);
        }}
        @selector-clicked=${({ detail }: CustomEvent) => {
          this.asset.selector = { ...detail, id: 'assetGet' };
          this.changeTab(DcaTab.SelectAsset);
        }}
      >
        <div class="header" slot="header">
          <uigc-typography variant="title" gradient>${i18n.t('dca.title')}</uigc-typography>
          <span class="grow"></span>
          <uigc-icon-button basic class="chart-btn" @click=${() => this.changeTab(DcaTab.TradeChart)}>
            <uigc-icon-chart></uigc-icon-chart>
          </uigc-icon-button>
        </div>
      </gc-dca-form>
    </uigc-paper>`;
  }

  investPositionsSummary() {
    const classes = {
      positions: true,
    };
    return html` <div class=${classMap(classes)}>
      ${when(
        this.width > 768,
        () => html` <gc-dca-positions .defaultData=${defaultData}>
          <uigc-typography slot="header" variant="title">Active</uigc-typography>
          <uigc-typography slot="header" class="title">DCA</uigc-typography>
          <uigc-typography slot="header" variant="title">Positions</uigc-typography>
        </gc-dca-positions>`,
        () => html` <gc-dca-positions-mob .defaultData=${defaultData}>
          <uigc-typography slot="header" variant="title">Active</uigc-typography>
          <uigc-typography slot="header" class="title">DCA</uigc-typography>
          <uigc-typography slot="header" variant="title">Positions</uigc-typography>
        </gc-dca-positions-mob>`
      )}
    </div>`;
  }

  tradeChartTab() {
    const classes = {
      tab: true,
      chart: true,
      active: this.tab == DcaTab.TradeChart,
    };
    return html` <uigc-paper class=${classMap(classes)}>
      ${when(
        this.chart,
        () => html`
          <gc-trade-chart
            .datasourceId=${this.chartDatasourceId}
            .assetIn=${this.invest.assetIn}
            .assetOut=${this.invest.assetOut}
            .spotPrice=${this.invest.spotPrice}
            .usdPrice=${this.assets.usdPrice}
            .details=${this.assets.details}
          >
            <div class="header section" slot="header">
              <uigc-icon-button class="back" @click=${() => this.changeTab(DcaTab.InvestForm)}>
                <uigc-icon-back></uigc-icon-back>
              </uigc-icon-button>
              <uigc-typography variant="section">${i18n.t('chart.title')}</uigc-typography>
              <span></span>
            </div>
          </gc-trade-chart>
        `
      )}
    </uigc-paper>`;
  }

  render() {
    return html`
      <div class="layout-root">
        ${this.tradeChartTab()} ${this.investFormTab()} ${this.investPositionsSummary()} ${this.selectAssetTab()}
      </div>
    `;
  }
}
