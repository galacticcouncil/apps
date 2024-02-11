import { TemplateResult } from 'lit';

export function getRenderString(template: TemplateResult): string {
  const { strings, values } = template;
  const v = [...values, ''];

  return strings.reduce((previous, current, index) => {
    if (v[index] != null) {
      return previous + current + v[index];
    } else {
      return previous;
    }
  }, '');
}
