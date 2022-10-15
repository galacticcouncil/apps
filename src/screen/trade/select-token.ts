import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { baseStyles } from '../../base.css';

import '../../component/AssetList';
import '../../component/AssetListItem';
import '../../component/IconButton';
import '../../component/Paper';
import '../../component/SearchBar';

import { PoolAsset } from '@galacticcouncil/sdk';

@customElement('app-select-token')
export class SelectToken extends LitElement {
  @property({ attribute: false }) assets = [];
  @property({ type: String }) query = '';

  static styles = [
    baseStyles,
    css`
      :host {
        display: flex;
        flex-direction: column;
        height: 100%;
      }

      .header {
        display: flex;
        justify-content: center;
        padding: 22px 28px;
        box-sizing: border-box;
        align-items: center;
        line-height: 40px;
      }

      .header span {
        color: var(--hex-neutral-gray-100);
        font-weight: 500;
        font-size: 16px;
      }

      .header .back {
        position: absolute;
        left: 20px;
      }

      .search {
        padding: 0 28px;
        box-sizing: border-box;
      }
    `,
  ];

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
    return this.assets.filter((a) => a.symbol.toLowerCase().includes(query.toLowerCase()));
  }

  render() {
    return html`
      <div class="header">
        <ui-icon-button class="back" @click=${this.onBackClick}>
          <img src="assets/img/icon/back.svg" alt="settings" />
        </ui-icon-button>
        <span>Select token</span>
        <span></span>
      </div>
      <ui-search-bar
        class="search"
        placeholder="Search by name"
        @search-changed=${(e: CustomEvent) => this.updateSearch(e.detail)}
      ></ui-search-bar>
      <ui-asset-list>
        ${this.filterAssets(this.query).map((asset: PoolAsset) => {
          return html` <ui-asset-list-item .asset=${asset}></ui-asset-list-item> `;
        })}
      </ui-asset-list>
    `;
  }
}
