import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

import { baseStyles } from '../base.css';

@customElement('gc-theme-switch')
export class ThemeSwitch extends LitElement {
  static styles = [
    baseStyles,
    css`
      * {
        box-sizing: border-box;
      }

      .fab-wrapper {
        position: fixed;
        bottom: 48px;
        right: 48px;
      }

      .fab-checkbox {
        display: none;
      }

      .fab {
        position: absolute;
        bottom: -16px;
        right: -16px;
        width: 64px;
        height: 64px;
        border-radius: 50%;
        transition: all 0.3s ease;
        z-index: 1;
        border-bottom-right-radius: 6px;
        background: var(--uigc-button__secondary-background);
        border: var(--uigc-button__secondary-border);
      }

      .fab:before {
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        border-radius: 50%;
      }

      .fab-checkbox:checked ~ .fab:before {
        width: 90%;
        height: 90%;
        left: 5%;
        top: 5%;
      }

      .fab:hover {
        cursor: pointer;
        background: var(--uigc-button__secondary-background__hover);
        border: var(--uigc-button__secondary-border__hover);
      }

      .fab-dots {
        position: absolute;
        height: 8px;
        width: 8px;
        background-color: #fff;
        border-radius: 50%;
        top: 50%;
        transform: translateX(0%) translateY(-50%) rotate(0deg);
        opacity: 1;
        animation: blink 3s ease infinite;
        transition: all 0.3s ease;
      }

      .fab-dots-1 {
        left: 15px;
        animation-delay: 0s;
      }

      .fab-dots-2 {
        left: 50%;
        transform: translateX(-50%) translateY(-50%);
        animation-delay: 0.4s;
      }

      .fab-dots-3 {
        right: 15px;
        animation-delay: 0.8s;
      }

      .fab-checkbox:checked ~ .fab .fab-dots {
        height: 5px;
      }

      .fab .fab-dots-2 {
        transform: translateX(-50%) translateY(-50%) rotate(0deg);
      }

      .fab-checkbox:checked ~ .fab .fab-dots-1 {
        width: 32px;
        border-radius: 10px;
        left: 50%;
        transform: translateX(-50%) translateY(-50%) rotate(45deg);
      }

      .fab-checkbox:checked ~ .fab .fab-dots-3 {
        width: 32px;
        border-radius: 10px;
        right: 50%;
        transform: translateX(50%) translateY(-50%) rotate(-45deg);
      }

      @keyframes blink {
        50% {
          opacity: 0.25;
        }
      }

      .fab-checkbox:checked ~ .fab .fab-dots {
        animation: none;
      }

      .fab-wheel {
        position: absolute;
        bottom: 0;
        right: 0;
        width: 10rem;
        height: 10rem;
        transition: all 0.3s ease;
        transform-origin: bottom right;
        transform: scale(0);
      }

      .fab-checkbox:checked ~ .fab-wheel {
        transform: scale(1);
      }

      .fab-action {
        position: absolute;
        background: var(--uigc-button__secondary-background);
        width: 48px;
        height: 48px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 1s ease;
        opacity: 0;
      }

      .fab-checkbox:checked ~ .fab-wheel .fab-action {
        opacity: 1;
      }

      .fab-action:hover {
        cursor: pointer;
        background-color: var(--uigc-button__secondary-background__hover);
      }

      .fab-wheel .fab-action-1 {
        right: -16px;
        top: 0;
      }

      .fab-wheel .fab-action-2 {
        right: 54px;
        top: 8px;
      }

      .fab-wheel .fab-action-3 {
        left: 8px;
        bottom: 54px;
      }

      .fab-wheel .fab-action-4 {
        left: 0;
        bottom: -16px;
      }
    `,
  ];

  onThemeSwitch(theme: string) {
    document.querySelector('html').setAttribute('theme', theme);
  }

  render() {
    return html`
      <div class="fab-wrapper">
        <input id="fabCheckbox" type="checkbox" class="fab-checkbox" />
        <label class="fab" for="fabCheckbox">
          <span class="fab-dots fab-dots-1"></span>
          <span class="fab-dots fab-dots-2"></span>
          <span class="fab-dots fab-dots-3"></span>
        </label>
        <div class="fab-wheel">
          <a class="fab-action fab-action-1" @click=${() => this.onThemeSwitch('hdx')}>
            <uigc-logo-chain chain="hydradx"></uigc-logo-chain>
          </a>
          <a class="fab-action fab-action-2" @click=${() => this.onThemeSwitch('bsx')}>
            <uigc-logo-chain chain="basilisk"></uigc-logo-chain>
          </a>
          <a class="fab-action fab-action-3"> </a>
          <a class="fab-action fab-action-4"> </a>
        </div>
      </div>
    `;
  }
}
