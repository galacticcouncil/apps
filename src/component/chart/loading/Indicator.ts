import { html, css, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

import { baseStyles } from '../../base.css';

@customElement('uigc-chart-loading')
export class LoadingIndicator extends LitElement {
  static styles = [
    baseStyles,
    css`
      .loading {
        position: fixed;
        float: left;
        top: 50%;
        left: 50%;
        height: 120px;
        padding: 0px;
        width: 160px;
        margin-top: -50px;
        margin-left: -70px;
        border-left: 1px solid transparent;
        border-bottom: 1px solid transparent;
        padding: 10px;
        box-sizing: border-box;
      }

      @keyframes loading {
        0% {
          background-color: #cd0a00;
        }
        30% {
          background-color: #fa8a00;
        }
        50% {
          height: 100px;
          margin-top: 0px;
        }
        80% {
          background-color: #91d700;
        }
        100% {
          background-color: #cd0a00;
        }
      }

      .loading > div {
        height: 10px;
        width: 30px;
        background-color: #fff;
        display: inline-block;
        margin-top: 90px;
        -webkit-animation: loading 2.5s infinite;
        -moz-animation: loading 2.5s infinite;
        -o-animation: loading 2.5s infinite;
        animation: loading 2.5s infinite;
        border-top-left-radius: 2px;
        border-top-right-radius: 2px;
      }

      .loading .loading-1 {
        -webkit-animation-delay: 0.25s;
        animation-delay: 0.25s;
      }

      .loading .loading-2 {
        -webkit-animation-delay: 0.5s;
        animation-delay: 0.5s;
      }

      .loading .loading-3 {
        -webkit-animation-delay: 0.75s;
        animation-delay: 0.75s;
      }

      .loading .loading-4 {
        -webkit-animation-delay: 1s;
        animation-delay: 1s;
      }
    `,
  ];

  render() {
    return html`
      <div class="loading">
        <div class="loading-1"></div>
        <div class="loading-2"></div>
        <div class="loading-3"></div>
        <div class="loading-4"></div>
      </div>
    `;
  }
}
