import { Router } from '@vaadin/router';
import * as i18n from 'i18next';
import enLocales from './locales/en/translations.json';

import './root';
import './screen/trade';
import './screen/xcm';

const routes = [
  {
    path: '/',
    component: 'gc-root',
    children: [
      {
        path: '',
        component: 'gc-trade-screen',
      },
      {
        path: '/trade',
        component: 'gc-trade-screen',
      },
      {
        path: '/xcm',
        component: 'gc-xcm-screen',
      },
    ],
  },
  {
    path: '(.*)',
    component: 'not-found',
  },
];

i18n.init({
  lng: 'en',
  debug: true,
  resources: {
    en: {
      translation: enLocales
    }
  }
});

const outlet = document.getElementById('app');
const router = new Router(outlet);
router.setRoutes(routes);
