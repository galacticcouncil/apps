import { html, css, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('icon-back')
export class BackIcon extends LitElement {
  static styles = [
    css`
      :host {
        display: flex;
      }
    `,
  ];

  render() {
    return html`
      <svg width="7" height="13" viewBox="0 0 7 13" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 1L1 6.5L6 12" stroke="#E5ECF1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    `;
  }
}
