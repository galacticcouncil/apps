import { PostProcessorModule, use } from 'i18next';

const HighlightProcessor = (str: string) => {
  return str
    .replaceAll('<1>', '<span class="highlight">')
    .replaceAll('</1>', '</span>');
};

export const highlightProcessor: PostProcessorModule = {
  type: 'postProcessor',
  name: 'highlight',
  process: function (value, _key, _options, _translator) {
    return HighlightProcessor(value);
  },
};

export const i18n = use(highlightProcessor);
