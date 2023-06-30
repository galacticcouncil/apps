import { css } from 'lit';

export const chartStyles = css`
  .summary {
    display: grid;
    row-gap: 10px;
    grid-template-areas:
      'pair range'
      'price price';
    color: #fff;
    padding: 0 14px;
    align-items: center;
  }

  .summary > div:nth-child(1) {
    grid-area: pair;
  }

  .summary > div:nth-child(2) {
    grid-area: range;
    text-align: right;
  }

  .summary > div:nth-child(3) {
    grid-area: price;
    text-align: left;
    height: 40px;
  }

  .summary > div:nth-child(4) {
    grid-area: price;
    text-align: left;
    height: 40px;
  }

  .chart {
    height: 100%;
    position: relative;
    padding: 0 14px;
    display: flex;
    flex-direction: column;
    margin-top: 8px;
  }

  @media (max-width: 480px) {
    .summary {
      padding: 20px 14px 0;
    }
  }

  @media (min-width: 768px) {
    .summary {
      padding: 0 28px;
    }

    .chart {
      padding: 0 28px;
    }
  }

  @media (min-width: 1024px) {
    .summary {
      padding: 28px 0 0;
    }

    .chart {
      padding: 0;
    }
  }

  .summary .pair {
    font-family: 'ChakraPetch';
    font-style: normal;
    font-weight: 700;
    font-size: 18px;
    line-height: 100%;
  }

  .summary .desc {
    font-family: 'ChakraPetch';
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 100%;
    color: rgba(255, 255, 255, 0.6);
  }

  .tooltip {
    position: relative;
    box-sizing: border-box;
    font-size: 12px;
    color: #fff;
    text-align: right;
    pointer-events: none;
  }

  .tooltip .price {
    font-family: 'ChakraPetch';
    font-style: normal;
    font-weight: 600;
    font-size: 18px;
    line-height: 100%;
    color: #85d1ff;
  }

  .tooltip .usd {
    font-family: 'ChakraPetch';
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 100%;
    color: rgba(255, 255, 255, 0.4);
  }

  .tooltip-floating {
    width: 96px;
    padding: 5px 0;
    //background-color: #000524;
    position: absolute;
    top: 12px;
    left: 12px;
    display: none;
    flex-direction: column;
    box-sizing: border-box;
    z-index: 5;
    pointer-events: none;
    border-radius: 2px;
    font-family: 'ChakraPetch';
    font-weight: 700;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.4);
    text-align: center;
    line-height: 120%;
  }

  .tooltip-floating .time {
    font-size: 18px;
    font-weight: 600;
    color: #ecedef;
    line-height: 130%;
  }

  @media (min-width: 1024px) {
    .summary .pair {
      font-size: 19px;
    }

    .tooltip .price {
      font-size: 24px;
    }
  }

  .skeleton {
    display: flex;
    flex-direction: column;
  }

  .usd-skeleton {
    margin-top: 2px;
  }

  .backdrop {
    display: block;
    position: absolute;
    width: 100%;
    height: 100%;
  }

  .loading .backdrop {
    display: block;
    z-index: 2;
  }

  .loading .tv-lightweight-charts {
    filter: blur(8px);
  }

  uigc-busy-indicator {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 55px;
    height: 16px;
    margin-top: -8px;
    margin-left: -22.5px;
  }

  gc-chart-empty,
  gc-chart-error,
  uigc-busy-indicator {
    display: none;
  }

  #chart {
    position: relative;
  }

  .price-line {
    display: none;
    position: absolute;
    left: 0;
    color: red;
    border-top: 1px dashed #fff;
    width: 100%;
    z-index: 2;
  }

  .price-tag {
    display: none;
    position: absolute;
    left: 0;
    font-family: 'SatoshiVariable';
    font-style: normal;
    font-weight: 500;
    font-size: 12px;
    color: #fff;
    z-index: 3;
    padding: 0 4px;
  }

  .price-tag:hover {
    background: #fff;
    color: #000524;
    cursor: pointer;
  }

  .price-tag:hover + .price-line {
    display: block;
  }

  .show {
    display: block;
  }
`;
