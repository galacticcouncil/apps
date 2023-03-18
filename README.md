# Galactic Apps

[![npm version](https://img.shields.io/npm/v/@galacticcouncil/apps.svg)](https://www.npmjs.com/package/@galacticcouncil/apps)

Collection of components build on top of the [UIGC Framework](https://github.com/galacticcouncil/ui) providing view & interaction
layer with HydraDX & Basilisk chains.

## Overview

| Component           | Name (import)      | Custom element         |
| ------------------- | ------------------ | ---------------------- |
| Notification Center | NotificationCenter | gc-notification-center |
| Transaction Center  | TransactionCenter  | gc-transaction-center  |
| Trade App           | TradeApp           | gc-trade-app           |
| Trade Spa           | TradeSpa           | gc-trade-spa           |
| Xcm App             | XcmApp             | gc-xcm-app             |

### Notification Center

Display app notifications (toast) and related history (drawer) based on slotted component event.

#### API

```js
this.dispatchEvent(new CustomEvent() < Notification > ('gc:notification:new', message));
```

#### Types

| Attribute | Description              |
| --------- | ------------------------ |
| id        | unique notification id   |
| timestamp | unix timestamp           |
| message   | string or html template  |
| type      | notification type        |
| toast     | whether to display toast |

```js
type Notification = {
  id: string,
  timestamp: number,
  message: string | TemplateResult,
  type: NotificationType,
  toast: boolean,
};

enum NotificationType {
  success = 'success',
  error = 'error',
  progress = 'progress',
  default = '',
}
```

### Transaction Center

Process transaction & display status based on slotted component event. Dispatch result to Notification center.

#### API

```js
this.dispatchEvent(new CustomEvent() < TxInfo > ('gc:tx:new', message)); // on chain tx
this.dispatchEvent(new CustomEvent() < TxInfo > ('gc:tx:newXcm', message)); // cross chain tx
```

#### Types

| Attribute    | Description                       |
| ------------ | --------------------------------- |
| account      | User account (wallet)             |
| transaction  | Transaction info (extrinsic, hex) |
| notification | Notification center metadata      |
| meta         | Transaction metadata              |

```js
type TxNotification = {
  processing: string | TemplateResult,
  success: string | TemplateResult,
  failure: string | TemplateResult,
};

type TxInfo = {
  account: Account,
  transaction: Transaction,
  notification: TxNotification,
  meta?: Record<string, string>,
};
```

### Trade App

Bare trade app without tx & notification center.

#### API

```html
<gc-trade-app
  apiAddress="wss://rococo-basilisk-rpc.hydration.dev"
  accountAddress="your_account_address"
  accountProvider="polkadot-js"
  accountName="your_account_name"
  pools="XYK,LBP"
></gc-trade-app>
```

#### Properties

| Property          | Description      | Required |
| ----------------- | ---------------- | -------- |
| apiAddress        | chain ws address | true     |
| stableCoinAssetId | stablecoin id    | true     |
| accountAddress    | account address  | false    |
| accountProvider   | account provider | false    |
| accountName       | account name     | false    |
| pools             | list of pools    | false    |
| assetIn           | asset in id      | false    |
| assetOut          | asset out id     | false    |

### Trade Spa

Standalone trade app with tx & notification center.

#### API

```html
<gc-trade-spa
  apiAddress="wss://rococo-basilisk-rpc.hydration.dev"
  accountAddress="your_account_address"
  accountProvider="polkadot-js"
  accountName="your_account_name"
  pools="XYK"
></gc-trade-spa>
```

#### Properties

| Property          | Description      | Required |
| ----------------- | ---------------- | -------- |
| apiAddress        | chain ws address | true     |
| stableCoinAssetId | stablecoin id    | true     |
| accountAddress    | account address  | false    |
| accountProvider   | account provider | false    |
| accountName       | account name     | false    |
| pools             | list of pools    | false    |
| assetIn           | asset in id      | false    |
| assetOut          | asset out id     | false    |

### Xcm App

Bare cross chain transaction app without tx & notification center.

#### API

```html
<gc-xcm-app
  srcChain="polkadot"
  dstChain="hydradx"
  chains="polkadot,hydradx,acala"
  accountAddress="your_account_address"
  accountProvider="polkadot-js"
  accountName="your_account_name"
></gc-xcm-app>
```

#### Properties

| Property        | Description       | Required |
| --------------- | ----------------- | -------- |
| accountAddress  | account address   | false    |
| accountProvider | account provider  | false    |
| accountName     | account name      | false    |
| chains          | listed chains     | true     |
| srcChain        | default src chain | true     |
| dstChain        | default dst chain | true     |

## Live [master]

Visit https://galactic-apps.netlify.app/

## Local Development and Build

### Requirements

- [Node.js](https://nodejs.org/) (**version 18 or higher**)

### Local development

Live reloading is configured in 2 steps:

- First step is to enable:
  - <ins>watch mode</ins> (to automatically start a build when you edit and save a file)
  - <ins>serve mode</ins> (to serve the latest build, but block until it's done)
- The second step is to add some code to your JavaScript that subscribes to the `/esbuild` server-sent event source.
  When you get the change event, the page will reload with the latest version of the app.

For details see `esbuild.dev.mjs`

```sh
npm install # to install all dependencies
npm run dev # to build & serve the apps
```

### Production build

```sh
npm install # to install all dependencies
npm run pckg:release # to release patch version (default)
npm run pckg:publish # to publish npm package
```

#### Other

To release minor or major version of the apps package use following commands.

```sh
npm run pckg:release -- --release-as minor # Release minor version. E.g. 1.0.23 -> 1.1.0
npm run pckg:release -- --release-as major # Release major version. E.g. 1.0.23 -> 2.0.0
```

## Issue reporting

Please create well-written issue [here](https://https://github.com/galacticcouncil/apps/issues/new). It makes it easier to find & fix the problem accordingly.
