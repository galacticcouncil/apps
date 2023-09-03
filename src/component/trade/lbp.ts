import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { classMap } from 'lit/directives/class-map.js';

import * as i18n from 'i18next';

import './form';
import './settings';
import '../chart';
import '../selector/asset';

import { TradeTab } from './types';
import { TradeApp } from '.';

@customElement('gc-lbp-app')
export class LbpApp extends TradeApp {
  render() {
    return html`
      <div class="layout-root">
        ${this.tradeChartTab()} ${this.tradeFormTab()} ${this.tradeSettingsTab()} ${this.selectAssetTab()}
      </div>
    `;
  }
}
