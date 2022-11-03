import { css } from 'lit';

export const fontStyles = css`
  :host {
    font-size: 14px;
    line-height: 1.5;
    font-style: normal;
    font-weight: 400;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-family: 'SatoshiVariable', sans-serif;
  }
`;

export const fontFace = css`
  @font-face {
    font-family: 'SatoshiVariable';
    src: url('assets/font/Satoshi-Variable.ttf') format('truetype');
    font-display: auto;
    font-weight: 100 900;
  }
`;
