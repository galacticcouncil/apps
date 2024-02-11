import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('gc-root')
export class Root extends LitElement {
  render() {
    return html` <slot></slot> `;
  }
}
