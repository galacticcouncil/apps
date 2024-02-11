import { html } from 'lit';
import { customElement } from 'lit/decorators.js';

import { BaseIcon } from './BaseIcon';

@customElement('uigc-icon-crosshair')
export class CrosshairIcon extends BaseIcon {
  render() {
    return html`
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none">
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M5.26571 5.26816V6.73153H6.72909V5.26816H5.26571ZM0.875 5.26816H3.80186V3.80479H5.26523V0.87793H6.72861V3.80479H8.19198V5.26816H11.1188V6.73153H8.19198V8.19491H6.72861V11.1218H5.26523V8.19491H3.80186V6.73153H0.875V5.26816Z"
          fill="white" />
      </svg>
    `;
  }
}
