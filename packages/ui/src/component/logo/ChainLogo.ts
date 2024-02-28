import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { choose } from 'lit/directives/choose.js';

import { BaseLogo } from './BaseLogo';
import {
  acala,
  basilisk,
  bifrost,
  centrifuge,
  hydradx,
  karura,
  moonbeam,
  phala,
  polkadot,
  interlay,
  zeitgeist,
  assetHub,
  assetHubKusama,
  subsocial,
} from './chains';
import {
  astar,
  crust,
  kusama,
  nodle,
  robonomics,
  tinkernet,
  unique,
} from './assets';

@customElement('uigc-logo-chain')
export class ChainLogo extends BaseLogo {
  @property({ type: String }) chain = null;

  render() {
    return html`
      ${choose(
        this.chain,
        [
          ['acala', () => acala],
          ['astar', () => astar],
          ['assethub', () => assetHub],
          ['assethub-kusama', () => assetHub],
          ['basilisk', () => basilisk],
          ['bifrost', () => bifrost],
          ['centrifuge', () => centrifuge],
          ['crust', () => crust],
          ['hydradx', () => hydradx],
          ['interlay', () => interlay],
          ['karura', () => karura],
          ['kusama', () => kusama],
          ['moonbeam', () => moonbeam],
          ['nodle', () => nodle],
          ['phala', () => phala],
          ['polkadot', () => polkadot],
          ['robonomics', () => robonomics],
          ['statemine', () => assetHubKusama],
          ['statemint', () => assetHub],
          ['subsocial', () => subsocial],
          ['tinkernet', () => tinkernet],
          ['unique', () => unique],
          ['zeitgeist', () => zeitgeist],
        ],
        () =>
          html`
            <slot name="placeholder"></slot>
          `,
      )}
    `;
  }
}
