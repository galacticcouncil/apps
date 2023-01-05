import { Router } from '@vaadin/router';
import './locales/i18n';

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

const outlet = document.getElementById('app');
const router = new Router(outlet);
router.setRoutes(routes);
