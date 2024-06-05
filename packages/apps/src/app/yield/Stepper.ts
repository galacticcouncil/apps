import { LitElement, html, unsafeCSS, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import * as i18n from 'i18next';

import { baseStyles } from 'styles';

import styles from './Stepper.css';

@customElement('gc-yield-stepper')
export class YieldStepper extends LitElement {
  static styles = [unsafeCSS(baseStyles), unsafeCSS(styles)];

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
