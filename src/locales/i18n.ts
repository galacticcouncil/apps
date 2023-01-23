import * as i18n from 'i18next';
import enLocales from './en/translations.json';

i18n.init({
  lng: 'en',
  debug: false,
  resources: {
    en: {
      translation: enLocales,
    },
  },
});