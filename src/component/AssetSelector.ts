import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { themeStyles } from './styles/theme.css';
import { baseStyles } from './styles/base.css';

const KNOWN_ASSETS = new Map(
  Object.entries({
    aUSD: 'Acala USD',
    BSX: 'Basilisk',
    KSM: 'Kusama',
    PHA: 'Phala',
  })
);

@customElement('ui-asset-selector')
export class AssetSelector extends LitElement {
  @property({ type: String }) id = null;
  @property({ type: String }) asset = null;

  static styles = [
    baseStyles,
    themeStyles,
    css`
      :host {
        border-radius: 12px;
      }

      button {
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 0 6px;
        gap: 6px;
        background-color: transparent;
        min-width: 130px;
        height: 52px;
        border-radius: 8px;
        cursor: pointer;
      }

      button:hover {
        background: rgba(var(--rgb-white), 0.06);
      }
    `,
  ];

  onSelectorClick(e: any) {
    const options = {
      bubbles: true,
      composed: true,
      detail: { id: this.id, asset: this.asset },
    };
    this.dispatchEvent(new CustomEvent('asset-selector-clicked', options));
  }

  render() {
    return html` <button @click=${this.onSelectorClick}>
      <ui-asset .asset=${this.asset}>
        <svg width="13" height="8" viewBox="0 0 13 8" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 1.24475C0.0248693 1.16055 0.046528 1.07416 0.0746412 0.989968C0.147698 0.769511 0.273559 0.570779 0.441049 0.411499C0.60854 0.252219 0.812476 0.137353 1.03455 0.0771483C1.25662 0.0169435 1.48996 0.0132752 1.71378 0.0664699C1.93759 0.119665 2.14487 0.228062 2.31718 0.382C2.368 0.426832 2.41558 0.474942 2.46316 0.523055L6.36984 4.47485C6.40552 4.50984 6.43685 4.55139 6.47794 4.5995C6.5266 4.55357 6.56227 4.51968 6.59687 4.48469L10.5576 0.480408C10.8014 0.199248 11.1456 0.0275388 11.5145 0.00303359C11.8835 -0.0214717 12.247 0.103243 12.525 0.349748C12.803 0.596253 12.9728 0.944345 12.997 1.31746C13.0212 1.69058 12.8979 2.05814 12.6542 2.3393C12.6109 2.39179 12.5645 2.44099 12.5169 2.4902L7.52569 7.53656C7.32326 7.76391 7.05283 7.91798 6.75565 7.97524C6.45848 8.0325 6.15094 7.98981 5.88002 7.85367C5.7298 7.77599 5.59256 7.67488 5.47342 7.55406C3.79528 5.86356 2.11861 4.1705 0.443359 2.4749C0.219187 2.24232 0.0653419 1.94983 0 1.63184V1.24475Z"
            fill="white"
          ></path>
        </svg>
      </ui-asset>
    </button>`;
  }
}
