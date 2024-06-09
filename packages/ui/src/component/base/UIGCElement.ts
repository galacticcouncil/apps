import { LitElement, CSSResultGroup } from 'lit';

import {
  baseProps,
  baseStyles,
  fontFace,
  fontStyles,
  paletteProps,
  bsxThemeProps,
  hdxThemeProps,
} from '../styles';

import { createStyle, hasStyle } from '../utils/styles';

export class UIGCElement extends LitElement {
  static styles = [baseStyles, fontStyles] as CSSResultGroup;

  createBaseStylesheet() {
    if (!hasStyle('uigc-base', '')) {
      createStyle(baseProps, 'uigc-base', '');
    }
  }

  createPaletteStylesheet() {
    if (!hasStyle('uigc-palette', '')) {
      createStyle(paletteProps, 'uigc-palette', '');
    }
  }

  createFontFaceStylesheet() {
    if (!hasStyle('uigc-font-face', '')) {
      createStyle(fontFace, 'uigc-font-face', '');
    }
  }

  createBsxThemeStylesheet() {
    if (!hasStyle('uigc-bsx-theme', '')) {
      createStyle(bsxThemeProps, 'uigc-bsx-theme', '');
    }
  }

  createHdxThemeStylesheet() {
    if (!hasStyle('uigc-hdx-theme', '')) {
      createStyle(hdxThemeProps, 'uigc-hdx-theme', '');
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
