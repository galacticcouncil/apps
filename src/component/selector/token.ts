import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { range } from 'lit/directives/range.js';
import { map } from 'lit/directives/map.js';

import { baseStyles } from '../styles/base.css';
import { selectorStyles } from '../styles/selector.css';

import { humanizeAmount } from '../../utils/amount';

@customElement('gc-select-token')
export class SelectToken extends LitElement {
  @property({ attribute: false }) assets: string[] = [];
  @property({ attribute: false }) balances: Map<string, string> = new Map([]);
  @property({ type: String }) asset = null;
  @property({ type: String }) query = '';

  static styles = [baseStyles, selectorStyles];

  updateSearch(searchDetail: any) {
    this.query = searchDetail.value;
  }

  onBackClick(e: any) {
    const options = {
      bubbles: true,
      composed: true,
    };
    this.dispatchEvent(new CustomEvent('back-clicked', options));
  }

  filterAssets(query: string) {
    return this.assets.filter((a) => a.toLowerCase().includes(query.toLowerCase()));
  }

  isSelected(asset: string): boolean {
    return this.asset == asset;
  }

  getSlot(asset: string): string {
    if (this.isSelected(asset)) {
      return 'selected';
    } else {
      return null;
    }
  }

  loadingTemplate() {
    return html`
      <div class="loading">
        <uigc-skeleton circle progress></uigc-skeleton>
        <span class="title">
          <uigc-skeleton progress rectangle width="40px" height="16px"></uigc-skeleton>
          <uigc-skeleton progress rectangle width="50px" height="8px"></uigc-skeleton>
        </span>
      </div>
    `;
  }

  render() {
    return html`
      <slot name="header"></slot>
      <uigc-search-bar
        class="search"
        placeholder="Search by name"
        @search-changed=${(e: CustomEvent) => this.updateSearch(e.detail)}
      ></uigc-search-bar>
      ${when(
        this.assets.length > 0,
        () => html` <uigc-asset-list>
          ${map(this.filterAssets(this.query), (asset: string) => {
            const balance = this.balances.get(asset) || null;
            return html`
              <uigc-asset-list-item
                slot=${this.getSlot(asset)}
                ?selected=${this.isSelected(asset)}
                .asset=${{ symbol: asset }}
                .balance=${humanizeAmount(balance)}
              ></uigc-asset-list-item>
            `;
          })}
        </uigc-asset-list>`,
        () => html` <uigc-asset-list> ${map(range(3), (i) => this.loadingTemplate())} </uigc-asset-list> `
      )}
    `;
  }
}
