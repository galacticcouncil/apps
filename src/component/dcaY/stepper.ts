import { LitElement, html, css, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';

import { baseStyles } from '../styles/base.css';
import { headerStyles } from '../styles/header.css';

@customElement('gc-dca-y-stepper')
export class DcaYStepper extends LitElement {
  static styles = [
    baseStyles,
    headerStyles,
    css`
      :host {
        display: none;
        margin-top: 20px;
      }

      .stepper {
        background: var(--uigc-app-background-color);
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
        font-family: 'Chakra Petch';
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
        padding: 0 14px;
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

      .step > .pic {
        display: flex;
        flex-direction: column;
        align-items: center;
        align-self: stretch;
      }

      .step .ball {
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
        font-family: 'FontOver';
        font-size: 10px;
        font-style: normal;
        font-weight: 500;
      }

      .step:not(:last-child) .line {
        width: 1px;
        height: 34px;
        background: rgba(47, 211, 247, 0.35);
      }

      .step .text {
        display: flex;
        flex-direction: column;
      }

      .step .title {
        color: #fff;
        font-family: 'ChakraPetch';
        font-size: 14px;
        font-style: normal;
        font-weight: 600;
        line-height: 100%;
      }

      .step .desc {
        color: #999ba7;
        font-family: 'ChakraPetch';
        font-size: 13px;
        font-style: normal;
        font-weight: 500;
        line-height: 120%;
      }

      .step .desc > a {
        color: #85d1ff;
        font-family: 'ChakraPetch';
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
        <div class="pic">
          <span class="ball">${no}</span>
          <span class="line"></span>
        </div>
        <div class="text">
          <span class="title">${title}</span>
          <span class="desc">${desc} ${when(link, () => link)} </span>
        </div>
      </div>
    `;
  }

  render() {
    return html`
      <div class="stepper">
        <div class="header">
          <uigc-asset-id symbol=${'vDOT'}></uigc-asset-id>
          <div class="title">
            <uigc-typography variant="section"
              >How to get vDOT?</uigc-typography
            >
            <span class="sub">Then DCA Your DOT yield in one click.</span>
          </div>
        </div>
        <div class="steps">
          ${this.stepTemplate(
            1,
            'Cross-chain your DOT to Bitfrost',
            'Use XCM UI to send your DOT to Bifrost.',
            html` <a target="_blank" href="/cross-chain">Open XCM</a>`,
          )}
          ${this.stepTemplate(
            2,
            'Stake DOT to get vDOT',
            'Stake your DOT for vDOT through',
            html` <a
              target="”_blank”"
              href="https://bifrost.app/vstaking/vDOT?r=hydradx"
              >Bifrost Staking UI</a
            >`,
          )}
          ${this.stepTemplate(
            3,
            'Send vDOT back to HydraDX',
            'Use Hydra XCM to send your vDOT to HydraDX',
            null,
          )}
          ${this.stepTemplate(
            4,
            'Schedule your DCA',
            'Now DCA your yield with the UI above and enjoy the profits!',
            null,
          )}
        </div>
      </div>
    `;
  }
}
