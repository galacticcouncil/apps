import { Router } from '@vaadin/router';

import './root';
import './screen/trade';
import './screen/dca';
import './screen/yield';
import './screen/bonds';
import './screen/xcm';
import './screen/transfers';

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
        path: '/trade/swap',
        component: 'gc-trade-screen',
      },
      {
        path: '/trade/dca',
        component: 'gc-dca-screen',
      },
      {
        path: '/trade/yield-dca',
        component: 'gc-yield-screen',
      },
      {
        path: '/trade/bonds',
        component: 'gc-bonds-screen',
      },
      {
        path: '/cross-chain',
        component: 'gc-xcm-screen',
      },
      {
        path: '/transfers',
        component: 'gc-transfers-screen',
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
