import { unsafeCSS, CSSResult } from 'lit';

/**
 * Creates a <style> tag in the <head> tag
 * @param cssText - CSSResult
 * @param attributes - optional map of attributes to add to the tag
 * @returns {HTMLElement}
 */
export function createStyleInHead(
  cssText: CSSResult,
  attributes: Map<string, any>,
): HTMLStyleElement {
  const style = document.createElement('style');
  Object.entries(attributes).forEach((pair) => style.setAttribute(...pair));
  style.textContent = cssText.cssText;
  document.head.appendChild(style);
  return style;
}

/**
 * Creates a <style> tag in the <head> tag
 * @param cssText - CSSResult
 * @returns {HTMLElement}
 */
export function createStyleInShadowElement(
  cssText: CSSResult,
  shadowRoot: ShadowRoot,
): HTMLStyleElement {
  const style = document.createElement('style');
  style.textContent = cssText.cssText;
  shadowRoot.appendChild(style);
  return style;
}

/**
 * Creates a <style> tag in the <head> tag
 * @param cssText - CSSResult
 * @param name - optional attribute name to add to tag
 * @param value - optional attribute value to add to tag
 * @returns {HTMLElement}
 */
export function createStyle(
  cssText: CSSResult,
  name: string,
  value: string,
): HTMLStyleElement {
  const attributes = new Map<string, any>();
  attributes[name] = value;
  return createStyleInHead(unsafeCSS(cssText), attributes);
}

/**
 * Check whether style already exist
 * @param name - style attribute tag name
 * @param value - style attribute tag value
 * @returns true if style present, otherwise false
 */
export function hasStyle(name: string, value: string): boolean {
  return !!document.querySelector(`head>style[${name}="${value}"]`);
}

const getStyleId = (name: string, value: string) => {
  return value ? `${name}|${value}` : name;
};

/**
 * Creates document adoptedStyleSheets with unique id
 * @param cssText - CSSResult
 * @param name - optional attribute name to add to tag
 * @param value - optional attribute value to add to tag
 */
export function createAdaptedStyle(
  cssText: CSSResult,
  name: string,
  value: string,
): void {
  const stylesheet = new CSSStyleSheet();
  stylesheet.replaceSync(cssText.cssText);
  (stylesheet as Record<string, any>)._uigcStyleId = getStyleId(name, value);
  document.adoptedStyleSheets = [...document.adoptedStyleSheets, stylesheet];
}

/**
 * Check whether adoptedStyleSheets already exist
 * @param name - style attribute tag name
 * @param value - style attribute tag value
 * @returns true if stylesheet present, otherwise false
 */
export function hasAdaptedStyle(name: string, value: string): boolean {
  return !!document.adoptedStyleSheets.find(
    (sh) =>
      (sh as Record<string, any>)._uigcStyleId === getStyleId(name, value),
  );
}
