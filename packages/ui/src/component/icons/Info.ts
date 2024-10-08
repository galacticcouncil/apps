import { html } from 'lit';
import { customElement } from 'lit/decorators.js';

import { BaseIcon } from './BaseIcon';

import styles from './Info.css';

@customElement('uigc-icon-info')
export class InfoIcon extends BaseIcon {
  static styles = [BaseIcon.styles, styles];

  bsxTemplate() {
    return html`
      <svg
        bsx
        width="24"
        height="24"
        viewBox="0 0 17 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path
          d="M15.2569 5.39486V3.35039H14.2347V2.32816H13.2125V1.30592H11.168V0.283691H6.05684V1.30592H4.01238V2.32816H2.99014V3.35039H1.96791V5.39486H0.945679V10.506H1.96791V12.5505H2.99014V13.5727H4.01238V14.595H6.05684V15.6172H11.168V14.595H13.2125V13.5727H14.2347V12.5505H15.2569V10.506H16.2792V5.39486H15.2569Z"
          fill="url(#linear1)"
          fill-opacity="0.5" />
        <path
          d="M7.92419 5.05975V4.29175L8.47619 3.73975H9.31619L9.86819 4.29175V5.05975L9.31619 5.61175H8.47619L7.92419 5.05975ZM8.10419 6.30775H9.68819V12.2837H8.10419V6.30775Z"
          fill="currentColor" />
        <defs>
          <linearGradient
            id="linear1"
            x1="8.66804"
            y1="-3.23897"
            x2="8.66804"
            y2="14.285"
            gradientUnits="userSpaceOnUse">
            <stop stop-color="#85D1FF" />
            <stop offset="1" stop-color="#85D1FF" stop-opacity="0" />
          </linearGradient>
        </defs>
      </svg>
    `;
  }

  hdxTemplate() {
    return html`
      <svg
        hdx
        width="24"
        height="24"
        viewBox="0 0 17 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path
          d="M15.2569 5.39486V3.35039H14.2347V2.32816H13.2125V1.30592H11.168V0.283691H6.05684V1.30592H4.01238V2.32816H2.99014V3.35039H1.96791V5.39486H0.945679V10.506H1.96791V12.5505H2.99014V13.5727H4.01238V14.595H6.05684V15.6172H11.168V14.595H13.2125V13.5727H14.2347V12.5505H15.2569V10.506H16.2792V5.39486H15.2569Z"
          fill="url(#linear0)"
          fill-opacity="0.5" />
        <path
          d="M7.92419 5.05975V4.29175L8.47619 3.73975H9.31619L9.86819 4.29175V5.05975L9.31619 5.61175H8.47619L7.92419 5.05975ZM8.10419 6.30775H9.68819V12.2837H8.10419V6.30775Z"
          fill="currentColor" />
        <defs>
          <linearGradient
            id="linear0"
            x1="8.66804"
            y1="-3.23897"
            x2="8.66804"
            y2="14.285"
            gradientUnits="userSpaceOnUse">
            <stop stop-color="#85D1FF" />
            <stop offset="1" stop-color="#85D1FF" stop-opacity="0" />
          </linearGradient>
        </defs>
      </svg>
    `;
  }

  render() {
    return html`
      ${this.bsxTemplate()} ${this.hdxTemplate()}
    `;
  }
}
