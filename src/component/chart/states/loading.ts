import { html, css, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

import { baseStyles } from '../../base.css';

@customElement('gc-chart-loading')
export class ChartLoading extends LitElement {
  static styles = [
    baseStyles,
    css`
      .loading {
        position: absolute;
        top: 50%;
        left: 50%;
        height: 60px;
        padding: 0px;
        width: 82px;
        margin-top: -50px;
        margin-left: -40px;
        border-left: 1px solid transparent;
        border-bottom: 1px solid transparent;
        padding: 5px;
        box-sizing: border-box;
      }

      @keyframes loading {
        0% {
          background-color: #fc408c;
        }
        30% {
          background-color: #004de2;
        }
        50% {
          height: 50px;
          margin-top: 0px;
        }
        80% {
          background-color: #00c2ff;
        }
        100% {
          background-color: #fc408c;
        }
      }

      .loading > div {
        height: 5px;
        width: 15px;
        background-color: #fff;
        display: inline-block;
        margin-top: 45px;
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
