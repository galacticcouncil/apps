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
  hydraDX,
  ibtc,
  integritee,
  interlay,
  karura,
  kusama,
  lrna,
  moonbeam,
  nodle,
  phala,
  pink,
  polkadot,
  robonomics,
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
          ['DED', () => ded],
          ['ETH', () => weth],
          ['GLMR', () => moonbeam],
          ['HDX', () => hydraDX],
          ['IBTC', () => ibtc],
          ['INTR', () => interlay],
          ['KAR', () => karura],
          ['KSM', () => kusama],
          ['LRNA', () => lrna],
          ['NODL', () => nodle],
          ['PHA', () => phala],
          ['PINK', () => pink],
          ['TEER', () => integritee],
          ['TNKR', () => tinkernet],
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
