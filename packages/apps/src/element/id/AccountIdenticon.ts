import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

import { generateAvatarURL } from '@cfx-kit/wallet-avatar';
import { addr } from '@galacticcouncil/xcm-core';
import { u8aToHex } from '@polkadot/util';
import { decodeAddress } from '@polkadot/util-crypto';
import { toSvg } from 'jdenticon';

@customElement('gc-account-identicon')
export class AccountIdenticon extends LitElement {
  @property({ type: String }) address: string = null;
  @property({ type: Number }) ss58prefix: number = null;

  static styles = [
    css`
      .avatar {
        border-radius: 50%;
      }
    `,
  ];

  render() {
    const isH160Addr = addr.isH160(this.address);
    if (isH160Addr) {
      const avatarUrl = generateAvatarURL(this.address);
      return html`
        <img width="32" height="32" class="avatar" src="${avatarUrl}" />
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
