import { LitElement, html, css, PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { themeStyles } from './styles/theme.css';
import { baseStyles } from './styles/base.css';

import './IconButton';

@customElement('ui-toast')
export class Toast extends LitElement {
  @property({ type: Boolean, reflect: true }) open = false;

  /**
   * Timeout represents the number of milliseconds from when the Toast was placed
   * on the page before it will automatically dismiss itself.
   *
   * Accessibility concerns require that a Toast is available for at least 6000ms
   * before being dismissed. It is suggested that messages longer than 120 words
   * should receive another 1000ms in their timeout for each additional 120 words
   * in the message. E.G. 240 words = 7000ms, 360 words = 8000ms, etc.
   */
  @property({ type: Number }) timeout = 6000;

  static styles = [
    baseStyles,
    themeStyles,
    css`
      :host {
        position: fixed;
        z-index: 1400;
        bottom: 8px;
        right: 8px;
        left: 8px;
        height: 60px;
        display: flex;
        flex-direction: row;
        align-items: center;
        box-sizing: border-box;
        border-radius: 14px;
        background: var(--hex-background-gray-1000);
        color: white;
        min-width: 130px;
      }

      @media (min-width: 768px) {
        :host {
          bottom: 20px;
          right: 20px;
          left: auto;
        }
      }

      :host(:not([open])) {
        display: none;
      }

      slot[name='alert']::slotted(*) {
        padding: 0;
      }

      ::slotted(*) {
        padding: 0 14px;
      }

      .close {
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        top: -8px;
        right: -8px;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: var(--hex-background-gray-800);
      }

      .close:hover {
        background: rgba(var(--rgb-background-gray-800), 0.5);
        cursor: pointer;
      }
    `,
  ];

  private countdownStart = 0;
  private nextCount = -1;

  private doCountdown = (time: number): void => {
    if (!this.countdownStart) {
      this.countdownStart = performance.now();
    }
    if (time - this.countdownStart > (this.timeout as number)) {
      this.shouldClose();
      this.countdownStart = 0;
    } else {
      this.countdown();
    }
  };

  private countdown(): void {
    cancelAnimationFrame(this.nextCount);
    this.nextCount = requestAnimationFrame(this.doCountdown);
  }

  private holdCountdown(): void {
    this.stopCountdown();
    this.addEventListener('focusout', this.resumeCountdown);
  }

  private resumeCountdown(): void {
    this.removeEventListener('focusout', this.holdCountdown);
    this.countdown();
  }

  private startCountdown(): void {
    this.countdown();
    this.addEventListener('focusin', this.holdCountdown);
  }

  private stopCountdown(): void {
    cancelAnimationFrame(this.nextCount);
    this.countdownStart = 0;
  }

  private shouldClose(): void {
    const applyDefault = this.dispatchEvent(
      new CustomEvent('close', {
        composed: true,
        bubbles: true,
        cancelable: true,
      })
    );
    if (applyDefault) {
      this.close();
    }
  }

  public close(): void {
    this.open = false;
  }

  override updated(changes: PropertyValues): void {
    super.updated(changes);
    if (changes.has('open')) {
      if (this.open) {
        if (this.timeout) {
          this.startCountdown();
        }
      } else {
        if (this.timeout) {
          this.stopCountdown();
        }
      }
    }
    if (changes.has('timeout')) {
      if (this.timeout !== null && this.open) {
        this.startCountdown();
      } else {
        this.stopCountdown();
      }
    }
  }

  render() {
    return html`
      <div class="content" role="alert">
        <slot name="alert"></slot>
        <slot></slot>
      </div>
      <div class="action">
        <button
          class="close"
          @click=${(e: Event) => {
            e.stopPropagation();
            this.shouldClose();
          }}
        >
          <img width="7px" src="assets/img/icon/close.svg" alt="close" />
        </button>
      </div>
    `;
  }
}
