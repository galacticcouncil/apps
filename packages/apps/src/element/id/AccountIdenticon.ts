import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

import { generateAvatarURL } from '@cfx-kit/wallet-avatar';
import { addr } from '@galacticcouncil/xcm-core';
import { u8aToHex } from '@polkadot/util';
import { decodeAddress } from '@polkadot/util-crypto';
import { toSvg } from 'jdenticon';

import styles from './AccountIdenticon.css';

const { EvmAddr, SolanaAddr, SuiAddr } = addr;

@customElement('gc-account-identicon')
export class AccountIdenticon extends LitElement {
  @property({ type: String }) address: string = null;
  @property({ type: Number }) ss58prefix: number = null;

  static styles = styles;

  render() {
    const isH160Addr = EvmAddr.isValid(this.address);
    if (isH160Addr) {
      const avatarUrl = generateAvatarURL(this.address);
      return html`
        <img width="32" height="32" class="avatar" src="${avatarUrl}" />
      `;
    }

    const isSolanaAddr = SolanaAddr.isValid(this.address);
    if (isSolanaAddr) {
      const svgString = toSvg(this.address.substring(2), 26);
      return html`
        ${unsafeHTML(svgString)}
      `;
    }

    const isSuiAddr = SuiAddr.isValid(this.address);
    if (isSuiAddr) {
      const svgString = toSvg(this.address.substring(2), 26);
      return html`
        ${unsafeHTML(svgString)}
      `;
    }

    const decoded = decodeAddress(this.address);
    const publicKey = u8aToHex(decoded);
    const svgString = toSvg(publicKey.substring(2), 26);
    return html`
      ${unsafeHTML(svgString)}
    `;
  }
}
