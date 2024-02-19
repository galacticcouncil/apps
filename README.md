# Galactic Apps

Collection of views & components for seamless interaction with HydraDX & Basilisk chains.

## Project Structure

<pre>
<a href=".">Apps</a>: Galactic Apps monorepo.
├──<a href="./packages/apps/">Apps</a>: View & Interaction layer.
├──<a href="./packages/ui/">UI Kit</a>: UI Component library.
</pre>

## Local Development and Build

### Requirements

- [Node.js](https://nodejs.org/) (**version 18 or higher**)

### Local development

1. Link local modules

```sh
npm run link
```

2. Build packages

- Build dist (with types)

```sh
npm run build
```

- Build & watch (js only + hot reloading)

```sh
npm run build:watch
```

3. Go to pages and run web dev server

- <a href="./pages/api-viewer/">Component API Viewer</a></br>
- <a href="./pages/apps-web/">Apps Playground</a></br>

```sh
npm run dev
```

## Live [master]

Visit https://galactic-apps.netlify.app/

## Issue reporting

In case of unexpected sdk behaviour, please create well-written issue [here](https://https://github.com/galacticcouncil/apps/issues/new). It makes it easier to find & fix the problem accordingly.
