import { html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';

import * as i18n from 'i18next';

import { BaseApp } from 'app/BaseApp';
import { Account } from 'db';
import { convertToH160 } from 'utils/evm';

import { WormholeApi } from './api';
import { Transfer } from './types';

import '@galacticcouncil/ui';
import './TransfersDatagrid';
import { Precompile } from '@galacticcouncil/xcm-core';

import { Buffer } from 'buffer';

@customElement('gc-transfers')
export class Transfers extends BaseApp {
  private disconnectSubscribeNewHeads: () => void = null;

  private wormholeApi: WormholeApi = null;

  @state() transfers = [];

  @state() width: number = window.innerWidth;

  static styles = [
    css`
      @media (min-width: 1024px) {
        :host {
          min-height: 350px;
        }
      }

      .orders {
        background: var(--uigc-app-background-color);
        overflow: hidden;
        position: relative;
        display: block;
      }

      @media (min-width: 480px) {
        .orders {
          border-radius: var(--uigc-app-border-radius);
        }

        .orders:before {
          content: '';
          border-radius: var(--uigc-app-border-radius);
          position: absolute;
          inset: 0px;

          padding: 1px;

          background: linear-gradient(
            180deg,
            rgba(152, 176, 214, 0.27) 0%,
            rgba(163, 177, 199, 0.15) 66.67%,
            rgba(158, 167, 180, 0.2) 100%
          );

          -webkit-mask: var(--uigc-paper-mask);
          -webkit-mask-composite: xor;
          mask: var(--uigc-paper-mask);
          mask-composite: exclude;
          pointer-events: none;
        }
      }

      .empty {
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 150px;
        justify-content: center;
      }

      .empty span {
        text-align: center;
        font-family: 'ChakraPetch';
        font-size: 16px;
        font-style: normal;
        font-weight: 400;
        line-height: 120%;
        color: #5d6175;
      }

      .empty span:first-of-type {
        padding-top: 16px;
      }
    `,
  ];

  private async getOperations(account: string): Promise<Transfer[]> {
    const a = Buffer.from(
      'AAEBAgDJHwEARVRIACb1wjcOVj6fTdpDXwOmPXwQnY0EAAAAAAAAAAA=',
      'hex',
    );
    console.log(a.toJSON());

    const from = await this.wormholeApi.getOperations(account);
    return from.filter((t) => {
      const { fromAddress, toAddress, toChain } =
        t.content.standarizedProperties;
      return (
        fromAddress === account &&
        toAddress === Precompile.Bridge &&
        toChain === 16
      );
    });
  }

  private resetTransfers() {
    this.transfers = [];
  }

  private async syncTransfers() {
    console.log('sync');

    if (!this.hasAccount()) {
      return;
    }

    const account = this.account.state;
    const addr = convertToH160(account.address);
    const operations = await this.getOperations(addr);
    console.log(operations);
    this.transfers = operations;
  }

  private async init() {
    this.wormholeApi = new WormholeApi('https://api.wormholescan.io');
  }

  protected async onAccountChange(prev: Account, curr: Account): Promise<void> {
    if (curr) {
      this.syncTransfers();
    } else {
      this.resetTransfers();
    }
  }

  onResize(_evt: UIEvent) {
    this.width = window.innerWidth;
  }

  override connectedCallback() {
    super.connectedCallback();
    window.addEventListener('resize', (evt) => this.onResize(evt));
    this.init();
    this.syncTransfers();
  }

  override disconnectedCallback() {
    window.removeEventListener('resize', this.onResize);
    this.disconnectSubscribeNewHeads?.();
    super.disconnectedCallback();
  }

  emptyTemplate() {
    return html`
      <div slot="empty" class="empty">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="87"
          height="34"
          viewBox="0 0 87 34"
          fill="none">
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M38.352 24.9574H47.6606L59.372 31.8635H38.352V24.9574ZM42.254 0.03125H35.3478L35.3437 0.038311H30.2382C29.039 0.038311 28.1366 0.936812 28.1366 2.13991V27.0659H5.91363C5.61285 27.0659 5.31207 26.7651 5.31207 26.4644C5.31207 26.1636 5.61285 25.8628 5.91363 25.8628H26.9336V24.9604H2.30863C1.10937 24.9604 0.207031 25.8589 0.207031 27.062V31.8668C0.207031 33.066 1.10553 33.9684 2.30863 33.9684H37.1446V8.44135H45.254C45.8556 8.44135 46.4571 7.83981 46.4571 7.23825V4.23435C46.4571 1.83205 44.6563 0.03125 42.254 0.03125ZM38.1279 4.34397C38.9563 4.34397 39.5878 3.31675 39.5878 2.48833C39.4145 1.84512 38.7505 1.29814 37.732 1.17677C36.7136 1.05541 36.2969 1.75887 36.2969 2.58729C36.2969 3.41572 37.2995 4.34397 38.1279 4.34397Z"
            fill="#676C80" />
          <path
            d="M64.9119 16.5534C64.9119 15.8294 65.4993 15.242 66.2244 15.2409H66.4093H66.4082C66.8545 13.1365 68.3299 11.3973 70.3346 10.6153L69.7484 8.33812C69.7385 8.30531 69.7079 8.28234 69.674 8.28125H66.2658C65.813 8.28016 65.4466 7.91157 65.4477 7.45875V6.47875C65.4466 6.02593 65.813 5.65734 66.2658 5.65625H69.674C70.9077 5.65625 71.984 6.49188 72.2903 7.68625L72.9378 10.1986C74.3443 10.2664 75.6874 10.798 76.7592 11.7102C77.8311 12.6223 78.5716 13.8638 78.8636 15.2407H79.3623C80.0874 15.2407 80.6748 15.8291 80.6748 16.5532C80.6748 17.2783 80.0874 17.8657 79.3623 17.8657H79.0954L77.6976 31.2892C77.6812 31.4631 77.562 31.6085 77.3957 31.661C75.8448 32.1335 74.2303 32.3643 72.6094 32.3435C70.9885 32.3632 69.374 32.1335 67.8231 31.661C67.659 31.6074 67.542 31.4609 67.5256 31.2892L66.1256 17.8556C65.4431 17.8064 64.9137 17.2387 64.9116 16.553L64.9119 16.5534ZM71.446 7.90505C71.2382 7.09677 70.5087 6.53131 69.6742 6.53131H66.3228V7.40631H69.6742C70.1095 7.40631 70.489 7.70163 70.5973 8.12381L71.1759 10.3605C71.4602 10.2905 71.7479 10.2413 72.0399 10.2118L71.446 7.90505ZM75.8571 12.105C75.7729 12.1324 75.6898 12.1597 75.6034 12.1849C75.5881 12.1893 75.5728 12.1915 75.5575 12.1915C75.4765 12.1915 75.4087 12.1335 75.3956 12.0536C75.3825 11.9749 75.4295 11.8972 75.5061 11.8732C74.6409 11.3394 73.6445 11.0583 72.6285 11.0594C71.6125 11.0606 70.616 11.346 69.7529 11.8819C69.8295 11.906 69.8765 11.9837 69.8634 12.0624C69.8502 12.1423 69.7824 12.2002 69.7015 12.2002C69.6862 12.2002 69.672 12.198 69.6566 12.1937C69.5702 12.1696 69.4871 12.1412 69.4018 12.1149H69.4029C68.3573 12.8773 67.6146 13.9841 67.3051 15.2408H77.9669C77.6563 13.9786 76.9093 12.8674 75.8571 12.1051L75.8571 12.105ZM66.2246 16.9908H79.3627C79.6045 16.9908 79.8002 16.795 79.8002 16.5533C79.8002 16.3116 79.6045 16.1158 79.3627 16.1158H66.2246C65.9829 16.1158 65.7871 16.3116 65.7871 16.5533C65.7871 16.795 65.9829 16.9908 66.2246 16.9908ZM70.8751 12.2932C70.8696 12.337 70.8806 12.3807 70.9068 12.4157C70.9331 12.4496 70.9714 12.4726 71.0151 12.4791C71.3159 12.5218 71.6254 12.5524 71.935 12.571H71.9448C72.0334 12.571 72.1056 12.4999 72.1078 12.4113C72.1111 12.3227 72.0421 12.2484 71.9536 12.2429C71.6528 12.2254 71.352 12.1959 71.0611 12.1543C71.0173 12.1466 70.9736 12.1576 70.9386 12.1838C70.9036 12.2101 70.8806 12.2505 70.8751 12.2932L70.8751 12.2932ZM73.1479 12.4146C73.1534 12.5021 73.2245 12.5688 73.312 12.5688H73.3218C73.6325 12.5502 73.942 12.5185 74.2417 12.4748C74.2854 12.4682 74.3237 12.4452 74.35 12.4102C74.3762 12.3752 74.3872 12.3315 74.3806 12.2888C74.3751 12.2451 74.3522 12.2057 74.3172 12.1795C74.2822 12.1532 74.2384 12.1434 74.1947 12.1499C73.9037 12.1926 73.6029 12.2232 73.3022 12.2418C73.2584 12.244 73.2179 12.2637 73.1895 12.2965C73.16 12.3293 73.1457 12.372 73.1479 12.4146H73.1479Z"
            fill="#444559" />
        </svg>
        <span>${i18n.t('orders.noActivity')}</span>
      </div>
    `;
  }

  render() {
    const filteredData = this.transfers;
    return html`
      <gc-transfers-grid class="orders" .defaultData=${filteredData}>
        <slot slot="header" name="header"></slot>
        ${this.emptyTemplate()}
      </gc-transfers-grid>
    `;
  }
}
