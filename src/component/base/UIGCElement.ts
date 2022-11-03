import { LitElement, CSSResultGroup } from 'lit';

import { createStyle, hasStyle } from '../utils/styles';

import { baseStyles } from '../styles/base.css';
import { themeStyles } from '../styles/theme.css';
import { fontStyles, fontFace } from '../styles/font.css';

export class UIGCElement extends LitElement {
  static styles = [baseStyles, themeStyles, fontStyles] as CSSResultGroup;

  override async firstUpdated() {
    if (!hasStyle('uigc-font-face', '')) {
      createStyle(fontFace, 'uigc-font-face', '');
    }
  }
}
