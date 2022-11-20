# Webkit

## The `uigc-webkit` `style` Tag

Upon `boot`, the UIGC Web Components framework creates a `<style uigc-webkit>` tag in the `<head>` section in order to load the custom webkit design as scrollbar.

For example:

```html
<style uigc-webkit="">
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
</style>
```

**Important:** Notice the `uigc-webkit` attribute. It is unique by UIGC Web Components.
