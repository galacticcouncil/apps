import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { choose } from 'lit/directives/choose.js';

import { BaseLogo } from './BaseLogo';
import {
  ausd,
  acala,
  apecoin,
  astar,
  basilisk,
  bifrost,
  bitcoin,
  bndt,
  centrifuge,
  crust,
  dai,
  ded,
  dota,
  game,
  hydraDX,
  ibtc,
  integritee,
  interlay,
  karura,
  kilt,
  kusama,
  ldot,
  lrna,
  moonbeam,
  myth,
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
  eth,
  wud,
  zeitgeist,
  wifd,
  bork,
} from './assets';

@customElement('uigc-logo-asset')
export class AssetLogo extends BaseLogo {
  @property({ type: String }) asset = null;

  render() {
    return html`
      ${choose(
        this.asset && this.asset.toUpperCase(),
        [
          ['AUSD', () => ausd],
          ['ACA', () => acala],
          ['APE', () => apecoin],
          ['ASTR', () => astar],
          ['BORK', () => bork],
          ['BNC', () => bifrost],
          ['BNDT', () => bndt],
          ['BSX', () => basilisk],
          ['BTC', () => bitcoin],
          ['CFG', () => centrifuge],
          ['CRU', () => crust],
          ['DAI', () => dai],
          ['DOT', () => polkadot],
          ['DOTA', () => dota],
          ['DED', () => ded],
          ['ETH', () => eth],
          ['GAME', () => game],
          ['GLMR', () => moonbeam],
          ['HDX', () => hydraDX],
          ['IBTC', () => ibtc],
          ['INTR', () => interlay],
          ['KAR', () => karura],
          ['KILT', () => kilt],
          ['KSM', () => kusama],
          ['LDOT', () => ldot],
          ['LRNA', () => lrna],
          ['MYTH', () => myth],
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
          ['WETH', () => eth],
          ['WIFD', () => wifd],
          ['WUD', () => wud],
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
