import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { range } from 'lit/directives/range.js';
import { map } from 'lit/directives/map.js';

import { baseStyles, selectorStyles } from 'styles';

import { AnyChain } from '@galacticcouncil/xcm-core';

@customElement('gc-select-xchain')
export class SelectXChain extends LitElement {
  @property({ attribute: false }) chains: AnyChain[] = [];
  @property({ attribute: false }) srcChain = null;
  @property({ attribute: false }) destChain = null;
  @property({ type: String }) selector = null;
  @property({ type: String }) query = '';
  @property({ type: Boolean }) active = false;

  static styles = [baseStyles, selectorStyles];

  updateSearch(searchDetail: any) {
    this.query = searchDetail.value;
  }

  filterChains(query: string) {
    return this.chains.filter((c) =>
      c.name.toLowerCase().includes(query.toLowerCase()),
    );
  }

  isDisabled(chain: string): boolean {
    return this.selector === this.srcChain && chain === this.destChain;
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

  override update(changedProperties: Map<string, unknown>) {
    if (changedProperties.has('active') && !this.active) {
      this.query = '';
    }

    super.update(changedProperties);
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
    return html`
      <slot name="header"></slot>
      <uigc-search-bar
        class="search"
        placeholder="Search by name"
        .value=${this.query}
        @search-change=${(e: CustomEvent) =>
          this.updateSearch(e.detail)}></uigc-search-bar>
      ${when(
        this.chains.length > 0,
        () => html`
          <uigc-list>
            <span slot="header">Supported chains</span>
            ${map(this.filterChains(this.query), (chain: AnyChain) => {
              const { key, name } = chain;
              return html`
                <uigc-list-item
                  .item=${chain}
                  slot=${this.getSlot(key)}
                  ?selected=${this.isSelected(key)}
                  ?disabled=${this.isDisabled(key)}>
                  <uigc-chain .name=${name} .key=${key}></uigc-chain>
                </uigc-list-item>
              `;
            })}
          </uigc-list>
        `,
        () => html`
          <uigc-list>
            <span slot="header">Supported chains</span>
            ${map(range(3), (i) => this.loadingTemplate())}
          </uigc-list>
        `,
      )}
    `;
  }
}
