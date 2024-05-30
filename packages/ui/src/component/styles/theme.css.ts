import { css } from 'lit';

export const paletteProperties = css`
  :root {
    --hex-white: #ffffff;
    --rgb-white: 255, 255, 255;
    --hex-black: #000000;
    --rgb-black: 0, 0, 0;

    --hex-primary-500: #49e49f;
    --rgb-primary-500: 73, 228, 159;
    --hex-primary-450: #4cf3a8;
    --rgb-primary-450: 76, 243, 168;
    --hex-primary-400: #4fffb0;
    --rgb-primary-400: 79, 255, 176;
    --hex-primary-300: #8affcb;
    --rgb-primary-300: 138, 255, 203;
    --hex-primary-200: #b8ffdf;
    --rgb-primary-200: 184, 255, 223;
    --hex-primary-100: #daffee;
    --rgb-primary-100: 218, 255, 238;

    --hex-primary-alpha: #9ea7ba;
    --rgb-primary-alpha: 158, 167, 186;
    --hex-primary-alpha15: #4cd5f3;
    --rgb-primary-alpha15: 76, 213, 243;
    --hex-primary-alpha20: #25cbff;
    --rgb-primary-alpha20: 37, 203, 255;

    --hex-yellow-100: #f5f0de;
    --rgb-yellow-100: 245, 240, 222;
    --hex-yellow-200: #f4e7b0;
    --rgb-yellow-200: 244, 231, 176;
    --hex-yellow-300: #f0da73;
    --rgb-yellow-300: 240, 218, 115;
    --hex-yellow-400: #f7bf06;
    --rgb-yellow-400: 247, 191, 6;
    --hex-yellow-500: #e5b30b;
    --rgb-yellow-500: 229, 179, 11;

    --hex-orange-100: #ffe2c3;
    --rgb-orange-100: 255, 226, 195;
    --hex-orange-200: #fbcd9c;
    --rgb-orange-200: 251, 205, 156;
    --hex-orange-300: #f5a855;
    --rgb-orange-300: 245, 168, 85;
    --hex-orange-400: #ff931e;
    --rgb-orange-400: 255, 147, 30;
    --hex-orange-450: #f38d1d;
    --rgb-orange-450: 243, 141, 29;
    --hex-orange-500: #e18521;
    --rgb-orange-500: 225, 133, 33;

    --hex-red-100: #ffd7d7;
    --rgb-red-100: 255, 215, 215;
    --hex-red-200: #ffaeae;
    --rgb-red-200: 255, 174, 174;
    --hex-red-300: #ff8a8a;
    --rgb-red-300: 255, 138, 138;
    --hex-red-400: #ff6868;
    --rgb-red-400: 255, 104, 104;
    --hex-red-500: #da5d5d;
    --rgb-red-500: 218, 93, 93;

    --hex-pink-100: #ffbbd6;
    --hex-pink-200: #fea6ca;
    --hex-pink-300: #ff99c2;
    --hex-pink-400: #ff8bba;
    --hex-pink-500: #ff67a4;
    --hex-pink-600: #fc408c;
    --hex-pink-700: #e53e76;

    --hex-bright-blue-100: #a6ddff;
    --hex-bright-blue-200: #9cddff;
    --hex-bright-blue-300: #aaeefc;
    --hex-bright-blue-400: #3192cd;
    --hex-bright-blue-500: #1a7ab4;
    --hex-bright-blue-600: #57b3eb;
    --hex-bright-blue-700: #009fff;

    --hex-vibrant-blue-100: #7889ff;
    --hex-vibrant-blue-200: #5f73fe;
    --hex-vibrant-blue300: #485ef8;
    --hex-vibrant-blue400: #2b40c8;
    --hex-vibrant-blue500: #152dc7;
    --hex-vibrant-blue600: #0a1fa7;
    --hex-vibrant-blue700: #031586;

    --hex-dark-blue-200: #999ba7;
    --hex-dark-blue-300: #66697c;
    --hex-dark-blue-400: #333750;
    --rgb-dark-blue-400: 51, 55, 80;
    --hex-dark-blue-401: #1c2038;
    --hex-dark-blue-500: #000524;
    --hex-dark-blue-600: #00041d;
    --hex-dark-blue-700: #111320;
    --hex-dark-blue-800: #00020e;
    --hex-dark-blue-900: #000107;
    --hex-dark-blue-1000: #000524;

    --hex-background-gray-1000: #1c1a1f;
    --rgb-background-gray-1000: 28, 26, 31;
    --hex-background-gray-900: #211f24;
    --rgb-background-gray-900: 33, 31, 36;
    --hex-background-gray-800: #29292d;
    --rgb-background-gray-800: 41, 41, 45;
    --hex-background-gray-700: #3e3e4b;
    --rgb-background-gray-700: 62, 62, 75;
    --hex-background-gray-600: #51515f;
    --rgb-background-gray-600: 81, 81, 95;
    --hex-background-gray-500: #686876;
    --rgb-background-gray-500: 104, 104, 118;

    --hex-neutral-gray-500: #787e82;
    --rgb-neutral-gray-500: 120, 126, 130;
    --hex-neutral-gray-400: #a2b0b8;
    --rgb-neutral-gray-400: 162, 176, 184;
    --hex-neutral-gray-300: #9ea9b1;
    --rgb-neutral-gray-300: 158, 169, 177;
    --hex-neutral-gray-200: #d1dee8;
    --rgb-neutral-gray-200: 209, 222, 232;
    --hex-neutral-gray-100: #e5ecf1;
    --rgb-neutral-gray-100: 229, 236, 241;

    --hex-dark-gray: #1a171b;

    --hex-basic-100: #ecedef;
    --hex-basic-200: #8f90a6;
    --hex-basic-300: #bbbec9;
    --hex-basic-400: #b2b6c5;
    --hex-basic-500: #878c9e;
    --hex-basic-600: #676c80;
    --hex-basic-700: #5d6175;
    --hex-basic-800: #26282f;
    --hex-basic-900: #00041d;
  }
`;

export const bsxThemeProperties = css`
  :root,
  html[theme='bsx'] {
    --uigc-bsx-flex-display: flex;
    --uigc-hdx-flex-display: none;
    --uigc-bsx-grid-display: grid;
    --uigc-hdx-grid-display: none;
    --uigc-bsx-display: block;
    --uigc-hdx-display: none;
    /** GENERAL */
    --uigc-app-font: 'SatoshiVariable';
    --uigc-app-font-secondary: 'SatoshiVariable';
    --uigc-app-background: radial-gradient(
        89.2% 89.2% at 50.07% 87.94%,
        rgb(0, 138, 105) 0%,
        rgb(38, 47, 49) 88.52%
      ),
      rgb(44, 51, 53);
    --uigc-app-background-color: var(--uigc-app-background);
    --uigc-app-border-radius: 20px;
    --uigc-app-border-radius-2: 8px;

    --uigc-app-bg-section: rgba(var(--rgb-black), 0.25);
    --uigc-app-bg-error: rgba(var(--rgb-red-400), 0.3);
    --uigc-app-bg-warning: rgba(255, 184, 0, 0.5);
    --uigc-app-bg-id: var(--hex-black);

    --uigc-app-font-color__gradient: linear-gradient(
        90deg,
        #4fffb0 1.27%,
        #b3ff8f 48.96%,
        #ff984e 104.14%
      ),
      linear-gradient(90deg, #4fffb0 1.27%, #a2ff76 53.24%, #ff984e 104.14%),
      linear-gradient(90deg, #ffce4f 1.27%, #4fffb0 104.14%);
    --uigc-app-font-color__primary: var(--hex-primary-400);
    --uigc-app-font-color__secondary: var(--hex-neutral-gray-300);
    --uigc-app-font-color__alternative: var(--hex-neutral-gray-400);

    --uigc-chart-background: var(--hex-background-gray-1000);
    --uigc-chart-color: var(--hex-primary-400);
    --uigc-chart-border: 1px solid var(--hex-background-gray-1000);
    --uigc-chart-toggle__selected: trannsparent;
    --uigc-chart-state__secondary: var(--hex-primary-400);
    --uigc-chart-state__primary: var(--hex-primary-200);

    --uigc-field-border-radius: 12px;
    --uigc-field-border: none;
    --uigc-field-border-bottom__hover: none;
    --uigc-field-background: rgba(var(--rgb-primary-100), 0.06);
    --uigc-field-background__hover: rgba(var(--rgb-primary-100), 0.06);
    --uigc-field-padding: 14px;
    --uigc-field-margin__sm: 0 5px;
    --uigc-field-row-gap: 5px;

    --uigc-field--title-color: var(--hex-primary-200);
    --uigc-field--title-text-transform: none;
    --uigc-field--title-font-size: 16px;
    --uigc-field--title-line-height: 22px;

    --uigc-field__error-border-width: 1px 1px 1px 1px;
    --uigc-field__error-border: none;
    --uigc-field__error-color: var(--hex-red-300);
    --uigc-field__error-outline: 1px solid var(--hex-red-300);

    --uigc-textfield-background: rgba(var(--rgb-primary-100), 0.06);
    --uigc-textfield-background__hover: rgba(var(--rgb-primary-100), 0.12);
    --uigc-textfield-border-style: solid;
    --uigc-textfield-padding: 0 14px;
    --uigc-textfield-font-size: 16px;
    --uigc-textfield-font-size__sm: 14px;
    --uigc-textfield__field-background: var(--uigc-asset-input-background);
    --uigc-textfield__field-background__hover: var(
      --uigc-asset-input-background__hover
    );
    --uigc-textfield__field-border-width: var(--uigc-input-border-width);
    --uigc-textfield__field-border-color: var(--uigc-input-border-color);
    --uigc-textfield__field-border-color__hover: var(
      --uigc-input-border-color__focus
    );

    /** AddressInput */
    --uigc-address-input__placeholder-color: var(--hex-basic-300);
    --uigc-address-input-background__hover: rgba(var(--rgb-primary-100), 0.12);
    --uigc-chain-selector--title-color: rgba(var(--rgb-white), 0.7);
    --uigc-chain-selector--title-font-weight: 500;
    /** Alert */
    --uigc-alert-border-radius: 14px;
    --uigc-alert-background: var(--hex-background-gray-1000);
    --uigc-alert__success-background: var(--hex-background-gray-1000);
    --uigc-alert__error-background: var(--hex-background-gray-1000);
    --uigc-alert__progress-background: var(--hex-background-gray-1000);
    --uigc-alert__drawer-background: var(--hex-background-gray-1000);
    /** AssetNamedInput */
    --uigc-asset-ninput-padding: 5px 14px;
    --uigc-asset-ninput-row-gap: 5px;
    /** AssetPrice */
    --uigc-asset-price-background: rgba(var(--rgb-primary-100), 0.06);
    --uigc-asset-price-border: none;
    --uigc-asset-price-border-radius: 7px;
    --uigc-asset-price__highlight-color: var(--hex-primary-300);
    /** AssetSelector */
    --uigc-asset-selector-border-radius: 8px;
    /** AssetSwitch */
    --uigc-asset-switch-transform: rotate(180deg);
    --uigc-asset-switch-transition: all 0.3s ease-in-out 0s;
    --uigc-asset-switch-background: #192022;
    /** AssetTransfer */
    --uigc-asset-transfer__error-border: none;
    --uigc-asset-transfer__error-border-width: unset;
    --uigc-asset-transfer__error-outline: unset;
    --uigc-asset-transfer__error-border: none;
    --uigc-asset-transfer__error-backgroud__hover: var(--uigc-field-background);
    /** Backdrop */
    --uigc-backdrop-background: radial-gradient(
        70.22% 56.77% at 51.87% 101.05%,
        rgba(79, 255, 176, 0.24) 0%,
        rgba(79, 255, 176, 0) 100%
      ),
      rgba(7, 8, 14, 0.7);
    /** BusyIndicator */
    --uigc-busy-indicator--circle-border-radius: 50%;
    /** Button */
    --uigc-button-border-radius: 35px;
    --uigc-button__max-border-radius: 35px;
    --uigc-button__max-text-transform: none;
    --uigc-button__primary-color: var(--hex-background-gray-800);
    --uigc-button__primary-color__disabled: var(--hex-background-gray-800);
    --uigc-button__primary-background: var(--hex-primary-400);
    --uigc-button__primary-background__disabled: var(--hex-primary-400);
    --uigc-button__primary-background__hover: var(--hex-primary-300);
    --uigc-button__primary-box-shadow__hover: none;
    --uigc-button__primary-transform__hover: none;
    --uigc-button__primary-background__before: none;
    --uigc-button__secondary-color: var(--hex-primary-400);
    --uigc-button__secondary-color__disabled: var(--hex-primary-400);
    --uigc-button__secondary-color__hover: var(--hex-primary-400);
    --uigc-button__secondary-background: rgba(var(--rgb-primary-450), 0.12);
    --uigc-button__secondary-background__disabled: rgba(
      var(--rgb-primary-450),
      0.12
    );
    --uigc-button__secondary-background__hover: rgba(
      var(--rgb-primary-450),
      0.3
    );
    --uigc-button__secondary-border: none;
    --uigc-button__secondary-border__hover: none;

    --uigc-button__disabled-opacity: 0.2;
    --uigc-button__disabled-border: none;
    /** CircularProgress */
    --uigc-circular-progress-background: conic-gradient(
      from 180deg at 50% 50%,
      #ffe668 -89.54deg,
      rgba(79, 255, 176, 0) 20.17deg,
      rgba(79, 255, 176, 0) 129.19deg,
      rgba(79, 255, 176, 0.14) 157.96deg,
      #2effa1 228.05deg,
      #ffe668 270.46deg,
      rgba(79, 255, 176, 0) 380.17deg
    );
    /** ChainSelector */
    --uigc-chain-selector-border-radius: 8px;
    --uigc-chain-selector-border: none;
    --uigc-chain-selector-background: rgba(var(--rgb-primary-100), 0.06);
    --uigc-chain-selector-background__hover: rgba(var(--rgb-primary-100), 0.12);
    --uigc-chain-selector--title-color: rgba(var(--rgb-white), 0.7);
    --uigc-chain-selector--title-font-weight: 500;
    /** Dialog */
    --uigc-dialog-background: var(--hex-background-gray-900);
    --uigc-dialog-box-shadow: 0px 38px 46px rgba(0, 0, 0, 0.03);
    --uigc-dialog-border-radius: 16px;
    --uigc-dialog-font-weight: 600;
    --uigc-dialog-font-size: 24px;
    --uigc-dialog-line-height: 32px;
    /** DialogCountdown*/
    --uigc-dialog-cnt-color: rgba(var(--rgb-primary-100), 0.6);
    --uigc-dialog-cnt-font-weight: 400;
    --uigc-dialog-cnt-font-size: 12px;
    --uigc-dialog-cnt-line-height: 22px;
    /** Divider */
    --uigc-divider-background: rgba(var(--rgb-primary-450), 0.12);
    --uigc-divider-color: var(--hex-background-gray-800);
    /** Drawer */
    --uigc-drawer-background: var(--hex-background-gray-900);
    --uigc-drawer-box-shadow: 0px 38px 46px rgba(0, 0, 0, 0.03);
    --uigc-drawer-border-radius: 16px;
    /** IconButton */
    --uigc-icon-button-border: none;
    --uigc-icon-button-border__hover: none;
    --uigc-icon-button-border-radius: 50%;
    --uigc-icon-button-background: rgba(var(--rgb-white), 0.06);
    --uigc-icon-button-background__hover: rgba(var(--rgb-white), 0.2);
    /** Input */
    --uigc-input-height: 54px;
    --uigc-input-border-width: 1px;
    --uigc-input-border-color: rgba(var(--rgb-white), 0.12);
    --uigc-input-border-color__focus: var(--hex-primary-300);
    --uigc-input-border-radius: 9px;
    --uigc-input-background: rgba(var(--rgb-primary-100), 0.06);
    --uigc-input-background__hover: rgba(var(--rgb-primary-100), 0.12);
    --uigc-input__placeholder-color: rgba(var(--rgb-primary-100), 0.4);
    /** List */
    --uigc-list-border-bottom: 1px solid var(--hex-background-gray-800);
    --uigc-list-border-bottom: 1px solid var(--hex-background-gray-800);
    --uigc-list--header-color: var(--hex-neutral-gray-300);
    --uigc-list--header-background: #1c2527;
    --uigc-list--subheader-background: rgba(var(--rgb-white), 0.03);
    /** ListItem */
    --uigc-list-item__selected-background: rgba(var(--rgb-primary-450), 0.12);
    --uigc-list-item--button-background: transparent;
    --uigc-list-item--secondary-color: var(--hex-neutral-gray-500);
    --uigc-list-item--secondary-desc-font-weight: 500;
    /** Paper */
    --uigc-paper-border-radius: 20px;
    --uigc-paper-box-shadow: 0 0 0 1px hsl(0deg 0% 100% / 5%);
    --uigc-paper-background: linear-gradient(
      180deg,
      #1c2527 0%,
      #14161a 80.73%,
      #121316 100%
    );
    --uigc-paper-content: unset;
    --uigc-paper-mask: unset;
    --uigc-paper-padding: unset;
    /** Progress */
    --uigc-progress__success-background: var(--hex-primary-500);
    --uigc-progress__error-background: var(--hex-primary-500);
    --uigc-progress-background: var(--hex-primary-500);
    /** Selector */
    --uigc-selector--title-color: rgba(var(--rgb-white), 0.7);
    --uigc-selector--title-font-weight: 500;
    --uigc-selector-background__hover: rgba(var(--rgb-primary-100), 0.12);
    --uigc-selector-border-bottom__hover: none;
    /** Skeleton */
    --uigc-skeleton-border-radius: 9999px;
    /** Switch */
    --uigc-switch--root-border: 1px solid var(--hex-background-gray-700);
    --uigc-switch--root-border-radius: 45px;
    --uigc-switch--root-background: var(--hex-dark-gray);
    --uigc-switch--thumb-background: var(--hex-neutral-gray-400);
    --uigc-switch--thumb-border-color: var(--hex-dark-gray);
    --uigc-switch--thumb-border-color__hover: var(--hex-primary-300);
    --uigc-switch__checked--root-background: var(--hex-dark-green);
    --uigc-switch__checked--root-border: 1px solid var(--hex-primary-500);
    --uigc-switch__checked--thumb-background: var(--hex-primary-300);
    --uigc-switch__checked--thumb-border-color: var(--hex-primary-500);
    /** Toast */
    --uigc-toast-background: var(--hex-background-gray-900);
    --uigc-toast-border-radius: 14px;
    --uigc-toast--close-border-radius: 50%;
    --uigc-toast--close-border: none;
    --uigc-toast--close-background: var(--hex-background-gray-800);
    --uigc-toast--close-background__hover: var(--hex-background-gray-900);
    /** ToggleButton */
    --uigc-toggle-button--root-background__hover: var(
      --hex-background-gray-700
    );
    --uigc-toggle-button--root-background: transparent;
    --uigc-toggle-button--root-border-radius: 9px;
    --uigc-toggle-button__selected--root-color: var(--hex-black);
    --uigc-toggle-button__selected--root-background: linear-gradient(
        90deg,
        #4fffb0 1.27%,
        #b3ff8f 48.96%,
        #ff984e 104.14%
      ),
      linear-gradient(90deg, #4fffb0 1.27%, #a2ff76 53.24%, #ff984e 104.14%),
      linear-gradient(90deg, #ffce4f 1.27%, #4fffb0 104.14%);
    --uigc-toggle-button__selected--tab-color: var(--hex-black);
    --uigc-toggle-button__selected--tab-background: var(--hex-primary-400);
    /** ToggleButtonGroup */
    --uigc-toggle-button-group--root-background: rgba(var(--rgb-black), 0.25);
    --uigc-toggle-button-group--root-border-radius: 11px;
    /** Typography */
    --uigc-typography__title-background: var(--uigc-app-font-color__gradient);
    --uigc-typography__title-error-background: var(--hex-red-400);
    --uigc-typography__title-gradient-background: var(
      --uigc-app-font-color__gradient
    );
    --uigc-typography__title-font-weight: 600;
    --uigc-typography__title-font-size: 24px;
    --uigc-typography__section-font-weight: 500;
    --uigc-typography__section-font-size: 16px;
    --uigc-typography__section-line-height: 22px;
    --uigc-typography__section-color: var(--hex-neutral-gray-100);
    --uigc-typography__subsection-font-weight: 500;
    --uigc-typography__subsection-font-size: 13px;
    --uigc-typography__subsection-line-height: 18px;
    --uigc-typography__subsection-color: var(--hex-neutral-gray-100);
  }
`;

export const hdxThemeProperties = css`
  html[theme='hdx'] {
    --uigc-bsx-flex-display: none;
    --uigc-hdx-flex-display: flex;
    --uigc-bsx-grid-display: none;
    --uigc-hdx-grid-display: grid;
    --uigc-bsx-display: none;
    --uigc-hdx-display: block;
    /** GENERAL */
    --uigc-app-font: 'Geist';
    --uigc-app-font-secondary: 'GeistMono';
    --uigc-app-background: radial-gradient(
        73.65% 123% at 57% -38.76%,
        rgba(93, 177, 255, 0.59) 0%,
        rgba(0, 194, 255, 0) 100%
      ),
      linear-gradient(180deg, #00579f 0%, #023b6a 25%, #060917 100%);
    --uigc-app-background-color: rgb(6, 9, 23);
    --uigc-app-border-radius: 8px;
    --uigc-app-border-radius-2: 2px;

    --uigc-app-bg-section: rgba(var(--rgb-primary-alpha), 0.06);
    --uigc-app-bg-error: rgba(239, 3, 3, 0.25);
    --uigc-app-bg-warning: rgba(255, 223, 56, 0.4);
    --uigc-app-bg-id: var(--hex-dark-blue-400);

    --uigc-app-font-color__gradient: linear-gradient(
      90deg,
      #fc408c 0%,
      #57b3eb 100%
    );
    --uigc-app-font-color__primary: var(--hex-bright-blue-300);
    --uigc-app-font-color__secondary: var(--hex-dark-blue-300);
    --uigc-app-font-color__alternative: var(--hex-basic-400);

    --uigc-chart-background: rgba(6, 9, 23, 0.4);
    --uigc-chart-border: 1px solid rgba(152, 176, 214, 0.27);
    --uigc-chart-color: var(--hex-bright-blue-300);
    --uigc-chart-toggle__selected: rgba(84, 99, 128, 0.35);
    --uigc-chart-state__secondary: #25cbff;
    --uigc-chart-state__primary: #9cddff;

    --uigc-field-border-radius: 2px;
    --uigc-field-border-bottom: 1px solid var(--hex-dark-blue-400);
    --uigc-field-border-bottom__hover: 1px solid var(--hex-bright-blue-600);
    --uigc-field-background: rgba(var(--rgb-primary-alpha), 0.06);
    --uigc-field-background__hover: rgba(var(--rgb-primary-alpha15), 0.12);
    --uigc-field-padding: 14px;
    --uigc-field-margin__sm: none;
    --uigc-field-row-gap: 5px;

    --uigc-field--title-color: var(--hex-basic-500);
    --uigc-field--title-text-transform: uppercase;
    --uigc-field--title-font-size: 12px;
    --uigc-field--title-line-height: 100%;

    --uigc-field__error-border-width: 0 0 1px 0;
    --uigc-field__error-border: 1px solid var(--hex-red-400);
    --uigc-field__error-color: var(--hex-red-400);
    --uigc-field__error-outline: none;

    --uigc-textfield-background: transparent;
    --uigc-textfield-background__hover: none;
    --uigc-textfield-border-style: none;
    --uigc-textfield-padding: 0;
    --uigc-textfield-font-size: 18px;
    --uigc-textfield-font-size__sm: 16px;
    --uigc-textfield__field-background: var(--uigc-field-background);
    --uigc-textfield__field-background__hover: var(
      --uigc-field-background__hover
    );
    --uigc-textfield__field-border-bottom: var(--uigc-input-border-width);
    --uigc-textfield__field-border-color: var(--uigc-input-border-color);
    --uigc-textfield__field-border-color__hover: var(
      --uigc-input-border-color__focus
    );

    /** AddressInput */
    --uigc-address-input__placeholder-color: var(--hex-basic-300);
    --uigc-address-input-background__hover: rgba(
      var(--rgb-primary-alpha15),
      0.12
    );
    --uigc-chain-selector--title-color: var(--hex-basic-500);
    --uigc-chain-selector--title-font-weight: 600;
    /** Alert */
    --uigc-alert-border-radius: 4px;
    --uigc-alert-background: var(--hex-dark-blue-600);
    --uigc-alert__success-background: rgba(3, 239, 151, 0.25);
    --uigc-alert__error-background: rgba(239, 3, 3, 0.25);
    --uigc-alert__progress-background: rgba(37, 203, 255, 0.2);
    --uigc-alert__drawer-background: var(--hex-dark-blue-401);
    /** AssetNamedInput */
    --uigc-asset-ninput-padding: 5px 14px;
    --uigc-asset-ninput-row-gap: 5px;
    /** AssetPrice */
    --uigc-asset-price-background: var(--hex-dark-blue-700);
    --uigc-asset-price-border: 1px solid var(--hex-dark-blue-400);
    --uigc-asset-price-border-radius: 2px;
    --uigc-asset-price__highlight-color: var(--hex-bright-blue-300);
    /** AssetSelector */
    --uigc-asset-selector-border-radius: 2px;
    /** AssetSwitch */
    --uigc-asset-switch-transform: rotateX(180deg);
    --uigc-asset-switch-transition: none;
    --uigc-asset-switch-background: transparent;
    /** AssetTransfer */
    --uigc-asset-transfer__error-border: var(--uigc-field__error-border);
    --uigc-asset-transfer__error-border-width: var(
      --uigc-field__error-border-width
    );
    --uigc-asset-transfer__error-outline: var(--uigc-field__error-outline);
    --uigc-asset-transfer__error-border: var(--uigc-field__error-border);
    --uigc-asset-transfer__error-backgroud__hover: rgba(255, 75, 75, 0.1);
    /** Backdrop */
    --uigc-backdrop-background: rgba(0, 7, 50, 0.7);
    /** BusyIndicator */
    --uigc-busy-indicator--circle-border-radius: 4x;
    /** Button */
    --uigc-button-border-radius: 4px;
    --uigc-button__max-border-radius: none;
    --uigc-button__max-text-transform: uppercase;
    --uigc-button__max-background__disabled: rgba(
      var(--rgb-primary-alpha),
      0.06
    );
    --uigc-button__max-background__hover: rgba(var(--rgb-primary-alpha15), 0.2);
    --uigc-button__primary-color: var(--hex-white);
    --uigc-button__primary-color__disabled: rgb(102, 105, 124);
    --uigc-button__primary-background: var(--hex-pink-700);
    --uigc-button__primary-background__disabled: rgba(
      var(--rgb-primary-alpha),
      0.06
    );
    --uigc-button__primary-background__hover: var(--hex-pink-600);
    --uigc-button__primary-box-shadow__hover: rgb(255 15 111 / 30%) 4px 10px
      40px 0px;
    --uigc-button__primary-transform__hover: translate(-5px, -5px);
    --uigc-button__primary-background__before: linear-gradient(
      129deg,
      rgba(122, 96, 138, 0.25) 0%,
      rgba(255, 153, 202, 0.23) 100%
    );
    --uigc-button__info-color: var(--hex-white);
    --uigc-button__info-color__disabled: rgb(102, 105, 124);
    --uigc-button__info-background: var(--hex-bright-blue-700);
    --uigc-button__info-background__disabled: rgba(
      var(--rgb-primary-alpha),
      0.06
    );
    --uigc-button__info-background__hover: var(--hex-bright-blue-700);
    --uigc-button__info-box-shadow__hover: 0px 0px 0px -1px rgba(145, 164, 200, 0.3),
      0px 13px 40px -12px rgba(41, 148, 246, 0.45);
    --uigc-button__info-transform__hover: translate(-5px, -5px);
    --uigc-button__info-background__before: rgba(1, 158, 255, 0.35);
    --uigc-button__secondary-color: var(--hex-bright-blue-300);
    --uigc-button__secondary-color__disabled: rgb(102, 105, 124);
    --uigc-button__secondary-color__hover: var(--hex-white);
    --uigc-button__secondary-background: rgba(var(--rgb-primary-alpha15), 0.12);
    --uigc-button__secondary-background__disabled: rgba(
      var(--rgb-primary-alpha),
      0.06
    );
    --uigc-button__secondary-background__hover: rgba(
      var(--rgb-primary-alpha15),
      0.3
    );
    --uigc-button__secondary-border: 1px solid var(--hex-bright-blue-300);
    --uigc-button__secondary-border__hover: 1px solid var(--hex-white);
    --uigc-button__error-color: #f87171;
    --uigc-button__error-color__disabled: rgb(102, 105, 124);
    --uigc-button__error-color__hover: #ff9e9e;
    --uigc-button__error-background: rgba(239, 3, 3, 0.25);
    --uigc-button__error-background__disabled: rgba(
      var(--rgb-primary-alpha),
      0.06
    );
    --uigc-button__error-background__hover: rgba(255, 6, 6, 0.39);
    --uigc-button__error-border: 1px solid #f87171;
    --uigc-button__error-border__hover: 1px solid #ff9e9e;

    --uigc-button__disabled-opacity: 0.7;
    --uigc-button__disabled-border: 1px solid rgb(102, 105, 124);
    --uigc-circular-progress-background: conic-gradient(
      from -60.84deg at 50% 50%,
      rgba(10, 13, 26, 0) 0deg,
      rgba(10, 13, 26, 0) 134.49deg,
      rgb(0, 194, 255) 185.07deg,
      rgb(0, 77, 226) 243.24deg,
      rgb(252, 64, 140) 294.78deg,
      rgb(252, 64, 140) 358.13deg,
      rgba(10, 13, 26, 0) 360deg
    );
    /** ChainSelector */
    --uigc-chain-selector-border-radius: 2px;
    --uigc-chain-selector-border: 1px solid var(--hex-dark-blue-400);
    --uigc-chain-selector-background: rgba(var(--rgb-primary-alpha), 0.06);
    --uigc-chain-selector-background__hover: rgba(
      var(--rgb-primary-alpha15),
      0.12
    );
    --uigc-chain-selector--title-color: var(--hex-basic-500);
    --uigc-chain-selector--title-font-weight: 600;
    /** Dialog */
    --uigc-dialog-background: var(--hex-dark-blue-600);
    --uigc-dialog-box-shadow: 0px 10px 30px rgba(91, 144, 172, 0.12),
      3px 3px 0px rgba(126, 161, 194, 0.12);
    --uigc-dialog-border-radius: 4px;
    /** DialogCountdown */
    --uigc-dialog-cnt-color: rgba(var(--rgb-primary-100), 0.6);
    --uigc-dialog-cnt-font-weight: 500;
    --uigc-dialog-cnt-font-size: 12px;
    --uigc-dialog-cnt-line-height: 120%;
    /** Divider */
    --uigc-divider-background: var(--hex-dark-blue-400);
    --uigc-divider-color: rgba(var(--rgb-dark-blue-400), 0.3);
    /** Drawer */
    --uigc-drawer-background: var(--hex-dark-blue-600);
    --uigc-drawer-box-shadow: 0px 0px 61px rgba(0, 0, 0, 0.36);
    --uigc-drawer-border-radius: 4px;
    /** IconButton */
    --uigc-icon-button-border: 1px solid #30344c;
    --uigc-icon-button-border__hover: 1px solid var(--hex-bright-blue-600);
    --uigc-icon-button-border-radius: 4px;
    --uigc-icon-button-background: rgba(var(--rgb-primary-alpha), 0.06);
    --uigc-icon-button-background__hover: rgba(var(--rgb-primary-alpha20), 0.2);
    /** Input */
    --uigc-input-height: unset;
    --uigc-input-border-width: 0 0 1px 0;
    --uigc-input-border-color: var(--hex-dark-blue-400);
    --uigc-input-border-color__focus: var(--hex-bright-blue-600);
    --uigc-input-border-radius: 2px;
    --uigc-input-background: rgba(var(--rgb-primary-alpha), 0.06);
    --uigc-input-background__hover: rgba(var(--rgb-primary-alpha15), 0.12);
    --uigc-input__placeholder-color: rgba(114, 131, 165, 0.6);
    /** List */
    --uigc-list-border-bottom: 1px solid var(--hex-dark-blue-401);
    --uigc-list--header-color: var(--hex-basic-700);
    --uigc-list--header-background: var(--hex-dark-blue-700);
    --uigc-list--subheader-background: rgba(var(--rgb-primary-alpha), 0.06);
    --uigc-list--button-background: rgba(var(--rgb-white), 0.03);
    /** ListItem */
    --uigc-list-item__selected-background: rgba(
      var(--rgb-primary-alpha15),
      0.12
    );
    --uigc-list-item--button-background: rgba(var(--rgb-white), 0.03);
    --uigc-list-item--secondary-color: rgba(221, 229, 255, 0.61);
    --uigc-list-item--secondary-desc-font-weight: 400;
    /** Paper */
    --uigc-paper-border-radius: 4px;
    --uigc-paper-box-shadow: none;
    --uigc-paper-background: var(--hex-dark-blue-700);
    --uigc-paper-content: '';
    --uigc-paper-mask: linear-gradient(
          rgb(255, 255, 255) 0px,
          rgb(255, 255, 255) 0px
        )
        content-box content-box,
      linear-gradient(rgb(255, 255, 255) 0px, rgb(255, 255, 255) 0px);
    --uigc-paper-padding: 1px;
    /** Progress */
    --uigc-progress__success-background: #30ffb1;
    --uigc-progress__error-background: #f11313;
    --uigc-progress-background: #009fff;
    /** Selector */
    --uigc-selector--title-color: var(--hex-basic-500);
    --uigc-selector--title-font-weight: 600;
    --uigc-selector-background__hover: rgba(var(--rgb-primary-alpha15), 0.12);
    --uigc-selector-border-bottom__hover: 1px solid var(--hex-bright-blue-600);
    /** Skeleton */
    --uigc-skeleton-border-radius: 4px;
    /** Switch */
    --uigc-switch--root-border: 1px solid var(--hex-basic-700);
    --uigc-switch--root-border-radius: 4px;
    --uigc-switch--root-background: var(--hex-dark-gray);
    --uigc-switch--thumb-background: var(--hex-background-gray-500);
    --uigc-switch--thumb-border-color: var(--hex-dark-gray);
    --uigc-switch--thumb-border-color__hover: var(--hex-bright-blue-300);
    --uigc-switch__checked--root-background: rgba(
      var(--rgb-primary-alpha20),
      0.2
    );
    --uigc-switch__checked--root-border: 1px solid var(--hex-bright-blue-300);
    --uigc-switch__checked--thumb-background: var(--hex-bright-blue-700);
    --uigc-switch__checked--thumb-border-color: var(--hex-bright-blue-300);
    /** Toast */
    --uigc-toast-background: var(--hex-dark-blue-600);
    --uigc-toast-border-radius: 4px;
    --uigc-toast--close-border-radius: 4px;
    --uigc-toast--close-border: 1px solid #30344c;
    --uigc-toast--close-background: var(--hex-dark-blue-700);
    --uigc-toast--close-background__hover: var(--hex-dark-blue-600);
    /** ToggleButton */
    --uigc-toggle-button--root-background__hover: var(--hex-dark-blue-401);
    --uigc-toggle-button--root-background: rgba(var(--rgb-primary-alpha), 0.06);
    --uigc-toggle-button--root-border-radius: 4px;
    --uigc-toggle-button__selected--root-color: var(--hex-black);
    --uigc-toggle-button__selected--root-background: linear-gradient(
      90deg,
      #fc408c 30%,
      #efb0ff 100%
    );
    --uigc-toggle-button__selected--tab-color: var(--hex-white);
    --uigc-toggle-button__selected--tab-background: var(--hex-bright-blue-700);
    /** ToggleButtonGroup */
    --uigc-toggle-button-group--root-background: rgba(
      var(--rgb-primary-alpha),
      0.06
    );
    --uigc-toggle-button-group--root-border-radius: 4px;
    /** Typography */
    --uigc-typography__title-background: var(--hex-bright-blue-300);
    --uigc-typography__title-error-background: rgb(255, 75, 75);
    --uigc-typography__title-gradient-background: var(
      --uigc-app-font-color__gradient
    );
    --uigc-typography__title-font-weight: 500;
    --uigc-typography__title-font-size: 24px;
    --uigc-typography__section-font-weight: 500;
    --uigc-typography__section-font-size: 15px;
    --uigc-typography__section-line-height: 130%;
    --uigc-typography__section-color: var(--hex-basic-100);
    --uigc-typography__subsection-font-weight: 500;
    --uigc-typography__subsection-font-size: 13px;
    --uigc-typography__subsection-line-height: 100%;
    --uigc-typography__subsection-color: var(--hex-basic-500);
  }
`;
