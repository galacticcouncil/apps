import { css } from 'lit';

export const headerStyles = css`
  .header {
    position: relative;
    display: flex;
    padding: 0 14px;
    box-sizing: border-box;
    align-items: center;
    min-height: 84px;
  }

  .header.section {
    justify-content: center;
  }

  .header uigc-typography[variant='title'] {
    margin-top: 5px;
  }

  .header .back {
    position: absolute;
    left: 20px;
  }

  .header .close {
    position: absolute;
    right: 20px;
  }

  @media (max-width: 480px) {
    .header {
      min-height: 64px;
    }
  }

  @media (min-width: 768px) {
    .header {
      padding: 22px 28px;
    }
  }
`;
