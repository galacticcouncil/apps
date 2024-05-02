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
  kilt,
  zeitgeist,
  assetHub,
  assetHubKusama,
  subsocial,
} from './chains';
import {
  astar,
  crust,
  eth,
  integritee,
  kusama,
  nodle,
  pen,
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
          ['basilisk', () => basilisk],
          ['bifrost', () => bifrost],
          ['centrifuge', () => centrifuge],
          ['crust', () => crust],
          ['ethereum', () => eth],
          ['hydradx', () => hydradx],
          ['integritee', () => integritee],
          ['interlay', () => interlay],
          ['karura', () => karura],
          ['kilt_chain', () => kilt],
          ['kusama', () => kusama],
          ['kusama-assethub', () => assetHub],
          ['moonbeam', () => moonbeam],
          ['nodle', () => nodle],
          ['pendulum', () => pen],
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
