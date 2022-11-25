import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { baseStyles } from '../base.css';

@customElement('gc-xcm-app-main')
export class TradeTokens extends LitElement {
  @property({ type: String }) origin = null;
  @property({ type: String }) destination = null;
  @property({ type: String }) address = null;
  @property({ type: String }) amount = null;
  @property({ type: String }) asset = null;
  @property({ type: String }) balance = null;
  @property({ type: Boolean }) disabled = false;

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
        padding: 22px 28px;
        box-sizing: border-box;
      }

      .header h1 {
        background: var(--gradient-label);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .transfer {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        padding: 0 14px;
        box-sizing: border-box;
        border-radius: 12px;
        grid-gap: 20px;
      }

      @media (min-width: 768px) {
        .transfer {
          padding: 0 28px;
        }
      }

      .transfer .switch {
        transition: all 0.3s ease-in-out 0s;
        transform: rotate(270deg);
        border-radius: 50%;
        background: var(--hex-poison-green);
        cursor: pointer;
      }

      .transfer .switch:hover {
        transform: rotate(90deg);
      }

      .transfer .label {
        font-weight: 500;
        font-size: 14px;
        line-height: 100%;
        color: rgba(255, 255, 255, 0.7);
      }

      .account {
        padding: 0 14px;
        box-sizing: border-box;
      }

      @media (min-width: 768px) {
        .account {
          padding: 0 28px;
        }
      }

      .account > div {
        padding: 12px 20px;
        background: rgba(var(--rgb-primary-100), 0.06);
        border-radius: 12px;
        row-gap: 11px;
        display: grid;
      }

      .account > *:not(:last-child) {
        margin-bottom: 10px;
      }

      .account .label {
        font-weight: 500;
        font-size: 16px;
        line-height: 100%;
        color: rgba(255, 255, 255, 0.7);
      }

      .account .address {
        display: flex;
        flex-direction: row;
        align-items: center;
        grid-gap: 10px;
      }

      .account uigc-asset-transfer {
        margin-top: 10px;
      }

      .info {
        display: flex;
        flex-direction: column;
        margin-top: 10px;
        padding: 0 24px;
        box-sizing: border-box;
      }

      @media (min-width: 768px) {
        .info {
          padding: 0 38px;
        }
      }

      .info .row {
        display: flex;
        align-items: center;
        position: relative;
        gap: 5px;
        padding: 4px 0;
      }

      .info .row:not(:last-child):after {
        background-color: var(--hex-background-gray-800);
        bottom: 0;
        content: ' ';
        height: 1px;
        position: absolute;
        width: 100%;
      }

      .info .label {
        font-weight: 500;
        font-size: 14px;
        line-height: 22px;
        text-align: left;
        color: var(--hex-neutral-gray-300);
      }

      .info .value {
        font-weight: 500;
        font-size: 14px;
        line-height: 22px;
        text-align: right;
        color: var(--hex-white);
      }

      .confirm {
        display: flex;
        padding: 22px 14px;
        box-sizing: border-box;
      }

      @media (min-width: 768px) {
        .confirm {
          padding: 22px 28px;
        }
      }
    `,
  ];

  accountTemplate() {
    return html`
      <span class="label">Recipient</span>
      <div class="address">
        <svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 52 52" fill="none">
          <g clip-path="url(#clip0_14332_14867)">
            <rect x="0.5" y="0.695862" width="50.6083" height="50.6083" rx="25.3041" fill="black" />
            <path
              d="M22.2705 11.8652L25.8042 15.3989L22.2705 18.9326L18.7368 15.3989L22.2705 11.8652ZM32.8715 15.3989L29.3378 18.9326L25.8042 15.3989L29.3378 11.8652L32.8715 15.3989ZM29.3378 40.1347L25.8042 36.601L29.3378 33.0673L32.8715 36.601L29.3378 40.1347ZM18.7368 36.601L22.2705 33.0673L25.8042 36.601L22.2705 40.1347L18.7368 36.601ZM15.2031 18.9326L18.7368 22.4663L15.2031 26L11.6694 22.4663L15.2031 18.9326ZM39.9389 22.4663L36.4052 26L32.8715 22.4663L36.4052 18.9326L39.9389 22.4663ZM36.4052 33.0673L32.8715 29.5336L36.4052 26L39.9389 29.5336L36.4052 33.0673ZM11.6694 29.5336L15.2031 26L18.7368 29.5336L15.2031 33.0673L11.6694 29.5336ZM18.7368 18.9326H11.6694V11.8652L18.7368 18.9326ZM32.8715 18.9326V11.8652H39.9389L32.8715 18.9326ZM32.8715 33.0673H39.9389V40.1347L32.8715 33.0673ZM18.7368 33.0673V40.1347H11.6694L18.7368 33.0673Z"
              fill="#4FFFB0"
            />
            <path
              d="M18.7368 18.9326H25.8042V20.0743L22.8141 26H18.7368V18.9326ZM32.8715 18.9326V26H31.7299L25.8042 23.0099V18.9326H32.8715ZM32.8715 33.0673H25.8042V31.9257L28.7942 26H32.8715V33.0673ZM18.7368 33.0673V26H19.8785L25.8042 28.99V33.0673H18.7368Z"
              fill="#2E8C74"
            />
          </g>
          <defs>
            <clipPath id="clip0_14332_14867">
              <rect width="50.6083" height="52" fill="white" transform="translate(0.5)" />
            </clipPath>
          </defs>
        </svg>
        <uigc-input .value=${this.address} placeholder="Paste recipient address here"></uigc-input>
      </div>
    `;
  }

  transferFeeTemplate(label: string, tradeFee: string, assetSymbol: string) {
    return html` <span class="label">${label}</span>
      <span class="grow"></span>
      <span class="value">${tradeFee} ${assetSymbol}</span>`;
  }

  onSwitchClick(e: any) {
    const options = {
      bubbles: true,
      composed: true,
    };
    this.dispatchEvent(new CustomEvent('chain-switch-clicked', options));
  }

  onTransferClick(e: any) {
    const options = {
      bubbles: true,
      composed: true,
    };
    this.dispatchEvent(new CustomEvent('transfer-clicked', options));
  }

  onMaxClick(e: any) {
    const options = {
      bubbles: true,
      composed: true,
    };
    this.dispatchEvent(new CustomEvent('max-clicked', options));
  }

  render() {
    return html`
      <div class="header">
        <h1>XCM Transfer</h1>
        <span class="grow"></span>
      </div>
      <div class="transfer">
        <uigc-asset-selector asset=${this.origin} id="1"></uigc-asset-selector>
        <div class="switch-root" @click=${this.onSwitchClick}>
          <uigc-icon-switch fit class="switch"></uigc-icon-switch>
        </div>
        <uigc-asset-selector asset=${this.destination} id="2"></uigc-asset-selector>
      </div>
      <div class="account">
        <uigc-asset-transfer
          id="assetOut"
          title="Amount to send"
          .asset=${this.asset}
          .amount=${this.amount}
          .balance=${this.balance}
        ></uigc-asset-transfer>
        <div>${this.accountTemplate()}</div>
      </div>
      <div class="info">
        <div class="row">${this.transferFeeTemplate('Origin Chain Transfer Fee', '0.000006', 'BSX')}</div>
        <div class="row">${this.transferFeeTemplate('Destination Chain Transfer Fee', '0.0001', 'KSM')}</div>
      </div>
      <div class="grow"></div>
      <uigc-button ?disabled=${this.disabled} class="confirm" variant="primary" fullWidth @click=${this.onTransferClick}
        >Transfer</uigc-button
      >
    `;
  }
}
