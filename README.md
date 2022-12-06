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

### Notification Center

Display app notifications (toast) and related history (drawer) based on slotted component event.

#### API

```js
this.dispatchEvent(new CustomEvent() < Notification > ('gc:notification', message));
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
export type Notification = {
  id: string,
  timestamp: number,
  message: string | TemplateResult,
  type: NotificationType,
  toast: boolean,
};

export enum NotificationType {
  success = 'success',
  error = 'error',
  progress = 'progress',
  default = '',
}
```

### Transaction Center

Display transaction status based on slotted component event.

#### API

```js
this.dispatchEvent(new CustomEvent() < Notification > ('gc:tx:broadcasted', message));
this.dispatchEvent(new CustomEvent() < Notification > ('gc:tx:submitted', message));
this.dispatchEvent(new CustomEvent() < Notification > ('gc:tx:failed', message));
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
export type Notification = {
  id: string,
  timestamp: number,
  message: string | TemplateResult,
  type: NotificationType,
  toast: boolean,
};

export enum NotificationType {
  success = 'success',
  error = 'error',
  progress = 'progress',
  default = '',
}
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

| Property        | Description      | Required |
| --------------- | ---------------- | -------- |
| apiAddress      | chain ws address | true     |
| accountAddress  | account address  | false    |
| accountProvider | account provider | false    |
| accountName     | account name     | false    |
| pools           | list of pools    | false    |

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

| Property        | Description      | Required |
| --------------- | ---------------- | -------- |
| apiAddress      | chain ws address | true     |
| accountAddress  | account address  | false    |
| accountProvider | account provider | false    |
| accountName     | account name     | false    |
| pools           | list of pools    | false    |

## Live [master]

Visit https://classy-sfogliatella-214c28.netlify.app

## Local Development and Build

### Requirements

- [Node.js](https://nodejs.org/) (**version 18 or higher**)

### Run local DEV

```sh
npm install # to install all dependencies
npm run dev # to build & serve the apps
```

### PROD build

```sh
npm run cleanup # to cleanup the namespace
npm run package:prod # to build library & web bundle
```

## Issue reporting

Please create well-written issue [here](https://https://github.com/galacticcouncil/apps/issues/new). It makes it easier to find & fix the problem accordingly.
