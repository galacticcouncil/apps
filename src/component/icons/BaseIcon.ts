import { css, LitElement } from 'lit';

export class BaseIcon extends LitElement {
  static styles = [
    css`
      :host {
        display: flex;
      }

      :host([fit]) svg {
        width: 100%;
        height: 100%;
      }
    `,
  ];
}
