import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { UIGCElement } from './base/UIGCElement';

import { computePosition } from '@floating-ui/dom';

import styles from './Popper.css';

@customElement('uigc-popper')
export class Popper extends UIGCElement {
  @property({ type: String }) text = null;

  static styles = [UIGCElement.styles, styles];

  get triggerElement() {
    const slotted = this.shadowRoot.querySelector('slot');
    return slotted.assignedElements()[0];
  }

  get tooltipElement() {
    return this.shadowRoot.querySelector('.tooltip') as HTMLElement;
  }

  private mouseOverListener = () => {
    computePosition(this.triggerElement, this.tooltipElement, {
      placement: 'right-start',
    }).then(({ x, y }) => {
      Object.assign(this.tooltipElement.style, {
        display: 'block',
        left: `${x}px`,
        top: `${y}px`,
      });
    });
  };

  private mouseOutListener = () => {
    Object.assign(this.tooltipElement.style, {
      display: 'none',
    });
  };

  override async firstUpdated() {
    this.triggerElement.addEventListener('mouseover', this.mouseOverListener);
    this.triggerElement.addEventListener('mouseout', this.mouseOutListener);
  }

  override disconnectedCallback() {
    this.triggerElement.removeEventListener(
      'mouseover',
      this.mouseOverListener,
    );
    this.triggerElement.removeEventListener('mouseout', this.mouseOutListener);
    super.disconnectedCallback();
  }

  render() {
    return html`
      <slot></slot>
      <div class="tooltip">${this.text}</div>
    `;
  }
}
