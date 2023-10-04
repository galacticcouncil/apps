import { css } from 'lit';

export const basicLayoutStyles = css`
  :host {
    display: block;
    height: 100%;
    margin-left: auto;
    margin-right: auto;
    position: relative;
  }

  .layout-root {
    display: grid;
    grid-template-areas: 'main';
  }

  uigc-paper {
    display: none;
    grid-area: main;
    position: relative;
    overflow: hidden;
  }

  .tab.active {
    display: block;
  }

  @media (max-width: 480px) {
    .layout-root {
      grid-auto-columns: 1fr;
      height: 100%;
    }

    uigc-paper {
      box-shadow: none;
      overflow-y: auto;
      height: 100% !important;
    }

    uigc-paper:not(#default-tab) {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100vh !important;
      z-index: 1200;
    }
  }

  @media (min-width: 480px) {
    uigc-paper {
      border-radius: var(--uigc-app-border-radius);
    }
  }
`;
