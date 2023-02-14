import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

import { convertAddressSS58 } from '../../utils/account';
import { u8aToHex } from '@polkadot/util';
import { decodeAddress } from '@polkadot/util-crypto';

import { toSvg } from 'jdenticon';

@customElement('gc-identicon')
export class Identicon extends LitElement {
  @property({ type: String }) address: string = null;
  @property({ type: Number }) ss58prefix: number = null;

  render() {
    const address = convertAddressSS58(this.address, this.ss58prefix);
    const decoded = decodeAddress(address, false, Number(this.ss58prefix));
    const publicKey = u8aToHex(decoded);
    const svgString = toSvg(publicKey.substring(2), 26);
    return html` ${unsafeHTML(svgString)} `;
  }
}
