import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { UIGCElement } from './base/UIGCElement';

import { computePosition, flip, Placement } from '@floating-ui/dom';

import styles from './Popper.css';

type TriggerMethod = 'click' | 'hover';

@customElement('uigc-popper')
export class Popper extends UIGCElement {
  @property({ type: String }) text = null;
  @property({ type: String }) placement: Placement = 'right-start';
  @property({ type: String }) triggerMethod: TriggerMethod = 'hover';

  static styles = [UIGCElement.styles, styles];

  get triggerElement() {
    const slotted = this.shadowRoot.querySelector('slot');
    return slotted.assignedElements()[0];
  }

  get tooltipElement() {
    return this.shadowRoot.querySelector('.tooltip') as HTMLElement;
  }

  private updatePosition = () => {
    computePosition(this.triggerElement, this.tooltipElement, {
      placement: this.placement,
      strategy: 'fixed',
      middleware: [flip()],
    }).then(({ x, y }) => {
      Object.assign(this.tooltipElement.style, {
        left: `${x}px`,
        top: `${y}px`,
      });
    });
  };

  private onShow = () => {
    this.tooltipElement.classList.add('show');
    this.updatePosition();
  };

  private onHide = () => {
    this.tooltipElement.classList.remove('show');
  };

  private onToggle = () => {
    this.tooltipElement.classList.toggle('show');
    this.updatePosition();
  };

  override async firstUpdated() {
    if (this.triggerMethod === 'click') {
      this.triggerElement.addEventListener('mousedown', this.onToggle);
    } else {
      this.triggerElement.addEventListener('mouseover', this.onShow);
      this.triggerElement.addEventListener('mouseout', this.onHide);
    }
  }

  override disconnectedCallback() {
    if (this.triggerMethod === 'click') {
      this.triggerElement.removeEventListener('mousedown', this.onToggle);
    } else {
      this.triggerElement.removeEventListener('mouseover', this.onShow);
      this.triggerElement.removeEventListener('mouseout', this.onHide);
    }
    super.disconnectedCallback();
  }

  render() {
    return html`
      <slot></slot>
      <div class="tooltip">${this.text}</div>
    `;
  }
}
