import { css } from 'lit';

export const webkitStyles = css`
  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  ::-webkit-scrollbar-track {
    background: var(--lightestgrey);
  }

  ::-webkit-scrollbar-thumb {
    background: transparent url(assets/img/scrollbar.svg) no-repeat;
    background-position: bottom;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;
