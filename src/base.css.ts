import { css } from 'lit';

export const baseStyles = css`
  /* Reset */
  a,
  abbr,
  acronym,
  address,
  applet,
  article,
  aside,
  audio,
  b,
  big,
  blockquote,
  body,
  canvas,
  caption,
  center,
  cite,
  code,
  dd,
  del,
  details,
  dfn,
  div,
  dl,
  dt,
  em,
  embed,
  fieldset,
  figcaption,
  figure,
  footer,
  form,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  header,
  hgroup,
  html,
  i,
  iframe,
  img,
  ins,
  kbd,
  label,
  legend,
  li,
  mark,
  menu,
  nav,
  object,
  ol,
  output,
  p,
  pre,
  q,
  ruby,
  s,
  samp,
  section,
  small,
  span,
  strike,
  strong,
  sub,
  summary,
  sup,
  table,
  tbody,
  td,
  tfoot,
  th,
  thead,
  time,
  tr,
  tt,
  u,
  ul,
  var,
  video {
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    vertical-align: baseline;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  a,
  button,
  button:focus,
  input,
  input:focus,
  select,
  select:focus,
  textarea,
  textarea:focus {
    -webkit-appearance: none;
    appearance: none;
    outline: none;
    border: none;
  }

  button,
  input,
  select,
  textarea {
    margin: 0;
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
  }

  .hidden {
    display: none;
  }

  .grow {
    flex: 1;
  }

  /* Container */

  .container {
    padding-right: 15px;
    padding-left: 15px;
    margin-right: auto;
    margin-left: auto;
  }

  @media (min-width: 576px) {
    .container {
      max-width: 540px;
    }
  }

  @media (min-width: 768px) {
    .container {
      max-width: 720px;
    }
  }

  @media (min-width: 992px) {
    .container {
      max-width: 960px;
    }
  }

  @media (min-width: 1200px) {
    .container {
      max-width: 1140px;
    }
  }

  @media (min-width: 1366px) {
    .container {
      max-width: 1290px;
    }
  }

  /* Section */

  section {
    padding-top: 75px;
  }

  @media (min-width: 768px) {
    section > div {
      margin-left: 8.33333%;
      flex: 0 0 83.33333%;
      max-width: 83.33333%;
    }
  }

  h1 {
    font-size: 24px;
    font-weight: 600;
  }

  h2 {
    font-size: 22px;
    font-weight: 600;
  }

  h3 {
    font-size: 18px;
  }

  /* Scrolls */

  /* ::-webkit-scrollbar {
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
  } */

  /* Button */

  .btn {
    position: relative;
  }

  .btn button {
    align-items: center;
    justify-content: center;
    height: 24px;
    font-weight: 600;
    text-transform: uppercase;
    padding-left: 15px;
    padding-right: 15px;
    background-color: var(--color-secondary);
    color: #fff;
  }

  .btn button:hover {
    cursor: pointer;
    color: #444;
  }

  .btn button:disabled,
  .btn button[disabled] {
    color: rgba(0, 0, 0, 0.26);
    background-image: none;
    background-color: rgba(122, 192, 175, 0.5);
    cursor: default;
  }

  .goto > a {
    display: inline-flex;
    position: relative;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    height: 30px;
    font-size: 13px;
    line-height: 18px;
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: var(--color-main);
  }

  .goto:hover > a {
    color: var(--color-secondary);
  }

  .goto > a > .goto-img {
    background-image: url(assets/img/icon/chevron-right.svg);
    height: 24px;
    width: 24px;
    margin-right: 8px;
  }

  .goto:hover > a > .goto-img {
    background-image: url(assets/img/icon/chevron-right-alt.svg);
  }

  .form-field__input,
  .form-field__select,
  .form-field__textarea {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    width: 100%;
    display: block;
    background: none;
    border: 0;
    outline: none;
    transition: box-shadow 0.25s ease;
    border-radius: 0;
    padding: 6px 0;
    color: #404040;
    box-shadow: 0 1px 0 #dedede;
    font-size: 19px;
    line-height: 1.5;
  }

  .form-field__input:focus,
  .form-field__select:focus,
  .form-field__textarea:focus {
    box-shadow: 0 3px 0 #000;
  }
`;
