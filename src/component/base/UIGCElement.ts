import { LitElement, CSSResultGroup } from 'lit';

import { createStyle, hasStyle } from '../utils/styles';

import { baseStyles } from '../styles/base.css';
import { themeStyles } from '../styles/theme.css';
import { webkitStyles } from '../styles/webkit.css';
import { fontStyles, fontFace } from '../styles/font.css';

export class UIGCElement extends LitElement {
  static styles = [baseStyles, themeStyles, fontStyles] as CSSResultGroup;

  createFontFaceStylesheet() {
    if (!hasStyle('uigc-font-face', '')) {
      createStyle(fontFace, 'uigc-font-face', '');
    }
  }

  createWebkitStylesheet() {
    if (!hasStyle('uigc-webkit', '')) {
      createStyle(webkitStyles, 'uigc-webkit', '');
    }
  }

  override async firstUpdated() {
    this.createFontFaceStylesheet();
    this.createWebkitStylesheet();
  }
}
