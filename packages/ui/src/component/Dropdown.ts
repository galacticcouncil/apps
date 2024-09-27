import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { UIGCElement } from 'component/base/UIGCElement';

import { Popper } from 'component/Popper';

import styles from './Dropdown.css';

type ItemProps = {
  text: string;
  active?: boolean;
  onClick: () => void;
};

@customElement('uigc-dropdown')
export class Dropdown extends Popper {
  static styles = [UIGCElement.styles, styles];

  get buttonElement() {
    return this.shadowRoot.querySelector('.tooltip > button');
  }

  @property({ type: String }) text = null;
  @property({ type: Array }) items: ItemProps[] = [];

  handleItemClick(item: ItemProps) {
    this.tooltipElement.classList.remove('show');
    item.onClick();
  }

  render() {
    return html`
      <slot></slot>
      <div class="tooltip">
        ${this.items.map(
          (item) => html`
            <button
              class=${item.active ? 'active' : ''}
              @click=${() => this.handleItemClick(item)}>
              ${item.text}
            </button>
          `,
        )}
      </div>
    `;
  }
}
