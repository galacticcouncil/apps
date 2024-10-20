# UIGC Web Components

[![npm version](https://img.shields.io/npm/v/@galacticcouncil/ui.svg)](https://www.npmjs.com/package/@galacticcouncil/ui)

## What are [UIGC Web Components]?

- Collection of **reusable UI elements** crafted to ease Basilisk & Hydration chains integration driven by a **lit framework** (~400kb unpacked size).
- Usable with any current or future **web development framework**.
- Created and maintained by [Galactic Council](https://galacticcouncil.io/).

## Why web components?

- **Future-proof**: _web standards_, compatible with any web development framework.
- **Encapsulated**: Stable in any environment and suitable not only for apps, but also for _libraries and micro-frontends_.
- **Elegant**: _custom HTML elements_, hide implementation complexity behind a single HTML tag, easy to use with the standard DOM APIs.

## Demo & Preview

```sh
  npm run dev
```

## How to Use

1. Install the NPM module

   ```sh
   npm install @galacticcouncil/ui
   ```

2. Import the component ui to your app:

   ```js
   import '@galacticcouncil/ui';
   ```

3. Use the UIGC Web Component

   ```html
   <uigc-alert variant="success"></uigc-alert>
   ```

### Customization

For framework customization please see following sections:

- [Font](https://github.com/galacticcouncil/apps/packages/ui/blob/master/doc/font.md)
- [Base](https://github.com/galacticcouncil/apps/packages/ui/blob/master/doc/base.md)

## Browser Support

UIGC Web Components are supported by all major modern browsers.

| Browser | Supported versions |
| ------- | ------------------ |
| Chrome  | Latest             |
| Firefox | Latest             |
| Safari  | Latest             |
| Edge    | Latest             |
