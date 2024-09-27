import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { debounce } from 'ts-debounce';

import { UIGCElement } from './base/UIGCElement';
import styles from './Slider.css';

import './Popper';
import './icons/Info';

@customElement('uigc-slider')
export class Slider extends UIGCElement {
  _inputHandler = null;

  @property({ type: Number }) min: number = 0;
  @property({ type: Number }) max: number = 100;
  @property({ type: Number }) step: number = 1;
  @property({ type: Number }) value: number;
  @property({ type: Number }) thumbSize: number = 26;
  @property({ type: Number }) trackSize: number = 5;
  @property({ type: Number }) dashCount: number = 20;
  @property({ type: String }) label: string = '';
  @property({ type: String }) unit: string = '';
  @property({ type: String }) hint: string = '';
  @property({ type: Boolean }) disabled: boolean;

  constructor() {
    super();
    this._inputHandler = debounce(this.onInputChange, 300);
  }

  static get styles() {
    return [UIGCElement.styles, styles];
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.value = Math.floor((this.min + this.max) / 2);
    this.style.setProperty('--thumb-size', this.thumbSize + 'px');
    this.style.setProperty('--track-size', this.trackSize + 'px');

    this.updateValue();
  }

  updateValue() {
    const min = Number(this.min);
    const max = Number(this.max);
    const value = Number(this.value);
    const percent = max > min ? (100 * (value - min)) / (max - min) : 0;
    const thumbOffset = calculateThumbOffset(percent, this.thumbSize);

    this.style.setProperty('--thumb-offset', thumbOffset + 'px');
    this.style.setProperty('--percentage', percent + '%');
  }

  onInputChange() {
    const options = {
      bubbles: true,
      composed: true,
      detail: { value: this.value },
    };
    this.dispatchEvent(new CustomEvent('input-change', options));
  }

  handleInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.value = Number(input.value);
    this.updateValue();
    this._inputHandler();
  }

  updated(changedProperties: Map<string, unknown>) {
    if (
      changedProperties.has('min') ||
      changedProperties.has('max') ||
      changedProperties.has('step')
    ) {
      this.updateValue();
    }
  }

  dashTemplate() {
    return Array.from({ length: this.dashCount + 1 }, (_, index) => {
      const position = index * 5;
      return html`
        <div class="dash" style="top:1px;left:${position}%"></div>
        <div class="dash" style="bottom:1px;left:${position}%"></div>
      `;
    });
  }

  hintTemplate() {
    if (!this.hint) return '';
    return html`
      <uigc-popper class="hint" text=${this.hint}>
        <uigc-icon-info></uigc-icon-info>
      </uigc-popper>
    `;
  }

  render() {
    return html`
      <div class="slider-root">
        <div class="top">
          <p class="label">${this.label}</p>
          <p class="value">
            ${this.value}
            <slot class="value" name="value">${this.unit}</slot>
            ${this.hintTemplate()}
          </p>
        </div>
        <div class="slider">
          <input
            type="range"
            min=${this.min}
            max=${this.max}
            step=${this.step}
            value=${this.value}
            .disabled=${this.disabled}
            @input=${this.handleInput} />
          <div class="progress"></div>
          <div class="thumb"></div>
          ${this.dashTemplate()}
        </div>
        <div class="bottom">
          <p>${this.min} ${this.unit}</p>
          <p>${this.max} ${this.unit}</p>
        </div>
      </div>
    `;
  }
}

function linearScale(input: [number, number], output: [number, number]) {
  return (value: number) => {
    if (input[0] === input[1] || output[0] === output[1]) return output[0];
    const ratio = (output[1] - output[0]) / (input[1] - input[0]);
    return output[0] + ratio * (value - input[0]);
  };
}

function calculateThumbOffset(percent: number, thumbSize: number) {
  const halfWidth = thumbSize / 2;
  const offset = linearScale([0, 50], [0, halfWidth])(percent);
  return halfWidth - offset;
}
