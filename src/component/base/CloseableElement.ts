import { PropertyValues } from 'lit';
import { property } from 'lit-element';
import { UIGCElement } from './UIGCElement';

export class CloseableElement extends UIGCElement {
  @property({ type: Boolean, reflect: true }) open = false;
  @property({ type: String }) id = null;

  /**
   * Timeout represents the number of milliseconds from when the Toast was placed
   * on the page before it will automatically dismiss itself.
   *
   * Accessibility concerns require that a Toast is available for at least 6000ms
   * before being dismissed. It is suggested that messages longer than 120 words
   * should receive another 1000ms in their timeout for each additional 120 words
   * in the message. E.G. 240 words = 7000ms, 360 words = 8000ms, etc.
   */
  @property({ type: Number }) timeout = null;

  protected countdownStart = 0;
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

  protected shouldClose(): void {
    if (this.timeout === 0) {
      return;
    }

    const applyDefault = this.dispatchEvent(
      new CustomEvent('closeable-closed', {
        composed: true,
        bubbles: true,
        cancelable: true,
        detail: { id: this.id },
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
}
