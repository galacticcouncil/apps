import { Router } from '@vaadin/router';
import { createApi } from './client/api';

import { locationCursor } from './db';

/* Screens */
import './screen/trade';
import './screen/not-found';

import './app';

const routes = [
  {
    path: '/',
    component: 'app-root',
    children: [
      {
        path: '',
        component: 'app-trade',
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
//createApi('wss://rpc01.hydration.dev', () => {});

//createApi('wss://rococo-basilisk-rpc.hydration.dev', () => {});

createApi('wss://rpc.basilisk.cloud', () => {});

window.addEventListener('vaadin-router-location-changed', (e) => {
  locationCursor.reset(e.detail.location);
});
