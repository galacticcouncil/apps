import { html, css, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('icon-chevron-right')
export class ChevronRightIcon extends LitElement {
  static styles = [
    css`
      :host {
        display: flex;
      }
    `,
  ];

  render() {
    return html`
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M11 15.998L14 11.998L11 7.99805"
          stroke="#BDCCD4"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    `;
  }
}
