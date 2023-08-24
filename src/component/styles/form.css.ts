import { css } from 'lit';

export const formStyles = css`
  .form-option {
    container-type: inline-size;
    position: relative;
    display: flex;
    padding: 10px 14px 10px 16px;
    align-items: baseline;
    justify-content: space-between;
    border: 1px solid var(--primary-dark-blue-400, #333750);
    border-radius: 4px;
    background: #111320;
    cursor: pointer;
    color: #fff;
  }

  .form-option.disabled {
    cursor: default;
  }

  .form-option.disabled:hover {
    background: none;
  }

  .form-option.active {
    border: 1px solid rgb(156, 221, 255);
    background: rgba(255, 255, 255, 0.05);
  }

  .form-option:hover {
    background: rgba(255, 255, 255, 0.05);
  }

  .form-option > div.left {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 2px;
  }

  .form-option > div.right {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-end;
    gap: 2px;
  }

  .form-switch {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--uigc-divider-color);
  }

  .form-switch > div {
    display: flex;
    flex-direction: column;
    padding: 6px 0;
  }

  .form-option > div span.title,
  .form-switch > div span.title {
    color: var(--uigc-app-font-color__primary);
    font-size: 14px;
    font-weight: 500;
    line-height: 22px;
  }

  .form-switch > div span.desc {
    color: var(--basic-500, #878c9e);
    font-size: 12px;
    font-weight: 400;
    line-height: 130%;
  }

  .form-option > div span.desc {
    color: #ecedef;
    font-size: 12px;
    font-weight: 400;
    line-height: 130%;
  }

  @media (max-width: 480px) {
    .form-option > div span.desc {
      max-width: 120px;
    }
  }

  .info {
    display: none;
    flex-direction: column;
    margin-top: 10px;
    padding: 0 24px;
    box-sizing: border-box;
  }

  .info.show {
    display: flex;
  }

  @media (min-width: 768px) {
    .info {
      padding: 0 28px;
    }
  }

  @media (max-width: 480px) {
    .form-switch,
    .info {
      padding: 0 14px;
    }
  }

  .info .row {
    display: flex;
    align-items: center;
    position: relative;
    gap: 5px;
    padding: 6px 0;
  }

  .info .row:not(:last-child):after {
    background-color: var(--uigc-divider-color);
    bottom: 0;
    content: ' ';
    height: 1px;
    position: absolute;
    width: 100%;
  }

  .info .summary {
    display: none;
    flex-direction: column;
    align-items: flex-start;
    padding-bottom: 10px;
  }

  .info .summary.show {
    animation: scale 0.25s;
    display: flex;
  }

  .info .summary .label {
    font-size: 14px;
    margin-bottom: 10px;
  }

  .info .summary .value {
    text-align: left;
    font-size: 18px;
    text-align: center;
  }

  .info .summary .value.small {
    font-size: 14px;
  }

  .info .summary .message {
    font-size: 14px;
    align-items: flex-start;
    display: flex;
  }

  .info .summary .message > span {
    margin-top: 4px;
    line-height: 100%;
  }

  .info .summary .message > svg {
    margin-right: 5px;
  }

  .info .label {
    font-weight: 500;
    font-size: 12px;
    line-height: 100%;
    text-align: left;
    color: var(--uigc-app-font-color__alternative);
  }

  .info .value {
    font-weight: 500;
    font-size: 12px;
    line-height: 100%;
    text-align: right;
    color: var(--hex-white);
  }

  .info .value + .highlight {
    color: var(--uigc-app-font-color__primary);
  }

  .highlight {
    color: var(--uigc-app-font-color__primary);
  }

  .warning,
  .error {
    display: none;
    flex-direction: row;
    align-items: center;
    line-height: 16px;
    margin: 5px 14px 0;
    padding: 0 14px;
    background: var(--uigc-app-bg-error);
    border-radius: var(--uigc-app-border-radius-2);
  }

  @media (min-width: 768px) {
    .warning,
    .error {
      margin: 5px 28px 0;
    }
  }

  .warning.show,
  .error.show {
    padding: 10px;
    animation: scale 0.25s;
    display: flex;
  }

  .warning span,
  .error span {
    color: var(--hex-white);
    font-weight: 500;
    font-size: 12px;
    line-height: 16px;
  }

  .warning uigc-icon-warning,
  .error uigc-icon-error {
    margin-right: 8px;
  }

  .confirm {
    display: flex;
    padding: 11px 14px 22px 14px;
    box-sizing: border-box;
  }

  @media (min-width: 768px) {
    .confirm {
      padding: 11px 28px 22px 28px;
    }
  }

  .info .text_error {
    color: #ff6868;
  }
`;
