import { css } from 'lit';

export const selectorStyles = css`
  :host {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .search {
    padding: 0 14px;
    box-sizing: border-box;
  }

  @media (min-width: 768px) {
    .search {
      padding: 0 28px;
    }
  }

  uigc-list,
  uigc-asset-list {
    margin-top: 20px;
    overflow-y: auto;
  }

  .loading {
    align-items: center;
    display: flex;
    padding: 8px 28px;
    gap: 6px;
    border-bottom: 1px solid var(--hex-background-gray-800);
  }

  .loading > span.title {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
`;
