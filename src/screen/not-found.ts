import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

import { baseStyles } from '../base.css';

@customElement('app-not-found')
export class NotFound extends LitElement {
  static styles = [baseStyles];

  render() {
    return html` <div class="container">Not found</div> `;
  }
}
