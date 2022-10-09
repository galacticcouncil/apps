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

  /* Typography */

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

  /* Display */

  .hidden {
    display: none;
  }

  .grow {
    flex: 1;
  }
`;
