import { LitElement, html, css, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import * as i18n from 'i18next';

import { baseStyles } from 'styles/base.css';

@customElement('gc-yield-stepper')
export class YieldStepper extends LitElement {
  static styles = [
    baseStyles,
    css`
      :host {
        display: none;
        margin-top: 20px;
      }

      .stepper {
        background: var(--uigc-app-background-color);
        font-family: var(--uigc-app-font);
        overflow: hidden;
        position: relative;
      }

      @media (min-width: 480px) {
        .stepper {
          border-radius: var(--uigc-app-border-radius);
        }

        .stepper:before {
          content: '';
          position: absolute;
          inset: 0px;
          border-radius: 8px;
          padding: 1px;
          background: linear-gradient(
            rgba(152, 176, 214, 0.27) 0%,
            rgba(163, 177, 199, 0.15) 66.67%,
            rgba(158, 167, 180, 0.2) 100%
          );
          mask: var(--uigc-paper-mask);
          mask-composite: xor;
          -webkit-mask: var(--uigc-paper-mask);
          -webkit-mask-composite: xor;
          pointer-events: none;
        }
      }

      .header {
        display: flex;
        align-items: flex-start;
        gap: 8px;
        padding: 14px 14px;
        position: relative;
        display: flex;
        box-sizing: border-box;
      }

      @media (min-width: 768px) {
        .header {
          padding: 22px 28px;
          min-height: 84px;
        }
      }

      .header .title {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        flex-shrink: 0;
        align-self: stretch;
      }

      .header uigc-asset-id {
        width: 22px;
        height: 22px;
      }

      .header .sub {
        color: #fff;
        font-size: 13px;
        font-style: normal;
        font-weight: 500;
        line-height: 130%;
        opacity: 0.6;
      }

      .header:after {
        background-color: var(--uigc-divider-color);
        bottom: 0;
        content: ' ';
        height: 1px;
        position: absolute;
        width: calc(100% - 2 * 28px);
      }

      .steps {
        padding: 14px 14px;
      }

      @media (min-width: 768px) {
        .steps {
          padding: 22px 28px;
        }
      }

      .step {
        display: flex;
        gap: 16px;
      }

      .step .graphic {
        display: flex;
        flex-direction: column;
        align-items: center;
        align-self: stretch;
      }

      .step .icon {
        display: flex;
        width: 24px;
        height: 24px;
        justify-content: center;
        align-items: center;
        border-radius: 25px;
        border: 1px solid var(--primary-Alpha_0-35, rgba(47, 211, 247, 0.35));
        background: linear-gradient(
          180deg,
          rgba(0, 87, 159, 0.39) 0%,
          rgba(2, 59, 106, 0.39) 25%,
          rgba(6, 9, 23, 0.39) 100%
        );
        color: #fff;
        font-family: var(--uigc-app-font-secondary);
        font-size: 10px;
        font-style: normal;
        font-weight: 500;
      }

      .step:not(:last-child) .line {
        width: 1px;
        height: 34px;
        background: rgba(47, 211, 247, 0.35);
      }

      .step .content {
        display: flex;
        flex-direction: column;
      }

      .step .label {
        color: #fff;
        font-size: 14px;
        font-style: normal;
        font-weight: 600;
        line-height: 100%;
      }

      .step .body {
        color: #999ba7;
        font-size: 13px;
        font-style: normal;
        font-weight: 500;
        line-height: 120%;
      }

      .step .body > a {
        color: #85d1ff;
        font-size: 13px;
        font-style: normal;
        font-weight: 500;
        line-height: 120%;
        text-decoration-line: underline;
      }
    `,
  ];

  stepTemplate(no: number, title: string, desc: string, link: TemplateResult) {
    return html`
      <div class="step">
        <div class="graphic">
          <span class="icon">${no}</span>
          <span class="line"></span>
        </div>
        <div class="content">
          <span class="label">${title}</span>
          <span class="body">${desc} ${when(link, () => link)}</span>
        </div>
      </div>
    `;
  }

  icoTemplate() {
    return html`
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="15"
        height="14"
        viewBox="0 0 15 14"
        fill="none">
        <path
          d="M13.1641 8.75V1.75H6.16406V3.5H9.66406V5.25H7.91406V7H6.16406V8.75H4.41406V10.5H2.66406V12.25H4.41406V10.5H6.16406V8.75H7.91406V7H9.66406V5.25H11.4141V8.75H13.1641Z"
          fill="#85D1FF" />
      </svg>
    `;
  }

  render() {
    return html`
      <div class="stepper">
        <div class="header">
          <uigc-asset-id symbol=${'vDOT'}></uigc-asset-id>
          <div class="title">
            <uigc-typography variant="section">
              ${i18n.t('stepper.title')}
            </uigc-typography>
            <span class="sub">${i18n.t('stepper.desc')}</span>
          </div>
        </div>
        <div class="steps">
          ${this.stepTemplate(
            1,
            i18n.t('stepper.step1.title'),
            i18n.t('stepper.step1.desc'),
            html`
              <a
                target="_blank"
                href="/cross-chain?srcChain=hydradx&destChain=bifrost&asset=dot">
                CROSS-CHAIN UI ${this.icoTemplate()}
              </a>
            `,
          )}
          ${this.stepTemplate(
            2,
            i18n.t('stepper.step2.title'),
            i18n.t('stepper.step2.desc'),
            html`
              <a
                target="”_blank”"
                href="https://bifrost.app/vstaking/vDOT?r=hydradx">
                Bifrost Staking UI ${this.icoTemplate()}
              </a>
            `,
          )}
          ${this.stepTemplate(
            3,
            i18n.t('stepper.step3.title'),
            i18n.t('stepper.step3.desc'),
            html`
              <a
                target="_blank"
                href="/cross-chain?srcChain=bifrost&destChain=hydradx&asset=vdot">
                CROSS-CHAIN UI ${this.icoTemplate()}
              </a>
            `,
          )}
          ${this.stepTemplate(
            4,
            i18n.t('stepper.step4.title'),
            i18n.t('stepper.step4.desc'),
            null,
          )}
        </div>
      </div>
    `;
  }
}
