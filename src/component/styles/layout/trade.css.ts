import { css } from 'lit';

export const tradeLayoutStyles = css`
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

  uigc-paper.main {
    display: none;
    grid-area: main;
    position: relative;
    overflow: hidden;
  }

  uigc-paper.chart {
    display: none;
    grid-area: main;
    position: relative;
  }

  uigc-icon-button.chart-btn {
    display: none;
  }

  :host([chart]) uigc-icon-button.chart-btn {
    display: block;
    margin-right: 12px;
  }

  .tab.active {
    display: block;
  }

  .tab:not(#default-screen) {
    height: 616px;
  }

  @media (max-width: 480px) {
    .layout-root {
      grid-auto-columns: 1fr;
      height: 100%;
    }

    uigc-paper {
      box-shadow: none;
    }

    uigc-paper.main {
      overflow-y: auto;
    }

    uigc-paper:not(#default-screen) {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100vh !important;
      z-index: 10;
      overflow: auto;
    }
  }

  @media (min-width: 480px) {
    uigc-paper {
      border-radius: var(--uigc-app-border-radius);
    }
  }

  @media (min-width: 1024px) {
    :host([chart]) {
      max-width: 1170px;
    }

    :host([chart]) > .layout-root {
      display: grid;
      padding: 0 20px 0 20px;
      grid-template-areas:
        'chart main'
        'list main';
      grid-template-columns: 1fr minmax(414px, 480px);
      grid-column-gap: 20px;
    }

    :host([chart]) uigc-paper.chart {
      display: block;
      grid-area: chart;
      background: transparent;
      box-shadow: none;
      height: 456px !important;
    }

    :host([chart]) uigc-paper.chart .header {
      display: none;
    }

    :host([chart]) uigc-icon-button.chart-btn {
      display: none;
    }
  }
`;
