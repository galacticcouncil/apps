import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { choose } from 'lit/directives/choose.js';

import { UIGCElement } from './base/UIGCElement';

import './logo/aUSD';
import './logo/BSX';
import './logo/KSM';
import './logo/PHA';
import './logo/TNKR';
import './logo/unknown';

import { AssetType, AssetTypes } from './types/AssetType';

const KNOWN_ASSETS = AssetType.getMap(AssetTypes);

@customElement('ui-asset')
export class Asset extends UIGCElement {
  @property({ type: String }) asset = null;

  static styles = [
    UIGCElement.styles,
    css`
      :host {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 6px;
        background-color: transparent;
        height: 52px;
        border-radius: 8px;
        cursor: pointer;
      }

      span.code {
        font-weight: 700;
        font-size: 16px;
        line-height: 100%;
        color: var(--hex-white);
      }

      span.desc {
        font-weight: 500;
        font-size: 12px;
        line-height: 14px;
        color: var(--hex-neutral-gray-400);
        white-space: nowrap;
      }

      span.title {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        padding: 5px 0px;
      }

      .logo {
        width: 34px;
        height: 34px;
      }
    `,
  ];

  render() {
    const assetDesc = KNOWN_ASSETS.get(this.asset) || '--';
    return html` ${choose(
        this.asset,
        [
          ['aUSD', () => html`<logo-ausd class="logo" fit></logo-ausd>`],
          ['BSX', () => html`<logo-bsx class="logo" fit></logo-bsx>`],
          ['KSM', () => html`<logo-ksm class="logo" fit></logo-ksm>`],
          ['PHA', () => html`<logo-pha class="logo" fit></logo-pha>`],
          ['TNKR', () => html`<logo-tnkr class="logo" fit></logo-tnkr>`],
        ],
        () => html`<logo-unknown class="logo" fit></logo-unknown>`
      )}
      <span class="title">
        <span class="code">${this.asset}</span>
        <span class="desc">${assetDesc}</span>
      </span>
      <slot></slot>`;
  }
}
