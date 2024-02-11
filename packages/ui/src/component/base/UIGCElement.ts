import { LitElement, CSSResultGroup } from 'lit';

import { baseStyles, baseProperties } from '../styles/base.css';
import { fontStyles, fontFace } from '../styles/font.css';
import {
  paletteProperties,
  bsxThemeProperties,
  hdxThemeProperties,
} from '../styles/theme.css';

import { createStyle, hasStyle } from '../utils/styles';

export class UIGCElement extends LitElement {
  static styles = [baseStyles, fontStyles] as CSSResultGroup;

  createFontFaceStylesheet() {
    if (!hasStyle('uigc-font-face', '')) {
      createStyle(fontFace, 'uigc-font-face', '');
    }
  }

  createBaseStylesheet() {
    if (!hasStyle('uigc-base', '')) {
      createStyle(baseProperties, 'uigc-base', '');
    }
  }

  createPaletteStylesheet() {
    if (!hasStyle('uigc-palette', '')) {
      createStyle(paletteProperties, 'uigc-palette', '');
    }
  }

  createBsxThemeStylesheet() {
    if (!hasStyle('uigc-bsx-theme', '')) {
      createStyle(bsxThemeProperties, 'uigc-bsx-theme', '');
    }
  }

  createHdxThemeStylesheet() {
    if (!hasStyle('uigc-hdx-theme', '')) {
      createStyle(hdxThemeProperties, 'uigc-hdx-theme', '');
    }
  }

  override async firstUpdated() {
    this.createBaseStylesheet();
    this.createPaletteStylesheet();
    this.createFontFaceStylesheet();
    this.createBsxThemeStylesheet();
    this.createHdxThemeStylesheet();
  }

  fireEvent<T>(name: string, data?: T, cancelable = false, bubbles = true) {
    const normalEvent = new CustomEvent<T>(name, {
      detail: data,
      composed: false,
      bubbles,
      cancelable,
    });
    return this.dispatchEvent(normalEvent);
  }
}
