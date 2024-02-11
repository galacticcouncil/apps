import { css, LitElement } from 'lit';

export class BaseLogo extends LitElement {
  static styles = [
    css`
      :host {
        display: flex;
      }

      :host([fit]) svg {
        width: 100%;
        height: 100%;
      }

      :host svg[bsx] {
        display: var(--uigc-bsx-flex-display);
      }

      :host svg[hdx] {
        display: var(--uigc-hdx-flex-display);
      }
    `,
  ];
}
