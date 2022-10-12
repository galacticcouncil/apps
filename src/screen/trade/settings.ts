import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import { baseStyles } from '../../base.css';

import '../../component/Button';
import '../../component/IconButton';
import '../../component/Input';
import '../../component/Switch';
import '../../component/ToggleButton';
import '../../component/ToggleButtonGroup';

@customElement('app-settings')
export class Settings extends LitElement {
  @property({ type: Number }) slippage = '0.5';
  @state() inputSlippage = null;

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

      .section {
        height: 40px;
        background: var(--hex-background-gray-1000);
        font-weight: 500;
        font-size: 14px;
        line-height: 19px;
        color: #acb2b5;
        padding: 0 28px;
        box-sizing: border-box;
        align-items: center;
        display: flex;
      }

      .settings {
        display: flex;
        flex-direction: column;
        padding: 14px 28px 28px 28px;
        gap: 14px;
        box-sizing: border-box;
      }

      .settings .row {
        display: flex;
        align-items: center;
        height: 30px;
        position: relative;
        justify-content: space-between;
      }

      .settings .label {
        font-weight: 500;
        font-size: 16px;
        line-height: 22px;
        text-transform: capitalize;
        color: var(--hex-white);
      }

      .settings .desc {
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 150%;
        color: #acb2b5;
      }

      .settings .slippage-input {
        margin-left: 8px;
      }

      .actions {
        display: flex;
        padding: 22px 28px;
        box-sizing: border-box;
        justify-content: space-between;
      }
    `,
  ];

  changeSlippage(slippage: string, input: string) {
    this.slippage = slippage;
    this.inputSlippage = input;
  }

  onBackClick(e: any) {
    const options = {
      bubbles: true,
      composed: true,
    };
    this.dispatchEvent(new CustomEvent('back-clicked', options));
  }

  render() {
    return html`
      <div class="header">
        <ui-icon-button class="back" @click=${this.onBackClick}>
          <img src="assets/img/icon/back.svg" alt="settings" />
        </ui-icon-button>
        <span>Edit settings</span>
        <span></span>
      </div>
      <div class="section">Slippage</div>
      <div class="settings">
        <div class="row">
          <span class="label">Enable Auto Trade Limit</span>
          <ui-switch size="small" disabled></ui-switch>
        </div>
        <ui-toggle-button-group
          selected=${this.slippage}
          @toggle-button-clicked=${(e: CustomEvent) => this.changeSlippage(e.detail.value, null)}
          @input-changed=${(e: CustomEvent) => this.changeSlippage(e.detail.value, e.detail.value)}
        >
          <ui-toggle-button value="0.1">0.1%</ui-toggle-button>
          <ui-toggle-button value="0.5">0.5%</ui-toggle-button>
          <ui-toggle-button value="1">1%</ui-toggle-button>
          <ui-toggle-button value="3">3%</ui-toggle-button>
          <ui-input
            class="slippage-input"
            .type=${'number'}
            .value=${this.inputSlippage}
            .min=${0}
            .max=${100}
            .placeholder=${'Custom'}
          ></ui-input>
        </ui-toggle-button-group>
        <div class="desc">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque vel augue tincidunt, tincidunt dolor aliquam,
          viverra justo. Morbi fringilla enim mauris, a posuere velit efficitur nec. Maecenas dignissim neque vitae ex
          vestibulum finibus.
        </div>
      </div>
      <div class="grow"></div>
      <div class="actions">
        <ui-button variant="secondary">Back</ui-button>
        <ui-button variant="primary">Save & Close</ui-button>
      </div>
    `;
  }
}
