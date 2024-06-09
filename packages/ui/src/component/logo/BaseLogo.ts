import { LitElement } from 'lit';

import styles from './BaseLogo.css';

export class BaseLogo extends LitElement {
  static styles = styles;

  normalizeKey(key: string): string {
    if (key) {
      return key.toLowerCase();
    }
    return null;
  }
}
