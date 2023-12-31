import { BaseApp } from '../base/BaseApp';
import { Account } from '../../db';
import { customElement, property } from 'lit/decorators.js';
import { css, html } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { baseStyles } from '../styles/base.css';
import { headerStyles } from '../styles/header.css';
import { basicLayoutStyles } from '../styles/layout/basic.css';
import * as i18n from 'i18next';
import { formStyles } from '../styles/form.css';

@customElement('gc-extrinsic-app')
export class ExtrinsicApp extends BaseApp {
  @property({ type: String }) data: string = null;
  @property({ type: Boolean }) disabled = false;

  static styles = [
    baseStyles,
    headerStyles,
    formStyles,
    basicLayoutStyles,
    css`
      :host {
        max-width: 570px;
      }
    `,
  ];

  protected onAccountChange(prev: Account, curr: Account): Promise<void> {
    // no action needed
    return Promise.resolve(undefined);
  }

  protected onClick() {
    alert('clicked');
  }

  render() {
    const classes = {
      tab: true,
      main: true,
      active: true,
    };
    return html`
      <div class="layout-root">
        <uigc-paper class=${classMap(classes)} id="default-tab">
          <div class="header">
            <uigc-typography gradient variant="title"
              >Custom Extrinsic</uigc-typography
            >
            <span class="grow"></span>
          </div>
          <uigc-address-input id="data" title="Data" .data=${this.data}>
          </uigc-address-input>
          <uigc-button
            ?disabled=${this.disabled || !this.account.state}
            class="confirm"
            variant="primary"
            fullWidth
            @click=${this.onClick}
            >${this.account.state
              ? 'Send'
              : i18n.t('trade.connect')}</uigc-button
          >
        </uigc-paper>
      </div>
    `;
  }
}
