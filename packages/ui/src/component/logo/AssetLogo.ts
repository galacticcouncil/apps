import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { choose } from 'lit/directives/choose.js';

import { BaseLogo } from './BaseLogo';
import {
  acala,
  apecoin,
  astar,
  basilisk,
  bifrost,
  bitcoin,
  centrifuge,
  crust,
  dai,
  ded,
  dota,
  hydraDX,
  ibtc,
  integritee,
  interlay,
  karura,
  kilt,
  kusama,
  lrna,
  moonbeam,
  nodle,
  pen,
  phala,
  pink,
  polkadot,
  robonomics,
  stink,
  subsocial,
  tinkernet,
  unique,
  usdc,
  usdt,
  voucherDOT,
  voucherKSM,
  wbtc,
  weth,
  zeitgeist,
} from './assets';

@customElement('uigc-logo-asset')
export class AssetLogo extends BaseLogo {
  @property({ type: String }) asset = null;

  render() {
    return html`
      ${choose(
        this.asset && this.asset.toUpperCase(),
        [
          ['AUSD', () => acala],
          ['ACA', () => acala],
          ['APE', () => apecoin],
          ['ASTR', () => astar],
          ['BNC', () => bifrost],
          ['BSX', () => basilisk],
          ['BTC', () => bitcoin],
          ['CFG', () => centrifuge],
          ['CRU', () => crust],
          ['DAI', () => dai],
          ['DOT', () => polkadot],
          ['DOTA', () => dota],
          ['DED', () => ded],
          ['ETH', () => weth],
          ['GLMR', () => moonbeam],
          ['HDX', () => hydraDX],
          ['IBTC', () => ibtc],
          ['INTR', () => interlay],
          ['KAR', () => karura],
          ['KILT', () => kilt],
          ['KSM', () => kusama],
          ['LRNA', () => lrna],
          ['NODL', () => nodle],
          ['PEN', () => pen],
          ['PHA', () => phala],
          ['PINK', () => pink],
          ['TEER', () => integritee],
          ['TNKR', () => tinkernet],
          ['STINK', () => stink],
          ['SUB', () => subsocial],
          ['UNQ', () => unique],
          ['USDC', () => usdc],
          ['USDCET', () => usdc],
          ['USDT', () => usdt],
          ['VDOT', () => voucherDOT],
          ['VKSM', () => voucherKSM],
          ['ZTG', () => zeitgeist],
          ['WBTC', () => wbtc],
          ['WETH', () => weth],
          ['WUSDT', () => usdt],
          ['XRT', () => robonomics],
        ],
        () =>
          html`
            <slot name="placeholder"></slot>
          `,
      )}
    `;
  }
}
