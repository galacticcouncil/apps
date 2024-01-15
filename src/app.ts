import { Router } from '@vaadin/router';
import './locales/i18n';

import './root';
import './screen/trade';
import './screen/dca';
import './screen/dcaY';
import './screen/bonds';
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
        path: '/dca',
        component: 'gc-dca-screen',
      },
      {
        path: '/dca-yield',
        component: 'gc-dca-y-screen',
      },
      {
        path: '/bonds',
        component: 'gc-bonds-screen',
      },
      {
        path: '/cross-chain',
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
