# Webkit

## The `uigc-base` `style` Tag

Upon `boot`, the UIGC Web Components framework creates a `<style uigc-base>` tag in the `<head>` section in order to load the custom properties for e.g. scrollbar.

For example:

```html
<style uigc-base="">
  :root {
    --scrollbar-url: url('assets/img/scrollbar.svg');
  }
</style>
```

**Important:** Notice the `uigc-base` attribute. It is unique by UIGC Web Components.
