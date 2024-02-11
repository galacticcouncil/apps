import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { range } from 'lit/directives/range.js';
import { map } from 'lit/directives/map.js';

import { baseStyles } from 'styles/base.css';
import { selectorStyles } from 'styles/selector.css';

@customElement('gc-select-chain')
export class SelectChain extends LitElement {
  @property({ attribute: false }) chains: string[] = [];
  @property({ type: String }) srcChain = null;
  @property({ type: String }) destChain = null;
  @property({ type: String }) selector = null;
  @property({ type: String }) query = '';

  static styles = [baseStyles, selectorStyles];

  updateSearch(searchDetail: any) {
    this.query = searchDetail.value;
  }

  filterChains(query: string) {
    return this.chains.filter((c) =>
      c.toLowerCase().includes(query.toLowerCase()),
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
        @search-change=${(e: CustomEvent) =>
          this.updateSearch(e.detail)}></uigc-search-bar>
      ${when(
        this.chains.length > 0,
        () => html`
          <uigc-list>
            <span slot="header">Supported chains</span>
            ${map(this.filterChains(this.query), (chain: string) => {
              return html`
                <uigc-list-item
                  .item=${chain}
                  slot=${this.getSlot(chain)}
                  ?selected=${this.isSelected(chain)}
                  ?disabled=${this.isDisabled(chain)}>
                  <uigc-chain .chain=${chain}></uigc-chain>
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
