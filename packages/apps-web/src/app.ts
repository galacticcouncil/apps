import { Router } from '@vaadin/router';

import './root';
import './screen/trade';
import './screen/dca';
import './screen/yield';
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
        path: '/yield',
        component: 'gc-yield-screen',
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
