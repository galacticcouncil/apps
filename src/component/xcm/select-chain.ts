import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { range } from 'lit/directives/range.js';
import { map } from 'lit/directives/map.js';

import * as i18n from 'i18next';

import { baseStyles } from '../base.css';

@customElement('gc-xcm-app-chain')
export class SelectChain extends LitElement {
  @property({ attribute: false }) chains: string[] = [];
  @property({ type: String }) srcChain = null;
  @property({ type: String }) dstChain = null;
  @property({ type: String }) selector = null;
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
        height: 84px;
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
        padding: 0 14px;
        box-sizing: border-box;
      }

      @media (min-width: 768px) {
        .search {
          padding: 0 28px;
        }
      }

      uigc-list {
        padding-top: 20px;
        overflow-y: auto;
      }

      .loading {
        align-items: center;
        display: flex;
        padding: 8px 28px;
        gap: 6px;
        border-bottom: 1px solid var(--hex-background-gray-800);
      }

      .loading > span.title {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
    `,
  ];

  updateSearch(searchDetail: any) {
    this.query = searchDetail.value;
  }

  filterChains(query: string) {
    return this.chains.filter((c) => c.toLowerCase().includes(query.toLowerCase()));
  }

  isDisabled(chain: string): boolean {
    return this.selector === this.srcChain && chain === this.dstChain;
  }

  isSelected(chain: string): boolean {
    return this.selector == chain;
  }

  getSlot(chain: string): string {
    if (this.isDisabled(chain)) {
      return 'disabled';
    } else if (this.isSelected(chain)) {
      return 'selected';
    } else {
      return null;
    }
  }

  onBackClick(e: any) {
    const options = {
      bubbles: true,
      composed: true,
    };
    this.dispatchEvent(new CustomEvent('back-clicked', options));
  }

  loadingTemplate() {
    return html`
      <div class="loading">
        <uigc-skeleton circle progress></uigc-skeleton>
        <span class="title">
          <uigc-skeleton progress width="40px" height="16px"></uigc-skeleton>
        </span>
      </div>
    `;
  }

  render() {
    const isDest = this.selector === this.dstChain;
    return html`
      <div class="header">
        <uigc-icon-button class="back" @click=${this.onBackClick}> <uigc-icon-back></uigc-icon-back> </uigc-icon-button>
        <uigc-typography variant="section">${isDest ? i18n.t('xcm.dest') : i18n.t('xcm.source')}</uigc-typography>
        <span></span>
      </div>
      <uigc-search-bar
        class="search"
        placeholder="${i18n.t('xcm.searchByName')}"
        @search-changed=${(e: CustomEvent) => this.updateSearch(e.detail)}
      ></uigc-search-bar>
      ${when(
        this.chains.length > 0,
        () => html` <uigc-list>
          <span slot="header">${i18n.t('xcm.supportedChains')}</span>
          ${map(this.filterChains(this.query), (chain: string) => {
            return html`
              <uigc-list-item
                .item=${chain}
                slot=${this.getSlot(chain)}
                ?selected=${this.isSelected(chain)}
                ?disabled=${this.isDisabled(chain)}
              >
                <uigc-chain .chain=${chain}></uigc-chain>
              </uigc-list-item>
            `;
          })}
        </uigc-list>`,
        () => html`
          <uigc-list>
            <span slot="header">${i18n.t('xcm.supportedChains')}</span>
            ${map(range(3), (i) => this.loadingTemplate())}
          </uigc-list>
        `
      )}
    `;
  }
}
