import * as i18n from 'i18next';
import enLocales from './en/translations.json';

i18n.init({
  lng: 'en',
  debug: true,
  resources: {
    en: {
      translation: enLocales,
    },
  },
});

export default i18n;
