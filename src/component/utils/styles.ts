import { CSSResult } from 'lit';

/**
 * Creates a <style> tag in the <head> tag
 * @param cssText - CSSResult
 * @param attributes - optional map of attributes to add to the tag
 * @returns {HTMLElement}
 */
export function createStyleInHead(cssText: CSSResult, attributes: Map<string, any>): HTMLStyleElement {
  const style = document.createElement('style');
  Object.entries(attributes).forEach((pair) => style.setAttribute(...pair));
  style.textContent = cssText.cssText;
  document.head.appendChild(style);
  return style;
}

/**
 * Creates a <style> tag in the <head> tag
 * @param cssText - CSSResult
 * @param name - optional attribute name to add to tag
 * @param value - optional attribute value to add to tag
 * @returns {HTMLElement}
 */
export function createStyle(cssText: CSSResult, name: string, value: string): HTMLStyleElement {
  const attributes = new Map<string, any>();
  attributes[name] = value;
  return createStyleInHead(cssText, attributes);
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
