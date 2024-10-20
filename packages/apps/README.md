# Galactic Apps

[![npm version](https://img.shields.io/npm/v/@galacticcouncil/apps.svg)](https://www.npmjs.com/package/@galacticcouncil/apps)

View & interaction layer with Hydration & Basilisk chains.

## Overview

| Component           | Name (import)      | Custom element         |
| ------------------- | ------------------ | ---------------------- |
| Notification Center | NotificationCenter | gc-notification-center |
| Transaction Center  | TransactionCenter  | gc-transaction-center  |
| Trade App           | TradeApp           | gc-trade               |
| Dca App             | DcaApp             | gc-dca                 |
| Yield App           | YieldApp           | gc-yield               |
| Xcm App             | XcmApp             | gc-xcm                 |
| Bonds App           | BondsApp           | gc-bonds               |

### Notification Center

Display app notifications (toast) and related history (drawer) based on slotted component event.

#### API

```js
this.dispatchEvent(
  new CustomEvent() < Notification > ('gc:notification:new', message),
);
```

#### Types

| Attribute | Description              |
| --------- | ------------------------ |
| id        | unique notification id   |
| timestamp | unix timestamp           |
| message   | string or html template  |
| type      | notification type        |
| toast     | whether to display toast |

For type signature visit [types.ts](src/signer/types.ts)<br />

### Transaction Center

Process transaction & display status based on slotted component event. Dispatch result to Notification center.

#### API

```js
this.dispatchEvent(new CustomEvent() < TxInfo > ('gc:tx:new', message)); // on chain tx
this.dispatchEvent(new CustomEvent() < TxInfo > ('gc:xcm:new', message)); // cross chain tx
```

#### Types

| Attribute    | Description                       |
| ------------ | --------------------------------- |
| account      | User account (wallet)             |
| transaction  | Transaction info (extrinsic, hex) |
| notification | Notification center metadata      |
| meta         | Transaction metadata              |

For type signature visit [types.ts](src/signer/types.ts)<br />

### Trade App

Bare trade app without tx & notification center.

#### API

```html
<gc-trade
  apiAddress="wss://rococo-basilisk-rpc.hydration.dev"
  accountAddress="your_account_address"
  accountProvider="polkadot-js"
  accountName="your_account_name"
  pools="XYK,LBP"></gc-trade>
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
<gc-xcm
  srcChain="polkadot"
  destChain="hydration"
  asset="dot"
  accountAddress="your_account_address"
  accountProvider="polkadot-js"
  accountName="your_account_name"></gc-xcm>
```

#### Properties

| Property        | Description       | Required |
| --------------- | ----------------- | -------- |
| accountAddress  | account address   | false    |
| accountProvider | account provider  | false    |
| accountName     | account name      | false    |
| chains          | listed chains     | true     |
| srcChain        | source chain      | true     |
| destChain       | destination chain | true     |
