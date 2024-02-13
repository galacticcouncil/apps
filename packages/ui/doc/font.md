# Font

## The `uigc-font-face` Font-Face `style` Tag

Upon `boot`, the UIGC Web Components framework creates a `<style uigc-font-face>` tag in the `<head>` section in order to load the fonts.

For example:

```html
<style type="text/css" uigc-font-face="">
  @font-face {
    font-family: 'SatoshiVariable';
    src: url('assets/font/Satoshi-Variable.ttf') format('truetype');
    font-display: auto;
    font-weight: 100 900;
  }
</style>
```

**Important:** Notice the `uigc-font-face` attribute. It is unique by UIGC Web Components.

## Customization

You might need to customize fonts for several reasons:

- To provide different paths for the fonts (e.g. no public internet connection on the server).
- To provide additional declarations inside `@font-face`.

To do that, just create a `<style type="text/css" uigc-font-face="">` tag in the `head` of your HTML page and
provide content for it.

When the UIGC Web Components framework boots, it will detect the existence of the tag by the `uigc-font-face`
attribute, and skip the creation process. Custom sheet will be used instead.
