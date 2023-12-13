import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

import { generateAvatarURL } from '@cfx-kit/wallet-avatar';
import { u8aToHex } from '@polkadot/util';
import { decodeAddress } from '@polkadot/util-crypto';

import { isEthAddress } from '../../utils/account';

import { toSvg } from 'jdenticon';

@customElement('gc-account-id')
export class AccountId extends LitElement {
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
    const isEthAddr = isEthAddress(this.address);
    if (isEthAddr) {
      const avatarUrl = generateAvatarURL(this.address);
      return html`<img class="avatar" src="${avatarUrl}" />`;
    }
    const decoded = decodeAddress(this.address, false, this.ss58prefix);
    const publicKey = u8aToHex(decoded);
    const svgString = toSvg(publicKey.substring(2), 26);
    return html` ${unsafeHTML(svgString)} `;
  }
}
