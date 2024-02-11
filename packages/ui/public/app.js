var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i7 = decorators.length - 1, decorator; i7 >= 0; i7--)
    if (decorator = decorators[i7])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp(target, key, result);
  return result;
};
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};

// ../../node_modules/dompurify/dist/purify.js
var require_purify = __commonJS({
  "../../node_modules/dompurify/dist/purify.js"(exports, module) {
    (function(global, factory) {
      typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() : typeof define === "function" && define.amd ? define(factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, global.DOMPurify = factory());
    })(exports, function() {
      "use strict";
      function _typeof(obj) {
        "@babel/helpers - typeof";
        return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj2) {
          return typeof obj2;
        } : function(obj2) {
          return obj2 && "function" == typeof Symbol && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
        }, _typeof(obj);
      }
      function _setPrototypeOf(o12, p2) {
        _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf2(o13, p3) {
          o13.__proto__ = p3;
          return o13;
        };
        return _setPrototypeOf(o12, p2);
      }
      function _isNativeReflectConstruct() {
        if (typeof Reflect === "undefined" || !Reflect.construct)
          return false;
        if (Reflect.construct.sham)
          return false;
        if (typeof Proxy === "function")
          return true;
        try {
          Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
          }));
          return true;
        } catch (e10) {
          return false;
        }
      }
      function _construct(Parent, args, Class) {
        if (_isNativeReflectConstruct()) {
          _construct = Reflect.construct;
        } else {
          _construct = function _construct2(Parent2, args2, Class2) {
            var a4 = [null];
            a4.push.apply(a4, args2);
            var Constructor = Function.bind.apply(Parent2, a4);
            var instance = new Constructor();
            if (Class2)
              _setPrototypeOf(instance, Class2.prototype);
            return instance;
          };
        }
        return _construct.apply(null, arguments);
      }
      function _toConsumableArray(arr) {
        return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
      }
      function _arrayWithoutHoles(arr) {
        if (Array.isArray(arr))
          return _arrayLikeToArray(arr);
      }
      function _iterableToArray(iter) {
        if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null)
          return Array.from(iter);
      }
      function _unsupportedIterableToArray(o12, minLen) {
        if (!o12)
          return;
        if (typeof o12 === "string")
          return _arrayLikeToArray(o12, minLen);
        var n10 = Object.prototype.toString.call(o12).slice(8, -1);
        if (n10 === "Object" && o12.constructor)
          n10 = o12.constructor.name;
        if (n10 === "Map" || n10 === "Set")
          return Array.from(o12);
        if (n10 === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n10))
          return _arrayLikeToArray(o12, minLen);
      }
      function _arrayLikeToArray(arr, len) {
        if (len == null || len > arr.length)
          len = arr.length;
        for (var i7 = 0, arr2 = new Array(len); i7 < len; i7++)
          arr2[i7] = arr[i7];
        return arr2;
      }
      function _nonIterableSpread() {
        throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
      }
      var hasOwnProperty = Object.hasOwnProperty, setPrototypeOf = Object.setPrototypeOf, isFrozen = Object.isFrozen, getPrototypeOf = Object.getPrototypeOf, getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
      var freeze = Object.freeze, seal = Object.seal, create = Object.create;
      var _ref = typeof Reflect !== "undefined" && Reflect, apply = _ref.apply, construct = _ref.construct;
      if (!apply) {
        apply = function apply2(fun, thisValue, args) {
          return fun.apply(thisValue, args);
        };
      }
      if (!freeze) {
        freeze = function freeze2(x2) {
          return x2;
        };
      }
      if (!seal) {
        seal = function seal2(x2) {
          return x2;
        };
      }
      if (!construct) {
        construct = function construct2(Func, args) {
          return _construct(Func, _toConsumableArray(args));
        };
      }
      var arrayForEach = unapply(Array.prototype.forEach);
      var arrayPop = unapply(Array.prototype.pop);
      var arrayPush = unapply(Array.prototype.push);
      var stringToLowerCase = unapply(String.prototype.toLowerCase);
      var stringToString = unapply(String.prototype.toString);
      var stringMatch = unapply(String.prototype.match);
      var stringReplace = unapply(String.prototype.replace);
      var stringIndexOf = unapply(String.prototype.indexOf);
      var stringTrim = unapply(String.prototype.trim);
      var regExpTest = unapply(RegExp.prototype.test);
      var typeErrorCreate = unconstruct(TypeError);
      function unapply(func) {
        return function(thisArg) {
          for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
          }
          return apply(func, thisArg, args);
        };
      }
      function unconstruct(func) {
        return function() {
          for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
          }
          return construct(func, args);
        };
      }
      function addToSet(set, array, transformCaseFunc) {
        var _transformCaseFunc;
        transformCaseFunc = (_transformCaseFunc = transformCaseFunc) !== null && _transformCaseFunc !== void 0 ? _transformCaseFunc : stringToLowerCase;
        if (setPrototypeOf) {
          setPrototypeOf(set, null);
        }
        var l7 = array.length;
        while (l7--) {
          var element = array[l7];
          if (typeof element === "string") {
            var lcElement = transformCaseFunc(element);
            if (lcElement !== element) {
              if (!isFrozen(array)) {
                array[l7] = lcElement;
              }
              element = lcElement;
            }
          }
          set[element] = true;
        }
        return set;
      }
      function clone(object) {
        var newObject = create(null);
        var property;
        for (property in object) {
          if (apply(hasOwnProperty, object, [property]) === true) {
            newObject[property] = object[property];
          }
        }
        return newObject;
      }
      function lookupGetter(object, prop) {
        while (object !== null) {
          var desc = getOwnPropertyDescriptor(object, prop);
          if (desc) {
            if (desc.get) {
              return unapply(desc.get);
            }
            if (typeof desc.value === "function") {
              return unapply(desc.value);
            }
          }
          object = getPrototypeOf(object);
        }
        function fallbackValue(element) {
          console.warn("fallback value for", element);
          return null;
        }
        return fallbackValue;
      }
      var html$1 = freeze(["a", "abbr", "acronym", "address", "area", "article", "aside", "audio", "b", "bdi", "bdo", "big", "blink", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "content", "data", "datalist", "dd", "decorator", "del", "details", "dfn", "dialog", "dir", "div", "dl", "dt", "element", "em", "fieldset", "figcaption", "figure", "font", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "img", "input", "ins", "kbd", "label", "legend", "li", "main", "map", "mark", "marquee", "menu", "menuitem", "meter", "nav", "nobr", "ol", "optgroup", "option", "output", "p", "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "section", "select", "shadow", "small", "source", "spacer", "span", "strike", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "tr", "track", "tt", "u", "ul", "var", "video", "wbr"]);
      var svg$1 = freeze(["svg", "a", "altglyph", "altglyphdef", "altglyphitem", "animatecolor", "animatemotion", "animatetransform", "circle", "clippath", "defs", "desc", "ellipse", "filter", "font", "g", "glyph", "glyphref", "hkern", "image", "line", "lineargradient", "marker", "mask", "metadata", "mpath", "path", "pattern", "polygon", "polyline", "radialgradient", "rect", "stop", "style", "switch", "symbol", "text", "textpath", "title", "tref", "tspan", "view", "vkern"]);
      var svgFilters = freeze(["feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feDistantLight", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feImage", "feMerge", "feMergeNode", "feMorphology", "feOffset", "fePointLight", "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence"]);
      var svgDisallowed = freeze(["animate", "color-profile", "cursor", "discard", "fedropshadow", "font-face", "font-face-format", "font-face-name", "font-face-src", "font-face-uri", "foreignobject", "hatch", "hatchpath", "mesh", "meshgradient", "meshpatch", "meshrow", "missing-glyph", "script", "set", "solidcolor", "unknown", "use"]);
      var mathMl$1 = freeze(["math", "menclose", "merror", "mfenced", "mfrac", "mglyph", "mi", "mlabeledtr", "mmultiscripts", "mn", "mo", "mover", "mpadded", "mphantom", "mroot", "mrow", "ms", "mspace", "msqrt", "mstyle", "msub", "msup", "msubsup", "mtable", "mtd", "mtext", "mtr", "munder", "munderover"]);
      var mathMlDisallowed = freeze(["maction", "maligngroup", "malignmark", "mlongdiv", "mscarries", "mscarry", "msgroup", "mstack", "msline", "msrow", "semantics", "annotation", "annotation-xml", "mprescripts", "none"]);
      var text = freeze(["#text"]);
      var html2 = freeze(["accept", "action", "align", "alt", "autocapitalize", "autocomplete", "autopictureinpicture", "autoplay", "background", "bgcolor", "border", "capture", "cellpadding", "cellspacing", "checked", "cite", "class", "clear", "color", "cols", "colspan", "controls", "controlslist", "coords", "crossorigin", "datetime", "decoding", "default", "dir", "disabled", "disablepictureinpicture", "disableremoteplayback", "download", "draggable", "enctype", "enterkeyhint", "face", "for", "headers", "height", "hidden", "high", "href", "hreflang", "id", "inputmode", "integrity", "ismap", "kind", "label", "lang", "list", "loading", "loop", "low", "max", "maxlength", "media", "method", "min", "minlength", "multiple", "muted", "name", "nonce", "noshade", "novalidate", "nowrap", "open", "optimum", "pattern", "placeholder", "playsinline", "poster", "preload", "pubdate", "radiogroup", "readonly", "rel", "required", "rev", "reversed", "role", "rows", "rowspan", "spellcheck", "scope", "selected", "shape", "size", "sizes", "span", "srclang", "start", "src", "srcset", "step", "style", "summary", "tabindex", "title", "translate", "type", "usemap", "valign", "value", "width", "xmlns", "slot"]);
      var svg = freeze(["accent-height", "accumulate", "additive", "alignment-baseline", "ascent", "attributename", "attributetype", "azimuth", "basefrequency", "baseline-shift", "begin", "bias", "by", "class", "clip", "clippathunits", "clip-path", "clip-rule", "color", "color-interpolation", "color-interpolation-filters", "color-profile", "color-rendering", "cx", "cy", "d", "dx", "dy", "diffuseconstant", "direction", "display", "divisor", "dur", "edgemode", "elevation", "end", "fill", "fill-opacity", "fill-rule", "filter", "filterunits", "flood-color", "flood-opacity", "font-family", "font-size", "font-size-adjust", "font-stretch", "font-style", "font-variant", "font-weight", "fx", "fy", "g1", "g2", "glyph-name", "glyphref", "gradientunits", "gradienttransform", "height", "href", "id", "image-rendering", "in", "in2", "k", "k1", "k2", "k3", "k4", "kerning", "keypoints", "keysplines", "keytimes", "lang", "lengthadjust", "letter-spacing", "kernelmatrix", "kernelunitlength", "lighting-color", "local", "marker-end", "marker-mid", "marker-start", "markerheight", "markerunits", "markerwidth", "maskcontentunits", "maskunits", "max", "mask", "media", "method", "mode", "min", "name", "numoctaves", "offset", "operator", "opacity", "order", "orient", "orientation", "origin", "overflow", "paint-order", "path", "pathlength", "patterncontentunits", "patterntransform", "patternunits", "points", "preservealpha", "preserveaspectratio", "primitiveunits", "r", "rx", "ry", "radius", "refx", "refy", "repeatcount", "repeatdur", "restart", "result", "rotate", "scale", "seed", "shape-rendering", "specularconstant", "specularexponent", "spreadmethod", "startoffset", "stddeviation", "stitchtiles", "stop-color", "stop-opacity", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke", "stroke-width", "style", "surfacescale", "systemlanguage", "tabindex", "targetx", "targety", "transform", "transform-origin", "text-anchor", "text-decoration", "text-rendering", "textlength", "type", "u1", "u2", "unicode", "values", "viewbox", "visibility", "version", "vert-adv-y", "vert-origin-x", "vert-origin-y", "width", "word-spacing", "wrap", "writing-mode", "xchannelselector", "ychannelselector", "x", "x1", "x2", "xmlns", "y", "y1", "y2", "z", "zoomandpan"]);
      var mathMl = freeze(["accent", "accentunder", "align", "bevelled", "close", "columnsalign", "columnlines", "columnspan", "denomalign", "depth", "dir", "display", "displaystyle", "encoding", "fence", "frame", "height", "href", "id", "largeop", "length", "linethickness", "lspace", "lquote", "mathbackground", "mathcolor", "mathsize", "mathvariant", "maxsize", "minsize", "movablelimits", "notation", "numalign", "open", "rowalign", "rowlines", "rowspacing", "rowspan", "rspace", "rquote", "scriptlevel", "scriptminsize", "scriptsizemultiplier", "selection", "separator", "separators", "stretchy", "subscriptshift", "supscriptshift", "symmetric", "voffset", "width", "xmlns"]);
      var xml = freeze(["xlink:href", "xml:id", "xlink:title", "xml:space", "xmlns:xlink"]);
      var MUSTACHE_EXPR = seal(/\{\{[\w\W]*|[\w\W]*\}\}/gm);
      var ERB_EXPR = seal(/<%[\w\W]*|[\w\W]*%>/gm);
      var TMPLIT_EXPR = seal(/\${[\w\W]*}/gm);
      var DATA_ATTR = seal(/^data-[\-\w.\u00B7-\uFFFF]/);
      var ARIA_ATTR = seal(/^aria-[\-\w]+$/);
      var IS_ALLOWED_URI = seal(
        /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
        // eslint-disable-line no-useless-escape
      );
      var IS_SCRIPT_OR_DATA = seal(/^(?:\w+script|data):/i);
      var ATTR_WHITESPACE = seal(
        /[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g
        // eslint-disable-line no-control-regex
      );
      var DOCTYPE_NAME = seal(/^html$/i);
      var getGlobal = function getGlobal2() {
        return typeof window === "undefined" ? null : window;
      };
      var _createTrustedTypesPolicy = function _createTrustedTypesPolicy2(trustedTypes, document2) {
        if (_typeof(trustedTypes) !== "object" || typeof trustedTypes.createPolicy !== "function") {
          return null;
        }
        var suffix = null;
        var ATTR_NAME = "data-tt-policy-suffix";
        if (document2.currentScript && document2.currentScript.hasAttribute(ATTR_NAME)) {
          suffix = document2.currentScript.getAttribute(ATTR_NAME);
        }
        var policyName = "dompurify" + (suffix ? "#" + suffix : "");
        try {
          return trustedTypes.createPolicy(policyName, {
            createHTML: function createHTML(html3) {
              return html3;
            },
            createScriptURL: function createScriptURL(scriptUrl) {
              return scriptUrl;
            }
          });
        } catch (_2) {
          console.warn("TrustedTypes policy " + policyName + " could not be created.");
          return null;
        }
      };
      function createDOMPurify() {
        var window2 = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : getGlobal();
        var DOMPurify2 = function DOMPurify3(root) {
          return createDOMPurify(root);
        };
        DOMPurify2.version = "2.4.7";
        DOMPurify2.removed = [];
        if (!window2 || !window2.document || window2.document.nodeType !== 9) {
          DOMPurify2.isSupported = false;
          return DOMPurify2;
        }
        var originalDocument = window2.document;
        var document2 = window2.document;
        var DocumentFragment = window2.DocumentFragment, HTMLTemplateElement2 = window2.HTMLTemplateElement, Node2 = window2.Node, Element2 = window2.Element, NodeFilter = window2.NodeFilter, _window$NamedNodeMap = window2.NamedNodeMap, NamedNodeMap = _window$NamedNodeMap === void 0 ? window2.NamedNodeMap || window2.MozNamedAttrMap : _window$NamedNodeMap, HTMLFormElement = window2.HTMLFormElement, DOMParser = window2.DOMParser, trustedTypes = window2.trustedTypes;
        var ElementPrototype = Element2.prototype;
        var cloneNode = lookupGetter(ElementPrototype, "cloneNode");
        var getNextSibling = lookupGetter(ElementPrototype, "nextSibling");
        var getChildNodes = lookupGetter(ElementPrototype, "childNodes");
        var getParentNode2 = lookupGetter(ElementPrototype, "parentNode");
        if (typeof HTMLTemplateElement2 === "function") {
          var template = document2.createElement("template");
          if (template.content && template.content.ownerDocument) {
            document2 = template.content.ownerDocument;
          }
        }
        var trustedTypesPolicy = _createTrustedTypesPolicy(trustedTypes, originalDocument);
        var emptyHTML = trustedTypesPolicy ? trustedTypesPolicy.createHTML("") : "";
        var _document = document2, implementation = _document.implementation, createNodeIterator = _document.createNodeIterator, createDocumentFragment = _document.createDocumentFragment, getElementsByTagName = _document.getElementsByTagName;
        var importNode = originalDocument.importNode;
        var documentMode = {};
        try {
          documentMode = clone(document2).documentMode ? document2.documentMode : {};
        } catch (_2) {
        }
        var hooks = {};
        DOMPurify2.isSupported = typeof getParentNode2 === "function" && implementation && implementation.createHTMLDocument !== void 0 && documentMode !== 9;
        var MUSTACHE_EXPR$1 = MUSTACHE_EXPR, ERB_EXPR$1 = ERB_EXPR, TMPLIT_EXPR$1 = TMPLIT_EXPR, DATA_ATTR$1 = DATA_ATTR, ARIA_ATTR$1 = ARIA_ATTR, IS_SCRIPT_OR_DATA$1 = IS_SCRIPT_OR_DATA, ATTR_WHITESPACE$1 = ATTR_WHITESPACE;
        var IS_ALLOWED_URI$1 = IS_ALLOWED_URI;
        var ALLOWED_TAGS = null;
        var DEFAULT_ALLOWED_TAGS = addToSet({}, [].concat(_toConsumableArray(html$1), _toConsumableArray(svg$1), _toConsumableArray(svgFilters), _toConsumableArray(mathMl$1), _toConsumableArray(text)));
        var ALLOWED_ATTR = null;
        var DEFAULT_ALLOWED_ATTR = addToSet({}, [].concat(_toConsumableArray(html2), _toConsumableArray(svg), _toConsumableArray(mathMl), _toConsumableArray(xml)));
        var CUSTOM_ELEMENT_HANDLING = Object.seal(Object.create(null, {
          tagNameCheck: {
            writable: true,
            configurable: false,
            enumerable: true,
            value: null
          },
          attributeNameCheck: {
            writable: true,
            configurable: false,
            enumerable: true,
            value: null
          },
          allowCustomizedBuiltInElements: {
            writable: true,
            configurable: false,
            enumerable: true,
            value: false
          }
        }));
        var FORBID_TAGS = null;
        var FORBID_ATTR = null;
        var ALLOW_ARIA_ATTR = true;
        var ALLOW_DATA_ATTR = true;
        var ALLOW_UNKNOWN_PROTOCOLS = false;
        var ALLOW_SELF_CLOSE_IN_ATTR = true;
        var SAFE_FOR_TEMPLATES = false;
        var WHOLE_DOCUMENT = false;
        var SET_CONFIG = false;
        var FORCE_BODY = false;
        var RETURN_DOM = false;
        var RETURN_DOM_FRAGMENT = false;
        var RETURN_TRUSTED_TYPE = false;
        var SANITIZE_DOM = true;
        var SANITIZE_NAMED_PROPS = false;
        var SANITIZE_NAMED_PROPS_PREFIX = "user-content-";
        var KEEP_CONTENT = true;
        var IN_PLACE = false;
        var USE_PROFILES = {};
        var FORBID_CONTENTS = null;
        var DEFAULT_FORBID_CONTENTS = addToSet({}, ["annotation-xml", "audio", "colgroup", "desc", "foreignobject", "head", "iframe", "math", "mi", "mn", "mo", "ms", "mtext", "noembed", "noframes", "noscript", "plaintext", "script", "style", "svg", "template", "thead", "title", "video", "xmp"]);
        var DATA_URI_TAGS = null;
        var DEFAULT_DATA_URI_TAGS = addToSet({}, ["audio", "video", "img", "source", "image", "track"]);
        var URI_SAFE_ATTRIBUTES = null;
        var DEFAULT_URI_SAFE_ATTRIBUTES = addToSet({}, ["alt", "class", "for", "id", "label", "name", "pattern", "placeholder", "role", "summary", "title", "value", "style", "xmlns"]);
        var MATHML_NAMESPACE = "http://www.w3.org/1998/Math/MathML";
        var SVG_NAMESPACE = "http://www.w3.org/2000/svg";
        var HTML_NAMESPACE = "http://www.w3.org/1999/xhtml";
        var NAMESPACE = HTML_NAMESPACE;
        var IS_EMPTY_INPUT = false;
        var ALLOWED_NAMESPACES = null;
        var DEFAULT_ALLOWED_NAMESPACES = addToSet({}, [MATHML_NAMESPACE, SVG_NAMESPACE, HTML_NAMESPACE], stringToString);
        var PARSER_MEDIA_TYPE;
        var SUPPORTED_PARSER_MEDIA_TYPES = ["application/xhtml+xml", "text/html"];
        var DEFAULT_PARSER_MEDIA_TYPE = "text/html";
        var transformCaseFunc;
        var CONFIG = null;
        var formElement = document2.createElement("form");
        var isRegexOrFunction = function isRegexOrFunction2(testValue) {
          return testValue instanceof RegExp || testValue instanceof Function;
        };
        var _parseConfig = function _parseConfig2(cfg) {
          if (CONFIG && CONFIG === cfg) {
            return;
          }
          if (!cfg || _typeof(cfg) !== "object") {
            cfg = {};
          }
          cfg = clone(cfg);
          PARSER_MEDIA_TYPE = // eslint-disable-next-line unicorn/prefer-includes
          SUPPORTED_PARSER_MEDIA_TYPES.indexOf(cfg.PARSER_MEDIA_TYPE) === -1 ? PARSER_MEDIA_TYPE = DEFAULT_PARSER_MEDIA_TYPE : PARSER_MEDIA_TYPE = cfg.PARSER_MEDIA_TYPE;
          transformCaseFunc = PARSER_MEDIA_TYPE === "application/xhtml+xml" ? stringToString : stringToLowerCase;
          ALLOWED_TAGS = "ALLOWED_TAGS" in cfg ? addToSet({}, cfg.ALLOWED_TAGS, transformCaseFunc) : DEFAULT_ALLOWED_TAGS;
          ALLOWED_ATTR = "ALLOWED_ATTR" in cfg ? addToSet({}, cfg.ALLOWED_ATTR, transformCaseFunc) : DEFAULT_ALLOWED_ATTR;
          ALLOWED_NAMESPACES = "ALLOWED_NAMESPACES" in cfg ? addToSet({}, cfg.ALLOWED_NAMESPACES, stringToString) : DEFAULT_ALLOWED_NAMESPACES;
          URI_SAFE_ATTRIBUTES = "ADD_URI_SAFE_ATTR" in cfg ? addToSet(
            clone(DEFAULT_URI_SAFE_ATTRIBUTES),
            // eslint-disable-line indent
            cfg.ADD_URI_SAFE_ATTR,
            // eslint-disable-line indent
            transformCaseFunc
            // eslint-disable-line indent
          ) : DEFAULT_URI_SAFE_ATTRIBUTES;
          DATA_URI_TAGS = "ADD_DATA_URI_TAGS" in cfg ? addToSet(
            clone(DEFAULT_DATA_URI_TAGS),
            // eslint-disable-line indent
            cfg.ADD_DATA_URI_TAGS,
            // eslint-disable-line indent
            transformCaseFunc
            // eslint-disable-line indent
          ) : DEFAULT_DATA_URI_TAGS;
          FORBID_CONTENTS = "FORBID_CONTENTS" in cfg ? addToSet({}, cfg.FORBID_CONTENTS, transformCaseFunc) : DEFAULT_FORBID_CONTENTS;
          FORBID_TAGS = "FORBID_TAGS" in cfg ? addToSet({}, cfg.FORBID_TAGS, transformCaseFunc) : {};
          FORBID_ATTR = "FORBID_ATTR" in cfg ? addToSet({}, cfg.FORBID_ATTR, transformCaseFunc) : {};
          USE_PROFILES = "USE_PROFILES" in cfg ? cfg.USE_PROFILES : false;
          ALLOW_ARIA_ATTR = cfg.ALLOW_ARIA_ATTR !== false;
          ALLOW_DATA_ATTR = cfg.ALLOW_DATA_ATTR !== false;
          ALLOW_UNKNOWN_PROTOCOLS = cfg.ALLOW_UNKNOWN_PROTOCOLS || false;
          ALLOW_SELF_CLOSE_IN_ATTR = cfg.ALLOW_SELF_CLOSE_IN_ATTR !== false;
          SAFE_FOR_TEMPLATES = cfg.SAFE_FOR_TEMPLATES || false;
          WHOLE_DOCUMENT = cfg.WHOLE_DOCUMENT || false;
          RETURN_DOM = cfg.RETURN_DOM || false;
          RETURN_DOM_FRAGMENT = cfg.RETURN_DOM_FRAGMENT || false;
          RETURN_TRUSTED_TYPE = cfg.RETURN_TRUSTED_TYPE || false;
          FORCE_BODY = cfg.FORCE_BODY || false;
          SANITIZE_DOM = cfg.SANITIZE_DOM !== false;
          SANITIZE_NAMED_PROPS = cfg.SANITIZE_NAMED_PROPS || false;
          KEEP_CONTENT = cfg.KEEP_CONTENT !== false;
          IN_PLACE = cfg.IN_PLACE || false;
          IS_ALLOWED_URI$1 = cfg.ALLOWED_URI_REGEXP || IS_ALLOWED_URI$1;
          NAMESPACE = cfg.NAMESPACE || HTML_NAMESPACE;
          CUSTOM_ELEMENT_HANDLING = cfg.CUSTOM_ELEMENT_HANDLING || {};
          if (cfg.CUSTOM_ELEMENT_HANDLING && isRegexOrFunction(cfg.CUSTOM_ELEMENT_HANDLING.tagNameCheck)) {
            CUSTOM_ELEMENT_HANDLING.tagNameCheck = cfg.CUSTOM_ELEMENT_HANDLING.tagNameCheck;
          }
          if (cfg.CUSTOM_ELEMENT_HANDLING && isRegexOrFunction(cfg.CUSTOM_ELEMENT_HANDLING.attributeNameCheck)) {
            CUSTOM_ELEMENT_HANDLING.attributeNameCheck = cfg.CUSTOM_ELEMENT_HANDLING.attributeNameCheck;
          }
          if (cfg.CUSTOM_ELEMENT_HANDLING && typeof cfg.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements === "boolean") {
            CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements = cfg.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements;
          }
          if (SAFE_FOR_TEMPLATES) {
            ALLOW_DATA_ATTR = false;
          }
          if (RETURN_DOM_FRAGMENT) {
            RETURN_DOM = true;
          }
          if (USE_PROFILES) {
            ALLOWED_TAGS = addToSet({}, _toConsumableArray(text));
            ALLOWED_ATTR = [];
            if (USE_PROFILES.html === true) {
              addToSet(ALLOWED_TAGS, html$1);
              addToSet(ALLOWED_ATTR, html2);
            }
            if (USE_PROFILES.svg === true) {
              addToSet(ALLOWED_TAGS, svg$1);
              addToSet(ALLOWED_ATTR, svg);
              addToSet(ALLOWED_ATTR, xml);
            }
            if (USE_PROFILES.svgFilters === true) {
              addToSet(ALLOWED_TAGS, svgFilters);
              addToSet(ALLOWED_ATTR, svg);
              addToSet(ALLOWED_ATTR, xml);
            }
            if (USE_PROFILES.mathMl === true) {
              addToSet(ALLOWED_TAGS, mathMl$1);
              addToSet(ALLOWED_ATTR, mathMl);
              addToSet(ALLOWED_ATTR, xml);
            }
          }
          if (cfg.ADD_TAGS) {
            if (ALLOWED_TAGS === DEFAULT_ALLOWED_TAGS) {
              ALLOWED_TAGS = clone(ALLOWED_TAGS);
            }
            addToSet(ALLOWED_TAGS, cfg.ADD_TAGS, transformCaseFunc);
          }
          if (cfg.ADD_ATTR) {
            if (ALLOWED_ATTR === DEFAULT_ALLOWED_ATTR) {
              ALLOWED_ATTR = clone(ALLOWED_ATTR);
            }
            addToSet(ALLOWED_ATTR, cfg.ADD_ATTR, transformCaseFunc);
          }
          if (cfg.ADD_URI_SAFE_ATTR) {
            addToSet(URI_SAFE_ATTRIBUTES, cfg.ADD_URI_SAFE_ATTR, transformCaseFunc);
          }
          if (cfg.FORBID_CONTENTS) {
            if (FORBID_CONTENTS === DEFAULT_FORBID_CONTENTS) {
              FORBID_CONTENTS = clone(FORBID_CONTENTS);
            }
            addToSet(FORBID_CONTENTS, cfg.FORBID_CONTENTS, transformCaseFunc);
          }
          if (KEEP_CONTENT) {
            ALLOWED_TAGS["#text"] = true;
          }
          if (WHOLE_DOCUMENT) {
            addToSet(ALLOWED_TAGS, ["html", "head", "body"]);
          }
          if (ALLOWED_TAGS.table) {
            addToSet(ALLOWED_TAGS, ["tbody"]);
            delete FORBID_TAGS.tbody;
          }
          if (freeze) {
            freeze(cfg);
          }
          CONFIG = cfg;
        };
        var MATHML_TEXT_INTEGRATION_POINTS = addToSet({}, ["mi", "mo", "mn", "ms", "mtext"]);
        var HTML_INTEGRATION_POINTS = addToSet({}, ["foreignobject", "desc", "title", "annotation-xml"]);
        var COMMON_SVG_AND_HTML_ELEMENTS = addToSet({}, ["title", "style", "font", "a", "script"]);
        var ALL_SVG_TAGS = addToSet({}, svg$1);
        addToSet(ALL_SVG_TAGS, svgFilters);
        addToSet(ALL_SVG_TAGS, svgDisallowed);
        var ALL_MATHML_TAGS = addToSet({}, mathMl$1);
        addToSet(ALL_MATHML_TAGS, mathMlDisallowed);
        var _checkValidNamespace = function _checkValidNamespace2(element) {
          var parent = getParentNode2(element);
          if (!parent || !parent.tagName) {
            parent = {
              namespaceURI: NAMESPACE,
              tagName: "template"
            };
          }
          var tagName = stringToLowerCase(element.tagName);
          var parentTagName = stringToLowerCase(parent.tagName);
          if (!ALLOWED_NAMESPACES[element.namespaceURI]) {
            return false;
          }
          if (element.namespaceURI === SVG_NAMESPACE) {
            if (parent.namespaceURI === HTML_NAMESPACE) {
              return tagName === "svg";
            }
            if (parent.namespaceURI === MATHML_NAMESPACE) {
              return tagName === "svg" && (parentTagName === "annotation-xml" || MATHML_TEXT_INTEGRATION_POINTS[parentTagName]);
            }
            return Boolean(ALL_SVG_TAGS[tagName]);
          }
          if (element.namespaceURI === MATHML_NAMESPACE) {
            if (parent.namespaceURI === HTML_NAMESPACE) {
              return tagName === "math";
            }
            if (parent.namespaceURI === SVG_NAMESPACE) {
              return tagName === "math" && HTML_INTEGRATION_POINTS[parentTagName];
            }
            return Boolean(ALL_MATHML_TAGS[tagName]);
          }
          if (element.namespaceURI === HTML_NAMESPACE) {
            if (parent.namespaceURI === SVG_NAMESPACE && !HTML_INTEGRATION_POINTS[parentTagName]) {
              return false;
            }
            if (parent.namespaceURI === MATHML_NAMESPACE && !MATHML_TEXT_INTEGRATION_POINTS[parentTagName]) {
              return false;
            }
            return !ALL_MATHML_TAGS[tagName] && (COMMON_SVG_AND_HTML_ELEMENTS[tagName] || !ALL_SVG_TAGS[tagName]);
          }
          if (PARSER_MEDIA_TYPE === "application/xhtml+xml" && ALLOWED_NAMESPACES[element.namespaceURI]) {
            return true;
          }
          return false;
        };
        var _forceRemove = function _forceRemove2(node) {
          arrayPush(DOMPurify2.removed, {
            element: node
          });
          try {
            node.parentNode.removeChild(node);
          } catch (_2) {
            try {
              node.outerHTML = emptyHTML;
            } catch (_3) {
              node.remove();
            }
          }
        };
        var _removeAttribute = function _removeAttribute2(name, node) {
          try {
            arrayPush(DOMPurify2.removed, {
              attribute: node.getAttributeNode(name),
              from: node
            });
          } catch (_2) {
            arrayPush(DOMPurify2.removed, {
              attribute: null,
              from: node
            });
          }
          node.removeAttribute(name);
          if (name === "is" && !ALLOWED_ATTR[name]) {
            if (RETURN_DOM || RETURN_DOM_FRAGMENT) {
              try {
                _forceRemove(node);
              } catch (_2) {
              }
            } else {
              try {
                node.setAttribute(name, "");
              } catch (_2) {
              }
            }
          }
        };
        var _initDocument = function _initDocument2(dirty) {
          var doc;
          var leadingWhitespace;
          if (FORCE_BODY) {
            dirty = "<remove></remove>" + dirty;
          } else {
            var matches = stringMatch(dirty, /^[\r\n\t ]+/);
            leadingWhitespace = matches && matches[0];
          }
          if (PARSER_MEDIA_TYPE === "application/xhtml+xml" && NAMESPACE === HTML_NAMESPACE) {
            dirty = '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' + dirty + "</body></html>";
          }
          var dirtyPayload = trustedTypesPolicy ? trustedTypesPolicy.createHTML(dirty) : dirty;
          if (NAMESPACE === HTML_NAMESPACE) {
            try {
              doc = new DOMParser().parseFromString(dirtyPayload, PARSER_MEDIA_TYPE);
            } catch (_2) {
            }
          }
          if (!doc || !doc.documentElement) {
            doc = implementation.createDocument(NAMESPACE, "template", null);
            try {
              doc.documentElement.innerHTML = IS_EMPTY_INPUT ? emptyHTML : dirtyPayload;
            } catch (_2) {
            }
          }
          var body = doc.body || doc.documentElement;
          if (dirty && leadingWhitespace) {
            body.insertBefore(document2.createTextNode(leadingWhitespace), body.childNodes[0] || null);
          }
          if (NAMESPACE === HTML_NAMESPACE) {
            return getElementsByTagName.call(doc, WHOLE_DOCUMENT ? "html" : "body")[0];
          }
          return WHOLE_DOCUMENT ? doc.documentElement : body;
        };
        var _createIterator = function _createIterator2(root) {
          return createNodeIterator.call(
            root.ownerDocument || root,
            root,
            // eslint-disable-next-line no-bitwise
            NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_COMMENT | NodeFilter.SHOW_TEXT,
            null,
            false
          );
        };
        var _isClobbered = function _isClobbered2(elm) {
          return elm instanceof HTMLFormElement && (typeof elm.nodeName !== "string" || typeof elm.textContent !== "string" || typeof elm.removeChild !== "function" || !(elm.attributes instanceof NamedNodeMap) || typeof elm.removeAttribute !== "function" || typeof elm.setAttribute !== "function" || typeof elm.namespaceURI !== "string" || typeof elm.insertBefore !== "function" || typeof elm.hasChildNodes !== "function");
        };
        var _isNode = function _isNode2(object) {
          return _typeof(Node2) === "object" ? object instanceof Node2 : object && _typeof(object) === "object" && typeof object.nodeType === "number" && typeof object.nodeName === "string";
        };
        var _executeHook = function _executeHook2(entryPoint, currentNode, data) {
          if (!hooks[entryPoint]) {
            return;
          }
          arrayForEach(hooks[entryPoint], function(hook) {
            hook.call(DOMPurify2, currentNode, data, CONFIG);
          });
        };
        var _sanitizeElements = function _sanitizeElements2(currentNode) {
          var content;
          _executeHook("beforeSanitizeElements", currentNode, null);
          if (_isClobbered(currentNode)) {
            _forceRemove(currentNode);
            return true;
          }
          if (regExpTest(/[\u0080-\uFFFF]/, currentNode.nodeName)) {
            _forceRemove(currentNode);
            return true;
          }
          var tagName = transformCaseFunc(currentNode.nodeName);
          _executeHook("uponSanitizeElement", currentNode, {
            tagName,
            allowedTags: ALLOWED_TAGS
          });
          if (currentNode.hasChildNodes() && !_isNode(currentNode.firstElementChild) && (!_isNode(currentNode.content) || !_isNode(currentNode.content.firstElementChild)) && regExpTest(/<[/\w]/g, currentNode.innerHTML) && regExpTest(/<[/\w]/g, currentNode.textContent)) {
            _forceRemove(currentNode);
            return true;
          }
          if (tagName === "select" && regExpTest(/<template/i, currentNode.innerHTML)) {
            _forceRemove(currentNode);
            return true;
          }
          if (!ALLOWED_TAGS[tagName] || FORBID_TAGS[tagName]) {
            if (!FORBID_TAGS[tagName] && _basicCustomElementTest(tagName)) {
              if (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.tagNameCheck, tagName))
                return false;
              if (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.tagNameCheck(tagName))
                return false;
            }
            if (KEEP_CONTENT && !FORBID_CONTENTS[tagName]) {
              var parentNode = getParentNode2(currentNode) || currentNode.parentNode;
              var childNodes = getChildNodes(currentNode) || currentNode.childNodes;
              if (childNodes && parentNode) {
                var childCount = childNodes.length;
                for (var i7 = childCount - 1; i7 >= 0; --i7) {
                  parentNode.insertBefore(cloneNode(childNodes[i7], true), getNextSibling(currentNode));
                }
              }
            }
            _forceRemove(currentNode);
            return true;
          }
          if (currentNode instanceof Element2 && !_checkValidNamespace(currentNode)) {
            _forceRemove(currentNode);
            return true;
          }
          if ((tagName === "noscript" || tagName === "noembed" || tagName === "noframes") && regExpTest(/<\/no(script|embed|frames)/i, currentNode.innerHTML)) {
            _forceRemove(currentNode);
            return true;
          }
          if (SAFE_FOR_TEMPLATES && currentNode.nodeType === 3) {
            content = currentNode.textContent;
            content = stringReplace(content, MUSTACHE_EXPR$1, " ");
            content = stringReplace(content, ERB_EXPR$1, " ");
            content = stringReplace(content, TMPLIT_EXPR$1, " ");
            if (currentNode.textContent !== content) {
              arrayPush(DOMPurify2.removed, {
                element: currentNode.cloneNode()
              });
              currentNode.textContent = content;
            }
          }
          _executeHook("afterSanitizeElements", currentNode, null);
          return false;
        };
        var _isValidAttribute = function _isValidAttribute2(lcTag, lcName, value) {
          if (SANITIZE_DOM && (lcName === "id" || lcName === "name") && (value in document2 || value in formElement)) {
            return false;
          }
          if (ALLOW_DATA_ATTR && !FORBID_ATTR[lcName] && regExpTest(DATA_ATTR$1, lcName))
            ;
          else if (ALLOW_ARIA_ATTR && regExpTest(ARIA_ATTR$1, lcName))
            ;
          else if (!ALLOWED_ATTR[lcName] || FORBID_ATTR[lcName]) {
            if (
              // First condition does a very basic check if a) it's basically a valid custom element tagname AND
              // b) if the tagName passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
              // and c) if the attribute name passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.attributeNameCheck
              _basicCustomElementTest(lcTag) && (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.tagNameCheck, lcTag) || CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.tagNameCheck(lcTag)) && (CUSTOM_ELEMENT_HANDLING.attributeNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.attributeNameCheck, lcName) || CUSTOM_ELEMENT_HANDLING.attributeNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.attributeNameCheck(lcName)) || // Alternative, second condition checks if it's an `is`-attribute, AND
              // the value passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
              lcName === "is" && CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements && (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.tagNameCheck, value) || CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.tagNameCheck(value))
            )
              ;
            else {
              return false;
            }
          } else if (URI_SAFE_ATTRIBUTES[lcName])
            ;
          else if (regExpTest(IS_ALLOWED_URI$1, stringReplace(value, ATTR_WHITESPACE$1, "")))
            ;
          else if ((lcName === "src" || lcName === "xlink:href" || lcName === "href") && lcTag !== "script" && stringIndexOf(value, "data:") === 0 && DATA_URI_TAGS[lcTag])
            ;
          else if (ALLOW_UNKNOWN_PROTOCOLS && !regExpTest(IS_SCRIPT_OR_DATA$1, stringReplace(value, ATTR_WHITESPACE$1, "")))
            ;
          else if (value) {
            return false;
          } else
            ;
          return true;
        };
        var _basicCustomElementTest = function _basicCustomElementTest2(tagName) {
          return tagName.indexOf("-") > 0;
        };
        var _sanitizeAttributes = function _sanitizeAttributes2(currentNode) {
          var attr;
          var value;
          var lcName;
          var l7;
          _executeHook("beforeSanitizeAttributes", currentNode, null);
          var attributes = currentNode.attributes;
          if (!attributes) {
            return;
          }
          var hookEvent = {
            attrName: "",
            attrValue: "",
            keepAttr: true,
            allowedAttributes: ALLOWED_ATTR
          };
          l7 = attributes.length;
          while (l7--) {
            attr = attributes[l7];
            var _attr = attr, name = _attr.name, namespaceURI = _attr.namespaceURI;
            value = name === "value" ? attr.value : stringTrim(attr.value);
            lcName = transformCaseFunc(name);
            hookEvent.attrName = lcName;
            hookEvent.attrValue = value;
            hookEvent.keepAttr = true;
            hookEvent.forceKeepAttr = void 0;
            _executeHook("uponSanitizeAttribute", currentNode, hookEvent);
            value = hookEvent.attrValue;
            if (hookEvent.forceKeepAttr) {
              continue;
            }
            _removeAttribute(name, currentNode);
            if (!hookEvent.keepAttr) {
              continue;
            }
            if (!ALLOW_SELF_CLOSE_IN_ATTR && regExpTest(/\/>/i, value)) {
              _removeAttribute(name, currentNode);
              continue;
            }
            if (SAFE_FOR_TEMPLATES) {
              value = stringReplace(value, MUSTACHE_EXPR$1, " ");
              value = stringReplace(value, ERB_EXPR$1, " ");
              value = stringReplace(value, TMPLIT_EXPR$1, " ");
            }
            var lcTag = transformCaseFunc(currentNode.nodeName);
            if (!_isValidAttribute(lcTag, lcName, value)) {
              continue;
            }
            if (SANITIZE_NAMED_PROPS && (lcName === "id" || lcName === "name")) {
              _removeAttribute(name, currentNode);
              value = SANITIZE_NAMED_PROPS_PREFIX + value;
            }
            if (trustedTypesPolicy && _typeof(trustedTypes) === "object" && typeof trustedTypes.getAttributeType === "function") {
              if (namespaceURI)
                ;
              else {
                switch (trustedTypes.getAttributeType(lcTag, lcName)) {
                  case "TrustedHTML": {
                    value = trustedTypesPolicy.createHTML(value);
                    break;
                  }
                  case "TrustedScriptURL": {
                    value = trustedTypesPolicy.createScriptURL(value);
                    break;
                  }
                }
              }
            }
            try {
              if (namespaceURI) {
                currentNode.setAttributeNS(namespaceURI, name, value);
              } else {
                currentNode.setAttribute(name, value);
              }
              arrayPop(DOMPurify2.removed);
            } catch (_2) {
            }
          }
          _executeHook("afterSanitizeAttributes", currentNode, null);
        };
        var _sanitizeShadowDOM = function _sanitizeShadowDOM2(fragment) {
          var shadowNode;
          var shadowIterator = _createIterator(fragment);
          _executeHook("beforeSanitizeShadowDOM", fragment, null);
          while (shadowNode = shadowIterator.nextNode()) {
            _executeHook("uponSanitizeShadowNode", shadowNode, null);
            if (_sanitizeElements(shadowNode)) {
              continue;
            }
            if (shadowNode.content instanceof DocumentFragment) {
              _sanitizeShadowDOM2(shadowNode.content);
            }
            _sanitizeAttributes(shadowNode);
          }
          _executeHook("afterSanitizeShadowDOM", fragment, null);
        };
        DOMPurify2.sanitize = function(dirty) {
          var cfg = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
          var body;
          var importedNode;
          var currentNode;
          var oldNode;
          var returnNode;
          IS_EMPTY_INPUT = !dirty;
          if (IS_EMPTY_INPUT) {
            dirty = "<!-->";
          }
          if (typeof dirty !== "string" && !_isNode(dirty)) {
            if (typeof dirty.toString === "function") {
              dirty = dirty.toString();
              if (typeof dirty !== "string") {
                throw typeErrorCreate("dirty is not a string, aborting");
              }
            } else {
              throw typeErrorCreate("toString is not a function");
            }
          }
          if (!DOMPurify2.isSupported) {
            if (_typeof(window2.toStaticHTML) === "object" || typeof window2.toStaticHTML === "function") {
              if (typeof dirty === "string") {
                return window2.toStaticHTML(dirty);
              }
              if (_isNode(dirty)) {
                return window2.toStaticHTML(dirty.outerHTML);
              }
            }
            return dirty;
          }
          if (!SET_CONFIG) {
            _parseConfig(cfg);
          }
          DOMPurify2.removed = [];
          if (typeof dirty === "string") {
            IN_PLACE = false;
          }
          if (IN_PLACE) {
            if (dirty.nodeName) {
              var tagName = transformCaseFunc(dirty.nodeName);
              if (!ALLOWED_TAGS[tagName] || FORBID_TAGS[tagName]) {
                throw typeErrorCreate("root node is forbidden and cannot be sanitized in-place");
              }
            }
          } else if (dirty instanceof Node2) {
            body = _initDocument("<!---->");
            importedNode = body.ownerDocument.importNode(dirty, true);
            if (importedNode.nodeType === 1 && importedNode.nodeName === "BODY") {
              body = importedNode;
            } else if (importedNode.nodeName === "HTML") {
              body = importedNode;
            } else {
              body.appendChild(importedNode);
            }
          } else {
            if (!RETURN_DOM && !SAFE_FOR_TEMPLATES && !WHOLE_DOCUMENT && // eslint-disable-next-line unicorn/prefer-includes
            dirty.indexOf("<") === -1) {
              return trustedTypesPolicy && RETURN_TRUSTED_TYPE ? trustedTypesPolicy.createHTML(dirty) : dirty;
            }
            body = _initDocument(dirty);
            if (!body) {
              return RETURN_DOM ? null : RETURN_TRUSTED_TYPE ? emptyHTML : "";
            }
          }
          if (body && FORCE_BODY) {
            _forceRemove(body.firstChild);
          }
          var nodeIterator = _createIterator(IN_PLACE ? dirty : body);
          while (currentNode = nodeIterator.nextNode()) {
            if (currentNode.nodeType === 3 && currentNode === oldNode) {
              continue;
            }
            if (_sanitizeElements(currentNode)) {
              continue;
            }
            if (currentNode.content instanceof DocumentFragment) {
              _sanitizeShadowDOM(currentNode.content);
            }
            _sanitizeAttributes(currentNode);
            oldNode = currentNode;
          }
          oldNode = null;
          if (IN_PLACE) {
            return dirty;
          }
          if (RETURN_DOM) {
            if (RETURN_DOM_FRAGMENT) {
              returnNode = createDocumentFragment.call(body.ownerDocument);
              while (body.firstChild) {
                returnNode.appendChild(body.firstChild);
              }
            } else {
              returnNode = body;
            }
            if (ALLOWED_ATTR.shadowroot || ALLOWED_ATTR.shadowrootmod) {
              returnNode = importNode.call(originalDocument, returnNode, true);
            }
            return returnNode;
          }
          var serializedHTML = WHOLE_DOCUMENT ? body.outerHTML : body.innerHTML;
          if (WHOLE_DOCUMENT && ALLOWED_TAGS["!doctype"] && body.ownerDocument && body.ownerDocument.doctype && body.ownerDocument.doctype.name && regExpTest(DOCTYPE_NAME, body.ownerDocument.doctype.name)) {
            serializedHTML = "<!DOCTYPE " + body.ownerDocument.doctype.name + ">\n" + serializedHTML;
          }
          if (SAFE_FOR_TEMPLATES) {
            serializedHTML = stringReplace(serializedHTML, MUSTACHE_EXPR$1, " ");
            serializedHTML = stringReplace(serializedHTML, ERB_EXPR$1, " ");
            serializedHTML = stringReplace(serializedHTML, TMPLIT_EXPR$1, " ");
          }
          return trustedTypesPolicy && RETURN_TRUSTED_TYPE ? trustedTypesPolicy.createHTML(serializedHTML) : serializedHTML;
        };
        DOMPurify2.setConfig = function(cfg) {
          _parseConfig(cfg);
          SET_CONFIG = true;
        };
        DOMPurify2.clearConfig = function() {
          CONFIG = null;
          SET_CONFIG = false;
        };
        DOMPurify2.isValidAttribute = function(tag, attr, value) {
          if (!CONFIG) {
            _parseConfig({});
          }
          var lcTag = transformCaseFunc(tag);
          var lcName = transformCaseFunc(attr);
          return _isValidAttribute(lcTag, lcName, value);
        };
        DOMPurify2.addHook = function(entryPoint, hookFunction) {
          if (typeof hookFunction !== "function") {
            return;
          }
          hooks[entryPoint] = hooks[entryPoint] || [];
          arrayPush(hooks[entryPoint], hookFunction);
        };
        DOMPurify2.removeHook = function(entryPoint) {
          if (hooks[entryPoint]) {
            return arrayPop(hooks[entryPoint]);
          }
        };
        DOMPurify2.removeHooks = function(entryPoint) {
          if (hooks[entryPoint]) {
            hooks[entryPoint] = [];
          }
        };
        DOMPurify2.removeAllHooks = function() {
          hooks = {};
        };
        return DOMPurify2;
      }
      var purify = createDOMPurify();
      return purify;
    });
  }
});

// ../../node_modules/@api-viewer/common/lib/templates.js
var templates = [];
var setTemplates = (id2, tpl4) => {
  templates[id2] = tpl4;
};
var TemplateTypes = Object.freeze({
  HOST: "host",
  KNOB: "knob",
  SLOT: "slot",
  PREFIX: "prefix",
  SUFFIX: "suffix",
  WRAPPER: "wrapper"
});
var isTemplate = (node) => node instanceof HTMLTemplateElement;
var matchTemplate = (name, type) => (tpl4) => {
  const { element, target } = tpl4.dataset;
  return element === name && target === type;
};
var getTemplateNode = (node) => isTemplate(node) ? node.content.firstElementChild : null;
var getTemplate = (id2, name, type) => templates[id2].find(matchTemplate(name, type));
var getTemplates = (id2, name, type) => templates[id2].filter(matchTemplate(name, type));
var hasTemplate = (id2, name, type) => templates[id2].some(matchTemplate(name, type));

// ../../node_modules/tslib/tslib.es6.mjs
function __decorate(decorators, target, key, desc) {
  var c6 = arguments.length, r7 = c6 < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d4;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
    r7 = Reflect.decorate(decorators, target, key, desc);
  else
    for (var i7 = decorators.length - 1; i7 >= 0; i7--)
      if (d4 = decorators[i7])
        r7 = (c6 < 3 ? d4(r7) : c6 > 3 ? d4(target, key, r7) : d4(target, key)) || r7;
  return c6 > 3 && r7 && Object.defineProperty(target, key, r7), r7;
}

// ../../node_modules/@lit/reactive-element/css-tag.js
var t = window;
var e = t.ShadowRoot && (void 0 === t.ShadyCSS || t.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype;
var s = Symbol();
var n = /* @__PURE__ */ new WeakMap();
var o = class {
  constructor(t7, e10, n10) {
    if (this._$cssResult$ = true, n10 !== s)
      throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t7, this.t = e10;
  }
  get styleSheet() {
    let t7 = this.o;
    const s8 = this.t;
    if (e && void 0 === t7) {
      const e10 = void 0 !== s8 && 1 === s8.length;
      e10 && (t7 = n.get(s8)), void 0 === t7 && ((this.o = t7 = new CSSStyleSheet()).replaceSync(this.cssText), e10 && n.set(s8, t7));
    }
    return t7;
  }
  toString() {
    return this.cssText;
  }
};
var r = (t7) => new o("string" == typeof t7 ? t7 : t7 + "", void 0, s);
var i = (t7, ...e10) => {
  const n10 = 1 === t7.length ? t7[0] : e10.reduce((e11, s8, n11) => e11 + ((t8) => {
    if (true === t8._$cssResult$)
      return t8.cssText;
    if ("number" == typeof t8)
      return t8;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + t8 + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s8) + t7[n11 + 1], t7[0]);
  return new o(n10, t7, s);
};
var S = (s8, n10) => {
  e ? s8.adoptedStyleSheets = n10.map((t7) => t7 instanceof CSSStyleSheet ? t7 : t7.styleSheet) : n10.forEach((e10) => {
    const n11 = document.createElement("style"), o12 = t.litNonce;
    void 0 !== o12 && n11.setAttribute("nonce", o12), n11.textContent = e10.cssText, s8.appendChild(n11);
  });
};
var c = e ? (t7) => t7 : (t7) => t7 instanceof CSSStyleSheet ? ((t8) => {
  let e10 = "";
  for (const s8 of t8.cssRules)
    e10 += s8.cssText;
  return r(e10);
})(t7) : t7;

// ../../node_modules/@lit/reactive-element/reactive-element.js
var s2;
var e2 = window;
var r2 = e2.trustedTypes;
var h = r2 ? r2.emptyScript : "";
var o2 = e2.reactiveElementPolyfillSupport;
var n2 = { toAttribute(t7, i7) {
  switch (i7) {
    case Boolean:
      t7 = t7 ? h : null;
      break;
    case Object:
    case Array:
      t7 = null == t7 ? t7 : JSON.stringify(t7);
  }
  return t7;
}, fromAttribute(t7, i7) {
  let s8 = t7;
  switch (i7) {
    case Boolean:
      s8 = null !== t7;
      break;
    case Number:
      s8 = null === t7 ? null : Number(t7);
      break;
    case Object:
    case Array:
      try {
        s8 = JSON.parse(t7);
      } catch (t8) {
        s8 = null;
      }
  }
  return s8;
} };
var a = (t7, i7) => i7 !== t7 && (i7 == i7 || t7 == t7);
var l = { attribute: true, type: String, converter: n2, reflect: false, hasChanged: a };
var d = "finalized";
var u = class extends HTMLElement {
  constructor() {
    super(), this._$Ei = /* @__PURE__ */ new Map(), this.isUpdatePending = false, this.hasUpdated = false, this._$El = null, this._$Eu();
  }
  static addInitializer(t7) {
    var i7;
    this.finalize(), (null !== (i7 = this.h) && void 0 !== i7 ? i7 : this.h = []).push(t7);
  }
  static get observedAttributes() {
    this.finalize();
    const t7 = [];
    return this.elementProperties.forEach((i7, s8) => {
      const e10 = this._$Ep(s8, i7);
      void 0 !== e10 && (this._$Ev.set(e10, s8), t7.push(e10));
    }), t7;
  }
  static createProperty(t7, i7 = l) {
    if (i7.state && (i7.attribute = false), this.finalize(), this.elementProperties.set(t7, i7), !i7.noAccessor && !this.prototype.hasOwnProperty(t7)) {
      const s8 = "symbol" == typeof t7 ? Symbol() : "__" + t7, e10 = this.getPropertyDescriptor(t7, s8, i7);
      void 0 !== e10 && Object.defineProperty(this.prototype, t7, e10);
    }
  }
  static getPropertyDescriptor(t7, i7, s8) {
    return { get() {
      return this[i7];
    }, set(e10) {
      const r7 = this[t7];
      this[i7] = e10, this.requestUpdate(t7, r7, s8);
    }, configurable: true, enumerable: true };
  }
  static getPropertyOptions(t7) {
    return this.elementProperties.get(t7) || l;
  }
  static finalize() {
    if (this.hasOwnProperty(d))
      return false;
    this[d] = true;
    const t7 = Object.getPrototypeOf(this);
    if (t7.finalize(), void 0 !== t7.h && (this.h = [...t7.h]), this.elementProperties = new Map(t7.elementProperties), this._$Ev = /* @__PURE__ */ new Map(), this.hasOwnProperty("properties")) {
      const t8 = this.properties, i7 = [...Object.getOwnPropertyNames(t8), ...Object.getOwnPropertySymbols(t8)];
      for (const s8 of i7)
        this.createProperty(s8, t8[s8]);
    }
    return this.elementStyles = this.finalizeStyles(this.styles), true;
  }
  static finalizeStyles(i7) {
    const s8 = [];
    if (Array.isArray(i7)) {
      const e10 = new Set(i7.flat(1 / 0).reverse());
      for (const i8 of e10)
        s8.unshift(c(i8));
    } else
      void 0 !== i7 && s8.push(c(i7));
    return s8;
  }
  static _$Ep(t7, i7) {
    const s8 = i7.attribute;
    return false === s8 ? void 0 : "string" == typeof s8 ? s8 : "string" == typeof t7 ? t7.toLowerCase() : void 0;
  }
  _$Eu() {
    var t7;
    this._$E_ = new Promise((t8) => this.enableUpdating = t8), this._$AL = /* @__PURE__ */ new Map(), this._$Eg(), this.requestUpdate(), null === (t7 = this.constructor.h) || void 0 === t7 || t7.forEach((t8) => t8(this));
  }
  addController(t7) {
    var i7, s8;
    (null !== (i7 = this._$ES) && void 0 !== i7 ? i7 : this._$ES = []).push(t7), void 0 !== this.renderRoot && this.isConnected && (null === (s8 = t7.hostConnected) || void 0 === s8 || s8.call(t7));
  }
  removeController(t7) {
    var i7;
    null === (i7 = this._$ES) || void 0 === i7 || i7.splice(this._$ES.indexOf(t7) >>> 0, 1);
  }
  _$Eg() {
    this.constructor.elementProperties.forEach((t7, i7) => {
      this.hasOwnProperty(i7) && (this._$Ei.set(i7, this[i7]), delete this[i7]);
    });
  }
  createRenderRoot() {
    var t7;
    const s8 = null !== (t7 = this.shadowRoot) && void 0 !== t7 ? t7 : this.attachShadow(this.constructor.shadowRootOptions);
    return S(s8, this.constructor.elementStyles), s8;
  }
  connectedCallback() {
    var t7;
    void 0 === this.renderRoot && (this.renderRoot = this.createRenderRoot()), this.enableUpdating(true), null === (t7 = this._$ES) || void 0 === t7 || t7.forEach((t8) => {
      var i7;
      return null === (i7 = t8.hostConnected) || void 0 === i7 ? void 0 : i7.call(t8);
    });
  }
  enableUpdating(t7) {
  }
  disconnectedCallback() {
    var t7;
    null === (t7 = this._$ES) || void 0 === t7 || t7.forEach((t8) => {
      var i7;
      return null === (i7 = t8.hostDisconnected) || void 0 === i7 ? void 0 : i7.call(t8);
    });
  }
  attributeChangedCallback(t7, i7, s8) {
    this._$AK(t7, s8);
  }
  _$EO(t7, i7, s8 = l) {
    var e10;
    const r7 = this.constructor._$Ep(t7, s8);
    if (void 0 !== r7 && true === s8.reflect) {
      const h8 = (void 0 !== (null === (e10 = s8.converter) || void 0 === e10 ? void 0 : e10.toAttribute) ? s8.converter : n2).toAttribute(i7, s8.type);
      this._$El = t7, null == h8 ? this.removeAttribute(r7) : this.setAttribute(r7, h8), this._$El = null;
    }
  }
  _$AK(t7, i7) {
    var s8;
    const e10 = this.constructor, r7 = e10._$Ev.get(t7);
    if (void 0 !== r7 && this._$El !== r7) {
      const t8 = e10.getPropertyOptions(r7), h8 = "function" == typeof t8.converter ? { fromAttribute: t8.converter } : void 0 !== (null === (s8 = t8.converter) || void 0 === s8 ? void 0 : s8.fromAttribute) ? t8.converter : n2;
      this._$El = r7, this[r7] = h8.fromAttribute(i7, t8.type), this._$El = null;
    }
  }
  requestUpdate(t7, i7, s8) {
    let e10 = true;
    void 0 !== t7 && (((s8 = s8 || this.constructor.getPropertyOptions(t7)).hasChanged || a)(this[t7], i7) ? (this._$AL.has(t7) || this._$AL.set(t7, i7), true === s8.reflect && this._$El !== t7 && (void 0 === this._$EC && (this._$EC = /* @__PURE__ */ new Map()), this._$EC.set(t7, s8))) : e10 = false), !this.isUpdatePending && e10 && (this._$E_ = this._$Ej());
  }
  async _$Ej() {
    this.isUpdatePending = true;
    try {
      await this._$E_;
    } catch (t8) {
      Promise.reject(t8);
    }
    const t7 = this.scheduleUpdate();
    return null != t7 && await t7, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var t7;
    if (!this.isUpdatePending)
      return;
    this.hasUpdated, this._$Ei && (this._$Ei.forEach((t8, i8) => this[i8] = t8), this._$Ei = void 0);
    let i7 = false;
    const s8 = this._$AL;
    try {
      i7 = this.shouldUpdate(s8), i7 ? (this.willUpdate(s8), null === (t7 = this._$ES) || void 0 === t7 || t7.forEach((t8) => {
        var i8;
        return null === (i8 = t8.hostUpdate) || void 0 === i8 ? void 0 : i8.call(t8);
      }), this.update(s8)) : this._$Ek();
    } catch (t8) {
      throw i7 = false, this._$Ek(), t8;
    }
    i7 && this._$AE(s8);
  }
  willUpdate(t7) {
  }
  _$AE(t7) {
    var i7;
    null === (i7 = this._$ES) || void 0 === i7 || i7.forEach((t8) => {
      var i8;
      return null === (i8 = t8.hostUpdated) || void 0 === i8 ? void 0 : i8.call(t8);
    }), this.hasUpdated || (this.hasUpdated = true, this.firstUpdated(t7)), this.updated(t7);
  }
  _$Ek() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = false;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$E_;
  }
  shouldUpdate(t7) {
    return true;
  }
  update(t7) {
    void 0 !== this._$EC && (this._$EC.forEach((t8, i7) => this._$EO(i7, this[i7], t8)), this._$EC = void 0), this._$Ek();
  }
  updated(t7) {
  }
  firstUpdated(t7) {
  }
};
u[d] = true, u.elementProperties = /* @__PURE__ */ new Map(), u.elementStyles = [], u.shadowRootOptions = { mode: "open" }, null == o2 || o2({ ReactiveElement: u }), (null !== (s2 = e2.reactiveElementVersions) && void 0 !== s2 ? s2 : e2.reactiveElementVersions = []).push("1.6.3");

// ../../node_modules/lit-html/lit-html.js
var t2;
var i2 = window;
var s3 = i2.trustedTypes;
var e3 = s3 ? s3.createPolicy("lit-html", { createHTML: (t7) => t7 }) : void 0;
var o3 = "$lit$";
var n3 = `lit$${(Math.random() + "").slice(9)}$`;
var l2 = "?" + n3;
var h2 = `<${l2}>`;
var r3 = document;
var u2 = () => r3.createComment("");
var d2 = (t7) => null === t7 || "object" != typeof t7 && "function" != typeof t7;
var c2 = Array.isArray;
var v = (t7) => c2(t7) || "function" == typeof (null == t7 ? void 0 : t7[Symbol.iterator]);
var a2 = "[ 	\n\f\r]";
var f = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g;
var _ = /-->/g;
var m = />/g;
var p = RegExp(`>|${a2}(?:([^\\s"'>=/]+)(${a2}*=${a2}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g");
var g = /'/g;
var $ = /"/g;
var y = /^(?:script|style|textarea|title)$/i;
var w = (t7) => (i7, ...s8) => ({ _$litType$: t7, strings: i7, values: s8 });
var x = w(1);
var b = w(2);
var T = Symbol.for("lit-noChange");
var A = Symbol.for("lit-nothing");
var E = /* @__PURE__ */ new WeakMap();
var C = r3.createTreeWalker(r3, 129, null, false);
function P(t7, i7) {
  if (!Array.isArray(t7) || !t7.hasOwnProperty("raw"))
    throw Error("invalid template strings array");
  return void 0 !== e3 ? e3.createHTML(i7) : i7;
}
var V = (t7, i7) => {
  const s8 = t7.length - 1, e10 = [];
  let l7, r7 = 2 === i7 ? "<svg>" : "", u3 = f;
  for (let i8 = 0; i8 < s8; i8++) {
    const s9 = t7[i8];
    let d4, c6, v3 = -1, a4 = 0;
    for (; a4 < s9.length && (u3.lastIndex = a4, c6 = u3.exec(s9), null !== c6); )
      a4 = u3.lastIndex, u3 === f ? "!--" === c6[1] ? u3 = _ : void 0 !== c6[1] ? u3 = m : void 0 !== c6[2] ? (y.test(c6[2]) && (l7 = RegExp("</" + c6[2], "g")), u3 = p) : void 0 !== c6[3] && (u3 = p) : u3 === p ? ">" === c6[0] ? (u3 = null != l7 ? l7 : f, v3 = -1) : void 0 === c6[1] ? v3 = -2 : (v3 = u3.lastIndex - c6[2].length, d4 = c6[1], u3 = void 0 === c6[3] ? p : '"' === c6[3] ? $ : g) : u3 === $ || u3 === g ? u3 = p : u3 === _ || u3 === m ? u3 = f : (u3 = p, l7 = void 0);
    const w2 = u3 === p && t7[i8 + 1].startsWith("/>") ? " " : "";
    r7 += u3 === f ? s9 + h2 : v3 >= 0 ? (e10.push(d4), s9.slice(0, v3) + o3 + s9.slice(v3) + n3 + w2) : s9 + n3 + (-2 === v3 ? (e10.push(void 0), i8) : w2);
  }
  return [P(t7, r7 + (t7[s8] || "<?>") + (2 === i7 ? "</svg>" : "")), e10];
};
var N = class {
  constructor({ strings: t7, _$litType$: i7 }, e10) {
    let h8;
    this.parts = [];
    let r7 = 0, d4 = 0;
    const c6 = t7.length - 1, v3 = this.parts, [a4, f2] = V(t7, i7);
    if (this.el = N.createElement(a4, e10), C.currentNode = this.el.content, 2 === i7) {
      const t8 = this.el.content, i8 = t8.firstChild;
      i8.remove(), t8.append(...i8.childNodes);
    }
    for (; null !== (h8 = C.nextNode()) && v3.length < c6; ) {
      if (1 === h8.nodeType) {
        if (h8.hasAttributes()) {
          const t8 = [];
          for (const i8 of h8.getAttributeNames())
            if (i8.endsWith(o3) || i8.startsWith(n3)) {
              const s8 = f2[d4++];
              if (t8.push(i8), void 0 !== s8) {
                const t9 = h8.getAttribute(s8.toLowerCase() + o3).split(n3), i9 = /([.?@])?(.*)/.exec(s8);
                v3.push({ type: 1, index: r7, name: i9[2], strings: t9, ctor: "." === i9[1] ? H : "?" === i9[1] ? L : "@" === i9[1] ? z : k });
              } else
                v3.push({ type: 6, index: r7 });
            }
          for (const i8 of t8)
            h8.removeAttribute(i8);
        }
        if (y.test(h8.tagName)) {
          const t8 = h8.textContent.split(n3), i8 = t8.length - 1;
          if (i8 > 0) {
            h8.textContent = s3 ? s3.emptyScript : "";
            for (let s8 = 0; s8 < i8; s8++)
              h8.append(t8[s8], u2()), C.nextNode(), v3.push({ type: 2, index: ++r7 });
            h8.append(t8[i8], u2());
          }
        }
      } else if (8 === h8.nodeType)
        if (h8.data === l2)
          v3.push({ type: 2, index: r7 });
        else {
          let t8 = -1;
          for (; -1 !== (t8 = h8.data.indexOf(n3, t8 + 1)); )
            v3.push({ type: 7, index: r7 }), t8 += n3.length - 1;
        }
      r7++;
    }
  }
  static createElement(t7, i7) {
    const s8 = r3.createElement("template");
    return s8.innerHTML = t7, s8;
  }
};
function S2(t7, i7, s8 = t7, e10) {
  var o12, n10, l7, h8;
  if (i7 === T)
    return i7;
  let r7 = void 0 !== e10 ? null === (o12 = s8._$Co) || void 0 === o12 ? void 0 : o12[e10] : s8._$Cl;
  const u3 = d2(i7) ? void 0 : i7._$litDirective$;
  return (null == r7 ? void 0 : r7.constructor) !== u3 && (null === (n10 = null == r7 ? void 0 : r7._$AO) || void 0 === n10 || n10.call(r7, false), void 0 === u3 ? r7 = void 0 : (r7 = new u3(t7), r7._$AT(t7, s8, e10)), void 0 !== e10 ? (null !== (l7 = (h8 = s8)._$Co) && void 0 !== l7 ? l7 : h8._$Co = [])[e10] = r7 : s8._$Cl = r7), void 0 !== r7 && (i7 = S2(t7, r7._$AS(t7, i7.values), r7, e10)), i7;
}
var M = class {
  constructor(t7, i7) {
    this._$AV = [], this._$AN = void 0, this._$AD = t7, this._$AM = i7;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t7) {
    var i7;
    const { el: { content: s8 }, parts: e10 } = this._$AD, o12 = (null !== (i7 = null == t7 ? void 0 : t7.creationScope) && void 0 !== i7 ? i7 : r3).importNode(s8, true);
    C.currentNode = o12;
    let n10 = C.nextNode(), l7 = 0, h8 = 0, u3 = e10[0];
    for (; void 0 !== u3; ) {
      if (l7 === u3.index) {
        let i8;
        2 === u3.type ? i8 = new R(n10, n10.nextSibling, this, t7) : 1 === u3.type ? i8 = new u3.ctor(n10, u3.name, u3.strings, this, t7) : 6 === u3.type && (i8 = new Z(n10, this, t7)), this._$AV.push(i8), u3 = e10[++h8];
      }
      l7 !== (null == u3 ? void 0 : u3.index) && (n10 = C.nextNode(), l7++);
    }
    return C.currentNode = r3, o12;
  }
  v(t7) {
    let i7 = 0;
    for (const s8 of this._$AV)
      void 0 !== s8 && (void 0 !== s8.strings ? (s8._$AI(t7, s8, i7), i7 += s8.strings.length - 2) : s8._$AI(t7[i7])), i7++;
  }
};
var R = class {
  constructor(t7, i7, s8, e10) {
    var o12;
    this.type = 2, this._$AH = A, this._$AN = void 0, this._$AA = t7, this._$AB = i7, this._$AM = s8, this.options = e10, this._$Cp = null === (o12 = null == e10 ? void 0 : e10.isConnected) || void 0 === o12 || o12;
  }
  get _$AU() {
    var t7, i7;
    return null !== (i7 = null === (t7 = this._$AM) || void 0 === t7 ? void 0 : t7._$AU) && void 0 !== i7 ? i7 : this._$Cp;
  }
  get parentNode() {
    let t7 = this._$AA.parentNode;
    const i7 = this._$AM;
    return void 0 !== i7 && 11 === (null == t7 ? void 0 : t7.nodeType) && (t7 = i7.parentNode), t7;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t7, i7 = this) {
    t7 = S2(this, t7, i7), d2(t7) ? t7 === A || null == t7 || "" === t7 ? (this._$AH !== A && this._$AR(), this._$AH = A) : t7 !== this._$AH && t7 !== T && this._(t7) : void 0 !== t7._$litType$ ? this.g(t7) : void 0 !== t7.nodeType ? this.$(t7) : v(t7) ? this.T(t7) : this._(t7);
  }
  k(t7) {
    return this._$AA.parentNode.insertBefore(t7, this._$AB);
  }
  $(t7) {
    this._$AH !== t7 && (this._$AR(), this._$AH = this.k(t7));
  }
  _(t7) {
    this._$AH !== A && d2(this._$AH) ? this._$AA.nextSibling.data = t7 : this.$(r3.createTextNode(t7)), this._$AH = t7;
  }
  g(t7) {
    var i7;
    const { values: s8, _$litType$: e10 } = t7, o12 = "number" == typeof e10 ? this._$AC(t7) : (void 0 === e10.el && (e10.el = N.createElement(P(e10.h, e10.h[0]), this.options)), e10);
    if ((null === (i7 = this._$AH) || void 0 === i7 ? void 0 : i7._$AD) === o12)
      this._$AH.v(s8);
    else {
      const t8 = new M(o12, this), i8 = t8.u(this.options);
      t8.v(s8), this.$(i8), this._$AH = t8;
    }
  }
  _$AC(t7) {
    let i7 = E.get(t7.strings);
    return void 0 === i7 && E.set(t7.strings, i7 = new N(t7)), i7;
  }
  T(t7) {
    c2(this._$AH) || (this._$AH = [], this._$AR());
    const i7 = this._$AH;
    let s8, e10 = 0;
    for (const o12 of t7)
      e10 === i7.length ? i7.push(s8 = new R(this.k(u2()), this.k(u2()), this, this.options)) : s8 = i7[e10], s8._$AI(o12), e10++;
    e10 < i7.length && (this._$AR(s8 && s8._$AB.nextSibling, e10), i7.length = e10);
  }
  _$AR(t7 = this._$AA.nextSibling, i7) {
    var s8;
    for (null === (s8 = this._$AP) || void 0 === s8 || s8.call(this, false, true, i7); t7 && t7 !== this._$AB; ) {
      const i8 = t7.nextSibling;
      t7.remove(), t7 = i8;
    }
  }
  setConnected(t7) {
    var i7;
    void 0 === this._$AM && (this._$Cp = t7, null === (i7 = this._$AP) || void 0 === i7 || i7.call(this, t7));
  }
};
var k = class {
  constructor(t7, i7, s8, e10, o12) {
    this.type = 1, this._$AH = A, this._$AN = void 0, this.element = t7, this.name = i7, this._$AM = e10, this.options = o12, s8.length > 2 || "" !== s8[0] || "" !== s8[1] ? (this._$AH = Array(s8.length - 1).fill(new String()), this.strings = s8) : this._$AH = A;
  }
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t7, i7 = this, s8, e10) {
    const o12 = this.strings;
    let n10 = false;
    if (void 0 === o12)
      t7 = S2(this, t7, i7, 0), n10 = !d2(t7) || t7 !== this._$AH && t7 !== T, n10 && (this._$AH = t7);
    else {
      const e11 = t7;
      let l7, h8;
      for (t7 = o12[0], l7 = 0; l7 < o12.length - 1; l7++)
        h8 = S2(this, e11[s8 + l7], i7, l7), h8 === T && (h8 = this._$AH[l7]), n10 || (n10 = !d2(h8) || h8 !== this._$AH[l7]), h8 === A ? t7 = A : t7 !== A && (t7 += (null != h8 ? h8 : "") + o12[l7 + 1]), this._$AH[l7] = h8;
    }
    n10 && !e10 && this.j(t7);
  }
  j(t7) {
    t7 === A ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, null != t7 ? t7 : "");
  }
};
var H = class extends k {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t7) {
    this.element[this.name] = t7 === A ? void 0 : t7;
  }
};
var I = s3 ? s3.emptyScript : "";
var L = class extends k {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t7) {
    t7 && t7 !== A ? this.element.setAttribute(this.name, I) : this.element.removeAttribute(this.name);
  }
};
var z = class extends k {
  constructor(t7, i7, s8, e10, o12) {
    super(t7, i7, s8, e10, o12), this.type = 5;
  }
  _$AI(t7, i7 = this) {
    var s8;
    if ((t7 = null !== (s8 = S2(this, t7, i7, 0)) && void 0 !== s8 ? s8 : A) === T)
      return;
    const e10 = this._$AH, o12 = t7 === A && e10 !== A || t7.capture !== e10.capture || t7.once !== e10.once || t7.passive !== e10.passive, n10 = t7 !== A && (e10 === A || o12);
    o12 && this.element.removeEventListener(this.name, this, e10), n10 && this.element.addEventListener(this.name, this, t7), this._$AH = t7;
  }
  handleEvent(t7) {
    var i7, s8;
    "function" == typeof this._$AH ? this._$AH.call(null !== (s8 = null === (i7 = this.options) || void 0 === i7 ? void 0 : i7.host) && void 0 !== s8 ? s8 : this.element, t7) : this._$AH.handleEvent(t7);
  }
};
var Z = class {
  constructor(t7, i7, s8) {
    this.element = t7, this.type = 6, this._$AN = void 0, this._$AM = i7, this.options = s8;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t7) {
    S2(this, t7);
  }
};
var j = { O: o3, P: n3, A: l2, C: 1, M: V, L: M, R: v, D: S2, I: R, V: k, H: L, N: z, U: H, F: Z };
var B = i2.litHtmlPolyfillSupport;
null == B || B(N, R), (null !== (t2 = i2.litHtmlVersions) && void 0 !== t2 ? t2 : i2.litHtmlVersions = []).push("2.8.0");
var D = (t7, i7, s8) => {
  var e10, o12;
  const n10 = null !== (e10 = null == s8 ? void 0 : s8.renderBefore) && void 0 !== e10 ? e10 : i7;
  let l7 = n10._$litPart$;
  if (void 0 === l7) {
    const t8 = null !== (o12 = null == s8 ? void 0 : s8.renderBefore) && void 0 !== o12 ? o12 : null;
    n10._$litPart$ = l7 = new R(i7.insertBefore(u2(), t8), t8, void 0, null != s8 ? s8 : {});
  }
  return l7._$AI(t7), l7;
};

// ../../node_modules/lit-element/lit-element.js
var l3;
var o4;
var s4 = class extends u {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var t7, e10;
    const i7 = super.createRenderRoot();
    return null !== (t7 = (e10 = this.renderOptions).renderBefore) && void 0 !== t7 || (e10.renderBefore = i7.firstChild), i7;
  }
  update(t7) {
    const i7 = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t7), this._$Do = D(i7, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var t7;
    super.connectedCallback(), null === (t7 = this._$Do) || void 0 === t7 || t7.setConnected(true);
  }
  disconnectedCallback() {
    var t7;
    super.disconnectedCallback(), null === (t7 = this._$Do) || void 0 === t7 || t7.setConnected(false);
  }
  render() {
    return T;
  }
};
s4.finalized = true, s4._$litElement$ = true, null === (l3 = globalThis.litElementHydrateSupport) || void 0 === l3 || l3.call(globalThis, { LitElement: s4 });
var n4 = globalThis.litElementPolyfillSupport;
null == n4 || n4({ LitElement: s4 });
(null !== (o4 = globalThis.litElementVersions) && void 0 !== o4 ? o4 : globalThis.litElementVersions = []).push("3.3.3");

// ../../node_modules/@lit/reactive-element/decorators/property.js
var i3 = (i7, e10) => "method" === e10.kind && e10.descriptor && !("value" in e10.descriptor) ? { ...e10, finisher(n10) {
  n10.createProperty(e10.key, i7);
} } : { kind: "field", key: Symbol(), placement: "own", descriptor: {}, originalKey: e10.key, initializer() {
  "function" == typeof e10.initializer && (this[e10.key] = e10.initializer.call(this));
}, finisher(n10) {
  n10.createProperty(e10.key, i7);
} };
var e4 = (i7, e10, n10) => {
  e10.constructor.createProperty(n10, i7);
};
function n5(n10) {
  return (t7, o12) => void 0 !== o12 ? e4(n10, t7, o12) : i3(n10, t7);
}

// ../../node_modules/lit-html/directive.js
var t3 = { ATTRIBUTE: 1, CHILD: 2, PROPERTY: 3, BOOLEAN_ATTRIBUTE: 4, EVENT: 5, ELEMENT: 6 };
var e5 = (t7) => (...e10) => ({ _$litDirective$: t7, values: e10 });
var i4 = class {
  constructor(t7) {
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(t7, e10, i7) {
    this._$Ct = t7, this._$AM = e10, this._$Ci = i7;
  }
  _$AS(t7, e10) {
    return this.update(t7, e10);
  }
  update(t7, e10) {
    return this.render(...e10);
  }
};

// ../../node_modules/lit-html/directive-helpers.js
var { I: l4 } = j;
var i5 = (o12) => null === o12 || "object" != typeof o12 && "function" != typeof o12;
var t4 = (o12, l7) => void 0 === l7 ? void 0 !== (null == o12 ? void 0 : o12._$litType$) : (null == o12 ? void 0 : o12._$litType$) === l7;
var v2 = (o12) => {
  var l7;
  return null != (null === (l7 = null == o12 ? void 0 : o12._$litType$) || void 0 === l7 ? void 0 : l7.h);
};
var e6 = (o12) => void 0 === o12.strings;
var r4 = () => document.createComment("");
var c3 = (o12, i7, n10) => {
  var t7;
  const v3 = o12._$AA.parentNode, d4 = void 0 === i7 ? o12._$AB : i7._$AA;
  if (void 0 === n10) {
    const i8 = v3.insertBefore(r4(), d4), t8 = v3.insertBefore(r4(), d4);
    n10 = new l4(i8, t8, o12, o12.options);
  } else {
    const l7 = n10._$AB.nextSibling, i8 = n10._$AM, u3 = i8 !== o12;
    if (u3) {
      let l8;
      null === (t7 = n10._$AQ) || void 0 === t7 || t7.call(n10, o12), n10._$AM = o12, void 0 !== n10._$AP && (l8 = o12._$AU) !== i8._$AU && n10._$AP(l8);
    }
    if (l7 !== d4 || u3) {
      let o13 = n10._$AA;
      for (; o13 !== l7; ) {
        const l8 = o13.nextSibling;
        v3.insertBefore(o13, d4), o13 = l8;
      }
    }
  }
  return n10;
};
var s5 = {};
var a3 = (o12, l7 = s5) => o12._$AH = l7;
var m2 = (o12) => o12._$AH;
var h3 = (o12) => {
  o12._$AR();
};

// ../../node_modules/lit-html/directives/cache.js
var d3 = (t7) => v2(t7) ? t7._$litType$.h : t7.strings;
var h4 = e5(class extends i4 {
  constructor(t7) {
    super(t7), this.tt = /* @__PURE__ */ new WeakMap();
  }
  render(t7) {
    return [t7];
  }
  update(s8, [e10]) {
    const u3 = t4(this.et) ? d3(this.et) : null, h8 = t4(e10) ? d3(e10) : null;
    if (null !== u3 && (null === h8 || u3 !== h8)) {
      const e11 = m2(s8).pop();
      let o12 = this.tt.get(u3);
      if (void 0 === o12) {
        const s9 = document.createDocumentFragment();
        o12 = D(A, s9), o12.setConnected(false), this.tt.set(u3, o12);
      }
      a3(o12, [e11]), c3(o12, void 0, e11);
    }
    if (null !== h8) {
      if (null === u3 || u3 !== h8) {
        const t7 = this.tt.get(h8);
        if (void 0 !== t7) {
          const i7 = m2(t7).pop();
          h3(s8), c3(s8, void 0, i7), a3(s8, [i7]);
        }
      }
      this.et = e10;
    } else
      this.et = void 0;
    return this.render(e10);
  }
});

// ../../node_modules/lit-html/async-directive.js
var s6 = (i7, t7) => {
  var e10, o12;
  const r7 = i7._$AN;
  if (void 0 === r7)
    return false;
  for (const i8 of r7)
    null === (o12 = (e10 = i8)._$AO) || void 0 === o12 || o12.call(e10, t7, false), s6(i8, t7);
  return true;
};
var o5 = (i7) => {
  let t7, e10;
  do {
    if (void 0 === (t7 = i7._$AM))
      break;
    e10 = t7._$AN, e10.delete(i7), i7 = t7;
  } while (0 === (null == e10 ? void 0 : e10.size));
};
var r5 = (i7) => {
  for (let t7; t7 = i7._$AM; i7 = t7) {
    let e10 = t7._$AN;
    if (void 0 === e10)
      t7._$AN = e10 = /* @__PURE__ */ new Set();
    else if (e10.has(i7))
      break;
    e10.add(i7), l5(t7);
  }
};
function n6(i7) {
  void 0 !== this._$AN ? (o5(this), this._$AM = i7, r5(this)) : this._$AM = i7;
}
function h5(i7, t7 = false, e10 = 0) {
  const r7 = this._$AH, n10 = this._$AN;
  if (void 0 !== n10 && 0 !== n10.size)
    if (t7)
      if (Array.isArray(r7))
        for (let i8 = e10; i8 < r7.length; i8++)
          s6(r7[i8], false), o5(r7[i8]);
      else
        null != r7 && (s6(r7, false), o5(r7));
    else
      s6(this, i7);
}
var l5 = (i7) => {
  var t7, s8, o12, r7;
  i7.type == t3.CHILD && (null !== (t7 = (o12 = i7)._$AP) && void 0 !== t7 || (o12._$AP = h5), null !== (s8 = (r7 = i7)._$AQ) && void 0 !== s8 || (r7._$AQ = n6));
};
var c4 = class extends i4 {
  constructor() {
    super(...arguments), this._$AN = void 0;
  }
  _$AT(i7, t7, e10) {
    super._$AT(i7, t7, e10), r5(this), this.isConnected = i7._$AU;
  }
  _$AO(i7, t7 = true) {
    var e10, r7;
    i7 !== this.isConnected && (this.isConnected = i7, i7 ? null === (e10 = this.reconnected) || void 0 === e10 || e10.call(this) : null === (r7 = this.disconnected) || void 0 === r7 || r7.call(this)), t7 && (s6(this, i7), o5(this));
  }
  setValue(t7) {
    if (e6(this._$Ct))
      this._$Ct._$AI(t7, this);
    else {
      const i7 = [...this._$Ct._$AH];
      i7[this._$Ci] = t7, this._$Ct._$AI(i7, this, 0);
    }
  }
  disconnected() {
  }
  reconnected() {
  }
};

// ../../node_modules/lit-html/directives/private-async-helpers.js
var t5 = async (t7, s8) => {
  for await (const i7 of t7)
    if (false === await s8(i7))
      return;
};
var s7 = class {
  constructor(t7) {
    this.G = t7;
  }
  disconnect() {
    this.G = void 0;
  }
  reconnect(t7) {
    this.G = t7;
  }
  deref() {
    return this.G;
  }
};
var i6 = class {
  constructor() {
    this.Y = void 0, this.Z = void 0;
  }
  get() {
    return this.Y;
  }
  pause() {
    var t7;
    null !== (t7 = this.Y) && void 0 !== t7 || (this.Y = new Promise((t8) => this.Z = t8));
  }
  resume() {
    var t7;
    null === (t7 = this.Z) || void 0 === t7 || t7.call(this), this.Y = this.Z = void 0;
  }
};

// ../../node_modules/lit-html/directives/until.js
var n7 = (t7) => !i5(t7) && "function" == typeof t7.then;
var h6 = 1073741823;
var c5 = class extends c4 {
  constructor() {
    super(...arguments), this._$C_t = h6, this._$Cwt = [], this._$Cq = new s7(this), this._$CK = new i6();
  }
  render(...s8) {
    var i7;
    return null !== (i7 = s8.find((t7) => !n7(t7))) && void 0 !== i7 ? i7 : T;
  }
  update(s8, i7) {
    const r7 = this._$Cwt;
    let e10 = r7.length;
    this._$Cwt = i7;
    const o12 = this._$Cq, c6 = this._$CK;
    this.isConnected || this.disconnected();
    for (let t7 = 0; t7 < i7.length && !(t7 > this._$C_t); t7++) {
      const s9 = i7[t7];
      if (!n7(s9))
        return this._$C_t = t7, s9;
      t7 < e10 && s9 === r7[t7] || (this._$C_t = h6, e10 = 0, Promise.resolve(s9).then(async (t8) => {
        for (; c6.get(); )
          await c6.get();
        const i8 = o12.deref();
        if (void 0 !== i8) {
          const r8 = i8._$Cwt.indexOf(s9);
          r8 > -1 && r8 < i8._$C_t && (i8._$C_t = r8, i8.setValue(t8));
        }
      }));
    }
    return T;
  }
  disconnected() {
    this._$Cq.disconnect(), this._$CK.pause();
  }
  reconnected() {
    this._$Cq.reconnect(this), this._$CK.resume();
  }
};
var m3 = e5(c5);

// ../../node_modules/@api-viewer/common/lib/manifest.js
function hasCustomElements(manifest) {
  return !!manifest && Array.isArray(manifest.modules) && manifest.modules.some((x2) => x2.exports?.some((y2) => y2.kind === "custom-element-definition") || x2.declarations?.some((z2) => z2.customElement));
}
var isCustomElementExport = (y2) => y2.kind === "custom-element-definition";
var isCustomElementDeclaration = (y2) => y2.customElement;
var isPublic = (x2) => !(x2.privacy === "private" || x2.privacy === "protected");
async function fetchManifest(src) {
  try {
    const file = await fetch(src);
    const manifest = await file.json();
    if (hasCustomElements(manifest)) {
      return manifest;
    }
    throw new Error(`No element definitions found at ${src}`);
  } catch (e10) {
    console.error(e10);
    return null;
  }
}
function getCustomElements(manifest, only) {
  const exports = (manifest.modules ?? []).flatMap((x2) => x2.exports?.filter(isCustomElementExport) ?? []);
  return only ? exports.filter((e10) => only.includes(e10.name)) : exports;
}
var getElementData = (manifest, elements, selected) => {
  const index = selected ? elements.findIndex((el) => el?.name === selected) : 0;
  const element = elements[index];
  if (!element) {
    return null;
  }
  const { name, module } = element.declaration;
  const decl = !module ? manifest.modules.flatMap((x2) => x2.declarations).find((y2) => y2?.name === name) : manifest.modules.find((m4) => m4.path === module.replace(/^\//, ""))?.declarations?.find((d4) => d4.name === name);
  if (!decl || !isCustomElementDeclaration(decl)) {
    throw new Error(`Could not find declaration for ${selected}`);
  }
  return {
    customElement: true,
    name: element.name,
    description: decl?.description,
    slots: decl.slots ?? [],
    attributes: decl.attributes ?? [],
    members: decl.members ?? [],
    events: decl.events ?? [],
    cssParts: decl.cssParts ?? [],
    // TODO: analyzer should sort CSS custom properties
    cssProperties: [...decl.cssProperties ?? []].sort((a4, b2) => a4.name > b2.name ? 1 : -1)
  };
};
var getPublicFields = (members = []) => members.filter((x2) => x2.kind === "field" && isPublic(x2));
var getPublicMethods = (members = []) => members.filter((x2) => x2.kind === "method" && isPublic(x2));

// ../../node_modules/@api-viewer/common/lib/manifest-mixin.js
var emptyDataWarning = x`
  <div part="warning">No custom elements found in the JSON file.</div>
`;
var ManifestMixin = (base) => {
  class ManifestClass extends base {
    constructor() {
      super(...arguments);
      this.jsonFetched = Promise.resolve(null);
    }
    willUpdate() {
      const { src } = this;
      if (this.manifest) {
        if (hasCustomElements(this.manifest)) {
          this.lastSrc = void 0;
          this.jsonFetched = Promise.resolve(this.manifest);
        } else {
          console.error("No custom elements found in the `manifest` object.");
        }
      } else if (src && this.lastSrc !== src) {
        this.lastSrc = src;
        this.jsonFetched = fetchManifest(src);
      }
    }
  }
  __decorate([
    n5()
  ], ManifestClass.prototype, "src", void 0);
  __decorate([
    n5({ attribute: false })
  ], ManifestClass.prototype, "manifest", void 0);
  __decorate([
    n5({
      reflect: true,
      converter: {
        fromAttribute: (value) => value.split(","),
        toAttribute: (value) => value.join(",")
      }
    })
  ], ManifestClass.prototype, "only", void 0);
  __decorate([
    n5()
  ], ManifestClass.prototype, "selected", void 0);
  return ManifestClass;
};

// ../../node_modules/@api-viewer/common/lib/utils.js
var unquote = (value) => typeof value === "string" && value.startsWith("'") && value.endsWith("'") ? value.slice(1, value.length - 1) : value;
function html(strings, ...values) {
  const template = document.createElement("template");
  template.innerHTML = values.reduce((acc, v3, idx) => acc + v3 + strings[idx + 1], strings[0]);
  return template;
}

// ../../node_modules/@api-viewer/tabs/lib/api-viewer-tab.js
var tabIdCounter = 0;
var tpl = html`
  <style>
    :host {
      display: flex;
      align-items: center;
      flex-shrink: 0;
      box-sizing: border-box;
      position: relative;
      max-width: 150px;
      overflow: hidden;
      min-height: 3rem;
      padding: 0 1rem;
      color: var(--ave-tab-color);
      font-size: 0.875rem;
      line-height: 1.2;
      font-weight: 500;
      text-transform: uppercase;
      outline: none;
      cursor: pointer;
      -webkit-user-select: none;
      user-select: none;
      -webkit-tap-highlight-color: transparent;
    }

    :host([hidden]) {
      display: none !important;
    }

    :host::before {
      content: '';
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      width: var(--ave-tab-indicator-size);
      background-color: var(--ave-primary-color);
      opacity: 0;
    }

    :host([selected]) {
      color: var(--ave-tab-selected-color, var(--ave-primary-color));
    }

    :host([selected])::before {
      opacity: 1;
    }

    :host::after {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background-color: var(--ave-primary-color);
      opacity: 0;
      transition: opacity 0.1s linear;
    }

    :host(:hover)::after {
      opacity: 0.08;
    }

    :host([focus-ring])::after {
      opacity: 0.12;
    }

    :host([active])::after {
      opacity: 0.16;
    }

    @media (max-width: 600px) {
      :host {
        justify-content: center;
        text-align: center;
      }

      :host::before {
        top: auto;
        right: 0;
        width: 100%;
        height: var(--ave-tab-indicator-size);
      }
    }
  </style>
  <slot></slot>
`;
var ApiViewerTab = class extends HTMLElement {
  get selected() {
    return this._selected;
  }
  set selected(selected) {
    this._selected = selected;
    this.setAttribute("aria-selected", String(selected));
    this.setAttribute("tabindex", selected ? "0" : "-1");
    this.toggleAttribute("selected", selected);
  }
  constructor() {
    super();
    this._mousedown = false;
    this._selected = false;
    const root = this.attachShadow({ mode: "open" });
    root.appendChild(tpl.content.cloneNode(true));
    this.addEventListener("focus", () => this._setFocused(true), true);
    this.addEventListener("blur", () => {
      this._setFocused(false);
      this._setActive(false);
    }, true);
    this.addEventListener("mousedown", () => {
      this._setActive(this._mousedown = true);
      const mouseUpListener = () => {
        this._setActive(this._mousedown = false);
        document.removeEventListener("mouseup", mouseUpListener);
      };
      document.addEventListener("mouseup", mouseUpListener);
    });
  }
  connectedCallback() {
    this.setAttribute("role", "tab");
    if (!this.id) {
      this.id = `api-viewer-tab-${tabIdCounter++}`;
    }
  }
  _setActive(active) {
    this.toggleAttribute("active", active);
  }
  _setFocused(focused) {
    this.toggleAttribute("focused", focused);
    this.toggleAttribute("focus-ring", focused && !this._mousedown);
  }
};
customElements.define("api-viewer-tab", ApiViewerTab);

// ../../node_modules/@api-viewer/tabs/lib/api-viewer-panel.js
var panelIdCounter = 0;
var tpl2 = html`
  <style>
    :host {
      display: block;
      box-sizing: border-box;
      width: 100%;
      overflow: hidden;
    }

    :host([hidden]) {
      display: none !important;
    }
  </style>
  <slot></slot>
`;
var ApiViewerPanel = class extends HTMLElement {
  constructor() {
    super();
    const root = this.attachShadow({ mode: "open" });
    root.appendChild(tpl2.content.cloneNode(true));
  }
  connectedCallback() {
    this.setAttribute("role", "tabpanel");
    if (!this.id) {
      this.id = `api-viewer-panel-${panelIdCounter++}`;
    }
  }
};
customElements.define("api-viewer-panel", ApiViewerPanel);

// ../../node_modules/@api-viewer/tabs/lib/api-viewer-tabs.js
var tpl3 = html`
  <style>
    :host {
      display: flex;
      border-bottom-left-radius: var(--ave-border-radius);
      overflow: hidden;
    }

    @media (max-width: 600px) {
      :host {
        flex-direction: column;
      }

      .tabs {
        display: flex;
        flex-grow: 1;
        align-self: stretch;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
      }
    }
  </style>
  <div class="tabs">
    <slot name="tab"></slot>
  </div>
  <slot name="panel"></slot>
`;
var ApiViewerTabs = class extends HTMLElement {
  constructor() {
    super();
    const root = this.attachShadow({ mode: "open" });
    root.appendChild(tpl3.content.cloneNode(true));
    const slots = root.querySelectorAll("slot");
    slots[0].addEventListener("slotchange", () => this._linkPanels());
    slots[1].addEventListener("slotchange", () => this._linkPanels());
    this.addEventListener("keydown", this.handleEvent);
    this.addEventListener("click", this.handleEvent);
  }
  connectedCallback() {
    this.setAttribute("role", "tablist");
    requestAnimationFrame(() => {
      this._linkPanels();
    });
  }
  _linkPanels() {
    const { tabs } = this;
    tabs.forEach((tab) => {
      const panel = tab.nextElementSibling;
      tab.setAttribute("aria-controls", panel.id);
      panel.setAttribute("aria-labelledby", tab.id);
    });
    const selectedTab = tabs.find((tab) => tab.selected) || tabs[0];
    this._selectTab(selectedTab);
  }
  get tabs() {
    return Array.from(this.querySelectorAll("api-viewer-tab"));
  }
  _getAvailableIndex(idx, increment) {
    const { tabs } = this;
    const total = tabs.length;
    for (let i7 = 0; typeof idx === "number" && i7 < total; i7++, idx += increment || 1) {
      if (idx < 0) {
        idx = total - 1;
      } else if (idx >= total) {
        idx = 0;
      }
      const tab = tabs[idx];
      if (!tab.hasAttribute("hidden")) {
        return idx;
      }
    }
    return -1;
  }
  _prevTab(tabs) {
    const newIdx = this._getAvailableIndex(tabs.findIndex((tab) => tab.selected) - 1, -1);
    return tabs[(newIdx + tabs.length) % tabs.length];
  }
  _nextTab(tabs) {
    const newIdx = this._getAvailableIndex(tabs.findIndex((tab) => tab.selected) + 1, 1);
    return tabs[newIdx % tabs.length];
  }
  /**
   * `reset()` marks all tabs as deselected and hides all the panels.
   */
  reset() {
    this.tabs.forEach((tab) => {
      tab.selected = false;
    });
    this.querySelectorAll("api-viewer-panel").forEach((panel) => {
      panel.hidden = true;
    });
  }
  /**
   * `selectFirst()` automatically selects first non-hidden tab.
   */
  selectFirst() {
    const idx = this._getAvailableIndex(0, 1);
    this._selectTab(this.tabs[idx % this.tabs.length]);
  }
  _selectTab(newTab) {
    this.reset();
    const panelId = newTab.getAttribute("aria-controls");
    const newPanel = this.querySelector(`#${panelId}`);
    if (newPanel) {
      newTab.selected = true;
      newPanel.hidden = false;
    }
  }
  handleEvent(event) {
    const { target } = event;
    if (target && target instanceof ApiViewerTab) {
      let newTab;
      if (event.type === "keydown") {
        const { tabs } = this;
        switch (event.key) {
          case "ArrowLeft":
          case "ArrowUp":
            newTab = this._prevTab(tabs);
            break;
          case "ArrowDown":
          case "ArrowRight":
            newTab = this._nextTab(tabs);
            break;
          case "Home":
            newTab = tabs[0];
            break;
          case "End":
            newTab = tabs[tabs.length - 1];
            break;
          default:
            return;
        }
        event.preventDefault();
      } else {
        newTab = target;
      }
      this._selectTab(newTab);
      newTab.focus();
    }
  }
};
customElements.define("api-viewer-tabs", ApiViewerTabs);

// ../../node_modules/@api-viewer/demo/lib/controllers/abstract-controller.js
var AbstractController = class {
  get data() {
    return this._data;
  }
  set data(data) {
    this._data = data;
    this.updateData(data);
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  updateData(_data) {
    if (this.host.isConnected) {
      this.host.requestUpdate();
    }
  }
  constructor(host, component) {
    this._data = [];
    (this.host = host).addController(this);
    this.el = component;
  }
  clear() {
    this.data = [];
  }
  destroy() {
    this.host.removeController(this);
  }
};

// ../../node_modules/@api-viewer/demo/lib/controllers/events-controller.js
var EventsController = class extends AbstractController {
  constructor(host, component, events) {
    super(host, component);
    events.forEach(({ name }) => {
      component.addEventListener(name, (evt) => {
        const s8 = "-changed";
        if (name.endsWith(s8)) {
          const { knob } = host.getKnob(name.replace(s8, ""));
          host.syncKnob(component, knob);
        }
        this.data = [...this.data, evt];
      });
    });
  }
};

// ../../node_modules/@api-viewer/demo/lib/ui/controls.js
var capitalize = (name) => name[0].toUpperCase() + name.slice(1);
var formatSlot = (name) => capitalize(name === "" ? "content" : name);
var cssPropRenderer = (knob, id2) => {
  const { name, value } = knob;
  return x`
    <input
      id=${id2}
      type="text"
      .value=${String(value)}
      data-name=${name}
      part="input"
    />
  `;
};
var propRenderer = (knob, id2) => {
  const { name, knobType, value, options: options2 } = knob;
  let input;
  if (knobType === "select" && Array.isArray(options2)) {
    input = x`
      <select id=${id2} data-name=${name} data-type=${knobType} part="select">
        ${options2.map((option) => x`<option value=${option}>${option}</option>`)}
      </select>
    `;
  } else if (knobType === "boolean") {
    input = x`
      <input
        id=${id2}
        type="checkbox"
        .checked=${Boolean(value)}
        data-name=${name}
        data-type=${knobType}
        part="checkbox"
      />
    `;
  } else {
    input = x`
      <input
        id=${id2}
        type=${knobType === "number" ? "number" : "text"}
        .value=${value == null ? "" : String(value)}
        data-name=${name}
        data-type=${knobType}
        part="input"
      />
    `;
  }
  return input;
};
var slotRenderer = (knob, id2) => {
  const { name, content } = knob;
  return x`
    <input
      id=${id2}
      type="text"
      .value=${content}
      data-type="slot"
      data-slot=${name}
      part="input"
    />
  `;
};
var renderKnobs = (items, header, type, renderer2) => {
  const rows = items.map((item) => {
    const { name } = item;
    const id2 = `${type}-${name || "default"}`;
    const label = type === "slot" ? formatSlot(name) : name;
    return x`
      <tr>
        <td>
          <label for=${id2} part="knob-label">${label}</label>
        </td>
        <td>${renderer2(item, id2)}</td>
      </tr>
    `;
  });
  return x`
    <h3 part="knobs-header" ?hidden=${items.length === 0}>${header}</h3>
    <table>
      ${rows}
    </table>
  `;
};

// ../../node_modules/@api-viewer/demo/lib/controllers/slots-controller.js
var SlotsController = class extends AbstractController {
  constructor(host, component, id2, slots) {
    super(host, component);
    this.enabled = !hasTemplate(id2, component.localName, TemplateTypes.SLOT);
    this.data = slots.sort((a4, b2) => {
      if (a4.name === "") {
        return 1;
      }
      if (b2.name === "") {
        return -1;
      }
      return a4.name.localeCompare(b2.name);
    }).map((slot) => ({
      ...slot,
      content: formatSlot(slot.name)
    }));
  }
  setValue(name, content) {
    this.data = this.data.map((slot) => slot.name === name ? { ...slot, content } : slot);
  }
  updateData(data) {
    super.updateData(data);
    if (this.enabled && this.el.isConnected && data && data.length) {
      this.el.innerHTML = "";
      data.forEach((slot) => {
        let node;
        const { name, content } = slot;
        if (name) {
          node = document.createElement("div");
          node.setAttribute("slot", name);
          node.textContent = content;
        } else {
          node = document.createTextNode(content);
        }
        this.el.appendChild(node);
      });
    }
  }
};

// ../../node_modules/@api-viewer/demo/lib/controllers/styles-controller.js
var StylesController = class extends AbstractController {
  constructor(host, component, cssProps) {
    super(host, component);
    if (cssProps.length) {
      const style = getComputedStyle(component);
      this.data = cssProps.map((cssProp) => {
        let value = cssProp.default ? unquote(cssProp.default) : style.getPropertyValue(cssProp.name);
        const result = cssProp;
        if (value) {
          value = value.trim();
          result.default = value;
          result.value = value;
        }
        return result;
      });
    }
  }
  setValue(name, value) {
    this.data = this.data.map((prop) => prop.name === name ? { ...prop, value } : prop);
  }
  updateData(data) {
    super.updateData(data);
    if (data.length) {
      data.forEach((prop) => {
        const { name, value } = prop;
        if (value) {
          if (value === prop.default) {
            this.el.style.removeProperty(name);
          } else {
            this.el.style.setProperty(name, value);
          }
        }
      });
    }
  }
};

// ../../node_modules/@api-viewer/demo/lib/ui/events.js
var renderDetail = (detail) => {
  const result = detail;
  const undef = "undefined";
  if ("value" in detail && detail.value === void 0) {
    result.value = undef;
  }
  return ` detail: ${JSON.stringify(detail).replace(`"${undef}"`, undef)}`;
};
var renderEvents = (log) => x`
  ${log.map((event) => x`
      <p part="event-record">
        event:
        ${event.type}.${event.detail == null ? A : renderDetail(event.detail)}
      </p>
    `)}
`;

// ../../node_modules/lit-html/directives/unsafe-html.js
var e7 = class extends i4 {
  constructor(i7) {
    if (super(i7), this.et = A, i7.type !== t3.CHILD)
      throw Error(this.constructor.directiveName + "() can only be used in child bindings");
  }
  render(r7) {
    if (r7 === A || null == r7)
      return this.ft = void 0, this.et = r7;
    if (r7 === T)
      return r7;
    if ("string" != typeof r7)
      throw Error(this.constructor.directiveName + "() called with a non-string value");
    if (r7 === this.et)
      return this.ft;
    this.et = r7;
    const s8 = [r7];
    return s8.raw = s8, this.ft = { _$litType$: this.constructor.resultType, strings: s8, values: [] };
  }
};
e7.directiveName = "unsafeHTML", e7.resultType = 1;
var o6 = e5(e7);

// ../../node_modules/highlight-ts/es/render/html.js
function escape(value) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
var htmlRender = {
  text: function(chunk) {
    return escape(chunk);
  },
  join: function(chunks) {
    return chunks.join("");
  },
  wrap: function(className, chunk) {
    return '<span class="' + className + '">' + chunk + "</span>";
  }
};

// ../../node_modules/highlight-ts/node_modules/tslib/tslib.es6.js
var __assign = function() {
  __assign = Object.assign || function __assign2(t7) {
    for (var s8, i7 = 1, n10 = arguments.length; i7 < n10; i7++) {
      s8 = arguments[i7];
      for (var p2 in s8)
        if (Object.prototype.hasOwnProperty.call(s8, p2))
          t7[p2] = s8[p2];
    }
    return t7;
  };
  return __assign.apply(this, arguments);
};

// ../../node_modules/highlight-ts/es/compile.js
function reStr(re) {
  return re && re.source || re;
}
var noneRe = { exec: function() {
  return null;
} };
function langRe(language, value, global) {
  return new RegExp(reStr(value), "m" + (language.case_insensitive ? "i" : "") + (global ? "g" : ""));
}
function compileLanguage(language) {
  var cached_modes = [];
  function getCompiled(sub) {
    for (var _i = 0, cached_modes_1 = cached_modes; _i < cached_modes_1.length; _i++) {
      var _a = cached_modes_1[_i], mode = _a[0], compiled_1 = _a[1];
      if (sub === mode) {
        return compiled_1;
      }
    }
  }
  var cached_variants = [];
  function getVariants(mode) {
    if (!mode.variants || !mode.variants.length) {
      return void 0;
    }
    for (var _i = 0, cached_variants_1 = cached_variants; _i < cached_variants_1.length; _i++) {
      var _a = cached_variants_1[_i], mode_ = _a[0], variants_1 = _a[1];
      if (mode === mode_) {
        return variants_1;
      }
    }
    var variants = mode.variants.map(function(variant) {
      return __assign({}, mode, { variants: void 0 }, variant);
    });
    cached_variants.push([mode, variants]);
    return variants;
  }
  ;
  function compileMode(mode, parent, parent_terminator_end) {
    var already_compiled = getCompiled(mode);
    if (already_compiled) {
      return already_compiled;
    }
    var compiled2 = {
      lexemesRe: langRe(language, mode.lexemes || /\w+/, true),
      relevance: mode.relevance == null ? 1 : mode.relevance,
      contains: [],
      terminators: noneRe,
      subLanguage: mode.subLanguage == null ? void 0 : typeof mode.subLanguage == "string" ? [mode.subLanguage] : mode.subLanguage
    };
    cached_modes.push([mode, compiled2]);
    if (mode.className) {
      compiled2.className = mode.className;
    }
    if (mode.illegal) {
      compiled2.illegalRe = langRe(language, mode.illegal);
    }
    for (var _i = 0, _a = ["endsParent", "endsWithParent", "skip", "excludeBegin", "excludeEnd", "returnBegin", "returnEnd"]; _i < _a.length; _i++) {
      var key = _a[_i];
      if (mode[key]) {
        compiled2[key] = true;
      }
    }
    var compiled_terminator_end;
    if (parent) {
      var begin = mode.beginKeywords ? "\\b(" + mode.beginKeywords.split(/\s+/).join("|") + ")\\b" : mode.begin || /\B|\b/;
      mode.begin = begin;
      compiled2.beginRe = langRe(language, begin);
      var end = !mode.end && !mode.endsWithParent ? /\B|\b/ : mode.end;
      if (end) {
        mode.end = end;
        compiled2.endRe = langRe(language, end);
      }
      compiled_terminator_end = reStr(end) || "";
      if (mode.endsWithParent && parent_terminator_end) {
        compiled_terminator_end += (end ? "|" : "") + parent_terminator_end;
      }
    }
    var keywords = mode.keywords || mode.beginKeywords;
    if (keywords) {
      var compiled_keywords_1 = {};
      var flatten = function(className2, str) {
        if (language.case_insensitive) {
          str = str.toLowerCase();
        }
        var kws = str.split(/\s+/);
        for (var _i2 = 0, kws_1 = kws; _i2 < kws_1.length; _i2++) {
          var kw = kws_1[_i2];
          var _a2 = kw.split(/\|/), key2 = _a2[0], rel = _a2[1];
          compiled_keywords_1[key2] = [className2, rel ? Number(rel) : 1];
        }
      };
      if (typeof keywords == "string") {
        flatten("keyword", keywords);
      } else {
        for (var className in keywords) {
          flatten(className, keywords[className]);
        }
      }
      compiled2.keywords = compiled_keywords_1;
    }
    var contains = [];
    if (mode.contains && mode.contains.length) {
      for (var _b = 0, _c = mode.contains; _b < _c.length; _b++) {
        var child = _c[_b];
        var sub = child === "self" ? mode : child;
        var variants = getVariants(sub) || sub.endsWithParent && [__assign({}, sub)] || [sub];
        for (var _d = 0, variants_2 = variants; _d < variants_2.length; _d++) {
          var variant = variants_2[_d];
          contains.push(variant);
        }
      }
      compiled2.contains = contains.map(function(child2) {
        return compileMode(child2, compiled2, compiled_terminator_end);
      });
    }
    if (mode.starts) {
      compiled2.starts = compileMode(mode.starts, parent, parent_terminator_end);
    }
    var terminators = contains.map(function(child2) {
      return child2.beginKeywords ? "\\.?(" + child2.begin + ")\\.?" : child2.begin;
    }).concat([
      compiled_terminator_end,
      mode.illegal
    ]).map(reStr).filter(Boolean);
    if (terminators.length)
      compiled2.terminators = langRe(language, terminators.join("|"), true);
    return compiled2;
  }
  var compiled = compileMode(language);
  if (language.case_insensitive)
    compiled.case_insensitive = true;
  return compiled;
}

// ../../node_modules/highlight-ts/es/languages.js
var languages = {};
var aliases = {};
function compiledLanguage(language) {
  return "lexemesRe" in language;
}
function registerLanguage(language) {
  languages[language.name] = language;
  if (language.aliases) {
    for (var _i = 0, _a = language.aliases; _i < _a.length; _i++) {
      var alias = _a[_i];
      aliases[alias] = language.name;
    }
  }
}
function registerLanguages() {
  var languages2 = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    languages2[_i] = arguments[_i];
  }
  for (var _a = 0, languages_1 = languages2; _a < languages_1.length; _a++) {
    var language = languages_1[_a];
    registerLanguage(language);
  }
}
function listLanguages() {
  return Object.keys(languages);
}
function getLanguage(name) {
  name = (name || "").toLowerCase();
  name = aliases[name] || name;
  var language = languages[name];
  if (!language) {
    return void 0;
  }
  if (compiledLanguage(language)) {
    return language;
  }
  return languages[name] = compileLanguage(language);
}

// ../../node_modules/highlight-ts/es/common.js
var UNDERSCORE_IDENT_RE = "[a-zA-Z_]\\w*";
var NUMBER_RE = "\\b\\d+(\\.\\d+)?";
var BACKSLASH_ESCAPE = {
  begin: "\\\\[\\s\\S]",
  relevance: 0
};
var APOS_STRING_MODE = {
  className: "string",
  begin: "'",
  end: "'",
  illegal: "\\n",
  contains: [BACKSLASH_ESCAPE]
};
var QUOTE_STRING_MODE = {
  className: "string",
  begin: '"',
  end: '"',
  illegal: "\\n",
  contains: [BACKSLASH_ESCAPE]
};
var PHRASAL_WORDS_MODE = {
  begin: /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/
};
function COMMENT(begin, end, inherits) {
  if (inherits === void 0) {
    inherits = {};
  }
  var mode = __assign({ className: "comment", begin, end, contains: [] }, inherits);
  var contains = mode.contains;
  if (contains) {
    contains.push(PHRASAL_WORDS_MODE);
    contains.push({
      className: "doctag",
      begin: "(?:TODO|FIXME|NOTE|BUG|XXX):",
      relevance: 0
    });
  }
  return mode;
}
var C_LINE_COMMENT_MODE = COMMENT("//", "$");
var C_BLOCK_COMMENT_MODE = COMMENT("/\\*", "\\*/");
var HASH_COMMENT_MODE = COMMENT("#", "$");
var CSS_NUMBER_MODE = {
  className: "number",
  begin: NUMBER_RE + "(%|em|ex|ch|rem|vw|vh|vmin|vmax|cm|mm|in|pt|pc|px|deg|grad|rad|turn|s|ms|Hz|kHz|dpi|dpcm|dppx)?",
  relevance: 0
};
var METHOD_GUARD = {
  // excludes method names from keyword processing
  begin: "\\.\\s*" + UNDERSCORE_IDENT_RE,
  relevance: 0
};

// ../../node_modules/highlight-ts/es/languages/xml.js
var XML_IDENT_RE = "[A-Za-z0-9\\._:-]+";
var TAG_INTERNALS = {
  endsWithParent: true,
  illegal: /</,
  relevance: 0,
  contains: [
    {
      className: "attr",
      begin: XML_IDENT_RE,
      relevance: 0
    },
    {
      begin: /=\s*/,
      relevance: 0,
      contains: [
        {
          className: "string",
          endsParent: true,
          variants: [
            { begin: /"/, end: /"/ },
            { begin: /'/, end: /'/ },
            { begin: /[^\s"'=<>`]+/ }
          ]
        }
      ]
    }
  ]
};
var XML = {
  name: "xml",
  aliases: ["html", "xhtml", "rss", "atom", "xjb", "xsd", "xsl", "plist"],
  case_insensitive: true,
  contains: [
    {
      className: "meta",
      begin: "<!DOCTYPE",
      end: ">",
      relevance: 10,
      contains: [{ begin: "\\[", end: "\\]" }]
    },
    COMMENT("<!--", "-->", {
      relevance: 10
    }),
    {
      begin: "<\\!\\[CDATA\\[",
      end: "\\]\\]>",
      relevance: 10
    },
    {
      className: "meta",
      begin: /<\?xml/,
      end: /\?>/,
      relevance: 10
    },
    {
      begin: /<\?(php)?/,
      end: /\?>/,
      subLanguage: "php",
      contains: [{ begin: "/\\*", end: "\\*/", skip: true }]
    },
    {
      className: "tag",
      /*
      The lookahead pattern (?=...) ensures that 'begin' only matches
      '<style' as a single word, followed by a whitespace or an
      ending braket. The '$' is needed for the lexeme to be recognized
      by subMode() that tests lexemes outside the stream.
      */
      begin: "<style(?=\\s|>|$)",
      end: ">",
      keywords: { name: "style" },
      contains: [TAG_INTERNALS],
      starts: {
        end: "</style>",
        returnEnd: true,
        subLanguage: ["css", "xml"]
      }
    },
    {
      className: "tag",
      // See the comment in the <style tag about the lookahead pattern
      begin: "<script(?=\\s|>|$)",
      end: ">",
      keywords: { name: "script" },
      contains: [TAG_INTERNALS],
      starts: {
        end: "<\/script>",
        returnEnd: true,
        subLanguage: ["actionscript", "javascript", "handlebars", "xml"]
      }
    },
    {
      className: "tag",
      begin: "</?",
      end: "/?>",
      contains: [
        {
          className: "name",
          begin: /[^\/><\s]+/,
          relevance: 0
        },
        TAG_INTERNALS
      ]
    }
  ]
};

// ../../node_modules/highlight-ts/es/process.js
function testRe(re, lexeme) {
  var match = re && re.exec(lexeme);
  return match && match.index === 0 || false;
}
function highlight(options2, render, lang, value, ignore_illegals, continuation) {
  var output = [{ content: [] }];
  function outContent(content2) {
    var cont = output[0].content;
    if (typeof content2 == "string" && cont.length && typeof cont[cont.length - 1] == "string") {
      cont[cont.length - 1] += content2;
    } else {
      cont.push(content2);
    }
  }
  function outText(text) {
    outContent(render.text(text));
  }
  ;
  function openSpan(className2, noPrefix) {
    if (!noPrefix)
      className2 = options2.classPrefix + className2;
    output.unshift({ className: className2, content: [] });
  }
  ;
  function wrapSpan(className2) {
    className2 = options2.classPrefix + className2;
    output.push({ className: className2, content: [] });
  }
  ;
  function closeSpan() {
    if (output.length < 2)
      throw "unbalanced";
    var _a2 = output.shift(), className2 = _a2.className, content2 = _a2.content;
    var output_2 = render.join(content2);
    outContent(className2 ? render.wrap(className2, output_2) : output_2);
  }
  ;
  function endOfMode(mode, lexeme) {
    if (testRe(mode.endRe, lexeme)) {
      for (; mode.endsParent && mode.parent; mode = mode.parent)
        ;
      return mode;
    }
    if (mode.endsWithParent && mode.parent) {
      return endOfMode(mode.parent, lexeme);
    }
  }
  function processKeywords() {
    if (!top.keywords) {
      outText(mode_buffer);
      return;
    }
    var last_index = 0;
    top.lexemesRe.lastIndex = 0;
    var match2 = top.lexemesRe.exec(mode_buffer);
    while (match2) {
      outText(mode_buffer.substring(last_index, match2.index));
      var match_str = language.case_insensitive ? match2[0].toLowerCase() : match2[0];
      var keyword_match = top.keywords.hasOwnProperty(match_str) && top.keywords[match_str];
      if (keyword_match) {
        relevance += keyword_match[1];
        openSpan(keyword_match[0], false);
        outText(match2[0]);
        closeSpan();
      } else {
        outText(match2[0]);
      }
      last_index = top.lexemesRe.lastIndex;
      match2 = top.lexemesRe.exec(mode_buffer);
    }
    outText(mode_buffer.substr(last_index));
  }
  function processSubLanguage(subLanguage) {
    var explicitLanguage = subLanguage.length == 1 && subLanguage[0];
    if (explicitLanguage && !getLanguage(explicitLanguage)) {
      outText(mode_buffer);
      return;
    }
    var result2 = explicitLanguage ? highlight(options2, render, explicitLanguage, mode_buffer, true, continuations[explicitLanguage]) : highlightAuto(options2, render, mode_buffer, subLanguage.length ? top.subLanguage : void 0);
    if (top.relevance > 0) {
      relevance += result2.relevance;
    }
    if (explicitLanguage && result2.top) {
      continuations[explicitLanguage] = result2.top;
    }
    openSpan(result2.language, true);
    outContent(result2.value);
    closeSpan();
  }
  function processBuffer() {
    if (top.subLanguage != null)
      processSubLanguage(top.subLanguage);
    else
      processKeywords();
    mode_buffer = "";
  }
  function startNewMode(mode) {
    if (mode.className) {
      openSpan(mode.className, false);
    }
    top = Object.create(mode, { parent: { value: top } });
  }
  function processLexeme(buffer, lexeme) {
    mode_buffer += buffer;
    if (lexeme == null) {
      processBuffer();
      return 0;
    }
    var new_mode;
    for (var _i = 0, _a2 = top.contains; _i < _a2.length; _i++) {
      var sub = _a2[_i];
      if (testRe(sub.beginRe, lexeme)) {
        new_mode = sub;
        break;
      }
    }
    if (new_mode) {
      if (new_mode.skip) {
        mode_buffer += lexeme;
      } else {
        if (new_mode.excludeBegin) {
          mode_buffer += lexeme;
        }
        processBuffer();
        if (!new_mode.returnBegin && !new_mode.excludeBegin) {
          mode_buffer = lexeme;
        }
      }
      startNewMode(
        new_mode
        /*, lexeme*/
      );
      return new_mode.returnBegin ? 0 : lexeme.length;
    }
    var end_mode = endOfMode(top, lexeme);
    if (end_mode) {
      var origin_1 = top;
      if (origin_1.skip) {
        mode_buffer += lexeme;
      } else {
        if (!(origin_1.returnEnd || origin_1.excludeEnd)) {
          mode_buffer += lexeme;
        }
        processBuffer();
        if (origin_1.excludeEnd) {
          mode_buffer = lexeme;
        }
      }
      do {
        if (top.className) {
          closeSpan();
        }
        if (!top.skip && !top.subLanguage) {
          relevance += top.relevance;
        }
        top = top.parent;
      } while (top !== end_mode.parent);
      if (end_mode.starts) {
        startNewMode(
          end_mode.starts
          /*, ''*/
        );
      }
      return origin_1.returnEnd ? 0 : lexeme.length;
    }
    if (!ignore_illegals && testRe(top.illegalRe, lexeme)) {
      throw new Error('Illegal lexeme "' + lexeme + '" for mode "' + (top.className || "<unnamed>") + '"');
    }
    mode_buffer += lexeme;
    return lexeme.length || 1;
  }
  var language = getLanguage(lang);
  if (!language)
    throw new Error('Unknown language: "' + lang + '"');
  var top = continuation || language;
  var continuations = {};
  var current;
  for (current = top; current && current !== language; current = current.parent) {
    if (current.className) {
      wrapSpan(current.className);
    }
  }
  var mode_buffer = "";
  var relevance = 0;
  try {
    var match = void 0, count = void 0, index = 0;
    while (true) {
      top.terminators.lastIndex = index;
      match = top.terminators.exec(value);
      if (!match)
        break;
      count = processLexeme(value.substring(index, match.index), match[0]);
      index = match.index + count;
    }
    processLexeme(value.substr(index));
    for (current = top; current.parent; current = current.parent) {
      if (current.className) {
        closeSpan();
      }
    }
    if (output.length != 1)
      throw "unbalanced";
    var _a = output[0], className = _a.className, content = _a.content;
    var output_ = render.join(content);
    var result = className ? render.wrap(className, output_) : output_;
    return {
      language: lang,
      relevance,
      value: result,
      top
    };
  } catch (e10) {
    if (e10.message && e10.message.indexOf("Illegal") !== -1) {
      return {
        language: lang,
        relevance: 0,
        value: render.text(value)
      };
    } else {
      throw e10;
    }
  }
}
function highlightAuto(options2, render, text, languageSubset) {
  if (languageSubset === void 0) {
    languageSubset = options2.languages || listLanguages();
  }
  var result = {
    language: "",
    relevance: 0,
    value: render.text(text)
  };
  if (text != "") {
    var second_best = result;
    var languages2 = languageSubset.filter(getLanguage);
    for (var _i = 0, languages_1 = languages2; _i < languages_1.length; _i++) {
      var lang = languages_1[_i];
      var current = highlight(options2, render, lang, text, false);
      if (current.relevance > second_best.relevance) {
        second_best = current;
      }
      if (current.relevance > result.relevance) {
        second_best = result;
        result = current;
      }
    }
    if (second_best.language) {
      result.second_best = second_best;
    }
  }
  return result;
}
var defaults = {
  classPrefix: "hljs-",
  //tabReplace: undefined,
  useBr: false
};
function init(render, options2) {
  if (options2 === void 0) {
    options2 = {};
  }
  return {
    render,
    options: __assign({}, defaults, options2)
  };
}
function process(_a, source, lang) {
  var render = _a.render, options2 = _a.options;
  return typeof lang == "string" ? highlight(options2, render, lang, source, false) : highlightAuto(options2, render, source, lang);
}

// ../../node_modules/@api-viewer/demo/lib/ui/highlight-css.js
var FUNCTION_LIKE = {
  begin: /[\w-]+\(/,
  returnBegin: true,
  contains: [
    {
      className: "built_in",
      begin: /[\w-]+/
    },
    {
      begin: /\(/,
      end: /\)/,
      contains: [APOS_STRING_MODE, QUOTE_STRING_MODE, CSS_NUMBER_MODE]
    }
  ]
};
var ATTRIBUTE = {
  className: "attribute",
  begin: /\S/,
  end: ":",
  excludeEnd: true,
  starts: {
    endsWithParent: true,
    excludeEnd: true,
    contains: [
      FUNCTION_LIKE,
      CSS_NUMBER_MODE,
      QUOTE_STRING_MODE,
      APOS_STRING_MODE,
      C_BLOCK_COMMENT_MODE,
      {
        className: "number",
        begin: "#[0-9A-Fa-f]+"
      },
      {
        className: "meta",
        begin: "!important"
      }
    ]
  }
};
var IDENT_RE = "[a-zA-Z-][a-zA-Z0-9_-]*";
var RULE = {
  begin: /(?:[A-Z_.-]+|--[a-zA-Z0-9_-]+)\s*:/,
  returnBegin: true,
  end: ";",
  endsWithParent: true,
  contains: [ATTRIBUTE]
};
var CSS2 = {
  name: "css",
  case_insensitive: true,
  illegal: /[=/|'$]/,
  contains: [
    C_BLOCK_COMMENT_MODE,
    {
      className: "selector-attr",
      begin: /\[/,
      end: /\]/,
      illegal: "$",
      contains: [APOS_STRING_MODE, QUOTE_STRING_MODE]
    },
    {
      className: "selector-tag",
      begin: IDENT_RE,
      relevance: 0
    },
    {
      begin: "{",
      end: "}",
      illegal: /\S/,
      contains: [C_BLOCK_COMMENT_MODE, RULE]
    }
  ]
};

// ../../node_modules/@api-viewer/demo/lib/ui/snippet.js
registerLanguages(CSS2, XML);
var highlighter = init(htmlRender, {
  classPrefix: ""
});
var { PREFIX, SLOT, SUFFIX, WRAPPER } = TemplateTypes;
var INDENT = "  ";
var unindent = (text, prepend) => {
  if (!text)
    return text;
  const lines = text.replace(/\t/g, INDENT).split("\n");
  const indent = lines.reduce((prev, line) => {
    if (/^\s*$/.test(line))
      return prev;
    const match = line.match(/^(\s*)/);
    const lineIndent = match && match[0].length;
    if (prev === null)
      return lineIndent;
    return lineIndent < prev ? lineIndent : prev;
  }, null);
  return lines.map((l7) => prepend + l7.substr(indent)).join("\n");
};
var getTplContent = (template, prepend) => {
  const tpl4 = template.innerHTML.replace(/\s+$/, "").replace(/(="")/g, "");
  return unindent(tpl4, prepend);
};
var renderSnippet = (id2, tag, values, slots, cssProps) => {
  let markup = "";
  const prefix = getTemplate(id2, tag, PREFIX);
  if (isTemplate(prefix)) {
    markup += `${getTplContent(prefix, "").trim()}
`;
  }
  let prepend = "";
  let wrap = null;
  const wrapper = getTemplate(id2, tag, WRAPPER);
  const wrapNode = getTemplateNode(wrapper);
  if (wrapNode) {
    prepend = INDENT;
    const match = wrapNode.outerHTML.match(/<([a-z]+)[^>]*>/);
    if (match) {
      wrap = wrapNode.tagName.toLowerCase();
      markup += `${match[0]}
${INDENT}`;
    }
  }
  markup += `<${tag}`;
  Object.keys(values).sort((a4, b2) => a4 > b2 ? 1 : -1).forEach((key) => {
    const { value: value2, knobType, attribute } = values[key];
    const attr = attribute || key;
    switch (knobType) {
      case "boolean":
        markup += value2 ? ` ${attr}` : "";
        break;
      case "select":
        markup += value2 !== "" ? ` ${attr}="${value2}"` : "";
        break;
      default:
        markup += value2 != null ? ` ${attr}="${value2}"` : "";
        break;
    }
  });
  markup += `>`;
  const template = getTemplate(id2, tag, SLOT);
  if (isTemplate(template)) {
    markup += `${getTplContent(template, `${prepend}${INDENT}`)}
${prepend}`;
  } else if (slots.length) {
    if (slots.length === 1 && !slots[0].name) {
      markup += slots[0].content;
    } else {
      markup += slots.reduce((result, slot) => {
        const { name, content } = slot;
        const line = name ? `<div slot="${name}">${content}</div>` : content;
        return `${result}
${prepend}${INDENT}${line}`;
      }, "");
      markup += `
${prepend}`;
    }
  }
  markup += `</${tag}>`;
  if (wrap) {
    markup += `
</${wrap}>`;
  }
  const suffix = getTemplate(id2, tag, SUFFIX);
  if (isTemplate(suffix)) {
    markup += `
${getTplContent(suffix, "").trim()}
`;
  }
  const cssValues = cssProps.filter((p2) => p2.value !== p2.default);
  if (cssValues.length) {
    markup += `
<style>
${INDENT}${tag} {
`;
    cssValues.forEach((prop) => {
      if (prop.value) {
        markup += `${INDENT}${INDENT}${prop.name}: ${prop.value};
`;
      }
    });
    markup += `${INDENT}}
</style>`;
  }
  const { value } = process(highlighter, markup, ["xml", "css"]);
  return x`<pre><code>${o6(value)}</code></pre>`;
};

// ../../node_modules/@api-viewer/demo/lib/ui/knobs.js
var getDefault = (prop) => {
  const { knobType, default: value } = prop;
  switch (knobType) {
    case "boolean":
      return value !== "false";
    case "number":
      return Number(value);
    default:
      return unquote(value);
  }
};
var normalizeType = (type = "") => type.replace(" | undefined", "").replace(" | null", "");
var getKnobs = (props, exclude = "") => {
  let propKnobs = props.filter(({ name, readonly }) => !exclude.includes(name) && !readonly);
  propKnobs = propKnobs.map((prop) => {
    const knob = {
      ...prop,
      knobType: normalizeType(prop.type?.text)
    };
    if (typeof knob.default === "string") {
      knob.value = getDefault(knob);
    }
    return knob;
  });
  return propKnobs;
};
var getCustomKnobs = (tag, vid) => getTemplates(vid, tag, TemplateTypes.KNOB).map((template) => {
  const { attr, type } = template.dataset;
  let result = null;
  if (attr) {
    if (type === "select") {
      const node = getTemplateNode(template);
      const options2 = node ? Array.from(node.children).filter((c6) => c6 instanceof HTMLOptionElement).map((option) => option.value) : [];
      if (node instanceof HTMLSelectElement && options2.length > 1) {
        result = {
          name: attr,
          attribute: attr,
          knobType: type,
          options: options2
        };
      }
    }
    if (type === "string" || type === "boolean") {
      result = {
        name: attr,
        attribute: attr,
        knobType: type
      };
    }
  }
  return result;
}).filter(Boolean);
var getInitialKnobs = (propKnobs, component) => propKnobs.filter((prop) => {
  const { name, knobType } = prop;
  const defaultValue = getDefault(prop);
  return component[name] !== defaultValue || knobType === "boolean" && defaultValue;
});

// ../../node_modules/lit-html/directives/template-content.js
var o7 = e5(class extends i4 {
  constructor(t7) {
    if (super(t7), t7.type !== t3.CHILD)
      throw Error("templateContent can only be used in child bindings");
  }
  render(r7) {
    return this.vt === r7 ? T : (this.vt = r7, document.importNode(r7.content, true));
  }
});

// ../../node_modules/@api-viewer/demo/lib/ui/renderer.js
var { HOST, PREFIX: PREFIX2, SLOT: SLOT2, SUFFIX: SUFFIX2, WRAPPER: WRAPPER2 } = TemplateTypes;
var updateComponent = (component, options2) => {
  const { knobs } = options2;
  Object.keys(knobs).forEach((key) => {
    const { attribute, value, custom } = knobs[key];
    if (custom && attribute) {
      if (typeof value === "string" && value) {
        component.setAttribute(attribute, value);
      } else {
        component.removeAttribute(attribute);
      }
    } else {
      component[key] = value;
    }
  });
};
var isDefinedPromise = (action) => typeof action === "object" && Promise.resolve(action) === action;
async function elementUpdated(element) {
  let hasSpecificAwait = false;
  const el = element;
  const litPromise = el.updateComplete;
  if (isDefinedPromise(litPromise)) {
    await litPromise;
    hasSpecificAwait = true;
  }
  const stencilPromise = el.componentOnReady ? el.componentOnReady() : false;
  if (isDefinedPromise(stencilPromise)) {
    await stencilPromise;
    hasSpecificAwait = true;
  }
  if (!hasSpecificAwait) {
    await new Promise(requestAnimationFrame);
  }
  return el;
}
var Renderer = class extends i4 {
  constructor(part) {
    super(part);
    if (part.type !== t3.CHILD) {
      throw new Error("renderer only supports binding to element");
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  render(_options) {
    return A;
  }
  update(part, [options2]) {
    const parent = part.options?.host;
    const { tag } = options2;
    const result = [];
    const [host, prefix, suffix, slot, wrapper] = [
      HOST,
      PREFIX2,
      SUFFIX2,
      SLOT2,
      WRAPPER2
    ].map((type) => getTemplate(options2.id, tag, type));
    const wrapNode = getTemplateNode(wrapper);
    const wrapTagName = wrapNode ? wrapNode.localName : "";
    let component = parent.querySelector(tag);
    if (component) {
      const output = parent.querySelector('[part="demo-output"]');
      const outer = component.parentElement;
      if (outer && (outer === output || outer.localName === wrapTagName)) {
        updateComponent(component, options2);
        return T;
      }
    }
    const closing = `</${tag}>`;
    const node = getTemplateNode(host);
    if (isTemplate(prefix)) {
      result.push(o7(prefix));
    }
    let raw = node ? node.outerHTML : `<${tag}>${closing}`;
    if (isTemplate(slot)) {
      raw = raw.replace(closing, `${slot.innerHTML}${closing}`);
    }
    if (wrapTagName) {
      const wrapped = o6(`
        <${wrapTagName}>
          ${raw}
        </${wrapTagName}>
      `);
      result.push(wrapped);
    } else {
      result.push(o6(raw));
    }
    if (isTemplate(suffix)) {
      result.push(o7(suffix));
    }
    Promise.resolve().then(() => {
      component = parent.querySelector(tag);
      if (component) {
        elementUpdated(component).then(() => {
          component.dispatchEvent(new CustomEvent("rendered", {
            detail: {
              component
            },
            bubbles: true,
            composed: true
          }));
        });
      }
    });
    return x`${result}`;
  }
};
var renderer = e5(Renderer);

// ../../node_modules/@api-viewer/demo/lib/layout.js
var ApiDemoLayout = class extends s4 {
  constructor() {
    super(...arguments);
    this.copyBtnText = "copy";
    this.cssProps = [];
    this.events = [];
    this.slots = [];
    this.tag = "";
    this.props = [];
    this.exclude = "";
    this.defined = false;
  }
  createRenderRoot() {
    return this;
  }
  render() {
    const { tag } = this;
    if (!this.defined) {
      return x`
        <div part="warning">
          Element ${tag} is not defined. Have you imported it?
        </div>
      `;
    }
    const [noCss, noEvents, noSlots, noCustomKnobs, noProps] = [
      this.cssProps,
      this.events,
      this.slots,
      this.customKnobs,
      this.propKnobs
    ].map((arr) => arr.length === 0);
    const id2 = this.vid;
    const log = this.eventsController?.data || [];
    const slots = this.slotsController?.data || [];
    const cssProps = this.stylesController?.data || [];
    const hideSlots = noSlots || hasTemplate(id2, tag, TemplateTypes.SLOT);
    const hideKnobs = noProps && noCustomKnobs;
    return x`
      <div part="demo-output" @rendered=${this.onRendered}>
        ${renderer({ id: id2, tag, knobs: this.knobs })}
      </div>
      <api-viewer-tabs part="demo-tabs">
        <api-viewer-tab slot="tab" part="tab">Source</api-viewer-tab>
        <api-viewer-panel slot="panel" part="tab-panel">
          <button @click=${this._onCopyClick} part="button">
            ${this.copyBtnText}
          </button>
          <div part="demo-snippet">
            ${renderSnippet(id2, tag, this.knobs, slots, cssProps)}
          </div>
        </api-viewer-panel>
        <api-viewer-tab slot="tab" part="tab" ?hidden=${hideKnobs && hideSlots}>
          Knobs
        </api-viewer-tab>
        <api-viewer-panel slot="panel" part="tab-panel">
          <div part="knobs">
            <section
              ?hidden=${hideKnobs}
              part="knobs-column"
              @change=${this._onPropChanged}
            >
              ${renderKnobs(this.propKnobs, "Properties", "prop", propRenderer)}
              ${renderKnobs(this.customKnobs, "Attributes", "attr", propRenderer)}
            </section>
            <section
              ?hidden=${hideSlots}
              part="knobs-column"
              @change=${this._onSlotChanged}
            >
              ${renderKnobs(slots, "Slots", "slot", slotRenderer)}
            </section>
          </div>
        </api-viewer-panel>
        <api-viewer-tab slot="tab" part="tab" ?hidden=${noCss}>
          Styles
        </api-viewer-tab>
        <api-viewer-panel slot="panel" part="tab-panel">
          <div part="knobs" ?hidden=${noCss}>
            <section part="knobs-column" @change=${this._onCssChanged}>
              ${renderKnobs(cssProps, "Custom CSS Properties", "css-prop", cssPropRenderer)}
            </section>
          </div>
        </api-viewer-panel>
        <api-viewer-tab id="events" slot="tab" part="tab" ?hidden=${noEvents}>
          Events
        </api-viewer-tab>
        <api-viewer-panel slot="panel" part="tab-panel">
          <div part="event-log" ?hidden=${noEvents}>
            <button
              @click=${this._onLogClear}
              ?hidden=${!log.length}
              part="button"
            >
              Clear
            </button>
            ${h4(log.length ? renderEvents(log) : x`
                    <p part="event-record">
                      Interact with component to see the event log.
                    </p>
                  `)}
          </div>
        </api-viewer-panel>
      </api-viewer-tabs>
    `;
  }
  willUpdate(props) {
    if (props.has("tag")) {
      const { tag } = this;
      this.defined = !!customElements.get(tag);
      if (!this.defined) {
        customElements.whenDefined(tag).then(() => {
          if (this.tag === tag) {
            this.defined = true;
          }
        });
      }
      this.knobs = {};
      this.propKnobs = getKnobs(this.props, this.exclude);
      this.customKnobs = getCustomKnobs(this.tag, this.vid);
    }
  }
  updated(props) {
    if (props.has("tag") && props.get("tag")) {
      const tabs = this.renderRoot.querySelector("api-viewer-tabs");
      if (tabs) {
        tabs.selectFirst();
      }
    }
  }
  _onLogClear() {
    this.eventsController?.clear();
    const tab = this.querySelector("#events");
    if (tab) {
      tab.focus();
    }
  }
  _onCopyClick() {
    const source = this.renderRoot.querySelector('[part="demo-snippet"] code');
    if (source) {
      const range = document.createRange();
      range.selectNodeContents(source);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      try {
        document.execCommand("copy");
        this.copyBtnText = "done";
      } catch (err) {
        console.error(err);
        this.copyBtnText = "error";
      }
      setTimeout(() => {
        this.copyBtnText = "copy";
      }, 1e3);
      selection.removeAllRanges();
    }
  }
  onRendered(e10) {
    const { component } = e10.detail;
    this.initKnobs(component);
    this.initEvents(component);
    this.initSlots(component);
    this.initStyles(component);
  }
  initEvents(component) {
    const controller = this.eventsController;
    if (controller) {
      controller.destroy();
    }
    this.eventsController = new EventsController(this, component, this.events);
  }
  initKnobs(component) {
    if (hasTemplate(this.vid, this.tag, TemplateTypes.HOST)) {
      const propKnobs = getInitialKnobs(this.propKnobs, component);
      propKnobs.forEach((prop) => {
        this.syncKnob(component, prop);
      });
    }
  }
  initSlots(component) {
    const controller = this.slotsController;
    if (controller) {
      controller.destroy();
    }
    this.slotsController = new SlotsController(this, component, this.vid, this.slots);
  }
  initStyles(component) {
    const controller = this.stylesController;
    if (controller) {
      controller.destroy();
    }
    this.stylesController = new StylesController(this, component, this.cssProps);
  }
  getKnob(name) {
    const isMatch = (prop) => prop.name === name || prop.attribute === name;
    let knob = this.propKnobs.find(isMatch);
    let custom = false;
    if (!knob) {
      knob = this.customKnobs.find(isMatch);
      custom = true;
    }
    return { knob, custom };
  }
  setKnobs(name, knobType, value, attribute, custom = false) {
    this.knobs = {
      ...this.knobs,
      [name]: {
        knobType,
        value,
        attribute,
        custom
      }
    };
  }
  syncKnob(component, changed) {
    const { name, knobType, attribute } = changed;
    const value = component[name];
    this.setKnobs(name, knobType, value, attribute);
    this.propKnobs = this.propKnobs.map((prop) => prop.name === name ? { ...prop, value } : prop);
  }
  _onCssChanged(e10) {
    const target = e10.composedPath()[0];
    this.stylesController?.setValue(target.dataset.name, target.value);
  }
  _onPropChanged(e10) {
    const target = e10.composedPath()[0];
    const { name, type } = target.dataset;
    let value;
    switch (type) {
      case "boolean":
        value = target.checked;
        break;
      case "number":
        value = target.value === "" ? null : Number(target.value);
        break;
      default:
        value = target.value;
    }
    const { knob, custom } = this.getKnob(name);
    this.setKnobs(name, type, value, knob.attribute, custom);
  }
  _onSlotChanged(e10) {
    const target = e10.composedPath()[0];
    this.slotsController?.setValue(target.dataset.slot, target.value);
  }
};
__decorate([
  n5()
], ApiDemoLayout.prototype, "copyBtnText", void 0);
__decorate([
  n5({ attribute: false })
], ApiDemoLayout.prototype, "cssProps", void 0);
__decorate([
  n5({ attribute: false })
], ApiDemoLayout.prototype, "events", void 0);
__decorate([
  n5({ attribute: false })
], ApiDemoLayout.prototype, "slots", void 0);
__decorate([
  n5()
], ApiDemoLayout.prototype, "tag", void 0);
__decorate([
  n5({ attribute: false })
], ApiDemoLayout.prototype, "props", void 0);
__decorate([
  n5()
], ApiDemoLayout.prototype, "exclude", void 0);
__decorate([
  n5({ type: Number })
], ApiDemoLayout.prototype, "vid", void 0);
__decorate([
  n5({ attribute: false })
], ApiDemoLayout.prototype, "customKnobs", void 0);
__decorate([
  n5({ attribute: false })
], ApiDemoLayout.prototype, "knobs", void 0);
__decorate([
  n5({ attribute: false })
], ApiDemoLayout.prototype, "propKnobs", void 0);
__decorate([
  n5({ type: Boolean })
], ApiDemoLayout.prototype, "defined", void 0);
customElements.define("api-demo-layout", ApiDemoLayout);

// ../../node_modules/marked/lib/marked.esm.js
function getDefaults() {
  return {
    async: false,
    baseUrl: null,
    breaks: false,
    extensions: null,
    gfm: true,
    headerIds: true,
    headerPrefix: "",
    highlight: null,
    hooks: null,
    langPrefix: "language-",
    mangle: true,
    pedantic: false,
    renderer: null,
    sanitize: false,
    sanitizer: null,
    silent: false,
    smartypants: false,
    tokenizer: null,
    walkTokens: null,
    xhtml: false
  };
}
var defaults2 = getDefaults();
function changeDefaults(newDefaults) {
  defaults2 = newDefaults;
}
var escapeTest = /[&<>"']/;
var escapeReplace = new RegExp(escapeTest.source, "g");
var escapeTestNoEncode = /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/;
var escapeReplaceNoEncode = new RegExp(escapeTestNoEncode.source, "g");
var escapeReplacements = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
};
var getEscapeReplacement = (ch) => escapeReplacements[ch];
function escape2(html2, encode) {
  if (encode) {
    if (escapeTest.test(html2)) {
      return html2.replace(escapeReplace, getEscapeReplacement);
    }
  } else {
    if (escapeTestNoEncode.test(html2)) {
      return html2.replace(escapeReplaceNoEncode, getEscapeReplacement);
    }
  }
  return html2;
}
var unescapeTest = /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig;
function unescape(html2) {
  return html2.replace(unescapeTest, (_2, n10) => {
    n10 = n10.toLowerCase();
    if (n10 === "colon")
      return ":";
    if (n10.charAt(0) === "#") {
      return n10.charAt(1) === "x" ? String.fromCharCode(parseInt(n10.substring(2), 16)) : String.fromCharCode(+n10.substring(1));
    }
    return "";
  });
}
var caret = /(^|[^\[])\^/g;
function edit(regex, opt) {
  regex = typeof regex === "string" ? regex : regex.source;
  opt = opt || "";
  const obj = {
    replace: (name, val) => {
      val = val.source || val;
      val = val.replace(caret, "$1");
      regex = regex.replace(name, val);
      return obj;
    },
    getRegex: () => {
      return new RegExp(regex, opt);
    }
  };
  return obj;
}
var nonWordAndColonTest = /[^\w:]/g;
var originIndependentUrl = /^$|^[a-z][a-z0-9+.-]*:|^[?#]/i;
function cleanUrl(sanitize, base, href) {
  if (sanitize) {
    let prot;
    try {
      prot = decodeURIComponent(unescape(href)).replace(nonWordAndColonTest, "").toLowerCase();
    } catch (e10) {
      return null;
    }
    if (prot.indexOf("javascript:") === 0 || prot.indexOf("vbscript:") === 0 || prot.indexOf("data:") === 0) {
      return null;
    }
  }
  if (base && !originIndependentUrl.test(href)) {
    href = resolveUrl(base, href);
  }
  try {
    href = encodeURI(href).replace(/%25/g, "%");
  } catch (e10) {
    return null;
  }
  return href;
}
var baseUrls = {};
var justDomain = /^[^:]+:\/*[^/]*$/;
var protocol = /^([^:]+:)[\s\S]*$/;
var domain = /^([^:]+:\/*[^/]*)[\s\S]*$/;
function resolveUrl(base, href) {
  if (!baseUrls[" " + base]) {
    if (justDomain.test(base)) {
      baseUrls[" " + base] = base + "/";
    } else {
      baseUrls[" " + base] = rtrim(base, "/", true);
    }
  }
  base = baseUrls[" " + base];
  const relativeBase = base.indexOf(":") === -1;
  if (href.substring(0, 2) === "//") {
    if (relativeBase) {
      return href;
    }
    return base.replace(protocol, "$1") + href;
  } else if (href.charAt(0) === "/") {
    if (relativeBase) {
      return href;
    }
    return base.replace(domain, "$1") + href;
  } else {
    return base + href;
  }
}
var noopTest = { exec: function noopTest2() {
} };
function splitCells(tableRow, count) {
  const row = tableRow.replace(/\|/g, (match, offset, str) => {
    let escaped = false, curr = offset;
    while (--curr >= 0 && str[curr] === "\\")
      escaped = !escaped;
    if (escaped) {
      return "|";
    } else {
      return " |";
    }
  }), cells = row.split(/ \|/);
  let i7 = 0;
  if (!cells[0].trim()) {
    cells.shift();
  }
  if (cells.length > 0 && !cells[cells.length - 1].trim()) {
    cells.pop();
  }
  if (cells.length > count) {
    cells.splice(count);
  } else {
    while (cells.length < count)
      cells.push("");
  }
  for (; i7 < cells.length; i7++) {
    cells[i7] = cells[i7].trim().replace(/\\\|/g, "|");
  }
  return cells;
}
function rtrim(str, c6, invert) {
  const l7 = str.length;
  if (l7 === 0) {
    return "";
  }
  let suffLen = 0;
  while (suffLen < l7) {
    const currChar = str.charAt(l7 - suffLen - 1);
    if (currChar === c6 && !invert) {
      suffLen++;
    } else if (currChar !== c6 && invert) {
      suffLen++;
    } else {
      break;
    }
  }
  return str.slice(0, l7 - suffLen);
}
function findClosingBracket(str, b2) {
  if (str.indexOf(b2[1]) === -1) {
    return -1;
  }
  const l7 = str.length;
  let level = 0, i7 = 0;
  for (; i7 < l7; i7++) {
    if (str[i7] === "\\") {
      i7++;
    } else if (str[i7] === b2[0]) {
      level++;
    } else if (str[i7] === b2[1]) {
      level--;
      if (level < 0) {
        return i7;
      }
    }
  }
  return -1;
}
function checkSanitizeDeprecation(opt) {
  if (opt && opt.sanitize && !opt.silent) {
    console.warn("marked(): sanitize and sanitizer parameters are deprecated since version 0.7.0, should not be used and will be removed in the future. Read more here: https://marked.js.org/#/USING_ADVANCED.md#options");
  }
}
function repeatString(pattern, count) {
  if (count < 1) {
    return "";
  }
  let result = "";
  while (count > 1) {
    if (count & 1) {
      result += pattern;
    }
    count >>= 1;
    pattern += pattern;
  }
  return result + pattern;
}
function outputLink(cap, link, raw, lexer2) {
  const href = link.href;
  const title = link.title ? escape2(link.title) : null;
  const text = cap[1].replace(/\\([\[\]])/g, "$1");
  if (cap[0].charAt(0) !== "!") {
    lexer2.state.inLink = true;
    const token = {
      type: "link",
      raw,
      href,
      title,
      text,
      tokens: lexer2.inlineTokens(text)
    };
    lexer2.state.inLink = false;
    return token;
  }
  return {
    type: "image",
    raw,
    href,
    title,
    text: escape2(text)
  };
}
function indentCodeCompensation(raw, text) {
  const matchIndentToCode = raw.match(/^(\s+)(?:```)/);
  if (matchIndentToCode === null) {
    return text;
  }
  const indentToCode = matchIndentToCode[1];
  return text.split("\n").map((node) => {
    const matchIndentInNode = node.match(/^\s+/);
    if (matchIndentInNode === null) {
      return node;
    }
    const [indentInNode] = matchIndentInNode;
    if (indentInNode.length >= indentToCode.length) {
      return node.slice(indentToCode.length);
    }
    return node;
  }).join("\n");
}
var Tokenizer = class {
  constructor(options2) {
    this.options = options2 || defaults2;
  }
  space(src) {
    const cap = this.rules.block.newline.exec(src);
    if (cap && cap[0].length > 0) {
      return {
        type: "space",
        raw: cap[0]
      };
    }
  }
  code(src) {
    const cap = this.rules.block.code.exec(src);
    if (cap) {
      const text = cap[0].replace(/^ {1,4}/gm, "");
      return {
        type: "code",
        raw: cap[0],
        codeBlockStyle: "indented",
        text: !this.options.pedantic ? rtrim(text, "\n") : text
      };
    }
  }
  fences(src) {
    const cap = this.rules.block.fences.exec(src);
    if (cap) {
      const raw = cap[0];
      const text = indentCodeCompensation(raw, cap[3] || "");
      return {
        type: "code",
        raw,
        lang: cap[2] ? cap[2].trim().replace(this.rules.inline._escapes, "$1") : cap[2],
        text
      };
    }
  }
  heading(src) {
    const cap = this.rules.block.heading.exec(src);
    if (cap) {
      let text = cap[2].trim();
      if (/#$/.test(text)) {
        const trimmed = rtrim(text, "#");
        if (this.options.pedantic) {
          text = trimmed.trim();
        } else if (!trimmed || / $/.test(trimmed)) {
          text = trimmed.trim();
        }
      }
      return {
        type: "heading",
        raw: cap[0],
        depth: cap[1].length,
        text,
        tokens: this.lexer.inline(text)
      };
    }
  }
  hr(src) {
    const cap = this.rules.block.hr.exec(src);
    if (cap) {
      return {
        type: "hr",
        raw: cap[0]
      };
    }
  }
  blockquote(src) {
    const cap = this.rules.block.blockquote.exec(src);
    if (cap) {
      const text = cap[0].replace(/^ *>[ \t]?/gm, "");
      const top = this.lexer.state.top;
      this.lexer.state.top = true;
      const tokens = this.lexer.blockTokens(text);
      this.lexer.state.top = top;
      return {
        type: "blockquote",
        raw: cap[0],
        tokens,
        text
      };
    }
  }
  list(src) {
    let cap = this.rules.block.list.exec(src);
    if (cap) {
      let raw, istask, ischecked, indent, i7, blankLine, endsWithBlankLine, line, nextLine, rawLine, itemContents, endEarly;
      let bull = cap[1].trim();
      const isordered = bull.length > 1;
      const list = {
        type: "list",
        raw: "",
        ordered: isordered,
        start: isordered ? +bull.slice(0, -1) : "",
        loose: false,
        items: []
      };
      bull = isordered ? `\\d{1,9}\\${bull.slice(-1)}` : `\\${bull}`;
      if (this.options.pedantic) {
        bull = isordered ? bull : "[*+-]";
      }
      const itemRegex = new RegExp(`^( {0,3}${bull})((?:[	 ][^\\n]*)?(?:\\n|$))`);
      while (src) {
        endEarly = false;
        if (!(cap = itemRegex.exec(src))) {
          break;
        }
        if (this.rules.block.hr.test(src)) {
          break;
        }
        raw = cap[0];
        src = src.substring(raw.length);
        line = cap[2].split("\n", 1)[0].replace(/^\t+/, (t7) => " ".repeat(3 * t7.length));
        nextLine = src.split("\n", 1)[0];
        if (this.options.pedantic) {
          indent = 2;
          itemContents = line.trimLeft();
        } else {
          indent = cap[2].search(/[^ ]/);
          indent = indent > 4 ? 1 : indent;
          itemContents = line.slice(indent);
          indent += cap[1].length;
        }
        blankLine = false;
        if (!line && /^ *$/.test(nextLine)) {
          raw += nextLine + "\n";
          src = src.substring(nextLine.length + 1);
          endEarly = true;
        }
        if (!endEarly) {
          const nextBulletRegex = new RegExp(`^ {0,${Math.min(3, indent - 1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`);
          const hrRegex = new RegExp(`^ {0,${Math.min(3, indent - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`);
          const fencesBeginRegex = new RegExp(`^ {0,${Math.min(3, indent - 1)}}(?:\`\`\`|~~~)`);
          const headingBeginRegex = new RegExp(`^ {0,${Math.min(3, indent - 1)}}#`);
          while (src) {
            rawLine = src.split("\n", 1)[0];
            nextLine = rawLine;
            if (this.options.pedantic) {
              nextLine = nextLine.replace(/^ {1,4}(?=( {4})*[^ ])/g, "  ");
            }
            if (fencesBeginRegex.test(nextLine)) {
              break;
            }
            if (headingBeginRegex.test(nextLine)) {
              break;
            }
            if (nextBulletRegex.test(nextLine)) {
              break;
            }
            if (hrRegex.test(src)) {
              break;
            }
            if (nextLine.search(/[^ ]/) >= indent || !nextLine.trim()) {
              itemContents += "\n" + nextLine.slice(indent);
            } else {
              if (blankLine) {
                break;
              }
              if (line.search(/[^ ]/) >= 4) {
                break;
              }
              if (fencesBeginRegex.test(line)) {
                break;
              }
              if (headingBeginRegex.test(line)) {
                break;
              }
              if (hrRegex.test(line)) {
                break;
              }
              itemContents += "\n" + nextLine;
            }
            if (!blankLine && !nextLine.trim()) {
              blankLine = true;
            }
            raw += rawLine + "\n";
            src = src.substring(rawLine.length + 1);
            line = nextLine.slice(indent);
          }
        }
        if (!list.loose) {
          if (endsWithBlankLine) {
            list.loose = true;
          } else if (/\n *\n *$/.test(raw)) {
            endsWithBlankLine = true;
          }
        }
        if (this.options.gfm) {
          istask = /^\[[ xX]\] /.exec(itemContents);
          if (istask) {
            ischecked = istask[0] !== "[ ] ";
            itemContents = itemContents.replace(/^\[[ xX]\] +/, "");
          }
        }
        list.items.push({
          type: "list_item",
          raw,
          task: !!istask,
          checked: ischecked,
          loose: false,
          text: itemContents
        });
        list.raw += raw;
      }
      list.items[list.items.length - 1].raw = raw.trimRight();
      list.items[list.items.length - 1].text = itemContents.trimRight();
      list.raw = list.raw.trimRight();
      const l7 = list.items.length;
      for (i7 = 0; i7 < l7; i7++) {
        this.lexer.state.top = false;
        list.items[i7].tokens = this.lexer.blockTokens(list.items[i7].text, []);
        if (!list.loose) {
          const spacers = list.items[i7].tokens.filter((t7) => t7.type === "space");
          const hasMultipleLineBreaks = spacers.length > 0 && spacers.some((t7) => /\n.*\n/.test(t7.raw));
          list.loose = hasMultipleLineBreaks;
        }
      }
      if (list.loose) {
        for (i7 = 0; i7 < l7; i7++) {
          list.items[i7].loose = true;
        }
      }
      return list;
    }
  }
  html(src) {
    const cap = this.rules.block.html.exec(src);
    if (cap) {
      const token = {
        type: "html",
        raw: cap[0],
        pre: !this.options.sanitizer && (cap[1] === "pre" || cap[1] === "script" || cap[1] === "style"),
        text: cap[0]
      };
      if (this.options.sanitize) {
        const text = this.options.sanitizer ? this.options.sanitizer(cap[0]) : escape2(cap[0]);
        token.type = "paragraph";
        token.text = text;
        token.tokens = this.lexer.inline(text);
      }
      return token;
    }
  }
  def(src) {
    const cap = this.rules.block.def.exec(src);
    if (cap) {
      const tag = cap[1].toLowerCase().replace(/\s+/g, " ");
      const href = cap[2] ? cap[2].replace(/^<(.*)>$/, "$1").replace(this.rules.inline._escapes, "$1") : "";
      const title = cap[3] ? cap[3].substring(1, cap[3].length - 1).replace(this.rules.inline._escapes, "$1") : cap[3];
      return {
        type: "def",
        tag,
        raw: cap[0],
        href,
        title
      };
    }
  }
  table(src) {
    const cap = this.rules.block.table.exec(src);
    if (cap) {
      const item = {
        type: "table",
        header: splitCells(cap[1]).map((c6) => {
          return { text: c6 };
        }),
        align: cap[2].replace(/^ *|\| *$/g, "").split(/ *\| */),
        rows: cap[3] && cap[3].trim() ? cap[3].replace(/\n[ \t]*$/, "").split("\n") : []
      };
      if (item.header.length === item.align.length) {
        item.raw = cap[0];
        let l7 = item.align.length;
        let i7, j2, k2, row;
        for (i7 = 0; i7 < l7; i7++) {
          if (/^ *-+: *$/.test(item.align[i7])) {
            item.align[i7] = "right";
          } else if (/^ *:-+: *$/.test(item.align[i7])) {
            item.align[i7] = "center";
          } else if (/^ *:-+ *$/.test(item.align[i7])) {
            item.align[i7] = "left";
          } else {
            item.align[i7] = null;
          }
        }
        l7 = item.rows.length;
        for (i7 = 0; i7 < l7; i7++) {
          item.rows[i7] = splitCells(item.rows[i7], item.header.length).map((c6) => {
            return { text: c6 };
          });
        }
        l7 = item.header.length;
        for (j2 = 0; j2 < l7; j2++) {
          item.header[j2].tokens = this.lexer.inline(item.header[j2].text);
        }
        l7 = item.rows.length;
        for (j2 = 0; j2 < l7; j2++) {
          row = item.rows[j2];
          for (k2 = 0; k2 < row.length; k2++) {
            row[k2].tokens = this.lexer.inline(row[k2].text);
          }
        }
        return item;
      }
    }
  }
  lheading(src) {
    const cap = this.rules.block.lheading.exec(src);
    if (cap) {
      return {
        type: "heading",
        raw: cap[0],
        depth: cap[2].charAt(0) === "=" ? 1 : 2,
        text: cap[1],
        tokens: this.lexer.inline(cap[1])
      };
    }
  }
  paragraph(src) {
    const cap = this.rules.block.paragraph.exec(src);
    if (cap) {
      const text = cap[1].charAt(cap[1].length - 1) === "\n" ? cap[1].slice(0, -1) : cap[1];
      return {
        type: "paragraph",
        raw: cap[0],
        text,
        tokens: this.lexer.inline(text)
      };
    }
  }
  text(src) {
    const cap = this.rules.block.text.exec(src);
    if (cap) {
      return {
        type: "text",
        raw: cap[0],
        text: cap[0],
        tokens: this.lexer.inline(cap[0])
      };
    }
  }
  escape(src) {
    const cap = this.rules.inline.escape.exec(src);
    if (cap) {
      return {
        type: "escape",
        raw: cap[0],
        text: escape2(cap[1])
      };
    }
  }
  tag(src) {
    const cap = this.rules.inline.tag.exec(src);
    if (cap) {
      if (!this.lexer.state.inLink && /^<a /i.test(cap[0])) {
        this.lexer.state.inLink = true;
      } else if (this.lexer.state.inLink && /^<\/a>/i.test(cap[0])) {
        this.lexer.state.inLink = false;
      }
      if (!this.lexer.state.inRawBlock && /^<(pre|code|kbd|script)(\s|>)/i.test(cap[0])) {
        this.lexer.state.inRawBlock = true;
      } else if (this.lexer.state.inRawBlock && /^<\/(pre|code|kbd|script)(\s|>)/i.test(cap[0])) {
        this.lexer.state.inRawBlock = false;
      }
      return {
        type: this.options.sanitize ? "text" : "html",
        raw: cap[0],
        inLink: this.lexer.state.inLink,
        inRawBlock: this.lexer.state.inRawBlock,
        text: this.options.sanitize ? this.options.sanitizer ? this.options.sanitizer(cap[0]) : escape2(cap[0]) : cap[0]
      };
    }
  }
  link(src) {
    const cap = this.rules.inline.link.exec(src);
    if (cap) {
      const trimmedUrl = cap[2].trim();
      if (!this.options.pedantic && /^</.test(trimmedUrl)) {
        if (!/>$/.test(trimmedUrl)) {
          return;
        }
        const rtrimSlash = rtrim(trimmedUrl.slice(0, -1), "\\");
        if ((trimmedUrl.length - rtrimSlash.length) % 2 === 0) {
          return;
        }
      } else {
        const lastParenIndex = findClosingBracket(cap[2], "()");
        if (lastParenIndex > -1) {
          const start = cap[0].indexOf("!") === 0 ? 5 : 4;
          const linkLen = start + cap[1].length + lastParenIndex;
          cap[2] = cap[2].substring(0, lastParenIndex);
          cap[0] = cap[0].substring(0, linkLen).trim();
          cap[3] = "";
        }
      }
      let href = cap[2];
      let title = "";
      if (this.options.pedantic) {
        const link = /^([^'"]*[^\s])\s+(['"])(.*)\2/.exec(href);
        if (link) {
          href = link[1];
          title = link[3];
        }
      } else {
        title = cap[3] ? cap[3].slice(1, -1) : "";
      }
      href = href.trim();
      if (/^</.test(href)) {
        if (this.options.pedantic && !/>$/.test(trimmedUrl)) {
          href = href.slice(1);
        } else {
          href = href.slice(1, -1);
        }
      }
      return outputLink(cap, {
        href: href ? href.replace(this.rules.inline._escapes, "$1") : href,
        title: title ? title.replace(this.rules.inline._escapes, "$1") : title
      }, cap[0], this.lexer);
    }
  }
  reflink(src, links) {
    let cap;
    if ((cap = this.rules.inline.reflink.exec(src)) || (cap = this.rules.inline.nolink.exec(src))) {
      let link = (cap[2] || cap[1]).replace(/\s+/g, " ");
      link = links[link.toLowerCase()];
      if (!link) {
        const text = cap[0].charAt(0);
        return {
          type: "text",
          raw: text,
          text
        };
      }
      return outputLink(cap, link, cap[0], this.lexer);
    }
  }
  emStrong(src, maskedSrc, prevChar = "") {
    let match = this.rules.inline.emStrong.lDelim.exec(src);
    if (!match)
      return;
    if (match[3] && prevChar.match(/[\p{L}\p{N}]/u))
      return;
    const nextChar = match[1] || match[2] || "";
    if (!nextChar || nextChar && (prevChar === "" || this.rules.inline.punctuation.exec(prevChar))) {
      const lLength = match[0].length - 1;
      let rDelim, rLength, delimTotal = lLength, midDelimTotal = 0;
      const endReg = match[0][0] === "*" ? this.rules.inline.emStrong.rDelimAst : this.rules.inline.emStrong.rDelimUnd;
      endReg.lastIndex = 0;
      maskedSrc = maskedSrc.slice(-1 * src.length + lLength);
      while ((match = endReg.exec(maskedSrc)) != null) {
        rDelim = match[1] || match[2] || match[3] || match[4] || match[5] || match[6];
        if (!rDelim)
          continue;
        rLength = rDelim.length;
        if (match[3] || match[4]) {
          delimTotal += rLength;
          continue;
        } else if (match[5] || match[6]) {
          if (lLength % 3 && !((lLength + rLength) % 3)) {
            midDelimTotal += rLength;
            continue;
          }
        }
        delimTotal -= rLength;
        if (delimTotal > 0)
          continue;
        rLength = Math.min(rLength, rLength + delimTotal + midDelimTotal);
        const raw = src.slice(0, lLength + match.index + (match[0].length - rDelim.length) + rLength);
        if (Math.min(lLength, rLength) % 2) {
          const text2 = raw.slice(1, -1);
          return {
            type: "em",
            raw,
            text: text2,
            tokens: this.lexer.inlineTokens(text2)
          };
        }
        const text = raw.slice(2, -2);
        return {
          type: "strong",
          raw,
          text,
          tokens: this.lexer.inlineTokens(text)
        };
      }
    }
  }
  codespan(src) {
    const cap = this.rules.inline.code.exec(src);
    if (cap) {
      let text = cap[2].replace(/\n/g, " ");
      const hasNonSpaceChars = /[^ ]/.test(text);
      const hasSpaceCharsOnBothEnds = /^ /.test(text) && / $/.test(text);
      if (hasNonSpaceChars && hasSpaceCharsOnBothEnds) {
        text = text.substring(1, text.length - 1);
      }
      text = escape2(text, true);
      return {
        type: "codespan",
        raw: cap[0],
        text
      };
    }
  }
  br(src) {
    const cap = this.rules.inline.br.exec(src);
    if (cap) {
      return {
        type: "br",
        raw: cap[0]
      };
    }
  }
  del(src) {
    const cap = this.rules.inline.del.exec(src);
    if (cap) {
      return {
        type: "del",
        raw: cap[0],
        text: cap[2],
        tokens: this.lexer.inlineTokens(cap[2])
      };
    }
  }
  autolink(src, mangle2) {
    const cap = this.rules.inline.autolink.exec(src);
    if (cap) {
      let text, href;
      if (cap[2] === "@") {
        text = escape2(this.options.mangle ? mangle2(cap[1]) : cap[1]);
        href = "mailto:" + text;
      } else {
        text = escape2(cap[1]);
        href = text;
      }
      return {
        type: "link",
        raw: cap[0],
        text,
        href,
        tokens: [
          {
            type: "text",
            raw: text,
            text
          }
        ]
      };
    }
  }
  url(src, mangle2) {
    let cap;
    if (cap = this.rules.inline.url.exec(src)) {
      let text, href;
      if (cap[2] === "@") {
        text = escape2(this.options.mangle ? mangle2(cap[0]) : cap[0]);
        href = "mailto:" + text;
      } else {
        let prevCapZero;
        do {
          prevCapZero = cap[0];
          cap[0] = this.rules.inline._backpedal.exec(cap[0])[0];
        } while (prevCapZero !== cap[0]);
        text = escape2(cap[0]);
        if (cap[1] === "www.") {
          href = "http://" + cap[0];
        } else {
          href = cap[0];
        }
      }
      return {
        type: "link",
        raw: cap[0],
        text,
        href,
        tokens: [
          {
            type: "text",
            raw: text,
            text
          }
        ]
      };
    }
  }
  inlineText(src, smartypants2) {
    const cap = this.rules.inline.text.exec(src);
    if (cap) {
      let text;
      if (this.lexer.state.inRawBlock) {
        text = this.options.sanitize ? this.options.sanitizer ? this.options.sanitizer(cap[0]) : escape2(cap[0]) : cap[0];
      } else {
        text = escape2(this.options.smartypants ? smartypants2(cap[0]) : cap[0]);
      }
      return {
        type: "text",
        raw: cap[0],
        text
      };
    }
  }
};
var block = {
  newline: /^(?: *(?:\n|$))+/,
  code: /^( {4}[^\n]+(?:\n(?: *(?:\n|$))*)?)+/,
  fences: /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/,
  hr: /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,
  heading: /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,
  blockquote: /^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/,
  list: /^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/,
  html: "^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n *)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n *)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n *)+\\n|$))",
  def: /^ {0,3}\[(label)\]: *(?:\n *)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n *)?| *\n *)(title))? *(?:\n+|$)/,
  table: noopTest,
  lheading: /^((?:.|\n(?!\n))+?)\n {0,3}(=+|-+) *(?:\n+|$)/,
  // regex template, placeholders will be replaced according to different paragraph
  // interruption rules of commonmark and the original markdown spec:
  _paragraph: /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/,
  text: /^[^\n]+/
};
block._label = /(?!\s*\])(?:\\.|[^\[\]\\])+/;
block._title = /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/;
block.def = edit(block.def).replace("label", block._label).replace("title", block._title).getRegex();
block.bullet = /(?:[*+-]|\d{1,9}[.)])/;
block.listItemStart = edit(/^( *)(bull) */).replace("bull", block.bullet).getRegex();
block.list = edit(block.list).replace(/bull/g, block.bullet).replace("hr", "\\n+(?=\\1?(?:(?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$))").replace("def", "\\n+(?=" + block.def.source + ")").getRegex();
block._tag = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|section|source|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul";
block._comment = /<!--(?!-?>)[\s\S]*?(?:-->|$)/;
block.html = edit(block.html, "i").replace("comment", block._comment).replace("tag", block._tag).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex();
block.paragraph = edit(block._paragraph).replace("hr", block.hr).replace("heading", " {0,3}#{1,6} ").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", block._tag).getRegex();
block.blockquote = edit(block.blockquote).replace("paragraph", block.paragraph).getRegex();
block.normal = { ...block };
block.gfm = {
  ...block.normal,
  table: "^ *([^\\n ].*\\|.*)\\n {0,3}(?:\\| *)?(:?-+:? *(?:\\| *:?-+:? *)*)(?:\\| *)?(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)"
  // Cells
};
block.gfm.table = edit(block.gfm.table).replace("hr", block.hr).replace("heading", " {0,3}#{1,6} ").replace("blockquote", " {0,3}>").replace("code", " {4}[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", block._tag).getRegex();
block.gfm.paragraph = edit(block._paragraph).replace("hr", block.hr).replace("heading", " {0,3}#{1,6} ").replace("|lheading", "").replace("table", block.gfm.table).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", block._tag).getRegex();
block.pedantic = {
  ...block.normal,
  html: edit(
    `^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`
  ).replace("comment", block._comment).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),
  def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
  heading: /^(#{1,6})(.*)(?:\n+|$)/,
  fences: noopTest,
  // fences not supported
  lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,
  paragraph: edit(block.normal._paragraph).replace("hr", block.hr).replace("heading", " *#{1,6} *[^\n]").replace("lheading", block.lheading).replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").getRegex()
};
var inline = {
  escape: /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,
  autolink: /^<(scheme:[^\s\x00-\x1f<>]*|email)>/,
  url: noopTest,
  tag: "^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>",
  // CDATA section
  link: /^!?\[(label)\]\(\s*(href)(?:\s+(title))?\s*\)/,
  reflink: /^!?\[(label)\]\[(ref)\]/,
  nolink: /^!?\[(ref)\](?:\[\])?/,
  reflinkSearch: "reflink|nolink(?!\\()",
  emStrong: {
    lDelim: /^(?:\*+(?:([punct_])|[^\s*]))|^_+(?:([punct*])|([^\s_]))/,
    //        (1) and (2) can only be a Right Delimiter. (3) and (4) can only be Left.  (5) and (6) can be either Left or Right.
    //          () Skip orphan inside strong                                      () Consume to delim     (1) #***                (2) a***#, a***                             (3) #***a, ***a                 (4) ***#              (5) #***#                 (6) a***a
    rDelimAst: /^(?:[^_*\\]|\\.)*?\_\_(?:[^_*\\]|\\.)*?\*(?:[^_*\\]|\\.)*?(?=\_\_)|(?:[^*\\]|\\.)+(?=[^*])|[punct_](\*+)(?=[\s]|$)|(?:[^punct*_\s\\]|\\.)(\*+)(?=[punct_\s]|$)|[punct_\s](\*+)(?=[^punct*_\s])|[\s](\*+)(?=[punct_])|[punct_](\*+)(?=[punct_])|(?:[^punct*_\s\\]|\\.)(\*+)(?=[^punct*_\s])/,
    rDelimUnd: /^(?:[^_*\\]|\\.)*?\*\*(?:[^_*\\]|\\.)*?\_(?:[^_*\\]|\\.)*?(?=\*\*)|(?:[^_\\]|\\.)+(?=[^_])|[punct*](\_+)(?=[\s]|$)|(?:[^punct*_\s\\]|\\.)(\_+)(?=[punct*\s]|$)|[punct*\s](\_+)(?=[^punct*_\s])|[\s](\_+)(?=[punct*])|[punct*](\_+)(?=[punct*])/
    // ^- Not allowed for _
  },
  code: /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,
  br: /^( {2,}|\\)\n(?!\s*$)/,
  del: noopTest,
  text: /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,
  punctuation: /^([\spunctuation])/
};
inline._punctuation = "!\"#$%&'()+\\-.,/:;<=>?@\\[\\]`^{|}~";
inline.punctuation = edit(inline.punctuation).replace(/punctuation/g, inline._punctuation).getRegex();
inline.blockSkip = /\[[^\]]*?\]\([^\)]*?\)|`[^`]*?`|<[^>]*?>/g;
inline.escapedEmSt = /(?:^|[^\\])(?:\\\\)*\\[*_]/g;
inline._comment = edit(block._comment).replace("(?:-->|$)", "-->").getRegex();
inline.emStrong.lDelim = edit(inline.emStrong.lDelim).replace(/punct/g, inline._punctuation).getRegex();
inline.emStrong.rDelimAst = edit(inline.emStrong.rDelimAst, "g").replace(/punct/g, inline._punctuation).getRegex();
inline.emStrong.rDelimUnd = edit(inline.emStrong.rDelimUnd, "g").replace(/punct/g, inline._punctuation).getRegex();
inline._escapes = /\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/g;
inline._scheme = /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/;
inline._email = /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/;
inline.autolink = edit(inline.autolink).replace("scheme", inline._scheme).replace("email", inline._email).getRegex();
inline._attribute = /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/;
inline.tag = edit(inline.tag).replace("comment", inline._comment).replace("attribute", inline._attribute).getRegex();
inline._label = /(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/;
inline._href = /<(?:\\.|[^\n<>\\])+>|[^\s\x00-\x1f]*/;
inline._title = /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/;
inline.link = edit(inline.link).replace("label", inline._label).replace("href", inline._href).replace("title", inline._title).getRegex();
inline.reflink = edit(inline.reflink).replace("label", inline._label).replace("ref", block._label).getRegex();
inline.nolink = edit(inline.nolink).replace("ref", block._label).getRegex();
inline.reflinkSearch = edit(inline.reflinkSearch, "g").replace("reflink", inline.reflink).replace("nolink", inline.nolink).getRegex();
inline.normal = { ...inline };
inline.pedantic = {
  ...inline.normal,
  strong: {
    start: /^__|\*\*/,
    middle: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
    endAst: /\*\*(?!\*)/g,
    endUnd: /__(?!_)/g
  },
  em: {
    start: /^_|\*/,
    middle: /^()\*(?=\S)([\s\S]*?\S)\*(?!\*)|^_(?=\S)([\s\S]*?\S)_(?!_)/,
    endAst: /\*(?!\*)/g,
    endUnd: /_(?!_)/g
  },
  link: edit(/^!?\[(label)\]\((.*?)\)/).replace("label", inline._label).getRegex(),
  reflink: edit(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", inline._label).getRegex()
};
inline.gfm = {
  ...inline.normal,
  escape: edit(inline.escape).replace("])", "~|])").getRegex(),
  _extended_email: /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/,
  url: /^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/,
  _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,
  del: /^(~~?)(?=[^\s~])([\s\S]*?[^\s~])\1(?=[^~]|$)/,
  text: /^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/
};
inline.gfm.url = edit(inline.gfm.url, "i").replace("email", inline.gfm._extended_email).getRegex();
inline.breaks = {
  ...inline.gfm,
  br: edit(inline.br).replace("{2,}", "*").getRegex(),
  text: edit(inline.gfm.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex()
};
function smartypants(text) {
  return text.replace(/---/g, "\u2014").replace(/--/g, "\u2013").replace(/(^|[-\u2014/(\[{"\s])'/g, "$1\u2018").replace(/'/g, "\u2019").replace(/(^|[-\u2014/(\[{\u2018\s])"/g, "$1\u201C").replace(/"/g, "\u201D").replace(/\.{3}/g, "\u2026");
}
function mangle(text) {
  let out = "", i7, ch;
  const l7 = text.length;
  for (i7 = 0; i7 < l7; i7++) {
    ch = text.charCodeAt(i7);
    if (Math.random() > 0.5) {
      ch = "x" + ch.toString(16);
    }
    out += "&#" + ch + ";";
  }
  return out;
}
var Lexer = class {
  constructor(options2) {
    this.tokens = [];
    this.tokens.links = /* @__PURE__ */ Object.create(null);
    this.options = options2 || defaults2;
    this.options.tokenizer = this.options.tokenizer || new Tokenizer();
    this.tokenizer = this.options.tokenizer;
    this.tokenizer.options = this.options;
    this.tokenizer.lexer = this;
    this.inlineQueue = [];
    this.state = {
      inLink: false,
      inRawBlock: false,
      top: true
    };
    const rules = {
      block: block.normal,
      inline: inline.normal
    };
    if (this.options.pedantic) {
      rules.block = block.pedantic;
      rules.inline = inline.pedantic;
    } else if (this.options.gfm) {
      rules.block = block.gfm;
      if (this.options.breaks) {
        rules.inline = inline.breaks;
      } else {
        rules.inline = inline.gfm;
      }
    }
    this.tokenizer.rules = rules;
  }
  /**
   * Expose Rules
   */
  static get rules() {
    return {
      block,
      inline
    };
  }
  /**
   * Static Lex Method
   */
  static lex(src, options2) {
    const lexer2 = new Lexer(options2);
    return lexer2.lex(src);
  }
  /**
   * Static Lex Inline Method
   */
  static lexInline(src, options2) {
    const lexer2 = new Lexer(options2);
    return lexer2.inlineTokens(src);
  }
  /**
   * Preprocessing
   */
  lex(src) {
    src = src.replace(/\r\n|\r/g, "\n");
    this.blockTokens(src, this.tokens);
    let next;
    while (next = this.inlineQueue.shift()) {
      this.inlineTokens(next.src, next.tokens);
    }
    return this.tokens;
  }
  /**
   * Lexing
   */
  blockTokens(src, tokens = []) {
    if (this.options.pedantic) {
      src = src.replace(/\t/g, "    ").replace(/^ +$/gm, "");
    } else {
      src = src.replace(/^( *)(\t+)/gm, (_2, leading, tabs) => {
        return leading + "    ".repeat(tabs.length);
      });
    }
    let token, lastToken, cutSrc, lastParagraphClipped;
    while (src) {
      if (this.options.extensions && this.options.extensions.block && this.options.extensions.block.some((extTokenizer) => {
        if (token = extTokenizer.call({ lexer: this }, src, tokens)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          return true;
        }
        return false;
      })) {
        continue;
      }
      if (token = this.tokenizer.space(src)) {
        src = src.substring(token.raw.length);
        if (token.raw.length === 1 && tokens.length > 0) {
          tokens[tokens.length - 1].raw += "\n";
        } else {
          tokens.push(token);
        }
        continue;
      }
      if (token = this.tokenizer.code(src)) {
        src = src.substring(token.raw.length);
        lastToken = tokens[tokens.length - 1];
        if (lastToken && (lastToken.type === "paragraph" || lastToken.type === "text")) {
          lastToken.raw += "\n" + token.raw;
          lastToken.text += "\n" + token.text;
          this.inlineQueue[this.inlineQueue.length - 1].src = lastToken.text;
        } else {
          tokens.push(token);
        }
        continue;
      }
      if (token = this.tokenizer.fences(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.heading(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.hr(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.blockquote(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.list(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.html(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.def(src)) {
        src = src.substring(token.raw.length);
        lastToken = tokens[tokens.length - 1];
        if (lastToken && (lastToken.type === "paragraph" || lastToken.type === "text")) {
          lastToken.raw += "\n" + token.raw;
          lastToken.text += "\n" + token.raw;
          this.inlineQueue[this.inlineQueue.length - 1].src = lastToken.text;
        } else if (!this.tokens.links[token.tag]) {
          this.tokens.links[token.tag] = {
            href: token.href,
            title: token.title
          };
        }
        continue;
      }
      if (token = this.tokenizer.table(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.lheading(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      cutSrc = src;
      if (this.options.extensions && this.options.extensions.startBlock) {
        let startIndex = Infinity;
        const tempSrc = src.slice(1);
        let tempStart;
        this.options.extensions.startBlock.forEach(function(getStartIndex) {
          tempStart = getStartIndex.call({ lexer: this }, tempSrc);
          if (typeof tempStart === "number" && tempStart >= 0) {
            startIndex = Math.min(startIndex, tempStart);
          }
        });
        if (startIndex < Infinity && startIndex >= 0) {
          cutSrc = src.substring(0, startIndex + 1);
        }
      }
      if (this.state.top && (token = this.tokenizer.paragraph(cutSrc))) {
        lastToken = tokens[tokens.length - 1];
        if (lastParagraphClipped && lastToken.type === "paragraph") {
          lastToken.raw += "\n" + token.raw;
          lastToken.text += "\n" + token.text;
          this.inlineQueue.pop();
          this.inlineQueue[this.inlineQueue.length - 1].src = lastToken.text;
        } else {
          tokens.push(token);
        }
        lastParagraphClipped = cutSrc.length !== src.length;
        src = src.substring(token.raw.length);
        continue;
      }
      if (token = this.tokenizer.text(src)) {
        src = src.substring(token.raw.length);
        lastToken = tokens[tokens.length - 1];
        if (lastToken && lastToken.type === "text") {
          lastToken.raw += "\n" + token.raw;
          lastToken.text += "\n" + token.text;
          this.inlineQueue.pop();
          this.inlineQueue[this.inlineQueue.length - 1].src = lastToken.text;
        } else {
          tokens.push(token);
        }
        continue;
      }
      if (src) {
        const errMsg = "Infinite loop on byte: " + src.charCodeAt(0);
        if (this.options.silent) {
          console.error(errMsg);
          break;
        } else {
          throw new Error(errMsg);
        }
      }
    }
    this.state.top = true;
    return tokens;
  }
  inline(src, tokens = []) {
    this.inlineQueue.push({ src, tokens });
    return tokens;
  }
  /**
   * Lexing/Compiling
   */
  inlineTokens(src, tokens = []) {
    let token, lastToken, cutSrc;
    let maskedSrc = src;
    let match;
    let keepPrevChar, prevChar;
    if (this.tokens.links) {
      const links = Object.keys(this.tokens.links);
      if (links.length > 0) {
        while ((match = this.tokenizer.rules.inline.reflinkSearch.exec(maskedSrc)) != null) {
          if (links.includes(match[0].slice(match[0].lastIndexOf("[") + 1, -1))) {
            maskedSrc = maskedSrc.slice(0, match.index) + "[" + repeatString("a", match[0].length - 2) + "]" + maskedSrc.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex);
          }
        }
      }
    }
    while ((match = this.tokenizer.rules.inline.blockSkip.exec(maskedSrc)) != null) {
      maskedSrc = maskedSrc.slice(0, match.index) + "[" + repeatString("a", match[0].length - 2) + "]" + maskedSrc.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
    }
    while ((match = this.tokenizer.rules.inline.escapedEmSt.exec(maskedSrc)) != null) {
      maskedSrc = maskedSrc.slice(0, match.index + match[0].length - 2) + "++" + maskedSrc.slice(this.tokenizer.rules.inline.escapedEmSt.lastIndex);
      this.tokenizer.rules.inline.escapedEmSt.lastIndex--;
    }
    while (src) {
      if (!keepPrevChar) {
        prevChar = "";
      }
      keepPrevChar = false;
      if (this.options.extensions && this.options.extensions.inline && this.options.extensions.inline.some((extTokenizer) => {
        if (token = extTokenizer.call({ lexer: this }, src, tokens)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          return true;
        }
        return false;
      })) {
        continue;
      }
      if (token = this.tokenizer.escape(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.tag(src)) {
        src = src.substring(token.raw.length);
        lastToken = tokens[tokens.length - 1];
        if (lastToken && token.type === "text" && lastToken.type === "text") {
          lastToken.raw += token.raw;
          lastToken.text += token.text;
        } else {
          tokens.push(token);
        }
        continue;
      }
      if (token = this.tokenizer.link(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.reflink(src, this.tokens.links)) {
        src = src.substring(token.raw.length);
        lastToken = tokens[tokens.length - 1];
        if (lastToken && token.type === "text" && lastToken.type === "text") {
          lastToken.raw += token.raw;
          lastToken.text += token.text;
        } else {
          tokens.push(token);
        }
        continue;
      }
      if (token = this.tokenizer.emStrong(src, maskedSrc, prevChar)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.codespan(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.br(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.del(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.autolink(src, mangle)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (!this.state.inLink && (token = this.tokenizer.url(src, mangle))) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      cutSrc = src;
      if (this.options.extensions && this.options.extensions.startInline) {
        let startIndex = Infinity;
        const tempSrc = src.slice(1);
        let tempStart;
        this.options.extensions.startInline.forEach(function(getStartIndex) {
          tempStart = getStartIndex.call({ lexer: this }, tempSrc);
          if (typeof tempStart === "number" && tempStart >= 0) {
            startIndex = Math.min(startIndex, tempStart);
          }
        });
        if (startIndex < Infinity && startIndex >= 0) {
          cutSrc = src.substring(0, startIndex + 1);
        }
      }
      if (token = this.tokenizer.inlineText(cutSrc, smartypants)) {
        src = src.substring(token.raw.length);
        if (token.raw.slice(-1) !== "_") {
          prevChar = token.raw.slice(-1);
        }
        keepPrevChar = true;
        lastToken = tokens[tokens.length - 1];
        if (lastToken && lastToken.type === "text") {
          lastToken.raw += token.raw;
          lastToken.text += token.text;
        } else {
          tokens.push(token);
        }
        continue;
      }
      if (src) {
        const errMsg = "Infinite loop on byte: " + src.charCodeAt(0);
        if (this.options.silent) {
          console.error(errMsg);
          break;
        } else {
          throw new Error(errMsg);
        }
      }
    }
    return tokens;
  }
};
var Renderer2 = class {
  constructor(options2) {
    this.options = options2 || defaults2;
  }
  code(code, infostring, escaped) {
    const lang = (infostring || "").match(/\S*/)[0];
    if (this.options.highlight) {
      const out = this.options.highlight(code, lang);
      if (out != null && out !== code) {
        escaped = true;
        code = out;
      }
    }
    code = code.replace(/\n$/, "") + "\n";
    if (!lang) {
      return "<pre><code>" + (escaped ? code : escape2(code, true)) + "</code></pre>\n";
    }
    return '<pre><code class="' + this.options.langPrefix + escape2(lang) + '">' + (escaped ? code : escape2(code, true)) + "</code></pre>\n";
  }
  /**
   * @param {string} quote
   */
  blockquote(quote) {
    return `<blockquote>
${quote}</blockquote>
`;
  }
  html(html2) {
    return html2;
  }
  /**
   * @param {string} text
   * @param {string} level
   * @param {string} raw
   * @param {any} slugger
   */
  heading(text, level, raw, slugger) {
    if (this.options.headerIds) {
      const id2 = this.options.headerPrefix + slugger.slug(raw);
      return `<h${level} id="${id2}">${text}</h${level}>
`;
    }
    return `<h${level}>${text}</h${level}>
`;
  }
  hr() {
    return this.options.xhtml ? "<hr/>\n" : "<hr>\n";
  }
  list(body, ordered, start) {
    const type = ordered ? "ol" : "ul", startatt = ordered && start !== 1 ? ' start="' + start + '"' : "";
    return "<" + type + startatt + ">\n" + body + "</" + type + ">\n";
  }
  /**
   * @param {string} text
   */
  listitem(text) {
    return `<li>${text}</li>
`;
  }
  checkbox(checked) {
    return "<input " + (checked ? 'checked="" ' : "") + 'disabled="" type="checkbox"' + (this.options.xhtml ? " /" : "") + "> ";
  }
  /**
   * @param {string} text
   */
  paragraph(text) {
    return `<p>${text}</p>
`;
  }
  /**
   * @param {string} header
   * @param {string} body
   */
  table(header, body) {
    if (body)
      body = `<tbody>${body}</tbody>`;
    return "<table>\n<thead>\n" + header + "</thead>\n" + body + "</table>\n";
  }
  /**
   * @param {string} content
   */
  tablerow(content) {
    return `<tr>
${content}</tr>
`;
  }
  tablecell(content, flags) {
    const type = flags.header ? "th" : "td";
    const tag = flags.align ? `<${type} align="${flags.align}">` : `<${type}>`;
    return tag + content + `</${type}>
`;
  }
  /**
   * span level renderer
   * @param {string} text
   */
  strong(text) {
    return `<strong>${text}</strong>`;
  }
  /**
   * @param {string} text
   */
  em(text) {
    return `<em>${text}</em>`;
  }
  /**
   * @param {string} text
   */
  codespan(text) {
    return `<code>${text}</code>`;
  }
  br() {
    return this.options.xhtml ? "<br/>" : "<br>";
  }
  /**
   * @param {string} text
   */
  del(text) {
    return `<del>${text}</del>`;
  }
  /**
   * @param {string} href
   * @param {string} title
   * @param {string} text
   */
  link(href, title, text) {
    href = cleanUrl(this.options.sanitize, this.options.baseUrl, href);
    if (href === null) {
      return text;
    }
    let out = '<a href="' + href + '"';
    if (title) {
      out += ' title="' + title + '"';
    }
    out += ">" + text + "</a>";
    return out;
  }
  /**
   * @param {string} href
   * @param {string} title
   * @param {string} text
   */
  image(href, title, text) {
    href = cleanUrl(this.options.sanitize, this.options.baseUrl, href);
    if (href === null) {
      return text;
    }
    let out = `<img src="${href}" alt="${text}"`;
    if (title) {
      out += ` title="${title}"`;
    }
    out += this.options.xhtml ? "/>" : ">";
    return out;
  }
  text(text) {
    return text;
  }
};
var TextRenderer = class {
  // no need for block level renderers
  strong(text) {
    return text;
  }
  em(text) {
    return text;
  }
  codespan(text) {
    return text;
  }
  del(text) {
    return text;
  }
  html(text) {
    return text;
  }
  text(text) {
    return text;
  }
  link(href, title, text) {
    return "" + text;
  }
  image(href, title, text) {
    return "" + text;
  }
  br() {
    return "";
  }
};
var Slugger = class {
  constructor() {
    this.seen = {};
  }
  /**
   * @param {string} value
   */
  serialize(value) {
    return value.toLowerCase().trim().replace(/<[!\/a-z].*?>/ig, "").replace(/[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,./:;<=>?@[\]^`{|}~]/g, "").replace(/\s/g, "-");
  }
  /**
   * Finds the next safe (unique) slug to use
   * @param {string} originalSlug
   * @param {boolean} isDryRun
   */
  getNextSafeSlug(originalSlug, isDryRun) {
    let slug = originalSlug;
    let occurenceAccumulator = 0;
    if (this.seen.hasOwnProperty(slug)) {
      occurenceAccumulator = this.seen[originalSlug];
      do {
        occurenceAccumulator++;
        slug = originalSlug + "-" + occurenceAccumulator;
      } while (this.seen.hasOwnProperty(slug));
    }
    if (!isDryRun) {
      this.seen[originalSlug] = occurenceAccumulator;
      this.seen[slug] = 0;
    }
    return slug;
  }
  /**
   * Convert string to unique id
   * @param {object} [options]
   * @param {boolean} [options.dryrun] Generates the next unique slug without
   * updating the internal accumulator.
   */
  slug(value, options2 = {}) {
    const slug = this.serialize(value);
    return this.getNextSafeSlug(slug, options2.dryrun);
  }
};
var Parser = class {
  constructor(options2) {
    this.options = options2 || defaults2;
    this.options.renderer = this.options.renderer || new Renderer2();
    this.renderer = this.options.renderer;
    this.renderer.options = this.options;
    this.textRenderer = new TextRenderer();
    this.slugger = new Slugger();
  }
  /**
   * Static Parse Method
   */
  static parse(tokens, options2) {
    const parser2 = new Parser(options2);
    return parser2.parse(tokens);
  }
  /**
   * Static Parse Inline Method
   */
  static parseInline(tokens, options2) {
    const parser2 = new Parser(options2);
    return parser2.parseInline(tokens);
  }
  /**
   * Parse Loop
   */
  parse(tokens, top = true) {
    let out = "", i7, j2, k2, l22, l32, row, cell, header, body, token, ordered, start, loose, itemBody, item, checked, task, checkbox, ret;
    const l7 = tokens.length;
    for (i7 = 0; i7 < l7; i7++) {
      token = tokens[i7];
      if (this.options.extensions && this.options.extensions.renderers && this.options.extensions.renderers[token.type]) {
        ret = this.options.extensions.renderers[token.type].call({ parser: this }, token);
        if (ret !== false || !["space", "hr", "heading", "code", "table", "blockquote", "list", "html", "paragraph", "text"].includes(token.type)) {
          out += ret || "";
          continue;
        }
      }
      switch (token.type) {
        case "space": {
          continue;
        }
        case "hr": {
          out += this.renderer.hr();
          continue;
        }
        case "heading": {
          out += this.renderer.heading(
            this.parseInline(token.tokens),
            token.depth,
            unescape(this.parseInline(token.tokens, this.textRenderer)),
            this.slugger
          );
          continue;
        }
        case "code": {
          out += this.renderer.code(
            token.text,
            token.lang,
            token.escaped
          );
          continue;
        }
        case "table": {
          header = "";
          cell = "";
          l22 = token.header.length;
          for (j2 = 0; j2 < l22; j2++) {
            cell += this.renderer.tablecell(
              this.parseInline(token.header[j2].tokens),
              { header: true, align: token.align[j2] }
            );
          }
          header += this.renderer.tablerow(cell);
          body = "";
          l22 = token.rows.length;
          for (j2 = 0; j2 < l22; j2++) {
            row = token.rows[j2];
            cell = "";
            l32 = row.length;
            for (k2 = 0; k2 < l32; k2++) {
              cell += this.renderer.tablecell(
                this.parseInline(row[k2].tokens),
                { header: false, align: token.align[k2] }
              );
            }
            body += this.renderer.tablerow(cell);
          }
          out += this.renderer.table(header, body);
          continue;
        }
        case "blockquote": {
          body = this.parse(token.tokens);
          out += this.renderer.blockquote(body);
          continue;
        }
        case "list": {
          ordered = token.ordered;
          start = token.start;
          loose = token.loose;
          l22 = token.items.length;
          body = "";
          for (j2 = 0; j2 < l22; j2++) {
            item = token.items[j2];
            checked = item.checked;
            task = item.task;
            itemBody = "";
            if (item.task) {
              checkbox = this.renderer.checkbox(checked);
              if (loose) {
                if (item.tokens.length > 0 && item.tokens[0].type === "paragraph") {
                  item.tokens[0].text = checkbox + " " + item.tokens[0].text;
                  if (item.tokens[0].tokens && item.tokens[0].tokens.length > 0 && item.tokens[0].tokens[0].type === "text") {
                    item.tokens[0].tokens[0].text = checkbox + " " + item.tokens[0].tokens[0].text;
                  }
                } else {
                  item.tokens.unshift({
                    type: "text",
                    text: checkbox
                  });
                }
              } else {
                itemBody += checkbox;
              }
            }
            itemBody += this.parse(item.tokens, loose);
            body += this.renderer.listitem(itemBody, task, checked);
          }
          out += this.renderer.list(body, ordered, start);
          continue;
        }
        case "html": {
          out += this.renderer.html(token.text);
          continue;
        }
        case "paragraph": {
          out += this.renderer.paragraph(this.parseInline(token.tokens));
          continue;
        }
        case "text": {
          body = token.tokens ? this.parseInline(token.tokens) : token.text;
          while (i7 + 1 < l7 && tokens[i7 + 1].type === "text") {
            token = tokens[++i7];
            body += "\n" + (token.tokens ? this.parseInline(token.tokens) : token.text);
          }
          out += top ? this.renderer.paragraph(body) : body;
          continue;
        }
        default: {
          const errMsg = 'Token with "' + token.type + '" type was not found.';
          if (this.options.silent) {
            console.error(errMsg);
            return;
          } else {
            throw new Error(errMsg);
          }
        }
      }
    }
    return out;
  }
  /**
   * Parse Inline Tokens
   */
  parseInline(tokens, renderer2) {
    renderer2 = renderer2 || this.renderer;
    let out = "", i7, token, ret;
    const l7 = tokens.length;
    for (i7 = 0; i7 < l7; i7++) {
      token = tokens[i7];
      if (this.options.extensions && this.options.extensions.renderers && this.options.extensions.renderers[token.type]) {
        ret = this.options.extensions.renderers[token.type].call({ parser: this }, token);
        if (ret !== false || !["escape", "html", "link", "image", "strong", "em", "codespan", "br", "del", "text"].includes(token.type)) {
          out += ret || "";
          continue;
        }
      }
      switch (token.type) {
        case "escape": {
          out += renderer2.text(token.text);
          break;
        }
        case "html": {
          out += renderer2.html(token.text);
          break;
        }
        case "link": {
          out += renderer2.link(token.href, token.title, this.parseInline(token.tokens, renderer2));
          break;
        }
        case "image": {
          out += renderer2.image(token.href, token.title, token.text);
          break;
        }
        case "strong": {
          out += renderer2.strong(this.parseInline(token.tokens, renderer2));
          break;
        }
        case "em": {
          out += renderer2.em(this.parseInline(token.tokens, renderer2));
          break;
        }
        case "codespan": {
          out += renderer2.codespan(token.text);
          break;
        }
        case "br": {
          out += renderer2.br();
          break;
        }
        case "del": {
          out += renderer2.del(this.parseInline(token.tokens, renderer2));
          break;
        }
        case "text": {
          out += renderer2.text(token.text);
          break;
        }
        default: {
          const errMsg = 'Token with "' + token.type + '" type was not found.';
          if (this.options.silent) {
            console.error(errMsg);
            return;
          } else {
            throw new Error(errMsg);
          }
        }
      }
    }
    return out;
  }
};
var Hooks = class {
  constructor(options2) {
    this.options = options2 || defaults2;
  }
  /**
   * Process markdown before marked
   */
  preprocess(markdown) {
    return markdown;
  }
  /**
   * Process HTML after marked is finished
   */
  postprocess(html2) {
    return html2;
  }
};
__publicField(Hooks, "passThroughHooks", /* @__PURE__ */ new Set([
  "preprocess",
  "postprocess"
]));
function onError(silent, async, callback) {
  return (e10) => {
    e10.message += "\nPlease report this to https://github.com/markedjs/marked.";
    if (silent) {
      const msg = "<p>An error occurred:</p><pre>" + escape2(e10.message + "", true) + "</pre>";
      if (async) {
        return Promise.resolve(msg);
      }
      if (callback) {
        callback(null, msg);
        return;
      }
      return msg;
    }
    if (async) {
      return Promise.reject(e10);
    }
    if (callback) {
      callback(e10);
      return;
    }
    throw e10;
  };
}
function parseMarkdown(lexer2, parser2) {
  return (src, opt, callback) => {
    if (typeof opt === "function") {
      callback = opt;
      opt = null;
    }
    const origOpt = { ...opt };
    opt = { ...marked.defaults, ...origOpt };
    const throwError = onError(opt.silent, opt.async, callback);
    if (typeof src === "undefined" || src === null) {
      return throwError(new Error("marked(): input parameter is undefined or null"));
    }
    if (typeof src !== "string") {
      return throwError(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(src) + ", string expected"));
    }
    checkSanitizeDeprecation(opt);
    if (opt.hooks) {
      opt.hooks.options = opt;
    }
    if (callback) {
      const highlight2 = opt.highlight;
      let tokens;
      try {
        if (opt.hooks) {
          src = opt.hooks.preprocess(src);
        }
        tokens = lexer2(src, opt);
      } catch (e10) {
        return throwError(e10);
      }
      const done = function(err) {
        let out;
        if (!err) {
          try {
            if (opt.walkTokens) {
              marked.walkTokens(tokens, opt.walkTokens);
            }
            out = parser2(tokens, opt);
            if (opt.hooks) {
              out = opt.hooks.postprocess(out);
            }
          } catch (e10) {
            err = e10;
          }
        }
        opt.highlight = highlight2;
        return err ? throwError(err) : callback(null, out);
      };
      if (!highlight2 || highlight2.length < 3) {
        return done();
      }
      delete opt.highlight;
      if (!tokens.length)
        return done();
      let pending = 0;
      marked.walkTokens(tokens, function(token) {
        if (token.type === "code") {
          pending++;
          setTimeout(() => {
            highlight2(token.text, token.lang, function(err, code) {
              if (err) {
                return done(err);
              }
              if (code != null && code !== token.text) {
                token.text = code;
                token.escaped = true;
              }
              pending--;
              if (pending === 0) {
                done();
              }
            });
          }, 0);
        }
      });
      if (pending === 0) {
        done();
      }
      return;
    }
    if (opt.async) {
      return Promise.resolve(opt.hooks ? opt.hooks.preprocess(src) : src).then((src2) => lexer2(src2, opt)).then((tokens) => opt.walkTokens ? Promise.all(marked.walkTokens(tokens, opt.walkTokens)).then(() => tokens) : tokens).then((tokens) => parser2(tokens, opt)).then((html2) => opt.hooks ? opt.hooks.postprocess(html2) : html2).catch(throwError);
    }
    try {
      if (opt.hooks) {
        src = opt.hooks.preprocess(src);
      }
      const tokens = lexer2(src, opt);
      if (opt.walkTokens) {
        marked.walkTokens(tokens, opt.walkTokens);
      }
      let html2 = parser2(tokens, opt);
      if (opt.hooks) {
        html2 = opt.hooks.postprocess(html2);
      }
      return html2;
    } catch (e10) {
      return throwError(e10);
    }
  };
}
function marked(src, opt, callback) {
  return parseMarkdown(Lexer.lex, Parser.parse)(src, opt, callback);
}
marked.options = marked.setOptions = function(opt) {
  marked.defaults = { ...marked.defaults, ...opt };
  changeDefaults(marked.defaults);
  return marked;
};
marked.getDefaults = getDefaults;
marked.defaults = defaults2;
marked.use = function(...args) {
  const extensions = marked.defaults.extensions || { renderers: {}, childTokens: {} };
  args.forEach((pack) => {
    const opts = { ...pack };
    opts.async = marked.defaults.async || opts.async || false;
    if (pack.extensions) {
      pack.extensions.forEach((ext) => {
        if (!ext.name) {
          throw new Error("extension name required");
        }
        if (ext.renderer) {
          const prevRenderer = extensions.renderers[ext.name];
          if (prevRenderer) {
            extensions.renderers[ext.name] = function(...args2) {
              let ret = ext.renderer.apply(this, args2);
              if (ret === false) {
                ret = prevRenderer.apply(this, args2);
              }
              return ret;
            };
          } else {
            extensions.renderers[ext.name] = ext.renderer;
          }
        }
        if (ext.tokenizer) {
          if (!ext.level || ext.level !== "block" && ext.level !== "inline") {
            throw new Error("extension level must be 'block' or 'inline'");
          }
          if (extensions[ext.level]) {
            extensions[ext.level].unshift(ext.tokenizer);
          } else {
            extensions[ext.level] = [ext.tokenizer];
          }
          if (ext.start) {
            if (ext.level === "block") {
              if (extensions.startBlock) {
                extensions.startBlock.push(ext.start);
              } else {
                extensions.startBlock = [ext.start];
              }
            } else if (ext.level === "inline") {
              if (extensions.startInline) {
                extensions.startInline.push(ext.start);
              } else {
                extensions.startInline = [ext.start];
              }
            }
          }
        }
        if (ext.childTokens) {
          extensions.childTokens[ext.name] = ext.childTokens;
        }
      });
      opts.extensions = extensions;
    }
    if (pack.renderer) {
      const renderer2 = marked.defaults.renderer || new Renderer2();
      for (const prop in pack.renderer) {
        const prevRenderer = renderer2[prop];
        renderer2[prop] = (...args2) => {
          let ret = pack.renderer[prop].apply(renderer2, args2);
          if (ret === false) {
            ret = prevRenderer.apply(renderer2, args2);
          }
          return ret;
        };
      }
      opts.renderer = renderer2;
    }
    if (pack.tokenizer) {
      const tokenizer = marked.defaults.tokenizer || new Tokenizer();
      for (const prop in pack.tokenizer) {
        const prevTokenizer = tokenizer[prop];
        tokenizer[prop] = (...args2) => {
          let ret = pack.tokenizer[prop].apply(tokenizer, args2);
          if (ret === false) {
            ret = prevTokenizer.apply(tokenizer, args2);
          }
          return ret;
        };
      }
      opts.tokenizer = tokenizer;
    }
    if (pack.hooks) {
      const hooks = marked.defaults.hooks || new Hooks();
      for (const prop in pack.hooks) {
        const prevHook = hooks[prop];
        if (Hooks.passThroughHooks.has(prop)) {
          hooks[prop] = (arg) => {
            if (marked.defaults.async) {
              return Promise.resolve(pack.hooks[prop].call(hooks, arg)).then((ret2) => {
                return prevHook.call(hooks, ret2);
              });
            }
            const ret = pack.hooks[prop].call(hooks, arg);
            return prevHook.call(hooks, ret);
          };
        } else {
          hooks[prop] = (...args2) => {
            let ret = pack.hooks[prop].apply(hooks, args2);
            if (ret === false) {
              ret = prevHook.apply(hooks, args2);
            }
            return ret;
          };
        }
      }
      opts.hooks = hooks;
    }
    if (pack.walkTokens) {
      const walkTokens2 = marked.defaults.walkTokens;
      opts.walkTokens = function(token) {
        let values = [];
        values.push(pack.walkTokens.call(this, token));
        if (walkTokens2) {
          values = values.concat(walkTokens2.call(this, token));
        }
        return values;
      };
    }
    marked.setOptions(opts);
  });
};
marked.walkTokens = function(tokens, callback) {
  let values = [];
  for (const token of tokens) {
    values = values.concat(callback.call(marked, token));
    switch (token.type) {
      case "table": {
        for (const cell of token.header) {
          values = values.concat(marked.walkTokens(cell.tokens, callback));
        }
        for (const row of token.rows) {
          for (const cell of row) {
            values = values.concat(marked.walkTokens(cell.tokens, callback));
          }
        }
        break;
      }
      case "list": {
        values = values.concat(marked.walkTokens(token.items, callback));
        break;
      }
      default: {
        if (marked.defaults.extensions && marked.defaults.extensions.childTokens && marked.defaults.extensions.childTokens[token.type]) {
          marked.defaults.extensions.childTokens[token.type].forEach(function(childTokens) {
            values = values.concat(marked.walkTokens(token[childTokens], callback));
          });
        } else if (token.tokens) {
          values = values.concat(marked.walkTokens(token.tokens, callback));
        }
      }
    }
  }
  return values;
};
marked.parseInline = parseMarkdown(Lexer.lexInline, Parser.parseInline);
marked.Parser = Parser;
marked.parser = Parser.parse;
marked.Renderer = Renderer2;
marked.TextRenderer = TextRenderer;
marked.Lexer = Lexer;
marked.lexer = Lexer.lex;
marked.Tokenizer = Tokenizer;
marked.Slugger = Slugger;
marked.Hooks = Hooks;
marked.parse = marked;
var options = marked.options;
var setOptions = marked.setOptions;
var use = marked.use;
var walkTokens = marked.walkTokens;
var parseInline = marked.parseInline;
var parser = Parser.parse;
var lexer = Lexer.lex;

// ../../node_modules/@api-viewer/docs/lib/utils/markdown.js
var import_dompurify = __toESM(require_purify(), 1);
marked.setOptions({ headerIds: false });
var parse = (markdown) => x`
  ${!markdown ? A : o6(import_dompurify.default.sanitize(marked(markdown)).replace(/<(h[1-6]|a|p|ul|ol|li|pre|code|strong|em|blockquote|del)(\s+href="[^"]+")*>/g, '<$1 part="md-$1"$2>'))}
`;

// ../../node_modules/@api-viewer/docs/lib/layout.js
var renderItem = (prefix, name, description, valueType, value, attribute, isStatic, reflects) => x`
  <div part="docs-item">
    ${isStatic || reflects ? x`<div part="docs-row">
          ${isStatic ? x`<div part="docs-tag">static</div>` : A}
          ${reflects ? x`<div part="docs-tag">reflected</div>` : A}
        </div>` : A}
    <div part="docs-row">
      <div part="docs-column" class="column-name-${prefix}">
        <div part="docs-label">Name</div>
        <div part="docs-value" class="accent">${name}</div>
      </div>
      ${attribute === void 0 ? A : x`
            <div part="docs-column">
              <div part="docs-label">Attribute</div>
              <div part="docs-value">${attribute}</div>
            </div>
          `}
      ${valueType === void 0 && value === void 0 ? A : x`
            <div part="docs-column" class="column-type">
              <div part="docs-label">Type</div>
              <div part="docs-value">
                ${valueType || (Number.isNaN(Number(value)) ? typeof value : "number")}
                ${value === void 0 ? A : x` = <span class="accent">${value}</span> `}
              </div>
            </div>
          `}
    </div>
    <div ?hidden=${description === void 0}>
      <div part="docs-label">Description</div>
      <div part="docs-markdown">${parse(description)}</div>
    </div>
  </div>
`;
var renderTab = (heading, array, content) => {
  const hidden = array.length === 0;
  return x`
    <api-viewer-tab slot="tab" part="tab" ?hidden=${hidden}>
      ${heading}
    </api-viewer-tab>
    <api-viewer-panel slot="panel" part="tab-panel" ?hidden=${hidden}>
      ${content}
    </api-viewer-panel>
  `;
};
var renderMethod = (method) => {
  const params = method.parameters || [];
  const type = method.return?.type?.text || "void";
  return x`
    <span part="docs-method">
      ${method.name}(<span part="docs-method-params"
        >${params.map((param, idx) => x`<span part="docs-param-name">${param.name}</span>:
              <span part="docs-param-type">${param.type?.text}</span>${idx === params.length - 1 ? "" : ", "}`)}</span
      >)</span
    ><span part="docs-method-type">: ${type}</span>
  `;
};
var ApiDocsLayout = class extends s4 {
  constructor() {
    super(...arguments);
    this.name = "";
    this.props = [];
    this.attrs = [];
    this.methods = [];
    this.slots = [];
    this.events = [];
    this.cssParts = [];
    this.cssProps = [];
  }
  createRenderRoot() {
    return this;
  }
  render() {
    const { slots, props, attrs, methods, events, cssParts, cssProps } = this;
    const emptyDocs = [
      props,
      attrs,
      methods,
      slots,
      events,
      cssProps,
      cssParts
    ].every((arr) => arr.length === 0);
    props.sort((p2) => p2.static ? -1 : 1);
    const attributes = attrs.filter((x2) => !props.some((y2) => y2.name === x2.fieldName));
    return emptyDocs ? x`
          <div part="warning">
            The element &lt;${this.name}&gt; does not provide any documented
            API.
          </div>
        ` : x`
          <api-viewer-tabs>
            ${renderTab("Properties", props, x`
                ${props.map((prop) => {
      const { name, description, type, static: isStatic, reflects } = prop;
      const attribute = attrs.find((x2) => x2.fieldName === name);
      return renderItem("prop", name, description, type?.text, prop.default, attribute?.name, isStatic, reflects);
    })}
              `)}
            ${renderTab("Attributes", attributes, x`
                ${attributes.map(({ name, description, type }) => renderItem("attr", name, description, type?.text))}
              `)}
            ${renderTab("Methods", methods, x`
                ${methods.map((method) => renderItem("method", renderMethod(method), method.description))}
              `)}
            ${renderTab("Slots", slots, x`
                ${slots.map(({ name, description }) => renderItem("slot", name, description))}
              `)}
            ${renderTab("Events", events, x`
                ${events.map(({ name, description }) => renderItem("event", name, description))}
              `)}
            ${renderTab("CSS Custom Properties", cssProps, x`
                ${cssProps.map((prop) => {
      const { name, description } = prop;
      return renderItem(
        "css",
        name,
        description,
        "",
        // TODO: manifest does not provide type for CSS custom properties
        unquote(prop.default)
      );
    })}
              `)}
            ${renderTab("CSS Shadow Parts", cssParts, x`
                ${cssParts.map(({ name, description }) => renderItem("part", name, description))}
              `)}
          </api-viewer-tabs>
        `;
  }
  updated(props) {
    if (props.has("name") && props.get("name")) {
      const tabs = this.renderRoot.querySelector("api-viewer-tabs");
      if (tabs) {
        tabs.selectFirst();
      }
    }
  }
};
__decorate([
  n5()
], ApiDocsLayout.prototype, "name", void 0);
__decorate([
  n5({ attribute: false })
], ApiDocsLayout.prototype, "props", void 0);
__decorate([
  n5({ attribute: false })
], ApiDocsLayout.prototype, "attrs", void 0);
__decorate([
  n5({ attribute: false })
], ApiDocsLayout.prototype, "methods", void 0);
__decorate([
  n5({ attribute: false })
], ApiDocsLayout.prototype, "slots", void 0);
__decorate([
  n5({ attribute: false })
], ApiDocsLayout.prototype, "events", void 0);
__decorate([
  n5({ attribute: false })
], ApiDocsLayout.prototype, "cssParts", void 0);
__decorate([
  n5({ attribute: false })
], ApiDocsLayout.prototype, "cssProps", void 0);
customElements.define("api-docs-layout", ApiDocsLayout);

// ../../node_modules/api-viewer-element/lib/base.js
async function renderDocs(jsonFetched, section, onSelect, onToggle, only, selected, id2, exclude = "") {
  const manifest = await jsonFetched;
  if (!hasCustomElements(manifest)) {
    return emptyDataWarning;
  }
  const elements = getCustomElements(manifest, only);
  const data = getElementData(manifest, elements, selected);
  const props = getPublicFields(data.members);
  const methods = getPublicMethods(data.members);
  return x`
    <header part="header">
      <div part="header-title">&lt;${data.name}&gt;</div>
      <nav>
        <input
          id="docs"
          type="radio"
          name="section-${id2}"
          value="docs"
          ?checked=${section === "docs"}
          @change=${onToggle}
          part="radio-button"
        />
        <label part="radio-label" for="docs">Docs</label>
        <input
          id="demo"
          type="radio"
          name="section-${id2}"
          value="demo"
          ?checked=${section === "demo"}
          @change=${onToggle}
          part="radio-button"
        />
        <label part="radio-label" for="demo">Demo</label>
        <label part="select-label">
          <select
            @change=${onSelect}
            .value=${selected || ""}
            ?hidden=${elements.length === 1}
            part="select"
          >
            ${elements.map((tag) => x`<option value=${tag.name}>${tag.name}</option>`)}
          </select>
        </label>
      </nav>
    </header>
    ${h4(section === "docs" ? x`
            <div ?hidden=${data.description === ""} part="docs-description">
              ${parse(data.description)}
            </div>
            <api-docs-layout
              .name=${data.name}
              .props=${props}
              .attrs=${data.attributes ?? []}
              .methods=${methods}
              .events=${data.events ?? []}
              .slots=${data.slots ?? []}
              .cssParts=${data.cssParts ?? []}
              .cssProps=${data.cssProperties ?? []}
              part="docs-container"
            ></api-docs-layout>
          ` : x`
            <api-demo-layout
              .tag=${data.name}
              .props=${props}
              .events=${data.events ?? []}
              .slots=${data.slots ?? []}
              .cssProps=${data.cssProperties ?? []}
              .exclude=${exclude}
              .vid=${id2}
              part="demo-container"
            ></api-demo-layout>
          `)}
  `;
}
var id = 0;
var ApiViewerBase = class extends ManifestMixin(s4) {
  constructor() {
    super();
    this.section = "docs";
    this._id = id++;
  }
  render() {
    return x`
      ${m3(renderDocs(this.jsonFetched, this.section, this._onSelect, this._onToggle, this.only, this.selected, this._id, this.excludeKnobs))}
    `;
  }
  firstUpdated() {
    this.setTemplates();
  }
  setTemplates(templates2) {
    setTemplates(this._id, templates2 || Array.from(this.querySelectorAll("template")));
  }
  _onSelect(e10) {
    this.selected = e10.target.value;
  }
  _onToggle(e10) {
    this.section = e10.target.value;
  }
};
__decorate([
  n5()
], ApiViewerBase.prototype, "section", void 0);
__decorate([
  n5({ type: String, attribute: "exclude-knobs" })
], ApiViewerBase.prototype, "excludeKnobs", void 0);

// ../../node_modules/@api-viewer/common/lib/shared-styles.js
var shared_styles_default = i`
  :host {
    display: block;
    text-align: left;
    box-sizing: border-box;
    max-width: 800px;
    min-width: 360px;
    font-size: 1rem;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
      Oxygen-Sans, Ubuntu, Cantarell, sans-serif;
    border: 1px solid var(--ave-border-color);
    border-radius: var(--ave-border-radius);

    --ave-primary-color: #01579b;
    --ave-secondary-color: rgba(0, 0, 0, 0.54);
    --ave-accent-color: #d63200;
    --ave-border-color: rgba(0, 0, 0, 0.12);
    --ave-border-radius: 4px;
    --ave-header-color: #fff;
    --ave-item-color: rgba(0, 0, 0, 0.87);
    --ave-label-color: #424242;
    --ave-link-color: #01579b;
    --ave-link-hover-color: #d63200;
    --ave-tab-indicator-size: 2px;
    --ave-tab-color: rgba(0, 0, 0, 0.54);
    --ave-tag-background-color: #e2e3e5;
    --ave-tag-border-color: #d6d8db;
    --ave-tag-color: #383d41;
    --ave-monospace-font: Menlo, 'DejaVu Sans Mono', 'Liberation Mono', Consolas,
      'Courier New', monospace;
  }

  :host([hidden]),
  [hidden] {
    display: none !important;
  }

  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem;
    background: var(--ave-header-background, var(--ave-primary-color));
    border-top-left-radius: var(--ave-border-radius);
    border-top-right-radius: var(--ave-border-radius);
  }

  nav {
    display: flex;
    align-items: center;
  }

  [part='header-title'] {
    color: var(--ave-header-color);
    font-family: var(--ave-monospace-font);
    font-size: 0.875rem;
    line-height: 1.5rem;
  }

  [part='select-label'] {
    margin-left: 0.5rem;
  }

  [part='warning'] {
    padding: 1rem;
  }

  @media (max-width: 480px) {
    header {
      flex-direction: column;
    }

    nav {
      margin-top: 0.5rem;
    }
  }

  @media (prefers-color-scheme: dark) {
    :host {
      background: #fff;
      color: #000;
    }
  }
`;

// ../../node_modules/@api-viewer/demo/lib/styles.js
var highlightTheme = i`
  pre {
    margin: 0;
    color: black;
    background: none;
    font-family: var(--ave-monospace-font);
    font-size: 0.875rem;
    text-align: left;
    white-space: pre-wrap;
    word-spacing: normal;
    word-break: normal;
    word-wrap: normal;
    line-height: 1.5;
    tab-size: 4;
    hyphens: none;
    text-shadow: none;
  }

  code {
    font-family: inherit;
  }

  .comment {
    color: slategray;
  }

  .attr,
  .selector-tag {
    color: #690;
  }

  .css {
    color: #333;
  }

  .built_in {
    color: #dd4a68;
  }

  .meta {
    color: #e90;
    font-weight: bold;
  }

  .string {
    color: #07a;
  }

  .tag {
    color: #999;
  }

  .attribute,
  .name,
  .number {
    color: #905;
  }
`;
var demoStyles = i`
  button {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    text-transform: uppercase;
    border: none;
    border-radius: 0.25em;
    cursor: pointer;
    background: var(--ave-button-background, rgba(0, 0, 0, 0.3));
    color: var(--ave-button-color, #fff);
  }

  button:focus,
  button:hover {
    background: var(--ave-button-active-background, rgba(0, 0, 0, 0.6));
  }

  api-demo-layout {
    display: block;
  }

  [part='demo-tabs'],
  [part='demo-output'] {
    border-top: solid 1px var(--ave-border-color);
  }

  [part='demo-tabs'] [part='tab-panel'] {
    box-sizing: border-box;
    position: relative;
    background: #fafafa;
  }

  [part='demo-output'] {
    padding: 1.5rem;
    text-align: initial;
    transform: translateZ(0);
    overflow: hidden;
  }

  [part='demo-snippet'] {
    padding: 0.75rem 1rem;
  }

  .source {
    position: relative;
  }

  [part='knobs'] {
    display: flex;
    padding: 0 1rem 1rem;
  }

  [part='knobs-column'] {
    flex-shrink: 1;
  }

  [part='knobs-column']:not(:only-child) {
    flex-basis: 50%;
  }

  [part='knobs-header'] {
    font-size: 1rem;
    font-weight: bold;
    margin: 1rem 0 0.25rem;
  }

  td {
    padding: 0.25rem 0.25rem 0.25rem 0;
    font-size: 0.9375rem;
    white-space: nowrap;
  }

  [part='event-log'] {
    padding: 0 1rem;
    min-height: 50px;
    max-height: 200px;
    overflow: auto;
  }

  [part='event-record'] {
    margin: 0 0 0.25rem;
    font-family: var(--ave-monospace-font);
    font-size: 0.875rem;
  }

  [part='event-record']:first-of-type {
    margin-top: 1rem;
  }

  [part='event-record']:last-of-type {
    margin-bottom: 1rem;
  }

  @media (max-width: 480px) {
    [part='knobs'] {
      flex-direction: column;
    }

    [part='knobs-column']:not(:last-child) {
      margin-bottom: 1rem;
    }

    [part='input'] {
      max-width: 8rem;
    }
  }
`;
var styles_default = i`
  ${demoStyles}
  ${highlightTheme}
`;

// ../../node_modules/@api-viewer/docs/lib/styles.js
var styles_default2 = i`
  p,
  ul,
  ol {
    margin: 1rem 0;
    font-size: 0.9375rem;
    line-height: 1.5;
  }

  a {
    color: var(--ave-link-color);
  }

  a:hover {
    color: var(--ave-link-hover-color);
  }

  pre {
    white-space: pre-wrap;
  }

  api-docs-layout {
    display: block;
  }

  [part='tab'][heading^='CSS'] {
    min-width: 120px;
    font-size: 0.8125rem;
  }

  [part='docs-item'] {
    display: block;
    padding: 0.5rem;
    color: var(--ave-item-color);
  }

  [part='docs-item']:not(:first-of-type) {
    border-top: solid 1px var(--ave-border-color);
  }

  [part='docs-tag'] {
    background-color: var(--ave-tag-background-color);
    border: 1px solid var(--ave-tag-border-color);
    border-radius: 3px;
    color: var(--ave-tag-color);
    display: inline-block;
    font-size: 0.75rem;
    padding: 1px 5px;
  }

  [part='docs-description'] {
    display: block;
    padding: 0 1rem;
    border-bottom: solid 1px var(--ave-border-color);
  }

  [part='docs-row'] {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 1rem;
  }

  [part='docs-column'] {
    box-sizing: border-box;
    flex-basis: 25%;
    padding-right: 0.5rem;
  }

  [part='docs-column']:only-child {
    flex-basis: 100%;
  }

  .column-name-css,
  .column-type {
    flex-basis: 50%;
  }

  [part='docs-label'] {
    color: var(--ave-label-color);
    font-size: 0.75rem;
    line-height: 1rem;
    letter-spacing: 0.1rem;
  }

  [part='docs-value'] {
    font-family: var(--ave-monospace-font);
    font-size: 0.875rem;
    line-height: 1.5rem;
  }

  [part='docs-markdown'] p,
  [part='docs-markdown'] ul,
  [part='docs-markdown'] ol {
    margin: 0.5rem 0;
  }

  [part$='params'] {
    color: var(--ave-item-color);
  }

  [part$='type'] {
    color: var(--ave-secondary-color);
  }

  .accent {
    color: var(--ave-accent-color);
  }

  @media (max-width: 480px) {
    .column-type {
      margin-top: 1rem;
    }

    .column-name-css,
    .column-type {
      flex-basis: 100%;
    }

    [part='tab'][heading^='CSS'] {
      max-width: 125px;
    }
  }
`;

// ../../node_modules/api-viewer-element/lib/styles.js
var styles_default3 = [
  shared_styles_default,
  styles_default2,
  styles_default,
  i`
    [part='radio-label'] {
      margin: 0 0.75rem 0 0.25rem;
      color: var(--ave-header-color);
      font-size: 0.875rem;
    }
  `
];

// ../../node_modules/api-viewer-element/lib/api-viewer.js
var ApiViewer = class extends ApiViewerBase {
  static get styles() {
    return styles_default3;
  }
  firstUpdated() {
    this.setTemplates();
  }
  setTemplates(templates2) {
    setTemplates(this._id, templates2 || Array.from(this.querySelectorAll("template")));
  }
};
customElements.define("api-viewer", ApiViewer);

// ../../node_modules/@lit/reactive-element/decorators/custom-element.js
var e8 = (e10) => (n10) => "function" == typeof n10 ? ((e11, n11) => (customElements.define(e11, n11), n11))(e10, n10) : ((e11, n11) => {
  const { kind: t7, elements: s8 } = n11;
  return { kind: t7, elements: s8, finisher(n12) {
    customElements.define(e11, n12);
  } };
})(e10, n10);

// ../../node_modules/@lit/reactive-element/decorators/state.js
function t6(t7) {
  return n5({ ...t7, state: true });
}

// ../../node_modules/@lit/reactive-element/decorators/query-assigned-elements.js
var n8;
var e9 = null != (null === (n8 = window.HTMLSlotElement) || void 0 === n8 ? void 0 : n8.prototype.assignedElements) ? (o12, n10) => o12.assignedElements(n10) : (o12, n10) => o12.assignedNodes(n10).filter((o13) => o13.nodeType === Node.ELEMENT_NODE);

// ../../node_modules/lit-html/directives/when.js
function n9(n10, o12, r7) {
  return n10 ? o12() : null == r7 ? void 0 : r7();
}

// src/component/styles/base.css.ts
var baseProperties = i`
  :root {
    --scrollbar-url: url('assets/img/scrollbar.svg');
  }
`;
var baseStyles = i`
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

  /* Display */

  .hidden {
    display: none;
  }

  .grow {
    flex: 1;
  }

  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  ::-webkit-scrollbar-thumb {
    background: transparent var(--scrollbar-url) no-repeat;
    background-position: bottom;
  }

  ::-webkit-scrollbar-corner {
    background: transparent;
  }
`;

// src/component/styles/font.css.ts
var fontStyles = i`
  :host {
    font-size: 14px;
    line-height: 1.5;
    font-style: normal;
    font-weight: 400;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-family: var(--uigc-app-font), sans-serif;
  }
`;
var fontFace = i`
  @font-face {
    font-family: 'SatoshiVariable';
    src: url('assets/font/Satoshi-Variable.ttf') format('truetype');
    font-display: auto;
    font-weight: 100 900;
  }

  @font-face {
    font-family: 'ChakraPetch';
    src: url('assets/font/Chakra-Petch.ttf') format('truetype');
    font-display: auto;
    font-weight: 500;
  }

  @font-face {
    font-family: 'FontOver';
    src: url('assets/font/Font-Over.ttf') format('truetype');
    font-display: auto;
    font-weight: 500;
  }
`;

// src/component/styles/theme.css.ts
var paletteProperties = i`
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
    --hex-pink-700: #f6297c;

    --hex-bright-blue-100: #a6ddff;
    --hex-bright-blue-200: #9cddff;
    --hex-bright-blue-300: #85d1ff;
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
var bsxThemeProperties = i`
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
    --uigc-app-background: radial-gradient(89.2% 89.2% at 50.07% 87.94%, rgb(0, 138, 105) 0%, rgb(38, 47, 49) 88.52%),
      rgb(44, 51, 53);
    --uigc-app-background-color: var(--uigc-app-background);
    --uigc-app-border-radius: 20px;
    --uigc-app-border-radius-2: 8px;

    --uigc-app-bg-section: rgba(var(--rgb-black), 0.25);
    --uigc-app-bg-error: rgba(var(--rgb-red-400), 0.3);
    --uigc-app-bg-warning: rgba(255, 184, 0, 0.5);
    --uigc-app-bg-id: var(--hex-black);

    --uigc-app-font-color__gradient: linear-gradient(90deg, #4fffb0 1.27%, #b3ff8f 48.96%, #ff984e 104.14%),
      linear-gradient(90deg, #4fffb0 1.27%, #a2ff76 53.24%, #ff984e 104.14%),
      linear-gradient(90deg, #ffce4f 1.27%, #4fffb0 104.14%);
    --uigc-app-font-color__primary: var(--hex-primary-400);
    --uigc-app-font-color__secondary: var(--hex-neutral-gray-300);
    --uigc-app-font-color__alternative: var(--hex-neutral-gray-400);

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
    --uigc-textfield__field-background__hover: var(--uigc-asset-input-background__hover);
    --uigc-textfield__field-border-width: var(--uigc-input-border-width);
    --uigc-textfield__field-border-color: var(--uigc-input-border-color);
    --uigc-textfield__field-border-color__hover: var(--uigc-input-border-color__focus);

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
    --uigc-button__secondary-background__disabled: rgba(var(--rgb-primary-450), 0.12);
    --uigc-button__secondary-background__hover: rgba(var(--rgb-primary-450), 0.3);
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
    --uigc-paper-background: linear-gradient(180deg, #1c2527 0%, #14161a 80.73%, #121316 100%);
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
    --uigc-toggle-button--root-background__hover: var(--hex-background-gray-700);
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
    --uigc-typography__title-gradient-background: var(--uigc-app-font-color__gradient);
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
var hdxThemeProperties = i`
  html[theme='hdx'] {
    --uigc-bsx-flex-display: none;
    --uigc-hdx-flex-display: flex;
    --uigc-bsx-grid-display: none;
    --uigc-hdx-grid-display: grid;
    --uigc-bsx-display: none;
    --uigc-hdx-display: block;
    /** GENERAL */
    --uigc-app-font: 'ChakraPetch';
    --uigc-app-font-secondary: 'FontOver';
    --uigc-app-background: radial-gradient(
        73.65% 123% at 57% -38.76%,
        rgba(93, 177, 255, 0.59) 0%,
        rgba(0, 194, 255, 0) 100%
      ),
      linear-gradient(180deg, #00579f 0%, #023b6a 25%, #060917 100%);
    --uigc-app-background-color: rgb(6, 9, 23);
    --uigc-app-border-radius: 4px;
    --uigc-app-border-radius-2: 2px;

    --uigc-app-bg-section: rgba(var(--rgb-primary-alpha), 0.06);
    --uigc-app-bg-error: rgba(239, 3, 3, 0.25);
    --uigc-app-bg-warning: rgba(255, 223, 56, 0.4);
    --uigc-app-bg-id: var(--hex-dark-blue-400);

    --uigc-app-font-color__gradient: linear-gradient(90deg, #fc408c 0%, #57b3eb 100%);
    --uigc-app-font-color__primary: var(--hex-bright-blue-300);
    --uigc-app-font-color__secondary: var(--hex-dark-blue-300);
    --uigc-app-font-color__alternative: var(--hex-basic-400);

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
    --uigc-textfield__field-background__hover: var(--uigc-field-background__hover);
    --uigc-textfield__field-border-bottom: var(--uigc-input-border-width);
    --uigc-textfield__field-border-color: var(--uigc-input-border-color);
    --uigc-textfield__field-border-color__hover: var(--uigc-input-border-color__focus);

    /** AddressInput */
    --uigc-address-input__placeholder-color: var(--hex-basic-300);
    --uigc-address-input-background__hover: rgba(var(--rgb-primary-alpha15), 0.12);
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
    --uigc-asset-transfer__error-border-width: var(--uigc-field__error-border-width);
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
    --uigc-button__max-background__disabled: rgba(var(--rgb-primary-alpha), 0.06);
    --uigc-button__max-background__hover: rgba(var(--rgb-primary-alpha15), 0.2);
    --uigc-button__primary-color: var(--hex-white);
    --uigc-button__primary-color__disabled: rgb(102, 105, 124);
    --uigc-button__primary-background: var(--hex-pink-700);
    --uigc-button__primary-background__disabled: rgba(var(--rgb-primary-alpha), 0.06);
    --uigc-button__primary-background__hover: var(--hex-pink-600);
    --uigc-button__primary-box-shadow__hover: rgb(255 15 111 / 30%) 4px 10px 40px 0px;
    --uigc-button__primary-transform__hover: translate(-5px, -5px);
    --uigc-button__primary-background__before: linear-gradient(
      129deg,
      rgba(122, 96, 138, 0.25) 0%,
      rgba(255, 153, 202, 0.23) 100%
    );
    --uigc-button__info-color: var(--hex-white);
    --uigc-button__info-color__disabled: rgb(102, 105, 124);
    --uigc-button__info-background: var(--hex-bright-blue-700);
    --uigc-button__info-background__disabled: rgba(var(--rgb-primary-alpha), 0.06);
    --uigc-button__info-background__hover: var(--hex-bright-blue-700);
    --uigc-button__info-box-shadow__hover: 0px 0px 0px -1px rgba(145, 164, 200, 0.3),
      0px 13px 40px -12px rgba(41, 148, 246, 0.45);
    --uigc-button__info-transform__hover: translate(-5px, -5px);
    --uigc-button__info-background__before: rgba(1, 158, 255, 0.35);
    --uigc-button__secondary-color: var(--hex-bright-blue-300);
    --uigc-button__secondary-color__disabled: rgb(102, 105, 124);
    --uigc-button__secondary-color__hover: var(--hex-white);
    --uigc-button__secondary-background: rgba(var(--rgb-primary-alpha15), 0.12);
    --uigc-button__secondary-background__disabled: rgba(var(--rgb-primary-alpha), 0.06);
    --uigc-button__secondary-background__hover: rgba(var(--rgb-primary-alpha15), 0.3);
    --uigc-button__secondary-border: 1px solid var(--hex-bright-blue-300);
    --uigc-button__secondary-border__hover: 1px solid var(--hex-white);
    --uigc-button__error-color: #f87171;
    --uigc-button__error-color__disabled: rgb(102, 105, 124);
    --uigc-button__error-color__hover: #ff9e9e;
    --uigc-button__error-background: rgba(239, 3, 3, 0.25);
    --uigc-button__error-background__disabled: rgba(var(--rgb-primary-alpha), 0.06);
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
    --uigc-chain-selector-background__hover: rgba(var(--rgb-primary-alpha15), 0.12);
    --uigc-chain-selector--title-color: var(--hex-basic-500);
    --uigc-chain-selector--title-font-weight: 600;
    /** Dialog */
    --uigc-dialog-background: var(--hex-dark-blue-600);
    --uigc-dialog-box-shadow: 0px 10px 30px rgba(91, 144, 172, 0.12), 3px 3px 0px rgba(126, 161, 194, 0.12);
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
    --uigc-list-item__selected-background: rgba(var(--rgb-primary-alpha15), 0.12);
    --uigc-list-item--button-background: rgba(var(--rgb-white), 0.03);
    --uigc-list-item--secondary-color: rgba(221, 229, 255, 0.61);
    --uigc-list-item--secondary-desc-font-weight: 400;
    /** Paper */
    --uigc-paper-border-radius: 4px;
    --uigc-paper-box-shadow: 3px 4px 0px rgba(102, 181, 255, 0.19);
    --uigc-paper-background: var(--hex-dark-blue-700);
    --uigc-paper-content: '';
    --uigc-paper-mask: linear-gradient(rgb(255, 255, 255) 0px, rgb(255, 255, 255) 0px) content-box content-box,
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
    --uigc-switch__checked--root-background: rgba(var(--rgb-primary-alpha20), 0.2);
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
    --uigc-toggle-button__selected--root-background: linear-gradient(90deg, #fc408c 30%, #efb0ff 100%);
    --uigc-toggle-button__selected--tab-color: var(--hex-white);
    --uigc-toggle-button__selected--tab-background: var(--hex-bright-blue-700);
    /** ToggleButtonGroup */
    --uigc-toggle-button-group--root-background: rgba(var(--rgb-primary-alpha), 0.06);
    --uigc-toggle-button-group--root-border-radius: 4px;
    /** Typography */
    --uigc-typography__title-background: #fff;
    --uigc-typography__title-error-background: rgb(255, 75, 75);
    --uigc-typography__title-gradient-background: var(--uigc-app-font-color__gradient);
    --uigc-typography__title-font-weight: 500;
    --uigc-typography__title-font-size: 19px;
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

// src/component/utils/styles.ts
function createStyleInHead(cssText, attributes) {
  const style = document.createElement("style");
  Object.entries(attributes).forEach((pair) => style.setAttribute(...pair));
  style.textContent = cssText.cssText;
  document.head.appendChild(style);
  return style;
}
function createStyle(cssText, name, value) {
  const attributes = /* @__PURE__ */ new Map();
  attributes[name] = value;
  return createStyleInHead(cssText, attributes);
}
function hasStyle(name, value) {
  return !!document.querySelector(`head>style[${name}="${value}"]`);
}

// src/component/base/UIGCElement.ts
var UIGCElement = class extends s4 {
  createFontFaceStylesheet() {
    if (!hasStyle("uigc-font-face", "")) {
      createStyle(fontFace, "uigc-font-face", "");
    }
  }
  createBaseStylesheet() {
    if (!hasStyle("uigc-base", "")) {
      createStyle(baseProperties, "uigc-base", "");
    }
  }
  createPaletteStylesheet() {
    if (!hasStyle("uigc-palette", "")) {
      createStyle(paletteProperties, "uigc-palette", "");
    }
  }
  createBsxThemeStylesheet() {
    if (!hasStyle("uigc-bsx-theme", "")) {
      createStyle(bsxThemeProperties, "uigc-bsx-theme", "");
    }
  }
  createHdxThemeStylesheet() {
    if (!hasStyle("uigc-hdx-theme", "")) {
      createStyle(hdxThemeProperties, "uigc-hdx-theme", "");
    }
  }
  async firstUpdated() {
    this.createBaseStylesheet();
    this.createPaletteStylesheet();
    this.createFontFaceStylesheet();
    this.createBsxThemeStylesheet();
    this.createHdxThemeStylesheet();
  }
  fireEvent(name, data, cancelable = false, bubbles = true) {
    const normalEvent = new CustomEvent(name, {
      detail: data,
      composed: false,
      bubbles,
      cancelable
    });
    return this.dispatchEvent(normalEvent);
  }
};
UIGCElement.styles = [baseStyles, fontStyles];

// src/component/icons/BaseIcon.ts
var BaseIcon = class extends s4 {
};
BaseIcon.styles = [
  i`
      :host {
        display: flex;
      }

      :host([fit]) svg {
        width: 100%;
        height: 100%;
      }

      :host svg[bsx] {
        display: var(--uigc-bsx-flex-display);
      }

      :host svg[hdx] {
        display: var(--uigc-hdx-flex-display);
      }
    `
];

// src/component/icons/Identity.ts
var IdentityIcon = class extends BaseIcon {
  bsxTemplate() {
    return x`
      <svg bsx xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect x="0.986618" y="0.914841" width="30.1703" height="30.1703" rx="15.0852" fill="#000" />
        <g clip-path="url(#clip0_15352_12646)">
          <path
            d="M15.9997 15.7568C17.7143 15.7568 19.1049 14.0681 19.1049 11.9853C19.1049 9.90257 18.6482 8.21387 15.9997 8.21387C13.3512 8.21387 12.8945 9.90257 12.8945 11.9853C12.8945 14.0681 14.285 15.7568 15.9997 15.7568Z"
            fill="#5B5B63"
          />
          <path d="M21.8672 21.6148C21.869 21.5799 21.8678 21.3738 21.8672 21.6148V21.6148Z" fill="#5B5B63" />
          <path
            d="M21.8575 21.3635C21.8003 17.7349 21.3262 16.701 17.6999 16.0466C17.6999 16.0466 17.1896 16.6973 15.9997 16.6973C14.8099 16.6973 14.2996 16.0466 14.2996 16.0466C10.7131 16.6937 10.21 17.7125 10.1438 21.246C10.1384 21.5346 10.136 21.5497 10.1348 21.5159C10.1348 21.5786 10.1354 21.6949 10.1354 21.8973C10.1354 21.8973 10.9987 23.6378 15.9998 23.6378C21.0009 23.6378 21.8642 21.8973 21.8642 21.8973V21.6153C21.8636 21.6352 21.8612 21.5954 21.8576 21.3635L21.8575 21.3635Z"
            fill="#5B5B63"
          />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M16.4454 11.3995C16.7804 11.1502 16.9121 10.9246 16.9121 10.7256C16.9121 10.494 16.8334 10.3243 16.6817 10.2002C16.5271 10.0737 16.3007 10.0018 15.9853 10.0018C15.6776 10.0018 15.4643 10.0804 15.3236 10.2173C15.183 10.3582 15.1068 10.545 15.1029 10.7903C15.1027 10.836 15.0909 10.8942 15.0449 10.9402C14.9984 10.9867 14.9396 10.9982 14.8937 10.9982H14.4939C14.4484 10.9982 14.3895 10.988 14.3417 10.9439C14.292 10.898 14.2783 10.8378 14.2783 10.789C14.2783 10.3595 14.4189 9.99002 14.7015 9.6889C14.9972 9.37414 15.4316 9.22803 15.979 9.22803C16.5227 9.22803 16.9621 9.35512 17.2779 9.62826C17.5944 9.89843 17.7558 10.2439 17.7558 10.6558C17.7558 10.8748 17.7169 11.0773 17.6368 11.2611L17.6363 11.2622C17.5586 11.4359 17.4601 11.581 17.3383 11.693C17.2315 11.7913 17.1141 11.8958 16.9863 12.0066L16.9854 12.0074L16.9844 12.0082C16.8582 12.1134 16.7428 12.212 16.638 12.3042C16.5483 12.3832 16.4696 12.4902 16.4039 12.6292L16.4033 12.6306C16.3412 12.7583 16.3087 12.9051 16.3087 13.0738C16.3087 13.1226 16.295 13.1828 16.2453 13.2287C16.1976 13.2727 16.1387 13.283 16.0932 13.283H15.6553C15.6098 13.283 15.5509 13.2727 15.5032 13.2287C15.4534 13.1828 15.4397 13.1226 15.4397 13.0738C15.4397 12.7901 15.4939 12.5326 15.6056 12.3045C15.7133 12.0846 15.8459 11.9024 16.0052 11.7619C16.1512 11.633 16.2975 11.5125 16.444 11.4005L16.4454 11.3995Z"
            fill="#00041D"
          />
          <path
            d="M15.2178 14.2517C15.2178 14.431 15.2804 14.5876 15.4055 14.7127C15.5355 14.8427 15.6946 14.9104 15.8765 14.9104C16.0626 14.9104 16.2235 14.8442 16.3489 14.7112C16.4731 14.5863 16.5351 14.4303 16.5351 14.2517C16.5351 14.0731 16.4731 13.9171 16.3489 13.7922C16.2235 13.6592 16.0626 13.593 15.8765 13.593C15.6946 13.593 15.5355 13.6607 15.4055 13.7907C15.2804 13.9158 15.2178 14.0724 15.2178 14.2517Z"
            fill="#00041D"
          />
        </g>
        <rect
          x="0.986618"
          y="0.914841"
          width="30.1703"
          height="30.1703"
          rx="15.0852"
          stroke="#000"
          stroke-width="0.973236"
        />
        <defs>
          <clipPath id="clip0_15352_12646">
            <rect width="15.4234" height="15.4234" fill="white" transform="translate(8.28613 8.21411)" />
          </clipPath>
        </defs>
      </svg>
    `;
  }
  hdxTemplate() {
    return x`
      <svg hdx xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect x="0.986618" y="0.914841" width="30.1703" height="30.1703" rx="15.0852" fill="#333750" />
        <g clip-path="url(#clip0_15352_12646)">
          <path
            d="M15.9997 15.7568C17.7143 15.7568 19.1049 14.0681 19.1049 11.9853C19.1049 9.90257 18.6482 8.21387 15.9997 8.21387C13.3512 8.21387 12.8945 9.90257 12.8945 11.9853C12.8945 14.0681 14.285 15.7568 15.9997 15.7568Z"
            fill="#676C80"
          />
          <path d="M21.8672 21.6148C21.869 21.5799 21.8678 21.3738 21.8672 21.6148V21.6148Z" fill="#676C80" />
          <path
            d="M21.8575 21.3635C21.8003 17.7349 21.3262 16.701 17.6999 16.0466C17.6999 16.0466 17.1896 16.6973 15.9997 16.6973C14.8099 16.6973 14.2996 16.0466 14.2996 16.0466C10.7131 16.6937 10.21 17.7125 10.1438 21.246C10.1384 21.5346 10.136 21.5497 10.1348 21.5159C10.1348 21.5786 10.1354 21.6949 10.1354 21.8973C10.1354 21.8973 10.9987 23.6378 15.9998 23.6378C21.0009 23.6378 21.8642 21.8973 21.8642 21.8973V21.6153C21.8636 21.6352 21.8612 21.5954 21.8576 21.3635L21.8575 21.3635Z"
            fill="#676C80"
          />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M16.4454 11.3995C16.7804 11.1502 16.9121 10.9246 16.9121 10.7256C16.9121 10.494 16.8334 10.3243 16.6817 10.2002C16.5271 10.0737 16.3007 10.0018 15.9853 10.0018C15.6776 10.0018 15.4643 10.0804 15.3236 10.2173C15.183 10.3582 15.1068 10.545 15.1029 10.7903C15.1027 10.836 15.0909 10.8942 15.0449 10.9402C14.9984 10.9867 14.9396 10.9982 14.8937 10.9982H14.4939C14.4484 10.9982 14.3895 10.988 14.3417 10.9439C14.292 10.898 14.2783 10.8378 14.2783 10.789C14.2783 10.3595 14.4189 9.99002 14.7015 9.6889C14.9972 9.37414 15.4316 9.22803 15.979 9.22803C16.5227 9.22803 16.9621 9.35512 17.2779 9.62826C17.5944 9.89843 17.7558 10.2439 17.7558 10.6558C17.7558 10.8748 17.7169 11.0773 17.6368 11.2611L17.6363 11.2622C17.5586 11.4359 17.4601 11.581 17.3383 11.693C17.2315 11.7913 17.1141 11.8958 16.9863 12.0066L16.9854 12.0074L16.9844 12.0082C16.8582 12.1134 16.7428 12.212 16.638 12.3042C16.5483 12.3832 16.4696 12.4902 16.4039 12.6292L16.4033 12.6306C16.3412 12.7583 16.3087 12.9051 16.3087 13.0738C16.3087 13.1226 16.295 13.1828 16.2453 13.2287C16.1976 13.2727 16.1387 13.283 16.0932 13.283H15.6553C15.6098 13.283 15.5509 13.2727 15.5032 13.2287C15.4534 13.1828 15.4397 13.1226 15.4397 13.0738C15.4397 12.7901 15.4939 12.5326 15.6056 12.3045C15.7133 12.0846 15.8459 11.9024 16.0052 11.7619C16.1512 11.633 16.2975 11.5125 16.444 11.4005L16.4454 11.3995Z"
            fill="#00041D"
          />
          <path
            d="M15.2178 14.2517C15.2178 14.431 15.2804 14.5876 15.4055 14.7127C15.5355 14.8427 15.6946 14.9104 15.8765 14.9104C16.0626 14.9104 16.2235 14.8442 16.3489 14.7112C16.4731 14.5863 16.5351 14.4303 16.5351 14.2517C16.5351 14.0731 16.4731 13.9171 16.3489 13.7922C16.2235 13.6592 16.0626 13.593 15.8765 13.593C15.6946 13.593 15.5355 13.6607 15.4055 13.7907C15.2804 13.9158 15.2178 14.0724 15.2178 14.2517Z"
            fill="#00041D"
          />
        </g>
        <rect
          x="0.986618"
          y="0.914841"
          width="30.1703"
          height="30.1703"
          rx="15.0852"
          stroke="#333750"
          stroke-width="0.973236"
        />
        <defs>
          <clipPath id="clip0_15352_12646">
            <rect width="15.4234" height="15.4234" fill="white" transform="translate(8.28613 8.21411)" />
          </clipPath>
        </defs>
      </svg>
    `;
  }
  render() {
    return x` ${this.bsxTemplate()} ${this.hdxTemplate()} `;
  }
};
IdentityIcon = __decorateClass([
  e8("uigc-icon-id")
], IdentityIcon);

// src/component/icons/Paste.ts
var PasteIcon = class extends BaseIcon {
  render() {
    return x`
      <svg xmlns="http://www.w3.org/2000/svg" width="23" height="22" viewBox="0 0 23 22" fill="none">
        <path
          d="M10.7139 16.5187H10.7148C10.9125 16.7258 11.1926 16.8538 11.5011 16.8538C11.8105 16.8538 12.0898 16.7249 12.2875 16.5187L16.0946 12.5519C16.5114 12.117 16.4968 11.4269 16.0628 11.0101C15.8505 10.8073 15.5789 10.7068 15.3074 10.7068C15.0203 10.7068 14.7342 10.8194 14.5202 11.0419L12.5909 13.052V6.25265C12.5909 5.65023 12.1019 5.16211 11.5003 5.16211C10.8979 5.16211 10.4089 5.65025 10.4089 6.25265V13.052L8.47964 11.0419C8.2648 10.8185 7.97949 10.7068 7.69246 10.7068C7.42089 10.7068 7.14846 10.8073 6.93706 11.0101C6.50221 11.4269 6.48846 12.117 6.90527 12.5519L10.7139 16.5187Z"
          fill="#B2B6C5"
        />
        <path
          d="M4.30927 4.13849H18.6936C19.296 4.13849 19.7841 3.65035 19.7841 3.04795C19.7833 2.44552 19.2952 1.95654 18.6927 1.95654H4.3093C3.70601 1.95654 3.21875 2.44554 3.21875 3.04795C3.21875 3.65035 3.70601 4.13849 4.3093 4.13849H4.30927Z"
          fill="#B2B6C5"
        />
        <path
          d="M18.6895 17.8526H17.5938V20.0423H18.6895C19.2936 20.0423 19.7843 19.5524 19.7843 18.9474C19.7843 18.3432 19.2936 17.8525 18.6895 17.8525V17.8526Z"
          fill="#B2B6C5"
        />
        <path
          d="M3.21289 18.9482C3.21289 19.5524 3.7036 20.0431 4.30775 20.0431H5.40261V17.8534L4.30775 17.8525C3.70274 17.8525 3.21289 18.3433 3.21289 18.9483V18.9482Z"
          fill="#B2B6C5"
        />
        <path d="M6.80859 17.8525H8.99829V20.0422H6.80859V17.8525Z" fill="#B2B6C5" />
        <path d="M10.4043 17.8525H12.594V20.0422H10.4043V17.8525Z" fill="#B2B6C5" />
        <path d="M14.002 17.8525H16.1916V20.0422H14.002V17.8525Z" fill="#B2B6C5" />
      </svg>
    `;
  }
};
PasteIcon = __decorateClass([
  e8("uigc-icon-paste")
], PasteIcon);

// src/component/icons/Close.ts
var CloseIcon = class extends BaseIcon {
  render() {
    return x`
      <svg width="11" height="12" viewBox="0 0 11 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M10.0462 10.165L1.22266 0.900333"
          stroke="#E5ECF1"
          stroke-width="1.76471"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>
        <path
          d="M10.0462 0.900391L1.22266 10.1651"
          stroke="#E5ECF1"
          stroke-width="1.76471"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>
      </svg>
    `;
  }
};
CloseIcon = __decorateClass([
  e8("uigc-icon-close")
], CloseIcon);

// src/component/IconButton.ts
var IconButton = class extends UIGCElement {
  render() {
    return x`
      <button class="icon-button-root">
        <slot></slot>
      </button>
    `;
  }
};
IconButton.styles = [
  UIGCElement.styles,
  i`
      :host([size='small']) .icon-button-root {
        width: 24px;
        height: 24px;
      }

      :host(:not([size])) .icon-button-root,
      :host([size='medium']) .icon-button-root {
        width: 34px;
        height: 34px;
      }

      :host([size='large']) .icon-button-root {
        width: 44px;
        height: 44px;
      }

      :host([basic]) .icon-button-root {
        border: none;
      }

      .icon-button-root {
        display: flex;
        justify-content: center;
        align-items: center;
        border: var(--uigc-icon-button-border);
        border-radius: var(--uigc-icon-button-border-radius);
        background: var(--uigc-icon-button-background);
      }

      .icon-button-root:hover {
        background: var(--uigc-icon-button-background__hover);
        border: var(--uigc-icon-button-border__hover);
        cursor: pointer;
        transition: 0.2s ease-in-out;
      }
    `
];
IconButton = __decorateClass([
  e8("uigc-icon-button")
], IconButton);

// src/component/AddressInput.ts
var AddressInput = class extends UIGCElement {
  constructor() {
    super(...arguments);
    this.title = null;
    this.address = null;
    this.id = null;
    this.error = null;
  }
  onInputClear() {
    this.address = null;
    const options2 = {
      bubbles: true,
      composed: true,
      detail: { address: null }
    };
    this.dispatchEvent(new CustomEvent("address-input-change", options2));
  }
  onInputChange(e10) {
    this.address = e10.target.value;
    const options2 = {
      bubbles: true,
      composed: true,
      detail: { address: this.address }
    };
    this.dispatchEvent(new CustomEvent("address-input-change", options2));
  }
  async onPasteClick() {
    this.address = await navigator.clipboard.readText();
    const options2 = {
      bubbles: true,
      composed: true,
      detail: { address: this.address }
    };
    this.dispatchEvent(new CustomEvent("address-input-change", options2));
  }
  async updated() {
    const defaultIdIcon = this.shadowRoot.querySelector("uigc-icon-id");
    const slotId = this.shadowRoot.querySelector("slot[name=id]");
    const slotNodes = slotId.assignedNodes();
    if (slotNodes.length > 0) {
      defaultIdIcon.setAttribute("style", "display: none");
    } else {
      defaultIdIcon.setAttribute("style", "display: block");
    }
  }
  render() {
    return x`
      <div tabindex="0" class="address-root">
        <span class="title">${this.title}</span>
        <div class="address">
          <uigc-icon-id></uigc-icon-id>
          <slot name="id"></slot>
          <div class="input-root">
            <input
              type="text"
              .value=${this.address}
              placeholder="Paste recipient address here"
              @input=${(e10) => this.onInputChange(e10)}
            />
          </div>
          ${n9(
      this.address,
      () => x`
              <uigc-icon-button size="small">
                <uigc-icon-close @click=${() => this.onInputClear()}></uigc-icon-close>
              </uigc-icon-button>
            `,
      () => x` <uigc-icon-paste @click=${() => this.onPasteClick()}></uigc-icon-paste> `
    )}
        </div>
      </div>
      <p class="address-error">${this.error}</p>
    `;
  }
};
AddressInput.styles = [
  UIGCElement.styles,
  i`
      .address-root {
        display: grid;
        background: var(--uigc-field-background);
        border-radius: var(--uigc-field-border-radius);
        border-bottom: var(--uigc-field-border-bottom);
        box-sizing: border-box;
        padding: var(--uigc-field-padding);
        row-gap: var(--uigc-field-row-gap);
      }

      :host([error]) .address-root {
        border: var(--uigc-field__error-border);
        border-width: var(--uigc-field__error-border-width);
        outline: var(--uigc-field__error-outline);
        outline-offset: -1px;
      }

      .address-root:focus,
      .address-root:focus-visible,
      .address-root:focus-within,
      .address-root:hover {
        border-bottom: var(--uigc-field-border-bottom__hover);
        background: var(--uigc-address-input-background__hover);
        transition: 0.2s ease-in-out;
      }

      :host([error]) .address-root:focus,
      :host([error]) .address-root:focus-visible,
      :host([error]) .address-root:focus-within,
      :host([error]) .address-root:hover {
        background: rgba(255, 75, 75, 0.1);
        transition: 0.2s ease-in-out;
      }

      /* Placeholder color */
      ::-webkit-input-placeholder {
        color: var(--uigc-address-input__placeholder-color);
      }

      ::-moz-placeholder {
        color: var(--uigc-address-input__placeholder-color);
      }

      ::-ms-placeholder {
        color: var(--uigc-address-input__placeholder-colorr);
      }

      ::placeholder {
        color: var(--uigc-address-input__placeholder-color);
      }

      .title {
        display: flex;
        align-items: center;
        color: var(--uigc-chain-selector--title-color);
        font-weight: var(--uigc-chain-selector--title-font-weight);
        font-size: var(--uigc-field--title-font-size);
        line-height: var(--uigc-field--title-line-height);
        text-transform: var(--uigc-field--title-text-transform);
      }

      .address {
        display: flex;
        flex-direction: row;
        align-items: center;
      }

      .address-error {
        color: var(--uigc-field__error-color);
        line-height: 16px;
        margin-top: 2px;
        font-size: 12px;
      }

      .input-root {
        width: 100%;
        display: flex;
        flex-direction: column;
        -webkit-box-pack: center;
        justify-content: center;
        box-sizing: border-box;
        padding: 0 14px;
        min-height: 50px;
      }

      .input-root p {
        font-weight: 500;
        color: rgb(133, 209, 255);
        font-size: 12px;
        line-height: 16px;
        text-align: left;
        overflow-wrap: break-word;
        word-break: break-word;
      }

      input {
        width: 100%;
        background: none;
        border: none;
        color: var(--hex-white);
        font-weight: 500;
        font-size: 14px;
        line-height: 100%;
        padding: 0px;
        box-sizing: border-box;
      }

      uigc-icon-paste {
        cursor: pointer;
      }

      ::slotted([slot='id']) {
        min-width: 32px;
        height: 32px;
        border-radius: 9999px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--uigc-app-bg-id);
      }
    `
];
__decorateClass([
  n5({ type: String })
], AddressInput.prototype, "title", 2);
__decorateClass([
  n5({ type: String })
], AddressInput.prototype, "address", 2);
__decorateClass([
  n5({ type: String })
], AddressInput.prototype, "id", 2);
__decorateClass([
  n5({ type: String })
], AddressInput.prototype, "error", 2);
AddressInput = __decorateClass([
  e8("uigc-address-input")
], AddressInput);

// ../../node_modules/lit-html/directives/choose.js
var o9 = (o12, r7, n10) => {
  for (const n11 of r7)
    if (n11[0] === o12)
      return (0, n11[1])();
  return null == n10 ? void 0 : n10();
};

// src/component/icons/Success.ts
var SuccessIcon = class extends BaseIcon {
  bsxTemplate() {
    return x`<svg bsx xmlns="http://www.w3.org/2000/svg" width="30px" height="29px" viewBox="0 0 30 29" fill="none">
      <circle cx="14.9995" cy="14.145" r="14.0112" fill="url(#paint0_linear_13185_9479)" fill-opacity="0.3" />
      <path
        d="M10.4648 15.2601L13.8537 18.649L21.0081 11.1182"
        stroke="url(#paint1_linear_13185_9479)"
        stroke-width="2.43673"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M10.4648 15.2601L13.8537 18.649L21.0081 11.1182"
        stroke="url(#paint2_linear_13185_9479)"
        stroke-width="2.43673"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M10.4648 15.2601L13.8537 18.649L21.0081 11.1182"
        stroke="url(#paint3_linear_13185_9479)"
        stroke-width="2.43673"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <defs>
        <linearGradient
          id="paint0_linear_13185_9479"
          x1="14.9995"
          y1="-13.3982"
          x2="14.9995"
          y2="44.0001"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#4FFFB0" stop-opacity="0" />
          <stop offset="0.264426" stop-color="#4FFFB0" stop-opacity="0.14" />
          <stop offset="0.59633" stop-color="#2EFFA1" />
          <stop offset="0.751279" stop-color="#FFE668" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_13185_9479"
          x1="10.5992"
          y1="6.64671"
          x2="21.4446"
          y2="6.64671"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#FFCE4F" />
          <stop offset="1" stop-color="#4FFFB0" />
        </linearGradient>
        <linearGradient
          id="paint2_linear_13185_9479"
          x1="10.5992"
          y1="6.64671"
          x2="21.4446"
          y2="6.64671"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#4FFFB0" />
          <stop offset="0.505223" stop-color="#A2FF76" />
          <stop offset="1" stop-color="#FF984E" />
        </linearGradient>
        <linearGradient
          id="paint3_linear_13185_9479"
          x1="10.5992"
          y1="6.64671"
          x2="21.4446"
          y2="6.64671"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#4FFFB0" />
          <stop offset="0.463556" stop-color="#B3FF8F" />
          <stop offset="1" stop-color="#FF984E" />
        </linearGradient>
      </defs>
    </svg>`;
  }
  hdxTemplate() {
    return x` <svg hdx xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36" fill="none">
      <rect x="9.59961" y="17.1415" width="3.73333" height="3.73333" fill="#00FFA0" />
      <rect x="13.333" y="20.8748" width="3.73333" height="3.73333" fill="#00FFA0" />
      <rect
        x="24.5332"
        y="13.4081"
        width="3.73333"
        height="3.73333"
        transform="rotate(90 24.5332 13.4081)"
        fill="#00FFA0"
      />
      <rect
        x="20.7998"
        y="17.1415"
        width="3.73333"
        height="3.73333"
        transform="rotate(90 20.7998 17.1415)"
        fill="#00FFA0"
      />
      <rect
        x="17.0664"
        y="20.8748"
        width="3.73333"
        height="3.73333"
        transform="rotate(90 17.0664 20.8748)"
        fill="#00FFA0"
      />
      <rect
        x="28.2666"
        y="9.6748"
        width="3.73333"
        height="3.73333"
        transform="rotate(90 28.2666 9.6748)"
        fill="#00FFA0"
      />
    </svg>`;
  }
  render() {
    return x` ${this.bsxTemplate()} ${this.hdxTemplate()} `;
  }
};
SuccessIcon = __decorateClass([
  e8("uigc-icon-success")
], SuccessIcon);

// src/component/icons/Error.ts
var ErrorIcon = class extends BaseIcon {
  bsxTemplate() {
    return x`
      <svg bsx xmlns="http://www.w3.org/2000/svg" width="30" height="29" viewBox="0 0 30 29" fill="none">
        <circle cx="14.9995" cy="14.145" r="14.0112" fill="url(#paint0_linear_13185_9508)" fill-opacity="0.4" />
        <path
          d="M10.3633 19.4098L12.5777 17.1954L20.1911 9.65625"
          stroke="url(#paint1_linear_13185_9508)"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M10.3633 9.65371L12.5777 11.8681L20.1911 19.4072"
          stroke="url(#paint2_linear_13185_9508)"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <defs>
          <linearGradient
            id="paint0_linear_13185_9508"
            x1="14.9995"
            y1="-13.3982"
            x2="14.9995"
            y2="27.1899"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0.0560296" stop-color="#FF4F4F" stop-opacity="0" />
            <stop offset="0.35885" stop-color="#FF4F4F" stop-opacity="0.29" />
            <stop offset="0.438769" stop-color="#FF6868" stop-opacity="0.27" />
            <stop offset="1" stop-color="#FF6868" />
          </linearGradient>
          <linearGradient
            id="paint1_linear_13185_9508"
            x1="9.29227"
            y1="5.17989"
            x2="20.6481"
            y2="5.17989"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#FF8A8A" />
            <stop offset="1" stop-color="#DA5D5D" />
          </linearGradient>
          <linearGradient
            id="paint2_linear_13185_9508"
            x1="9.29227"
            y1="23.8836"
            x2="20.6481"
            y2="23.8836"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#FF8A8A" />
            <stop offset="1" stop-color="#DA5D5D" />
          </linearGradient>
        </defs>
      </svg>
    `;
  }
  hdxTemplate() {
    return x` <svg hdx xmlns="http://www.w3.org/2000/svg" width="28" height="29" viewBox="0 0 28 29" fill="none">
      <rect x="3.99219" y="4.07471" width="4" height="4" fill="#FF4B4B" />
      <rect x="7.99219" y="8.07495" width="4" height="4" fill="#FF4B4B" />
      <rect x="11.9961" y="12.0747" width="4" height="4" fill="#FF4B4B" />
      <rect x="15.9922" y="16.0747" width="4" height="4" fill="#FF4B4B" />
      <rect x="19.9922" y="20.0747" width="4" height="4" fill="#FF4B4B" />
      <rect x="23.9922" y="4.07471" width="4" height="4" transform="rotate(90 23.9922 4.07471)" fill="#FF4B4B" />
      <rect x="19.9922" y="8.07495" width="4" height="4" transform="rotate(90 19.9922 8.07495)" fill="#FF4B4B" />
      <rect x="15.9961" y="12.0747" width="4" height="4" transform="rotate(90 15.9961 12.0747)" fill="#FF4B4B" />
      <rect x="11.9961" y="16.0747" width="4" height="4" transform="rotate(90 11.9961 16.0747)" fill="#FF4B4B" />
      <rect x="7.99219" y="20.0747" width="4" height="4" transform="rotate(90 7.99219 20.0747)" fill="#FF4B4B" />
    </svg>`;
  }
  render() {
    return x` ${this.bsxTemplate()} ${this.hdxTemplate()} `;
  }
};
ErrorIcon = __decorateClass([
  e8("uigc-icon-error")
], ErrorIcon);

// src/component/CircularProgress.ts
var CircularProgress = class extends UIGCElement {
  render() {
    return x` <span class="progress-root"></span> `;
  }
};
CircularProgress.styles = i`
    :host {
      --spinner-width: 3px;
    }

    :host([size='small']) .progress-root {
      width: 14px;
      height: 14px;
    }

    :host([size='medium']) .progress-root {
      width: 30px;
      height: 30px;
    }

    :host(:not([size])) .progress-root {
      width: 100%;
      height: 100%;
    }

    .progress-root {
      display: block;
      position: relative;
      border-radius: 9999px;
      -webkit-mask: radial-gradient(
        farthest-side,
        rgba(255, 255, 255, 0) calc(100% - var(--spinner-width)),
        rgba(255, 255, 255, 1) calc(100% - var(--spinner-width) + 1px)
      );
      mask: radial-gradient(
        farthest-side,
        rgba(255, 255, 255, 0) calc(100% - var(--spinner-width)),
        rgba(255, 255, 255, 1) calc(100% - var(--spinner-width) + 1px)
      );
      -webkit-animation: animation-rotate 0.6s linear infinite;
      animation: animation-rotate 0.6s linear infinite;
      overflow: hidden;
      background: var(--uigc-circular-progress-background);
    }

    @keyframes animation-rotate {
      0% {
        -webkit-transform: rotate(0deg);
        -moz-transform: rotate(0deg);
        -ms-transform: rotate(0deg);
        transform: rotate(0deg);
      }
      100% {
        -webkit-transform: rotate(360deg);
        -moz-transform: rotate(360deg);
        -ms-transform: rotate(360deg);
        transform: rotate(360deg);
      }
    }
  `;
CircularProgress = __decorateClass([
  e8("uigc-circular-progress")
], CircularProgress);

// src/component/Alert.ts
var VARIANTS = ["success" /* success */, "error" /* error */, "progress" /* progress */];
var Alert = class extends UIGCElement {
  constructor() {
    super(...arguments);
    this._variant = "" /* default */;
  }
  set variant(variant) {
    if (variant === this.variant) {
      return;
    }
    const oldValue = this.variant;
    if (VARIANTS.includes(variant)) {
      this.setAttribute("variant", variant);
      this._variant = variant;
    } else {
      this.removeAttribute("variant");
      this._variant = "" /* default */;
    }
    this.requestUpdate("variant", oldValue);
  }
  get variant() {
    return this._variant;
  }
  render() {
    return x`
      ${n9(
      this.variant != "" /* default */,
      () => x`
          ${o9(this.variant, [
        ["success" /* success */, () => x`<uigc-icon-success class="icon"></uigc-icon-success>`],
        ["error" /* error */, () => x`<uigc-icon-error class="icon"></uigc-icon-error>`],
        [
          "progress" /* progress */,
          () => x`<uigc-circular-progress size="medium" class="icon"></uigc-circular-progress>`
        ]
      ])}
        `
    )}
      <div class="message">
        <slot></slot>
      </div>
    `;
  }
};
Alert.styles = [
  UIGCElement.styles,
  i`
      :host {
        background: var(--uigc-alert-background);
        border-radius: var(--uigc-alert-border-radius);
        display: flex;
        align-items: center;
        padding: 8px 14px;
        color: rgb(255, 255, 255);
        box-sizing: border-box;
      }

      :host([variant='success']) {
        background: var(--uigc-alert__success-background);
      }

      :host([variant='error']) {
        background: var(--uigc-alert__error-background);
      }

      :host([variant='progress']) {
        background: var(--uigc-alert__progress-background);
      }

      :host([drawer]) {
        background: var(--uigc-alert__drawer-background);
      }

      .icon {
        margin-right: 12px;
        width: 30px;
      }

      uigc-circular-progress {
        width: 30px;
        height: 29px;
      }

      div.message {
        width: 100%;
        padding: 8px 0;
        display: flex;
        flex-direction: column;

        font-weight: 500;
        font-size: 12px;
        line-height: 16px;
        color: var(--hex-neutral-gray-100);
      }
    `
];
__decorateClass([
  n5({ type: String })
], Alert.prototype, "variant", 1);
Alert = __decorateClass([
  e8("uigc-alert")
], Alert);

// src/component/logo/BaseLogo.ts
var BaseLogo = class extends s4 {
};
BaseLogo.styles = [
  i`
      :host {
        display: flex;
      }

      :host([fit]) svg {
        width: 100%;
        height: 100%;
      }

      :host svg[bsx] {
        display: var(--uigc-bsx-flex-display);
      }

      :host svg[hdx] {
        display: var(--uigc-hdx-flex-display);
      }
    `
];

// src/component/logo/assets.ts
var acala = x`<svg
  width="32"
  height="32"
  viewBox="0 0 32 32"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <g clip-path="url(#clip0_11854_154518)">
    <path
      d="M16 32C24.8365 32 32 24.8365 32 16C32 7.16345 24.8365 0 16 0C7.16345 0 0 7.16345 0 16C0 24.8365 7.16345 32 16 32Z"
      fill="#E40C5B"
    ></path>
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M16.0195 19.8517C15.1852 19.8508 14.3524 19.9212 13.5298 20.0626L14.7692 17.889C15.187 17.8605 15.6049 17.8461 16.0195 17.8461C16.9943 17.8468 17.9677 17.9258 18.9302 18.0824L14.1328 9.64731L6.14206 23.6923L5 21.6846L14.1143 5.65826L14.1328 5.69121L14.1511 5.65936L25.1511 25H22.8672L20.2963 20.4802C18.9089 20.0582 17.4677 19.8461 16.0195 19.8506V19.8517ZM25.8579 23.7253L15.2087 5H17.4928L27 21.7174L25.8579 23.7253ZM15.2888 14.2396L10.9156 21.9318C12.4809 21.4527 14.3222 21.2385 16.0595 21.2385C16.2004 21.2385 16.3411 21.2385 16.4818 21.2439C17.4683 21.2676 18.4514 21.3712 19.4216 21.5538L20.8808 24.1199C19.3367 23.5424 17.705 23.2449 16.0595 23.2406C13.6621 23.232 11.3004 23.8303 9.18809 24.9814L9.22064 24.923L9.17609 25H6.89213L14.1544 12.2318L15.2888 14.2396Z"
      fill="white"
    ></path>
  </g>
  <defs>
    <clipPath id="clip0_11854_154518"><rect width="32" height="32" fill="white"></rect></clipPath>
  </defs>
</svg>`;
var aleph = x`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="48"
  height="48"
  viewBox="0 0 48 48"
  fill="none"
>
  <g clip-path="url(#clip0_1302_854)">
    <path
      d="M0 14C0 6.26801 6.26801 0 14 0H34C41.732 0 48 6.26801 48 14V34C48 41.732 41.732 48 34 48H14C6.26801 48 0 41.732 0 34V14Z"
      fill="url(#paint0_linear_1302_854)"
    />
    <path
      d="M34.8807 25.5742H40.1501C40.2733 25.5743 40.3918 25.5265 40.4805 25.4407C40.5691 25.3551 40.6209 25.2381 40.625 25.115V21.3134C40.625 21.1874 40.575 21.0665 40.4859 20.9775C40.3969 20.8884 40.276 20.8383 40.1501 20.8383H32.7654L26.9482 7.75197C26.899 7.64071 26.8188 7.54599 26.7171 7.47914C26.6156 7.41229 26.4967 7.37614 26.3752 7.375H21.6251C21.503 7.37553 21.3835 7.4114 21.2813 7.47829C21.1791 7.54517 21.0983 7.64022 21.0488 7.75197L15.2349 20.8225H7.85026C7.78653 20.8225 7.72344 20.8353 7.66475 20.8602C7.60607 20.8849 7.55298 20.9213 7.50866 20.9672C7.46434 21.013 7.42969 21.0672 7.40677 21.1268C7.38386 21.1863 7.37314 21.2498 7.37526 21.3134V25.115C7.37526 25.241 7.42531 25.3619 7.51439 25.4509C7.60347 25.5399 7.72428 25.5901 7.85026 25.5901H13.1196L7.4196 38.4009C7.39088 38.4722 7.3799 38.5494 7.3876 38.6259C7.3953 38.7024 7.42145 38.7759 7.46381 38.8401C7.50616 38.9043 7.56346 38.9573 7.63077 38.9944C7.69808 39.0315 7.7734 39.0518 7.85026 39.0534H12.0904C12.2131 39.0534 12.3332 39.0179 12.4361 38.9509C12.539 38.884 12.6202 38.7887 12.6699 38.6764L24.0001 13.2197L35.3304 38.6764C35.3801 38.7887 35.4614 38.884 35.5643 38.9509C35.6671 39.0179 35.7872 39.0534 35.9099 39.0534H40.1501C40.2292 39.0534 40.3071 39.0336 40.3766 38.9958C40.4462 38.958 40.5052 38.9033 40.5483 38.837C40.5914 38.7705 40.6173 38.6944 40.6235 38.6155C40.6296 38.5365 40.616 38.4573 40.5839 38.3849L34.8807 25.5742Z"
      fill="white"
    />
  </g>
  <defs>
    <linearGradient id="paint0_linear_1302_854" x1="48" y1="48" x2="0" y2="0" gradientUnits="userSpaceOnUse">
      <stop offset="0.203785" stop-color="#008464" />
      <stop offset="0.809888" stop-color="#69E6C8" />
    </linearGradient>
    <clipPath id="clip0_1302_854">
      <rect width="48" height="48" rx="24" fill="white" />
    </clipPath>
  </defs>
</svg>`;
var apecoin = x` <svg
  xmlns="http://www.w3.org/2000/svg"
  width="48"
  height="48"
  viewBox="0 0 48 48"
  fill="none"
>
  <g clip-path="url(#clip0_2231_3949)">
    <rect width="48" height="48" rx="24" fill="#0152F2" />
    <path
      d="M47.6192 24C47.6192 10.9432 37.0312 0.380615 23.9998 0.380615C10.9429 0.380615 0.380371 10.9432 0.380371 24C0.380371 37.0315 10.9429 47.6195 23.9998 47.6195C37.0312 47.6195 47.6192 37.0315 47.6192 24Z"
      fill="url(#paint0_radial_2231_3949)"
    />
    <path
      d="M40.0599 16.6191C39.9581 17.2045 39.8563 17.4845 39.7035 17.7899C39.5508 18.1462 39.3981 18.528 39.2454 19.3425C39.1945 19.6479 39.1436 19.9024 39.1181 20.106V20.1315C39.0672 20.4623 39.0418 20.6914 38.9145 21.0732C38.8127 21.4041 38.6346 21.9386 38.2019 22.4985C37.8456 22.9566 37.2602 23.7456 36.4711 23.8475C36.3948 23.8475 36.2675 23.8475 36.1912 23.822C33.9514 22.6767 32.0425 21.8368 31.3808 21.6586C30.6172 21.4295 30.719 19.7497 30.7954 18.2735C30.8463 17.6117 30.8717 16.9754 30.8463 16.4409C30.7445 14.5575 30.4136 12.5213 28.7846 11.5287C27.8175 10.9433 26.5449 10.7651 25.3486 10.7651C25.5777 10.6633 25.8068 10.5106 26.0867 10.3579C26.7994 9.95068 27.6648 9.44164 28.5556 9.33983C28.8356 9.31438 29.1155 9.28893 29.3955 9.23802C31.1517 9.03441 32.6788 8.85624 34.2823 9.41619C35.0204 9.67071 36.4966 10.4852 36.8784 11.2742C37.1583 11.8087 37.6165 12.2414 38.5073 13.0813C38.9909 13.514 39.2963 13.7685 39.5254 13.9721C39.8563 14.2266 39.9072 14.303 40.009 14.4811C40.3144 15.092 40.2126 15.7283 40.0599 16.6191Z"
      fill="white"
    />
    <path
      d="M31.9407 24.3307C32.0425 24.3562 32.0934 24.4834 32.017 24.5852C31.788 24.9416 31.508 25.4506 31.1771 26.036C31.0244 26.316 30.8717 26.5959 30.7444 26.7996C30.3117 27.5377 30.2863 28.174 30.2608 28.6576C30.2354 29.192 30.2099 29.4211 29.8791 29.6247C29.6245 29.8029 29.3446 29.8538 27.512 30.1338C27.1812 30.1847 27.0539 30.2356 26.9266 30.3119C26.9012 30.3374 26.8503 30.3374 26.8248 30.3628C26.723 30.4137 26.6212 30.3119 26.6212 30.2101C26.6467 29.9556 26.6467 29.6247 26.6467 29.192V29.1157C26.6467 28.7594 26.6467 28.4539 26.6212 28.2249C26.5958 27.7667 26.5958 27.5631 26.723 27.3595C26.8757 27.105 27.003 27.0286 27.1812 26.9014C27.4611 26.7232 27.8429 26.4941 28.3774 25.7306C28.6828 25.3233 28.7337 25.0943 28.7846 24.9161C28.8101 24.8398 28.8101 24.8143 29.0391 24.6361C29.2682 24.458 30.0063 23.898 30.948 24.0507C31.2535 24.1017 31.5843 24.2035 31.9407 24.3307Z"
      fill="white"
    />
    <path
      d="M24.636 32.7814C24.5851 32.8323 24.5596 32.8577 24.4833 32.8577C24.2796 32.8577 24.1523 32.8068 24.076 32.705C23.8978 32.4759 23.9232 32.0176 23.9487 31.7376L24.7379 31.5339C24.7888 31.9667 24.8142 32.5522 24.636 32.7814Z"
      fill="white"
    />
    <path
      d="M24.6875 29.9815C24.662 30.0834 24.662 30.2106 24.662 30.3634C24.662 30.4143 24.662 30.4652 24.662 30.5161C24.662 30.6434 24.662 30.8471 24.662 30.9489C24.4075 31.0253 24.2038 31.0253 23.9492 31.0253C23.9492 30.9489 23.9492 30.8216 23.9492 30.7453C23.9492 30.6943 23.9492 30.618 23.9492 30.5671C23.9492 30.4907 23.9492 30.4398 23.9492 30.3634C23.9492 30.2106 23.9492 29.9815 23.9747 29.9052C24.051 29.9052 24.1274 29.8797 24.2038 29.8542C24.3565 29.8288 24.5857 29.7779 24.7129 29.8033C24.7129 29.8542 24.7129 29.9306 24.6875 29.9815Z"
      fill="white"
    />
    <path
      d="M23.2616 32.552C23.2362 32.9593 23.1089 33.443 22.727 33.5194C22.5488 33.5448 22.4724 33.4939 22.4215 33.443C22.167 33.2139 22.1415 32.5011 22.167 31.9919C22.3452 31.9919 22.5488 31.9665 22.8034 31.9156C22.9561 31.8901 23.1089 31.8392 23.2362 31.8137C23.2616 32.0174 23.2871 32.272 23.2616 32.552Z"
      fill="white"
    />
    <path
      d="M23.0833 31.1268L22.2432 31.4323C22.2941 31.1013 22.345 30.6431 22.3705 30.3376C22.3959 30.1339 22.4468 30.0576 22.4723 30.0321C22.4723 30.0321 22.4977 30.0067 22.5232 30.0067C22.5232 30.0067 22.5232 30.0067 22.5487 30.0067H22.5741L23.1087 29.9812C23.0833 30.2358 23.0833 30.7958 23.0833 31.1268Z"
      fill="white"
    />
    <path
      d="M21.7091 30.8722C21.6582 30.9995 21.6073 31.3559 21.5819 31.6105L20.5381 31.585C20.589 31.2541 20.6908 30.9231 20.7672 30.6685C20.869 30.414 20.9454 30.2103 21.0472 30.1594C21.1491 30.1085 21.3782 30.083 21.5309 30.2103C21.7601 30.3631 21.811 30.5922 21.7091 30.8722Z"
      fill="white"
    />
    <path
      d="M21.3273 34.1048C21.251 34.2066 21.1491 34.283 21.0473 34.283C20.92 34.3085 20.8436 34.2576 20.7673 34.2066C20.4363 33.9012 20.4618 32.9083 20.4872 32.4246C20.92 32.3228 21.4037 32.2464 21.6328 32.2209C21.6328 32.6028 21.6583 33.6466 21.3273 34.1048Z"
      fill="white"
    />
    <path
      d="M19.9529 31.5341C19.902 31.6614 19.851 31.7887 19.8256 31.9159C19.6983 31.9669 19.3164 31.9159 18.9346 31.8396L19.1891 30.1848C19.6219 30.0575 20.1311 30.0321 20.2329 30.1594C20.4111 30.3376 20.0802 31.1777 19.9529 31.5341Z"
      fill="white"
    />
    <path
      d="M19.4697 34.334C19.266 34.5886 18.9605 34.7159 18.5278 34.6904C18.2223 34.6904 18.1204 34.5631 18.0695 34.4868C17.8404 34.1049 18.0695 33.2139 18.2986 32.6538L19.7243 32.7302C19.7497 32.832 19.7497 32.9593 19.7497 33.0866C19.7752 33.5194 19.7243 34.0285 19.4697 34.334Z"
      fill="white"
    />
    <path
      d="M31.2793 22.2946C29.9812 21.9382 30.1085 20.0548 30.2103 18.2223C30.2357 17.586 30.2867 16.9751 30.2612 16.4661C30.1594 14.7608 29.8794 12.9028 28.505 12.0629C27.0288 11.1721 24.6109 11.3757 23.1346 11.5538C22.6002 11.7066 22.0911 11.8338 21.6839 11.8084C20.8185 11.7575 20.1313 11.4011 19.5205 11.0703C19.0623 10.8157 18.6551 10.5867 18.2479 10.5867C18.2224 10.5867 18.197 10.5867 18.197 10.5867C17.0516 10.663 16.5171 10.943 16.0335 11.3757C15.9063 11.4775 15.7536 11.7829 15.27 13.1828C15.0155 13.8954 14.99 14.2772 14.9391 14.6335C14.8882 14.9644 14.8628 15.3207 14.6846 15.8552C14.5573 16.2116 14.4555 16.517 14.3792 16.8224C14.1501 17.6114 13.9465 18.2477 13.3865 19.0113C13.3102 19.0876 13.2338 19.2403 13.132 19.3676C13.0048 19.5712 12.8521 19.8257 12.623 20.1057C12.4703 20.3093 12.1394 21.0729 12.1648 21.302C12.1903 21.6837 12.3176 21.9128 12.4448 22.1673C12.5721 22.4218 12.7502 22.7273 12.7757 23.1599V23.2363C12.8266 23.8981 12.7248 24.2289 11.4776 25.3488C10.6886 26.0615 10.1032 26.7487 9.72146 27.2577C9.69601 27.3086 9.72146 27.3595 9.79781 27.3595C9.82327 27.3595 9.82327 27.3595 9.82327 27.3595C9.84872 27.3595 9.87417 27.3595 9.89962 27.3595C9.92507 27.3595 9.95053 27.3595 9.97598 27.3595C10.0014 27.3595 10.0269 27.3595 10.0523 27.3595C10.3578 27.385 10.6632 27.5122 10.8668 27.7413C10.8922 27.7922 10.9686 27.7922 11.0195 27.7668C11.2231 27.6904 11.4522 27.6904 11.6558 27.7158C11.9103 27.7413 12.1903 27.8177 12.3685 27.9958C12.4194 28.0467 12.4957 28.0722 12.5721 28.0467C12.7757 27.9958 13.0048 27.9958 13.2084 28.0722C13.3611 28.1231 13.5138 28.2249 13.6156 28.3521C13.692 28.4285 13.8192 28.454 13.921 28.4031C13.9719 28.3776 14.0483 28.3267 14.1247 28.3012C14.4046 28.1994 14.71 28.2503 14.9646 28.3521C15.0918 28.4031 15.2191 28.4285 15.3463 28.5303C15.55 28.683 15.7027 28.8866 15.779 29.1157C15.8299 29.243 16.0081 29.2939 16.1099 29.1921C16.3135 29.0394 16.4662 29.0139 16.6189 29.0648C16.6953 29.0903 16.7462 29.1412 16.7971 29.2175C16.8735 29.3193 17.0007 29.4211 17.1025 29.3702C17.5352 29.243 18.0443 29.3193 18.426 29.5229C18.5533 29.5993 18.706 29.7011 18.7824 29.8538V29.7775C18.7824 29.752 18.8078 29.7266 18.8333 29.7011L18.9096 29.6756C19.1132 29.5993 20.1822 29.2939 20.5895 29.7266C20.6149 29.752 20.6404 29.752 20.6658 29.7266C20.7167 29.6757 20.7676 29.6247 20.7931 29.6247C21.073 29.472 21.5312 29.4466 21.8366 29.7266C21.8875 29.7775 21.9893 29.752 22.0402 29.7011C22.0657 29.6502 22.0911 29.6247 22.142 29.5993C22.2438 29.4975 22.3965 29.472 22.5493 29.472L23.1346 29.4466C23.2874 29.4466 23.7455 29.3957 23.8728 29.3702H23.8982C23.9491 29.3702 24.0255 29.3448 24.1018 29.3193C24.3818 29.2684 24.7127 29.1921 24.9672 29.3193C25.2217 29.4466 25.1963 29.7266 25.1708 29.9811C25.1708 30.0829 25.1454 30.1847 25.1454 30.2865C25.1454 30.3374 25.1454 30.3883 25.1454 30.4392C25.1454 30.6683 25.1454 30.8719 25.1199 31.0246L25.1454 31.1519C25.1454 31.1519 25.1454 31.1519 25.1454 31.1773C25.1708 31.2791 25.2981 31.3555 25.3744 31.2791C25.578 31.1519 25.7817 30.9992 25.858 30.8973V30.8719C25.858 30.8464 25.8835 30.7955 25.9089 30.6937C25.9344 30.4647 25.9853 30.032 25.9853 29.1412C25.9853 29.0903 25.9853 29.0648 25.9853 29.0394C25.9853 28.7085 25.9853 28.4285 25.9598 28.1994C25.9344 27.7158 25.9089 27.3341 26.1634 26.9523C26.3925 26.5705 26.6216 26.4433 26.8506 26.2905C27.1052 26.1378 27.3851 25.9597 27.8687 25.2979C28.0978 24.967 28.1232 24.8398 28.1487 24.738C28.1996 24.4834 28.2759 24.3307 28.6577 24.0762C28.9632 23.8471 29.854 23.1599 31.0757 23.3636C31.4829 23.4399 32.1192 23.6435 32.7809 23.8981C32.8064 23.8981 32.8319 23.9235 32.8573 23.9235H32.8828C33.4681 24.1526 34.0026 24.4071 34.3844 24.6107C34.4608 24.6616 34.5626 24.6362 34.6389 24.5598C34.7662 24.4071 34.8935 24.3307 35.0207 24.2289C35.0716 24.2035 35.1225 24.178 35.148 24.1526C35.1734 24.1526 35.1734 24.1271 35.1734 24.1271C35.2752 24.0508 35.2752 23.8471 35.148 23.7962C33.4427 22.9563 31.8138 22.4473 31.2793 22.2946ZM19.0114 22.6764C18.6042 24.4071 15.9063 26.3414 14.6846 26.3414H14.6591C14.6337 26.3414 14.6082 26.3414 14.6082 26.3414C14.5828 26.3414 14.5573 26.3414 14.5319 26.316C14.5064 26.316 14.5064 26.316 14.481 26.316C14.2519 26.2396 13.9465 26.0869 13.7174 25.8579C13.5647 25.7051 13.4374 25.5015 13.3865 25.3234C13.3865 25.2979 13.3611 25.247 13.3611 25.2216C13.2847 24.9161 13.2084 24.5598 13.4629 23.949C13.4884 23.8726 13.5393 23.7962 13.5647 23.7199C13.5647 23.6944 13.5902 23.669 13.5902 23.6435C13.6156 23.5672 13.6411 23.5163 13.6665 23.4654C13.692 23.3636 13.7429 23.2872 13.7683 23.2363C13.7683 23.2108 13.7938 23.1854 13.7938 23.1599C13.8701 22.9563 13.8701 22.88 13.8956 22.8036C13.8956 22.7527 13.921 22.6509 13.9465 22.5491C14.0228 22.2182 14.0737 21.9383 14.0992 21.7092C14.1501 21.2765 14.2265 20.8947 14.4555 20.5384C14.5064 20.4875 14.5319 20.4366 14.5828 20.3857C14.6082 20.3602 14.6082 20.3602 14.6337 20.3348C14.6591 20.3093 14.6591 20.3093 14.6846 20.2839C14.7355 20.233 14.8119 20.2075 14.8628 20.1821C14.8882 20.1821 14.9137 20.1566 14.9391 20.1566C14.99 20.1312 15.0409 20.1312 15.0918 20.1057C15.3209 20.0548 15.5754 20.0548 15.8808 20.0803C16.2117 20.1057 16.5171 20.1566 16.7717 20.233C17.0007 20.2839 17.2043 20.3602 17.357 20.4366C17.3825 20.4366 17.3825 20.462 17.408 20.462C17.4334 20.4875 17.4589 20.4875 17.5098 20.5129C17.5607 20.5384 17.5861 20.5384 17.637 20.5638C17.6879 20.5893 17.7388 20.6147 17.7897 20.6402L17.8406 20.6657C18.0188 20.742 18.197 20.8438 18.3242 20.9456C18.4006 20.9965 18.4515 21.0474 18.5024 21.0983C18.5278 21.1238 18.5533 21.1238 18.5533 21.1492C18.5787 21.1747 18.5787 21.1747 18.6042 21.2001C19.1387 21.6583 19.1132 22.2946 19.0114 22.6764ZM20.284 16.0843L20.2331 16.3897C20.1059 17.1024 19.8259 18.0696 18.8078 18.3241C17.8152 18.5531 17.5861 18.604 16.8989 18.6549C16.8735 18.6549 16.8735 18.6549 16.848 18.6549C16.339 18.6549 15.3463 18.3241 15.1682 17.5351C15.0664 17.026 15.2954 16.6442 15.6518 16.0334C15.7027 15.9316 15.779 15.8298 15.8554 15.7025C16.3644 14.8626 16.5426 14.2518 16.6953 13.7682C16.848 13.2846 16.9753 12.9028 17.3061 12.5719C17.3825 12.4956 17.4589 12.4192 17.5607 12.3683C17.6116 12.3174 17.6879 12.292 17.7643 12.241C17.8661 12.1901 17.9679 12.1647 18.0697 12.1138C18.2988 12.0374 18.5533 12.012 18.7824 12.012C19.2659 12.012 19.7495 12.1392 20.0804 12.4192C20.2331 12.5465 20.4622 12.7755 20.5895 13.5136C20.6404 13.8954 20.5385 14.5826 20.284 16.0843ZM27.5887 18.1205C27.2324 18.7313 27.0543 19.0622 26.7488 19.3167C26.138 19.8257 25.4508 19.9275 24.8654 19.9275C24.4581 19.9275 24.1018 19.8512 23.8728 19.8257C23.2619 19.7239 22.1675 19.5203 21.7857 18.6295C21.7093 18.4513 21.7093 18.3495 21.7093 18.1968C21.7093 18.0696 21.7093 17.815 21.633 17.2805V17.2551C21.6075 17.0006 21.5821 16.7206 21.633 16.3643V16.3134C21.8366 15.2444 21.913 15.0917 21.9384 14.9899C22.0402 14.7862 22.2947 14.6844 22.5238 14.8117C22.7274 14.9135 22.8038 15.168 22.7274 15.3716C22.702 15.4225 22.6511 15.6516 22.4729 16.4915V16.5424C22.422 16.7715 22.4474 16.9497 22.4729 17.1787V17.2042C22.5493 17.815 22.5493 18.0696 22.5493 18.2223C22.5493 18.2477 22.5493 18.2732 22.5493 18.2986V18.3241C22.6256 18.5022 22.7783 18.604 22.9565 18.7058C23.0837 18.7568 23.211 18.6549 23.1856 18.5277C23.0074 17.586 23.0074 16.4915 23.3637 15.8043C23.491 15.5753 23.6946 15.2189 23.8982 14.8626C23.9237 14.8372 23.9491 14.7862 23.9491 14.7608C23.9746 14.7353 23.9746 14.7099 24 14.6844C24.1018 14.5317 24.1782 14.4045 24.2545 14.2772C24.2545 14.2518 24.28 14.2518 24.28 14.2263L24.3054 14.2009C24.3309 14.1754 24.3309 14.1499 24.3563 14.1245C24.3563 14.1245 24.3563 14.099 24.3818 14.099L24.4072 14.0736C24.4072 14.0481 24.4327 14.0481 24.4327 14.0227C24.5091 13.9209 24.5854 13.8191 24.6363 13.7173C24.7381 13.59 24.6109 13.4373 24.4836 13.4882C24.1273 13.6409 23.8982 13.8191 23.8473 13.8445C23.6691 13.9972 23.3892 13.9718 23.2365 13.7682C23.0837 13.59 23.1092 13.31 23.3128 13.1573C23.5419 12.9792 24.7127 12.1392 26.1125 12.521C27.1306 12.801 27.6396 13.59 27.8433 13.87C27.996 14.099 28.505 14.8117 28.4796 15.8298C28.4796 16.5679 28.1741 17.1278 27.5887 18.1205Z"
      fill="white"
    />
    <path
      d="M18.4766 12.9028C18.4003 13.081 18.3239 13.2846 18.2221 13.5137C18.0185 14.0482 17.764 14.659 17.6367 14.8881C17.4331 15.2699 17.2804 15.5244 17.1531 15.7025C17.0004 15.9316 16.8986 16.1098 16.7968 16.3643C16.6441 16.797 16.6186 17.2806 16.7204 17.8151C16.4405 17.7896 16.0078 17.6114 15.9569 17.3569C15.9314 17.1788 16.0332 17.0006 16.3386 16.4661C16.3896 16.3643 16.4659 16.237 16.5423 16.1352C17.0768 15.219 17.3058 14.5318 17.4585 14.0227C17.6367 13.4882 17.7131 13.2592 17.993 13.0555C18.1712 12.9792 18.3239 12.9283 18.4766 12.9028Z"
      fill="white"
    />
    <path
      d="M17.9424 32.1452C17.6369 32.7562 17.2805 33.3162 17.0514 33.5963C16.8477 33.0871 16.5168 31.8906 16.6186 30.9487C16.6186 30.9232 16.6186 30.8978 16.6186 30.8723C16.6441 30.5668 16.7204 30.3122 16.8732 30.0831C16.975 29.9304 17.2296 29.854 17.5096 29.854C17.7133 29.854 17.9424 29.9049 18.1461 30.0067C18.2479 30.0577 18.4007 30.185 18.4007 30.5159C18.4516 30.9741 18.2224 31.5851 17.9424 32.1452Z"
      fill="white"
    />
    <path
      d="M34.2312 25.3489C34.2567 25.3744 34.2567 25.3998 34.2567 25.4253C34.1803 25.6035 34.053 25.7307 33.9258 25.8834C33.7731 26.0616 33.5949 26.2652 33.4422 26.5961C33.2131 27.0542 33.1368 27.4615 33.1113 28.5304C33.0604 29.7776 33.1113 30.4648 33.1622 30.9738C33.1877 31.4574 33.2131 31.7628 33.1368 32.2464C32.9586 33.2136 32.5514 33.8499 32.0169 34.6644C31.3551 35.6824 30.6934 36.726 29.5735 37.0568C29.4717 37.0823 29.4717 37.0823 29.1663 37.0823C28.9117 37.0823 28.4791 37.0823 27.69 37.1078C26.2138 37.1587 25.4757 37.1841 24.8649 37.3114C24.2031 37.4386 23.8723 37.5913 23.5159 37.7186C23.2105 37.8459 22.9305 37.9477 22.396 38.0749C22.0652 38.1513 21.5816 38.2022 19.9272 38.2276C18.1965 38.2276 17.1529 38.2276 15.804 38.0749C13.9205 37.8713 12.9788 37.7441 12.3425 37.4132C10.8663 36.6242 10.23 35.1989 9.21191 32.8573C9.21191 32.8318 9.23737 32.8064 9.26282 32.8064C9.31372 32.8318 9.36463 32.8573 9.41553 32.8827C9.46643 32.9082 9.51734 32.9082 9.54279 32.9082C9.6446 32.9336 9.74641 32.9336 9.84821 32.9082C9.87367 32.9082 9.87367 32.9082 9.89912 32.8827C9.92457 32.8827 9.95002 32.8827 9.95002 32.9082C10.0264 33.0863 10.1282 33.2391 10.3063 33.3409C10.4845 33.4427 10.6881 33.4427 10.8663 33.4427C11.0699 33.4427 11.2735 33.4172 11.4771 33.3918C11.5789 33.3918 11.6808 33.4427 11.7317 33.519C11.9098 33.9772 12.1389 34.2826 12.4952 34.3335C12.5207 34.3335 12.5461 34.3335 12.5716 34.3335C12.6479 34.3335 12.7752 34.308 12.9279 34.2062C13.0552 34.1044 13.2588 34.1808 13.3606 34.308C13.4369 34.4353 13.5387 34.5116 13.6406 34.588C13.9969 34.9443 14.8623 35.1225 15.5749 35.1225C15.9567 35.1225 16.313 35.0716 16.5166 34.9698C16.8221 34.8171 16.8221 34.6135 16.7966 34.5117C16.7711 34.3589 16.7457 34.1808 16.7202 34.0281C16.7202 34.0026 16.7457 34.0026 16.7457 34.0281C16.7966 34.1299 16.8475 34.2317 16.9748 34.2571C17.0002 34.2571 17.0002 34.2571 17.0257 34.2571C17.2293 34.2571 17.5347 34.3335 17.5856 34.5117C17.6111 34.6135 17.662 34.6898 17.7129 34.7916C17.8401 34.9698 18.0692 35.1989 18.5528 35.2243H18.5782C19.1382 35.2243 19.5709 35.0461 19.8508 34.6898C19.8763 34.6644 19.8763 34.6389 19.9017 34.6135C20.0035 34.4607 20.309 34.4607 20.4362 34.588C20.5889 34.7153 20.7671 34.7916 20.9707 34.7916C20.9962 34.7916 21.0471 34.7916 21.0725 34.7916C21.3271 34.7662 21.5307 34.6389 21.7088 34.4098C21.8106 34.2571 21.887 34.079 21.9379 33.8754C21.9634 33.8244 22.0397 33.799 22.0906 33.8499C22.1924 33.9517 22.3706 34.0535 22.6251 34.0535C22.676 34.0535 22.7524 34.0535 22.8287 34.0281C23.3123 33.9263 23.5668 33.519 23.6686 33.0863C23.6686 33.0609 23.6941 33.0609 23.6941 33.0863C23.8213 33.2391 24.0504 33.4172 24.4322 33.4172C24.4576 33.4172 24.4831 33.4172 24.4831 33.4172C24.6867 33.4172 24.8649 33.3154 24.9921 33.1627C25.1448 32.9591 25.1958 32.6537 25.2212 32.3737C25.2212 32.2973 25.2721 32.221 25.3739 32.1701C25.7811 31.9919 26.2902 31.6101 26.4429 31.3556C26.4429 31.3556 26.4429 31.3302 26.4684 31.3302C26.4938 31.2538 26.5702 31.2029 26.6211 31.2029C26.9519 31.152 27.0792 31.0756 27.2065 31.0247C27.3083 30.9738 27.3846 30.9484 27.6391 30.8975C29.4971 30.6175 29.8535 30.5411 30.2607 30.2866C30.8715 29.8794 30.897 29.3194 30.9224 28.785C30.9479 28.3268 30.9733 27.8178 31.3297 27.2069C31.4569 26.9779 31.6097 26.7233 31.7624 26.4179C32.0423 25.9089 32.4241 25.1962 32.7041 24.8144C32.755 24.7381 32.8568 24.7126 32.9332 24.7635C33.5695 24.9926 34.1294 25.2471 34.2312 25.3489Z"
      fill="white"
    />
    <path
      d="M16.1604 30.8975C16.0841 31.5338 16.0332 32.3991 16.135 33.519C16.1604 33.8245 16.2113 34.1553 16.2622 34.4862C16.1859 34.5371 15.9059 34.6135 15.4478 34.588C14.786 34.5626 14.1243 34.4099 13.9207 34.1808L13.8952 34.1553C13.7425 34.0281 13.6152 33.9263 13.6152 33.6972C13.6152 33.6208 13.6407 33.5445 13.717 33.4172C13.7679 33.3663 13.8189 33.29 13.8698 33.1882C13.9716 33.0354 14.1243 32.8573 14.277 32.6028C14.7097 31.8901 14.8624 31.661 15.066 31.3811C15.0914 31.3556 15.0914 31.3302 15.1169 31.3047C15.2442 31.152 15.3714 30.9484 15.6005 30.6175C15.7532 30.3884 15.8805 30.1848 16.0077 30.0321C16.1859 29.7776 16.3131 29.6503 16.3895 29.574C16.3895 29.6758 16.364 29.8285 16.3386 29.9812C16.2368 30.2866 16.1859 30.5666 16.1604 30.8975Z"
      fill="white"
    />
    <path
      d="M15.8294 20.8693C15.8294 20.8947 15.8294 20.8947 15.8294 20.8693C15.7276 20.9965 15.6258 21.1492 15.4985 21.4038C15.1676 22.1164 15.1676 22.5236 15.1676 22.8545C15.1676 23.0327 15.1676 23.1599 15.1167 23.3127C15.0913 23.4145 15.0404 23.5417 14.964 23.669C14.7859 24.1017 14.5313 24.6616 14.6331 25.4252C14.4804 25.3488 14.2514 25.1706 14.2005 25.0943C14.2005 25.0434 14.175 25.0179 14.175 24.967C14.1241 24.738 14.0987 24.5852 14.2259 24.2289C14.6331 23.3127 14.684 23.0836 14.7095 22.8291C14.7095 22.7782 14.735 22.7273 14.735 22.6509C14.8113 22.2946 14.8622 21.9891 14.8877 21.7346C14.9386 21.3529 14.9895 21.0983 15.1167 20.9202C15.1676 20.8438 15.2949 20.8184 15.4731 20.8184C15.5494 20.8184 15.6258 20.8184 15.7276 20.8438H15.753C15.8294 20.8693 15.8294 20.8693 15.8294 20.8693Z"
      fill="white"
    />
    <path
      d="M15.3215 29.9559C15.2961 29.7268 15.2706 29.5231 15.1688 29.294C15.1688 29.294 15.1433 29.2431 15.1433 29.2176C15.1179 29.1921 15.1179 29.1667 15.0924 29.1412L15.067 29.1158C15.0415 29.0903 15.0415 29.0903 15.016 29.0903L14.9906 29.0649C14.9651 29.0649 14.9651 29.0394 14.9397 29.0394H14.9142C14.7869 28.9885 14.6596 28.9376 14.5069 28.9121C14.4814 28.9121 14.456 28.9121 14.456 28.9121C14.4305 28.9121 14.4305 28.9121 14.4051 28.9121H14.3796C14.3541 28.9121 14.3287 28.9376 14.2778 28.9376C14.2523 28.9376 14.2523 28.963 14.2269 28.963L14.2014 28.9885C14.1759 29.0139 14.1759 29.0139 14.1505 29.0394L14.125 29.0649V29.0903C14.0741 29.1667 14.0232 29.2431 13.9723 29.3194C13.845 29.4976 13.7177 29.7013 13.5904 29.8795C13.4631 30.0577 13.3613 30.2105 13.234 30.3887C13.1576 30.4905 13.1067 30.5669 13.0303 30.6687C13.0303 30.6941 13.0049 30.6941 13.0049 30.7196C13.0813 30.7451 13.1576 30.7451 13.234 30.7705C13.4122 30.796 13.5904 30.8214 13.7432 30.8469C14.0996 30.8978 14.4814 30.9233 14.8378 30.8978C14.8633 30.8978 14.8633 30.8978 14.8887 30.8978C14.9651 30.7705 15.0924 30.6178 15.2197 30.4141C15.2961 30.3123 15.3724 30.2105 15.4234 30.1086C15.347 30.0832 15.3215 30.0068 15.3215 29.9559Z"
      fill="white"
    />
    <path
      d="M14.0226 31.4574C13.9971 31.7374 13.6917 32.4503 13.208 33.1376C12.8006 33.6977 12.5461 33.8504 12.4951 33.8504C12.2915 33.825 12.1133 33.3413 11.9605 32.8576C11.9096 32.6539 11.8332 32.4757 11.8078 32.2975C11.706 31.9411 11.6805 31.432 11.706 31.1265C12.1133 31.3556 12.8261 31.4065 13.8444 31.4065C13.8953 31.432 13.9717 31.432 14.0226 31.4574Z"
      fill="white"
    />
    <path
      d="M13.3103 29.1667C13.1321 29.4467 12.9539 29.7013 12.7757 29.9559C12.6738 30.0832 12.5975 30.2105 12.4956 30.3377C12.4447 30.4141 12.3683 30.4905 12.3174 30.5669C12.1647 30.5414 12.0374 30.4905 11.8846 30.465C11.7574 30.4396 11.6555 30.3887 11.5282 30.3377C11.5028 30.3377 11.4773 30.3123 11.4519 30.3123C11.4264 30.2868 11.4009 30.2359 11.3755 30.2105C11.4264 30.1341 11.4519 30.0323 11.5028 29.9559C11.5791 29.8031 11.6555 29.6504 11.7574 29.4976C11.9101 29.2431 12.0883 28.963 12.3683 28.7848C12.3938 28.7848 12.3938 28.7594 12.4193 28.7594C12.5211 28.7085 12.6229 28.6575 12.7502 28.6321C12.7757 28.6321 12.852 28.6321 12.9029 28.6321H12.9284C12.9284 28.6321 12.9284 28.6321 12.9539 28.6321C12.9793 28.6321 13.0048 28.6575 13.0557 28.6575C13.0557 28.6575 13.0812 28.6575 13.0812 28.683C13.1066 28.7085 13.1321 28.7085 13.1575 28.7339C13.1066 28.7085 13.2084 28.8103 13.2084 28.7848C13.2594 28.9376 13.2848 29.0139 13.3103 29.1667Z"
      fill="white"
    />
    <path
      d="M11.9358 28.4283C11.6049 28.6829 11.3758 29.0393 11.1976 29.4211C11.0957 29.6248 10.9939 29.8285 10.8921 30.0321C10.8921 30.0576 10.8666 30.083 10.8666 30.083C10.7648 30.0576 10.663 30.0321 10.5866 30.0067C10.4848 29.9812 10.3829 29.9303 10.2811 29.9048C10.2302 29.8794 10.2047 29.8539 10.1538 29.8285C10.2556 29.6503 10.3575 29.4721 10.4848 29.2939C10.6375 29.0647 10.8157 28.8102 10.9939 28.6065C11.0703 28.5301 11.1467 28.4283 11.223 28.3774C11.3249 28.3265 11.4267 28.3265 11.554 28.3519C11.6813 28.3519 11.8086 28.3519 11.9104 28.4028C11.8849 28.4028 11.9104 28.4283 11.9358 28.4283Z"
      fill="white"
    />
    <path
      d="M11.427 32.7558C11.4016 32.7812 11.4016 32.7812 11.3761 32.8067H11.3506C11.2743 32.8067 11.1979 32.8322 11.1215 32.8322C10.9688 32.8322 10.816 32.8576 10.6633 32.8322C10.5869 32.8322 10.5105 32.8067 10.4596 32.7558C10.4087 32.6794 10.3833 32.5267 10.3578 32.4248C10.256 31.8648 10.256 31.3047 10.3069 30.7446C10.5869 30.8465 10.8924 30.9228 11.1979 30.9737C11.1215 31.4829 11.2488 32.2212 11.2997 32.4248C11.3761 32.5267 11.4016 32.654 11.427 32.7558Z"
      fill="white"
    />
    <path
      d="M10.5109 28.2508C10.2563 28.5562 10.0272 28.8872 9.82357 29.2436C9.74719 29.3709 9.64536 29.5236 9.56899 29.6764C9.46716 29.6509 9.36533 29.6 9.28896 29.5491C9.21258 29.4982 9.13621 29.4473 9.0853 29.3963C9.05984 29.3709 9.00892 29.3454 8.98347 29.32C8.98347 29.32 8.95801 29.32 8.95801 29.2945C8.98347 29.2181 9.03438 29.1672 9.03438 29.1163C9.0853 28.989 9.13621 28.8872 9.21258 28.7854C9.33987 28.5817 9.46716 28.378 9.61991 28.1744C9.67082 28.098 9.72174 28.0216 9.82357 27.9962C9.89994 27.9707 10.0018 27.9962 10.0781 27.9962C10.2309 28.0216 10.3836 28.1235 10.5109 28.2508Z"
      fill="white"
    />
    <path
      d="M8.55075 29.5994C8.55075 29.574 8.57621 29.574 8.55075 29.5994C8.65258 29.7012 8.72895 29.7776 8.83078 29.854C8.8817 29.8794 8.90716 29.9304 8.95807 29.9558C8.95807 29.9558 8.95807 29.9558 8.95807 29.9813C8.85624 30.4141 8.77987 30.8723 8.77987 31.3305C8.77987 31.356 8.75441 31.356 8.75441 31.3305C8.62712 30.7959 8.47437 29.9304 8.55075 29.5994Z"
      fill="white"
    />
    <path
      d="M9.79723 30.5411C9.74631 30.9229 9.72085 31.3048 9.74631 31.6867C9.74631 31.8903 9.77177 32.094 9.79723 32.3231C9.74631 32.3231 9.6954 32.3231 9.64448 32.3231H9.61902H9.59357C9.54265 32.2976 9.54265 32.2976 9.49173 32.2722C9.44082 32.2467 9.3899 32.1704 9.33899 32.094C9.23716 31.9158 9.2117 31.7121 9.2117 31.5085C9.18624 31.1266 9.23716 30.7193 9.31353 30.3374C9.36445 30.3629 9.44082 30.3883 9.51719 30.4138C9.61902 30.4647 9.6954 30.5156 9.79723 30.5411Z"
      fill="white"
    />
    <g opacity="0.8">
      <path
        opacity="0.8"
        d="M19.8254 50.3936C18.0947 50.3936 16.4658 50.2918 15.0914 50.19L14.7096 50.1645L14.3278 50.1136C14.1497 50.0882 13.946 50.0627 13.717 50.0373C12.3935 49.8846 9.92463 49.63 7.20127 48.3574L6.76858 48.1538L6.3868 47.9248C1.1437 44.9723 -0.790652 40.5691 -1.85964 38.2021C-1.93599 38.0494 -2.01235 37.8712 -2.0887 37.6931C-2.62319 36.5986 -2.95407 35.6315 -3.23404 34.7152L-3.28495 34.5116L-3.33585 34.308C-4.09941 31.6101 -4.27757 29.2939 -3.9467 26.9778C-3.59037 24.6617 -2.75045 22.5746 -1.24879 20.3603L-0.485229 19.1131C-0.332517 18.8586 -0.230709 18.5786 -0.154353 18.2987C0.431042 15.3971 1.75454 13.3355 2.4163 12.3429C2.59446 11.1467 2.89988 9.97588 3.30712 8.83054L3.35802 8.65237L3.43437 8.47421C3.43437 8.44876 3.45983 8.39785 3.48528 8.3215C3.7907 7.43068 4.47791 5.36907 6.23409 3.1802L6.89584 2.41664L7.58305 1.80579C9.31378 0.227772 11.4008 -0.943019 13.6406 -1.60477C14.8878 -1.98655 16.1858 -2.21562 17.5093 -2.29197H17.6366H17.8147C18.0438 -2.29197 18.2729 -2.31743 18.4765 -2.31743C19.291 -2.31743 20.1054 -2.24107 20.9199 -2.11381C21.4289 -2.03745 21.938 -2.08836 22.4215 -2.29197C23.8214 -2.87737 25.2722 -3.25915 26.7738 -3.46276C26.9011 -3.48822 27.0029 -3.48822 27.1047 -3.51367C27.3338 -3.53912 27.7156 -3.59002 28.1737 -3.64093C28.9627 -3.71728 30.1844 -3.81909 31.4824 -3.81909C34.0531 -3.81909 36.2674 -3.48822 38.2527 -2.80101L38.4308 -2.75011L38.5835 -2.69921C42.9613 -1.04483 45.1756 1.2713 46.7791 3.28201L46.8554 3.38382L47.0845 3.58743C48.5353 4.70732 49.757 6.10718 50.7241 7.65975L51.0296 8.14333L51.2841 8.65237C53.422 13.0047 52.7348 17.0515 52.4803 18.5532L52.4549 18.6295C52.2767 19.7494 51.9713 20.8439 51.5895 21.9128C51.4368 22.9309 51.2077 23.949 50.8768 24.9162C50.3169 26.6469 49.477 28.3013 48.408 29.7775C47.7972 30.6429 47.0845 31.4828 46.3209 32.2209C46.041 32.4754 45.8628 32.8317 45.8119 33.2135C45.7865 33.4426 45.7356 33.6717 45.7101 33.9007C45.0738 37.2604 43.623 39.602 43.0122 40.5437L41.2051 43.1398C39.0162 45.8632 36.4201 47.6448 33.2895 48.612L32.526 48.841L31.7115 48.9937C30.7698 49.1719 29.8281 49.2483 28.8609 49.2483C28.7336 49.2483 28.6064 49.2483 28.4537 49.2483H28.4028H28.25H28.0719C27.7156 49.2483 27.3592 49.3246 27.0029 49.4264C24.9158 50.0882 22.6252 50.3936 19.8254 50.3936Z"
        stroke="url(#paint1_linear_2231_3949)"
        stroke-width="0.26862"
        stroke-miterlimit="10"
      />
      <path
        opacity="0.8"
        d="M19.8254 48.5867C18.171 48.5867 16.5675 48.4849 15.244 48.3831L14.9386 48.3577L14.6332 48.3068C14.4295 48.2813 14.2005 48.2559 13.9714 48.2304C12.6734 48.1031 10.5354 47.8486 8.1429 46.7287L7.78658 46.5506L7.4557 46.3724C2.79799 43.8018 1.09271 39.9585 0.0746297 37.6678C-0.00172619 37.5151 -0.078082 37.3115 -0.17989 37.1333C-0.663477 36.1662 -0.968901 35.2499 -1.22342 34.4354L-1.27432 34.2573L-1.32523 34.1046C-1.98698 31.6866 -2.16514 29.6505 -1.85972 27.6398C-1.5543 25.6545 -0.790737 23.7965 0.532765 21.8622L1.52539 20.2587C1.70356 19.9787 1.83082 19.6478 1.88172 19.317C2.36531 16.5682 3.66336 14.6338 4.24875 13.743L4.32511 13.6412L4.35056 13.5903C4.35056 13.5648 4.37601 13.5394 4.37601 13.5139C4.40147 13.3867 4.45237 13.2848 4.47782 13.183C4.63053 12.0632 4.9105 10.9433 5.29228 9.87428L5.34319 9.72157L5.39409 9.56886C5.41954 9.51796 5.41954 9.46705 5.47045 9.31434C5.75042 8.47443 6.33582 6.71824 7.86293 4.83479L8.42288 4.17304L8.98282 3.664C10.4845 2.2896 12.2916 1.27152 14.2259 0.711573C15.3458 0.380698 16.4657 0.177082 17.6365 0.126178H17.7383H17.891C18.0946 0.126178 18.2728 0.100726 18.451 0.100726C19.2909 0.100726 20.1053 -0.128342 20.9198 0.0243702C21.5561 0.15163 22.1924 0.0752741 22.7778 -0.179246C23.8722 -0.662833 25.3484 -0.840997 27.0283 -1.07006C27.1555 -1.09552 27.2573 -1.09552 27.3337 -1.12097C27.5628 -1.14642 27.9191 -1.19732 28.3263 -1.22278C29.0644 -1.29913 30.2098 -1.37549 31.4569 -1.37549C33.7985 -1.37549 35.7837 -1.07006 37.5399 -0.484669L37.6926 -0.433765L37.8199 -0.382861C41.6886 1.09335 43.5975 3.0277 45.0992 4.9366C45.1755 5.03841 45.2773 5.14022 45.3028 5.19112L45.3282 5.21657L45.6082 5.47109L45.6337 5.522C46.9317 6.51462 48.0261 7.73632 48.8661 9.11072L49.1206 9.51796L49.3242 9.95064C51.1567 13.6921 50.5968 17.1281 50.3423 18.5789L50.3168 18.6552C50.1387 19.7242 49.8587 20.7423 49.4769 21.7604C49.3496 22.7275 49.1206 23.6947 48.8152 24.611C48.3061 26.1381 47.568 27.5889 46.6263 28.9124C45.99 29.8286 45.2264 30.6685 44.412 31.4067C44.0302 31.763 43.7757 32.2211 43.7248 32.7556C43.6739 33.1374 43.623 33.4937 43.5721 33.8755C43.0121 36.8534 41.7395 38.8895 41.1287 39.8058L39.6524 41.9438C37.6926 44.4635 35.3765 46.0924 32.5768 46.9578L31.9405 47.1614L31.2533 47.2887C30.4388 47.4414 29.5989 47.5178 28.7845 47.4923C28.6572 47.4923 28.5299 47.4923 28.4027 47.4923H28.3772H28.3009C28.3009 47.4923 28.2754 47.4923 28.2245 47.4923H28.0718H27.9191H27.6391C27.2573 47.5178 26.8756 47.5687 26.4938 47.6959C24.6358 48.3068 22.4724 48.5867 19.8254 48.5867Z"
        stroke="url(#paint2_linear_2231_3949)"
        stroke-width="0.26862"
        stroke-miterlimit="10"
      />
      <path
        opacity="0.8"
        d="M19.8254 46.4743C18.2474 46.4743 16.6948 46.3724 15.3967 46.2706L15.1422 46.2452L14.8877 46.2197C14.6586 46.1943 14.4041 46.1688 14.1496 46.1434C12.9279 46.0161 11.0699 45.8125 8.98284 44.8199L8.70287 44.6926L8.44835 44.5399C4.45239 42.3001 2.97618 38.9914 2.009 36.8025C1.93265 36.6243 1.83084 36.3953 1.75448 36.2171C1.3218 35.3517 1.04183 34.5373 0.812761 33.7737L0.761857 33.6465L0.736405 33.5192C0.15101 31.4321 -0.00170182 29.6505 0.252818 27.9707C0.507338 26.2654 1.19454 24.6619 2.36533 22.9566L2.51804 22.753L2.67076 22.5494C2.77256 22.4221 2.84892 22.2949 2.95073 22.1931L3.53612 21.0986C3.73974 20.7423 3.867 20.3605 3.9179 19.9533C4.29968 17.5099 5.47047 15.7537 6.00496 14.9393C6.03042 14.8884 6.08132 14.8375 6.10677 14.812L6.23403 14.6338C6.28493 14.532 6.33584 14.4048 6.38674 14.2521C6.43765 14.0993 6.514 13.8703 6.56491 13.6667C6.69217 12.6231 6.94669 11.6051 7.30301 10.6124L7.35392 10.4852L7.40482 10.3579C7.43027 10.2561 7.48118 10.1797 7.53208 10.0016C7.7866 9.21257 8.27019 7.7618 9.56824 6.18378L10.0009 5.64929L10.4591 5.24206C11.7317 4.07127 13.2588 3.23135 14.9132 2.72231C15.8803 2.44234 16.8475 2.26418 17.8656 2.21327H17.9419H18.0692C18.2219 2.21327 18.3746 2.21327 18.5528 2.21327C19.4182 2.21327 20.2581 2.31508 21.098 2.54415C21.8106 2.72231 22.5742 2.64596 23.2359 2.31508C24.3049 1.80604 25.7302 1.2461 27.3846 1.04248C27.4864 1.01703 27.5882 1.01703 27.6646 0.99158C27.8682 0.966128 28.1991 0.915224 28.6063 0.889772C29.2935 0.813416 30.388 0.737061 31.5333 0.737061C33.6204 0.737061 35.3765 0.99158 36.9291 1.52607L37.0309 1.57698L37.1327 1.62788C40.696 2.97683 42.274 4.73302 43.4957 6.28559C43.7757 6.61647 43.8011 6.66737 43.9793 6.84553L44.2084 7.04915L44.2847 7.15096C44.8701 7.60909 46.0664 8.55081 47.1099 10.2561L47.3135 10.587L47.4917 10.9178C49.0442 14.0484 48.5607 16.8991 48.3316 18.2735L48.3061 18.3498C48.1534 19.3424 47.8735 20.3351 47.4662 21.2768V21.3532C47.3644 22.244 47.1608 23.1348 46.8808 23.9747C46.4481 25.3237 45.8118 26.5708 44.9719 27.7161C44.2847 28.7088 43.4448 29.5996 42.5031 30.3632C42.274 30.5413 42.0959 30.7704 41.9686 31.0249C41.8413 31.2794 41.765 31.5594 41.7395 31.8394C41.7141 32.3993 41.6377 32.9593 41.5359 33.5192C41.0523 36.0898 39.9324 37.8715 39.3725 38.7623L38.2272 40.4421C36.5219 42.7328 34.4857 44.209 32.0169 44.9726L31.5078 45.1253L30.9479 45.2271C30.2607 45.3544 29.548 45.4053 28.8354 45.4053C28.7336 45.4053 28.6063 45.4053 28.4791 45.4053H28.4536H28.3263C28.3009 45.4053 28.25 45.4053 28.1227 45.4053H27.9955H27.8937L27.3083 45.4307C26.901 45.4562 26.4938 45.5071 26.112 45.6598C24.3558 46.2197 22.3451 46.4743 19.8254 46.4743Z"
        stroke="url(#paint3_linear_2231_3949)"
        stroke-width="0.251822"
        stroke-miterlimit="10"
      />
      <path
        opacity="0.8"
        d="M19.8251 44.3616C18.3235 44.3616 16.8218 44.2598 15.5746 44.158L15.3965 44.1325L15.2183 44.1071C14.9638 44.0816 14.6838 44.0307 14.4293 44.0053C13.284 43.878 11.7059 43.6998 9.92431 42.8854L9.72069 42.7836L9.51708 42.6818C6.13196 40.7729 4.88482 37.9731 3.96854 35.937C3.86674 35.7334 3.76493 35.5043 3.68857 35.3007C3.30679 34.5117 3.05227 33.7736 2.84866 33.1373L2.82321 33.0355L2.74685 32.9591C1.75422 29.4467 2.136 26.9779 4.07035 24.1527L4.17216 24L4.27397 23.8473C4.40123 23.6946 4.52849 23.5164 4.65575 23.3637C4.83391 23.1346 5.01208 22.8801 5.21569 22.6511C5.34295 22.4983 5.44476 22.3202 5.52112 22.142L5.75018 21.5821C5.85199 21.3276 5.90289 21.073 5.92835 20.8185C6.13196 18.5533 7.2264 16.9244 7.76089 16.1099C7.81179 16.059 7.8627 15.9572 7.88815 15.9317L8.01541 15.7281L8.06631 15.6772C8.14267 15.55 8.26993 15.2445 8.37174 14.9391C8.42264 14.7355 8.52445 14.4046 8.62626 14.1246V14.0992C8.72806 13.1575 8.95713 12.2158 9.28801 11.3249L9.31346 11.2486L9.33891 11.1722C9.38982 11.0195 9.44072 10.8922 9.49162 10.7141C9.72069 10.0269 10.1025 8.85609 11.146 7.55804L11.4769 7.15081L11.8078 6.84538C14.2766 4.60561 17.0254 4.42745 17.9417 4.35109H17.9926H18.0944C18.2216 4.35109 18.3489 4.35109 18.4762 4.35109C19.5706 4.35109 20.6396 4.58016 21.6577 5.01284C21.8358 5.0892 22.0394 5.11465 22.2176 5.11465C22.4212 5.11465 22.5994 5.06375 22.7776 4.96194C23.7193 4.42745 25.4246 3.43482 27.6134 3.1803C27.7152 3.15485 27.817 3.15485 27.8934 3.15485C28.097 3.1294 28.4024 3.10395 28.7588 3.05304C29.4205 3.00214 30.4131 2.92578 31.4821 2.92578C33.3401 2.92578 34.8672 3.15485 36.1653 3.58753L36.2416 3.61298L36.318 3.63844C39.3722 4.78378 40.6703 6.23454 41.7647 7.60894C42.0447 7.99072 42.1974 8.14344 42.5028 8.44886L42.681 8.60157L42.8083 8.75428L42.9101 8.83064C43.4191 9.23787 44.3863 9.97598 45.2516 11.3758L45.4044 11.6304L45.5316 11.8849C46.7788 14.4301 46.3715 16.7207 46.1679 17.9424V18.0188C46.0152 18.9096 45.7607 19.8004 45.4044 20.6404L45.3789 20.7167C45.3789 20.7422 45.3789 20.7422 45.3535 20.7931C45.328 20.8694 45.328 20.9458 45.328 21.0221L45.3025 21.1239C45.2262 21.8875 45.048 22.6256 44.7935 23.3383C44.4117 24.4836 43.8772 25.5526 43.1646 26.5198C42.4774 27.5124 41.6884 28.3268 40.823 28.9631C40.4412 29.2431 40.1358 29.5994 39.9067 30.0321C39.6777 30.4648 39.5759 30.9229 39.5759 31.4065C39.5759 31.9919 39.4995 32.6028 39.3977 33.1882C38.9905 35.377 38.0742 36.8533 37.4888 37.7441L36.6489 38.9912C35.1727 41.0528 33.4165 42.3763 31.304 43.0381L31.2022 43.0635C31.024 43.1144 30.8458 43.1653 30.6677 43.1908L30.5404 43.2163C29.955 43.3181 29.3696 43.369 28.7842 43.369C28.6824 43.369 28.5806 43.369 28.4788 43.369H28.4533C28.4024 43.369 28.3515 43.369 28.3006 43.369C28.2497 43.369 28.1479 43.369 27.9443 43.369H27.8679H27.7916C27.5116 43.369 27.1553 43.3944 26.8499 43.3944C26.4172 43.4199 26.01 43.4962 25.6027 43.6489C24.0756 44.1071 22.2176 44.3616 19.8251 44.3616Z"
        stroke="url(#paint4_linear_2231_3949)"
        stroke-width="0.235049"
        stroke-miterlimit="10"
      />
      <path
        opacity="0.8"
        d="M19.8251 42.2489C18.3743 42.2489 16.949 42.1471 15.7273 42.0453H15.6001L15.4728 42.0199C15.1928 41.969 14.8874 41.9435 14.6074 41.9181C13.5385 41.7908 12.215 41.6635 10.7896 40.9763L10.6369 40.9L10.5097 40.8236C7.73541 39.271 6.69188 36.9295 5.87742 35.046C5.77561 34.817 5.6738 34.5879 5.57199 34.3334C5.24112 33.6716 5.01205 33.0099 4.83389 32.4499L4.80843 32.3736L4.78298 32.2972C3.96852 29.3957 4.24849 27.5631 5.82651 25.2725L5.90287 25.1707L5.97923 25.0688C6.10649 24.8907 6.23375 24.738 6.36101 24.5598C6.76824 24.0253 7.17547 23.4908 7.76086 22.8545C7.88812 22.7273 7.96448 22.5237 7.98993 22.3455L8.01538 21.7601L7.98993 21.531V21.302C8.04084 19.4185 8.98256 18.0187 9.4916 17.2551C9.5425 17.1787 9.61886 17.0769 9.64431 17.026L9.72067 16.8988L9.79702 16.797C9.89883 16.6442 10.1279 16.1098 10.3315 15.6262C10.4079 15.4226 10.5097 15.0153 10.6369 14.6844C10.6624 14.5826 10.6624 14.5572 10.6878 14.3281C10.7642 13.5391 10.9678 12.7501 11.2223 12.012L11.2478 11.9611L11.2732 11.9102C11.3496 11.7066 11.4005 11.5539 11.4769 11.3502C11.6805 10.7394 11.9859 9.84857 12.7749 8.85594L13.004 8.57597L13.233 8.37236C14.9638 6.81978 16.8218 6.51436 18.0944 6.43801H18.1453H18.1962C18.298 6.43801 18.3743 6.43801 18.4761 6.43801C19.5451 6.43801 20.8432 6.94704 21.5304 7.27792C21.6831 7.35428 21.8613 7.40518 22.0394 7.40518C22.2176 7.40518 22.3957 7.37973 22.5739 7.32882C23.0066 7.17611 23.4138 6.99795 23.7956 6.79433C24.661 6.28529 26.0863 5.47083 27.8679 5.26722C27.9697 5.24176 28.0461 5.24176 28.1224 5.24176C28.3006 5.21631 28.5806 5.19086 28.9369 5.13996C29.5477 5.08905 30.464 5.0127 31.4566 5.0127C33.0601 5.0127 34.3836 5.19086 35.4526 5.57264L35.5035 5.59809L35.5544 5.62354C38.0996 6.59072 39.1177 7.68515 40.0849 8.9323C40.3903 9.33953 40.6194 9.6195 41.0775 10.0267L41.1793 10.1285L41.2811 10.2303C41.3829 10.3322 41.4847 10.4085 41.5865 10.4849C42.0192 10.8157 42.7573 11.4011 43.3936 12.4701L43.4954 12.6228L43.5718 12.801C44.5135 14.7099 44.2081 16.517 44.0299 17.586V17.6623C43.9027 18.4004 43.699 19.1131 43.3936 19.8003C43.3173 19.9785 43.2664 20.1566 43.2155 20.3602C43.19 20.4875 43.1646 20.6148 43.1646 20.7166L43.1391 20.8184C43.0627 21.4292 42.9355 22.0401 42.7319 22.6255C42.4264 23.5672 41.9683 24.458 41.4084 25.247C40.543 26.4687 39.5504 27.3341 38.3541 27.894C38.0742 28.0213 37.8196 28.2249 37.6415 28.5049C37.4633 28.7594 37.3615 29.0903 37.3361 29.3957C37.3361 29.5229 37.3361 29.6248 37.3361 29.7011C37.387 30.6174 37.4633 31.6609 37.2597 32.7553C36.9288 34.537 36.1653 35.7332 35.6053 36.624C35.6053 36.624 33.0092 40.2382 30.6422 40.9763L30.3877 41.0527L30.1077 41.1036C29.6496 41.1799 29.1914 41.2308 28.7078 41.2308C28.6315 41.2308 28.5297 41.2308 28.4279 41.2308C28.377 41.2308 28.3006 41.2308 28.2242 41.2308C28.1224 41.2308 27.9697 41.2309 27.7407 41.2563H27.6898H27.6389C26.7226 41.2818 25.8827 41.3072 25.6281 41.3581C25.5009 41.3836 25.3736 41.409 25.2464 41.4599C23.9992 41.9944 22.243 42.2489 19.8251 42.2489Z"
        stroke="url(#paint5_linear_2231_3949)"
        stroke-width="0.218251"
        stroke-miterlimit="10"
      />
      <path
        opacity="0.8"
        d="M19.8252 40.1621C18.4508 40.1621 17.0764 40.0603 15.9056 39.9839H15.8547H15.8038C15.4729 39.933 15.1675 39.9076 14.8875 39.8821C13.8949 39.7803 12.8513 39.653 11.7315 39.144L11.6551 39.1186L11.5787 39.0931C9.41532 37.8714 8.60086 36.0643 7.8373 34.3081C7.73549 34.0536 7.60823 33.7991 7.48097 33.5446C7.22645 33.0355 7.02284 32.4756 6.87012 31.9411V31.9156V31.8902C6.20837 29.5741 6.38654 28.4033 7.60823 26.6216L7.63368 26.5707L7.65914 26.5198C7.81185 26.3417 7.93911 26.1635 8.06637 26.0108C8.65176 25.2472 9.1608 24.5855 10.3061 23.5165C10.3825 23.4401 10.4589 23.3383 10.4843 23.2111C10.5098 23.1093 10.5098 22.982 10.4589 22.8802L10.2552 22.2948C10.2043 22.1166 10.1789 21.913 10.1789 21.7349V21.5821V21.4549C10.2298 20.1823 10.8915 19.1897 11.3242 18.5279C11.4006 18.4261 11.4515 18.3243 11.5024 18.2479L11.5533 18.1716L11.6042 18.0952C11.8333 17.7898 12.215 16.899 12.4187 16.3645C12.4696 16.1863 12.5968 15.7536 12.7241 15.4228C12.8004 15.1682 12.8513 14.9137 12.8768 14.6592C12.9531 14.0229 13.0804 13.3866 13.3095 12.8012V12.7758V12.7503C13.4113 12.4958 13.4876 12.2922 13.5385 12.0886C13.7167 11.5541 13.9203 10.9432 14.4803 10.256L14.5821 10.1288L14.6839 10.027C15.9056 8.90707 17.2545 8.70345 18.2726 8.62709H18.2981H18.3235C18.3744 8.62709 18.4508 8.62709 18.5017 8.62709C19.5198 8.62709 20.2833 9.03432 20.7924 9.3143L20.9196 9.3652H20.9451C21.0978 9.44156 21.1996 9.51791 21.3268 9.56882C21.6323 9.72153 22.014 9.77243 22.3449 9.67062C23.0576 9.49246 24.152 9.05978 24.8647 8.65255H24.8901C25.6537 8.19441 26.8245 7.53266 28.1989 7.37995C28.2752 7.35449 28.377 7.35449 28.4534 7.35449C28.6061 7.32904 28.8861 7.30359 29.1915 7.27814C29.7514 7.22723 30.6168 7.15088 31.5076 7.15088C32.882 7.15088 33.9765 7.30359 34.8164 7.58356H34.8418H34.8673C36.9034 8.34712 37.667 9.16158 38.4815 10.2306C38.8123 10.6633 39.1432 11.0705 39.7541 11.605L39.805 11.6559L39.8559 11.7068C40.0086 11.8595 40.1868 12.0122 40.3904 12.1649C40.7467 12.4449 41.2557 12.8267 41.6884 13.5648L41.7393 13.6411L41.7902 13.7175C42.4265 15.041 42.2229 16.2881 42.0702 17.2299V17.3062C41.9684 17.8916 41.8157 18.4516 41.5612 19.0115C41.4339 19.3169 41.3321 19.6478 41.2812 19.9787C41.2557 20.1823 41.2303 20.335 41.2048 20.4623L41.1794 20.5641C41.1285 21.0477 41.0267 21.5058 40.874 21.9639C40.6449 22.702 40.2886 23.3892 39.8304 24.0255C39.0669 25.1454 38.2015 25.8326 37.0562 26.189C36.4962 26.3671 36.0381 26.7234 35.7327 27.207L35.6308 27.3343L35.529 27.4616C35.2491 27.7924 35.3254 29.065 35.3763 29.8286C35.4272 30.6685 35.4781 31.5339 35.3254 32.3483C35.0709 33.7482 34.4601 34.6899 33.9256 35.5044C33.9256 35.5044 31.9403 38.3804 30.1332 38.9149L30.006 38.9658L29.8787 38.9913C29.5478 39.0422 29.1915 39.0931 28.8352 39.0931C28.7588 39.0931 28.6825 39.0931 28.5807 39.0931C28.5043 39.0931 28.4279 39.0931 28.3261 39.0931C28.1989 39.0931 28.0207 39.0931 27.7153 39.1186H27.6898H27.6644C26.4681 39.1695 25.73 39.1949 25.3228 39.2713C25.0428 39.3222 24.7883 39.3985 24.5338 39.5003C23.4394 39.933 21.9631 40.1621 19.8252 40.1621Z"
        stroke="url(#paint6_linear_2231_3949)"
        stroke-width="0.218251"
        stroke-miterlimit="10"
      />
    </g>
  </g>
  <defs>
    <radialGradient
      id="paint0_radial_2231_3949"
      cx="0"
      cy="0"
      r="1"
      gradientUnits="userSpaceOnUse"
      gradientTransform="translate(24.0007 26.4677) rotate(90) scale(26.5325)"
    >
      <stop offset="0.1667" stop-color="#073183" />
      <stop offset="1" stop-color="#0054F9" />
    </radialGradient>
    <linearGradient
      id="paint1_linear_2231_3949"
      x1="-2.92765"
      y1="-4.93004"
      x2="51.1903"
      y2="51.8699"
      gradientUnits="userSpaceOnUse"
    >
      <stop offset="0.2057" stop-color="#89D0FF" />
      <stop offset="0.3984" stop-color="#EBBF9A" />
      <stop offset="0.6015" stop-color="#EB8280" />
      <stop offset="0.8411" stop-color="#A281FF" />
    </linearGradient>
    <linearGradient
      id="paint2_linear_2231_3949"
      x1="-0.82917"
      y1="-2.48588"
      x2="49.0617"
      y2="50.0916"
      gradientUnits="userSpaceOnUse"
    >
      <stop offset="0.2057" stop-color="#89D0FF" />
      <stop offset="0.3984" stop-color="#EBBF9A" />
      <stop offset="0.6015" stop-color="#EB80DA" />
      <stop offset="0.8411" stop-color="#A281FF" />
    </linearGradient>
    <linearGradient
      id="paint3_linear_2231_3949"
      x1="1.29037"
      y1="-0.372748"
      x2="46.9531"
      y2="47.9813"
      gradientUnits="userSpaceOnUse"
    >
      <stop offset="0.2057" stop-color="#89D0FF" />
      <stop offset="0.3984" stop-color="#EBBF9A" />
      <stop offset="0.6015" stop-color="#EB8280" />
      <stop offset="0.8411" stop-color="#A281FF" />
    </linearGradient>
    <linearGradient
      id="paint4_linear_2231_3949"
      x1="3.40672"
      y1="1.74753"
      x2="44.8321"
      y2="45.865"
      gradientUnits="userSpaceOnUse"
    >
      <stop offset="0.2057" stop-color="#89D0FF" />
      <stop offset="0.3984" stop-color="#EBBF9A" />
      <stop offset="0.6015" stop-color="#EB80E7" />
      <stop offset="0.8411" stop-color="#A281FF" />
    </linearGradient>
    <linearGradient
      id="paint5_linear_2231_3949"
      x1="5.51096"
      y1="3.87189"
      x2="42.7068"
      y2="43.7496"
      gradientUnits="userSpaceOnUse"
    >
      <stop offset="0.2057" stop-color="#89D0FF" />
      <stop offset="0.3984" stop-color="#EBBF9A" />
      <stop offset="0.6015" stop-color="#EB80D3" />
      <stop offset="0.8411" stop-color="#A281FF" />
    </linearGradient>
    <linearGradient
      id="paint6_linear_2231_3949"
      x1="7.64264"
      y1="5.97105"
      x2="40.6054"
      y2="41.625"
      gradientUnits="userSpaceOnUse"
    >
      <stop offset="0.2057" stop-color="#89D0FF" />
      <stop offset="0.3984" stop-color="#EBBF9A" />
      <stop offset="0.6015" stop-color="#A280EB" />
      <stop offset="0.8411" stop-color="#A281FF" />
    </linearGradient>
    <clipPath id="clip0_2231_3949">
      <rect width="48" height="48" rx="24" fill="white" />
    </clipPath>
  </defs>
</svg>`;
var astar = x` <svg
  xmlns="http://www.w3.org/2000/svg"
  xmlns:xlink="http://www.w3.org/1999/xlink"
  width="48"
  height="48"
  viewBox="0 0 48 48"
  fill="none"
>
  <rect x="0" y="0" width="48" height="48" fill="url(#pattern0)" />
  <defs>
    <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
      <use xlink:href="#image0_2069_4464" transform="scale(0.004)" />
    </pattern>
    <image
      id="image0_2069_4464"
      width="250"
      height="250"
      xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPoAAAD6CAMAAAC/MqoPAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAMAUExURUdwTAaq9wJ56gh96gpx0w155Q1uzQnf/w+N5h+F3Hg0mQRoqgFXiQaF7AB+8AKL7gfR/g5tvQjS/ZkorQOf9VZJx7gMegxw2GY+vgjc/qYfnzJd1gfH+wFWmWI+v7QLdgfH/QOc9Alz40VIwAJhoDRd1jJd2gZv4gKm9wN9swXG/QdguG0/vAbK/MkNh2JAxgjV/VFHxQfb/wKm+Ig3vU8baZYBU1Efc1AfcIU2vqwamQjN/NwDewSNtj9GuJUEWZMDVdUGfQni/wBx6wF98QGK9gGN9wGQ+AZt6QB07QGB8gGT+QGE9Axq5wB67wja/wW9/QGH9QB37gbC/ZslqF5CyQSz/QfT/lZGy7oVlQKW+xNn5AbH/gS4/acfoaEipGw8wwbW/k9LzwfO/gOn/LQYmAOu/AGf9gFeoRxi4SRf3scPjQG6+WU/xgKh/AFwvgGY9ootsj1T1QKo9gKy+AbK/sESkJUorAFXsQBauAHB+UhN0QR9pnk1vTBY2KsdnrAbmzdV1wTd/ABUoI4FVgBjxwF0xs0MiYQwtgFrtnI5wQBgvwPo/gGM8Stc3H8zuQKb+wKEzgFozgHJ+wJ/xgKI60JQ0wGF5gKE3180rALQ/DR96S4+nwF4ztYHg5AqrgZSqwBHiFZAvgFmqyJY0AF91QGB2jOK7gKJ1hVZyTdBqAxXwOACez9DsgJp1wSi7FUYZ0WU8mIffgWJpwOR3QF01gBw4ABMlSNz5gJ/vSyX8WMplbwBZ5wIZwB84gjS8CWE7JoBVKsBXgJgkT505QOY5k+K7z2e9ZhV3AfH5s0BbwN8sjgndktGuB2h9DWp90aC6wfv/x2R7wa93RZ86gay1KwJcSu2+aFH0wWgwLoKe6EQfExa2Qit8bARhixMvqIrtERo34VY1jEyiwSTt6g8ygA9dypGrqE0v6IXjQapyjFr4kEtihy6+T82m3FXzMcIfWBRvwJRewOf4ads6jrD+sFX5QNxl3kllgOWz0ljuXgSaIaJ9V6j9yXG+ml46F81qooAAABCdFJOUwBFy3wwYED/ECAQev2c7955U1x/gWZfmECkQby+x4QrMMO2o5aJ2ObqupjZMN+Uu8/Vv6umjtO9UMfE78fc7KZ73/ak7XkAACAASURBVHja3JxLSFvbGoCTmJc3JlERRE4LWrz3aC9CaYfiJNVEs62vQAWNg2BIrIQ0YJwc5A4cCEJSIo0kFByFSGYOdJKJDsSBZLQRBx04y8jh6UA6u/9aaz/Wfu9aY+35Y2op7OrX7///9bQWy6OG0+nxDA4PD49tQRyjj2OIMfgTj6fLabf8E8Pe5RkebjS2xDjG72OOnoux4UGP0/3Pofb0jtXrjXoDyGl2JbgQw56u357f2TZcLBbrKJoNBbsu/thgV/tva9vxYg9FsVnE4PXGcUNhnSOn4L+iuLq+Qp8A//ez3+X112o1TM5ZrxPrGP6OKnjB+tfrq8uz2e3ZbVfAFYDIBXK5XCDQ193+W3HXTmp7HPl3jr1B2Le2KrKM30LUl6uLi/CxGJtF4XJheD5edf4e9Havr1yulWs1wXqzKFgn8Hc0e/M6tQmxuorIF2MxFXjs/qlnvrvNv186KZ2UEfoeQd+jrG9x2u8E7r+i0Sgh59k5cqn4QMDV1/+Ewa3e/D5EqVQ+KdcOOeuo2CntW7ui72+pSCQSVbCrJj1O/Keq3uHP5/P7F8h6maQ81s5bF7VXcLk3b+YiOKJmvSP1T7DqIdNDoTxiJ9rL5UPwLlgvitbJ+PY9O4dCg13TO0Tf04J39/hCDCG/4Gsd2Kt7CuuNRgWDr6ys6LFre0fw1qcFzgB7hlgvSa3Lix3A36+sGLDreQ8EXj+RjkfAQyTfRfTaIWiv8fleFKwXb95DGLLren8aae/wB0NCkIzfx30Oaa/uVUnGk1r/CORHicR7U+z63gOBl7+421sHgqFgMCiSi22ufHhYRdV+QPe52kYiYZbdwDt0+19Z5N6JIAkpO1fskPBVICe1vlP/WK8fxRMJ8+xG3nMjv6zftfkmgjR7ULB+QtCxdtH63kY8Hk/EH847G+j7JVlvHwBwCNo7aXQlMeNRsR9w1k/iOB7S+6/J+p75ifmJCSl7MChNeMwO1g+KO8ViJh1PE+sP6B0NdI/c6/tt8/McOcUeDCqLHdiR9r1MOp2Ot8L7I4tvA24Vdql1XOzV6gHK+GqhkEbshP6BvQdeP1rFuwem50nI2INqGY+0l4GcsLfEOzva/Uhbjb7paXX2UFAc2Euc9b0qJi8Q7S2qd5jgPEqyT+PQ8C4Uu5jxe+WlJUReMO89cnV1e32LNiZvb2+vr64uz2IG7LlXLe92btv0tA471eZ47VUgx+x8zuvX+1/X35t4zw6iieMr+SdAm5Z63gMtTnq7Pxw2y86hY3IJu7b3m+bWHQTZqD5uYvivTc7+7fW1Pn5LO73DFw7rswvkPDpHTth16/2meXdHwO/wNm2Dsn6LtGP2Kx36Fs7t2sIkdNgnZMNbmWEo9jTHruL929b5+d0dD0/25ptK66jwAX5bo+Bbxe4dDxuyA/p+ni92sA5LeTV2eb1/vzsHcsy+RbSD9eaxxDpCR9YB/lIL3tXfmgY3Pm7MPjEhyfg8w9DsQK3S5xPfCDjFTvqc1Pq1wH55qQnfCnYgD5tg59C50Y2Q8+wFBK6s9yNIdRxA/vz5oMfj6YK3Z3hY2uFvbynpQH55pg7/4I2+HTlH8Abs+Yn8NKfd34Z2rhA4x14g5DLvRQ78+WCX/GpBu6N3jM/4WzHjLzH8GQpX69ntvnE+DNh5616nxRtiQozoHXiV4/tRheO2a57Oj/EdXlLryPrZtqr47ocln+HBDdnn8/P7/jZotVa8hOe9M5hcPr6fYPBB/ZskXcNS61zG49jedrWUHchnZsZNes/n/Q7cHHwhkZ1hUKHLx/d4HYF7jEekfq+cnAeHaKV3TD5j1jsBt1je8Nu0xHs8nqbHOASfbJx3mAHHZe+VjW4k39WtPxg7R27OOw+O0p2hAkp7iVmSzGmTUObPzS862r3X/JyGa/DEegsn9G7bwoyUXdP7hM8hPOUP0eyQ3EuSuU0hnVk77+hS/YJWa2dPp9WqSAfngDzjt7WsPwg7kC/I2bW894jfLXR3JiOwF+IbBUY6r8usdTxXyXXry5EAG8OruLmRl/JDZeutBH37LKBl/QHYMfmCGe/TA1Ty2oEbXkyGwR8wdWEk87olIPcov1r3EJrPr7K5CFnDzo2+lFVEj7TDa0qH+Nl53YuFBTV2pXcx11EMMAyPDa90IpFhpOwVlWS3DnFrmQjLrnLskYgMvv0ZN67rlvoDzGl7p6bU2WXe519IUtMKyAQbkScTiaRsXrfboRjK3W+EhdzKSo5nhxiVrcO7TVpnR35mHeeYWtBil3iXKrdY/JgZYgl9BiCq5yH0AyV5/wAhV2GPPHPLxHPkMV3rP7WGtU/hMPI+bZN9CYcIDu94NrFEz+uWlsoq5EPcOk6VfUSWu93A/tnIOtq7uPeSxTelxy54b5M/6M/wgeCz2bhkXsfkz9XIj05ONih2qPeoyD4qY+8fObv8chaLzeqj33fPym17OzVl7N3nVJSJQF6AVyKbZeh5HbO05lTu7B+t/Q1Rp9g3WXZOm93dhzMebVPrst/vLNb7dsqAHeHblPXk57nRL8lUNh2UzGkPlL39zUXH3zi2qD2rGOui9qgVPavz7MuXWGzbYH/edZ89asdbFEbevSoPIuQkehXgnUhlQ0GafX9QOapdnHdw7A1xw24ux25S7M8UT40C+qzh/vx9Zu5vTbA7VJ4cwM6TSUwfT6WS1N0DYP/vvxRPDFUAnWM/EXMepTzFrqjb/leLsdnZBz+XgUJ/a8juUyO3YuXYOVhPpbKSexehA+Xa3IE2anj2DqrXwZSWPpdRTFHcr2KG53E/PqPtnZw0ZPep7jB4sfJCEgdIL0jvnKhMX/2VNYq9Lo5xEaRdZH+mFNRn4jxu9MdGd+fkpCG7OrmblDkXIF1y7yI4oLIPsbcGIbInRXaZdhV/fcbnsLnXP5Tuf04astvUe2dbRuBOpjdAuvTOico/l7dSQeQCe5HszyN20L4igEOXt6izG3n/kdH9xbt3Ruw2jTTyC87TyWQWSafZVQYEi62C2EXvHdS8LketY9S1m/H+AyNc17t3Ruxa5P2i82QSpCclZ9A+tad2ditS7ydxwfsqG5gz0G7G+2vz6b5swD7l12odXg59A7146QJ7j9oo+nF3V+q9Ehe8r7BsRHAeiapqN+PdbJfvXV42YPdp7h4PZXjyNJYuOYv0q3bUjxz7Hd/nz6nzuG12UZAejao0eXPeXea6vH15WZ99SpvcmhGdg/RUkD6PCzk00aXeL8TzuCibE8gRfLvlft7NreH+s/zBgF37xMDLNbkNCJi9b0jO43zqQ8LOR947X+918SwSZXwkIl41UW/W7leG3s2sYxwfMLkOu0P7YT9nHUmH2XtGci7To95Td3bk3ivUQWyAXYzw1sG7xpQcs+vepzUxl3evfwB2Pe9tOqckQr5DpLJZ6bmMer05D3YU3vlzWIhF1sUXOrKukfGW/lEj78aD+78/oNDx/kLn4R6ybsHkgJ6kz2WCXo2J48GBwvtFXPAeYXOCdBRavdo6a+DdsNO1r68Tdi3vNr2/YYAjR+zZbGqCOpeZn9fqENUD2jvu8zXh/D3xnmWjovTPUc2FWKfR/Toj7b3rH9Z1vE/69A5F3fxyFcFDkxPPZeA3fq2nbFWF9yJ1/g4TOo78M7pNOKL51fuMvOvP6ezrKHS8O/SetiLyIwE9wx9P7If39/c1W0RvVeodtO9S92222Vk+2QF+c1MTwD1i9PMyuuh/YHJt7179La1MnteezGazAB0Oh4E7XBovlTS/ZfthVe59V7h3kYhvsq6oEJvRTe2JWX/MwLueduenT+t63v/UbxXC/gxG38DcpZlS6bR0emrTGREPq/J6p+5ZRdhANPIZhH9GP/W7GdUp2U6D+7R62v/4RNi1vBv8Pxr5ENGO6FM3+fHxmdLpzCn6OD3VGRIdZYV36r4NTGp44eje8OYznW/gtYF3be3O/336pOe9TZ/cmsfgF5mjzMXGzQ2oLp0unHKhl2z+stx7RrxnlUDom/9n7OximtqyOM439BpGJBA0EiM6fl6N4515mZh58eqVwQ90iEIyTtLCBF9gSmxJSo0mNKGZY0uctoB6CMlNCR9P8kLNLQ/IA+SGEEAgxJjQBxOeNDwRH/qgmbXWPh/7tOfsc/apHwlK+ut/rbX32Wf9N4leJnqvoM7B/HTFxhdpLfozjd1M9yK7ZkqyvgD+0uDSTGZGx06lJs4Ib5Jf5eo++z9d940NmXEr8KLvVGXTP28lgAvIRbrbHRtTieCAPQy/MjMg+tv5tyll1Im3Rl7l6P6K66+DpSyBd/T2dsDVK3yA+pO4f95K9pPPePY83evsFoJFw9qYndkHbARX4A/Z7P/m6D7B9dc1b3gQHLEJX3gj4hL7JiyWdBX9/c9wWOh+xvaWd5hsXmRkXtrfT+kjPhavsNv1N+o+wfWYNW+Uo9gdMrNGdIhXZVVi34T5fz7V34/wVrqX2t7nKwYAHPv7s8j8hrDj4dSP9k88DOwTXH+dvFHe0St3yB34StihV1wU6b5hXiRPM3QL3U/Yb2BjRZsks8/kfnYyFU8BNL7gsk2WgpKDfMwPcf11DwEdoWXZieoF1WK/jNmKqPbx436B7mW2b74YwCcnJ9DzMZnNgtgIHg8PhAe8Awcc3C3ztW6M668DdNCcRCft622+0U9Cn5TZDuXRx8T+rN9M93/ay1ZQR3k9kYK3P53NEjVAwyvijdh/cLgu0Of3Ma6/7uFGVJYJXqYPwA69UOyTyp/fXCOPGXu/aZ13sJN9gtW0MRixbGwAB2FHpEjE6dNddU0b5noL4Y4dXV+tMlxOVC84IvLHRfPvek+N8Oy5ujsQvaAIStpYfAwyOxzLQpRHFGwpIv1Y4HSU1Z0hds4v8xDRZYKXAd9WdZjghOfb5Be5EZ09P9+dPL6Ix5WaFvdmY0AdIfA+qa+v75xJWSssK4SXyTeuKDtUXMf1VZLqnlY2AN4WnWS31j230B1+MqKz5+W7E9EL4gOU3DA3hYeGkBuY+8b7AuOBAOsmcBWW1tT8uaGBui5ukvNZ2Z9vaKipKeSP2Cvk+ioB3YOD4cuy/QajS+iLzF3RnXzCs+fmuxPRXSy5Ib0j6XS6j8Z4gL3qqmsaztKGHbujpds7RFfYqZkcVkQnKkvZB1DI9ZS2RBm6R1Fetn8vR4R+2JzlVfuTPHZdd0eil0UGlCCXvGlvH6oNkgfGpaHsTMbv92eI3KeS37zRw9CVkw/QPPGS3P5nzh0oKeT6aXV0Bu8AvVDohzVG/CFEN7Dz+V7mDB0HpLbUl16RAjjGvbF9pIbhw0vXnal+45dfOG8gWoWowI/BxM71lAJ6c8gT0tkdvJl60Tlmxog/2Z7LzuX7UWe1mcU4CB1YWYH8lob2M11saPS5EX9jUGMnc5y+puH6aRGdZ7/i4M1UC33Qhohva89j1/O91BH6AcIex9fKihTb79KGn8GrsvuowagHW6cV2dEfR/E+b0C/qaGHQiEVvrXV0RPjiyL/Ox/xF9rbzdlR92fOZuQDAXVI2e2uriC9DLIz+EeGiB9U/XEs3hE9rKHf1NHx4EVPM7E7Qq8S+d/5iD/VZsrO8v2UY/Rf4Qp4sxjnwa4gvoJBA72e7ayrUFX9+vV7GO+66F6uj1qORstD5ZruztBdgnMPonzKXG4zZWf57nKKDtzjQxDoQXV0sYtinst2lf3GoBbx13NSXeL6qD2AjuwgPOnurEXiiOjcA32jx9WGwyLmTxc4Vl2KZboYLjdUdl1349TO0G8ZU13i+qg9eK4oyg7wIaeqF1QLzruI6ve9tQjeZpHvtU7RpayfQjuYM5Sc5yqdyn6jZ1BBv4epDje9NLURut4/30xnqoauAjole72jt1NxRXDehf7pnWSqm+vurBWjouas38+BJ+ji4HnZ9WxXVR+8NfxyntumCXP981FEjzLdMdsdtoKdF51zokFdvq9FfB77Uefgfo2cgSd0dr3Q+TlySvbreKoRVjkUPaWIHub656MbyB6KUrp7HKNXi845Ubc2XfdhtFnke60jcB9iqaIjNA38M1d2ZW6Hvxnq/8zS0mwuOmP/D6EDPMt2j8dpv6/gfBst2WsN5Dns9vW9GG5M/BkTcgJP8LJ3wZc8oVA0b4RC7969W17e2s5mY4g+offP/5uprif7yjlnc0694HwbNdmP3b9vpfuIbX0vPPiINRIgO4t2w1DZE7KHQ07IMoWA2lvoz2Qyy+hM39re3v78cXda75/vjG7osmOup71pR0bYatG5Rmqqd2vkeXXeZj1T0rC29mjNl/GxeCdwYn+XkOEXQ0fqq+RJCyWC/kc99/J8kbea1FSPxbLoVl/S++fvMnRSHWZ2z7u015v+m4M7KpfoXCNlZu/u7tZ1z6nzh8VJvrm5ObPmA3YK+GCXIrpMFw05xIYc9Pc0mXtC4aIqN6+luvRS9w608KoD+rJXSoeHYnX2wv9JcJ4VS/bD3Qq7Wb6LY31zcy1HdYbLhoadAOo713TbSJ4f9pZCrqFz3oFWRXUSndBXvENDsemDtsKfF5xnxZbxtd3dBt25fH8imNoqKjdx9CD9GlNdE50GSu3xAPY1Oz8si3cmetzrjUhezjvQrFb4q6zAb9MOWGx6erbGrgxZn2Om1Llj7m5L3a1TvXB0YQHRUfaML9OZ8avkGrfsSfgGHfmgaSk3D6KnmOhhzjcR5So8TuuAnkbVZ2eXGsSlvsLyHDNQnv7FJbfbUnerVK8oXgDyqc3NOYIH2ff8e2rAQ1ULYbwTt40fltFfe6moHg/jLraU0r0DyrSOyzlCl7MkOqEvnRW3f160PL+unHl93W53ju56nbeoJSVFowujC1PIzsAza8rklsCJ2wPgvkEHvkhF96bhOyQ6BvwAq3IaeycTHXcrQrSEj6HqDH1mxicM+vOW59c1l+N2xQ9uA7uhzl+2eEiyODoK5MA+BxfB76Hsd4MtQU8ISnuw5x9/d+aHJeGbrilVLoXbFBFJGtR9E3cRHcgV0T1yWk31JUTvrBdU+irB2X1Y4g8/d+frroT8JfOn0UgOsivsTPc1/56/q6XVA7L7h239cQbdm4YRHUXHxxcg+gDnGemIblyl6s5El2Fap1QndJ+vs/PscUGds2bHEl/7/Lmp7sn21SfHzNK8bnGR2JF8ak5lB9n3OlpbHiZ8d3525Ivk8r3pzrwS8CzVxzjPSEgvcST68i7M6qzKEfqDB4KEF5zZiCX+2PNc9rYkXhjzJlWu4vTi4pdRxg5jc26O0PfW9r53tLTc7fm50YE30Kh7U9PLeVV1SvV53TMC921McprYZI+8tbs7pKc6WkD/9cCyi/CiNTtuUv3lqYEd4JMIv9qWXG2/YEL+afGLIjvqTuwI//373t7eZuPtRgfewINFRZXF2qgsKvoDQ09BvA9IEemW7hnxRTeUdRFtScpydvfjxyzGu4YOw+o+tl5wVid8+a9PefYkXkkm+2rSjPzTl09AvqioPjdF5B8I/HajnU/qRHGp+U+vKikrriuipRwsaDi/TDCq13ZaMKS9ux8/Z7VUJ8/zgwcWN7I1gnNKjxM6x+5G8vtJHKtteQX+ByD/RLLrIQ/o618/fPiweVvkGXlbVFlq/zPLyg6ckyQpxfllZJjPPc3K8wcgD8JaLvb58/Ysjw7DnL1KcEYrVIgXTzn2JF7dSTZWL+VrvkPsiyzkpxj6VyCfE3hG3sYjgYDjJ+wldcO6ZwTWcgo107xjS4K5LfZ5e3tJi3c6mNKcvVBwPi0UiBcG9tduYFbZcwv80R1GzuBH3xP8+tf19bnfrHwTjW8G8KlEX1+ZY/ZizjPii0aBWiOXe/cRfWx6e39rH9Ep3K3ZjwvO5q0quPDCwJ4E+NeK6LnoJ4Gc2IkcwN+PTv0O4OsLFv3zjW8iuDkfwEdxf3SMXsT5ZSDVVWqQvDeRGJK84fDYxPT21haLd/xZIl3o+TVlF5xLXFVw+L86+3M3gbuTr5OIv2rcl6vd2dl5rES8Cv8NyKcs+qjfRn79NaCARyKOe0pcvFcoFA2p4HIvkCe8DH1ydmtrOaOnOpCbsgvOZD4P6Bw7krtfEzj+ZpjWL7TvjOyoulO2v3//bf3b719M+2lvx9O7HHhkYMCppbaY8wr1RKPqrT/b+NjGeEf0V7OZYNBP4Kh51/8ZO/+YqK4sjo8VCLhBt5GtG3XdRWtl0667lprduln/0C3iD8woOqvCtFZwCIYl0zCs7RhTQ0IT2UFHKMogTUkzusCEgRKcjEui/CGNZpFtKA3bBDIBmkxSYPyDqYEEy55z7r3v3ftmBjhvwH8cmA/fc3+dc955BBi7vv8hMfubiC6xI/hZpPY89XzxVEHfdWmU2bjw+S9fvHhxO249bUF1S8t/vr8qk6+kdI75u3SvkMPlUgJ9hfM01BH9Vn+Zs97KRGedTMxWawx7ZuJe3JtN6z+Q2RHcQ7IjvSzUlkujl1D2cab7o/GvAfzLqXj1tAVtLWAffn9fAq+uW6HHpx05prM3uap0bvzs93X0BruzvshM5Kg56W417uc3J+5D/iag6+w1lz0Az+g9oLvUUCMNDjPnLkmyI/nXcesqCRzQ738H4L5/+qiCrq7OvzKPT5f61+Xoojvr8+udzrKrhH6H0GvthZVFIHUZ5waz/NnwS7IT92BH1T+QdWfU5PAej1p2cW70HCNH9kUgH49XV8nBMdv83acfMcURvM6/ekXoa6X+dbC0OXkCK5++5q+yWY6hH3AXVjYx0Z1Md6vV0HYqI3H/+d8Rus4OvJc5PcArouvsQA/kX43Hqav0AnQYXz5w9vl5pjmB+/07VlQvKceom1zvs8RVPv/6VJvlbiH6YWQ3EziywyRvNWxpM5bovW9a/7nEfv26RzZJdBa3GSX48dHFFwtfxaur3PSrlmbS3Nfi8/lu/PAJl5ws8PJKJjkpTnsY/F3L15qdZWbHVa46it6ArYmLK4kdyUl0sJ8b0ROxA7rC7vHMCfCIR0nAn+PwYIsLC4uxdValr6WYfkaqhz70odX9MK+BB8C2rmAXK8dpHa4qnpIDLvxn9qo0y9VSV2ZgL8K2BuTwuM5ZLL8xoidgN62/KLNf742r+hYetxkln19ceLEYW1/nDYGqSejuKDnCt81/W6eR5wVy9y8/0aXLcdoqV1OZUpTzFwU9h7KRFoDg4NzkblUZSzxvAtAVdhB9rteDV0RC36VHK5nmsfV1beEQBu1fb/GFfb4Qgle33fu2h5EDdwDOMsuWHqbJMeoSl0urQ7Liy5r2sjLLsRx0WWVRIVO8DAEBNFtGT8yO6DL7HMpO0vfq6G/oocrRU4zcUG/jDYfDvhCcSl9FzUMf+drAqts6x4C7wJ8bYHv6takrEV2wO11/oyQmvxyOzeBVr9NQv3tLRz+TX1mUb+bcVtzgWVbJ6AnZTetPyOyX53p7UXUmu8mYhT53avQZkMfU24TC4RZg3wZ/JVA85GtD9DpvXeNYPzh7XkCc5JZZ39LkGPU7ILpDNhvu1VJ/q0/wnJ2meQZuYTaWKqMnYgd0hf0683Z2iR/weyA/yXQfJXJDjVm4GUQPgaHHo7e3kflL/WMzgQLc0vMj7DKyp8txWpjkFHJHFnvzBj7B52h1F+Uw3NHTHRbUHNvZZCvoCdgRXWYHjwfhUXf40gtOOPupkwsLC8a6i1BzM6Kjx8OhfLuvLYTcXr/X7y/tmelUDvCrlxFdYq9yOSlvX2EDwfG74NnAZzm95sRWWZnPBQdwZBUun12R8Nl5mwldZu/l5on09oqN7N+1EDUMdGNNaRjJmxE8FNoOnx/JvV5Av+CHzd3MzH6K2K1E9nQ5TlvhqoKPjfC8BKVCWx+SdXTObq0sKgPJbTYHf8QC9xBTJr5R79FqVfqYbXxPZafBzuB7+cktTYvPw0B/ptYe3GyebOaqh0Jt2zCUQ+BtpV4kLxiaGZRlz13iBvgUJT7PRBdmq7BJPcuSdXReZwVrlcViE1Zss/GEVGYJf7/DYWRHdAO7IAfj6L8U8fmT0eiEWnvQMSmRh2h5S/aClXr5YSZvZmZYcfnEscmX5Pg8iM4bnQiTEw3JOvoBMdwLBTbr9MB8JLOT9QwZs1UgvMxO6Cq7Rh7p/ZNJqT04NRFd0JLQxN4O5DI7peMR3SsOcnkkO2Mn+IS3Qyf/9aiUl2lylWHbB3qVw1WSpf5nHf2A2NlYOTijZzNDVidYRSfCU7mPRWMvzDb9+l0D+5wu+xYJHdmj0WdKzUnz5KSqupdScl48xfH2NsFhkl3SPUGJeepaOS9jd+3T2pexb4a3ZbyTo7LD6q5LjkZe0t9p7yyBC9F1eGKHvf67CjvAd/fihbabo/Oc1ER0Qi4+uDRJ5IIdyffS1ACbWn6GxeP70MxMnqR7boKZboOcjztU73La5fZtBtFxTsxR2d3g8ho23vuNc0Nqfz8GrbnyQE+rJIMndIPuIDuQI/4f+a/hOSkQXVvfwSYHJo2qs/qTTdfEGTZYECwYxrSMpHtu3FNMCtbaaLqj6KINL5VWlsT6SraBHVY4C2HTXe9gIHsKkjN2gB8bo3InKn0h9D1G9jkmO+Dr6Mg+EX0slV2cEuTI3h4Od+joKde00AWyg+y5su4H4xxeU3ccl3ORJLpsWbGukrrOwG6uLyRw4i4pL8/EBrVgdqF8ZyeyC3r4y+z52MjercGL3Ryxo+g6O5APCNHb29vDoQ62rtPtgix2URosDQJ7cHBmUItRYyI2jstv3X9cYrfvq7JrLT/I4hVPpK1V2csLC63EXYLg5W73KtPqnn4yrvwYFx7hEX3nx0b2uW40ZOeZ1i2YnHgWjUr598kBjj45GWlvbu9A1W+GeOA+mcUupkj14PDwTzPDUnw+d3+MyycHAg8OauxHm/Y5qOmFuHKy4s4Pq9TevIcd+fmkOD1UCCzTlN7Tc4vT68qT8GMO+JHrr8Swk+zd3dPdo+mHBQAAFitJREFUvxDzHNjj6IRedxEZACNupjqQo+piw/Uai11MoezAPggznZKXMYzcpB2BwH5gP87YS6reB/AceOUcqCX5E1TMpBvYzflm0NztFuxpW3vAGnqMypPB+1+5EsMuZO8Wgx1zUtHoWa3uooPImeqRCPp7B5JrmVmQ/drUhakLQWbDIyODcl7G0MkqdQcFcR5wpz/UVFVx5FitbgcSdrJcp7IXm83Fbs3OuLNbG3sakV4o3zkrlHfgArDxipGdo6OJKE3N2ZrnUb3uQpBPA3hzM7B3oOo39UQVyg7sU0z1YN9PI30Ku9K/bCsPYAUOktNXVNUfotgcYuOj8WoT3m2WlKOyW81WRs3ui8xqbWzl7AA/ixfBo/KIvuZ8DPtFjZ3v59Jqas4+f6zVnEwPCPYIsKPqgP40tFeP26PsqPoUU71vcGQkr0Ce66ThvoGCWMSOTl9bVWXn51aeiFiXeN+fobK7rVaQ/Yxd3BjZ2nq3VYMn+v5ZpAd+GkPnY9k/F+jC49+qmXg+IWpOvhhg6NNMdYbeoc3vXPYpVJ3Y+4J9feTy8njXjq/J1TyAh+yw9DmrHOIIgwWFx44cWSo/vU5lt1ktZyRruGuA15WnHNWeOOya7GuE7BPPa0S9DROd2FH19giRP90rdz9PwdGOFgzeRtnB5Ydk9lwx1SVTuBrg7yH7g0D/w3osJD7K8BvwSRNL1sGqfcjdFgc+SkrcE2q/cwfI0QQ70DOjfe7O83HYBfpuMdo5+llJ9GmQPUIO34Hsakp6E5GT6rf7wMDlhwtkn2dTXRLlZ3TdHzx82I+zHbIfxS3toUNLx3HTVfZii01+vkzrnRs3Wu9I8LM9s7NET5PNK6dj2U/MdXfRJWQ3vf1c1Nt4uOgDQI7oTPWn2wwz0LWpa8R+G2RH9pGRESX/nofsSVo2kuDv+TsfjoHTI7s4yC0Xz1ursLttNrfE3gDoSK9ID/SzbP7YeDqW/eIJlBzZhexr/idqTri/T6Oh6BHUvGOXsdn/dvJ3IseC2r4hNtwln38pNYkSkpLwjU+ePIBVTmJft1wUN0PtP68+U8mOPUN0+HkufM8sj3adPh1PdyZ6lyb7G6LmRKADfERjjyE3pY4D+CN4ETvYv3/EFU5hZwl4ny78N08a+Uwv2JetwUn9RGG324rdEjs+A/0zRfl5uHrm+SZpT1z2OUbetVuLxr+N7DWI3sXImepxNccJbArgH92eonravr5/Df2XDXeJvZqxa7rPfjPLlzkss0PR05dPVr3aoLDDNl56rlDjZ5/CdYOMdOduz/+iO/8Rj/297q4uGu9ayeSat4jdIzk8sHsAftuaeJ9pE1NdFFb2Df04MhL8P23nHxJXdsXxYFSidgn+oRs2aCAmDWUDodAk9o+agIZVG6X+CIQ05AcsZMC0Y4hNRkpo6RvdTgZhtStposEZZesiaOOCvyYouogKYVSmk8QkbDpKEk13EyskSyK123POvfe9+2buG2fc9NyXvySjn/me+/uc85TsXPjGf9ztESM9Cl9QujWG1KZUu1x7/6Pqjz+W3ifVUF9P8Jye4YPu/HMzLynZyeXBDkqRRFfQ578V/s7c/WVersUINE8hpd+IMOpOYJ82xxoVunXd3XX1d+/exB7fRzM8OX1MIWe7mk3ssIqX8qDrwYD9s0aC/6IRdf/irVgl7bhkwX6LdDdcHr5hCia+Lav+MjvV8rhtfpwiK3k4LUYXmtlhWef2CPi6t3cb5eVN/0h5TPVBNiXbTe9cqP4t93jS/XNiB+k/w6higa/3o0sW7G+Y7LfkKOHUDNy9X//2NvP2nKiJn9vH56WY0kAnhpSGx1UK9tpGvJNm7NzpEzbFZlnm902cO3fCyIP+q72ewaP0HP5to74rOKRkP115+s0tZmZdU7dlZ+8Dy87ett7NqR5TKoJKrdgdtfZ/PRCjHU3x/f17EmNET7tpYj/x6ad6HvSJZjsa0ZPwjF5fJh1+bK37rbDuHp8lsQC7ltnOFh5GfZ9PcRJ7D0beuB48sJuWNz39SbH+lhTN9K6NXyK6rjuSD9mHdHhk/4X+X3cMV1npzjxe7u7x2fZxHk47y6OoobuHsxf2ODyOJw9c8jQH8O+bYsaTo7lA1oiJ/QSVeeK619u5DZHbE7z00QceVq2j+0bZt4DLz5LswN5rwZ7f73jyxCVF2SG66Ogpm3fuYRU6+3butuBP6zC9YwWQjfu4mxiKQcrDw+Glg9H9w1UW7KdP/0D2ZO7xswDe6ev1TfomFbrnN97xSNMcwrOZNymhv5+KVPb0UGGzPcok5uSBI2Hsxt3E31xoXHiQfgjQpc/IdT6s+n/pvhtVnyXdezsB3Dej0j2/zuPR40qxw5O+SXuQmahZmUqs76WKOPX2mdmlM+prLpcEj/RDphpwTpDdSnc2vwN76ka7O7HPAjk0ZJ9RsffUGuxuNw5xKTu52Gh1TfiFUImvDyPdPqvjiBW7QAd4F2OvN315h5z3qqx1r2SD3cGUjXX3cUaOqvdOohF7RN5EoS68241/XHKTjG1nZQtd2Gojxv5dA0es2D/q6HB1cPg7SD9kN3FkOp1VVuyS0+duiH0vl713tlfIrmTXhXdj3kASx6Yydm63qGtG9b0c4Zv4NO+IJXsHsQt6+x27OVA51ekc/iSa7lz4jTl9Eqk+gaoL2WdeR6zn80l4BGPkkosTNpUsxCp2jg5PbRh7stdeZsWO5bcl5V3hg8Uhp/PhJ9F0r2z7cuPC57C+PjvR20vwM5w9bB9Hwjs8qEoiYRvUtVisEEvYeRw2j2az1Zl9PtFrK7Nit3cI4/hh/RY83lkVTffLlZffsI1cvPCpGXmLq6Q6kfdy2e9jolQwMleoxw1Tz5YPJWqqWIiPzQNN82hoYatc70CZFbu9w2ZijwjMd6LLR/V5Op+PGz49p6trsVWwz0rsqDsd04bnSe1J3/S+hM0Mg445NdqAzby38XqvWbG7bDYDHvAjJkfweHD59djb2t7EA5+ek9fdtdi9CPSrSD4he/zMfVjPh53XiZfLuGVqmxmaW1OSGb2vzIId0JFdp49YE+0AdOe/Y2C/wKTfvx793owcPx1YEjnqPjFhsE9y9tfmM2o9yqypVoiteXTsAZ3bC22rGd1eZsGO6DabLr2ipu0B5vLrsFPIyYU/3/4S+A/ut9i0wq42J88PxshB+K6u1sV5kl3BHlDlBuY3OZiLexTYZKadndfbUWbBLtA5vCKw4bAzJnY5rhLvYg/uz83NFXc027ZlZOfsY8EH/t/r8HgV29XaOj8hdJ9cMzt9iUJ3XNuGU+vYaHUJJnRbmQW7i2MzU2UfpSI6dveY2Y00qevm/PdjxzE3EsD/6ddlbxXsvROS7MT+X3J6RT5sfpNnQEX9zPsMzCXfy3i92lELdkN1NGXO2SEn7+6xsgv4K2H575j+Dqof9/vbuw3ZkX2V675Guq8xeBrpp0sUuhcVFfVweBkbwJG9Vn4tMvzkqAW77PA2m/KIlwa6jbBflXP/echJe/tx0p3Yu5C9C+MviH1N6M6Fn0anN8WcmPKgHQOy2iQ4mVs6pE+En5ZZsJtUt0itPeAU3T1e3cPrHhw7hsn/jF3IjsJzdvL5NRkenP7FdKFF/nt+3UA4Npi3vCBBWsii6mp2E7rFWccHTHbnD2QXsrcjOWMn2Vtbdd0n1sQ4j/DT+GDBh4Bl7n+/e+BZmPUVFBRI2xeGrmKXybOspmImu3PsXeh+3Kw7yQ70Xaur+jjP4H0zk0DOaj5MB6O8I7UJPF8H9/QXyOi7BLqC3WbTdHTLK41MLvvwO9C9/TiXXert3atks/o4z4T3+WZ8CP8a4QujvxeYbeFFbKFxVKGjR7A3S+RZ1iswLvs70Z3Y29t1l/czbvT7eUN3gPeh8qzOCXl9YUlhYSx1TmR0r4Eezj6CzJw+yvF2pnPsHemO7Ibs/pWVldUVDm4a7FB4H3Fj45VOGHwM7PIo5y1Ws98Ebs16ORMh+4bm93B2NtS1ryyDrcLj1+e41lV9TYvHFz4fw/cFAoEXDD4W9tKtclfXitXs9Qwb6aNmlmaOCd3jWdep2duPtR9bXl5YAPDvEdzfbYzz8srOh43AfYHpQGAa4CteVOfHwJ4gd3WtWM3uItW16D2dZB/Tdb9nxX5qXfYzv0HmqakFtO8XlsHbWZ/vMuDJ6enMCq8mOjk7GcL/6lz5uuzilCoF/d1RrGYXHV2zrXNj/cGYobvlXiZ0KsTtcsjMvnBlYQqQX+n2HxB9Bc2Pskvkra2L48TOzqjpQk6gNwB8RUXF1w1FUdn1gDqc1b3uYiX7NS66tp7oKLuhu9XZxR9Cf0TupaWn3L57+p1hr7CRgbOjuyO8f4VNczJ7Bju3oXsZZoHOAFVtbA40f13xu4qKkxcFfST70Rq9zPuPEL2vWMVe9rkmBvh17213gOomp1f7/CkSXnAD+VOJ/NXUqymwBXT4Za46erwfp/eXnD0tddOW3ey0spPdRWLMCbYgtObR5kDNyZMVf8FqpAr26vN/Oity/tJpVzdSrGSv17jqMRTGOSS5PDh9lHNaMhA/tPSU6z+HNgUP2Svq68sc3k/dHVXHQPJdbMOZyC8nuOoAjzUrkT3YDO3vNaxQRc25hgadvbjh4vmzZ29cLBB71iza0ipqtKJ10BCnWWzZwvbtYyZ2upaxPqcFI9dfQu+f4+wcnGRfFrqj6i/9TPUcfae9ZTNnxxt4Ig/Av2CQyIuDpaXAeYMXaKU0dnzP09kb56vLS9/T7xrxuMpRoGQv5sO7FlNtmMNjMvwwCB99jgu1tS1dIPi5pTluOjzz+GXh8tjZX+aYDsITt7PLyBbBPhocBdERP3gtWBosLS9vrj5XUyPq8p6v4ZVKZdEHvHWKGq0A3wfgMY1xxkjHGnALeEt2GOWXQoJ8iXk80511dmQ/g+DXUfbuvOwU1eVMC7PRUc6OBqIHkRH3rdJYV876+2ZddLJ+dV1iO+vqWozVv3aMMSN2JB8efvQwiu6hy0ttzOWXuMsL3XWPP8NV/2mG6uYqdfM41vLCGLOWlkEkZ+zBYFEwP6jPcKaxzljOELlmUZcYqJE85uJfhxGbwQ87eXtkFW8TqhSdndCfmnUHu7p8dXkF2NvzcizDjlLeE7K3jGLaBAMvhJafX1hUGMmup1GksUNLt7oucR+BxzTGGS5PNozPsLDH6vs48PjLYqSTxro5nX2BVM/JiHpVmbid0CmgdpDhDwJ5CfJHntvoyTMpAK4Jf4/U3c7OdNNjJtddnsjHyOXJQHoVe4jrzua4MI+/ArIv78tY/4o2eXsLhRKznBF4SoKDhaJcpZnduHDLYvcxWkGpsi4xG+N+Es8VIY3yY18xch0c26PHYeyVOLeHjBnORD+Hov8sI8araXD7b1oGOfxgCTbgF8kDBruRNJTGjum1OnUd8j7SPGtLPOjo8l/hA80Mj/bYrHvotCS7PtJNYQPsvfH82pTNP+apQsT+a3ZEXWKu0WqEfqWLO4pydV1iFw1yyXGRo8sTN6JjY+BceLDnz6V9HGOXfJ7ofx4ntsDZiQkzmAwLrWSQXUpJPp9gkCTirZRnQNNqlXWJj47QF7Mr3r8gk4PjQ/D3JHBO//w5zwWWPB7Ql/7X3dm0JpKEcbyIJqhLFkTsiGEUEqIsLi0DMmAQhuAcdhf2MszC5DIDAwM75LQX11zMeAgOBHLIB3BzyCW05DayB/fisT+Ahx7ou7f+CFtPvfSbXXnR6lbnXybkZn7+63mqu6t8nnotk5+Hml/hbe5h9k//ssp9nufzG65nTHF7B3YYXJf4ikz3p/8DLwn1GMDxa/IfHQ79lMDnUTGfz2eY8J8LILvp0zsl8kVoGx7Qyzvuu6843YzE8G1BPWryscxx9in1Yszhx+MJjAlm/zbhngM4/lFQWEpsxXb2yuy8TXlvO+a964xf26cNhsH1qL8+cV1zhfvYLWI8iMNT16dTNYWWofR1+5rBXwTXIX/15zyBzs5Q2tzE8jEnn3DXKfthcQnkpGfgdZtM+GZwHfKv8wU6W90J94gNxg705jeTJzqs90rU4MlnlJw4fy6oP48XvUpi7rd4CeCUfAKDypxgctOcmlMOfxjtpE/zczaA3m4G15+H9B6f/z0g1XHTGbyBB36B7wBPbZ++z0cHnvrJOWOE2e+Ca+//dj1nirPfhlJTOeyGOTFBmP3j9AyPd+8iMz59qtEjhPSc0YVgT+pqQXJI84R8DOCjkQFjYgC7YZqc/vP0DMNHE/HJiqZRduZ7M3Bf5tXruZO7i902fUTZMbkB5JT9o/l5CgMuacNP9YkfNELu+H4n2I+7WJwcX9G6wanvBqNn8HAvc0au52vhwm9WNKpTbvy5YF9mOP+yJmB3kRP2lnkM6FPnPi4TXshvVbTbW8x9QV3HP21NtCfVfpZA8tj1ka7DL8Pi8C3s+zHAe+5hQ4Lf2oXahRoXtf0XwZ7UuSRywq6zYQG7ZRkWBjdaLQP77n9u8yYE+DQFh6Fx47XToWBPaiiNnPkOtuu6hV8jwm6dYHiz1To2Z55VZpJyY7x0y4XZz7ntd4K9yNeVhMQ3B991OuV1Q7eoWhY8pCWP62ae09akXeMkD0o3ULORgjPfLzD7nWgPeiMh9YNXdGq6Tp0n6MYJNl60H/fmbynWp3dJ0UIXPJvz2pXo7IFkcsLugBP0nmXx7TjB3kRNWSzqcwedzk2Hs9/euOf8lain0rb8FFvUHfV1q0/gT6wHzpzMT791UOp0upi8a7O7Jv2V4IzZr9thLC/FI4I9wAOz961+jxw16j103qaeeXLcJ7O7rBZ3F8i7Xt9h0ovOVcZQKEo1AJyR632Af+wZs3om91j349n9EqnNS4txd7nrhJ7pTtRTaROFpJRKTR8MMDjAP579ry9f6rVM7t6Hlqlc9mCX9EgldYlZCXZg99n+SdBP6sc4Ck+Unb76RI9i/8c5a1Sv1wqFXM75EJI5+O5EoVp1mqR66pB3XfFOI17UT2ojicKUwmwfDPqUvddf8EwpL9n4wWmR6qvB7sQ7+H4T3E+q2dxOoHBVbAy4OLwkdje813eS6LkC+0k9XHteTsB72Xvy2P29sG3f7XC/sXvr+Hwvx1EUUgYOvDzf/3jrrUftrr1PFznsfEA/KcK+l0DRyJ70rim/MLurLnGw79BpZKafFGEvx1B0Un3Gy5vzwfFOOk5c8gYzPt834ihKceNl53mB77TPyGVQH7HfYyhqqZx9IG3Oe/pBz7IH9hHbi6Po5TdeRrz7+797e6zM+l7eRMuRElaeD473Wd8jS+yiNZ7a3gvb95l4L22hZcqe9VH47ukfd7mJlq18Q/L6/va+9Z37fnmQQCsg5SgE3z/cG++rAc7g+/LW9wfz/E4SrZCURkR5vtNdHcedmI8iz5dWD5xkezVs33ezaFWVUhoyr+t8eX4/jlZaRbUXSp7fz6I1kKLKjvfn2SRaFynqibTnNuvEzTK+2pDgezWbQuuooqIeLcBeLfyM1lkY//Dp7M+r2fXG9vA/lr1ay+ZS6DtTPp9RDw9F7PV6ofAdQvsnQR5Lsb85kcstZXL/DypaYj0tPsFIAAAAAElFTkSuQmCC"
    />
  </defs>
</svg>`;
var basilisk = x`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="48"
  height="48"
  viewBox="0 0 48 48"
  fill="none"
>
  <g clip-path="url(#clip0_1300_1200)">
    <path
      d="M23.9986 3.94788e-08C28.7455 -0.000272167 33.3858 1.40711 37.3328 4.04415C41.2798 6.6812 44.3562 10.4295 46.1728 14.815C47.9895 19.2004 48.4649 24.0262 47.5389 28.6818C46.6129 33.3375 44.3271 37.614 40.9705 40.9706C37.614 44.3271 33.3375 46.6129 28.6818 47.5389C24.0261 48.4649 19.2004 47.9895 14.815 46.1728C10.4295 44.3562 6.6812 41.2798 4.04415 37.3328C1.40711 33.3858 -0.000272167 28.7455 3.94788e-08 23.9986C3.94788e-08 20.8471 0.620748 17.7264 1.82679 14.8147C3.03283 11.9031 4.80055 9.25751 7.02903 7.02903C9.25751 4.80055 11.9031 3.03283 14.8147 1.82679C17.7264 0.620742 20.8471 3.94788e-08 23.9986 3.94788e-08ZM16.1688 23.9986C16.1688 35.5967 23.9986 44.9983 23.9986 44.9983C23.9986 44.9983 31.8284 35.5967 31.8284 23.9986C31.8284 12.4005 23.9986 3.00034 23.9986 3.00034C23.9986 3.00034 16.1688 12.4019 16.1688 23.9986Z"
      fill="#4FFFB0"
    />
  </g>
  <defs>
    <clipPath id="clip0_1300_1200">
      <rect width="48" height="48" rx="24" fill="white" />
    </clipPath>
  </defs>
</svg>`;
var bifrost = x`<svg
  xmlns="http://www.w3.org/2000/svg"
  xmlns:xlink="http://www.w3.org/1999/xlink"
  width="48px"
  height="48px"
  viewBox="0 0 48 48"
  version="1.1"
>
  <defs>
    <linearGradient
      id="linear0"
      gradientUnits="userSpaceOnUse"
      x1="32.0001"
      y1="0"
      x2="32.0001"
      y2="64"
      gradientTransform="matrix(0.75,0,0,0.75,0,0)"
    >
      <stop offset="0" style="stop-color:rgb(87.058824%,100%,96.470588%);stop-opacity:1;" />
      <stop offset="0.201333" style="stop-color:rgb(87.843137%,96.470588%,100%);stop-opacity:1;" />
      <stop offset="0.403244" style="stop-color:rgb(87.058824%,91.764706%,100%);stop-opacity:1;" />
      <stop offset="0.602076" style="stop-color:rgb(98.431373%,91.372549%,100%);stop-opacity:1;" />
      <stop offset="0.801867" style="stop-color:rgb(100%,92.156863%,92.156863%);stop-opacity:1;" />
      <stop offset="1" style="stop-color:rgb(100%,95.686275%,84.313725%);stop-opacity:1;" />
    </linearGradient>
  </defs>
  <g id="surface1">
    <path
      style=" stroke:none;fill-rule:nonzero;fill:url(#linear0);"
      d="M 48 24 C 48 37.253906 37.253906 48 24 48 C 10.746094 48 0 37.253906 0 24 C 0 10.746094 10.746094 0 24 0 C 37.253906 0 48 10.746094 48 24 Z M 48 24 "
    />
    <path
      style=" stroke:none;fill-rule:nonzero;fill:rgb(0%,0%,0%);fill-opacity:1;"
      d="M 34.75 15.75 L 29.25 15.75 L 12.75 32.25 L 23.75 32.25 Z M 34.75 15.75 "
    />
  </g>
</svg>`;
var bitcoin = x`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="48"
  height="48"
  viewBox="0 0 48 48"
  fill="none"
>
  <g clip-path="url(#clip0_1904_3699)">
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M48.5312 24.5C48.5312 38.1777 37.4433 49.2656 23.7656 49.2656C10.0879 49.2656 -1 38.1777 -1 24.5C-1 10.8223 10.0879 -0.265625 23.7656 -0.265625C37.4433 -0.265625 48.5312 10.8223 48.5312 24.5ZM17.0653 11.8487L17.0469 11.8437L17.0469 11.8437C17.0198 11.8708 17.0021 11.8885 17.0036 11.8903C17.005 11.8919 17.0229 11.8798 17.0653 11.8487ZM17.226 11.8915C17.1724 11.8775 17.1189 11.8633 17.0653 11.8487C17.1088 11.8168 17.1779 11.765 17.2813 11.6875C17.2628 11.755 17.2444 11.823 17.226 11.8915ZM17.226 11.8915C17.596 11.988 17.966 12.0721 18.336 12.1562C18.7656 12.2539 19.1953 12.3515 19.625 12.4687C20.0547 12.5859 20.4844 12.6836 20.9141 12.7812C21.3438 12.8789 21.7735 12.9765 22.2031 13.0937C22.4375 13.1718 22.5156 13.0937 22.5938 12.8593C22.75 12.1953 22.9063 11.5507 23.0625 10.9062C23.2188 10.2617 23.375 9.61715 23.5313 8.95309C23.6094 8.71871 23.6875 8.64059 23.9219 8.71871C24.7031 8.95309 25.4063 9.10934 26.1875 9.26559C26.4219 9.34371 26.4219 9.42184 26.3438 9.57809C26.1875 10.2031 26.0313 10.8476 25.875 11.4921C25.7188 12.1367 25.5625 12.7812 25.4063 13.4062C25.4063 13.4843 25.4063 13.5625 25.3281 13.7187C25.6406 13.7968 25.9727 13.875 26.3047 13.9531C26.6367 14.0312 26.9688 14.1093 27.2813 14.1875C27.3334 14.1875 27.3854 14.118 27.4375 14.0486C27.4636 14.0139 27.4896 13.9791 27.5156 13.9531C27.75 12.9375 27.9844 12 28.2969 10.9843L28.5313 10.0468C28.5313 9.89059 28.6094 9.81246 28.7656 9.89059C29.2103 10.024 29.655 10.1321 30.114 10.2437L30.1141 10.2437C30.4615 10.3281 30.8173 10.4146 31.1875 10.5156C31.2266 10.5156 31.2461 10.5351 31.2656 10.5546C31.2852 10.5742 31.3047 10.5937 31.3438 10.5937C31.1094 11.6093 30.875 12.5468 30.6406 13.4843C30.5625 13.875 30.4844 14.2656 30.3281 14.6562C30.25 14.8906 30.3281 14.9687 30.5625 15.0468L33.1406 16.2187C33.9219 16.6875 34.625 17.3125 35.1719 18.0937C35.875 19.2656 35.9531 20.5156 35.6406 21.7656C35.4063 22.625 35.0938 23.4062 34.4688 24.0312C34 24.5 33.375 24.8125 32.75 25.0468C32.7177 25.0468 32.6853 25.0602 32.6474 25.0759C32.5938 25.0982 32.529 25.125 32.4375 25.125C32.5938 25.2421 32.75 25.3398 32.9063 25.4375C33.0625 25.5351 33.2188 25.6328 33.375 25.75C34.3125 26.4531 34.9375 27.3125 35.25 28.4062C35.4063 29.2656 35.3281 30.2031 35.0938 31.0625C34.7813 32.1562 34.3906 33.0937 33.6875 33.9531C32.8281 34.9687 31.7344 35.5156 30.4844 35.6718C28.8438 35.9062 27.2813 35.75 25.7188 35.5156C25.4844 35.4375 25.3281 35.5156 25.25 35.75C25.0938 36.375 24.9375 37.0195 24.7813 37.664C24.625 38.3086 24.4688 38.9531 24.3125 39.5781L24.3028 39.6171C24.2337 39.8969 24.2176 39.962 23.8438 39.8125C23.4922 39.7343 23.1211 39.6367 22.75 39.539C22.3789 39.4414 22.0078 39.3437 21.6563 39.2656C21.4219 39.1875 21.4219 39.1093 21.5 38.9531C21.8125 37.625 22.125 36.2968 22.5156 35.0468C22.5156 35.0032 22.5217 34.9657 22.5271 34.9325C22.541 34.847 22.5501 34.7906 22.4375 34.7343C21.8125 34.5781 21.1875 34.4218 20.4844 34.2656C20.4063 34.6171 20.3086 34.9687 20.211 35.3203C20.1133 35.6718 20.0156 36.0234 19.9375 36.375C19.8594 36.7265 19.7617 37.0781 19.6641 37.4296C19.5664 37.7812 19.4688 38.1328 19.3906 38.4843C19.3813 38.5029 19.3732 38.5204 19.3656 38.5367C19.3092 38.657 19.2846 38.7094 19.0781 38.6406C18.2969 38.4062 17.5156 38.25 16.7344 38.0937C16.5 38.0156 16.5 37.9375 16.5781 37.7812C16.8906 36.4531 17.2031 35.125 17.5938 33.875C17.5938 33.8426 17.6072 33.8102 17.6229 33.7723C17.6451 33.7187 17.6719 33.654 17.6719 33.5625C15.875 33.0937 14.0781 32.625 12.2031 32.1562C12.2813 32 12.3399 31.8632 12.3985 31.7265C12.4571 31.5898 12.5156 31.4531 12.5938 31.2968C12.9063 30.5937 13.2188 29.8906 13.4531 29.2656C13.5313 29.0312 13.6094 29.0312 13.8438 29.0312C14.3906 29.1875 15.0156 29.3437 15.5625 29.4218C16.1875 29.5781 16.6563 29.2656 16.7344 28.7187C17.75 24.7343 18.7656 20.75 19.7031 16.6875C19.8594 16.0625 19.4688 15.3593 18.7656 15.125C18.2004 14.9366 17.6352 14.7986 17.1106 14.6706C16.9826 14.6394 16.857 14.6087 16.7344 14.5781C16.5781 14.5781 16.5 14.5 16.5781 14.3437C16.6953 13.914 16.8125 13.4648 16.9297 13.0156C17.0285 12.637 17.1272 12.2584 17.226 11.8915ZM21.0312 31.1407C21.1093 31.1407 21.1875 31.2189 21.1875 31.2189C21.3832 31.2678 21.5808 31.3186 21.78 31.3699L21.7802 31.3699C22.8534 31.646 23.9736 31.9342 25.0937 32.0001C26.0312 32.0782 26.8906 32.0782 27.75 31.7657C29.2343 31.297 29.8593 29.3439 29 28.0939C28.6093 27.4689 27.9843 27.0782 27.3593 26.6876C25.9944 25.9293 24.4087 25.6126 22.8879 25.3089L22.8878 25.3089L22.75 25.2814C22.5363 25.2102 22.5174 25.2688 22.4566 25.4571L22.4565 25.4574C22.4506 25.4757 22.4443 25.4951 22.4375 25.5157C22.3593 25.9064 22.2617 26.2775 22.164 26.6486C22.0664 27.0196 21.9687 27.3907 21.8906 27.7814C21.7125 28.4046 21.5598 29.0278 21.4036 29.6655L21.4036 29.6655C21.2856 30.1469 21.1656 30.6366 21.0312 31.1407ZM28.4531 23.0156C28.1406 23.0938 27.75 23.1719 27.5937 23.1719C26.687 23.1719 25.9037 23.0486 25.0945 22.9212C24.7882 22.873 24.4781 22.8242 24.1562 22.7812C24 22.7422 23.8632 22.7031 23.7265 22.6641C23.5898 22.625 23.4531 22.5859 23.2968 22.5469C23.1406 22.4688 23.0625 22.3906 23.1406 22.2344C23.6093 20.5938 24 19.0312 24.3906 17.3906C24.4687 17.1562 24.5468 17.0781 24.7812 17.1562C25.0139 17.2183 25.2435 17.2773 25.4706 17.3356C26.3874 17.5711 27.264 17.7962 28.1406 18.1719C28.8437 18.4844 29.5468 18.9531 29.9375 19.6562C30.7187 20.9844 29.9375 22.7031 28.4531 23.0156Z"
      fill="#F5B300"
    />
  </g>
  <defs>
    <clipPath id="clip0_1904_3699">
      <rect width="48" height="48" rx="24" fill="white" />
    </clipPath>
  </defs>
</svg>`;
var calamari = x`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="48"
  height="48"
  viewBox="0 0 48 48"
  fill="none"
>
  <g clip-path="url(#clip0_1301_798)">
    <path
      d="M0 14C0 6.26801 6.26801 0 14 0H34C41.732 0 48 6.26801 48 14V34C48 41.732 41.732 48 34 48H14C6.26801 48 0 41.732 0 34V14Z"
      fill="url(#paint0_linear_1301_798)"
    />
    <path
      d="M39.7873 17.2448C37.9494 16.1827 35.5666 17.1894 35.0864 19.249C34.7724 20.5974 35.2803 21.9181 36.4163 22.7493C36.5918 22.8786 36.5733 22.9894 36.5364 23.1371C36.3332 24.0238 35.9361 24.818 35.3912 25.5384C33.9042 27.3301 31.5492 28.1613 29.268 27.6441C28.3813 27.4502 27.3839 26.8499 26.7282 27.5056C26.2479 27.9858 26.2756 28.4661 26.4049 28.9094C26.9406 30.7473 26.7466 32.6406 25.7215 34.2476C24.7702 35.7345 22.9139 36.5103 21.6394 36.8058C21.4454 36.852 21.1683 36.9536 21.039 36.6765C20.568 35.6329 19.6537 35.1249 18.5454 34.9864C14.8235 34.6539 13.6506 39.5673 16.9292 41.1835C18.527 41.9685 20.5403 41.2389 21.233 39.595C21.3161 39.401 21.4177 39.3179 21.6301 39.2994C22.9416 39.1794 24.1699 38.7545 25.2782 38.0526C26.331 37.3877 27.1992 36.5103 27.8642 35.4574C28.8154 33.9428 29.231 32.2804 29.1756 30.4887C29.1664 30.1562 29.1571 30.1654 29.4989 30.2116C32.5835 30.6734 35.8345 29.3342 37.6262 26.7575C38.1249 26.0371 38.6698 24.4209 38.9838 23.562C39.0577 23.3588 39.1039 23.2572 39.3071 23.2018C42.0223 22.3614 42.244 18.6025 39.7873 17.2448ZM18.2868 39.4103C16.7537 39.3733 16.6614 37.0829 18.2499 37.0552C19.7276 37.0737 19.9031 39.3179 18.2868 39.4103ZM38.2727 21.2716C37.6077 21.2623 37.072 20.7359 37.0813 20.0894C37.1182 18.4732 39.4271 18.5932 39.4179 20.1633C39.3994 20.7913 38.9007 21.2808 38.2727 21.2716ZM20.7805 31.5877C16.6337 31.5231 11.9512 30.3132 9.67003 26.5451C7.00095 22.3706 8.84807 17.3095 9.19902 12.7656C9.29137 11.7404 9.32832 10.7153 9.2452 9.69012C9.1159 8.75733 9.93787 8.08313 10.8152 8.28631C11.628 8.43408 12.4499 8.56338 13.2719 8.53568C16.3381 8.45256 22.5999 7.9446 25.2043 9.07134C28.7323 10.6044 30.9673 14.1417 31.346 17.8267C31.5214 19.2028 31.5307 20.5974 31.4014 21.9827C31.3367 22.6754 30.8011 23.1464 30.1176 23.1187C29.5173 23.1002 28.9724 22.5922 28.917 22.0012C28.9078 21.9458 28.917 21.8811 28.917 21.8165C29.3141 16.8108 28.0212 11.4911 22.1935 10.9462C20.5311 10.7799 18.8687 10.8908 17.2063 10.9646C15.47 11.0385 13.7429 11.0847 12.0066 10.9277C11.8681 10.9185 11.7757 10.9092 11.7757 11.1032C11.7665 13.3659 11.3971 15.5917 11.0738 17.8174C10.6213 20.819 10.3442 24.0976 12.6901 26.4158C14.8604 28.4661 17.9636 29.0664 20.8636 29.0849C22.4152 29.1588 22.5352 31.5785 20.7805 31.5877ZM19.3489 22.7031C21.5562 22.8047 21.6024 25.9725 19.3766 26.0279C18.4438 26.0187 17.705 25.2429 17.7142 24.2916C17.7142 23.3957 18.4346 22.6938 19.3489 22.7031ZM24.3362 18.1592C26.5619 18.2238 26.6081 21.4193 24.41 21.4932C23.4957 21.4932 22.7199 20.7267 22.7107 19.8308C22.7107 18.8795 23.4126 18.1499 24.3362 18.1592Z"
      fill="white"
    />
  </g>
  <defs>
    <linearGradient
      id="paint0_linear_1301_798"
      x1="48"
      y1="48"
      x2="-2.62577e-05"
      y2="2.62577e-05"
      gradientUnits="userSpaceOnUse"
    >
      <stop stop-color="#5C09BA" />
      <stop offset="0.583333" stop-color="#C72F9E" />
      <stop offset="1" stop-color="#FCA027" />
    </linearGradient>
    <clipPath id="clip0_1301_798">
      <rect width="48" height="48" rx="24" fill="white" />
    </clipPath>
  </defs>
</svg>`;
var centrifuge = x`
  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
    <g clip-path="url(#clip0_1300_1323)">
      <path
        d="M0 14C0 6.26801 6.26801 0 14 0H34C41.732 0 48 6.26801 48 14V34C48 41.732 41.732 48 34 48H14C6.26801 48 0 41.732 0 34V14Z"
        fill="url(#paint0_linear_1300_1323)"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M10.2632 34.3956C9.19716 32.1078 8.60168 29.5553 8.60168 26.8635C8.60168 17.0228 16.5596 9.04546 26.3761 9.04546C31.8422 9.04546 36.7317 11.519 39.9922 15.4102L41.9375 13.774C38.2111 9.32688 32.6231 6.5 26.3761 6.5C15.1572 6.5 6.0625 15.6171 6.0625 26.8635C6.0625 29.9399 6.74301 32.8569 7.96137 35.4715L10.2632 34.3956ZM26.3762 38.9548C19.715 38.9548 14.315 33.5414 14.315 26.8639C14.315 20.1864 19.715 14.7731 26.3762 14.7731C30.0853 14.7731 33.4027 16.452 35.6152 19.0924L37.5609 17.4558C34.8827 14.2595 30.8661 12.2277 26.3762 12.2277C18.3126 12.2277 11.7757 18.7805 11.7757 26.8639C11.7757 34.9474 18.3126 41.5001 26.3762 41.5001V38.9548ZM26.3758 32.5903C28.1327 32.5903 29.7043 31.7949 30.7523 30.5443L32.5298 32.84C30.9721 34.4515 28.7911 35.4539 26.3758 35.4539C21.6428 35.4539 17.806 31.6075 17.806 26.863C17.806 22.1184 21.6428 18.2721 26.3758 18.2721C29.0114 18.2721 31.3683 19.465 32.9404 21.3412L30.7523 23.1818C29.7043 21.931 28.1327 21.1358 26.3758 21.1358C23.2205 21.1358 20.6626 23.6999 20.6626 26.863C20.6626 30.0261 23.2205 32.5903 26.3758 32.5903Z"
        fill="white"
      />
    </g>
    <defs>
      <linearGradient
        id="paint0_linear_1300_1323"
        x1="48"
        y1="48"
        x2="0.146965"
        y2="-0.14607"
        gradientUnits="userSpaceOnUse"
      >
        <stop />
        <stop offset="1" stop-color="#3F3F3F" />
      </linearGradient>
      <clipPath id="clip0_1300_1323">
        <rect width="48" height="48" rx="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
`;
var dai = x`<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
  <g clip-path="url(#clip0_1926_4376)">
    <path
      d="M0 14C0 6.26801 6.26801 0 14 0H34C41.732 0 48 6.26801 48 14V34C48 41.732 41.732 48 34 48H14C6.26801 48 0 41.732 0 34V14Z"
      fill="url(#paint0_linear_1926_4376)"
    />
    <g clip-path="url(#clip1_1926_4376)">
      <g clip-path="url(#clip2_1926_4376)">
        <path
          d="M24 -0.0576172C37.2879 -0.0576172 48.0576 10.7143 48.0576 24C48.0576 37.2879 37.2879 48.0576 24 48.0576C10.7143 48.0576 -0.0576172 37.2868 -0.0576172 24C-0.0576172 10.7143 10.7143 -0.0576172 24 -0.0576172Z"
          fill="#F5AC37"
        />
        <path
          d="M24.8785 25.6989H34.02C34.2149 25.6989 34.3069 25.6989 34.321 25.4434C34.3957 24.5134 34.3957 23.578 34.321 22.647C34.321 22.4662 34.2311 22.3915 34.0352 22.3915H15.842C15.6169 22.3915 15.5562 22.4662 15.5562 22.6773V25.3535C15.5562 25.6989 15.5562 25.6989 15.9167 25.6989H24.8785V25.6989ZM33.3001 19.2639C33.3261 19.1957 33.3261 19.121 33.3001 19.0538C33.1475 18.7215 32.9667 18.4043 32.7566 18.1066C32.4405 17.5977 32.0681 17.129 31.6437 16.7078C31.4434 16.4534 31.2118 16.225 30.9519 16.0312C29.6506 14.9237 28.1036 14.1399 26.4407 13.7458C25.6017 13.5575 24.7443 13.4676 23.8847 13.4752H15.8106C15.5855 13.4752 15.5551 13.565 15.5551 13.761V19.0982C15.5551 19.3234 15.5551 19.384 15.8409 19.384H33.1918C33.1918 19.384 33.3423 19.3537 33.3726 19.2639H33.299H33.3001ZM33.3001 28.8265C33.0446 28.7984 32.7869 28.7984 32.5314 28.8265H15.8572C15.632 28.8265 15.5562 28.8265 15.5562 29.1275V34.3456C15.5562 34.586 15.5562 34.6466 15.8572 34.6466H23.5556C23.9237 34.6747 24.2918 34.6487 24.6523 34.5719C25.7695 34.4918 26.8683 34.2493 27.9163 33.8498C28.2974 33.7177 28.6655 33.5456 29.013 33.3388H29.118C30.9227 32.4002 32.3885 30.9257 33.3131 29.1156C33.3131 29.1156 33.4181 28.8882 33.3001 28.8287V28.8265ZM12.5347 37.352V37.2622V33.7588V32.5712V29.0376C12.5347 28.8417 12.5347 28.8124 12.2943 28.8124H9.03137C8.85058 28.8124 8.77588 28.8124 8.77588 28.5721V25.7151H12.264C12.4589 25.7151 12.5347 25.7151 12.5347 25.4596V22.6329C12.5347 22.4521 12.5347 22.4078 12.2943 22.4078H9.03137C8.85058 22.4078 8.77588 22.4078 8.77588 22.1674V19.5215C8.77588 19.3559 8.77588 19.3115 9.01622 19.3115H12.2489C12.4741 19.3115 12.5347 19.3115 12.5347 19.0257V10.9213C12.5347 10.681 12.5347 10.6204 12.8356 10.6204H24.112C24.9305 10.6528 25.7435 10.7427 26.5479 10.891C28.2054 11.1974 29.7979 11.7896 31.254 12.6351C32.2197 13.2035 33.1085 13.8898 33.8999 14.6801C34.4953 15.2983 35.0323 15.9673 35.5086 16.6797C35.9817 17.4018 36.3747 18.1737 36.6832 18.9802C36.7211 19.1903 36.9225 19.3321 37.1325 19.2963H39.8239C40.1692 19.2963 40.1692 19.2963 40.1844 19.6276V22.0938C40.1844 22.3341 40.0945 22.3948 39.8531 22.3948H37.7777C37.5677 22.3948 37.5071 22.3948 37.5223 22.6654C37.6045 23.5813 37.6045 24.5004 37.5223 25.4163C37.5223 25.6718 37.5223 25.7021 37.8091 25.7021H40.1833C40.2883 25.8374 40.1833 25.9728 40.1833 26.1092C40.1984 26.2835 40.1984 26.4599 40.1833 26.6342V28.4541C40.1833 28.7096 40.1086 28.7854 39.8823 28.7854H37.0405C36.8424 28.7475 36.6497 28.8741 36.6042 29.0712C35.9276 30.8304 34.845 32.4078 33.4462 33.6722C32.9353 34.1323 32.3983 34.5654 31.8375 34.9649C31.2356 35.3113 30.6499 35.6718 30.0328 35.9576C28.8971 36.4686 27.7063 36.8454 26.484 37.0846C25.3235 37.2925 24.1467 37.3867 22.9656 37.3704H12.5303V37.3553L12.5347 37.352Z"
          fill="#FEFEFD"
        />
      </g>
    </g>
  </g>
  <defs>
    <linearGradient id="paint0_linear_1926_4376" x1="48" y1="48" x2="0" y2="0" gradientUnits="userSpaceOnUse">
      <stop stop-color="#E6335B" />
      <stop offset="1" stop-color="#0036F5" />
    </linearGradient>
    <clipPath id="clip0_1926_4376">
      <rect width="48" height="48" rx="24" fill="white" />
    </clipPath>
    <clipPath id="clip1_1926_4376">
      <rect x="-0.0576172" y="-0.0576172" width="48.1152" height="48.1152" rx="24.0576" fill="white" />
    </clipPath>
    <clipPath id="clip2_1926_4376">
      <rect width="48.1152" height="48.1152" fill="white" transform="translate(-0.0576172 -0.0576172)" />
    </clipPath>
  </defs>
</svg>`;
var dot = x`<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
  <g clip-path="url(#clip0_2055_4451)">
    <g clip-path="url(#clip1_2055_4451)">
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M23.74 0.0368652C37.197 0.0368652 48.1031 10.943 48.1031 24.4C48.1031 37.8569 37.197 48.7631 23.74 48.7631C10.2831 48.7631 -0.623047 37.8569 -0.623047 24.4C-0.623047 10.943 10.2831 0.0368652 23.74 0.0368652Z"
        fill="#E60079"
      />
      <path
        d="M23.74 6.96289C27.2146 6.96289 30.0269 8.60143 30.0269 10.6235C30.0269 12.6455 27.2088 14.284 23.74 14.284C20.2654 14.284 17.4531 12.6455 17.4531 10.6235C17.4531 8.60143 20.2712 6.96289 23.74 6.96289Z"
        fill="white"
      />
      <path
        d="M23.74 34.5217C27.2146 34.5217 30.0269 36.1603 30.0269 38.1823C30.0269 40.2043 27.2088 41.8429 23.74 41.8429C20.2654 41.8429 17.4531 40.2043 17.4531 38.1823C17.4531 36.1603 20.2712 34.5217 23.74 34.5217Z"
        fill="white"
      />
      <path
        d="M8.63853 15.6786C10.3758 12.6688 13.1997 11.0535 14.9545 12.0645C16.7034 13.0755 16.715 16.3352 14.9777 19.3392C13.2404 22.349 10.4165 23.9643 8.66177 22.9532C6.91284 21.9422 6.90121 18.6826 8.63853 15.6786Z"
        fill="white"
      />
      <path
        d="M32.5077 29.4609C34.245 26.4511 37.0689 24.8358 38.8178 25.841C40.5667 26.852 40.5783 30.1058 38.841 33.1156C37.1037 36.1254 34.2798 37.7407 32.5309 36.7355C30.782 35.7245 30.7704 32.4707 32.5077 29.4609Z"
        fill="white"
      />
      <path
        d="M8.66177 25.8411C10.4107 24.83 13.2404 26.4511 14.9777 29.4551C16.715 32.4649 16.7034 35.7188 14.9545 36.7298C13.2055 37.7408 10.3758 36.1197 8.63853 33.1157C6.90121 30.1059 6.91284 26.8521 8.66177 25.8411Z"
        fill="white"
      />
      <path
        d="M32.5309 12.0644C34.2798 11.0534 37.1037 12.6745 38.841 15.6843C40.5783 18.6941 40.5667 21.9479 38.8178 22.9589C37.0689 23.9699 34.245 22.3488 32.5077 19.339C30.7704 16.3292 30.782 13.0754 32.5309 12.0644Z"
        fill="white"
      />
    </g>
  </g>
  <defs>
    <clipPath id="clip0_2055_4451">
      <rect width="48" height="48" rx="24" fill="white" />
    </clipPath>
    <clipPath id="clip1_2055_4451">
      <rect width="48.7029" height="48.7029" fill="white" transform="translate(-0.611816 0.048584)" />
    </clipPath>
  </defs>
</svg>`;
var hydraDX = x`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="48"
  height="48"
  viewBox="0 0 48 48"
  fill="none"
>
  <g clip-path="url(#clip0_1300_1288)">
    <path
      d="M0 14C0 6.26801 6.26801 0 14 0H34C41.732 0 48 6.26801 48 14V34C48 41.732 41.732 48 34 48H14C6.26801 48 0 41.732 0 34V14Z"
      fill="#F6297C"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M4.75 24.0007L24.0068 4.75L43.25 24.0057L24.0068 43.25L4.75 24.0007V24.0007ZM35.3779 18.2227C34.5779 19.1167 32.8333 21.3678 32.8333 24.0007C32.8333 26.6336 34.5779 28.8847 35.3779 29.7786C30.2384 29.5066 26.129 24.0007 26.129 24.0007C26.129 24.0007 30.2384 18.4947 35.3779 18.2227V18.2227ZM12.6499 18.2227C17.7894 18.4947 21.8988 24.0007 21.8988 24.0007C21.8988 24.0007 17.7894 29.5066 12.6499 29.7786C13.4499 28.8847 15.1944 26.6336 15.1944 24.0007C15.1944 21.3678 13.4499 19.1167 12.6499 18.2227V18.2227ZM11.8356 18.2568C11.0224 19.172 9.32048 21.4001 9.32048 24.0007C9.32048 26.6114 11.0358 28.8469 11.8451 29.7553L16.008 33.9216L16.0276 33.9024C17.6942 32.2727 20.4647 30.1308 23.6231 29.9677C22.8279 30.8542 21.0744 33.1083 21.0744 35.7461C21.0744 38.3839 22.8279 40.638 23.6231 41.5245L24.0068 41.9266L24.3904 41.5245C25.1856 40.638 26.9391 38.3839 26.9391 35.7461C26.9391 33.1083 25.1856 30.8542 24.3904 29.9677C27.5612 30.1315 30.341 32.2895 32.0055 33.9216L36.2666 29.657L36.2765 29.6457C37.1191 28.6775 38.7073 26.5129 38.7073 24.0007C38.7073 21.4787 37.1066 19.3069 36.2666 18.3444L32.0253 14.0997L32.0058 14.1189C30.3409 15.7507 27.5612 17.9087 24.3904 18.0725C25.1856 17.1859 26.9391 14.9319 26.9391 12.2941C26.9391 9.65627 25.1856 7.4022 24.3904 6.51568L24.0068 6.07479L23.6231 6.51568C22.8279 7.4022 21.0744 9.65627 21.0744 12.2941C21.0744 14.9319 22.8279 17.1859 23.6231 18.0725C20.4399 17.9081 17.6509 15.7338 15.9882 14.0997L11.8356 18.2568V18.2568Z"
      fill="white"
    />
  </g>
  <defs>
    <clipPath id="clip0_1300_1288">
      <rect width="48" height="48" rx="24" fill="white" />
    </clipPath>
  </defs>
</svg>`;
var ibtc = x` <svg
  xmlns="http://www.w3.org/2000/svg"
  width="48"
  height="48"
  viewBox="0 0 48 48"
  fill="none"
>
  <g clip-path="url(#clip0_2259_3798)">
    <g clip-path="url(#clip1_2259_3798)">
      <path
        d="M24 51.25C39.0498 51.25 51.25 39.0498 51.25 24C51.25 8.95024 39.0498 -3.25 24 -3.25C8.95024 -3.25 -3.25 8.95024 -3.25 24C-3.25 39.0498 8.95024 51.25 24 51.25Z"
        fill="white"
      />
      <path
        d="M41.0374 38.0065H17.2424C17.129 38.0063 17.018 37.9746 16.9213 37.9154L8.32422 32.607C8.20832 32.5388 8.11833 32.4341 8.0683 32.3093C8.01828 32.1846 8.01106 32.0466 8.04776 31.9174C8.08446 31.788 8.16304 31.6745 8.27117 31.5944C8.3793 31.5146 8.51086 31.4729 8.6453 31.4757H32.4403C32.5537 31.4754 32.6649 31.5072 32.7613 31.5668L41.3585 36.8741C41.4749 36.942 41.5654 37.0468 41.6158 37.172C41.6661 37.2969 41.6735 37.4351 41.6367 37.5647C41.6001 37.6944 41.5211 37.8083 41.4128 37.8881C41.3042 37.9682 41.1722 38.0099 41.0374 38.0065ZM17.4156 36.783H38.8881L32.2672 32.6983H10.7946L17.4156 36.783ZM39.5566 16.6931H15.7616C15.6483 16.6927 15.5372 16.6612 15.4405 16.6019L6.84242 11.2935C6.72677 11.2255 6.63691 11.1211 6.58686 10.9966C6.53679 10.8721 6.52934 10.7345 6.56564 10.6054C6.60196 10.4762 6.68 10.3627 6.7876 10.2825C6.89519 10.2023 7.02629 10.16 7.16045 10.1622H30.9626C31.0758 10.1625 31.187 10.1941 31.2836 10.2533L39.8757 15.5617C39.9915 15.6299 40.0815 15.7346 40.1316 15.8594C40.1816 15.9842 40.1888 16.1221 40.152 16.2514C40.1154 16.3807 40.0368 16.4943 39.9287 16.5742C39.8205 16.6541 39.689 16.6959 39.5546 16.6931H39.5566ZM15.9348 15.4706H37.4074L30.7863 11.3847H9.31378L15.9348 15.4706Z"
        fill="#1A0A2D"
      />
      <path
        d="M24.5264 23.7607C25.0196 23.7607 25.6709 23.7051 26.0366 23.3332C26.126 23.2525 26.1974 23.1535 26.2453 23.043C26.2932 22.9323 26.3166 22.8127 26.314 22.6922C26.3019 21.8463 25.6051 21.5477 24.9517 21.5496H23.9692L23.9754 23.7202L24.0868 23.7334C24.2328 23.7506 24.3795 23.7598 24.5264 23.7607ZM25.0167 24.4626L23.9795 24.4738L23.9875 27.0189H25.0379C25.8078 27.0189 26.6302 26.6798 26.6321 25.7418C26.6385 25.5873 26.6131 25.4331 26.5578 25.2888C26.5022 25.1444 26.4181 25.0129 26.31 24.9022C25.8978 24.4919 25.2161 24.4615 25.0167 24.4626Z"
        fill="#FF9900"
      />
      <path
        d="M29.0023 19.6598C27.8208 18.5483 26.2486 17.9473 24.6268 17.9875H24.5621C22.9252 18.0431 21.3768 18.7441 20.2551 19.9376C19.1334 21.1308 18.5294 22.7196 18.5752 24.3568C18.6209 25.9939 19.3126 27.5465 20.4993 28.6753C21.6859 29.8042 23.2709 30.4178 24.9085 30.3818H24.9702C26.1956 30.3413 27.3816 29.9383 28.3779 29.2239C29.3743 28.5092 30.1366 27.5154 30.5682 26.3677C30.9997 25.22 31.0812 23.9704 30.8025 22.7763C30.5239 21.5822 29.8973 20.4977 29.0023 19.6598ZM27.1508 27.3807C26.7678 27.5316 26.361 27.6127 25.9495 27.6208H25.8241L25.8139 27.7464V28.9729H24.8953V27.6117L23.9907 27.6187V28.971H23.065L23.0629 27.6238L21.5073 27.6359V27.0281H22.0845C22.2016 27.0277 22.3135 26.9809 22.3959 26.8978C22.4783 26.8148 22.5243 26.7026 22.5241 26.5855L22.509 21.9965C22.509 21.7674 22.3265 21.6084 22.0672 21.6084L21.4879 21.5679V20.7212H23.0599V19.3264H23.9715V20.7232H24.8831V19.3234H25.7947V20.7242H25.9627C26.2778 20.7242 27.8568 21.0523 27.8608 22.3307C27.8608 23.7394 26.6799 23.8914 26.6597 23.934L26.5969 23.9391C26.6627 23.9461 28.2053 24.2429 28.194 25.8747C28.1851 26.5815 27.8425 27.0869 27.1508 27.3807Z"
        fill="#FF9900"
      />
    </g>
  </g>
  <defs>
    <clipPath id="clip0_2259_3798">
      <rect width="48" height="48" rx="24" fill="white" />
    </clipPath>
    <clipPath id="clip1_2259_3798">
      <rect width="54.5" height="54.5" fill="white" transform="translate(-3.25 -3.25)" />
    </clipPath>
  </defs>
</svg>`;
var interlay = x`
  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
    <g clip-path="url(#clip0_1300_1368)">
      <path
        d="M0 14C0 6.26801 6.26801 0 14 0H34C41.732 0 48 6.26801 48 14V34C48 41.732 41.732 48 34 48H14C6.26801 48 0 41.732 0 34V14Z"
        fill="url(#paint0_linear_1300_1368)"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M14.9464 13.8729H38.2788L31.087 9.43285H7.75457L14.9464 13.8729ZM40.6189 15.2015H14.7574C14.6342 15.2015 14.5138 15.1672 14.4088 15.1028L5.06517 9.33415C4.81247 9.17805 4.69417 8.87285 4.77537 8.58725C4.85587 8.30165 5.11697 8.10425 5.41377 8.10425H31.2753C31.3985 8.10425 31.5196 8.13925 31.6246 8.20295L40.9682 13.9723C41.2209 14.1277 41.3392 14.4329 41.258 14.7185C41.1768 15.0041 40.9164 15.2015 40.6189 15.2015ZM16.5558 37.0363H39.8882L32.6964 32.5962H9.364L16.5558 37.0363ZM42.2283 38.3649H16.3668C16.2436 38.3649 16.1232 38.3306 16.0182 38.2662L6.6746 32.4975C6.4219 32.3414 6.3036 32.0362 6.3848 31.7506C6.4653 31.465 6.7264 31.2676 7.0232 31.2676H32.8847C33.0079 31.2676 33.129 31.3026 33.234 31.3663L42.5776 37.1357C42.8303 37.2911 42.9486 37.5963 42.8674 37.8819C42.7862 38.1675 42.5258 38.3649 42.2283 38.3649ZM20.4648 23.2994C20.4872 25.5317 22.31 27.3321 24.5374 27.3321C24.5514 27.3321 24.5647 27.3314 24.578 27.3314C26.8236 27.309 28.6324 25.4638 28.61 23.2182C28.5988 22.1304 28.1648 21.1119 27.3878 20.3503C26.6213 19.5992 25.6112 19.1862 24.5395 19.1862C24.5255 19.1862 24.5108 19.1862 24.4968 19.1869C23.409 19.1974 22.3905 19.6314 21.6289 20.4077C20.8673 21.1854 20.4543 22.2123 20.4648 23.2994Z"
        fill="white"
      />
    </g>
    <defs>
      <linearGradient
        id="paint0_linear_1300_1368"
        x1="48"
        y1="48"
        x2="0.146965"
        y2="-0.14607"
        gradientUnits="userSpaceOnUse"
      >
        <stop />
        <stop offset="1" stop-color="#3F3F3F" />
      </linearGradient>
      <clipPath id="clip0_1300_1368">
        <rect width="48" height="48" rx="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
`;
var karura = x`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="48"
  height="48"
  viewBox="0 0 48 48"
  fill="none"
>
  <g clip-path="url(#clip0_1300_1128)">
    <path
      d="M0 14C0 6.26801 6.26801 0 14 0H34C41.732 0 48 6.26801 48 14V34C48 41.732 41.732 48 34 48H14C6.26801 48 0 41.732 0 34V14Z"
      fill="url(#paint0_linear_1300_1128)"
    />
    <path
      d="M31.6856 8.25L21.9002 17.0614C20.887 17.9735 19.5686 18.481 18.1998 18.4858L15.2831 18.4927L15.2732 8.25099H10V37.5203H12.8758C14.4843 37.5203 15.9844 36.6755 16.7713 35.2876C16.7783 35.2777 16.7812 35.2679 16.7872 35.262C17.3094 34.3324 17.5711 32.496 17.5203 31.2422C17.4069 28.3757 16.9414 27.6304 16.9414 27.6304C16.8439 29.595 14.7728 29.7015 14.7728 29.7015C16.2461 28.3076 15.4433 27.2529 15.4433 27.2529C12.835 29.0933 12.1835 27.1287 12.1337 26.9503C12.2153 27.0193 12.9574 27.6334 14.368 25.7181C15.8591 23.6944 17.8476 20.3203 19.1129 19.4528C20.3803 18.5824 21.5829 18.6544 21.5829 18.6544C21.5829 18.6544 22.2753 17.7248 24.1066 16.952C25.9369 16.1841 27.1108 17.3108 27.1108 17.3108C25.2386 18.8072 22.697 21.2646 22.5548 24.7866C22.4414 27.6364 28.6407 32.5266 27.5514 39.75C28.203 38.1097 28.4646 36.4665 28.2408 34.433C28.0617 32.7917 26.9944 29.3643 26.9944 29.3643L32.948 37.5163H39.5312L26.6641 19.9999L39.5312 8.25H31.6856Z"
      fill="white"
    />
  </g>
  <defs>
    <linearGradient
      id="paint0_linear_1300_1128"
      x1="48"
      y1="48"
      x2="0.146965"
      y2="-0.14607"
      gradientUnits="userSpaceOnUse"
    >
      <stop stop-color="#E40C5B" />
      <stop offset="1" stop-color="#FF4C3B" />
    </linearGradient>
    <clipPath id="clip0_1300_1128">
      <rect width="48" height="48" rx="24" fill="white" />
    </clipPath>
  </defs>
</svg>`;
var khala = x`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="48"
  height="48"
  viewBox="0 0 48 48"
  fill="none"
>
  <g clip-path="url(#clip0_1300_1506)">
    <path
      d="M0 14C0 6.26801 6.26801 0 14 0H34C41.732 0 48 6.26801 48 14V34C48 41.732 41.732 48 34 48H14C6.26801 48 0 41.732 0 34V14Z"
      fill="url(#paint0_linear_1300_1506)"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M38.8066 38.875H31.0457V32.4076H25.8718V24.6467H33.6327V31.1141H38.8066V38.875ZM18.111 24.6467H25.8718V16.8859H18.111V9.125H10.3501V38.875H18.111V24.6467ZM38.8066 16.8859H25.8718V9.125H38.8066V16.8859Z"
      fill="white"
    />
  </g>
  <defs>
    <linearGradient
      id="paint0_linear_1300_1506"
      x1="48"
      y1="48"
      x2="-2.62577e-05"
      y2="2.62577e-05"
      gradientUnits="userSpaceOnUse"
    >
      <stop stop-color="#0B8789" />
      <stop offset="1" stop-color="#36F7FA" />
    </linearGradient>
    <clipPath id="clip0_1300_1506">
      <rect width="48" height="48" rx="24" fill="white" />
    </clipPath>
  </defs>
</svg>`;
var kusama = x`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="48"
  height="48"
  viewBox="0 0 48 48"
  fill="none"
>
  <g clip-path="url(#clip0_1300_1117)">
    <path
      d="M0 14C0 6.26801 6.26801 0 14 0H34C41.732 0 48 6.26801 48 14V34C48 41.732 41.732 48 34 48H14C6.26801 48 0 41.732 0 34V14Z"
      fill="url(#paint0_linear_1300_1117)"
    />
    <path
      d="M39.4543 13.7713C38.9277 13.3546 38.2998 12.7855 37.1554 12.6432C36.0819 12.501 34.9881 13.2225 34.2488 13.7002C33.5096 14.1778 32.112 15.5803 31.5347 16.0071C30.9575 16.434 29.4789 16.8303 27.099 18.2633C24.719 19.6962 15.3817 25.7126 15.3817 25.7126L17.8122 25.7431L6.97598 31.3428H8.05961L6.5 32.5319C6.5 32.5319 7.87731 32.8977 9.03183 32.166V32.5014C9.03183 32.5014 21.934 27.3996 24.4253 28.7208L22.9063 29.168C23.0379 29.168 25.4887 29.3306 25.4887 29.3306C25.5482 29.8399 25.7188 30.3297 25.9883 30.7654C26.2579 31.201 26.6198 31.5716 27.0483 31.851C28.5269 32.8266 28.5573 33.3652 28.5573 33.3652C28.5573 33.3652 27.7876 33.6803 27.7876 34.0766C27.7876 34.0766 28.9219 33.7311 29.9751 33.7616C30.6436 33.787 31.3066 33.8928 31.9499 34.0766C31.9499 34.0766 31.8689 33.6498 30.8461 33.3652C29.8232 33.0807 28.8105 31.9627 28.3142 31.353C28.0103 30.9648 27.8122 30.504 27.7394 30.0158C27.6666 29.5276 27.7216 29.0288 27.899 28.5684C28.2535 27.6436 29.489 27.1354 32.0411 25.8142C35.0489 24.2492 35.7376 23.0906 36.1629 22.1861C36.5883 21.2816 37.2161 19.4828 37.5706 18.6393C38.0162 17.5519 38.5631 16.9726 39.0188 16.6271C39.4745 16.2815 41.5 15.5193 41.5 15.5193C41.5 15.5193 39.9505 14.1677 39.4543 13.7713Z"
      fill="white"
    />
  </g>
  <defs>
    <linearGradient
      id="paint0_linear_1300_1117"
      x1="48"
      y1="48"
      x2="-2.62577e-05"
      y2="2.62577e-05"
      gradientUnits="userSpaceOnUse"
    >
      <stop />
      <stop offset="1" stop-color="#3F3F3F" />
    </linearGradient>
    <clipPath id="clip0_1300_1117">
      <rect width="48" height="48" rx="24" fill="white" />
    </clipPath>
  </defs>
</svg>`;
var lrna = x`<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
  <g clip-path="url(#clip0_1927_4428)">
    <g clip-path="url(#clip1_1927_4428)">
      <circle cx="23.9465" cy="24.0641" r="24.6929" transform="rotate(-30 23.9465 24.0641)" fill="#0085FF" />
      <circle
        cx="23.9465"
        cy="24.0641"
        r="24.6929"
        transform="rotate(-30 23.9465 24.0641)"
        fill="url(#paint0_linear_1927_4428)"
      />
      <mask
        id="mask0_1927_4428"
        style="mask-type:alpha"
        maskUnits="userSpaceOnUse"
        x="-1"
        y="-1"
        width="50"
        height="50"
      >
        <circle cx="23.9465" cy="24.0641" r="24.6929" transform="rotate(-30 23.9465 24.0641)" fill="white" />
      </mask>
      <g mask="url(#mask0_1927_4428)"></g>
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M42.6476 24.0557L23.629 5.03716L4.61041 24.0557L23.629 43.0743L42.6476 24.0557ZM34.5108 18.017L23.629 7.13516L12.7472 18.017C9.24042 21.5237 9.24042 27.2094 12.7472 30.7161L15.1146 33.0836C19.817 37.7859 27.441 37.7859 32.1433 33.0836L34.5108 30.7161C38.0176 27.2093 38.0176 21.5237 34.5108 18.017Z"
        fill="white"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M30.6049 15.0002L23.6289 8.02417L16.6529 15.0002C13.9934 17.6597 13.9934 21.9717 16.6529 24.6312C20.5056 28.484 26.7522 28.484 30.6049 24.6312C33.2644 21.9717 33.2644 17.6597 30.6049 15.0002ZM23.6289 4.9812L15.1314 13.4787C11.6316 16.9785 11.6316 22.6529 15.1314 26.1527C19.8245 30.8457 27.4334 30.8457 32.1264 26.1527C35.6262 22.6529 35.6262 16.9785 32.1264 13.4787L23.6289 4.9812Z"
        fill="white"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M30.6049 15.0002L23.6289 8.02417L16.6529 15.0002C13.9934 17.6597 13.9934 21.9717 16.6529 24.6312C20.5056 28.484 26.7522 28.484 30.6049 24.6312C33.2644 21.9717 33.2644 17.6597 30.6049 15.0002ZM23.6289 4.9812L15.1314 13.4787C11.6316 16.9785 11.6316 22.6529 15.1314 26.1527C19.8245 30.8457 27.4334 30.8457 32.1264 26.1527C35.6262 22.6529 35.6262 16.9785 32.1264 13.4787L23.6289 4.9812Z"
        fill="white"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M28.2495 12.6001L23.6289 7.9795L19.0083 12.6001C17.2655 14.3429 17.2655 17.1686 19.0083 18.9114C21.5602 21.4632 25.6976 21.4632 28.2495 18.9114C29.9923 17.1686 29.9923 14.3429 28.2495 12.6001ZM23.6289 5.69727L17.8672 11.4589C15.4942 13.832 15.4942 17.6795 17.8672 20.0525C21.0493 23.2346 26.2085 23.2346 29.3906 20.0525C31.7636 17.6795 31.7636 13.832 29.3906 11.4589L23.6289 5.69727Z"
        fill="white"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M28.2495 12.6001L23.6289 7.9795L19.0083 12.6001C17.2655 14.3429 17.2655 17.1686 19.0083 18.9114C21.5602 21.4632 25.6976 21.4632 28.2495 18.9114C29.9923 17.1686 29.9923 14.3429 28.2495 12.6001ZM23.6289 5.69727L17.8672 11.4589C15.4942 13.832 15.4942 17.6795 17.8672 20.0525C21.0493 23.2346 26.2085 23.2346 29.3906 20.0525C31.7636 17.6795 31.7636 13.832 29.3906 11.4589L23.6289 5.69727Z"
        fill="white"
      />
    </g>
  </g>
  <defs>
    <linearGradient
      id="paint0_linear_1927_4428"
      x1="30.1933"
      y1="-4.00333"
      x2="3.51974"
      y2="42.1966"
      gradientUnits="userSpaceOnUse"
    >
      <stop offset="0.231528" stop-color="#0085FF" />
      <stop offset="1" stop-color="#2C4EFF" />
    </linearGradient>
    <clipPath id="clip0_1927_4428">
      <rect width="48" height="48" rx="24" fill="white" />
    </clipPath>
    <clipPath id="clip1_1927_4428">
      <rect width="49.4893" height="49.4893" fill="white" transform="translate(-0.744629 -0.744629)" />
    </clipPath>
  </defs>
</svg>`;
var moonbeam = x`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="48"
  height="48"
  viewBox="0 0 48 48"
  fill="none"
>
  <path
    d="M28.2168 5.19995C20.7001 5.19995 14.4668 11.25 14.4668 18.95V19.5H15.2001H41.2335H41.9668V18.95C41.9668 11.4333 35.7335 5.19995 28.2168 5.19995Z"
    fill="#53CBC8"
  />
  <path
    d="M11.5332 22.525C11.5332 22.0693 11.9026 21.7 12.3582 21.7H44.4415C44.8972 21.7 45.2665 22.0693 45.2665 22.525C45.2665 22.9806 44.8972 23.35 44.4415 23.35H12.3582C11.9026 23.35 11.5332 22.9806 11.5332 22.525Z"
    fill="#E1147B"
  />
  <path
    d="M4.93359 26.3748C4.93359 25.9192 5.33009 25.5498 5.66686 25.5498H29.0969C29.4336 25.5498 29.8669 25.9192 29.8669 26.3748C29.8669 26.8304 29.4336 27.1998 29.0969 27.1998H5.66686C5.33009 27.1998 4.93359 26.8304 4.93359 26.3748Z"
    fill="#E1147B"
  />
  <circle cx="9.42461" cy="22.525" r="0.825" fill="#E1147B" />
  <ellipse cx="2.825" cy="26.3748" rx="0.825" ry="0.824998" fill="#E1147B" />
  <path
    d="M11.3496 30.2247C11.3496 29.769 11.6768 29.3997 12.0805 29.3997H40.5021C40.9057 29.3997 41.2329 29.769 41.2329 30.2247C41.2329 30.6803 40.9057 31.0497 40.5021 31.0497H12.0805C11.6768 31.0497 11.3496 30.6803 11.3496 30.2247Z"
    fill="#E1147B"
  />
  <path
    d="M21.25 34.0754C21.25 33.6198 21.5772 33.2504 21.9808 33.2504L45.2692 33.2502C45.6728 33.2502 46 33.6196 46 34.0752C46 34.5309 45.6728 34.9002 45.2692 34.9002L21.9808 34.9004C21.5772 34.9004 21.25 34.5311 21.25 34.0754Z"
    fill="#E1147B"
  />
  <ellipse cx="9.2415" cy="30.2247" rx="0.825" ry="0.824996" fill="#E1147B" />
  <ellipse cx="4.47539" cy="34.0752" rx="0.825" ry="0.825001" fill="#E1147B" />
  <path
    d="M6.5835 34.0752C6.5835 33.6196 6.95286 33.2502 7.4085 33.2502H18.5918C19.0475 33.2502 19.4168 33.6196 19.4168 34.0752C19.4168 34.5309 19.0475 34.9002 18.5918 34.9002H7.4085C6.95286 34.9002 6.5835 34.5309 6.5835 34.0752Z"
    fill="#E1147B"
  />
  <ellipse cx="23.5418" cy="37.9251" rx="0.825" ry="0.824999" fill="#E1147B" />
  <path
    d="M25.6504 37.9251C25.6504 37.4695 26.0262 37.1001 26.4898 37.1001H40.8527C41.3162 37.1001 41.6921 37.4695 41.6921 37.9251C41.6921 38.3807 41.3162 38.7501 40.8527 38.7501H26.4898C26.0262 38.7501 25.6504 38.3807 25.6504 37.9251Z"
    fill="#E1147B"
  />
  <ellipse cx="14.7415" cy="41.775" rx="0.825" ry="0.825001" fill="#E1147B" />
  <path
    d="M16.8496 41.775C16.8496 41.3193 17.2254 40.95 17.689 40.95H32.0519C32.5155 40.95 32.8913 41.3193 32.8913 41.775C32.8913 42.2306 32.5155 42.6 32.0519 42.6H17.689C17.2254 42.6 16.8496 42.2306 16.8496 41.775Z"
    fill="#E1147B"
  />
</svg>`;
var nodle = x`<svg
  xmlns="http://www.w3.org/2000/svg"
  xmlns:xlink="http://www.w3.org/1999/xlink"
  width="48px"
  height="48px"
  viewBox="0 0 48 48"
  version="1.1"
>
  <g id="surface1">
    <path
      style=" stroke:none;fill-rule:evenodd;fill:rgb(0.392157%,2.745098%,9.019608%);fill-opacity:1;"
      d="M 48 24 C 48 10.746094 37.253906 0 24 0 C 10.746094 0 0 10.746094 0 24 C 0 37.253906 10.746094 48 24 48 C 37.253906 48 48 37.253906 48 24 Z M 48 24 "
    />
    <path
      style=" stroke:none;fill-rule:nonzero;fill:rgb(9.411765%,68.235294%,50.588235%);fill-opacity:1;"
      d="M 38.707031 12.960938 C 36.648438 10.90625 33.609375 9.832031 29.859375 9.832031 C 27.355469 9.832031 25.476562 10.546875 24.316406 11.976562 C 23.066406 13.410156 22.796875 15.375 22.796875 16.625 L 22.707031 20.378906 L 24.851562 20.46875 L 24.941406 16.714844 C 24.941406 15.734375 25.300781 14.75 25.835938 14.125 C 26.28125 13.410156 27.085938 12.960938 27.980469 12.960938 L 28.070312 12.960938 C 29.054688 12.960938 29.859375 13.230469 30.394531 13.675781 C 30.929688 14.125 31.289062 14.839844 31.199219 15.820312 C 31.199219 16.714844 30.839844 17.609375 30.125 18.324219 C 29.410156 18.949219 28.605469 19.308594 27.625 19.308594 L 25.566406 19.308594 L 25.566406 20.648438 L 27.710938 20.648438 C 30.304688 20.648438 32.539062 18.503906 32.539062 15.910156 C 32.539062 15.285156 32.449219 14.660156 32.183594 14.035156 L 32.089844 13.765625 L 32.269531 13.945312 C 32.988281 14.753906 33.34375 15.820312 33.253906 16.894531 C 33.164062 19.398438 31.199219 21.363281 28.695312 21.363281 L 28.605469 21.363281 L 24.761719 21.273438 L 22.617188 21.273438 L 16.71875 21.183594 L 16.539062 21.183594 C 14.484375 21.183594 12.515625 21.988281 10.996094 23.417969 C 9.476562 24.9375 8.585938 26.90625 8.585938 29.050781 C 8.585938 30.300781 8.851562 31.464844 9.300781 32.535156 L 9.210938 32.535156 C 8.226562 31.195312 7.78125 29.585938 7.78125 27.886719 C 7.78125 25.832031 8.675781 23.953125 10.105469 22.433594 C 11.625 21.007812 13.5 20.203125 15.554688 20.289062 L 21.8125 20.378906 L 21.8125 19.039062 L 15.554688 18.949219 L 15.378906 18.949219 C 13.050781 18.953125 10.808594 19.847656 9.121094 21.453125 C 7.425781 23.136719 6.433594 25.40625 6.351562 27.796875 C 6.261719 30.75 7.246094 33.429688 9.03125 35.21875 C 10.910156 37.183594 13.679688 38.167969 17.34375 38.167969 C 19.757812 38.167969 21.632812 37.453125 22.886719 35.933594 C 23.867188 34.769531 24.40625 33.070312 24.496094 31.285156 L 24.585938 27.53125 L 22.4375 27.441406 L 22.527344 31.285156 C 22.527344 32.265625 22.171875 33.25 21.632812 33.875 C 21.007812 34.589844 20.203125 35.039062 19.308594 35.039062 C 18.328125 35.039062 17.523438 34.769531 16.988281 34.324219 C 16.449219 33.875 16.09375 33.160156 16.183594 32.179688 C 16.183594 30.210938 17.789062 28.691406 19.667969 28.691406 L 21.8125 28.691406 L 21.8125 27.351562 L 19.667969 27.351562 C 17.074219 27.351562 14.839844 29.496094 14.839844 32.089844 C 14.839844 32.714844 14.929688 33.339844 15.199219 33.964844 L 15.289062 34.234375 L 15.109375 34.054688 C 14.394531 33.246094 14.039062 32.179688 14.128906 31.105469 C 14.214844 28.601562 16.183594 26.636719 18.683594 26.636719 L 18.773438 26.636719 L 22.617188 26.726562 L 24.761719 26.816406 L 30.660156 26.90625 L 30.839844 26.90625 C 35.128906 26.90625 38.707031 23.417969 38.796875 19.039062 C 38.796875 17.789062 38.527344 16.625 38.082031 15.554688 L 38.171875 15.554688 C 39.152344 16.894531 39.601562 18.503906 39.601562 20.203125 C 39.601562 22.257812 38.707031 24.132812 37.277344 25.65625 C 35.757812 27.085938 33.878906 27.890625 31.824219 27.800781 L 25.566406 27.710938 L 25.566406 29.050781 L 31.824219 29.140625 L 32.003906 29.140625 C 34.328125 29.140625 36.742188 28.246094 38.617188 26.636719 C 40.582031 24.9375 41.65625 22.703125 41.65625 20.292969 C 41.476562 17.339844 40.492188 14.839844 38.707031 12.960938 Z M 37.453125 18.949219 C 37.363281 22.613281 34.414062 25.566406 30.75 25.566406 L 30.660156 25.566406 L 24.761719 25.472656 L 22.617188 25.386719 L 18.773438 25.296875 L 18.683594 25.296875 C 17.164062 25.296875 15.734375 25.921875 14.574219 26.992188 C 13.410156 28.066406 12.785156 29.585938 12.785156 31.105469 C 12.785156 31.910156 12.964844 32.804688 13.230469 33.519531 L 13.320312 33.789062 L 13.144531 33.519531 C 12.378906 32.519531 11.96875 31.292969 11.980469 30.03125 C 12.070312 26.992188 14.574219 24.492188 17.613281 24.492188 L 17.703125 24.492188 L 21.8125 24.582031 L 21.8125 23.242188 L 17.613281 23.242188 C 13.859375 23.242188 10.730469 26.277344 10.730469 30.03125 C 10.730469 31.105469 10.910156 32.089844 11.355469 32.984375 L 11.535156 33.339844 L 11.175781 33.070312 C 10.28125 31.910156 9.835938 30.480469 9.925781 29.050781 C 10.015625 25.386719 12.964844 22.523438 16.539062 22.523438 L 16.628906 22.523438 L 22.617188 22.613281 L 24.761719 22.703125 L 28.605469 22.792969 L 28.695312 22.792969 C 30.214844 22.792969 31.644531 22.167969 32.804688 21.09375 C 33.96875 20.023438 34.59375 18.503906 34.59375 16.984375 C 34.585938 16.160156 34.433594 15.34375 34.148438 14.570312 L 34.058594 14.300781 L 34.238281 14.570312 C 35.042969 15.554688 35.398438 16.804688 35.398438 18.054688 C 35.398438 19.574219 34.773438 20.917969 33.699219 21.988281 C 32.628906 22.972656 31.289062 23.597656 29.859375 23.597656 L 29.765625 23.597656 L 25.65625 23.507812 L 25.65625 24.847656 L 29.769531 24.9375 L 29.859375 24.9375 C 31.644531 24.9375 33.34375 24.222656 34.683594 22.972656 C 36.023438 21.722656 36.738281 19.933594 36.828125 18.054688 C 36.828125 16.984375 36.648438 16 36.203125 15.105469 L 36.023438 14.75 L 36.203125 15.015625 C 37.007812 16.089844 37.453125 17.519531 37.453125 18.949219 Z M 37.453125 18.949219 "
    />
  </g>
</svg>`;
var phala = x`<svg
  width="32"
  height="32"
  viewBox="0 0 32 32"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <g clip-path="url(#clip0_9060_132003)">
    <path
      d="M16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z"
      fill="black"
    />
    <path d="M22.4955 16.6304H11.5195V20.2892H22.4955V16.6304Z" fill="#D1FF52" />
    <path d="M26.155 11.1424H22.4961V16.631H26.155V11.1424Z" fill="#D1FF52" />
    <path d="M11.5189 20.2899H7.85938V21.2045V22.1197V25.7779H11.5183V22.1197H11.5189V20.2899Z" fill="#D1FF52" />
    <path
      d="M22.4955 7.48352H11.5189H10.9928H7.85938V14.8013V15.9693V16.631H11.5189V15.9693V14.8013V11.1424H22.4955V7.48352Z"
      fill="#D1FF52"
    />
    <path d="M22.4955 16.6304H11.5195V20.2892H22.4955V16.6304Z" fill="#D1FF52" />
  </g>
  <defs>
    <clipPath id="clip0_9060_132003">
      <rect width="32" height="32" fill="white" />
    </clipPath>
  </defs>
</svg> `;
var polkadot = x`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="48"
  height="48"
  viewBox="0 0 48 48"
  fill="none"
>
  <g clip-path="url(#clip0_1300_1078)">
    <path
      d="M0 14C0 6.26801 6.26801 0 14 0H34C41.732 0 48 6.26801 48 14V34C48 41.732 41.732 48 34 48H14C6.26801 48 0 41.732 0 34V14Z"
      fill="url(#paint0_linear_1300_1078)"
    />
    <g clip-path="url(#clip1_1300_1078)">
      <path
        d="M23.9966 13.841C27.4843 13.841 30.3116 12.1977 30.3116 10.1705C30.3116 8.14334 27.4843 6.5 23.9966 6.5C20.509 6.5 17.6816 8.14334 17.6816 10.1705C17.6816 12.1977 20.509 13.841 23.9966 13.841Z"
        fill="white"
      />
      <path
        d="M23.9966 41.4975C27.4843 41.4975 30.3116 39.8541 30.3116 37.827C30.3116 35.7998 27.4843 34.1565 23.9966 34.1565C20.509 34.1565 17.6816 35.7998 17.6816 37.827C17.6816 39.8541 20.509 41.4975 23.9966 41.4975Z"
        fill="white"
      />
      <path
        d="M15.1964 18.9217C16.9402 15.9033 16.9289 12.6341 15.1711 11.6198C13.4133 10.6056 10.5747 12.2303 8.83084 15.2487C7.087 18.2672 7.09832 21.5363 8.85611 22.5506C10.6139 23.5649 13.4525 21.9402 15.1964 18.9217Z"
        fill="white"
      />
      <path
        d="M39.1598 32.7483C40.9036 29.7299 40.8933 26.4613 39.1367 25.4477C37.3801 24.4341 34.5424 26.0594 32.7986 29.0778C31.0548 32.0963 31.0651 35.3649 32.8217 36.3785C34.5783 37.392 37.416 35.7668 39.1598 32.7483Z"
        fill="white"
      />
      <path
        d="M15.1718 36.3777C16.9296 35.3635 16.941 32.0943 15.1971 29.0759C13.4533 26.0574 10.6146 24.4327 8.85685 25.447C7.09905 26.4612 7.08773 29.7304 8.83157 32.7488C10.5754 35.7673 13.414 37.392 15.1718 36.3777Z"
        fill="white"
      />
      <path
        d="M39.1382 22.5516C40.8948 21.538 40.9051 18.2694 39.1613 15.2509C37.4175 12.2325 34.5798 10.6072 32.8232 11.6208C31.0666 12.6344 31.0562 15.903 32.8001 18.9214C34.5439 21.9399 37.3816 23.5652 39.1382 22.5516Z"
        fill="white"
      />
    </g>
  </g>
  <defs>
    <linearGradient
      id="paint0_linear_1300_1078"
      x1="48"
      y1="48"
      x2="-2.71797e-05"
      y2="2.71797e-05"
      gradientUnits="userSpaceOnUse"
    >
      <stop stop-color="#D43079" />
      <stop offset="1" stop-color="#F93C90" />
    </linearGradient>
    <clipPath id="clip0_1300_1078">
      <rect width="48" height="48" rx="24" fill="white" />
    </clipPath>
    <clipPath id="clip1_1300_1078">
      <rect width="32.935" height="35" fill="white" transform="translate(7.53247 6.5)" />
    </clipPath>
  </defs>
</svg>`;
var robonomics = x` <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
  <g id="surface1">
    <path
      style=" stroke:none;fill-rule:nonzero;fill:rgb(70.980392%,75.294118%,94.509804%);fill-opacity:1;"
      d="M 24 19.007812 L 24 29.902344 L 32.289062 34.683594 Z M 24 19.007812 "
    />
    <path
      style=" stroke:none;fill-rule:nonzero;fill:rgb(13.333333%,7.45098%,38.823529%);fill-opacity:1;"
      d="M 24 29.902344 L 15.710938 34.683594 L 32.289062 34.683594 Z M 24 29.902344 "
    />
    <path
      style=" stroke:none;fill-rule:nonzero;fill:rgb(1.176471%,64.705882%,92.941176%);fill-opacity:1;"
      d="M 24 19.007812 L 15.710938 34.683594 L 24.019531 29.902344 Z M 24 19.007812 "
    />
    <path
      style="fill:none;stroke-width:3.6213;stroke-linecap:butt;stroke-linejoin:miter;stroke:rgb(1.176471%,64.705882%,92.941176%);stroke-opacity:1;stroke-miterlimit:10;"
      d="M 135.5 38.891276 L 37.006673 209.492188 L 233.993327 209.492188 Z M 135.5 38.891276 "
      transform="matrix(0.177122,0,0,0.193548,0,0)"
    />
    <path
      style=" stroke:none;fill-rule:nonzero;fill:rgb(1.176471%,64.705882%,92.941176%);fill-opacity:1;"
      d="M 25.222656 7.664062 C 25.222656 8.402344 24.675781 9 24 9 C 23.324219 9 22.777344 8.402344 22.777344 7.664062 C 22.777344 6.925781 23.324219 6.328125 24 6.328125 C 24.675781 6.328125 25.222656 6.925781 25.222656 7.664062 Z M 25.222656 7.664062 "
    />
    <path
      style=" stroke:none;fill-rule:nonzero;fill:rgb(1.176471%,64.705882%,92.941176%);fill-opacity:1;"
      d="M 42.386719 40.316406 C 42.386719 41.054688 41.839844 41.652344 41.164062 41.652344 C 40.488281 41.652344 39.941406 41.054688 39.941406 40.316406 C 39.941406 39.578125 40.488281 38.980469 41.164062 38.980469 C 41.839844 38.980469 42.386719 39.578125 42.386719 40.316406 Z M 42.386719 40.316406 "
    />
    <path
      style=" stroke:none;fill-rule:nonzero;fill:rgb(1.176471%,64.705882%,92.941176%);fill-opacity:1;"
      d="M 8.058594 40.335938 C 8.058594 41.074219 7.511719 41.671875 6.835938 41.671875 C 6.160156 41.671875 5.613281 41.074219 5.613281 40.335938 C 5.613281 39.597656 6.160156 39 6.835938 39 C 7.511719 39 8.058594 39.597656 8.058594 40.335938 Z M 8.058594 40.335938 "
    />
  </g>
</svg>`;
var subsocial = x`
  <svg viewBox="36.1742 41.4394 48 48" xmlns="http://www.w3.org/2000/svg">
      <defs>
          <linearGradient id="linear0" gradientUnits="userSpaceOnUse" x1="150" y1="0" x2="150" y2="300" gradientTransform="matrix(0.16,0,0,0.16,0,0)">
              <stop offset="0" style="stop-color:rgb(96.078431%,0%,51.372549%);stop-opacity:1;"/>
              <stop offset="1" style="stop-color:rgb(44.705882%,1.568627%,59.215686%);stop-opacity:1;"/>
          </linearGradient>
      </defs>
      <ellipse style="fill: rgb(255, 255, 255);" cx="60.202" cy="65.566" rx="13.863" ry="20.121"/>
      <g id="surface1" transform="matrix(1, 0, 0, 1, 36.17417526245117, 41.43937683105469)">
          <path style="stroke: none; fill-rule: evenodd; fill: url('#linear0'); paint-order: stroke;" d="M 48 24 C 48 37.253906 37.253906 48 24 48 C 10.746094 48 0 37.253906 0 24 C 0 10.746094 10.746094 0 24 0 C 37.253906 0 48 10.746094 48 24 Z M 23.917969 5.117188 C 19.015625 5.117188 15.039062 9.09375 15.039062 14 L 15.039062 19.757812 C 15.039062 24.664062 19.015625 28.636719 23.917969 28.636719 C 24.605469 28.636719 25.277344 28.558594 25.921875 28.410156 C 26.304688 28.324219 26.414062 27.847656 26.128906 27.570312 L 26.078125 27.527344 L 20.964844 22.640625 C 20.171875 21.871094 19.679688 20.792969 19.679688 19.597656 L 19.679688 14.160156 C 19.679688 11.816406 21.578125 9.917969 23.917969 9.917969 C 26.261719 9.917969 28.160156 11.816406 28.160156 14.160156 L 28.160156 16 C 28.160156 16.351562 28.445312 16.640625 28.796875 16.640625 L 32.160156 16.640625 C 32.511719 16.640625 32.796875 16.351562 32.796875 16 L 32.796875 14 C 32.796875 9.09375 28.824219 5.117188 23.917969 5.117188 Z M 32.800781 33.519531 C 32.800781 38.425781 28.824219 42.398438 23.921875 42.398438 C 19.015625 42.398438 15.039062 38.425781 15.039062 33.519531 L 15.039062 31.519531 C 15.039062 31.167969 15.328125 30.878906 15.679688 30.878906 L 19.039062 30.878906 C 19.394531 30.878906 19.679688 31.167969 19.679688 31.519531 L 19.679688 33.359375 C 19.679688 35.703125 21.578125 37.601562 23.921875 37.601562 C 26.261719 37.601562 28.160156 35.703125 28.160156 33.359375 L 28.160156 27.921875 C 28.160156 26.726562 27.667969 25.648438 26.875 24.878906 L 21.757812 19.992188 L 21.710938 19.945312 C 21.421875 19.671875 21.53125 19.195312 21.917969 19.105469 C 22.5625 18.957031 23.230469 18.878906 23.921875 18.878906 C 28.824219 18.878906 32.800781 22.855469 32.800781 27.761719 Z M 32.800781 33.519531 "/>
      </g>
  </svg>
`;
var tinkernet = x`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="48"
  height="48"
  viewBox="0 0 48 48"
  fill="none"
>
  <g clip-path="url(#clip0_1805_3714)">
    <g clip-path="url(#clip1_1805_3714)">
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M37.9625 12.1681L41.9137 11.6637L44.1538 15.6782L41.6465 18.5131C41.9513 19.3855 42.1914 20.2793 42.3649 21.187L46.0073 22.5031L45.9383 27.101L42.3462 28.3036C42.1716 29.2092 41.9315 30.101 41.6278 30.9718L44.1279 33.9374L41.7701 37.8858L38.0631 37.1315C37.4577 37.8297 36.8017 38.4824 36.1003 39.0841L36.7814 42.8974L32.7655 45.1374L30.8703 43.4607V36.1975C32.5165 35.1742 33.9234 33.8089 34.9958 32.1943C36.0682 30.5796 36.781 28.7533 37.0858 26.8391C37.3906 24.9249 37.2803 22.9675 36.7625 21.0996C36.2447 19.2318 35.3314 17.497 34.0845 16.013L37.9639 12.1695L37.9625 12.1681ZM13.2491 16.1639C12.0346 17.6531 11.1514 19.384 10.6584 21.2414C10.1653 23.0988 10.0738 25.0398 10.3899 26.9353C10.706 28.8308 11.4225 30.6372 12.4915 32.234C13.5605 33.8309 14.9576 35.1816 16.5897 36.1961V43.3429L14.502 45.1015L10.5536 42.7437L11.3065 39.0381C10.6083 38.4333 9.95561 37.7778 9.35384 37.0769L5.53907 37.7579L3.29905 33.742L5.80631 30.9071C5.50138 30.0342 5.26126 29.14 5.08789 28.2318L1.44556 26.9157L1.51308 22.3178L5.10515 21.1152C5.27961 20.2095 5.51972 19.3178 5.82356 18.447L3.32492 15.4814L5.68132 11.533L9.36246 12.2815L13.2491 16.1639Z"
        fill="url(#paint0_linear_1805_3714)"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M10.7504 6.61061L14.7663 4.37056L17.5997 6.87786C18.4726 6.57286 19.3669 6.33273 20.2751 6.15945L21.5912 2.51709L26.1891 2.58462L27.3903 6.17668C28.2958 6.35145 29.1876 6.59155 30.0584 6.89509L33.0226 4.39643L36.9696 6.7543L36.2167 10.4598C36.4887 10.6945 36.7541 10.9383 37.0127 11.1912L33.1649 15.039C32.5157 14.4157 31.8063 13.8583 31.047 13.3752L28.8041 11.947V25.4402L26.3012 26.8856L23.7982 28.3311L21.2952 26.8856L18.7923 25.4402V11.947L16.5494 13.3752C15.7342 13.897 14.977 14.5044 14.2907 15.187L10.4443 11.3406C10.7604 11.0274 11.0895 10.7237 11.4315 10.4297L10.7504 6.61061Z"
        fill="white"
      />
    </g>
  </g>
  <defs>
    <linearGradient
      id="paint0_linear_1805_3714"
      x1="34.6886"
      y1="33.4431"
      x2="14.6509"
      y2="15.1902"
      gradientUnits="userSpaceOnUse"
    >
      <stop stop-color="#30BCD0" />
      <stop offset="1" stop-color="#CA28CC" />
    </linearGradient>
    <clipPath id="clip0_1805_3714">
      <rect width="48" height="48" rx="24" fill="white" />
    </clipPath>
    <clipPath id="clip1_1805_3714">
      <rect width="44.5445" height="42.6119" fill="white" transform="translate(1.45557 2.52246)" />
    </clipPath>
  </defs>
</svg>`;
var unique = x`<svg
  width="48"
  height="48"
  viewBox="0 0 48 48"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <circle cx="24" cy="24" r="24" fill="#40BCFF" />
  <path
    fill-rule="evenodd"
    clip-rule="evenodd"
    d="M28.4696 47.3024C39.4542 45.1596 47.7447 35.4841 47.7447 23.8723C47.7447 10.688 37.0567 0 23.8723 0C10.688 0 0 10.688 0 23.8723C0 35.6098 8.47092 45.3688 19.6328 47.3694V40.0675C16.0004 39.0373 13.093 37.0472 10.9105 34.0972C8.74328 31.1472 7.65967 27.7289 7.65967 23.8424C7.65967 18.7071 9.55217 14.5006 13.3372 11.2228C16.4812 8.50689 20.0601 7.14894 24.0741 7.14894C29.2479 7.14894 33.4221 9.06099 36.5966 12.8851C39.1607 15.9756 40.4427 19.5422 40.4427 23.5848C40.4427 27.5494 39.3057 31.1004 37.0316 34.2377C34.9865 37.0785 32.1325 39.0217 28.4696 40.0675V47.3024ZM28.172 26.4178H19.9533V30C18.1219 28.4547 17.2061 26.4178 17.2061 23.8892C17.2061 21.9069 17.8853 20.1899 19.2436 18.7383C20.6019 17.2867 22.2121 16.5609 24.0741 16.5609C25.9208 16.5609 27.5233 17.2867 28.8816 18.7383C30.24 20.1899 30.9191 21.9069 30.9191 23.8892C30.9191 26.3553 30.0034 28.3923 28.172 30V26.4178Z"
    fill="white"
  />
</svg>`;
var usdc = x`<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
  <g clip-path="url(#clip0_2056_4492)">
    <rect x="-0.0551758" y="-0.0551758" width="48.1104" height="48.1104" rx="20.046" fill="white" />
    <path
      d="M23.9448 48.0552C37.2755 48.0552 48 37.3307 48 24C48 10.6693 37.2755 -0.0551758 23.9448 -0.0551758C10.6142 -0.0551758 -0.110352 10.6693 -0.110352 24C-0.110352 37.3307 10.6142 48.0552 23.9448 48.0552Z"
      fill="#2775CA"
    />
    <path
      d="M30.5601 27.8087C30.5601 24.3008 28.4553 23.098 24.2456 22.5969C21.2387 22.1959 20.6374 21.3942 20.6374 19.9908C20.6374 18.5874 21.6397 17.6856 23.6443 17.6856C25.4484 17.6856 26.4508 18.287 26.9518 19.7904C27.0522 20.0911 27.3528 20.2915 27.6535 20.2915H29.2571C29.6581 20.2915 29.9587 19.9908 29.9587 19.59V19.4897C29.5577 17.2846 27.7536 15.5807 25.4484 15.3804V12.9749C25.4484 12.5739 25.1477 12.2732 24.6466 12.1729H23.1432C22.7422 12.1729 22.4415 12.4735 22.3412 12.9749V15.2801C19.3343 15.6811 17.4301 17.6856 17.4301 20.1914C17.4301 23.499 19.4346 24.8018 23.6443 25.3031C26.4508 25.8042 27.3528 26.4056 27.3528 28.0093C27.3528 29.6131 25.9495 30.7155 24.0453 30.7155C21.4391 30.7155 20.5371 29.6129 20.2364 28.1094C20.1363 27.7086 19.8356 27.508 19.5349 27.508H17.8308C17.4301 27.508 17.1294 27.8087 17.1294 28.2097V28.31C17.5302 30.8156 19.1339 32.6198 22.4415 33.1211V35.5266C22.4415 35.9273 22.7422 36.228 23.2433 36.3283H24.7467C25.1477 36.3283 25.4484 36.0276 25.5487 35.5266V33.1211C28.5556 32.6198 30.5601 30.5149 30.5601 27.8087V27.8087Z"
      fill="white"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M9.91271 19.0886C7.00588 26.8065 11.0152 35.5265 18.8331 38.3327C19.1338 38.5334 19.4345 38.9341 19.4345 39.2348V40.6382C19.4345 40.8386 19.4345 40.9389 19.3342 41.0389C19.2341 41.4399 18.8331 41.6403 18.4321 41.4399C12.8193 39.6358 8.50933 35.3258 6.70519 29.713C3.69829 20.1913 8.91033 10.0679 18.4321 7.06101C18.5324 6.96094 18.7328 6.96094 18.8331 6.96094C19.2341 7.06101 19.4345 7.3617 19.4345 7.7627V9.16584C19.4345 9.66715 19.2341 9.96783 18.8331 10.1682C14.7237 11.6717 11.4162 14.8789 9.91271 19.0886ZM28.5555 7.46206C28.6555 7.06106 29.0565 6.86068 29.4575 7.06106C34.97 8.86519 39.3803 13.1752 41.1844 18.8883C44.1913 28.41 38.9793 38.5334 29.4575 41.5403C29.3572 41.6404 29.1568 41.6404 29.0565 41.6404C28.6555 41.5403 28.4551 41.2396 28.4551 40.8386V39.4355C28.4551 38.9342 28.6555 38.6335 29.0565 38.4331C33.1659 36.9296 36.4735 33.7224 37.9769 29.5127C40.8837 21.7949 36.8745 13.0749 29.0565 10.2686C28.7558 10.068 28.4551 9.66719 28.4551 9.26619V7.86306C28.4551 7.66244 28.4551 7.56237 28.5555 7.46206Z"
      fill="white"
    />
  </g>
  <defs>
    <clipPath id="clip0_2056_4492">
      <rect width="48" height="48" rx="24" fill="white" />
    </clipPath>
  </defs>
</svg>`;
var usdt = x`<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
  <g clip-path="url(#clip0_2067_3803)">
    <rect width="48" height="48" rx="20" fill="white" />
    <path
      d="M47.2766 29.8057C44.0712 42.663 31.0489 50.4877 18.1901 47.2815C5.33667 44.0761 -2.48802 31.053 0.718765 18.1967C3.92273 5.33806 16.9451 -2.48721 29.7999 0.718162C42.6577 3.92354 50.4819 16.9481 47.2762 29.806L47.2765 29.8057H47.2766Z"
      fill="#50AF95"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M27.037 26.7209V26.7209C26.8673 26.7336 25.9905 26.7859 24.0347 26.7859C22.4791 26.7859 21.3746 26.7393 20.9872 26.7209V26.7209C14.9755 26.4564 10.4883 25.4099 10.4883 24.157C10.4883 22.904 14.9755 21.8589 20.9872 21.5902V25.6786C21.3803 25.7069 22.506 25.7734 24.0616 25.7734C25.9283 25.7734 26.8631 25.6956 27.0314 25.68V21.5931C33.0303 21.8603 37.5076 22.9068 37.5076 24.157C37.5076 25.4071 33.0317 26.4536 27.0314 26.7195V26.7195L27.037 26.7209ZM27.0368 21.1703V17.5118H35.4088V11.9329H12.615V17.5118H20.9856V21.1689C14.1819 21.4814 9.06543 22.8291 9.06543 24.4441C9.06543 26.0591 14.1819 27.4054 20.9856 27.7194V39.4429H27.0354V27.7151C33.8235 27.4026 38.9315 26.0563 38.9315 24.4427C38.9315 22.8291 33.8277 21.4828 27.0354 21.1689V21.1689L27.0368 21.1703Z"
      fill="white"
    />
  </g>
  <defs>
    <clipPath id="clip0_2067_3803">
      <rect width="48" height="48" rx="24" fill="white" />
    </clipPath>
  </defs>
</svg>`;
var voucherDOT = x` <svg
  xmlns="http://www.w3.org/2000/svg"
  xmlns:xlink="http://www.w3.org/1999/xlink"
  width="48px"
  height="49px"
  viewBox="0 0 48 49"
  version="1.1"
>
  <defs>
    <linearGradient id="linear0" gradientUnits="userSpaceOnUse" x1="20.0001" y1="0.916199" x2="20.0001" y2="40.9162">
      <stop offset="0" style="stop-color:rgb(47.843137%,92.941176%,81.176471%);stop-opacity:1;" />
      <stop offset="0.201333" style="stop-color:rgb(40.784314%,80.784314%,98.039216%);stop-opacity:1;" />
      <stop offset="0.403244" style="stop-color:rgb(40.784314%,61.176471%,97.254902%);stop-opacity:1;" />
      <stop offset="0.602076" style="stop-color:rgb(67.45098%,34.117647%,75.294118%);stop-opacity:1;" />
      <stop offset="0.801867" style="stop-color:rgb(90.196078%,33.72549%,34.901961%);stop-opacity:1;" />
      <stop offset="1" style="stop-color:rgb(94.901961%,76.078431%,25.490196%);stop-opacity:1;" />
    </linearGradient>
  </defs>
  <g id="surface1">
    <path
      style=" stroke:none;fill-rule:nonzero;fill:rgb(100%,100%,100%);fill-opacity:1;"
      d="M 24 1.09375 C 37.253906 1.09375 48 11.796875 48 24.996094 C 48 38.199219 37.253906 48.898438 24 48.898438 C 10.746094 48.898438 0 38.199219 0 24.996094 C 0 11.796875 10.746094 1.09375 24 1.09375 Z M 24 1.09375 "
    />
    <path
      style=" stroke:none;fill-rule:evenodd;fill:rgb(90.196078%,0%,47.843137%);fill-opacity:1;"
      d="M 29.589844 12.617188 C 29.589844 14.441406 27.03125 15.921875 23.882812 15.921875 C 20.730469 15.921875 18.175781 14.441406 18.175781 12.617188 C 18.175781 10.792969 20.730469 9.3125 23.882812 9.3125 C 27.03125 9.3125 29.589844 10.792969 29.589844 12.617188 Z M 29.589844 37.523438 C 29.589844 39.351562 27.03125 40.828125 23.882812 40.828125 C 20.730469 40.828125 18.175781 39.351562 18.175781 37.523438 C 18.175781 35.699219 20.730469 34.21875 23.882812 34.21875 C 27.03125 34.21875 29.589844 35.699219 29.589844 37.523438 Z M 15.929688 20.5 C 17.503906 17.78125 17.492188 14.835938 15.90625 13.921875 C 14.316406 13.007812 11.75 14.472656 10.175781 17.191406 C 8.597656 19.910156 8.609375 22.851562 10.199219 23.765625 C 11.785156 24.679688 14.351562 23.21875 15.929688 20.5 Z M 37.5625 26.375 C 39.152344 27.289062 39.160156 30.230469 37.585938 32.949219 C 36.007812 35.667969 33.445312 37.132812 31.855469 36.21875 C 30.269531 35.308594 30.257812 32.363281 31.835938 29.644531 C 33.410156 26.925781 35.976562 25.460938 37.5625 26.375 Z M 15.90625 36.21875 C 17.496094 35.304688 17.503906 32.359375 15.929688 29.644531 C 14.351562 26.925781 11.789062 25.460938 10.199219 26.375 C 8.609375 27.289062 8.601562 30.230469 10.175781 32.949219 C 11.753906 35.667969 14.316406 37.132812 15.90625 36.21875 Z M 37.585938 17.191406 C 39.160156 19.910156 39.152344 22.855469 37.566406 23.765625 C 35.976562 24.679688 33.414062 23.214844 31.835938 20.496094 C 30.261719 17.78125 30.269531 14.835938 31.859375 13.921875 C 33.445312 13.011719 36.007812 14.472656 37.585938 17.191406 Z M 37.585938 17.191406 "
    />
    <path
      style="fill:none;stroke-width:2.5;stroke-linecap:butt;stroke-linejoin:miter;stroke:url(#linear0);stroke-miterlimit:4;"
      d="M 38.75 20.915099 C 38.75 31.272959 30.354818 39.666454 20 39.666454 C 9.645182 39.666454 1.25 31.272959 1.25 20.915099 C 1.25 10.560507 9.645182 2.167012 20 2.167012 C 30.354818 2.167012 38.75 10.560507 38.75 20.915099 Z M 38.75 20.915099 "
      transform="matrix(1.2,0,0,1.195122,0,0)"
    />
  </g>
</svg>`;
var voucherKSM = x` <svg
  xmlns="http://www.w3.org/2000/svg"
  xmlns:xlink="http://www.w3.org/1999/xlink"
  width="48px"
  height="48px"
  viewBox="0 0 48 48"
  version="1.1"
>
  <defs>
    <linearGradient id="linear0" gradientUnits="userSpaceOnUse" x1="20.0001" y1="0" x2="20.0001" y2="40">
      <stop offset="0" style="stop-color:rgb(47.843137%,92.941176%,81.176471%);stop-opacity:1;" />
      <stop offset="0.201333" style="stop-color:rgb(40.784314%,80.784314%,98.039216%);stop-opacity:1;" />
      <stop offset="0.403244" style="stop-color:rgb(40.784314%,61.176471%,97.254902%);stop-opacity:1;" />
      <stop offset="0.602076" style="stop-color:rgb(67.45098%,34.117647%,75.294118%);stop-opacity:1;" />
      <stop offset="0.801867" style="stop-color:rgb(90.196078%,33.72549%,34.901961%);stop-opacity:1;" />
      <stop offset="1" style="stop-color:rgb(94.901961%,76.078431%,25.490196%);stop-opacity:1;" />
    </linearGradient>
  </defs>
  <g id="surface1">
    <path
      style=" stroke:none;fill-rule:nonzero;fill:rgb(100%,100%,100%);fill-opacity:1;"
      d="M 0 24 C 0 10.746094 10.746094 0 24 0 C 37.253906 0 48 10.746094 48 24 C 48 37.253906 37.253906 48 24 48 C 10.746094 48 0 37.253906 0 24 Z M 0 24 "
    />
    <path
      style=" stroke:none;fill-rule:nonzero;fill:rgb(10.588235%,12.54902%,14.901961%);fill-opacity:1;"
      d="M 38.5625 15.292969 C 38.066406 14.917969 37.472656 14.402344 36.398438 14.265625 C 35.382812 14.136719 34.351562 14.792969 33.65625 15.226562 C 32.960938 15.660156 31.640625 16.9375 31.09375 17.324219 C 30.546875 17.707031 29.152344 18.070312 26.914062 19.371094 C 24.671875 20.671875 15.863281 26.136719 15.863281 26.136719 L 18.152344 26.160156 L 7.949219 31.269531 L 8.96875 31.269531 L 7.5 32.351562 C 7.5 32.351562 8.792969 32.6875 9.890625 32.015625 L 9.890625 32.320312 C 9.890625 32.320312 22.050781 27.679688 24.40625 28.886719 L 22.980469 29.292969 C 23.101562 29.292969 25.417969 29.4375 25.417969 29.4375 C 25.417969 29.4375 25.492188 30.835938 26.886719 31.726562 C 28.28125 32.617188 28.304688 33.097656 28.304688 33.097656 C 28.304688 33.097656 27.582031 33.390625 27.582031 33.75 C 27.582031 33.75 28.652344 33.4375 29.648438 33.460938 C 30.644531 33.484375 31.515625 33.75 31.515625 33.75 C 31.515625 33.75 31.441406 33.363281 30.46875 33.097656 C 29.5 32.835938 28.554688 31.824219 28.082031 31.269531 C 27.609375 30.714844 27.289062 29.726562 27.6875 28.738281 C 28.023438 27.902344 29.183594 27.4375 31.589844 26.234375 C 34.429688 24.816406 35.074219 23.753906 35.472656 22.933594 C 35.871094 22.117188 36.46875 20.476562 36.796875 19.707031 C 37.21875 18.71875 37.738281 18.191406 38.160156 17.878906 C 38.582031 17.5625 40.5 16.867188 40.5 16.867188 C 40.5 16.867188 39.039062 15.65625 38.5625 15.292969 Z M 38.5625 15.292969 "
    />
    <path
      style="fill:none;stroke-width:2.5;stroke-linecap:butt;stroke-linejoin:miter;stroke:url(#linear0);stroke-miterlimit:4;"
      d="M 38.75 20 C 38.75 30.354818 30.354818 38.75 20 38.75 C 9.645182 38.75 1.25 30.354818 1.25 20 C 1.25 9.645182 9.645182 1.25 20 1.25 C 30.354818 1.25 38.75 9.645182 38.75 20 Z M 38.75 20 "
      transform="matrix(1.2,0,0,1.2,0,0)"
    />
  </g>
</svg>`;
var wbtc = x`<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
  <g clip-path="url(#clip0_2340_3809)">
    <g clip-path="url(#clip1_2340_3809)">
      <path
        d="M24 51.25C39.0498 51.25 51.25 39.0498 51.25 24C51.25 8.95024 39.0498 -3.25 24 -3.25C8.95024 -3.25 -3.25 8.95024 -3.25 24C-3.25 39.0498 8.95024 51.25 24 51.25Z"
        fill="white"
      />
      <g clip-path="url(#clip2_2340_3809)">
        <path
          d="M38.5082 10.654L37.2451 11.917C40.2589 15.2129 41.9303 19.5172 41.9303 23.9833C41.9303 28.4493 40.2589 32.7537 37.2451 36.0495L38.5082 37.3126C41.8599 33.6771 43.7207 28.9133 43.7207 23.9686C43.7207 19.0238 41.8599 14.26 38.5082 10.6245V10.654Z"
          fill="#5A5564"
        />
        <path
          d="M11.9463 10.7634C15.2422 7.74958 19.5465 6.07825 24.0126 6.07825C28.4786 6.07825 32.783 7.74958 36.0788 10.7634L37.3419 9.50036C33.7064 6.14867 28.9426 4.28784 23.9978 4.28784C19.0531 4.28784 14.2893 6.14867 10.6538 9.50036L11.9463 10.7634Z"
          fill="#5A5564"
        />
        <path
          d="M10.7637 36.0619C7.75339 32.7668 6.08427 28.465 6.08427 24.0019C6.08427 19.5388 7.75339 15.2371 10.7637 11.942L9.50061 10.679C6.14891 14.3145 4.28809 19.0782 4.28809 24.023C4.28809 28.9678 6.14891 33.7315 9.50061 37.367L10.7637 36.0619Z"
          fill="#5A5564"
        />
        <path
          d="M36.0626 37.2283C32.7667 40.2421 28.4623 41.9134 23.9963 41.9134C19.5302 41.9134 15.2259 40.2421 11.93 37.2283L10.667 38.4913C14.3025 41.843 19.0662 43.7038 24.011 43.7038C28.9558 43.7038 33.7195 41.843 37.3551 38.4913L36.0626 37.2283Z"
          fill="#5A5564"
        />
        <path
          d="M31.9738 19.7857C31.7212 17.1501 29.4478 16.266 26.5722 15.9966V12.3674H24.3493V15.9292C23.7641 15.9292 23.1662 15.9292 22.5726 15.9292V12.3674H20.3665V16.0218H15.8574V18.4006C15.8574 18.4006 17.4994 18.3711 17.4741 18.4006C17.7702 18.368 18.0673 18.4516 18.3029 18.6338C18.5385 18.816 18.6942 19.0826 18.7372 19.3773V29.3806C18.7308 29.4846 18.7037 29.5862 18.6574 29.6795C18.6112 29.7727 18.5466 29.8558 18.4677 29.9237C18.3903 29.9929 18.2996 30.0458 18.2012 30.079C18.1028 30.1123 17.9987 30.1254 17.8951 30.1174C17.9246 30.1426 16.2784 30.1174 16.2784 30.1174L15.8574 32.774H20.3244V36.4873H22.5473V32.8287H24.324V36.4705H26.5512V32.7992C30.3066 32.5719 32.9253 31.6457 33.2537 28.1302C33.519 25.301 32.1886 24.0379 30.0624 23.5285C31.3549 22.8928 32.1549 21.7139 31.9738 19.7857ZM28.8583 27.6923C28.8583 30.4542 24.1261 30.1384 22.6189 30.1384V25.2378C24.1261 25.242 28.8583 24.8084 28.8583 27.6923ZM27.8269 20.7877C27.8269 23.3138 23.8777 23.0065 22.6231 23.0065V18.5521C23.8777 18.5521 27.8269 18.1564 27.8269 20.7877Z"
          fill="#F09242"
        />
        <path
          d="M23.9958 47C19.4472 46.9992 15.001 45.6496 11.2193 43.1221C7.43758 40.5945 4.49027 37.0023 2.74998 32.7998C1.00968 28.5973 0.55456 23.9731 1.44215 19.5119C2.32975 15.0507 4.5202 10.9529 7.73655 7.73655C10.9529 4.5202 15.0507 2.32975 19.5119 1.44215C23.9731 0.55456 28.5972 1.00968 32.7998 2.74998C37.0023 4.49027 40.5945 7.43758 43.122 11.2193C45.6496 15.001 46.9992 19.4472 47 23.9958C47.0006 27.0169 46.4059 30.0085 45.25 32.7998C44.0942 35.591 42.3997 38.1272 40.2635 40.2635C38.1272 42.3997 35.591 44.0942 32.7998 45.25C30.0085 46.4059 27.0169 47.0006 23.9958 47ZM23.9958 2.79353C19.8051 2.79686 15.7095 4.04248 12.2266 6.37294C8.74368 8.7034 6.02983 12.0141 4.42805 15.8866C2.82627 19.759 2.40848 24.0194 3.22746 28.1293C4.04645 32.2392 6.06546 36.014 9.0293 38.9767C11.9931 41.9393 15.7688 43.9568 19.879 44.7742C23.9891 45.5915 28.2494 45.1721 32.1212 43.5687C35.9931 41.9654 39.3027 39.2503 41.6317 35.7664C43.9608 32.2826 45.2048 28.1865 45.2065 23.9958C45.2076 21.2105 44.6596 18.4522 43.594 15.8788C42.5284 13.3054 40.9659 10.9672 38.996 8.99808C37.0261 7.02894 34.6873 5.46741 32.1134 4.40278C29.5396 3.33816 26.7811 2.79132 23.9958 2.79353Z"
          fill="#282138"
        />
      </g>
    </g>
  </g>
  <defs>
    <clipPath id="clip0_2340_3809">
      <rect width="48" height="48" rx="24" fill="white" />
    </clipPath>
    <clipPath id="clip1_2340_3809">
      <rect width="54.5" height="54.5" fill="white" transform="translate(-3.25 -3.25)" />
    </clipPath>
    <clipPath id="clip2_2340_3809">
      <rect width="46" height="46" fill="white" transform="translate(1 1)" />
    </clipPath>
  </defs>
</svg>`;
var weth = x`<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
  <g clip-path="url(#clip0_2056_4511)">
    <rect x="-2.83496" y="-2.83472" width="53.6694" height="53.6694" rx="22.3623" fill="white" />
    <circle cx="23.9998" cy="24" r="26.8347" fill="#EDF0F4" />
    <path
      d="M23.9264 7.89917L23.7129 8.62428V29.6635L23.9264 29.8764L33.6923 24.1037L23.9264 7.89917Z"
      fill="#343434"
    />
    <path d="M23.9264 7.89917L14.1602 24.1037L23.9264 29.8764V19.6646V7.89917Z" fill="#8C8C8C" />
    <path d="M23.9265 31.7256L23.8062 31.8723V39.3668L23.9265 39.718L33.6984 25.9558L23.9265 31.7256Z" fill="#3C3C3B" />
    <path d="M23.9264 39.718V31.7256L14.1602 25.9558L23.9264 39.718Z" fill="#8C8C8C" />
    <path d="M23.9268 29.8764L33.6927 24.1036L23.9268 19.6646V29.8764Z" fill="#141414" />
    <path d="M14.1602 24.1036L23.9264 29.8764V19.6646L14.1602 24.1036Z" fill="#393939" />
  </g>
  <defs>
    <clipPath id="clip0_2056_4511">
      <rect width="48" height="48" rx="24" fill="white" />
    </clipPath>
  </defs>
</svg>`;
var zeitgeist = x`
  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
    <g clip-path="url(#clip0_1301_868)">
      <path
        d="M0 14C0 6.26801 6.26801 0 14 0H34C41.732 0 48 6.26801 48 14V34C48 41.732 41.732 48 34 48H14C6.26801 48 0 41.732 0 34V14Z"
        fill="url(#paint0_linear_1301_868)"
      />
      <path
        d="M24.0029 6.50003C19.8893 6.49335 15.9052 7.93794 12.7519 10.5795H35.251C32.0991 7.93748 28.1157 6.49278 24.0029 6.50003ZM24.0029 41.5C28.0776 41.5075 32.0266 40.0893 35.1655 37.4912H12.8374C15.9777 40.0889 19.9274 41.507 24.0029 41.5ZM32.3564 15.3841H39.2598C38.6911 14.3822 38.0257 13.4384 37.2731 12.5662H10.7446C9.63769 13.8419 8.72222 15.2717 8.02686 16.8108H31.3395L32.3564 15.3841ZM23.8349 25.0287H6.50295C6.58607 26.4705 6.84846 27.8963 7.28406 29.2733H22.2137L23.2425 27.826H41.1079C41.3139 26.9057 41.445 25.9702 41.4999 25.0287H23.8349ZM27.7346 21.6036H41.3673C41.2383 20.6484 41.0293 19.7058 40.7424 18.7857H7.26049C6.83206 20.1635 6.57661 21.5893 6.5 23.0302H26.7206L27.7346 21.6036ZM10.7947 35.5045H17.7363L18.7503 34.0779H38.3313C38.9598 33.1916 39.5036 32.2482 39.9554 31.26H8.05044C8.75449 32.8004 9.67892 34.2303 10.7947 35.5045Z"
        fill="white"
      />
    </g>
    <defs>
      <linearGradient id="paint0_linear_1301_868" x1="48" y1="48" x2="0" y2="0" gradientUnits="userSpaceOnUse">
        <stop stop-color="#000" />
        <stop offset="1" stop-color="#000" />
      </linearGradient>
      <clipPath id="clip0_1301_868">
        <rect width="48" height="48" rx="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
`;

// src/component/logo/AssetLogo.ts
var AssetLogo = class extends BaseLogo {
  constructor() {
    super(...arguments);
    this.asset = null;
  }
  render() {
    return x`
      ${o9(
      this.asset && this.asset.toUpperCase(),
      [
        ["AUSD", () => acala],
        ["ACA", () => acala],
        ["APE", () => apecoin],
        ["ASTR", () => astar],
        ["BNC", () => bifrost],
        ["BSX", () => basilisk],
        ["BTC", () => bitcoin],
        ["CFG", () => centrifuge],
        ["DAI", () => dai],
        ["DOT", () => polkadot],
        ["ETH", () => weth],
        ["GLMR", () => moonbeam],
        ["HDX", () => hydraDX],
        ["IBTC", () => ibtc],
        ["INTR", () => interlay],
        ["KAR", () => karura],
        ["KSM", () => kusama],
        ["LRNA", () => lrna],
        ["NODL", () => nodle],
        ["PHA", () => phala],
        ["TNKR", () => tinkernet],
        ["SUB", () => subsocial],
        ["UNQ", () => unique],
        ["USDC", () => usdc],
        ["USDCET", () => usdc],
        ["USDT", () => usdt],
        ["VDOT", () => voucherDOT],
        ["VKSM", () => voucherKSM],
        ["ZTG", () => zeitgeist],
        ["WBTC", () => wbtc],
        ["WETH", () => weth],
        ["WUSDT", () => usdt],
        ["XRT", () => robonomics]
      ],
      () => x`<slot name="placeholder"></slot>`
    )}
    `;
  }
};
__decorateClass([
  n5({ type: String })
], AssetLogo.prototype, "asset", 2);
AssetLogo = __decorateClass([
  e8("uigc-logo-asset")
], AssetLogo);

// src/component/logo/chains.ts
var acala2 = x`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="48"
  height="48"
  viewBox="0 0 48 48"
  fill="none"
>
  <path
    fill-rule="evenodd"
    clip-rule="evenodd"
    d="M24 44C35.0457 44 44 35.0457 44 24C44 12.9543 35.0457 4 24 4C12.9543 4 4 12.9543 4 24C4 35.0457 12.9543 44 24 44ZM24.0816 42.1224C34.0904 42.1224 42.2041 34.0087 42.2041 24C42.2041 13.9913 34.0904 5.87755 24.0816 5.87755C14.0729 5.87755 5.95918 13.9913 5.95918 24C5.95918 34.0087 14.0729 42.1224 24.0816 42.1224ZM24 40.7347C33.2423 40.7347 40.7347 33.2423 40.7347 24C40.7347 14.7577 33.2423 7.26531 24 7.26531C14.7577 7.26531 7.26531 14.7577 7.26531 24C7.26531 33.2423 14.7577 40.7347 24 40.7347ZM24.0408 38.6939C32.1785 38.6939 38.7755 32.0969 38.7755 23.9592C38.7755 15.8215 32.1785 9.22449 24.0408 9.22449C15.9031 9.22449 9.30612 15.8215 9.30612 23.9592C9.30612 32.0969 15.9031 38.6939 24.0408 38.6939ZM23.2092 12.0542L33.8766 30.56L35.0204 28.5755L25.497 12.0542H23.2092ZM12.9796 28.5421L22.1096 12.7033L22.1284 12.7359L22.1464 12.7047L32.966 31.4747H30.6782L27.9448 26.7328C26.7028 26.3402 25.3804 26.1284 24.0085 26.1284C23.3013 26.1284 22.6112 26.1778 21.9402 26.2763L23.2578 23.9942C23.5065 23.982 23.7568 23.9759 24.0085 23.9759C24.8466 23.9759 25.6688 24.0438 26.47 24.1743L22.1276 16.6409L14.1235 30.5265L12.9796 28.5421ZM19.1865 28.3014L23.2891 21.1842L22.1452 19.1998L15.0696 31.4746H17.3574L17.3791 31.4369C19.3413 30.2555 21.5929 29.6584 24.0515 29.6584C25.6215 29.6584 27.1266 29.9357 28.5207 30.4441L26.988 27.7894C26.0206 27.6004 25.0372 27.5055 24.0515 27.506C22.3501 27.506 20.714 27.7855 19.1865 28.3014Z"
    fill="url(#paint0_linear_2069_4558)"
  />
  <defs>
    <linearGradient
      id="paint0_linear_2069_4558"
      x1="41.7551"
      y1="44"
      x2="12.2449"
      y2="7.55102"
      gradientUnits="userSpaceOnUse"
    >
      <stop stop-color="#5A81FF" />
      <stop offset="0.524" stop-color="#E40C5B" />
      <stop offset="1" stop-color="#FF4C3B" />
    </linearGradient>
  </defs>
</svg>`;
var assetHub = x`<svg
  xmlns="http://www.w3.org/2000/svg"
  xmlns:xlink="http://www.w3.org/1999/xlink"
  width="48px"
  height="48px"
  viewBox="0 0 48 48"
  version="1.1"
>
  <g id="surface1">
    <path
      style=" stroke:none;fill-rule:nonzero;fill:rgb(19.607843%,11.372549%,27.843137%);fill-opacity:1;"
      d="M 47.796875 23.949219 C 47.796875 37.085938 37.148438 47.746094 24 47.746094 C 10.851562 47.746094 0.203125 37.09375 0.203125 23.949219 C 0.203125 10.800781 10.859375 0.15625 24 0.15625 C 37.140625 0.15625 47.796875 10.808594 47.796875 23.949219 Z M 47.796875 23.949219 "
    />
    <path
      style=" stroke:none;fill-rule:nonzero;fill:rgb(100%,100%,100%);fill-opacity:1;"
      d="M 33.316406 29.429688 L 28.246094 29.429688 L 27.292969 27.105469 L 20.859375 27.105469 L 19.90625 29.429688 L 14.835938 29.429688 L 20.902344 15.609375 L 27.238281 15.609375 Z M 24.082031 19.199219 L 22.402344 23.324219 L 25.753906 23.324219 Z M 24.082031 19.199219 "
    />
    <path
      style=" stroke:none;fill-rule:nonzero;fill:rgb(90.196078%,0%,47.843137%);fill-opacity:1;"
      d="M 27.59375 9.15625 C 27.59375 11.101562 26.019531 12.675781 24.074219 12.675781 C 22.132812 12.675781 20.558594 11.101562 20.558594 9.15625 C 20.558594 7.214844 22.132812 5.640625 24.074219 5.640625 C 26.019531 5.640625 27.59375 7.214844 27.59375 9.15625 Z M 27.59375 9.15625 "
    />
    <path
      style=" stroke:none;fill-rule:nonzero;fill:rgb(90.196078%,0%,47.843137%);fill-opacity:1;"
      d="M 27.59375 38.78125 C 27.59375 40.726562 26.019531 42.300781 24.074219 42.300781 C 22.132812 42.300781 20.558594 40.726562 20.558594 38.78125 C 20.558594 36.839844 22.132812 35.265625 24.074219 35.265625 C 26.019531 35.265625 27.59375 36.839844 27.59375 38.78125 Z M 27.59375 38.78125 "
    />
    <path
      style=" stroke:none;fill-rule:nonzero;fill:rgb(90.196078%,0%,47.843137%);fill-opacity:1;"
      d="M 14.601562 16.199219 C 14.601562 18.144531 13.027344 19.71875 11.085938 19.71875 C 9.140625 19.71875 7.566406 18.144531 7.566406 16.199219 C 7.566406 14.257812 9.140625 12.683594 11.085938 12.683594 C 13.027344 12.683594 14.601562 14.257812 14.601562 16.199219 Z M 14.601562 16.199219 "
    />
    <path
      style=" stroke:none;fill-rule:nonzero;fill:rgb(90.196078%,0%,47.843137%);fill-opacity:1;"
      d="M 40.589844 16.199219 C 40.589844 18.144531 39.015625 19.71875 37.074219 19.71875 C 35.128906 19.71875 33.554688 18.144531 33.554688 16.199219 C 33.554688 14.257812 35.128906 12.683594 37.074219 12.683594 C 39.015625 12.683594 40.589844 14.257812 40.589844 16.199219 Z M 40.589844 16.199219 "
    />
    <path
      style=" stroke:none;fill-rule:nonzero;fill:rgb(90.196078%,0%,47.843137%);fill-opacity:1;"
      d="M 14.601562 31.859375 C 14.601562 33.800781 13.027344 35.378906 11.085938 35.378906 C 9.140625 35.378906 7.566406 33.800781 7.566406 31.859375 C 7.566406 29.917969 9.140625 28.34375 11.085938 28.34375 C 13.027344 28.34375 14.601562 29.917969 14.601562 31.859375 Z M 14.601562 31.859375 "
    />
    <path
      style=" stroke:none;fill-rule:nonzero;fill:rgb(90.196078%,0%,47.843137%);fill-opacity:1;"
      d="M 40.589844 31.859375 C 40.589844 33.800781 39.015625 35.378906 37.074219 35.378906 C 35.128906 35.378906 33.554688 33.800781 33.554688 31.859375 C 33.554688 29.917969 35.128906 28.34375 37.074219 28.34375 C 39.015625 28.34375 40.589844 29.917969 40.589844 31.859375 Z M 40.589844 31.859375 "
    />
  </g>
</svg>`;
var assetHubKusama = x`<svg
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    width="48px"
    height="48px"
    viewBox="0 0 48 48"
    version="1.1"
  >
    <g id="surface1">
      <path
        style=" stroke:none;fill-rule:nonzero;fill:rgb(0%,0%,0%);fill-opacity:1;"
        d="M 48 24.023438 C 48 37.289062 37.246094 48.046875 23.976562 48.046875 C 10.710938 48.046875 -0.0390625 37.28125 -0.0390625 24.023438 C -0.0390625 10.761719 10.71875 0 23.984375 0 C 37.253906 0 48 10.753906 48 24.023438 Z M 48 24.023438 "
      />
      <path
        style=" stroke:none;fill-rule:nonzero;fill:rgb(100%,100%,100%);fill-opacity:1;"
        d="M 27.613281 9.082031 C 27.613281 11.046875 26.023438 12.636719 24.058594 12.636719 C 22.097656 12.636719 20.503906 11.046875 20.503906 9.082031 C 20.503906 7.121094 22.097656 5.527344 24.058594 5.527344 C 26.023438 5.527344 27.613281 7.121094 27.613281 9.082031 Z M 27.613281 9.082031 "
      />
      <path
        style=" stroke:none;fill-rule:nonzero;fill:rgb(100%,100%,100%);fill-opacity:1;"
        d="M 27.613281 38.992188 C 27.613281 40.957031 26.023438 42.546875 24.058594 42.546875 C 22.097656 42.546875 20.503906 40.957031 20.503906 38.992188 C 20.503906 37.027344 22.097656 35.4375 24.058594 35.4375 C 26.023438 35.4375 27.613281 37.027344 27.613281 38.992188 Z M 27.613281 38.992188 "
      />
      <path
        style=" stroke:none;fill-rule:nonzero;fill:rgb(100%,100%,100%);fill-opacity:1;"
        d="M 14.503906 16.191406 C 14.503906 18.15625 12.914062 19.746094 10.949219 19.746094 C 8.988281 19.746094 7.394531 18.15625 7.394531 16.191406 C 7.394531 14.230469 8.988281 12.636719 10.949219 12.636719 C 12.914062 12.636719 14.503906 14.230469 14.503906 16.191406 Z M 14.503906 16.191406 "
      />
      <path
        style=" stroke:none;fill-rule:nonzero;fill:rgb(100%,100%,100%);fill-opacity:1;"
        d="M 40.734375 16.191406 C 40.734375 18.15625 39.140625 19.746094 37.175781 19.746094 C 35.214844 19.746094 33.621094 18.15625 33.621094 16.191406 C 33.621094 14.230469 35.214844 12.636719 37.175781 12.636719 C 39.140625 12.636719 40.734375 14.230469 40.734375 16.191406 Z M 40.734375 16.191406 "
      />
      <path
        style=" stroke:none;fill-rule:nonzero;fill:rgb(100%,100%,100%);fill-opacity:1;"
        d="M 14.503906 32.003906 C 14.503906 33.964844 12.914062 35.558594 10.949219 35.558594 C 8.988281 35.558594 7.394531 33.964844 7.394531 32.003906 C 7.394531 30.039062 8.988281 28.449219 10.949219 28.449219 C 12.914062 28.449219 14.503906 30.039062 14.503906 32.003906 Z M 14.503906 32.003906 "
      />
      <path
        style=" stroke:none;fill-rule:nonzero;fill:rgb(100%,100%,100%);fill-opacity:1;"
        d="M 40.734375 32.003906 C 40.734375 33.964844 39.140625 35.558594 37.175781 35.558594 C 35.214844 35.558594 33.621094 33.964844 33.621094 32.003906 C 33.621094 30.039062 35.214844 28.449219 37.175781 28.449219 C 39.140625 28.449219 40.734375 30.039062 40.734375 32.003906 Z M 40.734375 32.003906 "
      />
      <path
        style=" stroke:none;fill-rule:nonzero;fill:rgb(100%,100%,100%);fill-opacity:1;"
        d="M 33.316406 29.429688 L 28.246094 29.429688 L 27.292969 27.105469 L 20.859375 27.105469 L 19.90625 29.429688 L 14.835938 29.429688 L 20.902344 15.609375 L 27.238281 15.609375 Z M 24.082031 19.199219 L 22.402344 23.324219 L 25.753906 23.324219 Z M 24.082031 19.199219 "
      />
    </g></svg
  >;`;
var basilisk2 = x`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="48"
  height="48"
  viewBox="0 0 48 48"
  fill="none"
>
  <path
    d="M23.9988 3.8999C27.9546 3.89967 31.8215 5.07835 35.1107 7.28688C38.3999 9.4954 40.9635 12.6346 42.4774 16.3074C43.9912 19.9803 44.3874 24.0218 43.6157 27.9209C42.8441 31.82 40.9392 35.4016 38.1421 38.2127C35.345 41.0238 31.7813 42.9382 27.9015 43.7137C24.0218 44.4893 20.0004 44.0911 16.3458 42.5696C12.6912 41.0482 9.56767 38.4717 7.37013 35.1662C5.17259 31.8605 3.99977 27.9743 4 23.9987C4 21.3593 4.51729 18.7458 5.52233 16.3072C6.52736 13.8687 8.00046 11.6531 9.85753 9.78671C11.7146 7.92036 13.9192 6.4399 16.3456 5.42984C18.772 4.41977 21.3725 3.8999 23.9988 3.8999ZM17.4741 23.9987C17.4741 33.7122 23.9988 41.586 23.9988 41.586C23.9988 41.586 30.5237 33.7122 30.5237 23.9987C30.5237 14.2854 23.9988 6.41268 23.9988 6.41268C23.9988 6.41268 17.4741 14.2865 17.4741 23.9987Z"
    fill="#4FFFB0"
  />
</svg>`;
var bifrost2 = x`<svg
  xmlns="http://www.w3.org/2000/svg"
  xmlns:xlink="http://www.w3.org/1999/xlink"
  width="48px"
  height="48px"
  viewBox="0 0 48 48"
  version="1.1"
>
  <defs>
    <linearGradient
      id="linear0"
      gradientUnits="userSpaceOnUse"
      x1="32.393"
      y1="17.263"
      x2="32.393"
      y2="46.316"
      gradientTransform="matrix(0.75,0,0,0.75,0,0)"
    >
      <stop offset="0" style="stop-color:rgb(47.843137%,92.941176%,81.176471%);stop-opacity:1;" />
      <stop offset="0.201" style="stop-color:rgb(40.784314%,80.784314%,98.039216%);stop-opacity:1;" />
      <stop offset="0.403" style="stop-color:rgb(40.784314%,61.176471%,97.254902%);stop-opacity:1;" />
      <stop offset="0.602" style="stop-color:rgb(67.45098%,34.117647%,75.294118%);stop-opacity:1;" />
      <stop offset="0.802" style="stop-color:rgb(90.196078%,33.72549%,34.901961%);stop-opacity:1;" />
      <stop offset="1" style="stop-color:rgb(94.901961%,76.078431%,25.490196%);stop-opacity:1;" />
    </linearGradient>
  </defs>
  <g id="surface1">
    <path
      style=" stroke:none;fill-rule:evenodd;fill:rgb(0%,0%,0%);fill-opacity:1;"
      d="M 48 24 C 48 10.746094 37.253906 0 24 0 C 10.746094 0 0 10.746094 0 24 C 0 37.253906 10.746094 48 24 48 C 37.253906 48 48 37.253906 48 24 Z M 48 24 "
    />
    <path
      style=" stroke:none;fill-rule:nonzero;fill:url(#linear0);"
      d="M 24.292969 34.738281 L 9.589844 34.738281 L 31.648438 12.945312 L 39 12.945312 Z M 24.292969 34.738281 "
    />
  </g>
</svg>`;
var centrifuge2 = x`
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    width="48px"
    height="48px"
    viewBox="0 0 48 47"
    version="1.1"
    fill="#fff"
  >
    <defs>
      <filter id="alpha" filterUnits="objectBoundingBox" x="0%" y="0%" width="100%" height="100%">
        <feColorMatrix type="matrix" in="SourceGraphic" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0" />
      </filter>
      <image
        id="image7"
        width="48"
        height="47"
        xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAvCAYAAAClgknJAAAABmJLR0QA/wD/AP+gvaeTAAAAlUlEQVRoge3YoQrCUByF8XPFMTCYl4YPYF4TBLtY9nJWraa9iN1kXxQMIjMv7Y5xdxC+X/6ze746CQCAPxZijrrXpVC+2aYe0/PWPax37dDZMupj2eegsL9OHjXG6nSU1AydLWaYkhQBbgS4EeBGgBsBbgS4EeBGgBsBbgS4xf2VCOVDqs+Jt/R9q6d0m/VJAAAAYJwfSVoOYS0fsT4AAAAASUVORK5CYII="
      />
      <mask id="mask0">
        <g filter="url(#alpha)">
          <use xlink:href="#image7" />
        </g>
      </mask>
      <clipPath id="clip1">
        <rect x="0" y="0" width="48" height="47" />
      </clipPath>
      <g id="surface6" clip-path="url(#clip1)">
        <path
          style=" stroke:none;fill-rule:evenodd;fill:rgb(0%,0%,0%);fill-opacity:1;"
          d="M 13 31.738281 C 12.148438 29.933594 11.671875 27.917969 11.671875 25.792969 C 11.671875 18.03125 18.03125 11.734375 25.871094 11.734375 C 30.238281 11.734375 34.140625 13.6875 36.746094 16.757812 L 38.300781 15.46875 C 35.324219 11.957031 30.859375 9.726562 25.871094 9.726562 C 16.910156 9.726562 9.644531 16.921875 9.644531 25.792969 C 9.644531 28.222656 10.1875 30.523438 11.160156 32.585938 Z M 13 31.738281 "
        />
      </g>
    </defs>
    <g id="surface1">
      <path
        style=" stroke:none;fill-rule:nonzero;fill:rgb(100%,100%,100%);fill-opacity:1;"
        d="M 48 24 C 48 37.253906 37.253906 48 24 48 C 10.746094 48 0 37.253906 0 24 C 0 10.746094 10.746094 0 24 0 C 37.253906 0 48 10.746094 48 24 Z M 48 24 "
      ></path>
      <use xlink:href="#surface6" mask="url(#mask0)" />
      <path
        style=" stroke:none;fill-rule:evenodd;fill:rgb(0%,0%,0%);fill-opacity:1;"
        d="M 25.871094 35.335938 C 20.550781 35.335938 16.238281 31.0625 16.238281 25.792969 C 16.238281 20.527344 20.550781 16.253906 25.871094 16.253906 C 28.832031 16.253906 31.484375 17.578125 33.25 19.664062 L 34.804688 18.371094 C 32.664062 15.851562 29.457031 14.246094 25.871094 14.246094 C 19.429688 14.246094 14.207031 19.417969 14.207031 25.792969 C 14.207031 32.171875 19.429688 37.34375 25.871094 37.34375 Z M 25.871094 35.335938 "
      />
      <path
        style=" stroke:none;fill-rule:evenodd;fill:rgb(0%,0%,0%);fill-opacity:1;"
        d="M 29.367188 28.699219 C 28.527344 29.683594 27.273438 30.3125 25.871094 30.3125 C 23.351562 30.3125 21.308594 28.289062 21.308594 25.792969 C 21.308594 23.296875 23.351562 21.277344 25.871094 21.277344 C 27.273438 21.277344 28.527344 21.902344 29.367188 22.890625 L 31.113281 21.4375 C 29.859375 19.957031 27.976562 19.015625 25.871094 19.015625 C 22.089844 19.015625 19.023438 22.050781 19.023438 25.792969 C 19.023438 29.539062 22.089844 32.574219 25.871094 32.574219 C 27.800781 32.574219 29.542969 31.78125 30.785156 30.511719 Z M 29.367188 28.699219 "
      />
    </g>
  </svg>
`;
var hydradx = x`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="48"
  height="48"
  viewBox="0 0 48 48"
  fill="none"
>
  <path
    fill-rule="evenodd"
    clip-rule="evenodd"
    d="M2 24.0008L24.0078 2L46 24.0065L24.0078 46L2 24.0008ZM37.0033 17.3974C36.089 18.4191 34.0952 20.9918 34.0952 24.0008C34.0952 27.0098 36.089 29.5825 37.0033 30.6041C31.1296 30.2933 26.4332 24.0008 26.4332 24.0008C26.4332 24.0008 31.1296 17.7082 37.0033 17.3974ZM11.0284 17.3974C16.9022 17.7082 21.5986 24.0008 21.5986 24.0008C21.5986 24.0008 16.9022 30.2933 11.0284 30.6041C11.9428 29.5825 13.9365 27.0098 13.9365 24.0008C13.9365 20.9918 11.9428 18.4191 11.0284 17.3974ZM10.0978 17.4363C9.16849 18.4822 7.22341 21.0287 7.22341 24.0008C7.22341 26.9845 9.18376 29.5393 10.1087 30.5775L14.8663 35.3389L14.8887 35.317C16.7934 33.4545 19.9596 31.0067 23.5692 30.8202C22.6605 31.8334 20.6565 34.4095 20.6565 37.4241C20.6565 40.4387 22.6605 43.0148 23.5692 44.028L24.0077 44.4875L24.4462 44.028C25.3549 43.0148 27.359 40.4387 27.359 37.4241C27.359 34.4095 25.3549 31.8334 24.4462 30.8202C28.07 31.0074 31.2468 33.4737 33.1491 35.3389L38.019 30.4651L38.0303 30.4522C38.9932 29.3457 40.8083 26.8719 40.8083 24.0008C40.8083 21.1185 38.979 18.6364 38.019 17.5364L33.1718 12.6854L33.1495 12.7073C31.2467 14.5723 28.0699 17.0385 24.4462 17.2257C25.3549 16.2125 27.359 13.6364 27.359 10.6218C27.359 7.60717 25.3549 5.03109 24.4462 4.01792L24.0077 3.51405L23.5692 4.01792C22.6605 5.03109 20.6565 7.60717 20.6565 10.6218C20.6565 13.6364 22.6605 16.2125 23.5692 17.2257C19.9314 17.0378 16.7439 14.5529 14.8436 12.6854L10.0978 17.4363Z"
    fill="#F6297C"
  />
</svg>`;
var interlay2 = x`
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    width="49px"
    height="48px"
    viewBox="0 0 48 48"
    version="1.1"
    fill="#fff"
  >
    <defs>
      <clipPath id="clip1">
        <path d="M 0 0 L 47.945312 0 L 47.945312 47.9375 L 0 47.9375 Z M 0 0 " />
      </clipPath>
    </defs>
    <g id="surface1">
      <path
        style=" stroke:none;fill-rule:nonzero;fill:rgb(100%,100%,100%);fill-opacity:1;"
        d="M 48 24 C 48 37.253906 37.253906 48 24 48 C 10.746094 48 0 37.253906 0 24 C 0 10.746094 10.746094 0 24 0 C 37.253906 0 48 10.746094 48 24 Z M 48 24 "
      />
      <path
        style=" stroke:none;fill-rule:nonzero;fill:rgb(0%,0%,0%);fill-opacity:1;"
        d="M 36.652344 34.546875 L 18.835938 34.546875 C 18.75 34.546875 18.667969 34.523438 18.59375 34.476562 L 12.152344 30.449219 C 11.9375 30.316406 11.863281 30.03125 11.992188 29.816406 C 12.074219 29.679688 12.226562 29.585938 12.394531 29.59375 L 30.210938 29.59375 C 30.296875 29.59375 30.378906 29.617188 30.457031 29.664062 L 36.894531 33.691406 C 37.109375 33.824219 37.183594 34.109375 37.054688 34.324219 C 36.972656 34.464844 36.820312 34.546875 36.652344 34.546875 Z M 18.964844 33.617188 L 35.042969 33.617188 L 30.089844 30.511719 L 14.011719 30.511719 Z M 18.964844 33.617188 "
      />
      <path
        style=" stroke:none;fill-rule:nonzero;fill:rgb(0%,0%,0%);fill-opacity:1;"
        d="M 35.542969 18.351562 L 17.726562 18.351562 C 17.644531 18.351562 17.558594 18.328125 17.484375 18.28125 L 11.050781 14.253906 C 10.832031 14.121094 10.761719 13.835938 10.890625 13.621094 C 10.976562 13.476562 11.125 13.390625 11.292969 13.398438 L 29.113281 13.398438 C 29.195312 13.398438 29.277344 13.421875 29.355469 13.46875 L 35.796875 17.496094 C 36.015625 17.628906 36.082031 17.914062 35.953125 18.128906 C 35.863281 18.277344 35.710938 18.359375 35.542969 18.351562 Z M 17.855469 17.429688 L 33.933594 17.429688 L 28.980469 14.324219 L 12.902344 14.324219 Z M 17.855469 17.429688 "
      />
      <path
        style=" stroke:none;fill-rule:nonzero;fill:rgb(0%,0%,0%);fill-opacity:1;"
        d="M 26.429688 21.949219 C 25.90625 21.425781 25.199219 21.132812 24.472656 21.132812 L 24.441406 21.132812 C 22.890625 21.226562 21.707031 22.566406 21.796875 24.140625 C 21.882812 25.59375 23.035156 26.757812 24.472656 26.828125 L 24.5 26.828125 C 26.050781 26.8125 27.296875 25.527344 27.28125 23.953125 C 27.265625 23.207031 26.960938 22.480469 26.429688 21.949219 Z M 26.429688 21.949219 "
      />
    </g>
  </svg>
`;
var karura2 = x`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="48"
  height="48"
  viewBox="0 0 48 48"
  fill="none"
>
  <path
    d="M32.7848 6L21.6007 16.0693C20.4427 17.1137 18.9359 17.6911 17.3716 17.6982L14.038 17.7053L14.0272 6H8V39.4514H11.2869C13.1245 39.4514 14.8399 38.4856 15.739 36.8994C15.7461 36.8887 15.7497 36.878 15.7569 36.8709C16.3539 35.8088 16.6524 33.7093 16.5948 32.2764C16.4654 29.0008 15.9331 28.1489 15.9331 28.1489C15.8217 30.3944 13.4554 30.5156 13.4554 30.5156C15.1384 28.9224 14.2214 27.7176 14.2214 27.7176C11.2402 29.8205 10.4957 27.5751 10.4382 27.3718C10.5317 27.4503 11.3804 28.1525 12.9915 25.9639C14.6961 23.6508 16.9688 19.794 18.4145 18.8032C19.8637 17.8087 21.2374 17.8906 21.2374 17.8906C21.2374 17.8906 22.0286 16.8285 24.1216 15.9446C26.2146 15.0677 27.5559 16.3545 27.5559 16.3545C25.4162 18.0653 22.5105 20.8741 22.3487 24.8982C22.2192 28.156 29.3036 33.7449 28.0595 42C28.8038 40.1251 29.1023 38.2468 28.847 35.9228C28.642 34.0479 27.4229 30.1307 27.4229 30.1307L34.2268 39.4479H41.75L27.0453 19.4269L41.75 6H32.7848Z"
    fill="url(#paint0_linear_2069_4545)"
  />
  <path
    d="M19.0821 20.4029C18.6074 21.1835 18.6074 21.4224 18.6074 21.4224C18.6074 21.4224 20.2689 21.1443 20.7184 19.1875C20.722 19.1875 19.6575 19.4584 19.0821 20.4029Z"
    fill="url(#paint1_linear_2069_4545)"
  />
  <defs>
    <linearGradient
      id="paint0_linear_2069_4545"
      x1="58.7172"
      y1="29.5542"
      x2="31.0487"
      y2="-0.794177"
      gradientUnits="userSpaceOnUse"
    >
      <stop stop-color="#E40C5B" />
      <stop offset="1" stop-color="#FF4C3B" />
    </linearGradient>
    <linearGradient
      id="paint1_linear_2069_4545"
      x1="21.7797"
      y1="20.6498"
      x2="20.0632"
      y2="18.7529"
      gradientUnits="userSpaceOnUse"
    >
      <stop stop-color="#E40C5B" />
      <stop offset="1" stop-color="#FF4C3B" />
    </linearGradient>
  </defs>
</svg>`;
var moonbeam2 = x`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="48"
  height="48"
  viewBox="0 0 48 48"
  fill="#000"
>
  <circle xmlns="http://www.w3.org/2000/svg" cx="24" cy="24" r="24" fill="#0E132E" />
  <g xmlns="http://www.w3.org/2000/svg" id="surface1" style="transform: translate(3px, 6px);">
    <path
      style=" stroke:none;fill-rule:nonzero;fill:rgb(37.254902%,75.294118%,75.686275%);fill-opacity:1;"
      d="M 27.175781 0.996094 C 31.609375 2.910156 34.566406 7.625 34.234375 12.410156 C 26.300781 12.410156 18.371094 12.476562 10.441406 12.34375 C 10.441406 9.128906 11.515625 5.847656 13.800781 3.59375 C 17.160156 0.105469 22.742188 -0.988281 27.175781 0.996094 Z M 27.175781 0.996094 "
    />
    <path
      style=" stroke:none;fill-rule:nonzero;fill:rgb(88.235294%,9.019608%,48.627451%);fill-opacity:1;"
      d="M 26.835938 31.757812 C 27.3125 31.757812 27.714844 32.03125 27.714844 32.371094 C 27.714844 32.714844 27.3125 32.988281 26.835938 32.988281 L 14.070312 32.988281 C 13.601562 32.988281 13.195312 32.714844 13.195312 32.371094 C 13.195312 32.03125 13.601562 31.757812 14.070312 31.757812 Z M 26.835938 31.757812 "
    />
    <path
      style=" stroke:none;fill-rule:nonzero;fill:rgb(88.235294%,9.019608%,48.627451%);fill-opacity:1;"
      d="M 11.316406 32.988281 C 11.796875 32.988281 12.1875 32.589844 12.1875 32.101562 C 12.1875 31.609375 11.796875 31.210938 11.316406 31.210938 C 10.832031 31.210938 10.441406 31.609375 10.441406 32.101562 C 10.441406 32.589844 10.832031 32.988281 11.316406 32.988281 Z M 11.316406 32.988281 "
    />
    <path
      style=" stroke:none;fill-rule:nonzero;fill:rgb(88.235294%,9.019608%,48.627451%);fill-opacity:1;"
      d="M 18.976562 29.707031 C 19.457031 29.707031 19.847656 29.308594 19.847656 28.816406 C 19.847656 28.328125 19.457031 27.929688 18.976562 27.929688 C 18.492188 27.929688 18.101562 28.328125 18.101562 28.816406 C 18.101562 29.308594 18.492188 29.707031 18.976562 29.707031 Z M 18.976562 29.707031 "
    />
    <path
      style=" stroke:none;fill-rule:nonzero;fill:rgb(88.235294%,9.019608%,48.627451%);fill-opacity:1;"
      d="M 33.964844 27.929688 C 34.433594 27.929688 34.835938 28.339844 34.835938 28.816406 C 34.835938 29.296875 34.433594 29.707031 33.964844 29.707031 L 21.460938 29.707031 C 20.992188 29.707031 20.589844 29.296875 20.589844 28.816406 C 20.589844 28.339844 20.992188 27.929688 21.460938 27.929688 Z M 33.964844 27.929688 "
    />
    <path
      style=" stroke:none;fill-rule:nonzero;fill:rgb(88.235294%,9.019608%,48.627451%);fill-opacity:1;"
      d="M 2.578125 26.425781 C 3.058594 26.425781 3.449219 26.027344 3.449219 25.535156 C 3.449219 25.046875 3.058594 24.648438 2.578125 24.648438 C 2.09375 24.648438 1.703125 25.046875 1.703125 25.535156 C 1.703125 26.027344 2.09375 26.425781 2.578125 26.425781 Z M 2.578125 26.425781 "
    />
    <path
      style=" stroke:none;fill-rule:nonzero;fill:rgb(88.235294%,9.019608%,48.627451%);fill-opacity:1;"
      d="M 15.011719 24.648438 C 15.480469 24.648438 15.886719 25.058594 15.886719 25.535156 C 15.886719 26.015625 15.480469 26.425781 15.011719 26.425781 L 4.730469 26.425781 C 4.257812 26.425781 3.855469 26.015625 3.855469 25.535156 C 3.855469 25.058594 4.257812 24.648438 4.730469 24.648438 Z M 15.011719 24.648438 "
    />
    <path
      style=" stroke:none;fill-rule:nonzero;fill:rgb(88.235294%,9.019608%,48.627451%);fill-opacity:1;"
      d="M 38.0625 24.648438 C 38.535156 24.648438 38.9375 25.058594 38.9375 25.535156 C 38.9375 26.015625 38.535156 26.425781 38.0625 26.425781 L 17.628906 26.425781 C 17.160156 26.425781 16.757812 26.015625 16.757812 25.535156 C 16.757812 25.058594 17.160156 24.648438 17.628906 24.648438 Z M 38.0625 24.648438 "
    />
    <path
      style=" stroke:none;fill-rule:nonzero;fill:rgb(88.235294%,9.019608%,48.627451%);fill-opacity:1;"
      d="M 34.234375 21.367188 C 34.703125 21.367188 35.105469 21.777344 35.105469 22.253906 C 35.105469 22.734375 34.703125 23.144531 34.234375 23.144531 L 9.164062 23.144531 C 8.691406 23.144531 8.289062 22.734375 8.289062 22.253906 C 8.289062 21.777344 8.691406 21.367188 9.164062 21.367188 Z M 34.234375 21.367188 "
    />
    <path
      style=" stroke:none;fill-rule:nonzero;fill:rgb(88.235294%,9.019608%,48.627451%);fill-opacity:1;"
      d="M 6.40625 23.144531 C 6.890625 23.144531 7.28125 22.746094 7.28125 22.253906 C 7.28125 21.765625 6.890625 21.367188 6.40625 21.367188 C 5.925781 21.367188 5.535156 21.765625 5.535156 22.253906 C 5.535156 22.746094 5.925781 23.144531 6.40625 23.144531 Z M 6.40625 23.144531 "
    />
    <path
      style=" stroke:none;fill-rule:nonzero;fill:rgb(88.235294%,9.019608%,48.627451%);fill-opacity:1;"
      d="M 28.988281 18.152344 C 29.460938 18.152344 29.863281 18.5625 29.863281 19.042969 C 29.863281 19.519531 29.460938 19.933594 28.988281 19.933594 L 3.921875 19.933594 C 3.449219 19.933594 3.046875 19.519531 3.046875 19.042969 C 3.046875 18.5625 3.449219 18.152344 3.921875 18.152344 Z M 28.988281 18.152344 "
    />
    <path
      style=" stroke:none;fill-rule:nonzero;fill:rgb(88.235294%,9.019608%,48.627451%);fill-opacity:1;"
      d="M 0.898438 19.933594 C 1.378906 19.933594 1.769531 19.53125 1.769531 19.042969 C 1.769531 18.554688 1.378906 18.152344 0.898438 18.152344 C 0.414062 18.152344 0.0273438 18.554688 0.0273438 19.042969 C 0.0273438 19.53125 0.414062 19.933594 0.898438 19.933594 Z M 0.898438 19.933594 "
    />
    <path
      style=" stroke:none;fill-rule:nonzero;fill:rgb(88.235294%,9.019608%,48.627451%);fill-opacity:1;"
      d="M 6.40625 16.648438 C 6.890625 16.648438 7.28125 16.25 7.28125 15.761719 C 7.28125 15.269531 6.890625 14.871094 6.40625 14.871094 C 5.925781 14.871094 5.535156 15.269531 5.535156 15.761719 C 5.535156 16.25 5.925781 16.648438 6.40625 16.648438 Z M 6.40625 16.648438 "
    />
    <path
      style=" stroke:none;fill-rule:nonzero;fill:rgb(88.235294%,9.019608%,48.627451%);fill-opacity:1;"
      d="M 36.652344 14.871094 C 37.121094 14.871094 37.523438 15.28125 37.523438 15.761719 C 37.523438 16.238281 37.121094 16.648438 36.652344 16.648438 L 9.367188 16.648438 C 8.894531 16.648438 8.492188 16.238281 8.492188 15.761719 C 8.492188 15.28125 8.894531 14.871094 9.367188 14.871094 Z M 36.652344 14.871094 "
    />
  </g>
</svg>`;
var phala2 = x`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="48"
  height="48"
  viewBox="0 0 48 48"
  fill="none"
>
  <path
    fill-rule="evenodd"
    clip-rule="evenodd"
    d="M34.1995 7H13.8017H12.8241H7V20.6005V22.7719V23.9998H13.8017V22.7719V20.6005V13.8003H34.1995V7ZM40.9997 13.8003H34.1995V24L13.8017 24V30.8002H34.1995L34.1995 24H40.9997V13.8003ZM7 30.8004H13.8017V34.2012H13.8003V41H7V34.2012V32.5008V30.8004Z"
    fill="#DBFC6F"
  />
</svg>`;
var polkadot2 = x`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="48"
  height="48"
  viewBox="0 0 48 48"
  fill="none"
>
  <path
    fill-rule="evenodd"
    clip-rule="evenodd"
    d="M31.2084 8.19583C31.2084 10.5131 27.981 12.3917 23.9996 12.3917C20.0183 12.3917 16.7908 10.5131 16.7908 8.19583C16.7908 5.87854 20.0183 4 23.9996 4C27.981 4 31.2084 5.87854 31.2084 8.19583ZM31.2084 39.8042C31.2084 42.1215 27.981 44.0001 23.9996 44.0001C20.0183 44.0001 16.7908 42.1215 16.7908 39.8042C16.7908 37.4869 20.0183 35.6084 23.9996 35.6084C27.981 35.6084 31.2084 37.4869 31.2084 39.8042ZM13.9499 18.1959C15.9406 14.747 15.928 11.0118 13.9219 9.85318C11.9157 8.69454 8.67567 10.5512 6.68502 14.0001C4.69436 17.449 4.70691 21.1841 6.71305 22.3428C8.71919 23.5014 11.9592 21.6448 13.9499 18.1959ZM41.2863 25.6591C43.2925 26.8177 43.305 30.5529 41.3144 34.0018C39.3237 37.4507 36.0837 39.3073 34.0775 38.1487C32.0714 36.99 32.0588 33.2549 34.0495 29.806C36.0401 26.3571 39.2802 24.5004 41.2863 25.6591ZM13.9228 38.1468C15.929 36.9882 15.9415 33.253 13.9509 29.8041C11.9602 26.3552 8.72017 24.4986 6.71403 25.6572C4.70789 26.8159 4.69533 30.551 6.68599 33.9999C8.67665 37.4488 11.9167 39.3055 13.9228 38.1468ZM41.3124 13.9987C43.3031 17.4476 43.2905 21.1827 41.2844 22.3414C39.2782 23.5 36.0382 21.6434 34.0475 18.1945C32.0569 14.7456 32.0694 11.0104 34.0756 9.85179C36.0817 8.69315 39.3218 10.5498 41.3124 13.9987Z"
    fill="#E6007A"
  />
</svg>`;
var statemine = x`<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
  <g id="surface1">
    <path
      style=" stroke:none;fill-rule:nonzero;fill:rgb(0%,0%,0%);fill-opacity:1;"
      d="M 48 24 C 48 37.253906 37.253906 48 24 48 C 10.746094 48 0 37.253906 0 24 C 0 10.746094 10.746094 0 24 0 C 37.253906 0 48 10.746094 48 24 Z M 48 24 "
    />
    <path
      style=" stroke:none;fill-rule:nonzero;fill:rgb(100%,100%,100%);fill-opacity:1;"
      d="M 13.953125 18.121094 C 12.773438 13.730469 15.378906 9.21875 19.769531 8.042969 C 20.949219 12.441406 20.722656 11.601562 21.902344 15.992188 C 23.078125 20.382812 22.851562 19.542969 24.03125 23.941406 C 19.640625 25.117188 15.128906 22.511719 13.953125 18.121094 Z M 13.953125 18.121094 "
    />
    <path
      style=" stroke:none;fill-rule:nonzero;fill:rgb(100%,100%,100%);fill-opacity:1;"
      d="M 34.082031 29.820312 C 35.257812 34.210938 32.652344 38.722656 28.261719 39.898438 C 27.082031 35.5 27.308594 36.339844 26.132812 31.949219 C 24.957031 27.558594 25.179688 28.402344 24 24 C 28.390625 22.824219 32.90625 25.429688 34.082031 29.820312 Z M 34.082031 29.820312 "
    />
    <path
      style=" stroke:none;fill-rule:nonzero;fill:rgb(100%,100%,100%);fill-opacity:1;"
      d="M 16.613281 39.890625 C 13.402344 36.675781 13.402344 31.464844 16.613281 28.25 C 19.835938 31.472656 19.21875 30.855469 22.433594 34.070312 C 25.648438 37.285156 25.03125 36.667969 28.253906 39.890625 C 25.039062 43.105469 19.828125 43.105469 16.613281 39.890625 Z M 16.613281 39.890625 "
    />
    <path
      style=" stroke:none;fill-rule:nonzero;fill:rgb(100%,100%,100%);fill-opacity:1;"
      d="M 31.378906 8.101562 C 34.59375 11.316406 34.59375 16.527344 31.378906 19.738281 C 28.160156 16.519531 28.773438 17.132812 25.5625 13.921875 C 22.347656 10.707031 22.964844 11.320312 19.742188 8.101562 C 22.957031 4.886719 28.167969 4.886719 31.378906 8.101562 Z M 31.378906 8.101562 "
    />
  </g>
</svg>`;
var subsocial2 = x`
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    width="48px"
    height="48px"
    viewBox="0 0 48 48"
    version="1.1"
  >
    <defs>
      <linearGradient id="linear0">
        <stop stop-color="#fff" />
      </linearGradient>
    </defs>
    <g id="surface1">
      <path
        style=" stroke:none;fill-rule:evenodd;fill:url(#linear0);"
        d="M 48 24 C 48 37.253906 37.253906 48 24 48 C 10.746094 48 0 37.253906 0 24 C 0 10.746094 10.746094 0 24 0 C 37.253906 0 48 10.746094 48 24 Z M 23.917969 5.117188 C 19.015625 5.117188 15.039062 9.09375 15.039062 14 L 15.039062 19.757812 C 15.039062 24.664062 19.015625 28.636719 23.917969 28.636719 C 24.605469 28.636719 25.277344 28.558594 25.921875 28.410156 C 26.304688 28.324219 26.414062 27.847656 26.128906 27.570312 L 26.078125 27.527344 L 20.964844 22.640625 C 20.171875 21.871094 19.679688 20.792969 19.679688 19.597656 L 19.679688 14.160156 C 19.679688 11.816406 21.578125 9.917969 23.917969 9.917969 C 26.261719 9.917969 28.160156 11.816406 28.160156 14.160156 L 28.160156 16 C 28.160156 16.351562 28.445312 16.640625 28.796875 16.640625 L 32.160156 16.640625 C 32.511719 16.640625 32.796875 16.351562 32.796875 16 L 32.796875 14 C 32.796875 9.09375 28.824219 5.117188 23.917969 5.117188 Z M 32.800781 33.519531 C 32.800781 38.425781 28.824219 42.398438 23.921875 42.398438 C 19.015625 42.398438 15.039062 38.425781 15.039062 33.519531 L 15.039062 31.519531 C 15.039062 31.167969 15.328125 30.878906 15.679688 30.878906 L 19.039062 30.878906 C 19.394531 30.878906 19.679688 31.167969 19.679688 31.519531 L 19.679688 33.359375 C 19.679688 35.703125 21.578125 37.601562 23.921875 37.601562 C 26.261719 37.601562 28.160156 35.703125 28.160156 33.359375 L 28.160156 27.921875 C 28.160156 26.726562 27.667969 25.648438 26.875 24.878906 L 21.757812 19.992188 L 21.710938 19.945312 C 21.421875 19.671875 21.53125 19.195312 21.917969 19.105469 C 22.5625 18.957031 23.230469 18.878906 23.921875 18.878906 C 28.824219 18.878906 32.800781 22.855469 32.800781 27.761719 Z M 32.800781 33.519531 "
      />
    </g>
  </svg>
`;
var zeitgeist2 = x`<svg
  width="35"
  height="35"
  viewBox="0 0 35 35"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <path
    d="M17.5029 2.71592e-05C13.3894 -0.00665233 9.40525 1.43794 6.25189 4.07953H28.7511C25.5991 1.43748 21.6157 -0.00722342 17.5029 2.71592e-05ZM17.5029 35C21.5777 35.0076 25.5266 33.5894 28.6656 30.9913H6.33738C9.47772 33.589 13.4274 35.007 17.5029 35ZM25.8565 8.88414H32.7598C32.1911 7.88224 31.5257 6.93843 30.7731 6.06622H4.24457C3.1377 7.34186 2.22222 8.77167 1.52686 10.3108H24.8396L25.8565 8.88414ZM17.3349 18.5287H0.002946C0.0860681 19.9705 0.348459 21.3964 0.784063 22.7733H15.7137L16.7425 21.326H34.608C34.8139 20.4057 34.945 19.4702 35 18.5287H17.3349ZM21.2346 15.1036H34.8674C34.7384 14.1485 34.5294 13.2058 34.2425 12.2857H0.760486C0.332061 13.6636 0.0766067 15.0894 0 16.5303H20.2207L21.2346 15.1036ZM4.29467 29.0046H11.2363L12.2503 27.5779H31.8313C32.4599 26.6916 33.0037 25.7482 33.4554 24.76H1.55044C2.25449 26.3005 3.17892 27.7303 4.29467 29.0046Z"
    fill="white"
  ></path>
</svg> `;

// src/component/logo/ChainLogo.ts
var ChainLogo = class extends BaseLogo {
  constructor() {
    super(...arguments);
    this.chain = null;
  }
  render() {
    return x`
      ${o9(
      this.chain,
      [
        ["acala", () => acala2],
        ["astar", () => astar],
        ["assethub", () => assetHub],
        ["assethub-kusama", () => assetHub],
        ["basilisk", () => basilisk2],
        ["bifrost", () => bifrost2],
        ["centrifuge", () => centrifuge2],
        ["hydradx", () => hydradx],
        ["interlay", () => interlay2],
        ["karura", () => karura2],
        ["kusama", () => kusama],
        ["moonbeam", () => moonbeam2],
        ["nodle", () => nodle],
        ["phala", () => phala2],
        ["polkadot", () => polkadot2],
        ["robonomics", () => robonomics],
        ["statemine", () => assetHubKusama],
        ["statemint", () => assetHub],
        ["subsocial", () => subsocial2],
        ["tinkernet", () => tinkernet],
        ["unique", () => unique],
        ["zeitgeist", () => zeitgeist2]
      ],
      () => x`<slot name="placeholder"></slot>`
    )}
    `;
  }
};
__decorateClass([
  n5({ type: String })
], ChainLogo.prototype, "chain", 2);
ChainLogo = __decorateClass([
  e8("uigc-logo-chain")
], ChainLogo);

// src/component/logo/PlaceholderLogo.ts
var PlaceholderLogo = class extends BaseLogo {
  bsxTemplate() {
    return x` <svg bsx width="32" height="32" viewBox="0 0 102 102" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M101.301 51C101.301 78.7805 78.7806 101.301 51.0002 101.301C23.2197 101.301 0.699219 78.7805 0.699219 51C0.699219 23.2196 23.2197 0.699097 51.0002 0.699097C78.7806 0.699097 101.301 23.2196 101.301 51Z"
        fill="#2C3335"
      ></path>
      <path
        d="M101.301 51C101.301 78.7805 78.7806 101.301 51.0002 101.301C23.2197 101.301 0.699219 78.7805 0.699219 51C0.699219 23.2196 23.2197 0.699097 51.0002 0.699097C78.7806 0.699097 101.301 23.2196 101.301 51Z"
        fill="url(#paint0_linear_2955_35124)"
        fill-opacity="0.5"
      ></path>
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M51.0002 98.301C77.1237 98.301 98.3011 77.1236 98.3011 51C98.3011 24.8764 77.1237 3.6991 51.0002 3.6991C24.8766 3.6991 3.69922 24.8764 3.69922 51C3.69922 77.1236 24.8766 98.301 51.0002 98.301ZM51.0002 101.301C78.7806 101.301 101.301 78.7805 101.301 51C101.301 23.2196 78.7806 0.699097 51.0002 0.699097C23.2197 0.699097 0.699219 23.2196 0.699219 51C0.699219 78.7805 23.2197 101.301 51.0002 101.301Z"
        fill="url(#paint1_linear_2955_35124)"
        fill-opacity="0.33"
      ></path>
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M51.0002 98.301C77.1237 98.301 98.3011 77.1236 98.3011 51C98.3011 24.8764 77.1237 3.6991 51.0002 3.6991C24.8766 3.6991 3.69922 24.8764 3.69922 51C3.69922 77.1236 24.8766 98.301 51.0002 98.301ZM51.0002 101.301C78.7806 101.301 101.301 78.7805 101.301 51C101.301 23.2196 78.7806 0.699097 51.0002 0.699097C23.2197 0.699097 0.699219 23.2196 0.699219 51C0.699219 78.7805 23.2197 101.301 51.0002 101.301Z"
        fill="url(#paint2_linear_2955_35124)"
        fill-opacity="0.33"
      ></path>
      <g opacity="0.6">
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M54.3707 48.3235C56.8888 46.4502 57.8793 44.7539 57.8793 43.2582C57.8793 41.5178 57.2872 40.2423 56.147 39.3095C54.9849 38.3586 53.2832 37.8182 50.9127 37.8182C48.5998 37.8182 46.9966 38.4084 45.9386 39.4378C44.8818 40.4969 44.3096 41.9009 44.28 43.7444C44.2784 44.088 44.19 44.5257 43.844 44.8717C43.4949 45.2208 43.0525 45.3077 42.7076 45.3077H39.7022C39.3603 45.3077 38.9175 45.2305 38.5588 44.8994C38.185 44.5544 38.082 44.1017 38.082 43.7353C38.082 40.5068 39.1387 37.7294 41.2628 35.466C43.4853 33.1001 46.7507 32.0018 50.865 32.0018C54.9519 32.0018 58.2547 32.9571 60.6281 35.0102C63.0077 37.041 64.2204 39.638 64.2204 42.7335C64.2204 44.3799 63.9283 45.9018 63.3261 47.2833L63.3222 47.2921C62.7383 48.5975 61.9978 49.6879 61.0829 50.5296C60.2794 51.2688 59.3974 52.0546 58.437 52.8869L58.4297 52.8932L58.4223 52.8994C57.4739 53.6897 56.6063 54.4312 55.819 55.124C55.1443 55.7177 54.5526 56.522 54.059 57.5672L54.0543 57.5771C53.588 58.5372 53.3438 59.6409 53.3438 60.9088C53.3438 61.2752 53.2408 61.7279 52.867 62.0729C52.5084 62.404 52.0655 62.4812 51.7236 62.4812H48.4321C48.0902 62.4812 47.6473 62.404 47.2887 62.0729C46.9149 61.7279 46.8119 61.2752 46.8119 60.9088C46.8119 58.7763 47.2187 56.841 48.0587 55.126C48.8682 53.4733 49.8645 52.1041 51.062 51.0474C52.1598 50.0788 53.2592 49.1734 54.3601 48.3315L54.3707 48.3235Z"
          fill="url(#paint3_linear_2955_35124)"
        ></path>
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M54.3707 48.3235C56.8888 46.4502 57.8793 44.7539 57.8793 43.2582C57.8793 41.5178 57.2872 40.2423 56.147 39.3095C54.9849 38.3586 53.2832 37.8182 50.9127 37.8182C48.5998 37.8182 46.9966 38.4084 45.9386 39.4378C44.8818 40.4969 44.3096 41.9009 44.28 43.7444C44.2784 44.088 44.19 44.5257 43.844 44.8717C43.4949 45.2208 43.0525 45.3077 42.7076 45.3077H39.7022C39.3603 45.3077 38.9175 45.2305 38.5588 44.8994C38.185 44.5544 38.082 44.1017 38.082 43.7353C38.082 40.5068 39.1387 37.7294 41.2628 35.466C43.4853 33.1001 46.7507 32.0018 50.865 32.0018C54.9519 32.0018 58.2547 32.9571 60.6281 35.0102C63.0077 37.041 64.2204 39.638 64.2204 42.7335C64.2204 44.3799 63.9283 45.9018 63.3261 47.2833L63.3222 47.2921C62.7383 48.5975 61.9978 49.6879 61.0829 50.5296C60.2794 51.2688 59.3974 52.0546 58.437 52.8869L58.4297 52.8932L58.4223 52.8994C57.4739 53.6897 56.6063 54.4312 55.819 55.124C55.1443 55.7177 54.5526 56.522 54.059 57.5672L54.0543 57.5771C53.588 58.5372 53.3438 59.6409 53.3438 60.9088C53.3438 61.2752 53.2408 61.7279 52.867 62.0729C52.5084 62.404 52.0655 62.4812 51.7236 62.4812H48.4321C48.0902 62.4812 47.6473 62.404 47.2887 62.0729C46.9149 61.7279 46.8119 61.2752 46.8119 60.9088C46.8119 58.7763 47.2187 56.841 48.0587 55.126C48.8682 53.4733 49.8645 52.1041 51.062 51.0474C52.1598 50.0788 53.2592 49.1734 54.3601 48.3315L54.3707 48.3235Z"
          fill="url(#paint4_linear_2955_35124)"
        ></path>
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M54.3707 48.3235C56.8888 46.4502 57.8793 44.7539 57.8793 43.2582C57.8793 41.5178 57.2872 40.2423 56.147 39.3095C54.9849 38.3586 53.2832 37.8182 50.9127 37.8182C48.5998 37.8182 46.9966 38.4084 45.9386 39.4378C44.8818 40.4969 44.3096 41.9009 44.28 43.7444C44.2784 44.088 44.19 44.5257 43.844 44.8717C43.4949 45.2208 43.0525 45.3077 42.7076 45.3077H39.7022C39.3603 45.3077 38.9175 45.2305 38.5588 44.8994C38.185 44.5544 38.082 44.1017 38.082 43.7353C38.082 40.5068 39.1387 37.7294 41.2628 35.466C43.4853 33.1001 46.7507 32.0018 50.865 32.0018C54.9519 32.0018 58.2547 32.9571 60.6281 35.0102C63.0077 37.041 64.2204 39.638 64.2204 42.7335C64.2204 44.3799 63.9283 45.9018 63.3261 47.2833L63.3222 47.2921C62.7383 48.5975 61.9978 49.6879 61.0829 50.5296C60.2794 51.2688 59.3974 52.0546 58.437 52.8869L58.4297 52.8932L58.4223 52.8994C57.4739 53.6897 56.6063 54.4312 55.819 55.124C55.1443 55.7177 54.5526 56.522 54.059 57.5672L54.0543 57.5771C53.588 58.5372 53.3438 59.6409 53.3438 60.9088C53.3438 61.2752 53.2408 61.7279 52.867 62.0729C52.5084 62.404 52.0655 62.4812 51.7236 62.4812H48.4321C48.0902 62.4812 47.6473 62.404 47.2887 62.0729C46.9149 61.7279 46.8119 61.2752 46.8119 60.9088C46.8119 58.7763 47.2187 56.841 48.0587 55.126C48.8682 53.4733 49.8645 52.1041 51.062 51.0474C52.1598 50.0788 53.2592 49.1734 54.3601 48.3315L54.3707 48.3235Z"
          fill="url(#paint5_linear_2955_35124)"
        ></path>
        <path
          d="M45.1523 69.7634C45.1523 71.111 45.6228 72.2881 46.5635 73.2288C47.5402 74.2055 48.7364 74.7144 50.1034 74.7144C51.5022 74.7144 52.7116 74.2171 53.6547 73.2174C54.5877 72.2786 55.0544 71.1056 55.0544 69.7634C55.0544 68.4213 54.5877 67.2482 53.6547 66.3095C52.7116 65.3097 51.5022 64.8124 50.1034 64.8124C48.7364 64.8124 47.5402 65.3213 46.5635 66.298C45.6228 67.2387 45.1523 68.4158 45.1523 69.7634Z"
          fill="url(#paint6_linear_2955_35124)"
        ></path>
        <path
          d="M45.1523 69.7634C45.1523 71.111 45.6228 72.2881 46.5635 73.2288C47.5402 74.2055 48.7364 74.7144 50.1034 74.7144C51.5022 74.7144 52.7116 74.2171 53.6547 73.2174C54.5877 72.2786 55.0544 71.1056 55.0544 69.7634C55.0544 68.4213 54.5877 67.2482 53.6547 66.3095C52.7116 65.3097 51.5022 64.8124 50.1034 64.8124C48.7364 64.8124 47.5402 65.3213 46.5635 66.298C45.6228 67.2387 45.1523 68.4158 45.1523 69.7634Z"
          fill="url(#paint7_linear_2955_35124)"
        ></path>
        <path
          d="M45.1523 69.7634C45.1523 71.111 45.6228 72.2881 46.5635 73.2288C47.5402 74.2055 48.7364 74.7144 50.1034 74.7144C51.5022 74.7144 52.7116 74.2171 53.6547 73.2174C54.5877 72.2786 55.0544 71.1056 55.0544 69.7634C55.0544 68.4213 54.5877 67.2482 53.6547 66.3095C52.7116 65.3097 51.5022 64.8124 50.1034 64.8124C48.7364 64.8124 47.5402 65.3213 46.5635 66.298C45.6228 67.2387 45.1523 68.4158 45.1523 69.7634Z"
          fill="url(#paint8_linear_2955_35124)"
        ></path>
      </g>
      <defs>
        <linearGradient
          id="paint0_linear_2955_35124"
          x1="51.0002"
          y1="0.699097"
          x2="51.0002"
          y2="101.301"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#323B3E"></stop>
          <stop offset="1" stop-color="#212728"></stop>
        </linearGradient>
        <linearGradient
          id="paint1_linear_2955_35124"
          x1="0.699219"
          y1="101.392"
          x2="101.301"
          y2="101.392"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#4FFFB0"></stop>
          <stop offset="1" stop-color="#4FFFB1" stop-opacity="0"></stop>
        </linearGradient>
        <linearGradient
          id="paint2_linear_2955_35124"
          x1="51.0002"
          y1="0.699097"
          x2="51.0002"
          y2="101.301"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#FCAE33"></stop>
          <stop offset="1" stop-color="#FCAE33" stop-opacity="0"></stop>
        </linearGradient>
        <linearGradient
          id="paint3_linear_2955_35124"
          x1="38.415"
          y1="13.9047"
          x2="65.3025"
          y2="13.9047"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#FFCE4F"></stop>
          <stop offset="1" stop-color="#4FFFB0"></stop>
        </linearGradient>
        <linearGradient
          id="paint4_linear_2955_35124"
          x1="38.415"
          y1="13.9047"
          x2="65.3025"
          y2="13.9047"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#4FFFB0"></stop>
          <stop offset="0.505223" stop-color="#A2FF76"></stop>
          <stop offset="1" stop-color="#FF984E"></stop>
        </linearGradient>
        <linearGradient
          id="paint5_linear_2955_35124"
          x1="38.415"
          y1="13.9047"
          x2="65.3025"
          y2="13.9047"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#4FFFB0"></stop>
          <stop offset="0.463556" stop-color="#B3FF8F"></stop>
          <stop offset="1" stop-color="#FF984E"></stop>
        </linearGradient>
        <linearGradient
          id="paint6_linear_2955_35124"
          x1="45.2785"
          y1="58.933"
          x2="55.4644"
          y2="58.933"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#FFCE4F"></stop>
          <stop offset="1" stop-color="#4FFFB0"></stop>
        </linearGradient>
        <linearGradient
          id="paint7_linear_2955_35124"
          x1="45.2785"
          y1="58.933"
          x2="55.4644"
          y2="58.933"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#4FFFB0"></stop>
          <stop offset="0.505223" stop-color="#A2FF76"></stop>
          <stop offset="1" stop-color="#FF984E"></stop>
        </linearGradient>
        <linearGradient
          id="paint8_linear_2955_35124"
          x1="45.2785"
          y1="58.933"
          x2="55.4644"
          y2="58.933"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#4FFFB0"></stop>
          <stop offset="0.463556" stop-color="#B3FF8F"></stop>
          <stop offset="1" stop-color="#FF984E"></stop>
        </linearGradient>
      </defs>
    </svg>`;
  }
  hdxTemplate() {
    return x` <svg hdx xmlns="http://www.w3.org/2000/svg" width="33" height="33" viewBox="0 0 33 33" fill="none">
      <rect x="0.722656" y="1" width="31" height="31" rx="15.5" fill="#333750" />
      <g filter="url(#filter0_d_14306_13732)">
        <path
          d="M17.2467 21.0438V23.9958C17.2467 24.3318 17.0947 24.4998 16.7907 24.4998H14.6547C14.3347 24.4998 14.1747 24.3238 14.1747 23.9718V21.0678C14.1747 20.7478 14.3347 20.5878 14.6547 20.5878H16.7907C17.0947 20.5878 17.2467 20.7398 17.2467 21.0438ZM17.2227 17.8998V18.5238C17.2227 18.8598 17.0547 19.0278 16.7187 19.0278H14.8227C14.4867 19.0278 14.3187 18.8598 14.3187 18.5238V17.8758C14.3187 17.3478 14.4067 16.9238 14.5827 16.6038C14.7587 16.2678 15.0547 15.9318 15.4707 15.5958L16.8147 14.4918C17.3267 14.0918 17.5827 13.6518 17.5827 13.1718V13.0278C17.5827 12.5318 17.4627 12.1798 17.2227 11.9718C16.9987 11.7478 16.6227 11.6358 16.0947 11.6358H15.6627C15.1667 11.6358 14.8067 11.7398 14.5827 11.9478C14.3747 12.1558 14.2707 12.5158 14.2707 13.0278V13.5318C14.2707 13.8838 14.1027 14.0598 13.7667 14.0598H11.7267C11.3907 14.0598 11.2227 13.8838 11.2227 13.5318V12.9798C11.2227 11.7318 11.5667 10.7718 12.2547 10.0998C12.9427 9.4278 13.9187 9.0918 15.1827 9.0918H16.5987C17.8627 9.0918 18.8387 9.4278 19.5267 10.0998C20.2147 10.7718 20.5587 11.7318 20.5587 12.9798V13.3158C20.5587 14.0998 20.1987 14.8038 19.4787 15.4278L17.8467 16.7478C17.4307 17.1318 17.2227 17.5158 17.2227 17.8998Z"
          fill="url(#paint0_linear_14306_13732)"
          shape-rendering="crispEdges"
        />
      </g>
      <rect x="0.722656" y="1" width="31" height="31" rx="15.5" stroke="#333750" />
      <defs>
        <filter
          id="filter0_d_14306_13732"
          x="5.22266"
          y="3.0918"
          width="21.3359"
          height="27.4082"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="3" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix type="matrix" values="0 0 0 0 0.448076 0 0 0 0 0.470153 0 0 0 0 1 0 0 0 0.74 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_14306_13732" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_14306_13732" result="shape" />
        </filter>
        <linearGradient
          id="paint0_linear_14306_13732"
          x1="15.8581"
          y1="11.4734"
          x2="15.8581"
          y2="23.0608"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#68C9FF" />
          <stop offset="1" stop-color="#809AC2" stop-opacity="0.27" />
        </linearGradient>
      </defs>
    </svg>`;
  }
  render() {
    return x` ${this.bsxTemplate()} ${this.hdxTemplate()} `;
  }
};
PlaceholderLogo = __decorateClass([
  e8("uigc-logo-placeholder")
], PlaceholderLogo);

// src/component/AssetId.ts
var AssetId = class extends UIGCElement {
  constructor() {
    super(...arguments);
    this.symbol = null;
    this.chain = null;
  }
  async updated() {
    const logoChain = this.shadowRoot.querySelector("uigc-logo-chain");
    if (this.chain) {
      logoChain.setAttribute("chain", this.chain);
    } else {
      logoChain.removeAttribute("chain");
    }
  }
  render() {
    return x`
      <uigc-logo-asset fit .asset=${this.symbol}>
        <uigc-logo-placeholder fit slot="placeholder"></uigc-logo-placeholder>
      </uigc-logo-asset>
      <uigc-logo-chain fit>
        <uigc-logo-placeholder fit slot="placeholder"></uigc-logo-placeholder>
      </uigc-logo-chain>
    `;
  }
};
AssetId.styles = [
  i`
      :host {
        position: relative;
      }

      uigc-logo-chain {
        display: none;
      }

      :host([chain]) uigc-logo-asset {
        mask: radial-gradient(112% 112% at 84% 16%, transparent 25%, white 25%);
        -webkit-mask: radial-gradient(112% 112% at 84% 16%, transparent 25%, white 25%);
      }

      :host([chain]) uigc-logo-chain {
        display: flex;
        position: absolute;
        width: 50%;
        height: 50%;
        right: -10%;
        top: -10%;
        z-index: 1;
      }
    `
];
__decorateClass([
  n5({ type: String })
], AssetId.prototype, "symbol", 2);
__decorateClass([
  n5({ type: String })
], AssetId.prototype, "chain", 2);
AssetId = __decorateClass([
  e8("uigc-asset-id")
], AssetId);

// src/component/Asset.ts
var Asset = class extends UIGCElement {
  constructor() {
    super(...arguments);
    this.symbol = null;
    this.desc = null;
    this.multi = false;
  }
  async updated() {
    const iconSlot = this.shadowRoot.querySelector("slot[name=icon]");
    const icons = iconSlot.assignedElements();
    if (icons.length > 1) {
      this.multi = true;
    } else {
      this.multi = false;
    }
  }
  render() {
    return x` <slot name="icon"></slot>
      <span class="title">
        <span class="code">${this.symbol}</span>
        ${n9(this.desc, () => x` <span class="desc">${this.desc}</span> `)}
      </span>
      <slot></slot>`;
  }
};
Asset.styles = [
  UIGCElement.styles,
  i`
      :host {
        display: flex;
        flex-direction: row;
        align-items: center;
        background-color: transparent;
        height: 32px;
        border-radius: 8px;
        cursor: pointer;
      }

      span.code {
        font-weight: 700;
        font-size: 16px;
        line-height: 100%;
        color: var(--hex-white);
      }

      span.desc {
        font-weight: 500;
        font-size: 12px;
        line-height: 14px;
        color: var(--hex-neutral-gray-400);
        white-space: nowrap;
      }

      span.title {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        padding: 5px 0px;
        margin-left: 6px;
      }

      ::slotted(*) {
        width: 30px;
        height: 30px;
      }

      ::slotted(*:not(:first-child)) {
        margin-left: -3px;
      }

      :host([multi]) ::slotted(*) {
        width: 26px;
        height: 26px;
      }

      :host([icon]) span.title {
        display: none;
      }
    `
];
__decorateClass([
  n5({ type: String })
], Asset.prototype, "symbol", 2);
__decorateClass([
  n5({ type: String })
], Asset.prototype, "desc", 2);
__decorateClass([
  n5({ type: Boolean, reflect: true })
], Asset.prototype, "multi", 2);
Asset = __decorateClass([
  e8("uigc-asset")
], Asset);

// src/component/utils/formatters.ts
function amountFormatter(amount) {
  const amountNo = Number(amount);
  if (Number.isInteger(amountNo)) {
    const formattedNo2 = new Intl.NumberFormat("en-US").format(amountNo);
    return formattedNo2.replaceAll(",", " ");
  }
  let maxSignDigits = 4;
  if (amountNo > 1) {
    const intPartLen = Math.ceil(Math.log10(Number(amountNo) + 1));
    maxSignDigits = maxSignDigits + intPartLen;
  }
  const formattedNo = new Intl.NumberFormat("en-US", { maximumSignificantDigits: maxSignDigits }).format(amountNo);
  return formattedNo.replaceAll(",", " ");
}

// src/component/AssetBalance.ts
var AssetBalance = class extends UIGCElement {
  constructor() {
    super(...arguments);
    this.balance = null;
    this.disabled = false;
    this.visible = true;
    this.formatter = null;
    this.onMaxClick = null;
  }
  isEmptyBalance() {
    return this.balance == null || this.balance == "" || this.balance == "0";
  }
  render() {
    const formatterFn = this.formatter ? this.formatter : amountFormatter;
    return x`
      <div class="balance">
        <span class="label">Balance: &nbsp</span>
        <span>${this.balance ? formatterFn(this.balance) : "-"}</span>
        ${n9(
      this.visible,
      () => x`
            <uigc-button
              class="max"
              variant="max"
              size="micro"
              capitalize
              ?disabled=${this.isEmptyBalance() || this.disabled}
              @click=${this.onMaxClick}
              >Max</uigc-button
            >
          `
    )}
      </div>
    `;
  }
};
AssetBalance.styles = [
  UIGCElement.styles,
  i`
      .balance {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: end;
      }

      .balance > span {
        font-weight: 500;
        font-size: 12px;
        line-height: 16px;
        color: var(--hex-white);
      }

      .balance > span.label {
        color: rgba(var(--rgb-white), 0.7);
      }

      .max {
        margin-left: 5px;
        margin-top: -2px;
      }
    `
];
__decorateClass([
  n5({ type: String })
], AssetBalance.prototype, "balance", 2);
__decorateClass([
  n5({ type: Boolean })
], AssetBalance.prototype, "disabled", 2);
__decorateClass([
  n5({ type: Boolean })
], AssetBalance.prototype, "visible", 2);
__decorateClass([
  n5({ attribute: false })
], AssetBalance.prototype, "formatter", 2);
__decorateClass([
  n5({ attribute: false })
], AssetBalance.prototype, "onMaxClick", 2);
AssetBalance = __decorateClass([
  e8("uigc-asset-balance")
], AssetBalance);

// src/component/types/InputConfig.ts
var priceMaskSettings = {
  mask: Number,
  scale: 18,
  signed: false,
  thousandsSeparator: " ",
  padFractionalZeros: false,
  normalizeZeros: true,
  radix: ".",
  mapToRadix: ["."]
};
var textMask = /^[0-9a-zA-Z]+$/;

// ../../node_modules/ts-debounce/dist/src/index.esm.js
function r6(r7, e10, n10) {
  var i7, t7, o12;
  void 0 === e10 && (e10 = 50), void 0 === n10 && (n10 = {});
  var a4 = null != (i7 = n10.isImmediate) && i7, u3 = null != (t7 = n10.callback) && t7, c6 = n10.maxWait, v3 = Date.now(), l7 = [];
  function f2() {
    if (void 0 !== c6) {
      var r8 = Date.now() - v3;
      if (r8 + e10 >= c6)
        return c6 - r8;
    }
    return e10;
  }
  var d4 = function() {
    var e11 = [].slice.call(arguments), n11 = this;
    return new Promise(function(i8, t8) {
      var c7 = a4 && void 0 === o12;
      if (void 0 !== o12 && clearTimeout(o12), o12 = setTimeout(function() {
        if (o12 = void 0, v3 = Date.now(), !a4) {
          var i9 = r7.apply(n11, e11);
          u3 && u3(i9), l7.forEach(function(r8) {
            return (0, r8.resolve)(i9);
          }), l7 = [];
        }
      }, f2()), c7) {
        var d5 = r7.apply(n11, e11);
        return u3 && u3(d5), i8(d5);
      }
      l7.push({ resolve: i8, reject: t8 });
    });
  };
  return d4.cancel = function(r8) {
    void 0 !== o12 && clearTimeout(o12), l7.forEach(function(e11) {
      return (0, e11.reject)(r8);
    }), l7 = [];
  }, d4;
}

// ../../node_modules/imask/esm/_rollupPluginBabelHelpers-6b3bd404.js
function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null)
    return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i7;
  for (i7 = 0; i7 < sourceKeys.length; i7++) {
    key = sourceKeys[i7];
    if (excluded.indexOf(key) >= 0)
      continue;
    target[key] = source[key];
  }
  return target;
}

// ../../node_modules/imask/esm/core/holder.js
function IMask(el) {
  let opts = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  return new IMask.InputMask(el, opts);
}

// ../../node_modules/imask/esm/core/change-details.js
var ChangeDetails = class {
  /** Inserted symbols */
  /** Can skip chars */
  /** Additional offset if any changes occurred before tail */
  /** Raw inserted is used by dynamic mask */
  constructor(details) {
    Object.assign(this, {
      inserted: "",
      rawInserted: "",
      skip: false,
      tailShift: 0
    }, details);
  }
  /**
    Aggregate changes
    @returns {ChangeDetails} `this`
  */
  aggregate(details) {
    this.rawInserted += details.rawInserted;
    this.skip = this.skip || details.skip;
    this.inserted += details.inserted;
    this.tailShift += details.tailShift;
    return this;
  }
  /** Total offset considering all changes */
  get offset() {
    return this.tailShift + this.inserted.length;
  }
};
IMask.ChangeDetails = ChangeDetails;

// ../../node_modules/imask/esm/core/utils.js
function isString(str) {
  return typeof str === "string" || str instanceof String;
}
var DIRECTION = {
  NONE: "NONE",
  LEFT: "LEFT",
  FORCE_LEFT: "FORCE_LEFT",
  RIGHT: "RIGHT",
  FORCE_RIGHT: "FORCE_RIGHT"
};
function forceDirection(direction) {
  switch (direction) {
    case DIRECTION.LEFT:
      return DIRECTION.FORCE_LEFT;
    case DIRECTION.RIGHT:
      return DIRECTION.FORCE_RIGHT;
    default:
      return direction;
  }
}
function escapeRegExp(str) {
  return str.replace(/([.*+?^=!:${}()|[\]\/\\])/g, "\\$1");
}
function normalizePrepare(prep) {
  return Array.isArray(prep) ? prep : [prep, new ChangeDetails()];
}
function objectIncludes(b2, a4) {
  if (a4 === b2)
    return true;
  var arrA = Array.isArray(a4), arrB = Array.isArray(b2), i7;
  if (arrA && arrB) {
    if (a4.length != b2.length)
      return false;
    for (i7 = 0; i7 < a4.length; i7++)
      if (!objectIncludes(a4[i7], b2[i7]))
        return false;
    return true;
  }
  if (arrA != arrB)
    return false;
  if (a4 && b2 && typeof a4 === "object" && typeof b2 === "object") {
    var dateA = a4 instanceof Date, dateB = b2 instanceof Date;
    if (dateA && dateB)
      return a4.getTime() == b2.getTime();
    if (dateA != dateB)
      return false;
    var regexpA = a4 instanceof RegExp, regexpB = b2 instanceof RegExp;
    if (regexpA && regexpB)
      return a4.toString() == b2.toString();
    if (regexpA != regexpB)
      return false;
    var keys = Object.keys(a4);
    for (i7 = 0; i7 < keys.length; i7++)
      if (!Object.prototype.hasOwnProperty.call(b2, keys[i7]))
        return false;
    for (i7 = 0; i7 < keys.length; i7++)
      if (!objectIncludes(b2[keys[i7]], a4[keys[i7]]))
        return false;
    return true;
  } else if (a4 && b2 && typeof a4 === "function" && typeof b2 === "function") {
    return a4.toString() === b2.toString();
  }
  return false;
}

// ../../node_modules/imask/esm/core/action-details.js
var ActionDetails = class {
  /** Current input value */
  /** Current cursor position */
  /** Old input value */
  /** Old selection */
  constructor(value, cursorPos, oldValue, oldSelection) {
    this.value = value;
    this.cursorPos = cursorPos;
    this.oldValue = oldValue;
    this.oldSelection = oldSelection;
    while (this.value.slice(0, this.startChangePos) !== this.oldValue.slice(0, this.startChangePos)) {
      --this.oldSelection.start;
    }
  }
  /**
    Start changing position
    @readonly
  */
  get startChangePos() {
    return Math.min(this.cursorPos, this.oldSelection.start);
  }
  /**
    Inserted symbols count
    @readonly
  */
  get insertedCount() {
    return this.cursorPos - this.startChangePos;
  }
  /**
    Inserted symbols
    @readonly
  */
  get inserted() {
    return this.value.substr(this.startChangePos, this.insertedCount);
  }
  /**
    Removed symbols count
    @readonly
  */
  get removedCount() {
    return Math.max(this.oldSelection.end - this.startChangePos || // for Delete
    this.oldValue.length - this.value.length, 0);
  }
  /**
    Removed symbols
    @readonly
  */
  get removed() {
    return this.oldValue.substr(this.startChangePos, this.removedCount);
  }
  /**
    Unchanged head symbols
    @readonly
  */
  get head() {
    return this.value.substring(0, this.startChangePos);
  }
  /**
    Unchanged tail symbols
    @readonly
  */
  get tail() {
    return this.value.substring(this.startChangePos + this.insertedCount);
  }
  /**
    Remove direction
    @readonly
  */
  get removeDirection() {
    if (!this.removedCount || this.insertedCount)
      return DIRECTION.NONE;
    return (this.oldSelection.end === this.cursorPos || this.oldSelection.start === this.cursorPos) && // if not range removed (event with backspace)
    this.oldSelection.end === this.oldSelection.start ? DIRECTION.RIGHT : DIRECTION.LEFT;
  }
};

// ../../node_modules/imask/esm/core/continuous-tail-details.js
var ContinuousTailDetails = class {
  /** Tail value as string */
  /** Tail start position */
  /** Start position */
  constructor() {
    let value = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
    let from = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
    let stop = arguments.length > 2 ? arguments[2] : void 0;
    this.value = value;
    this.from = from;
    this.stop = stop;
  }
  toString() {
    return this.value;
  }
  extend(tail) {
    this.value += String(tail);
  }
  appendTo(masked) {
    return masked.append(this.toString(), {
      tail: true
    }).aggregate(masked._appendPlaceholder());
  }
  get state() {
    return {
      value: this.value,
      from: this.from,
      stop: this.stop
    };
  }
  set state(state) {
    Object.assign(this, state);
  }
  unshift(beforePos) {
    if (!this.value.length || beforePos != null && this.from >= beforePos)
      return "";
    const shiftChar = this.value[0];
    this.value = this.value.slice(1);
    return shiftChar;
  }
  shift() {
    if (!this.value.length)
      return "";
    const shiftChar = this.value[this.value.length - 1];
    this.value = this.value.slice(0, -1);
    return shiftChar;
  }
};

// ../../node_modules/imask/esm/masked/base.js
var Masked = class {
  // $Shape<MaskedOptions>; TODO after fix https://github.com/facebook/flow/issues/4773
  /** @type {Mask} */
  /** */
  // $FlowFixMe no ideas
  /** Transforms value before mask processing */
  /** Validates if value is acceptable */
  /** Does additional processing in the end of editing */
  /** Format typed value to string */
  /** Parse strgin to get typed value */
  /** Enable characters overwriting */
  /** */
  /** */
  /** */
  constructor(opts) {
    this._value = "";
    this._update(Object.assign({}, Masked.DEFAULTS, opts));
    this.isInitialized = true;
  }
  /** Sets and applies new options */
  updateOptions(opts) {
    if (!Object.keys(opts).length)
      return;
    this.withValueRefresh(this._update.bind(this, opts));
  }
  /**
    Sets new options
    @protected
  */
  _update(opts) {
    Object.assign(this, opts);
  }
  /** Mask state */
  get state() {
    return {
      _value: this.value
    };
  }
  set state(state) {
    this._value = state._value;
  }
  /** Resets value */
  reset() {
    this._value = "";
  }
  /** */
  get value() {
    return this._value;
  }
  set value(value) {
    this.resolve(value);
  }
  /** Resolve new value */
  resolve(value) {
    let flags = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {
      input: true
    };
    this.reset();
    this.append(value, flags, "");
    this.doCommit();
    return this.value;
  }
  /** */
  get unmaskedValue() {
    return this.value;
  }
  set unmaskedValue(value) {
    this.reset();
    this.append(value, {}, "");
    this.doCommit();
  }
  /** */
  get typedValue() {
    return this.doParse(this.value);
  }
  set typedValue(value) {
    this.value = this.doFormat(value);
  }
  /** Value that includes raw user input */
  get rawInputValue() {
    return this.extractInput(0, this.value.length, {
      raw: true
    });
  }
  set rawInputValue(value) {
    this.reset();
    this.append(value, {
      raw: true
    }, "");
    this.doCommit();
  }
  get displayValue() {
    return this.value;
  }
  /** */
  get isComplete() {
    return true;
  }
  /** */
  get isFilled() {
    return this.isComplete;
  }
  /** Finds nearest input position in direction */
  nearestInputPos(cursorPos, direction) {
    return cursorPos;
  }
  totalInputPositions() {
    let fromPos = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0;
    let toPos = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : this.value.length;
    return Math.min(this.value.length, toPos - fromPos);
  }
  /** Extracts value in range considering flags */
  extractInput() {
    let fromPos = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0;
    let toPos = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : this.value.length;
    return this.value.slice(fromPos, toPos);
  }
  /** Extracts tail in range */
  extractTail() {
    let fromPos = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0;
    let toPos = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : this.value.length;
    return new ContinuousTailDetails(this.extractInput(fromPos, toPos), fromPos);
  }
  /** Appends tail */
  // $FlowFixMe no ideas
  appendTail(tail) {
    if (isString(tail))
      tail = new ContinuousTailDetails(String(tail));
    return tail.appendTo(this);
  }
  /** Appends char */
  _appendCharRaw(ch) {
    if (!ch)
      return new ChangeDetails();
    this._value += ch;
    return new ChangeDetails({
      inserted: ch,
      rawInserted: ch
    });
  }
  /** Appends char */
  _appendChar(ch) {
    let flags = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    let checkTail = arguments.length > 2 ? arguments[2] : void 0;
    const consistentState = this.state;
    let details;
    [ch, details] = normalizePrepare(this.doPrepare(ch, flags));
    details = details.aggregate(this._appendCharRaw(ch, flags));
    if (details.inserted) {
      let consistentTail;
      let appended = this.doValidate(flags) !== false;
      if (appended && checkTail != null) {
        const beforeTailState = this.state;
        if (this.overwrite === true) {
          consistentTail = checkTail.state;
          checkTail.unshift(this.value.length - details.tailShift);
        }
        let tailDetails = this.appendTail(checkTail);
        appended = tailDetails.rawInserted === checkTail.toString();
        if (!(appended && tailDetails.inserted) && this.overwrite === "shift") {
          this.state = beforeTailState;
          consistentTail = checkTail.state;
          checkTail.shift();
          tailDetails = this.appendTail(checkTail);
          appended = tailDetails.rawInserted === checkTail.toString();
        }
        if (appended && tailDetails.inserted)
          this.state = beforeTailState;
      }
      if (!appended) {
        details = new ChangeDetails();
        this.state = consistentState;
        if (checkTail && consistentTail)
          checkTail.state = consistentTail;
      }
    }
    return details;
  }
  /** Appends optional placeholder at end */
  _appendPlaceholder() {
    return new ChangeDetails();
  }
  /** Appends optional eager placeholder at end */
  _appendEager() {
    return new ChangeDetails();
  }
  /** Appends symbols considering flags */
  // $FlowFixMe no ideas
  append(str, flags, tail) {
    if (!isString(str))
      throw new Error("value should be string");
    const details = new ChangeDetails();
    const checkTail = isString(tail) ? new ContinuousTailDetails(String(tail)) : tail;
    if (flags !== null && flags !== void 0 && flags.tail)
      flags._beforeTailState = this.state;
    for (let ci = 0; ci < str.length; ++ci) {
      const d4 = this._appendChar(str[ci], flags, checkTail);
      if (!d4.rawInserted && !this.doSkipInvalid(str[ci], flags, checkTail))
        break;
      details.aggregate(d4);
    }
    if ((this.eager === true || this.eager === "append") && flags !== null && flags !== void 0 && flags.input && str) {
      details.aggregate(this._appendEager());
    }
    if (checkTail != null) {
      details.tailShift += this.appendTail(checkTail).tailShift;
    }
    return details;
  }
  /** */
  remove() {
    let fromPos = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0;
    let toPos = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : this.value.length;
    this._value = this.value.slice(0, fromPos) + this.value.slice(toPos);
    return new ChangeDetails();
  }
  /** Calls function and reapplies current value */
  withValueRefresh(fn) {
    if (this._refreshing || !this.isInitialized)
      return fn();
    this._refreshing = true;
    const rawInput = this.rawInputValue;
    const value = this.value;
    const ret = fn();
    this.rawInputValue = rawInput;
    if (this.value && this.value !== value && value.indexOf(this.value) === 0) {
      this.append(value.slice(this.value.length), {}, "");
    }
    delete this._refreshing;
    return ret;
  }
  /** */
  runIsolated(fn) {
    if (this._isolated || !this.isInitialized)
      return fn(this);
    this._isolated = true;
    const state = this.state;
    const ret = fn(this);
    this.state = state;
    delete this._isolated;
    return ret;
  }
  /** */
  doSkipInvalid(ch) {
    return this.skipInvalid;
  }
  /**
    Prepares string before mask processing
    @protected
  */
  doPrepare(str) {
    let flags = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    return this.prepare ? this.prepare(str, this, flags) : str;
  }
  /**
    Validates if value is acceptable
    @protected
  */
  doValidate(flags) {
    return (!this.validate || this.validate(this.value, this, flags)) && (!this.parent || this.parent.doValidate(flags));
  }
  /**
    Does additional processing in the end of editing
    @protected
  */
  doCommit() {
    if (this.commit)
      this.commit(this.value, this);
  }
  /** */
  doFormat(value) {
    return this.format ? this.format(value, this) : value;
  }
  /** */
  doParse(str) {
    return this.parse ? this.parse(str, this) : str;
  }
  /** */
  splice(start, deleteCount, inserted, removeDirection) {
    let flags = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : {
      input: true
    };
    const tailPos = start + deleteCount;
    const tail = this.extractTail(tailPos);
    const eagerRemove = this.eager === true || this.eager === "remove";
    let oldRawValue;
    if (eagerRemove) {
      removeDirection = forceDirection(removeDirection);
      oldRawValue = this.extractInput(0, tailPos, {
        raw: true
      });
    }
    let startChangePos = start;
    const details = new ChangeDetails();
    if (removeDirection !== DIRECTION.NONE) {
      startChangePos = this.nearestInputPos(start, deleteCount > 1 && start !== 0 && !eagerRemove ? DIRECTION.NONE : removeDirection);
      details.tailShift = startChangePos - start;
    }
    details.aggregate(this.remove(startChangePos));
    if (eagerRemove && removeDirection !== DIRECTION.NONE && oldRawValue === this.rawInputValue) {
      if (removeDirection === DIRECTION.FORCE_LEFT) {
        let valLength;
        while (oldRawValue === this.rawInputValue && (valLength = this.value.length)) {
          details.aggregate(new ChangeDetails({
            tailShift: -1
          })).aggregate(this.remove(valLength - 1));
        }
      } else if (removeDirection === DIRECTION.FORCE_RIGHT) {
        tail.unshift();
      }
    }
    return details.aggregate(this.append(inserted, flags, tail));
  }
  maskEquals(mask) {
    return this.mask === mask;
  }
  typedValueEquals(value) {
    const tval = this.typedValue;
    return value === tval || Masked.EMPTY_VALUES.includes(value) && Masked.EMPTY_VALUES.includes(tval) || this.doFormat(value) === this.doFormat(this.typedValue);
  }
};
Masked.DEFAULTS = {
  format: String,
  parse: (v3) => v3,
  skipInvalid: true
};
Masked.EMPTY_VALUES = [void 0, null, ""];
IMask.Masked = Masked;

// ../../node_modules/imask/esm/masked/factory.js
function maskedClass(mask) {
  if (mask == null) {
    throw new Error("mask property should be defined");
  }
  if (mask instanceof RegExp)
    return IMask.MaskedRegExp;
  if (isString(mask))
    return IMask.MaskedPattern;
  if (mask instanceof Date || mask === Date)
    return IMask.MaskedDate;
  if (mask instanceof Number || typeof mask === "number" || mask === Number)
    return IMask.MaskedNumber;
  if (Array.isArray(mask) || mask === Array)
    return IMask.MaskedDynamic;
  if (IMask.Masked && mask.prototype instanceof IMask.Masked)
    return mask;
  if (mask instanceof IMask.Masked)
    return mask.constructor;
  if (mask instanceof Function)
    return IMask.MaskedFunction;
  console.warn("Mask not found for mask", mask);
  return IMask.Masked;
}
function createMask(opts) {
  if (IMask.Masked && opts instanceof IMask.Masked)
    return opts;
  opts = Object.assign({}, opts);
  const mask = opts.mask;
  if (IMask.Masked && mask instanceof IMask.Masked)
    return mask;
  const MaskedClass = maskedClass(mask);
  if (!MaskedClass)
    throw new Error("Masked class is not found for provided mask, appropriate module needs to be import manually before creating mask.");
  return new MaskedClass(opts);
}
IMask.createMask = createMask;

// ../../node_modules/imask/esm/masked/pattern/input-definition.js
var _excluded = ["parent", "isOptional", "placeholderChar", "displayChar", "lazy", "eager"];
var DEFAULT_INPUT_DEFINITIONS = {
  "0": /\d/,
  "a": /[\u0041-\u005A\u0061-\u007A\u00AA\u00B5\u00BA\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0\u08A2-\u08AC\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097F\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191C\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA697\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA793\uA7A0-\uA7AA\uA7F8-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA80-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]/,
  // http://stackoverflow.com/a/22075070
  "*": /./
};
var PatternInputDefinition = class {
  /** */
  /** */
  /** */
  /** */
  /** */
  /** */
  /** */
  /** */
  constructor(opts) {
    const {
      parent,
      isOptional,
      placeholderChar,
      displayChar,
      lazy,
      eager
    } = opts, maskOpts = _objectWithoutPropertiesLoose(opts, _excluded);
    this.masked = createMask(maskOpts);
    Object.assign(this, {
      parent,
      isOptional,
      placeholderChar,
      displayChar,
      lazy,
      eager
    });
  }
  reset() {
    this.isFilled = false;
    this.masked.reset();
  }
  remove() {
    let fromPos = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0;
    let toPos = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : this.value.length;
    if (fromPos === 0 && toPos >= 1) {
      this.isFilled = false;
      return this.masked.remove(fromPos, toPos);
    }
    return new ChangeDetails();
  }
  get value() {
    return this.masked.value || (this.isFilled && !this.isOptional ? this.placeholderChar : "");
  }
  get unmaskedValue() {
    return this.masked.unmaskedValue;
  }
  get displayValue() {
    return this.masked.value && this.displayChar || this.value;
  }
  get isComplete() {
    return Boolean(this.masked.value) || this.isOptional;
  }
  _appendChar(ch) {
    let flags = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    if (this.isFilled)
      return new ChangeDetails();
    const state = this.masked.state;
    const details = this.masked._appendChar(ch, flags);
    if (details.inserted && this.doValidate(flags) === false) {
      details.inserted = details.rawInserted = "";
      this.masked.state = state;
    }
    if (!details.inserted && !this.isOptional && !this.lazy && !flags.input) {
      details.inserted = this.placeholderChar;
    }
    details.skip = !details.inserted && !this.isOptional;
    this.isFilled = Boolean(details.inserted);
    return details;
  }
  append() {
    return this.masked.append(...arguments);
  }
  _appendPlaceholder() {
    const details = new ChangeDetails();
    if (this.isFilled || this.isOptional)
      return details;
    this.isFilled = true;
    details.inserted = this.placeholderChar;
    return details;
  }
  _appendEager() {
    return new ChangeDetails();
  }
  extractTail() {
    return this.masked.extractTail(...arguments);
  }
  appendTail() {
    return this.masked.appendTail(...arguments);
  }
  extractInput() {
    let fromPos = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0;
    let toPos = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : this.value.length;
    let flags = arguments.length > 2 ? arguments[2] : void 0;
    return this.masked.extractInput(fromPos, toPos, flags);
  }
  nearestInputPos(cursorPos) {
    let direction = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : DIRECTION.NONE;
    const minPos = 0;
    const maxPos = this.value.length;
    const boundPos = Math.min(Math.max(cursorPos, minPos), maxPos);
    switch (direction) {
      case DIRECTION.LEFT:
      case DIRECTION.FORCE_LEFT:
        return this.isComplete ? boundPos : minPos;
      case DIRECTION.RIGHT:
      case DIRECTION.FORCE_RIGHT:
        return this.isComplete ? boundPos : maxPos;
      case DIRECTION.NONE:
      default:
        return boundPos;
    }
  }
  totalInputPositions() {
    let fromPos = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0;
    let toPos = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : this.value.length;
    return this.value.slice(fromPos, toPos).length;
  }
  doValidate() {
    return this.masked.doValidate(...arguments) && (!this.parent || this.parent.doValidate(...arguments));
  }
  doCommit() {
    this.masked.doCommit();
  }
  get state() {
    return {
      masked: this.masked.state,
      isFilled: this.isFilled
    };
  }
  set state(state) {
    this.masked.state = state.masked;
    this.isFilled = state.isFilled;
  }
};

// ../../node_modules/imask/esm/masked/pattern/fixed-definition.js
var PatternFixedDefinition = class {
  /** */
  /** */
  /** */
  /** */
  /** */
  /** */
  constructor(opts) {
    Object.assign(this, opts);
    this._value = "";
    this.isFixed = true;
  }
  get value() {
    return this._value;
  }
  get unmaskedValue() {
    return this.isUnmasking ? this.value : "";
  }
  get displayValue() {
    return this.value;
  }
  reset() {
    this._isRawInput = false;
    this._value = "";
  }
  remove() {
    let fromPos = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0;
    let toPos = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : this._value.length;
    this._value = this._value.slice(0, fromPos) + this._value.slice(toPos);
    if (!this._value)
      this._isRawInput = false;
    return new ChangeDetails();
  }
  nearestInputPos(cursorPos) {
    let direction = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : DIRECTION.NONE;
    const minPos = 0;
    const maxPos = this._value.length;
    switch (direction) {
      case DIRECTION.LEFT:
      case DIRECTION.FORCE_LEFT:
        return minPos;
      case DIRECTION.NONE:
      case DIRECTION.RIGHT:
      case DIRECTION.FORCE_RIGHT:
      default:
        return maxPos;
    }
  }
  totalInputPositions() {
    let fromPos = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0;
    let toPos = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : this._value.length;
    return this._isRawInput ? toPos - fromPos : 0;
  }
  extractInput() {
    let fromPos = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0;
    let toPos = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : this._value.length;
    let flags = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    return flags.raw && this._isRawInput && this._value.slice(fromPos, toPos) || "";
  }
  get isComplete() {
    return true;
  }
  get isFilled() {
    return Boolean(this._value);
  }
  _appendChar(ch) {
    let flags = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    const details = new ChangeDetails();
    if (this.isFilled)
      return details;
    const appendEager = this.eager === true || this.eager === "append";
    const appended = this.char === ch;
    const isResolved = appended && (this.isUnmasking || flags.input || flags.raw) && (!flags.raw || !appendEager) && !flags.tail;
    if (isResolved)
      details.rawInserted = this.char;
    this._value = details.inserted = this.char;
    this._isRawInput = isResolved && (flags.raw || flags.input);
    return details;
  }
  _appendEager() {
    return this._appendChar(this.char, {
      tail: true
    });
  }
  _appendPlaceholder() {
    const details = new ChangeDetails();
    if (this.isFilled)
      return details;
    this._value = details.inserted = this.char;
    return details;
  }
  extractTail() {
    arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : this.value.length;
    return new ContinuousTailDetails("");
  }
  // $FlowFixMe no ideas
  appendTail(tail) {
    if (isString(tail))
      tail = new ContinuousTailDetails(String(tail));
    return tail.appendTo(this);
  }
  append(str, flags, tail) {
    const details = this._appendChar(str[0], flags);
    if (tail != null) {
      details.tailShift += this.appendTail(tail).tailShift;
    }
    return details;
  }
  doCommit() {
  }
  get state() {
    return {
      _value: this._value,
      _isRawInput: this._isRawInput
    };
  }
  set state(state) {
    Object.assign(this, state);
  }
};

// ../../node_modules/imask/esm/masked/pattern/chunk-tail-details.js
var _excluded2 = ["chunks"];
var ChunksTailDetails = class {
  /** */
  constructor() {
    let chunks = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [];
    let from = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
    this.chunks = chunks;
    this.from = from;
  }
  toString() {
    return this.chunks.map(String).join("");
  }
  // $FlowFixMe no ideas
  extend(tailChunk) {
    if (!String(tailChunk))
      return;
    if (isString(tailChunk))
      tailChunk = new ContinuousTailDetails(String(tailChunk));
    const lastChunk = this.chunks[this.chunks.length - 1];
    const extendLast = lastChunk && // if stops are same or tail has no stop
    (lastChunk.stop === tailChunk.stop || tailChunk.stop == null) && // if tail chunk goes just after last chunk
    tailChunk.from === lastChunk.from + lastChunk.toString().length;
    if (tailChunk instanceof ContinuousTailDetails) {
      if (extendLast) {
        lastChunk.extend(tailChunk.toString());
      } else {
        this.chunks.push(tailChunk);
      }
    } else if (tailChunk instanceof ChunksTailDetails) {
      if (tailChunk.stop == null) {
        let firstTailChunk;
        while (tailChunk.chunks.length && tailChunk.chunks[0].stop == null) {
          firstTailChunk = tailChunk.chunks.shift();
          firstTailChunk.from += tailChunk.from;
          this.extend(firstTailChunk);
        }
      }
      if (tailChunk.toString()) {
        tailChunk.stop = tailChunk.blockIndex;
        this.chunks.push(tailChunk);
      }
    }
  }
  appendTo(masked) {
    if (!(masked instanceof IMask.MaskedPattern)) {
      const tail = new ContinuousTailDetails(this.toString());
      return tail.appendTo(masked);
    }
    const details = new ChangeDetails();
    for (let ci = 0; ci < this.chunks.length && !details.skip; ++ci) {
      const chunk = this.chunks[ci];
      const lastBlockIter = masked._mapPosToBlock(masked.value.length);
      const stop = chunk.stop;
      let chunkBlock;
      if (stop != null && // if block not found or stop is behind lastBlock
      (!lastBlockIter || lastBlockIter.index <= stop)) {
        if (chunk instanceof ChunksTailDetails || // for continuous block also check if stop is exist
        masked._stops.indexOf(stop) >= 0) {
          const phDetails = masked._appendPlaceholder(stop);
          details.aggregate(phDetails);
        }
        chunkBlock = chunk instanceof ChunksTailDetails && masked._blocks[stop];
      }
      if (chunkBlock) {
        const tailDetails = chunkBlock.appendTail(chunk);
        tailDetails.skip = false;
        details.aggregate(tailDetails);
        masked._value += tailDetails.inserted;
        const remainChars = chunk.toString().slice(tailDetails.rawInserted.length);
        if (remainChars)
          details.aggregate(masked.append(remainChars, {
            tail: true
          }));
      } else {
        details.aggregate(masked.append(chunk.toString(), {
          tail: true
        }));
      }
    }
    return details;
  }
  get state() {
    return {
      chunks: this.chunks.map((c6) => c6.state),
      from: this.from,
      stop: this.stop,
      blockIndex: this.blockIndex
    };
  }
  set state(state) {
    const {
      chunks
    } = state, props = _objectWithoutPropertiesLoose(state, _excluded2);
    Object.assign(this, props);
    this.chunks = chunks.map((cstate) => {
      const chunk = "chunks" in cstate ? new ChunksTailDetails() : new ContinuousTailDetails();
      chunk.state = cstate;
      return chunk;
    });
  }
  unshift(beforePos) {
    if (!this.chunks.length || beforePos != null && this.from >= beforePos)
      return "";
    const chunkShiftPos = beforePos != null ? beforePos - this.from : beforePos;
    let ci = 0;
    while (ci < this.chunks.length) {
      const chunk = this.chunks[ci];
      const shiftChar = chunk.unshift(chunkShiftPos);
      if (chunk.toString()) {
        if (!shiftChar)
          break;
        ++ci;
      } else {
        this.chunks.splice(ci, 1);
      }
      if (shiftChar)
        return shiftChar;
    }
    return "";
  }
  shift() {
    if (!this.chunks.length)
      return "";
    let ci = this.chunks.length - 1;
    while (0 <= ci) {
      const chunk = this.chunks[ci];
      const shiftChar = chunk.shift();
      if (chunk.toString()) {
        if (!shiftChar)
          break;
        --ci;
      } else {
        this.chunks.splice(ci, 1);
      }
      if (shiftChar)
        return shiftChar;
    }
    return "";
  }
};

// ../../node_modules/imask/esm/masked/pattern/cursor.js
var PatternCursor = class {
  constructor(masked, pos) {
    this.masked = masked;
    this._log = [];
    const {
      offset,
      index
    } = masked._mapPosToBlock(pos) || (pos < 0 ? (
      // first
      {
        index: 0,
        offset: 0
      }
    ) : (
      // last
      {
        index: this.masked._blocks.length,
        offset: 0
      }
    ));
    this.offset = offset;
    this.index = index;
    this.ok = false;
  }
  get block() {
    return this.masked._blocks[this.index];
  }
  get pos() {
    return this.masked._blockStartPos(this.index) + this.offset;
  }
  get state() {
    return {
      index: this.index,
      offset: this.offset,
      ok: this.ok
    };
  }
  set state(s8) {
    Object.assign(this, s8);
  }
  pushState() {
    this._log.push(this.state);
  }
  popState() {
    const s8 = this._log.pop();
    this.state = s8;
    return s8;
  }
  bindBlock() {
    if (this.block)
      return;
    if (this.index < 0) {
      this.index = 0;
      this.offset = 0;
    }
    if (this.index >= this.masked._blocks.length) {
      this.index = this.masked._blocks.length - 1;
      this.offset = this.block.value.length;
    }
  }
  _pushLeft(fn) {
    this.pushState();
    for (this.bindBlock(); 0 <= this.index; --this.index, this.offset = ((_this$block = this.block) === null || _this$block === void 0 ? void 0 : _this$block.value.length) || 0) {
      var _this$block;
      if (fn())
        return this.ok = true;
    }
    return this.ok = false;
  }
  _pushRight(fn) {
    this.pushState();
    for (this.bindBlock(); this.index < this.masked._blocks.length; ++this.index, this.offset = 0) {
      if (fn())
        return this.ok = true;
    }
    return this.ok = false;
  }
  pushLeftBeforeFilled() {
    return this._pushLeft(() => {
      if (this.block.isFixed || !this.block.value)
        return;
      this.offset = this.block.nearestInputPos(this.offset, DIRECTION.FORCE_LEFT);
      if (this.offset !== 0)
        return true;
    });
  }
  pushLeftBeforeInput() {
    return this._pushLeft(() => {
      if (this.block.isFixed)
        return;
      this.offset = this.block.nearestInputPos(this.offset, DIRECTION.LEFT);
      return true;
    });
  }
  pushLeftBeforeRequired() {
    return this._pushLeft(() => {
      if (this.block.isFixed || this.block.isOptional && !this.block.value)
        return;
      this.offset = this.block.nearestInputPos(this.offset, DIRECTION.LEFT);
      return true;
    });
  }
  pushRightBeforeFilled() {
    return this._pushRight(() => {
      if (this.block.isFixed || !this.block.value)
        return;
      this.offset = this.block.nearestInputPos(this.offset, DIRECTION.FORCE_RIGHT);
      if (this.offset !== this.block.value.length)
        return true;
    });
  }
  pushRightBeforeInput() {
    return this._pushRight(() => {
      if (this.block.isFixed)
        return;
      this.offset = this.block.nearestInputPos(this.offset, DIRECTION.NONE);
      return true;
    });
  }
  pushRightBeforeRequired() {
    return this._pushRight(() => {
      if (this.block.isFixed || this.block.isOptional && !this.block.value)
        return;
      this.offset = this.block.nearestInputPos(this.offset, DIRECTION.NONE);
      return true;
    });
  }
};

// ../../node_modules/imask/esm/masked/regexp.js
var MaskedRegExp = class extends Masked {
  /**
    @override
    @param {Object} opts
  */
  _update(opts) {
    if (opts.mask)
      opts.validate = (value) => value.search(opts.mask) >= 0;
    super._update(opts);
  }
};
IMask.MaskedRegExp = MaskedRegExp;

// ../../node_modules/imask/esm/masked/pattern.js
var _excluded3 = ["_blocks"];
var MaskedPattern = class extends Masked {
  /** */
  /** */
  /** Single char for empty input */
  /** Single char for filled input */
  /** Show placeholder only when needed */
  constructor() {
    let opts = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    opts.definitions = Object.assign({}, DEFAULT_INPUT_DEFINITIONS, opts.definitions);
    super(Object.assign({}, MaskedPattern.DEFAULTS, opts));
  }
  /**
    @override
    @param {Object} opts
  */
  _update() {
    let opts = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    opts.definitions = Object.assign({}, this.definitions, opts.definitions);
    super._update(opts);
    this._rebuildMask();
  }
  /** */
  _rebuildMask() {
    const defs = this.definitions;
    this._blocks = [];
    this._stops = [];
    this._maskedBlocks = {};
    let pattern = this.mask;
    if (!pattern || !defs)
      return;
    let unmaskingBlock = false;
    let optionalBlock = false;
    for (let i7 = 0; i7 < pattern.length; ++i7) {
      var _defs$char, _defs$char2;
      if (this.blocks) {
        const p2 = pattern.slice(i7);
        const bNames = Object.keys(this.blocks).filter((bName2) => p2.indexOf(bName2) === 0);
        bNames.sort((a4, b2) => b2.length - a4.length);
        const bName = bNames[0];
        if (bName) {
          const maskedBlock = createMask(Object.assign({
            parent: this,
            lazy: this.lazy,
            eager: this.eager,
            placeholderChar: this.placeholderChar,
            displayChar: this.displayChar,
            overwrite: this.overwrite
          }, this.blocks[bName]));
          if (maskedBlock) {
            this._blocks.push(maskedBlock);
            if (!this._maskedBlocks[bName])
              this._maskedBlocks[bName] = [];
            this._maskedBlocks[bName].push(this._blocks.length - 1);
          }
          i7 += bName.length - 1;
          continue;
        }
      }
      let char = pattern[i7];
      let isInput = char in defs;
      if (char === MaskedPattern.STOP_CHAR) {
        this._stops.push(this._blocks.length);
        continue;
      }
      if (char === "{" || char === "}") {
        unmaskingBlock = !unmaskingBlock;
        continue;
      }
      if (char === "[" || char === "]") {
        optionalBlock = !optionalBlock;
        continue;
      }
      if (char === MaskedPattern.ESCAPE_CHAR) {
        ++i7;
        char = pattern[i7];
        if (!char)
          break;
        isInput = false;
      }
      const maskOpts = (_defs$char = defs[char]) !== null && _defs$char !== void 0 && _defs$char.mask && !(((_defs$char2 = defs[char]) === null || _defs$char2 === void 0 ? void 0 : _defs$char2.mask.prototype) instanceof IMask.Masked) ? defs[char] : {
        mask: defs[char]
      };
      const def = isInput ? new PatternInputDefinition(Object.assign({
        parent: this,
        isOptional: optionalBlock,
        lazy: this.lazy,
        eager: this.eager,
        placeholderChar: this.placeholderChar,
        displayChar: this.displayChar
      }, maskOpts)) : new PatternFixedDefinition({
        char,
        eager: this.eager,
        isUnmasking: unmaskingBlock
      });
      this._blocks.push(def);
    }
  }
  /**
    @override
  */
  get state() {
    return Object.assign({}, super.state, {
      _blocks: this._blocks.map((b2) => b2.state)
    });
  }
  set state(state) {
    const {
      _blocks
    } = state, maskedState = _objectWithoutPropertiesLoose(state, _excluded3);
    this._blocks.forEach((b2, bi) => b2.state = _blocks[bi]);
    super.state = maskedState;
  }
  /**
    @override
  */
  reset() {
    super.reset();
    this._blocks.forEach((b2) => b2.reset());
  }
  /**
    @override
  */
  get isComplete() {
    return this._blocks.every((b2) => b2.isComplete);
  }
  /**
    @override
  */
  get isFilled() {
    return this._blocks.every((b2) => b2.isFilled);
  }
  get isFixed() {
    return this._blocks.every((b2) => b2.isFixed);
  }
  get isOptional() {
    return this._blocks.every((b2) => b2.isOptional);
  }
  /**
    @override
  */
  doCommit() {
    this._blocks.forEach((b2) => b2.doCommit());
    super.doCommit();
  }
  /**
    @override
  */
  get unmaskedValue() {
    return this._blocks.reduce((str, b2) => str += b2.unmaskedValue, "");
  }
  set unmaskedValue(unmaskedValue) {
    super.unmaskedValue = unmaskedValue;
  }
  /**
    @override
  */
  get value() {
    return this._blocks.reduce((str, b2) => str += b2.value, "");
  }
  set value(value) {
    super.value = value;
  }
  get displayValue() {
    return this._blocks.reduce((str, b2) => str += b2.displayValue, "");
  }
  /**
    @override
  */
  appendTail(tail) {
    return super.appendTail(tail).aggregate(this._appendPlaceholder());
  }
  /**
    @override
  */
  _appendEager() {
    var _this$_mapPosToBlock;
    const details = new ChangeDetails();
    let startBlockIndex = (_this$_mapPosToBlock = this._mapPosToBlock(this.value.length)) === null || _this$_mapPosToBlock === void 0 ? void 0 : _this$_mapPosToBlock.index;
    if (startBlockIndex == null)
      return details;
    if (this._blocks[startBlockIndex].isFilled)
      ++startBlockIndex;
    for (let bi = startBlockIndex; bi < this._blocks.length; ++bi) {
      const d4 = this._blocks[bi]._appendEager();
      if (!d4.inserted)
        break;
      details.aggregate(d4);
    }
    return details;
  }
  /**
    @override
  */
  _appendCharRaw(ch) {
    let flags = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    const blockIter = this._mapPosToBlock(this.value.length);
    const details = new ChangeDetails();
    if (!blockIter)
      return details;
    for (let bi = blockIter.index; ; ++bi) {
      var _flags$_beforeTailSta, _flags$_beforeTailSta2;
      const block2 = this._blocks[bi];
      if (!block2)
        break;
      const blockDetails = block2._appendChar(ch, Object.assign({}, flags, {
        _beforeTailState: (_flags$_beforeTailSta = flags._beforeTailState) === null || _flags$_beforeTailSta === void 0 ? void 0 : (_flags$_beforeTailSta2 = _flags$_beforeTailSta._blocks) === null || _flags$_beforeTailSta2 === void 0 ? void 0 : _flags$_beforeTailSta2[bi]
      }));
      const skip = blockDetails.skip;
      details.aggregate(blockDetails);
      if (skip || blockDetails.rawInserted)
        break;
    }
    return details;
  }
  /**
    @override
  */
  extractTail() {
    let fromPos = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0;
    let toPos = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : this.value.length;
    const chunkTail = new ChunksTailDetails();
    if (fromPos === toPos)
      return chunkTail;
    this._forEachBlocksInRange(fromPos, toPos, (b2, bi, bFromPos, bToPos) => {
      const blockChunk = b2.extractTail(bFromPos, bToPos);
      blockChunk.stop = this._findStopBefore(bi);
      blockChunk.from = this._blockStartPos(bi);
      if (blockChunk instanceof ChunksTailDetails)
        blockChunk.blockIndex = bi;
      chunkTail.extend(blockChunk);
    });
    return chunkTail;
  }
  /**
    @override
  */
  extractInput() {
    let fromPos = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0;
    let toPos = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : this.value.length;
    let flags = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    if (fromPos === toPos)
      return "";
    let input = "";
    this._forEachBlocksInRange(fromPos, toPos, (b2, _2, fromPos2, toPos2) => {
      input += b2.extractInput(fromPos2, toPos2, flags);
    });
    return input;
  }
  _findStopBefore(blockIndex) {
    let stopBefore;
    for (let si = 0; si < this._stops.length; ++si) {
      const stop = this._stops[si];
      if (stop <= blockIndex)
        stopBefore = stop;
      else
        break;
    }
    return stopBefore;
  }
  /** Appends placeholder depending on laziness */
  _appendPlaceholder(toBlockIndex) {
    const details = new ChangeDetails();
    if (this.lazy && toBlockIndex == null)
      return details;
    const startBlockIter = this._mapPosToBlock(this.value.length);
    if (!startBlockIter)
      return details;
    const startBlockIndex = startBlockIter.index;
    const endBlockIndex = toBlockIndex != null ? toBlockIndex : this._blocks.length;
    this._blocks.slice(startBlockIndex, endBlockIndex).forEach((b2) => {
      if (!b2.lazy || toBlockIndex != null) {
        const args = b2._blocks != null ? [b2._blocks.length] : [];
        const bDetails = b2._appendPlaceholder(...args);
        this._value += bDetails.inserted;
        details.aggregate(bDetails);
      }
    });
    return details;
  }
  /** Finds block in pos */
  _mapPosToBlock(pos) {
    let accVal = "";
    for (let bi = 0; bi < this._blocks.length; ++bi) {
      const block2 = this._blocks[bi];
      const blockStartPos = accVal.length;
      accVal += block2.value;
      if (pos <= accVal.length) {
        return {
          index: bi,
          offset: pos - blockStartPos
        };
      }
    }
  }
  /** */
  _blockStartPos(blockIndex) {
    return this._blocks.slice(0, blockIndex).reduce((pos, b2) => pos += b2.value.length, 0);
  }
  /** */
  _forEachBlocksInRange(fromPos) {
    let toPos = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : this.value.length;
    let fn = arguments.length > 2 ? arguments[2] : void 0;
    const fromBlockIter = this._mapPosToBlock(fromPos);
    if (fromBlockIter) {
      const toBlockIter = this._mapPosToBlock(toPos);
      const isSameBlock = toBlockIter && fromBlockIter.index === toBlockIter.index;
      const fromBlockStartPos = fromBlockIter.offset;
      const fromBlockEndPos = toBlockIter && isSameBlock ? toBlockIter.offset : this._blocks[fromBlockIter.index].value.length;
      fn(this._blocks[fromBlockIter.index], fromBlockIter.index, fromBlockStartPos, fromBlockEndPos);
      if (toBlockIter && !isSameBlock) {
        for (let bi = fromBlockIter.index + 1; bi < toBlockIter.index; ++bi) {
          fn(this._blocks[bi], bi, 0, this._blocks[bi].value.length);
        }
        fn(this._blocks[toBlockIter.index], toBlockIter.index, 0, toBlockIter.offset);
      }
    }
  }
  /**
    @override
  */
  remove() {
    let fromPos = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0;
    let toPos = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : this.value.length;
    const removeDetails = super.remove(fromPos, toPos);
    this._forEachBlocksInRange(fromPos, toPos, (b2, _2, bFromPos, bToPos) => {
      removeDetails.aggregate(b2.remove(bFromPos, bToPos));
    });
    return removeDetails;
  }
  /**
    @override
  */
  nearestInputPos(cursorPos) {
    let direction = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : DIRECTION.NONE;
    if (!this._blocks.length)
      return 0;
    const cursor = new PatternCursor(this, cursorPos);
    if (direction === DIRECTION.NONE) {
      if (cursor.pushRightBeforeInput())
        return cursor.pos;
      cursor.popState();
      if (cursor.pushLeftBeforeInput())
        return cursor.pos;
      return this.value.length;
    }
    if (direction === DIRECTION.LEFT || direction === DIRECTION.FORCE_LEFT) {
      if (direction === DIRECTION.LEFT) {
        cursor.pushRightBeforeFilled();
        if (cursor.ok && cursor.pos === cursorPos)
          return cursorPos;
        cursor.popState();
      }
      cursor.pushLeftBeforeInput();
      cursor.pushLeftBeforeRequired();
      cursor.pushLeftBeforeFilled();
      if (direction === DIRECTION.LEFT) {
        cursor.pushRightBeforeInput();
        cursor.pushRightBeforeRequired();
        if (cursor.ok && cursor.pos <= cursorPos)
          return cursor.pos;
        cursor.popState();
        if (cursor.ok && cursor.pos <= cursorPos)
          return cursor.pos;
        cursor.popState();
      }
      if (cursor.ok)
        return cursor.pos;
      if (direction === DIRECTION.FORCE_LEFT)
        return 0;
      cursor.popState();
      if (cursor.ok)
        return cursor.pos;
      cursor.popState();
      if (cursor.ok)
        return cursor.pos;
      return 0;
    }
    if (direction === DIRECTION.RIGHT || direction === DIRECTION.FORCE_RIGHT) {
      cursor.pushRightBeforeInput();
      cursor.pushRightBeforeRequired();
      if (cursor.pushRightBeforeFilled())
        return cursor.pos;
      if (direction === DIRECTION.FORCE_RIGHT)
        return this.value.length;
      cursor.popState();
      if (cursor.ok)
        return cursor.pos;
      cursor.popState();
      if (cursor.ok)
        return cursor.pos;
      return this.nearestInputPos(cursorPos, DIRECTION.LEFT);
    }
    return cursorPos;
  }
  /**
    @override
  */
  totalInputPositions() {
    let fromPos = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0;
    let toPos = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : this.value.length;
    let total = 0;
    this._forEachBlocksInRange(fromPos, toPos, (b2, _2, bFromPos, bToPos) => {
      total += b2.totalInputPositions(bFromPos, bToPos);
    });
    return total;
  }
  /** Get block by name */
  maskedBlock(name) {
    return this.maskedBlocks(name)[0];
  }
  /** Get all blocks by name */
  maskedBlocks(name) {
    const indices = this._maskedBlocks[name];
    if (!indices)
      return [];
    return indices.map((gi) => this._blocks[gi]);
  }
};
MaskedPattern.DEFAULTS = {
  lazy: true,
  placeholderChar: "_"
};
MaskedPattern.STOP_CHAR = "`";
MaskedPattern.ESCAPE_CHAR = "\\";
MaskedPattern.InputDefinition = PatternInputDefinition;
MaskedPattern.FixedDefinition = PatternFixedDefinition;
IMask.MaskedPattern = MaskedPattern;

// ../../node_modules/imask/esm/masked/range.js
var MaskedRange = class extends MaskedPattern {
  /**
    Optionally sets max length of pattern.
    Used when pattern length is longer then `to` param length. Pads zeros at start in this case.
  */
  /** Min bound */
  /** Max bound */
  /** */
  get _matchFrom() {
    return this.maxLength - String(this.from).length;
  }
  /**
    @override
  */
  _update(opts) {
    opts = Object.assign({
      to: this.to || 0,
      from: this.from || 0,
      maxLength: this.maxLength || 0
    }, opts);
    let maxLength = String(opts.to).length;
    if (opts.maxLength != null)
      maxLength = Math.max(maxLength, opts.maxLength);
    opts.maxLength = maxLength;
    const fromStr = String(opts.from).padStart(maxLength, "0");
    const toStr = String(opts.to).padStart(maxLength, "0");
    let sameCharsCount = 0;
    while (sameCharsCount < toStr.length && toStr[sameCharsCount] === fromStr[sameCharsCount])
      ++sameCharsCount;
    opts.mask = toStr.slice(0, sameCharsCount).replace(/0/g, "\\0") + "0".repeat(maxLength - sameCharsCount);
    super._update(opts);
  }
  /**
    @override
  */
  get isComplete() {
    return super.isComplete && Boolean(this.value);
  }
  boundaries(str) {
    let minstr = "";
    let maxstr = "";
    const [, placeholder, num] = str.match(/^(\D*)(\d*)(\D*)/) || [];
    if (num) {
      minstr = "0".repeat(placeholder.length) + num;
      maxstr = "9".repeat(placeholder.length) + num;
    }
    minstr = minstr.padEnd(this.maxLength, "0");
    maxstr = maxstr.padEnd(this.maxLength, "9");
    return [minstr, maxstr];
  }
  // TODO str is a single char everytime
  /**
    @override
  */
  doPrepare(ch) {
    let flags = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    let details;
    [ch, details] = normalizePrepare(super.doPrepare(ch.replace(/\D/g, ""), flags));
    if (!this.autofix || !ch)
      return ch;
    const fromStr = String(this.from).padStart(this.maxLength, "0");
    const toStr = String(this.to).padStart(this.maxLength, "0");
    let nextVal = this.value + ch;
    if (nextVal.length > this.maxLength)
      return "";
    const [minstr, maxstr] = this.boundaries(nextVal);
    if (Number(maxstr) < this.from)
      return fromStr[nextVal.length - 1];
    if (Number(minstr) > this.to) {
      if (this.autofix === "pad" && nextVal.length < this.maxLength) {
        return ["", details.aggregate(this.append(fromStr[nextVal.length - 1] + ch, flags))];
      }
      return toStr[nextVal.length - 1];
    }
    return ch;
  }
  /**
    @override
  */
  doValidate() {
    const str = this.value;
    const firstNonZero = str.search(/[^0]/);
    if (firstNonZero === -1 && str.length <= this._matchFrom)
      return true;
    const [minstr, maxstr] = this.boundaries(str);
    return this.from <= Number(maxstr) && Number(minstr) <= this.to && super.doValidate(...arguments);
  }
};
IMask.MaskedRange = MaskedRange;

// ../../node_modules/imask/esm/masked/date.js
var MaskedDate = class extends MaskedPattern {
  /** Pattern mask for date according to {@link MaskedDate#format} */
  /** Start date */
  /** End date */
  /** */
  /**
    @param {Object} opts
  */
  constructor(opts) {
    super(Object.assign({}, MaskedDate.DEFAULTS, opts));
  }
  /**
    @override
  */
  _update(opts) {
    if (opts.mask === Date)
      delete opts.mask;
    if (opts.pattern)
      opts.mask = opts.pattern;
    const blocks = opts.blocks;
    opts.blocks = Object.assign({}, MaskedDate.GET_DEFAULT_BLOCKS());
    if (opts.min)
      opts.blocks.Y.from = opts.min.getFullYear();
    if (opts.max)
      opts.blocks.Y.to = opts.max.getFullYear();
    if (opts.min && opts.max && opts.blocks.Y.from === opts.blocks.Y.to) {
      opts.blocks.m.from = opts.min.getMonth() + 1;
      opts.blocks.m.to = opts.max.getMonth() + 1;
      if (opts.blocks.m.from === opts.blocks.m.to) {
        opts.blocks.d.from = opts.min.getDate();
        opts.blocks.d.to = opts.max.getDate();
      }
    }
    Object.assign(opts.blocks, this.blocks, blocks);
    Object.keys(opts.blocks).forEach((bk) => {
      const b2 = opts.blocks[bk];
      if (!("autofix" in b2) && "autofix" in opts)
        b2.autofix = opts.autofix;
    });
    super._update(opts);
  }
  /**
    @override
  */
  doValidate() {
    const date = this.date;
    return super.doValidate(...arguments) && (!this.isComplete || this.isDateExist(this.value) && date != null && (this.min == null || this.min <= date) && (this.max == null || date <= this.max));
  }
  /** Checks if date is exists */
  isDateExist(str) {
    return this.format(this.parse(str, this), this).indexOf(str) >= 0;
  }
  /** Parsed Date */
  get date() {
    return this.typedValue;
  }
  set date(date) {
    this.typedValue = date;
  }
  /**
    @override
  */
  get typedValue() {
    return this.isComplete ? super.typedValue : null;
  }
  set typedValue(value) {
    super.typedValue = value;
  }
  /**
    @override
  */
  maskEquals(mask) {
    return mask === Date || super.maskEquals(mask);
  }
};
MaskedDate.DEFAULTS = {
  pattern: "d{.}`m{.}`Y",
  format: (date) => {
    if (!date)
      return "";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return [day, month, year].join(".");
  },
  parse: (str) => {
    const [day, month, year] = str.split(".");
    return new Date(year, month - 1, day);
  }
};
MaskedDate.GET_DEFAULT_BLOCKS = () => ({
  d: {
    mask: MaskedRange,
    from: 1,
    to: 31,
    maxLength: 2
  },
  m: {
    mask: MaskedRange,
    from: 1,
    to: 12,
    maxLength: 2
  },
  Y: {
    mask: MaskedRange,
    from: 1900,
    to: 9999
  }
});
IMask.MaskedDate = MaskedDate;

// ../../node_modules/imask/esm/controls/mask-element.js
var MaskElement = class {
  /** */
  /** */
  /** */
  /** Safely returns selection start */
  get selectionStart() {
    let start;
    try {
      start = this._unsafeSelectionStart;
    } catch (e10) {
    }
    return start != null ? start : this.value.length;
  }
  /** Safely returns selection end */
  get selectionEnd() {
    let end;
    try {
      end = this._unsafeSelectionEnd;
    } catch (e10) {
    }
    return end != null ? end : this.value.length;
  }
  /** Safely sets element selection */
  select(start, end) {
    if (start == null || end == null || start === this.selectionStart && end === this.selectionEnd)
      return;
    try {
      this._unsafeSelect(start, end);
    } catch (e10) {
    }
  }
  /** Should be overriden in subclasses */
  _unsafeSelect(start, end) {
  }
  /** Should be overriden in subclasses */
  get isActive() {
    return false;
  }
  /** Should be overriden in subclasses */
  bindEvents(handlers) {
  }
  /** Should be overriden in subclasses */
  unbindEvents() {
  }
};
IMask.MaskElement = MaskElement;

// ../../node_modules/imask/esm/controls/html-mask-element.js
var HTMLMaskElement = class extends MaskElement {
  /** Mapping between HTMLElement events and mask internal events */
  /** HTMLElement to use mask on */
  /**
    @param {HTMLInputElement|HTMLTextAreaElement} input
  */
  constructor(input) {
    super();
    this.input = input;
    this._handlers = {};
  }
  /** */
  // $FlowFixMe https://github.com/facebook/flow/issues/2839
  get rootElement() {
    var _this$input$getRootNo, _this$input$getRootNo2, _this$input;
    return (_this$input$getRootNo = (_this$input$getRootNo2 = (_this$input = this.input).getRootNode) === null || _this$input$getRootNo2 === void 0 ? void 0 : _this$input$getRootNo2.call(_this$input)) !== null && _this$input$getRootNo !== void 0 ? _this$input$getRootNo : document;
  }
  /**
    Is element in focus
    @readonly
  */
  get isActive() {
    return this.input === this.rootElement.activeElement;
  }
  /**
    Returns HTMLElement selection start
    @override
  */
  get _unsafeSelectionStart() {
    return this.input.selectionStart;
  }
  /**
    Returns HTMLElement selection end
    @override
  */
  get _unsafeSelectionEnd() {
    return this.input.selectionEnd;
  }
  /**
    Sets HTMLElement selection
    @override
  */
  _unsafeSelect(start, end) {
    this.input.setSelectionRange(start, end);
  }
  /**
    HTMLElement value
    @override
  */
  get value() {
    return this.input.value;
  }
  set value(value) {
    this.input.value = value;
  }
  /**
    Binds HTMLElement events to mask internal events
    @override
  */
  bindEvents(handlers) {
    Object.keys(handlers).forEach((event) => this._toggleEventHandler(HTMLMaskElement.EVENTS_MAP[event], handlers[event]));
  }
  /**
    Unbinds HTMLElement events to mask internal events
    @override
  */
  unbindEvents() {
    Object.keys(this._handlers).forEach((event) => this._toggleEventHandler(event));
  }
  /** */
  _toggleEventHandler(event, handler) {
    if (this._handlers[event]) {
      this.input.removeEventListener(event, this._handlers[event]);
      delete this._handlers[event];
    }
    if (handler) {
      this.input.addEventListener(event, handler);
      this._handlers[event] = handler;
    }
  }
};
HTMLMaskElement.EVENTS_MAP = {
  selectionChange: "keydown",
  input: "input",
  drop: "drop",
  click: "click",
  focus: "focus",
  commit: "blur"
};
IMask.HTMLMaskElement = HTMLMaskElement;

// ../../node_modules/imask/esm/controls/html-contenteditable-mask-element.js
var HTMLContenteditableMaskElement = class extends HTMLMaskElement {
  /**
    Returns HTMLElement selection start
    @override
  */
  get _unsafeSelectionStart() {
    const root = this.rootElement;
    const selection = root.getSelection && root.getSelection();
    const anchorOffset = selection && selection.anchorOffset;
    const focusOffset = selection && selection.focusOffset;
    if (focusOffset == null || anchorOffset == null || anchorOffset < focusOffset) {
      return anchorOffset;
    }
    return focusOffset;
  }
  /**
    Returns HTMLElement selection end
    @override
  */
  get _unsafeSelectionEnd() {
    const root = this.rootElement;
    const selection = root.getSelection && root.getSelection();
    const anchorOffset = selection && selection.anchorOffset;
    const focusOffset = selection && selection.focusOffset;
    if (focusOffset == null || anchorOffset == null || anchorOffset > focusOffset) {
      return anchorOffset;
    }
    return focusOffset;
  }
  /**
    Sets HTMLElement selection
    @override
  */
  _unsafeSelect(start, end) {
    if (!this.rootElement.createRange)
      return;
    const range = this.rootElement.createRange();
    range.setStart(this.input.firstChild || this.input, start);
    range.setEnd(this.input.lastChild || this.input, end);
    const root = this.rootElement;
    const selection = root.getSelection && root.getSelection();
    if (selection) {
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }
  /**
    HTMLElement value
    @override
  */
  get value() {
    return this.input.textContent;
  }
  set value(value) {
    this.input.textContent = value;
  }
};
IMask.HTMLContenteditableMaskElement = HTMLContenteditableMaskElement;

// ../../node_modules/imask/esm/controls/input.js
var _excluded4 = ["mask"];
var InputMask = class {
  /**
    View element
    @readonly
  */
  /**
    Internal {@link Masked} model
    @readonly
  */
  /**
    @param {MaskElement|HTMLInputElement|HTMLTextAreaElement} el
    @param {Object} opts
  */
  constructor(el, opts) {
    this.el = el instanceof MaskElement ? el : el.isContentEditable && el.tagName !== "INPUT" && el.tagName !== "TEXTAREA" ? new HTMLContenteditableMaskElement(el) : new HTMLMaskElement(el);
    this.masked = createMask(opts);
    this._listeners = {};
    this._value = "";
    this._unmaskedValue = "";
    this._saveSelection = this._saveSelection.bind(this);
    this._onInput = this._onInput.bind(this);
    this._onChange = this._onChange.bind(this);
    this._onDrop = this._onDrop.bind(this);
    this._onFocus = this._onFocus.bind(this);
    this._onClick = this._onClick.bind(this);
    this.alignCursor = this.alignCursor.bind(this);
    this.alignCursorFriendly = this.alignCursorFriendly.bind(this);
    this._bindEvents();
    this.updateValue();
    this._onChange();
  }
  /** Read or update mask */
  get mask() {
    return this.masked.mask;
  }
  maskEquals(mask) {
    var _this$masked;
    return mask == null || ((_this$masked = this.masked) === null || _this$masked === void 0 ? void 0 : _this$masked.maskEquals(mask));
  }
  set mask(mask) {
    if (this.maskEquals(mask))
      return;
    if (!(mask instanceof IMask.Masked) && this.masked.constructor === maskedClass(mask)) {
      this.masked.updateOptions({
        mask
      });
      return;
    }
    const masked = createMask({
      mask
    });
    masked.unmaskedValue = this.masked.unmaskedValue;
    this.masked = masked;
  }
  /** Raw value */
  get value() {
    return this._value;
  }
  set value(str) {
    if (this.value === str)
      return;
    this.masked.value = str;
    this.updateControl();
    this.alignCursor();
  }
  /** Unmasked value */
  get unmaskedValue() {
    return this._unmaskedValue;
  }
  set unmaskedValue(str) {
    if (this.unmaskedValue === str)
      return;
    this.masked.unmaskedValue = str;
    this.updateControl();
    this.alignCursor();
  }
  /** Typed unmasked value */
  get typedValue() {
    return this.masked.typedValue;
  }
  set typedValue(val) {
    if (this.masked.typedValueEquals(val))
      return;
    this.masked.typedValue = val;
    this.updateControl();
    this.alignCursor();
  }
  /** Display value */
  get displayValue() {
    return this.masked.displayValue;
  }
  /**
    Starts listening to element events
    @protected
  */
  _bindEvents() {
    this.el.bindEvents({
      selectionChange: this._saveSelection,
      input: this._onInput,
      drop: this._onDrop,
      click: this._onClick,
      focus: this._onFocus,
      commit: this._onChange
    });
  }
  /**
    Stops listening to element events
    @protected
   */
  _unbindEvents() {
    if (this.el)
      this.el.unbindEvents();
  }
  /**
    Fires custom event
    @protected
   */
  _fireEvent(ev) {
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }
    const listeners = this._listeners[ev];
    if (!listeners)
      return;
    listeners.forEach((l7) => l7(...args));
  }
  /**
    Current selection start
    @readonly
  */
  get selectionStart() {
    return this._cursorChanging ? this._changingCursorPos : this.el.selectionStart;
  }
  /** Current cursor position */
  get cursorPos() {
    return this._cursorChanging ? this._changingCursorPos : this.el.selectionEnd;
  }
  set cursorPos(pos) {
    if (!this.el || !this.el.isActive)
      return;
    this.el.select(pos, pos);
    this._saveSelection();
  }
  /**
    Stores current selection
    @protected
  */
  _saveSelection() {
    if (this.displayValue !== this.el.value) {
      console.warn("Element value was changed outside of mask. Syncronize mask using `mask.updateValue()` to work properly.");
    }
    this._selection = {
      start: this.selectionStart,
      end: this.cursorPos
    };
  }
  /** Syncronizes model value from view */
  updateValue() {
    this.masked.value = this.el.value;
    this._value = this.masked.value;
  }
  /** Syncronizes view from model value, fires change events */
  updateControl() {
    const newUnmaskedValue = this.masked.unmaskedValue;
    const newValue = this.masked.value;
    const newDisplayValue = this.displayValue;
    const isChanged = this.unmaskedValue !== newUnmaskedValue || this.value !== newValue;
    this._unmaskedValue = newUnmaskedValue;
    this._value = newValue;
    if (this.el.value !== newDisplayValue)
      this.el.value = newDisplayValue;
    if (isChanged)
      this._fireChangeEvents();
  }
  /** Updates options with deep equal check, recreates @{link Masked} model if mask type changes */
  updateOptions(opts) {
    const {
      mask
    } = opts, restOpts = _objectWithoutPropertiesLoose(opts, _excluded4);
    const updateMask = !this.maskEquals(mask);
    const updateOpts = !objectIncludes(this.masked, restOpts);
    if (updateMask)
      this.mask = mask;
    if (updateOpts)
      this.masked.updateOptions(restOpts);
    if (updateMask || updateOpts)
      this.updateControl();
  }
  /** Updates cursor */
  updateCursor(cursorPos) {
    if (cursorPos == null)
      return;
    this.cursorPos = cursorPos;
    this._delayUpdateCursor(cursorPos);
  }
  /**
    Delays cursor update to support mobile browsers
    @private
  */
  _delayUpdateCursor(cursorPos) {
    this._abortUpdateCursor();
    this._changingCursorPos = cursorPos;
    this._cursorChanging = setTimeout(() => {
      if (!this.el)
        return;
      this.cursorPos = this._changingCursorPos;
      this._abortUpdateCursor();
    }, 10);
  }
  /**
    Fires custom events
    @protected
  */
  _fireChangeEvents() {
    this._fireEvent("accept", this._inputEvent);
    if (this.masked.isComplete)
      this._fireEvent("complete", this._inputEvent);
  }
  /**
    Aborts delayed cursor update
    @private
  */
  _abortUpdateCursor() {
    if (this._cursorChanging) {
      clearTimeout(this._cursorChanging);
      delete this._cursorChanging;
    }
  }
  /** Aligns cursor to nearest available position */
  alignCursor() {
    this.cursorPos = this.masked.nearestInputPos(this.masked.nearestInputPos(this.cursorPos, DIRECTION.LEFT));
  }
  /** Aligns cursor only if selection is empty */
  alignCursorFriendly() {
    if (this.selectionStart !== this.cursorPos)
      return;
    this.alignCursor();
  }
  /** Adds listener on custom event */
  on(ev, handler) {
    if (!this._listeners[ev])
      this._listeners[ev] = [];
    this._listeners[ev].push(handler);
    return this;
  }
  /** Removes custom event listener */
  off(ev, handler) {
    if (!this._listeners[ev])
      return this;
    if (!handler) {
      delete this._listeners[ev];
      return this;
    }
    const hIndex = this._listeners[ev].indexOf(handler);
    if (hIndex >= 0)
      this._listeners[ev].splice(hIndex, 1);
    return this;
  }
  /** Handles view input event */
  _onInput(e10) {
    this._inputEvent = e10;
    this._abortUpdateCursor();
    if (!this._selection)
      return this.updateValue();
    const details = new ActionDetails(
      // new state
      this.el.value,
      this.cursorPos,
      // old state
      this.displayValue,
      this._selection
    );
    const oldRawValue = this.masked.rawInputValue;
    const offset = this.masked.splice(details.startChangePos, details.removed.length, details.inserted, details.removeDirection, {
      input: true,
      raw: true
    }).offset;
    const removeDirection = oldRawValue === this.masked.rawInputValue ? details.removeDirection : DIRECTION.NONE;
    let cursorPos = this.masked.nearestInputPos(details.startChangePos + offset, removeDirection);
    if (removeDirection !== DIRECTION.NONE)
      cursorPos = this.masked.nearestInputPos(cursorPos, DIRECTION.NONE);
    this.updateControl();
    this.updateCursor(cursorPos);
    delete this._inputEvent;
  }
  /** Handles view change event and commits model value */
  _onChange() {
    if (this.displayValue !== this.el.value) {
      this.updateValue();
    }
    this.masked.doCommit();
    this.updateControl();
    this._saveSelection();
  }
  /** Handles view drop event, prevents by default */
  _onDrop(ev) {
    ev.preventDefault();
    ev.stopPropagation();
  }
  /** Restore last selection on focus */
  _onFocus(ev) {
    this.alignCursorFriendly();
  }
  /** Restore last selection on focus */
  _onClick(ev) {
    this.alignCursorFriendly();
  }
  /** Unbind view events and removes element reference */
  destroy() {
    this._unbindEvents();
    this._listeners.length = 0;
    delete this.el;
  }
};
IMask.InputMask = InputMask;

// ../../node_modules/imask/esm/masked/enum.js
var MaskedEnum = class extends MaskedPattern {
  /**
    @override
    @param {Object} opts
  */
  _update(opts) {
    if (opts.enum)
      opts.mask = "*".repeat(opts.enum[0].length);
    super._update(opts);
  }
  /**
    @override
  */
  doValidate() {
    return this.enum.some((e10) => e10.indexOf(this.unmaskedValue) >= 0) && super.doValidate(...arguments);
  }
};
IMask.MaskedEnum = MaskedEnum;

// ../../node_modules/imask/esm/masked/number.js
var MaskedNumber = class extends Masked {
  /** Single char */
  /** Single char */
  /** Array of single chars */
  /** */
  /** */
  /** Digits after point */
  /** */
  /** Flag to remove leading and trailing zeros in the end of editing */
  /** Flag to pad trailing zeros after point in the end of editing */
  constructor(opts) {
    super(Object.assign({}, MaskedNumber.DEFAULTS, opts));
  }
  /**
    @override
  */
  _update(opts) {
    super._update(opts);
    this._updateRegExps();
  }
  /** */
  _updateRegExps() {
    let start = "^" + (this.allowNegative ? "[+|\\-]?" : "");
    let mid = "\\d*";
    let end = (this.scale ? "(".concat(escapeRegExp(this.radix), "\\d{0,").concat(this.scale, "})?") : "") + "$";
    this._numberRegExp = new RegExp(start + mid + end);
    this._mapToRadixRegExp = new RegExp("[".concat(this.mapToRadix.map(escapeRegExp).join(""), "]"), "g");
    this._thousandsSeparatorRegExp = new RegExp(escapeRegExp(this.thousandsSeparator), "g");
  }
  /** */
  _removeThousandsSeparators(value) {
    return value.replace(this._thousandsSeparatorRegExp, "");
  }
  /** */
  _insertThousandsSeparators(value) {
    const parts = value.split(this.radix);
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, this.thousandsSeparator);
    return parts.join(this.radix);
  }
  /**
    @override
  */
  doPrepare(ch) {
    let flags = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    ch = this._removeThousandsSeparators(this.scale && this.mapToRadix.length && /*
      radix should be mapped when
      1) input is done from keyboard = flags.input && flags.raw
      2) unmasked value is set = !flags.input && !flags.raw
      and should not be mapped when
      1) value is set = flags.input && !flags.raw
      2) raw value is set = !flags.input && flags.raw
    */
    (flags.input && flags.raw || !flags.input && !flags.raw) ? ch.replace(this._mapToRadixRegExp, this.radix) : ch);
    const [prepCh, details] = normalizePrepare(super.doPrepare(ch, flags));
    if (ch && !prepCh)
      details.skip = true;
    return [prepCh, details];
  }
  /** */
  _separatorsCount(to) {
    let extendOnSeparators = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
    let count = 0;
    for (let pos = 0; pos < to; ++pos) {
      if (this._value.indexOf(this.thousandsSeparator, pos) === pos) {
        ++count;
        if (extendOnSeparators)
          to += this.thousandsSeparator.length;
      }
    }
    return count;
  }
  /** */
  _separatorsCountFromSlice() {
    let slice = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : this._value;
    return this._separatorsCount(this._removeThousandsSeparators(slice).length, true);
  }
  /**
    @override
  */
  extractInput() {
    let fromPos = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0;
    let toPos = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : this.value.length;
    let flags = arguments.length > 2 ? arguments[2] : void 0;
    [fromPos, toPos] = this._adjustRangeWithSeparators(fromPos, toPos);
    return this._removeThousandsSeparators(super.extractInput(fromPos, toPos, flags));
  }
  /**
    @override
  */
  _appendCharRaw(ch) {
    let flags = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    if (!this.thousandsSeparator)
      return super._appendCharRaw(ch, flags);
    const prevBeforeTailValue = flags.tail && flags._beforeTailState ? flags._beforeTailState._value : this._value;
    const prevBeforeTailSeparatorsCount = this._separatorsCountFromSlice(prevBeforeTailValue);
    this._value = this._removeThousandsSeparators(this.value);
    const appendDetails = super._appendCharRaw(ch, flags);
    this._value = this._insertThousandsSeparators(this._value);
    const beforeTailValue = flags.tail && flags._beforeTailState ? flags._beforeTailState._value : this._value;
    const beforeTailSeparatorsCount = this._separatorsCountFromSlice(beforeTailValue);
    appendDetails.tailShift += (beforeTailSeparatorsCount - prevBeforeTailSeparatorsCount) * this.thousandsSeparator.length;
    appendDetails.skip = !appendDetails.rawInserted && ch === this.thousandsSeparator;
    return appendDetails;
  }
  /** */
  _findSeparatorAround(pos) {
    if (this.thousandsSeparator) {
      const searchFrom = pos - this.thousandsSeparator.length + 1;
      const separatorPos = this.value.indexOf(this.thousandsSeparator, searchFrom);
      if (separatorPos <= pos)
        return separatorPos;
    }
    return -1;
  }
  _adjustRangeWithSeparators(from, to) {
    const separatorAroundFromPos = this._findSeparatorAround(from);
    if (separatorAroundFromPos >= 0)
      from = separatorAroundFromPos;
    const separatorAroundToPos = this._findSeparatorAround(to);
    if (separatorAroundToPos >= 0)
      to = separatorAroundToPos + this.thousandsSeparator.length;
    return [from, to];
  }
  /**
    @override
  */
  remove() {
    let fromPos = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0;
    let toPos = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : this.value.length;
    [fromPos, toPos] = this._adjustRangeWithSeparators(fromPos, toPos);
    const valueBeforePos = this.value.slice(0, fromPos);
    const valueAfterPos = this.value.slice(toPos);
    const prevBeforeTailSeparatorsCount = this._separatorsCount(valueBeforePos.length);
    this._value = this._insertThousandsSeparators(this._removeThousandsSeparators(valueBeforePos + valueAfterPos));
    const beforeTailSeparatorsCount = this._separatorsCountFromSlice(valueBeforePos);
    return new ChangeDetails({
      tailShift: (beforeTailSeparatorsCount - prevBeforeTailSeparatorsCount) * this.thousandsSeparator.length
    });
  }
  /**
    @override
  */
  nearestInputPos(cursorPos, direction) {
    if (!this.thousandsSeparator)
      return cursorPos;
    switch (direction) {
      case DIRECTION.NONE:
      case DIRECTION.LEFT:
      case DIRECTION.FORCE_LEFT: {
        const separatorAtLeftPos = this._findSeparatorAround(cursorPos - 1);
        if (separatorAtLeftPos >= 0) {
          const separatorAtLeftEndPos = separatorAtLeftPos + this.thousandsSeparator.length;
          if (cursorPos < separatorAtLeftEndPos || this.value.length <= separatorAtLeftEndPos || direction === DIRECTION.FORCE_LEFT) {
            return separatorAtLeftPos;
          }
        }
        break;
      }
      case DIRECTION.RIGHT:
      case DIRECTION.FORCE_RIGHT: {
        const separatorAtRightPos = this._findSeparatorAround(cursorPos);
        if (separatorAtRightPos >= 0) {
          return separatorAtRightPos + this.thousandsSeparator.length;
        }
      }
    }
    return cursorPos;
  }
  /**
    @override
  */
  doValidate(flags) {
    let valid = Boolean(this._removeThousandsSeparators(this.value).match(this._numberRegExp));
    if (valid) {
      const number = this.number;
      valid = valid && !isNaN(number) && // check min bound for negative values
      (this.min == null || this.min >= 0 || this.min <= this.number) && // check max bound for positive values
      (this.max == null || this.max <= 0 || this.number <= this.max);
    }
    return valid && super.doValidate(flags);
  }
  /**
    @override
  */
  doCommit() {
    if (this.value) {
      const number = this.number;
      let validnum = number;
      if (this.min != null)
        validnum = Math.max(validnum, this.min);
      if (this.max != null)
        validnum = Math.min(validnum, this.max);
      if (validnum !== number)
        this.unmaskedValue = this.doFormat(validnum);
      let formatted = this.value;
      if (this.normalizeZeros)
        formatted = this._normalizeZeros(formatted);
      if (this.padFractionalZeros && this.scale > 0)
        formatted = this._padFractionalZeros(formatted);
      this._value = formatted;
    }
    super.doCommit();
  }
  /** */
  _normalizeZeros(value) {
    const parts = this._removeThousandsSeparators(value).split(this.radix);
    parts[0] = parts[0].replace(/^(\D*)(0*)(\d*)/, (match, sign, zeros, num) => sign + num);
    if (value.length && !/\d$/.test(parts[0]))
      parts[0] = parts[0] + "0";
    if (parts.length > 1) {
      parts[1] = parts[1].replace(/0*$/, "");
      if (!parts[1].length)
        parts.length = 1;
    }
    return this._insertThousandsSeparators(parts.join(this.radix));
  }
  /** */
  _padFractionalZeros(value) {
    if (!value)
      return value;
    const parts = value.split(this.radix);
    if (parts.length < 2)
      parts.push("");
    parts[1] = parts[1].padEnd(this.scale, "0");
    return parts.join(this.radix);
  }
  /** */
  doSkipInvalid(ch) {
    let flags = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    let checkTail = arguments.length > 2 ? arguments[2] : void 0;
    const dropFractional = this.scale === 0 && ch !== this.thousandsSeparator && (ch === this.radix || ch === MaskedNumber.UNMASKED_RADIX || this.mapToRadix.includes(ch));
    return super.doSkipInvalid(ch, flags, checkTail) && !dropFractional;
  }
  /**
    @override
  */
  get unmaskedValue() {
    return this._removeThousandsSeparators(this._normalizeZeros(this.value)).replace(this.radix, MaskedNumber.UNMASKED_RADIX);
  }
  set unmaskedValue(unmaskedValue) {
    super.unmaskedValue = unmaskedValue;
  }
  /**
    @override
  */
  get typedValue() {
    return this.doParse(this.unmaskedValue);
  }
  set typedValue(n10) {
    this.rawInputValue = this.doFormat(n10).replace(MaskedNumber.UNMASKED_RADIX, this.radix);
  }
  /** Parsed Number */
  get number() {
    return this.typedValue;
  }
  set number(number) {
    this.typedValue = number;
  }
  /**
    Is negative allowed
    @readonly
  */
  get allowNegative() {
    return this.signed || this.min != null && this.min < 0 || this.max != null && this.max < 0;
  }
  /**
    @override
  */
  typedValueEquals(value) {
    return (super.typedValueEquals(value) || MaskedNumber.EMPTY_VALUES.includes(value) && MaskedNumber.EMPTY_VALUES.includes(this.typedValue)) && !(value === 0 && this.value === "");
  }
};
MaskedNumber.UNMASKED_RADIX = ".";
MaskedNumber.DEFAULTS = {
  radix: ",",
  thousandsSeparator: "",
  mapToRadix: [MaskedNumber.UNMASKED_RADIX],
  scale: 2,
  signed: false,
  normalizeZeros: true,
  padFractionalZeros: false,
  parse: Number,
  format: (n10) => n10.toLocaleString("en-US", {
    useGrouping: false,
    maximumFractionDigits: 20
  })
};
MaskedNumber.EMPTY_VALUES = [...Masked.EMPTY_VALUES, 0];
IMask.MaskedNumber = MaskedNumber;

// ../../node_modules/imask/esm/masked/function.js
var MaskedFunction = class extends Masked {
  /**
    @override
    @param {Object} opts
  */
  _update(opts) {
    if (opts.mask)
      opts.validate = opts.mask;
    super._update(opts);
  }
};
IMask.MaskedFunction = MaskedFunction;

// ../../node_modules/imask/esm/masked/dynamic.js
var _excluded5 = ["compiledMasks", "currentMaskRef", "currentMask"];
var _excluded22 = ["mask"];
var MaskedDynamic = class extends Masked {
  /** Currently chosen mask */
  /** Compliled {@link Masked} options */
  /** Chooses {@link Masked} depending on input value */
  /**
    @param {Object} opts
  */
  constructor(opts) {
    super(Object.assign({}, MaskedDynamic.DEFAULTS, opts));
    this.currentMask = null;
  }
  /**
    @override
  */
  _update(opts) {
    super._update(opts);
    if ("mask" in opts) {
      this.compiledMasks = Array.isArray(opts.mask) ? opts.mask.map((m4) => createMask(m4)) : [];
    }
  }
  /**
    @override
  */
  _appendCharRaw(ch) {
    let flags = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    const details = this._applyDispatch(ch, flags);
    if (this.currentMask) {
      details.aggregate(this.currentMask._appendChar(ch, this.currentMaskFlags(flags)));
    }
    return details;
  }
  _applyDispatch() {
    let appended = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
    let flags = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    let tail = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : "";
    const prevValueBeforeTail = flags.tail && flags._beforeTailState != null ? flags._beforeTailState._value : this.value;
    const inputValue = this.rawInputValue;
    const insertValue = flags.tail && flags._beforeTailState != null ? (
      // $FlowFixMe - tired to fight with type system
      flags._beforeTailState._rawInputValue
    ) : inputValue;
    const tailValue = inputValue.slice(insertValue.length);
    const prevMask = this.currentMask;
    const details = new ChangeDetails();
    const prevMaskState = prevMask === null || prevMask === void 0 ? void 0 : prevMask.state;
    this.currentMask = this.doDispatch(appended, Object.assign({}, flags), tail);
    if (this.currentMask) {
      if (this.currentMask !== prevMask) {
        this.currentMask.reset();
        if (insertValue) {
          const d4 = this.currentMask.append(insertValue, {
            raw: true
          });
          details.tailShift = d4.inserted.length - prevValueBeforeTail.length;
        }
        if (tailValue) {
          details.tailShift += this.currentMask.append(tailValue, {
            raw: true,
            tail: true
          }).tailShift;
        }
      } else {
        this.currentMask.state = prevMaskState;
      }
    }
    return details;
  }
  _appendPlaceholder() {
    const details = this._applyDispatch(...arguments);
    if (this.currentMask) {
      details.aggregate(this.currentMask._appendPlaceholder());
    }
    return details;
  }
  /**
   @override
  */
  _appendEager() {
    const details = this._applyDispatch(...arguments);
    if (this.currentMask) {
      details.aggregate(this.currentMask._appendEager());
    }
    return details;
  }
  appendTail(tail) {
    const details = new ChangeDetails();
    if (tail)
      details.aggregate(this._applyDispatch("", {}, tail));
    return details.aggregate(this.currentMask ? this.currentMask.appendTail(tail) : super.appendTail(tail));
  }
  currentMaskFlags(flags) {
    var _flags$_beforeTailSta, _flags$_beforeTailSta2;
    return Object.assign({}, flags, {
      _beforeTailState: ((_flags$_beforeTailSta = flags._beforeTailState) === null || _flags$_beforeTailSta === void 0 ? void 0 : _flags$_beforeTailSta.currentMaskRef) === this.currentMask && ((_flags$_beforeTailSta2 = flags._beforeTailState) === null || _flags$_beforeTailSta2 === void 0 ? void 0 : _flags$_beforeTailSta2.currentMask) || flags._beforeTailState
    });
  }
  /**
    @override
  */
  doDispatch(appended) {
    let flags = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    let tail = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : "";
    return this.dispatch(appended, this, flags, tail);
  }
  /**
    @override
  */
  doValidate(flags) {
    return super.doValidate(flags) && (!this.currentMask || this.currentMask.doValidate(this.currentMaskFlags(flags)));
  }
  /**
    @override
  */
  doPrepare(str) {
    let flags = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    let [s8, details] = normalizePrepare(super.doPrepare(str, flags));
    if (this.currentMask) {
      let currentDetails;
      [s8, currentDetails] = normalizePrepare(super.doPrepare(s8, this.currentMaskFlags(flags)));
      details = details.aggregate(currentDetails);
    }
    return [s8, details];
  }
  /**
    @override
  */
  reset() {
    var _this$currentMask;
    (_this$currentMask = this.currentMask) === null || _this$currentMask === void 0 ? void 0 : _this$currentMask.reset();
    this.compiledMasks.forEach((m4) => m4.reset());
  }
  /**
    @override
  */
  get value() {
    return this.currentMask ? this.currentMask.value : "";
  }
  set value(value) {
    super.value = value;
  }
  /**
    @override
  */
  get unmaskedValue() {
    return this.currentMask ? this.currentMask.unmaskedValue : "";
  }
  set unmaskedValue(unmaskedValue) {
    super.unmaskedValue = unmaskedValue;
  }
  /**
    @override
  */
  get typedValue() {
    return this.currentMask ? this.currentMask.typedValue : "";
  }
  // probably typedValue should not be used with dynamic
  set typedValue(value) {
    let unmaskedValue = String(value);
    if (this.currentMask) {
      this.currentMask.typedValue = value;
      unmaskedValue = this.currentMask.unmaskedValue;
    }
    this.unmaskedValue = unmaskedValue;
  }
  get displayValue() {
    return this.currentMask ? this.currentMask.displayValue : "";
  }
  /**
    @override
  */
  get isComplete() {
    var _this$currentMask2;
    return Boolean((_this$currentMask2 = this.currentMask) === null || _this$currentMask2 === void 0 ? void 0 : _this$currentMask2.isComplete);
  }
  /**
    @override
  */
  get isFilled() {
    var _this$currentMask3;
    return Boolean((_this$currentMask3 = this.currentMask) === null || _this$currentMask3 === void 0 ? void 0 : _this$currentMask3.isFilled);
  }
  /**
    @override
  */
  remove() {
    const details = new ChangeDetails();
    if (this.currentMask) {
      details.aggregate(this.currentMask.remove(...arguments)).aggregate(this._applyDispatch());
    }
    return details;
  }
  /**
    @override
  */
  get state() {
    var _this$currentMask4;
    return Object.assign({}, super.state, {
      _rawInputValue: this.rawInputValue,
      compiledMasks: this.compiledMasks.map((m4) => m4.state),
      currentMaskRef: this.currentMask,
      currentMask: (_this$currentMask4 = this.currentMask) === null || _this$currentMask4 === void 0 ? void 0 : _this$currentMask4.state
    });
  }
  set state(state) {
    const {
      compiledMasks,
      currentMaskRef,
      currentMask
    } = state, maskedState = _objectWithoutPropertiesLoose(state, _excluded5);
    this.compiledMasks.forEach((m4, mi) => m4.state = compiledMasks[mi]);
    if (currentMaskRef != null) {
      this.currentMask = currentMaskRef;
      this.currentMask.state = currentMask;
    }
    super.state = maskedState;
  }
  /**
    @override
  */
  extractInput() {
    return this.currentMask ? this.currentMask.extractInput(...arguments) : "";
  }
  /**
    @override
  */
  extractTail() {
    return this.currentMask ? this.currentMask.extractTail(...arguments) : super.extractTail(...arguments);
  }
  /**
    @override
  */
  doCommit() {
    if (this.currentMask)
      this.currentMask.doCommit();
    super.doCommit();
  }
  /**
    @override
  */
  nearestInputPos() {
    return this.currentMask ? this.currentMask.nearestInputPos(...arguments) : super.nearestInputPos(...arguments);
  }
  get overwrite() {
    return this.currentMask ? this.currentMask.overwrite : super.overwrite;
  }
  set overwrite(overwrite) {
    console.warn('"overwrite" option is not available in dynamic mask, use this option in siblings');
  }
  get eager() {
    return this.currentMask ? this.currentMask.eager : super.eager;
  }
  set eager(eager) {
    console.warn('"eager" option is not available in dynamic mask, use this option in siblings');
  }
  get skipInvalid() {
    return this.currentMask ? this.currentMask.skipInvalid : super.skipInvalid;
  }
  set skipInvalid(skipInvalid) {
    if (this.isInitialized || skipInvalid !== Masked.DEFAULTS.skipInvalid) {
      console.warn('"skipInvalid" option is not available in dynamic mask, use this option in siblings');
    }
  }
  /**
    @override
  */
  maskEquals(mask) {
    return Array.isArray(mask) && this.compiledMasks.every((m4, mi) => {
      if (!mask[mi])
        return;
      const _mask$mi = mask[mi], {
        mask: oldMask
      } = _mask$mi, restOpts = _objectWithoutPropertiesLoose(_mask$mi, _excluded22);
      return objectIncludes(m4, restOpts) && m4.maskEquals(oldMask);
    });
  }
  /**
    @override
  */
  typedValueEquals(value) {
    var _this$currentMask5;
    return Boolean((_this$currentMask5 = this.currentMask) === null || _this$currentMask5 === void 0 ? void 0 : _this$currentMask5.typedValueEquals(value));
  }
};
MaskedDynamic.DEFAULTS = {
  dispatch: (appended, masked, flags, tail) => {
    if (!masked.compiledMasks.length)
      return;
    const inputValue = masked.rawInputValue;
    const inputs = masked.compiledMasks.map((m4, index) => {
      const isCurrent = masked.currentMask === m4;
      const startInputPos = isCurrent ? m4.value.length : m4.nearestInputPos(m4.value.length, DIRECTION.FORCE_LEFT);
      if (m4.rawInputValue !== inputValue) {
        m4.reset();
        m4.append(inputValue, {
          raw: true
        });
      } else if (!isCurrent) {
        m4.remove(startInputPos);
      }
      m4.append(appended, masked.currentMaskFlags(flags));
      m4.appendTail(tail);
      return {
        index,
        weight: m4.rawInputValue.length,
        totalInputPositions: m4.totalInputPositions(0, Math.max(startInputPos, m4.nearestInputPos(m4.value.length, DIRECTION.FORCE_LEFT)))
      };
    });
    inputs.sort((i1, i22) => i22.weight - i1.weight || i22.totalInputPositions - i1.totalInputPositions);
    return masked.compiledMasks[inputs[0].index];
  }
};
IMask.MaskedDynamic = MaskedDynamic;

// ../../node_modules/imask/esm/masked/pipe.js
var PIPE_TYPE = {
  MASKED: "value",
  UNMASKED: "unmaskedValue",
  TYPED: "typedValue"
};
function createPipe(mask) {
  let from = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : PIPE_TYPE.MASKED;
  let to = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : PIPE_TYPE.MASKED;
  const masked = createMask(mask);
  return (value) => masked.runIsolated((m4) => {
    m4[from] = value;
    return m4[to];
  });
}
function pipe(value) {
  for (var _len = arguments.length, pipeArgs = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    pipeArgs[_key - 1] = arguments[_key];
  }
  return createPipe(...pipeArgs)(value);
}
IMask.PIPE_TYPE = PIPE_TYPE;
IMask.createPipe = createPipe;
IMask.pipe = pipe;

// ../../node_modules/imask/esm/index.js
try {
  globalThis.IMask = IMask;
} catch (e10) {
}

// src/component/AssetInput.ts
var AssetInput = class extends UIGCElement {
  constructor() {
    super();
    this._inputHandler = null;
    this._imask = null;
    this.id = null;
    this.amount = null;
    this.amountUsd = null;
    this.asset = null;
    this.unit = null;
    this.error = null;
    this.disabled = false;
    this._inputHandler = r6(this.onInputChange, 300);
  }
  _onInputChange(e10) {
  }
  onInputChange() {
    const unmasked = this._imask.unmaskedValue;
    const masked = this._imask.value;
    const options2 = {
      bubbles: true,
      composed: true,
      detail: { id: this.id, asset: this.asset, value: unmasked, masked }
    };
    this.dispatchEvent(new CustomEvent("asset-input-change", options2));
  }
  onWrapperClick(e10) {
    this.shadowRoot.getElementById("asset").focus();
  }
  update(changedProperties) {
    if (changedProperties.has("amount") && this._imask) {
      if (this.amount) {
        this._imask.unmaskedValue = this.amount;
      } else {
        this._imask.unmaskedValue = "";
      }
    }
    super.update(changedProperties);
  }
  async firstUpdated() {
    super.firstUpdated();
    const input = this.shadowRoot.getElementById("asset");
    this._imask = IMask(input, priceMaskSettings);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._imask) {
      this._imask.destroy();
    }
  }
  render() {
    return x`
      <div class="asset-root" @click="${this.onWrapperClick}}">
        <slot name="inputAdornment"></slot>
        <div class="asset-wrapper">
          <span class="asset-field">
            <input
              ?disabled=${!this.asset || this.disabled}
              type="text"
              id="asset"
              class="asset-input"
              placeholder="0"
              value=${this.asset ? this.amount : null}
              @input=${(e10) => {
      this._onInputChange(e10);
      this._inputHandler();
    }}
            />
            <span class="asset-unit">${this.unit}</span>
          </span>
          ${n9(this.amountUsd, () => x` <span class="usd">≈ ${this.amountUsd} USD</span> `)}
        </div>
      </div>
      <p class="asset-error">${this.error}</p>
    `;
  }
};
AssetInput.styles = [
  UIGCElement.styles,
  i`
      :host {
        width: 100%;
      }

      /* Remove arrows - Chrome, Safari, Edge, Opera */
      input::-webkit-outer-spin-button,
      input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }

      /* Remove arrows - Firefox */
      input[type='number'] {
        -moz-appearance: textfield;
      }

      input:placeholder-shown + .asset-unit {
        color: #c7c7cd;
      }

      /* Placeholder color */
      ::-webkit-input-placeholder {
        color: #c7c7cd;
      }

      ::-moz-placeholder {
        color: #c7c7cd;
      }

      ::-ms-placeholder {
        color: #c7c7cd;
      }

      ::placeholder {
        color: #c7c7cd;
      }

      .asset-root {
        display: flex;
        flex-direction: row;
        align-items: center;
        height: var(--uigc-input-height);
        border-radius: var(--uigc-input-border-radius);
        border-width: var(--uigc-input-border-width);
        border-color: var(--uigc-input-border-color);
      }

      :host([error]) .asset-root {
        border: var(--uigc-field__error-border);
        border-width: var(--uigc-field__error-border-width);
        outline: var(--uigc-field__error-outline);
        outline-offset: -1px;
        border-bottom: var(--uigc-field__error-border) !important;
      }

      :host([field]) .asset-root {
        flex-direction: row;
        background: var(--uigc-textfield__field-background);
        border-width: var(--uigc-textfield__field-border-width);
        border-color: var(--uigc-textfield__field-border-color);
        border-style: solid;
        box-sizing: border-box;
        padding: var(--uigc-field-padding);
      }

      :host([disabled]) .asset-root {
        border-width: 0;
      }

      :host(:not([disabled]):not([field])) .asset-root {
        padding: var(--uigc-textfield-padding);
        background: var(--uigc-textfield-background);
        border-style: var(--uigc-textfield-border-style);
      }

      :host(:not([disabled]):not([field])) .asset-root:focus-within {
        border-color: var(--uigc-input-border-color__focus);
      }

      :host(:not([disabled]):not([field])) .asset-root:hover {
        background: var(--uigc-textfield-background__hover);
      }

      :host([field]:not([disabled])) .asset-root:focus,
      :host([field]:not([disabled])) .asset-root:focus-visible,
      :host([field]:not([disabled])) .asset-root:focus-within,
      :host([field]:not([disabled])) .asset-root:hover {
        border-color: var(--uigc-textfield__field-border-color__hover);
        background: var(--uigc-textfield__field-background__hover);
        transition: 0.2s ease-in-out;
      }

      :host([error]:not([disabled])) .asset-root:focus,
      :host([error]:not([disabled])) .asset-root:focus-visible,
      :host([error]:not([disabled])) .asset-root:focus-within,
      :host([error]:not([disabled])) .asset-root:hover {
        background: rgba(255, 75, 75, 0.1);
        transition: 0.2s ease-in-out;
      }

      .asset-wrapper {
        width: 100%;
      }

      .asset-field {
        width: 100%;
        display: flex;
        position: relative;
        -webkit-box-align: center;
        align-items: center;
        gap: 4px;
      }

      .asset-input {
        width: 100%;
        background: none;
        border: none;
        color: var(--hex-white);
        font-size: var(--uigc-textfield-font-size__sm);
        line-height: 24px;
        text-align: right;
        font-weight: 700;
        padding: 0px;
      }

      .asset-error {
        color: var(--uigc-field__error-color);
        line-height: 16px;
        margin-top: 2px;
        font-size: 12px;
      }

      .asset-unit {
        color: var(--hex-white);
        font-weight: 700;
        font-size: var(--uigc-textfield-font-size__sm);
        line-height: 24px;
      }

      @media (min-width: 520px) {
        .asset-input {
          font-size: var(--uigc-textfield-font-size);
        }

        .asset-unit {
          font-size: var(--uigc-textfield-font-size);
        }
      }

      .usd {
        display: flex;
        flex-direction: row-reverse;
        font-size: 10px;
        line-height: 14px;
        color: var(--hex-neutral-gray-400);
        font-weight: 600;
      }

      #asset-value {
        display: none;
      }
    `
];
__decorateClass([
  n5({ type: String })
], AssetInput.prototype, "id", 2);
__decorateClass([
  n5({ type: String })
], AssetInput.prototype, "amount", 2);
__decorateClass([
  n5({ type: String })
], AssetInput.prototype, "amountUsd", 2);
__decorateClass([
  n5({ type: String })
], AssetInput.prototype, "asset", 2);
__decorateClass([
  n5({ type: String })
], AssetInput.prototype, "unit", 2);
__decorateClass([
  n5({ type: String })
], AssetInput.prototype, "error", 2);
__decorateClass([
  n5({ type: Boolean })
], AssetInput.prototype, "disabled", 2);
AssetInput = __decorateClass([
  e8("uigc-asset-input")
], AssetInput);

// src/component/AssetInputComposite.ts
var AssetInputComposite = class extends UIGCElement {
  constructor() {
    super(...arguments);
    this.amount = null;
    this.amountUsd = null;
    this.asset = null;
    this.unit = null;
    this.disabled = false;
  }
  render() {
    return x`
      <div class="ninput-root">
        <div class="title">
          <slot></slot>
        </div>
        <uigc-asset-input
          id=${this.id}
          .asset=${this.asset}
          .amount=${this.amount}
          .amountUsd=${this.amountUsd}
          .unit=${this.unit}
          ?disabled=${this.disabled}
        ></uigc-asset-input>
      </div>
    `;
  }
};
AssetInputComposite.styles = [
  UIGCElement.styles,
  i`
      .ninput-root {
        display: flex;
        flex-direction: row;
        background: var(--uigc-field-background);
        border-radius: var(--uigc-field-border-radius);
        border-bottom: var(--uigc-field-border-bottom);
        box-sizing: border-box;
        padding: var(--uigc-field-padding);
        gap: 10px;
      }

      @media (max-width: 480px) {
        .ninput-root {
          margin: var(--uigc-field-margin__sm);
        }
      }

      :host([error]) .ninput-root {
        border: var(--uigc-field__error-border);
        border-width: var(--uigc-field__error-border-width);
        outline: var(--uigc-field__error-outline);
        outline-offset: -1px;
      }

      :host(:not([disabled])) .ninput-root:focus,
      :host(:not([disabled])) .ninput-root:focus-visible,
      :host(:not([disabled])) .ninput-root:focus-within,
      :host(:not([disabled])) .ninput-root:hover {
        border-bottom: var(--uigc-field-border-bottom__hover);
        background: var(--uigc-field-background__hover);
        transition: 0.2s ease-in-out;
      }

      .title {
        display: flex;
        align-items: flex-start;
        flex-direction: column;
        justify-content: center;
      }
    `
];
__decorateClass([
  n5({ type: String })
], AssetInputComposite.prototype, "amount", 2);
__decorateClass([
  n5({ type: String })
], AssetInputComposite.prototype, "amountUsd", 2);
__decorateClass([
  n5({ type: String })
], AssetInputComposite.prototype, "asset", 2);
__decorateClass([
  n5({ type: String })
], AssetInputComposite.prototype, "unit", 2);
__decorateClass([
  n5({ type: Boolean })
], AssetInputComposite.prototype, "disabled", 2);
AssetInputComposite = __decorateClass([
  e8("uigc-asset-cinput")
], AssetInputComposite);

// src/component/AssetList.ts
var AssetList = class extends UIGCElement {
  render() {
    return x`
      <div class="list-root">
        <div class="list-header">
          <span>ASSET</span>
          <span>BALANCE</span>
        </div>
        <slot name="selected"></slot>
        <slot></slot>
        <div class="list-header subheader">
          <span>ASSETS WITHOUT PAIR/POOL</span>
        </div>
        <slot name="disabled"></slot>
      </div>
    `;
  }
};
AssetList.styles = [
  UIGCElement.styles,
  i`
      .list-root {
        height: 100%;
        overflow-y: auto;
      }

      .list-header {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        padding: 0 14px;
        color: var(--uigc-list--header-color);
        background: var(--uigc-list--header-background);
        font-style: normal;
        font-weight: 600;
        font-size: 12px;
        line-height: 90%;
        border-bottom: var(--uigc-list-border-bottom);
        position: sticky;
        height: 24px;
        top: 0;
        z-index: 2;
      }

      @media (min-width: 768px) {
        .list-header {
          padding: 0 28px;
        }
      }

      .subheader {
        background: var(--uigc-list--header-background);
        position: sticky;
        top: 25px;
        z-index: 2;
      }

      ::slotted(*) {
        border-bottom: var(--uigc-list-border-bottom);
        display: block;
      }
    `
];
AssetList = __decorateClass([
  e8("uigc-asset-list")
], AssetList);

// src/component/AssetListItem.ts
var AssetListItem = class extends UIGCElement {
  constructor() {
    super(...arguments);
    this.asset = null;
    this.unit = null;
    this.balance = null;
    this.balanceUsd = null;
    this.disabled = false;
  }
  onAssetClick(e10) {
    const options2 = {
      bubbles: true,
      composed: true,
      detail: { ...this.asset }
    };
    this.dispatchEvent(new CustomEvent("asset-click", options2));
  }
  render() {
    return x` <button @click=${this.onAssetClick} ?disabled=${this.disabled}>
      <slot name="asset"></slot>
      <div class="grow"></div>
      <div class="secondary">
        <span>${this.balance || 0} ${this.unit}</span>
        ${n9(this.balanceUsd, () => x` <span class="desc">≈ ${this.balanceUsd} USD</span> `)}
      </div>
    </button>`;
  }
};
AssetListItem.styles = [
  UIGCElement.styles,
  i`
      :host([disabled]) {
        opacity: 0.6;
        pointer-events: none;
      }

      :host([selected]) {
        background-color: var(--uigc-list-item__selected-background);
      }

      .secondary {
        display: flex;
        flex-direction: column;
        text-align: right;
      }

      .secondary span {
        font-weight: 500;
        font-size: 14px;
        line-height: 12px;
        color: var(--hex-white);
      }

      .secondary span.desc {
        font-weight: var(--uigc-list-item--secondary-desc-font-weight);
        font-size: 12px;
        line-height: 140%;
        color: var(--uigc-list-item--secondary-color);
      }

      button {
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 22px 14px;
        gap: 6px;
        background-color: transparent;
        background: var(--uigc-list-item--button-background);
        width: 100%;
        height: 56px;
        cursor: pointer;
      }

      @media (min-width: 768px) {
        button {
          padding: 22px 28px;
        }
      }

      button:hover {
        background: rgba(var(--rgb-white), 0.06);
      }
    `
];
__decorateClass([
  n5({ type: Object })
], AssetListItem.prototype, "asset", 2);
__decorateClass([
  n5({ type: String })
], AssetListItem.prototype, "unit", 2);
__decorateClass([
  n5({ type: String })
], AssetListItem.prototype, "balance", 2);
__decorateClass([
  n5({ type: String })
], AssetListItem.prototype, "balanceUsd", 2);
__decorateClass([
  n5({ type: Boolean })
], AssetListItem.prototype, "disabled", 2);
AssetListItem = __decorateClass([
  e8("uigc-asset-list-item")
], AssetListItem);

// src/component/AssetPrice.ts
var AssetPrice = class extends UIGCElement {
  constructor() {
    super(...arguments);
    this.inputAsset = null;
    this.outputAsset = null;
    this.outputBalance = null;
    this.loading = false;
    this.formatter = null;
  }
  render() {
    const formatterFn = this.formatter ? this.formatter : amountFormatter;
    return x`
      ${n9(
      this.loading,
      () => x`<div class="chip-root">
          <span class="progress"> <uigc-circular-progress size="small"></uigc-circular-progress> </span>
          <span class="progress-text">Fetching the best price...</span>
        </div>`,
      () => x` <div class="chip-root">
          <span>Price:</span>
          <span class="highlight">1 ${this.inputAsset}</span>
          <span>=</span>
          <span>${this.outputBalance ? formatterFn(this.outputBalance) : "-"} </span>
          <span>${this.outputAsset}</span>
        </div>`
    )}
    `;
  }
};
AssetPrice.styles = [
  UIGCElement.styles,
  i`
      .chip-root {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        padding: 0 14px;
        gap: 5px;
        height: 28px;
        background: var(--uigc-asset-price-background);
        border-radius: var(--uigc-asset-price-border-radius);
        border: var(--uigc-asset-price-border);
      }

      span {
        font-weight: 500;
        font-size: 11px;
        line-height: 15px;
      }

      span:not(.highlight) {
        color: var(--hex-white);
      }

      .highlight {
        color: var(--uigc-asset-price__highlight-color);
      }

      .progress {
        position: relative;
      }

      .progress-text {
        margin-left: 6px;
      }
    `
];
__decorateClass([
  n5({ type: String })
], AssetPrice.prototype, "inputAsset", 2);
__decorateClass([
  n5({ type: String })
], AssetPrice.prototype, "outputAsset", 2);
__decorateClass([
  n5({ type: String })
], AssetPrice.prototype, "outputBalance", 2);
__decorateClass([
  n5({ type: Boolean })
], AssetPrice.prototype, "loading", 2);
__decorateClass([
  n5({ attribute: false })
], AssetPrice.prototype, "formatter", 2);
AssetPrice = __decorateClass([
  e8("uigc-asset-price")
], AssetPrice);

// src/component/icons/Dropdown.ts
var DropdownIcon = class extends BaseIcon {
  bsxTemplate() {
    return x`
      <svg bsx xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M7.99414 10.5L11.9994 13.5L16.0046 10.5" stroke="#fff" stroke-width="2" stroke-linecap="square" />
      </svg>
    `;
  }
  hdxTemplate() {
    return x`
      <svg hdx xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M7.99414 10.5L11.9994 13.5L16.0046 10.5" stroke="#fff" stroke-width="2" stroke-linecap="square" />
      </svg>
    `;
  }
  render() {
    return x` ${this.bsxTemplate()} ${this.hdxTemplate()} `;
  }
};
DropdownIcon.styles = [
  BaseIcon.styles,
  i`
      :host([alt]) svg[bsx] path {
        stroke: rgb(120, 126, 130);
      }

      :host([alt]) svg[hdx] path {
        stroke: rgba(114, 131, 165, 0.6);
      }
    `
];
DropdownIcon = __decorateClass([
  e8("uigc-icon-dropdown")
], DropdownIcon);

// src/component/AssetSelector.ts
var AssetSelector = class extends UIGCElement {
  constructor() {
    super(...arguments);
    this.id = null;
    this.asset = null;
  }
  onSelectorClick(e10) {
    const options2 = {
      bubbles: true,
      composed: true,
      detail: { id: this.id, asset: this.asset }
    };
    this.dispatchEvent(new CustomEvent("asset-selector-click", options2));
  }
  render() {
    return x` <button @click=${this.onSelectorClick}>
      ${n9(
      this.asset,
      () => x` <slot name="asset"></slot>
          <uigc-icon-dropdown></uigc-icon-dropdown>`,
      () => x` <span class="select">
          <span> Select asset </span>
          <uigc-icon-dropdown></uigc-icon-dropdown>
        </span>`
    )}
    </button>`;
  }
};
AssetSelector.styles = [
  UIGCElement.styles,
  i`
      :host {
        border-radius: 12px;
      }

      button {
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 5px;
        gap: 6px;
        background-color: transparent;
        border-radius: var(--uigc-asset-selector-border-radius);
        height: 42px;
        cursor: pointer;
      }

      button:hover {
        background: rgba(var(--rgb-white), 0.06);
        transition: 0.2s ease-in-out;
      }

      .select {
        display: flex;
        align-items: center;
        padding: 0 6px;
        gap: 6px;
      }

      .select span {
        font-weight: 700;
        font-size: 16px;
        line-height: 100%;
        color: var(--hex-white);
        white-space: nowrap;
      }

      .select uigc-icon-dropdown {
        margin-top: 3px;
      }
    `
];
__decorateClass([
  n5({ type: String })
], AssetSelector.prototype, "id", 2);
__decorateClass([
  n5({ type: String })
], AssetSelector.prototype, "asset", 2);
AssetSelector = __decorateClass([
  e8("uigc-asset-selector")
], AssetSelector);

// src/component/icons/Switch.ts
var SwitchIcon = class extends BaseIcon {
  bsxTemplate() {
    return x`<svg bsx width="43" height="43" viewBox="0 0 43 43" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M21.5 0C17.2477 0 13.0909 1.26097 9.55523 3.62342C6.01957 5.98587 3.26384 9.34371 1.63656 13.2723C0.00927733 17.2009 -0.416443 21.5239 0.413139 25.6944C1.24272 29.865 3.29035 33.6959 6.29718 36.7028C9.30401 39.7096 13.135 41.7573 17.3056 42.5869C21.4762 43.4165 25.7991 42.9907 29.7277 41.3634C33.6563 39.7361 37.0141 36.9804 39.3766 33.4448C41.739 29.9091 43 25.7523 43 21.5C42.9936 15.7998 40.7263 10.3349 36.6957 6.3043C32.6651 2.27367 27.2002 0.00643278 21.5 0Z"
        fill="#4CF3A8"
        fill-opacity="0.12"
      ></path>
      <path
        d="M21.4851 14.4797L21.4849 28.1054M21.4849 28.1054L16.2259 22.8464M21.4849 28.1054L26.7286 22.8617"
        stroke="#8AFFCB"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></path>
    </svg>`;
  }
  hdxTemplate() {
    return x` <svg hdx xmlns="http://www.w3.org/2000/svg" width="43" height="43" viewBox="0 0 43 43" fill="none">
      <rect x="0.5" y="0.5" width="42" height="42" rx="3.5" fill="#111320" />
      <rect x="14.125" y="23.0273" width="2.94973" height="2.94973" fill="#57B3EB" />
      <rect x="17.0781" y="25.9769" width="2.94973" height="2.94973" fill="#57B3EB" />
      <rect x="20.0234" y="28.9268" width="2.94973" height="2.94973" fill="#57B3EB" />
      <rect
        x="28.875"
        y="23.0273"
        width="2.94973"
        height="2.94973"
        transform="rotate(90 28.875 23.0273)"
        fill="#57B3EB"
      />
      <rect
        x="25.9219"
        y="25.9769"
        width="2.94973"
        height="2.94973"
        transform="rotate(90 25.9219 25.9769)"
        fill="#57B3EB"
      />
      <rect
        x="22.9766"
        y="28.9268"
        width="2.94973"
        height="2.94973"
        transform="rotate(90 22.9766 28.9268)"
        fill="#57B3EB"
      />
      <rect
        x="22.9766"
        y="23.1234"
        width="2.94973"
        height="2.94973"
        transform="rotate(90 22.9766 23.1234)"
        fill="#57B3EB"
      />
      <rect
        x="22.9766"
        y="19.1235"
        width="2.94973"
        height="2.94973"
        transform="rotate(90 22.9766 19.1235)"
        fill="#57B3EB"
      />
      <rect
        x="22.9766"
        y="15.1235"
        width="2.94973"
        height="2.94973"
        transform="rotate(90 22.9766 15.1235)"
        fill="#57B3EB"
      />
      <rect
        x="22.9766"
        y="11.1235"
        width="2.94973"
        height="2.94973"
        transform="rotate(90 22.9766 11.1235)"
        fill="#57B3EB"
      />
      <rect
        x="22.9766"
        y="26.0734"
        width="2.94973"
        height="2.94973"
        transform="rotate(90 22.9766 26.0734)"
        fill="#57B3EB"
      />
      <rect x="0.5" y="0.5" width="42" height="42" rx="3.5" stroke="#30344C" />
    </svg>`;
  }
  render() {
    return x` ${this.bsxTemplate()} ${this.hdxTemplate()} `;
  }
};
SwitchIcon = __decorateClass([
  e8("uigc-icon-switch")
], SwitchIcon);

// src/component/icons/Arrow.ts
var ArrowIcon = class extends BaseIcon {
  bsxTemplate() {
    return x`<svg bsx width="43" height="43" viewBox="0 0 43 43" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M21.4851 14.4797L21.4849 28.1054M21.4849 28.1054L16.2259 22.8464M21.4849 28.1054L26.7286 22.8617"
        stroke="#8AFFCB"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></path>
    </svg>`;
  }
  hdxTemplate() {
    return x` <svg hdx xmlns="http://www.w3.org/2000/svg" width="43" height="43" viewBox="0 0 43 43" fill="none">
      <rect x="14.125" y="23.0273" width="2.94973" height="2.94973" fill="#57B3EB" />
      <rect x="17.0781" y="25.9769" width="2.94973" height="2.94973" fill="#57B3EB" />
      <rect x="20.0234" y="28.9268" width="2.94973" height="2.94973" fill="#57B3EB" />
      <rect
        x="28.875"
        y="23.0273"
        width="2.94973"
        height="2.94973"
        transform="rotate(90 28.875 23.0273)"
        fill="#57B3EB"
      />
      <rect
        x="25.9219"
        y="25.9769"
        width="2.94973"
        height="2.94973"
        transform="rotate(90 25.9219 25.9769)"
        fill="#57B3EB"
      />
      <rect
        x="22.9766"
        y="28.9268"
        width="2.94973"
        height="2.94973"
        transform="rotate(90 22.9766 28.9268)"
        fill="#57B3EB"
      />
      <rect
        x="22.9766"
        y="23.1234"
        width="2.94973"
        height="2.94973"
        transform="rotate(90 22.9766 23.1234)"
        fill="#57B3EB"
      />
      <rect
        x="22.9766"
        y="19.1235"
        width="2.94973"
        height="2.94973"
        transform="rotate(90 22.9766 19.1235)"
        fill="#57B3EB"
      />
      <rect
        x="22.9766"
        y="15.1235"
        width="2.94973"
        height="2.94973"
        transform="rotate(90 22.9766 15.1235)"
        fill="#57B3EB"
      />
      <rect
        x="22.9766"
        y="11.1235"
        width="2.94973"
        height="2.94973"
        transform="rotate(90 22.9766 11.1235)"
        fill="#57B3EB"
      />
      <rect
        x="22.9766"
        y="26.0734"
        width="2.94973"
        height="2.94973"
        transform="rotate(90 22.9766 26.0734)"
        fill="#57B3EB"
      />
    </svg>`;
  }
  render() {
    return x` ${this.bsxTemplate()} ${this.hdxTemplate()} `;
  }
};
ArrowIcon.styles = [
  BaseIcon.styles,
  i`
      :host([alt]) svg[bsx] path {
        stroke: #fff;
      }

      :host([alt]) svg[hdx] rect {
        fill: #fff;
      }
    `
];
ArrowIcon = __decorateClass([
  e8("uigc-icon-arrow")
], ArrowIcon);

// src/component/AssetSwitch.ts
var AssetSwitch = class extends UIGCElement {
  constructor() {
    super(...arguments);
    this.message = null;
  }
  onSwitchClick(e10) {
    const options2 = {
      bubbles: true,
      composed: true
    };
    this.dispatchEvent(new CustomEvent("asset-switch-click", options2));
  }
  render() {
    return x`
      <div class="switch-root" @click=${this.onSwitchClick} title=${this.message}>
        <uigc-icon-switch fit></uigc-icon-switch>
        <uigc-icon-arrow></uigc-icon-arrow>
      </div>
    `;
  }
};
AssetSwitch.styles = [
  UIGCElement.styles,
  i`
      :host([basic]) uigc-icon-arrow {
        display: block;
      }

      :host(:not([basic])) uigc-icon-switch {
        display: block;
      }

      :host([disabled]) .switch-root:hover > uigc-icon-switch,
      :host([disabled]) .switch-root:hover > uigc-icon-arrow {
        cursor: unset;
        transform: none;
      }

      .switch-root {
        width: 34px;
        height: 34px;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      uigc-icon-switch,
      uigc-icon-arrow {
        display: none;
        transition: var(--uigc-asset-switch-transition);
      }

      .switch-root:hover > uigc-icon-switch,
      .switch-root:hover > uigc-icon-arrow {
        cursor: pointer;
        transform: var(--uigc-asset-switch-transform);
      }
    `
];
__decorateClass([
  n5({ type: String })
], AssetSwitch.prototype, "message", 2);
AssetSwitch = __decorateClass([
  e8("uigc-asset-switch")
], AssetSwitch);

// src/component/AssetTransfer.ts
var AssetTransfer = class extends UIGCElement {
  constructor() {
    super(...arguments);
    this.id = null;
    this.title = null;
    this.amount = null;
    this.amountUsd = null;
    this.asset = null;
    this.unit = null;
    this.error = null;
    this.selectable = true;
    this.readonly = false;
  }
  render() {
    return x`
      <div tabindex="0" class="asset-root">
        <span class="title">${this.title}</span>
        <slot name="balance"></slot>
        <div class="asset">
          ${n9(
      this.selectable,
      () => x`
                <uigc-asset-selector id=${this.id} .asset=${this.asset}>
                  <slot name="asset" slot="asset"></slot>
                </uigc-asset-selector>
              `,
      () => x` <slot class="asset_ro" name="asset"></slot>`
    )}
          <uigc-asset-input
            hdx
            id=${this.id}
            .asset=${this.asset}
            .amount=${this.amount}
            .amountUsd=${this.amountUsd}
            .unit=${this.unit}
            ?disabled=${this.readonly}
          ></uigc-asset-input>
          <uigc-asset-input
            bsx
            id=${this.id}
            .asset=${this.asset}
            .amount=${this.amount}
            .amountUsd=${this.amountUsd}
            .unit=${this.unit}
            ?error=${this.error}
            .error=${this.error}
            ?disabled=${this.readonly}
          ></uigc-asset-input>
        </div>
      </div>
      <p hdx class="asset-error">${this.error}</p>
    `;
  }
};
AssetTransfer.styles = [
  UIGCElement.styles,
  i`
      .asset-root {
        display: grid;
        margin: none;
        background: var(--uigc-field-background);
        border-radius: var(--uigc-field-border-radius);
        box-sizing: border-box;
        padding: var(--uigc-field-padding);
        row-gap: var(--uigc-field-row-gap);
      }

      :host([dense]) .asset {
        height: unset;
      }

      :host(:not([readonly])) .asset-root {
        border-bottom: var(--uigc-field-border-bottom);
      }

      :host([error]) .asset-root {
        border: var(--uigc-asset-transfer__error-border);
        border-width: var(--uigc-asset-transfer__error-border-width);
        outline: var(--uigc-asset-transfer__error-outline);
        outline-offset: -1px;
        border-bottom: var(--uigc-asset-transfer__error-border) !important;
      }

      :host(:not([readonly])) .asset-root:focus,
      :host(:not([readonly])) .asset-root:focus-visible,
      :host(:not([readonly])) .asset-root:focus-within,
      :host(:not([readonly])) .asset-root:hover {
        border-bottom: var(--uigc-field-border-bottom__hover);
        background: var(--uigc-field-background__hover);
        transition: 0.2s ease-in-out;
      }

      :host([error]:not([readonly])) .asset-root:focus,
      :host([error]:not([readonly])) .asset-root:focus-visible,
      :host([error]:not([readonly])) .asset-root:focus-within,
      :host([error]:not([readonly])) .asset-root:hover {
        background: var(--uigc-asset-transfer__error-backgroud__hover);
        transition: 0.2s ease-in-out;
      }

      .asset-root > :nth-child(1) {
        grid-area: 1 / 1 / 2 / 2;
      }

      .asset-root > :nth-child(2) {
        padding-top: 0;
        grid-area: 1 / 2 / 2 / 3;
      }

      .asset-root > :nth-child(3) {
        grid-area: 2 / 1 / 3 / 3;
      }

      @media (max-width: 480px) {
        .asset-root {
          margin: var(--uigc-field-margin__sm);
        }
      }

      .asset-error {
        color: var(--uigc-field__error-color);
        line-height: 16px;
        margin-top: 2px;
        font-size: 12px;
      }

      :host uigc-asset-input[bsx] {
        display: var(--uigc-bsx-display);
      }

      :host uigc-asset-input[hdx] {
        display: var(--uigc-hdx-display);
      }

      :host p[hdx] {
        display: var(--uigc-hdx-display);
      }

      .title {
        display: flex;
        align-items: center;
        font-weight: 600;
        font-size: var(--uigc-field--title-font-size);
        line-height: var(--uigc-field--title-line-height);
        color: var(--uigc-field--title-color);
        text-transform: var(--uigc-field--title-text-transform);
      }

      .asset {
        height: 54px;
        display: flex;
        flex-direction: row;
        align-items: center;
      }

      .asset_ro {
        padding: 5px;
      }

      .asset > *:last-child {
        margin-left: 18px;
      }

      @media (min-width: 768px) {
        .asset > *:last-child {
          margin-left: 23px;
        }
      }
    `
];
__decorateClass([
  n5({ type: String })
], AssetTransfer.prototype, "id", 2);
__decorateClass([
  n5({ type: String })
], AssetTransfer.prototype, "title", 2);
__decorateClass([
  n5({ type: String })
], AssetTransfer.prototype, "amount", 2);
__decorateClass([
  n5({ type: String })
], AssetTransfer.prototype, "amountUsd", 2);
__decorateClass([
  n5({ type: String })
], AssetTransfer.prototype, "asset", 2);
__decorateClass([
  n5({ type: String })
], AssetTransfer.prototype, "unit", 2);
__decorateClass([
  n5({ type: String })
], AssetTransfer.prototype, "error", 2);
__decorateClass([
  n5({ type: Boolean })
], AssetTransfer.prototype, "selectable", 2);
__decorateClass([
  n5({ type: Boolean })
], AssetTransfer.prototype, "readonly", 2);
AssetTransfer = __decorateClass([
  e8("uigc-asset-transfer")
], AssetTransfer);

// src/component/icons/Crosshair.ts
var CrosshairIcon = class extends BaseIcon {
  render() {
    return x`
      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M5.26571 5.26816V6.73153H6.72909V5.26816H5.26571ZM0.875 5.26816H3.80186V3.80479H5.26523V0.87793H6.72861V3.80479H8.19198V5.26816H11.1188V6.73153H8.19198V8.19491H6.72861V11.1218H5.26523V8.19491H3.80186V6.73153H0.875V5.26816Z"
          fill="white"
        />
      </svg>
    `;
  }
};
CrosshairIcon = __decorateClass([
  e8("uigc-icon-crosshair")
], CrosshairIcon);

// src/component/AssetXRate.ts
var AssetXRate = class extends UIGCElement {
  constructor() {
    super(...arguments);
    this.title = null;
    this.amount = null;
    this.amountUsd = null;
    this.asset = null;
    this.unit = null;
  }
  render() {
    return x`
      <uigc-asset-cinput .asset=${this.asset} .amount=${this.amount} .amountUsd=${this.amountUsd} .unit=${this.unit}>
        <div class="title">
          <uigc-icon-crosshair></uigc-icon-crosshair>
          <span>${this.title}</span>
        </div>
        <slot name="button"></slot>
      </uigc-asset-cinput>
    `;
  }
};
AssetXRate.styles = [
  UIGCElement.styles,
  i`
      div.title {
        display: flex;
        flex-direction: row;
        white-space: nowrap;
        align-items: center;
        font-weight: 600;
        font-size: 14px;
        color: #ffffff;
        font-family: 'ChakraPetch';
      }

      uigc-icon-crosshair {
        margin-right: 5px;
      }
    `
];
__decorateClass([
  n5({ type: String })
], AssetXRate.prototype, "title", 2);
__decorateClass([
  n5({ type: String })
], AssetXRate.prototype, "amount", 2);
__decorateClass([
  n5({ type: String })
], AssetXRate.prototype, "amountUsd", 2);
__decorateClass([
  n5({ type: String })
], AssetXRate.prototype, "asset", 2);
__decorateClass([
  n5({ type: String })
], AssetXRate.prototype, "unit", 2);
AssetXRate = __decorateClass([
  e8("uigc-asset-x-rate")
], AssetXRate);

// src/component/Backdrop.ts
var Backdrop = class extends UIGCElement {
  render() {
    return x`
      <div class="backdrop-root">
        <slot></slot>
      </div>
    `;
  }
};
Backdrop.styles = [
  UIGCElement.styles,
  i`
      .backdrop-root {
        position: fixed;
        top: -100px;
        right: 0;
        bottom: 0;
        left: 0;
        background: var(--uigc-backdrop-background);
        z-index: 1201;
        opacity: 0;
        visibility: hidden;
        -webkit-transition: opacity 1s, visibility 1s;
        transition: opacity 1s, visibility 1s;
        backdrop-filter: blur(7px);
      }

      :host([active]) .backdrop-root {
        opacity: 1;
        visibility: visible;
      }
    `
];
Backdrop = __decorateClass([
  e8("uigc-backdrop")
], Backdrop);

// src/component/BusyIndicator.ts
var BusyIndicator = class extends UIGCElement {
  render() {
    return x`
      <div class="busy-indicator-root">
        <div
          class="busy-indicator-busy-area"
          tabindex="0"
          role="progressbar"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuetext="Busy"
          title="Please wait"
        >
          <div class="busy-indicator-circles-wrapper">
            <div class="busy-indicator-circle circle-animation-0"></div>
            <div class="busy-indicator-circle circle-animation-1"></div>
            <div class="busy-indicator-circle circle-animation-2"></div>
          </div>
          <slot></slot>
        </div>
      </div>
    `;
  }
};
BusyIndicator.styles = [
  UIGCElement.styles,
  i`
      :host {
        color: var(--hex-white);
      }

      :host([size='small']) .busy-indicator-root {
        min-width: 1.5rem;
        min-height: 0.5rem;
      }

      :host([size='small']) .busy-indicator-circle {
        width: 0.5rem;
        height: 0.5rem;
      }

      :host(:not([size])) .busy-indicator-root,
      :host([size='medium']) .busy-indicator-root {
        min-width: 3rem;
        min-height: 1rem;
      }

      :host(:not([size])) .busy-indicator-circle,
      :host([size='medium']) .busy-indicator-circle {
        width: 1rem;
        height: 1rem;
      }

      :host([size='large']) .busy-indicator-root {
        min-width: 6rem;
        min-height: 2rem;
      }

      :host([size='large']) .busy-indicator-circle {
        width: 2rem;
        height: 2rem;
      }

      ::slotted(span) {
        color: var(--hex-white);
      }

      .busy-indicator-root {
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        background-color: inherit;
      }

      .busy-indicator-busy-area {
        position: absolute;
        z-index: 99;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: inherit;
        flex-direction: column;
      }

      .busy-indicator-circles-wrapper {
        line-height: 0;
      }

      .busy-indicator-circle {
        display: inline-block;
        background-color: currentColor;
        border-radius: var(--uigc-busy-indicator--circle-border-radius);
      }

      .busy-indicator-circle::before {
        content: '';
        width: 100%;
        height: 100%;
        border-radius: 100%;
      }

      .circle-animation-0 {
        animation: grow 1.6s infinite cubic-bezier(0.32, 0.06, 0.85, 1.11);
      }

      .circle-animation-1 {
        animation: grow 1.6s infinite cubic-bezier(0.32, 0.06, 0.85, 1.11);
        animation-delay: 200ms;
      }

      .circle-animation-2 {
        animation: grow 1.6s infinite cubic-bezier(0.32, 0.06, 0.85, 1.11);
        animation-delay: 400ms;
      }

      @keyframes grow {
        0%,
        50%,
        100% {
          -webkit-transform: scale(0.5);
          -moz-transform: scale(0.5);
          transform: scale(0.5);
        }
        25% {
          -webkit-transform: scale(1);
          -moz-transform: scale(1);
          transform: scale(1);
        }
      }
    `
];
BusyIndicator = __decorateClass([
  e8("uigc-busy-indicator")
], BusyIndicator);

// src/component/Button.ts
var Button = class extends UIGCElement {
  render() {
    return x`
      <button type="button" class="button-root">
        <slot name="icon"></slot>
        <slot></slot>
        <slot name="endIcon"></slot>
      </button>
    `;
  }
};
Button.styles = [
  UIGCElement.styles,
  i`
      :host([size='small']) .button-root {
        padding: 12px 15px;
        font-size: 12px;
      }

      :host(:not([size])) .button-root,
      :host([size='medium']) .button-root {
        padding: 16px 36px;
        font-size: 14px;
      }

      :host([size='micro']) .button-root {
        padding: 2px 10px;
        font-size: 12px;
        line-height: 16px;
      }

      :host([fullwidth]) .button-root {
        width: 100%;
      }

      :host([nowrap]) .button-root {
        white-space: nowrap;
      }

      :host([variant='primary']) .button-root:before {
        background: var(--uigc-button__primary-background__before);
      }

      :host([variant='primary']) .button-root {
        color: var(--uigc-button__primary-color);
        background: var(--uigc-button__primary-background);
      }

      :host([variant='primary'][disabled]) .button-root {
        background: var(--uigc-button__primary-background__disabled);
        color: var(--uigc-button__primary-color__disabled);
        border: var(--uigc-button__disabled-border);
      }

      :host([variant='primary']) .button-root:hover {
        background: var(--uigc-button__primary-background__hover);
        transition: 0.2s ease-in-out;
        box-shadow: var(--uigc-button__primary-box-shadow__hover);
        transform: var(--uigc-button__primary-transform__hover);
      }

      :host([variant='secondary']) .button-root {
        color: var(--uigc-button__secondary-color);
        background: var(--uigc-button__secondary-background);
        border: var(--uigc-button__secondary-border);
      }

      :host([variant='secondary'][disabled]) .button-root {
        background: var(--uigc-button__secondary-background__disabled);
        color: var(--uigc-button__secondary-color__disabled);
        border: var(--uigc-button__disabled-border);
      }

      :host([variant='secondary']) .button-root:hover {
        color: var(--uigc-button__secondary-color__hover);
        background: var(--uigc-button__secondary-background__hover);
        border: var(--uigc-button__secondary-border__hover);
        transition: 0.2s ease-in-out;
      }

      :host([variant='error']) .button-root {
        color: var(--uigc-button__error-color);
        background: var(--uigc-button__error-background);
        border: var(--uigc-button__error-border);
      }

      :host([variant='error'][disabled]) .button-root {
        background: var(--uigc-button__error-background__disabled);
        color: var(--uigc-button__error-color__disabled);
        border: var(--uigc-button__disabled-border);
      }

      :host([variant='error']) .button-root:hover {
        color: var(--uigc-button__error-color__hover);
        background: var(--uigc-button__error-background__hover);
        border: var(--uigc-button__error-border__hover);
        transition: 0.2s ease-in-out;
      }

      :host([variant='info']) .button-root:before {
        background: var(--uigc-button__primary-background__before);
      }

      :host([variant='info']) .button-root {
        color: var(--uigc-button__info-color);
        background: var(--uigc-button__info-background);
      }

      :host([variant='info'][disabled]) .button-root {
        background: var(--uigc-button__info-background__disabled);
        color: var(--uigc-button__info-color__disabled);
        border: var(--uigc-button__disabled-border);
      }

      :host([variant='info']) .button-root:hover {
        background: var(--uigc-button__info-background__hover);
        transition: 0.2s ease-in-out;
        box-shadow: var(--uigc-button__info-box-shadow__hover);
        transform: var(--uigc-button__info-transform__hover);
      }

      :host([variant='max']) .button-root {
        color: #fff;
        background: rgba(var(--rgb-white), 0.06);
        font-weight: 600;
        text-transform: var(--uigc-button__max-text-transform);
      }

      :host([variant='max'][disabled]) .button-root {
        opacity: 0.2;
      }

      :host([variant='max']) .button-root:hover {
        background: rgba(var(--rgb-white), 0.15);
        transition: 0.2s ease-in-out;
      }

      .button-root {
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        border-radius: var(--uigc-button-border-radius);
        font-weight: 700;
        font-size: 16px;
        border: none;
        cursor: pointer;
        text-transform: uppercase;
        line-height: 18px;
        transition: 0.2s ease-in-out;
        transform-style: preserve-3d;
      }

      :host([disabled]) .button-root {
        cursor: not-allowed;
        pointer-events: none;
        opacity: var(--uigc-button__disabled-opacity);
      }

      .button-root:hover {
        transition: 0.2s ease-in-out;
      }

      :host([disabled]) .button-root:before {
        content: none;
      }

      .button-root:before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        border-radius: var(--uigc-button-border-radius);
        transform: translate3d(0px, 0px, -1px);
        -webkit-transition: 0.2s ease-in-out;
        transition: 0.2s ease-in-out;
      }

      .button-root:hover:before {
        transform: translate3d(5px, 5px, -1px);
      }
    `
];
Button = __decorateClass([
  e8("uigc-button")
], Button);

// src/component/types/DataType.ts
var DataType = class {
  static isValid(value) {
    return false;
  }
  static getMap(types) {
    const map = /* @__PURE__ */ new Map();
    Object.keys(types).forEach((type) => {
      map.set(type, types[type]);
    });
    return map;
  }
};

// src/component/types/ChainType.ts
var ChainTypes = {
  acala: "Acala",
  astar: "Astar",
  basilisk: "Basilisk",
  bifrost: "Bifrost",
  centrifuge: "Centrifuge",
  hydradx: "HydraDX",
  interlay: "Interlay",
  karura: "Karura",
  kusama: "Kusama",
  moonbeam: "Moonbeam",
  nodle: "Nodle",
  phala: "Phala",
  polkadot: "Polkadot",
  robonomics: "Robonomics",
  tinkernet: "Tinkernet",
  statemine: "AssetHub",
  assethub: "AssetHub",
  statemint: "AssetHub",
  "assethub-kusama": "AssetHub",
  subsocial: "Subsocial",
  unique: "Unique",
  zeitgeist: "Zeitgeist"
};
var ChainType = class extends DataType {
  static isValid(value) {
    return !!ChainTypes[value];
  }
};

// src/component/Chain.ts
var KNOWN_CHAINS = ChainType.getMap(ChainTypes);
var Chain = class extends UIGCElement {
  constructor() {
    super(...arguments);
    this.chain = null;
  }
  render() {
    const chainTitle = KNOWN_CHAINS.get(this.chain) || this.chain;
    return x` <uigc-logo-chain fit chain=${this.chain}>
        <uigc-logo-placeholder fit slot="placeholder"></uigc-logo-placeholder>
      </uigc-logo-chain>
      <span class="title"> ${chainTitle} </span>
      <slot></slot>`;
  }
};
Chain.styles = [
  UIGCElement.styles,
  i`
      :host {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 6px;
        background-color: transparent;
        cursor: pointer;
      }

      span.title {
        font-weight: 700;
        font-size: 16px;
        padding: 5px 0px;
        color: var(--hex-white);
      }

      uigc-logo-chain,
      uigc-logo-placeholder {
        width: 34px;
        height: 34px;
      }
    `
];
__decorateClass([
  n5({ type: String })
], Chain.prototype, "chain", 2);
Chain = __decorateClass([
  e8("uigc-chain")
], Chain);

// src/component/ChainSelector.ts
var ChainSelector = class extends UIGCElement {
  constructor() {
    super(...arguments);
    this.title = null;
    this.chain = null;
  }
  onSelectorClick(e10) {
    const options2 = {
      bubbles: true,
      composed: true,
      detail: { chain: this.chain }
    };
    this.dispatchEvent(new CustomEvent("chain-selector-click", options2));
  }
  render() {
    return x` <button @click=${this.onSelectorClick}>
      <span class="chain">
        <span class="title">${this.title}</span>
        ${n9(
      this.chain,
      () => x` <uigc-chain .chain=${this.chain}> </uigc-chain>`,
      () => x` <span class="select">
            <span> Select chain </span>
          </span>`
    )}
      </span>
      <uigc-icon-dropdown></uigc-icon-dropdown>
    </button>`;
  }
};
ChainSelector.styles = [
  UIGCElement.styles,
  i`
      :host {
        border-radius: 12px;
        width: 100%;
      }

      button {
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        padding: 12px 12px 12px 18px;
        border-radius: var(--uigc-chain-selector-border-radius);
        cursor: pointer;
        background: var(--uigc-chain-selector-background);
        border: var(--uigc-chain-selector-border);
      }

      button .title {
        display: flex;
        align-items: center;
        color: var(--uigc-chain-selector--title-color);
        font-weight: var(--uigc-chain-selector--title-font-weight);
        font-size: var(--uigc-asset-transfer--title-font-size);
        line-height: var(--uigc-asset-transfer--title-line-height);
        text-transform: var(--uigc-asset-transfer--title-text-transform);
      }

      button .chain {
        display: flex;
        flex-direction: column;
        gap: 14px;
      }

      button:focus,
      button:focus-visible,
      button:focus-within,
      button:hover {
        background: var(--uigc-chain-selector-background__hover);
        border: var(--uigc-chain-selector-border);
        transition: 0.2s ease-in-out;
      }

      .select {
        display: flex;
        align-items: center;
        padding: 0 6px;
        gap: 6px;
      }

      .select span {
        font-weight: 700;
        font-size: 16px;
        line-height: 100%;
        color: var(--hex-white);
        white-space: nowrap;
      }
    `
];
__decorateClass([
  n5({ type: String })
], ChainSelector.prototype, "title", 2);
__decorateClass([
  n5({ type: String })
], ChainSelector.prototype, "chain", 2);
ChainSelector = __decorateClass([
  e8("uigc-chain-selector")
], ChainSelector);

// src/component/base/CloseableElement.ts
var CloseableElement = class extends UIGCElement {
  constructor() {
    super(...arguments);
    this.open = false;
    this.id = null;
    this.timeout = null;
    this.countdownStart = 0;
    this.nextCount = -1;
    this.doCountdown = (time) => {
      if (!this.countdownStart) {
        this.countdownStart = performance.now();
      }
      if (time - this.countdownStart > this.timeout) {
        this.shouldClose();
        this.countdownStart = 0;
      } else {
        this.countdown();
      }
    };
  }
  countdown() {
    cancelAnimationFrame(this.nextCount);
    this.nextCount = requestAnimationFrame(this.doCountdown);
  }
  holdCountdown() {
    this.stopCountdown();
    this.addEventListener("focusout", this.resumeCountdown);
  }
  resumeCountdown() {
    this.removeEventListener("focusout", this.holdCountdown);
    this.countdown();
  }
  startCountdown() {
    this.countdown();
    this.addEventListener("focusin", this.holdCountdown);
  }
  stopCountdown() {
    cancelAnimationFrame(this.nextCount);
    this.countdownStart = 0;
  }
  shouldClose() {
    if (this.timeout === 0) {
      return;
    }
    const applyDefault = this.dispatchEvent(
      new CustomEvent("closeable-close", {
        composed: true,
        bubbles: true,
        cancelable: true,
        detail: { id: this.id }
      })
    );
    if (applyDefault) {
      this.close();
    }
  }
  close() {
    this.open = false;
  }
  updated(changes) {
    super.updated(changes);
    if (changes.has("open")) {
      if (this.open) {
        if (this.timeout) {
          this.startCountdown();
        }
      } else {
        if (this.timeout) {
          this.stopCountdown();
        }
      }
    }
    if (changes.has("timeout")) {
      if (this.timeout !== null && this.open) {
        this.startCountdown();
      } else {
        this.stopCountdown();
      }
    }
  }
};
__decorateClass([
  n5({ type: Boolean, reflect: true })
], CloseableElement.prototype, "open", 2);
__decorateClass([
  n5({ type: String })
], CloseableElement.prototype, "id", 2);
__decorateClass([
  n5({ type: Number })
], CloseableElement.prototype, "timeout", 2);

// src/component/Dialog.ts
var Dialog = class extends CloseableElement {
  render() {
    return x`
      <div class="dialog-root">
        <slot></slot>
        ${n9(
      this.timeout,
      () => x`
            <uigc-dialog-countdown .timeout=${this.timeout}></uigc-dialog-countdown>
            <uigc-progress .duration=${this.timeout}></uigc-progress>
          `
    )}
      </div>
      <uigc-backdrop active></uigc-backdrop>
    `;
  }
};
Dialog.styles = [
  UIGCElement.styles,
  i`
      .dialog-root {
        height: 100%;
        outline: 0px;
        display: flex;
        flex-direction: column;
        -webkit-box-pack: center;
        justify-content: center;
        -webkit-box-align: center;
        align-items: center;
        position: absolute;
        top: 0;
        z-index: 1202;
        overflow: hidden;
        padding: 0px 30px 30px;
        background: var(--uigc-dialog-background);
        box-shadow: var(--uigc-dialog-box-shadow);
        border-radius: var(--uigc-dialog-border-radius);
        box-sizing: border-box;
      }

      @media (min-width: 768px) {
        .dialog-root {
          width: 460px;
          height: 454px;
          left: calc(50% - 460px / 2 + 0.5px);
          top: calc(50% - 454px / 2 + 3.5px);
        }
      }

      uigc-progress {
        position: absolute;
        width: 100%;
        bottom: 0;
      }

      uigc-dialog-countdown {
        position: absolute;
        bottom: 14px;
      }
    `
];
Dialog = __decorateClass([
  e8("uigc-dialog")
], Dialog);

// ../../node_modules/lit-html/directives/async-replace.js
var o10 = class extends c4 {
  constructor() {
    super(...arguments), this._$Cq = new s7(this), this._$CK = new i6();
  }
  render(i7, s8) {
    return T;
  }
  update(i7, [s8, r7]) {
    if (this.isConnected || this.disconnected(), s8 === this._$CX)
      return;
    this._$CX = s8;
    let n10 = 0;
    const { _$Cq: o12, _$CK: h8 } = this;
    return t5(s8, async (t7) => {
      for (; h8.get(); )
        await h8.get();
      const i8 = o12.deref();
      if (void 0 !== i8) {
        if (i8._$CX !== s8)
          return false;
        void 0 !== r7 && (t7 = r7(t7, n10)), i8.commitValue(t7, n10), n10++;
      }
      return true;
    }), T;
  }
  commitValue(t7, i7) {
    this.setValue(t7);
  }
  disconnected() {
    this._$Cq.disconnect(), this._$CK.pause();
  }
  reconnected() {
    this._$Cq.reconnect(this), this._$CK.resume();
  }
};
var h7 = e5(o10);

// src/component/DialogCountdown.ts
async function* countDown(count) {
  while (count >= 0) {
    yield count--;
    await new Promise((r7) => setTimeout(r7, 1e3));
  }
}
var DialogCountdown = class extends UIGCElement {
  constructor() {
    super(...arguments);
    this.timeout = null;
    this.timer = null;
  }
  async firstUpdated() {
    this.timer = countDown(this.timeout / 1e3);
  }
  render() {
    return x`
      <div class="countdown-root">
        ${n9(
      this.timer,
      () => x`
            Closing window in&nbsp
            <span> ${h7(this.timer)}s</span>
          `
    )}
      </div>
    `;
  }
};
DialogCountdown.styles = i`
    :host {
      font-weight: var(--uigc-dialog-cnt-font-weight);
      font-size: var(--uigc-dialog-cnt-font-size);
      line-height: var(--uigc-dialog-cnt-line-height);
      text-align: center;
      color: var(--uigc-dialog-cnt-color);
    }

    :host .countdown-root {
      height: 22px;
      min-width: 120px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .countdown-root span {
      color: var(--uigc-app-font-color__primary);
    }
  `;
__decorateClass([
  n5({ type: Number })
], DialogCountdown.prototype, "timeout", 2);
__decorateClass([
  t6()
], DialogCountdown.prototype, "timer", 2);
DialogCountdown = __decorateClass([
  e8("uigc-dialog-countdown")
], DialogCountdown);

// src/component/Divider.ts
var Divider = class extends UIGCElement {
  render() {
    return x` <div class="divider-root"></div> `;
  }
};
Divider.styles = [
  UIGCElement.styles,
  i`
      .divider-root {
        background: var(--uigc-divider-background);
        height: 1px;
        width: 100%;
      }
    `
];
Divider = __decorateClass([
  e8("uigc-divider")
], Divider);

// ../../node_modules/lit-html/directives/class-map.js
var o11 = e5(class extends i4 {
  constructor(t7) {
    var i7;
    if (super(t7), t7.type !== t3.ATTRIBUTE || "class" !== t7.name || (null === (i7 = t7.strings) || void 0 === i7 ? void 0 : i7.length) > 2)
      throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.");
  }
  render(t7) {
    return " " + Object.keys(t7).filter((i7) => t7[i7]).join(" ") + " ";
  }
  update(i7, [s8]) {
    var r7, o12;
    if (void 0 === this.it) {
      this.it = /* @__PURE__ */ new Set(), void 0 !== i7.strings && (this.nt = new Set(i7.strings.join(" ").split(/\s/).filter((t7) => "" !== t7)));
      for (const t7 in s8)
        s8[t7] && !(null === (r7 = this.nt) || void 0 === r7 ? void 0 : r7.has(t7)) && this.it.add(t7);
      return this.render(s8);
    }
    const e10 = i7.element.classList;
    this.it.forEach((t7) => {
      t7 in s8 || (e10.remove(t7), this.it.delete(t7));
    });
    for (const t7 in s8) {
      const i8 = !!s8[t7];
      i8 === this.it.has(t7) || (null === (o12 = this.nt) || void 0 === o12 ? void 0 : o12.has(t7)) || (i8 ? (e10.add(t7), this.it.add(t7)) : (e10.remove(t7), this.it.delete(t7)));
    }
    return T;
  }
});

// src/component/Drawer.ts
var Drawer = class extends UIGCElement {
  constructor() {
    super(...arguments);
    this.open = false;
  }
  shouldClose() {
    const applyDefault = this.dispatchEvent(
      new CustomEvent("drawer-close", {
        bubbles: true,
        composed: true,
        cancelable: true
      })
    );
    if (applyDefault) {
      this.close();
    }
  }
  close() {
    this.open = false;
  }
  render() {
    const classes = {
      drawer: true,
      open: this.open
    };
    return x`
      <div class=${o11(classes)}>
        <div class="header">
          <slot name="title"></slot>
          <span class="grow"></span>
          <uigc-icon-button @click=${() => this.shouldClose()}>
            <uigc-icon-close></uigc-icon-close>
          </uigc-icon-button>
        </div>
        <div class="content">
          <slot></slot>
        </div>
      </div>
    `;
  }
};
Drawer.styles = [
  UIGCElement.styles,
  i`
      .drawer {
        position: fixed;
        display: flex;
        flex-direction: column;
        z-index: 1401;
        width: 100%;
        top: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(255, 255, 255, 1);
        -webkit-transform: translateX(105%);
        -moz-transform: translateX(105%);
        -ms-transform: translateX(105%);
        -o-transform: translateX(105%);
        transform: translateX(105%);
        -webkit-transition: -webkit-transform 0.5s ease-out;
        -moz-transition: transform 0.5s ease-out;
        -o-transition: transform 0.5s ease-out;
        transition: transform 0.5s ease-out;
        align-items: center;
        background: var(--uigc-drawer-background);
        box-shadow: var(--uigc-drawer-box-shadow);
      }

      @media (min-width: 768px) {
        .drawer {
          width: 400px;
          border-radius: var(--uigc-drawer-border-radius);
          margin: 10px;
        }
      }

      ::slotted(*) {
        width: 100%;
        box-sizing: border-box;
      }

      .header {
        display: flex;
        justify-content: center;
        padding: 22px 28px;
        box-sizing: border-box;
        align-items: center;
        line-height: 40px;
        font-style: normal;
        font-weight: 500;
        font-size: 16px;
        color: var(--hex-neutral-gray-100);
        width: 100%;
      }

      .content {
        overflow-y: auto;
        width: 100%;
        padding: 0 8px;
        box-sizing: border-box;
      }

      .open {
        -moz-transform: translateX(0);
        -ms-transform: translateX(0);
        -o-transform: translateX(0);
        -webkit-transform: translateX(0);
        transform: translateX(0);
      }
    `
];
__decorateClass([
  n5({ type: Boolean, reflect: true })
], Drawer.prototype, "open", 2);
Drawer = __decorateClass([
  e8("uigc-drawer")
], Drawer);

// src/component/Input.ts
var Input = class extends UIGCElement {
  constructor() {
    super(...arguments);
    this.type = "text";
    this.value = null;
    this.placeholder = null;
    this.step = null;
    this.min = null;
    this.max = null;
  }
  onInputChange(e10) {
    const input = this.shadowRoot.querySelector("input");
    this.value = e10.target.value;
    const options2 = {
      bubbles: true,
      composed: true,
      detail: { value: this.value, valid: input.reportValidity() }
    };
    this.dispatchEvent(new CustomEvent("input-change", options2));
  }
  async firstUpdated() {
    const input = this.shadowRoot.querySelector("input");
    input.setAttribute("type", this.type);
    input.setAttribute("placeholder", this.placeholder);
    input.setAttribute("step", this.step);
    input.setAttribute("min", this.min);
    input.setAttribute("max", this.max);
  }
  async updated() {
    const inputRoot = this.shadowRoot.querySelector(".input-root");
    const input = this.shadowRoot.querySelector("input");
    if (input.reportValidity()) {
      inputRoot.removeAttribute("error");
    } else {
      inputRoot.setAttribute("error", "");
    }
  }
  render() {
    return x`
      <div class="input-root">
        <input .value=${this.value} @input=${(e10) => this.onInputChange(e10)} />
      </div>
    `;
  }
};
Input.styles = [
  UIGCElement.styles,
  i`
      :host {
        width: 100%;
      }

      :host([fit]) .input-root {
        height: 100%;
      }

      /* Remove arrows - Chrome, Safari, Edge, Opera */
      input::-webkit-outer-spin-button,
      input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }

      /* Remove arrows - Firefox */
      input[type='number'] {
        -moz-appearance: textfield;
      }

      /* Placeholder color */
      ::-webkit-input-placeholder {
        color: var(--uigc-input__placeholder-color);
      }

      ::-moz-placeholder {
        color: var(--uigc-input__placeholder-color);
      }

      ::-ms-placeholder {
        color: var(--uigc-input__placeholder-color);
      }

      ::placeholder {
        color: var(--uigc-input__placeholder-color);
      }

      input {
        width: 100%;
        background: none;
        border: none;
        color: var(--hex-white);
        font-weight: 500;
        font-size: 14px;
        line-height: 100%;
        padding: 0px;
        box-sizing: border-box;
      }

      .input-root {
        width: 100%;
        height: 54px;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        -webkit-box-pack: center;
        justify-content: center;
        box-sizing: border-box;
        padding: 0 14px;
        background: var(--uigc-input-background);
        border-style: solid;
        border-radius: var(--uigc-input-border-radius);
        border-width: var(--uigc-input-border-width);
        border-color: var(--uigc-input-border-color);
      }

      .input-root:focus-within {
        border-color: var(--uigc-input-border-color__focus);
      }

      .input-root[error] {
        border: 1px solid var(--hex-red-300);
      }

      .input-root[error]:focus-within {
        border: 1px solid var(--hex-red-300);
      }

      .input-root:hover {
        background: var(--uigc-input-background__hover);
        transition: 0.2s ease-in-out;
      }
    `
];
__decorateClass([
  n5({ type: String })
], Input.prototype, "type", 2);
__decorateClass([
  n5({ type: String })
], Input.prototype, "value", 2);
__decorateClass([
  n5({ type: String })
], Input.prototype, "placeholder", 2);
__decorateClass([
  n5({ type: String })
], Input.prototype, "step", 2);
__decorateClass([
  n5({ type: String })
], Input.prototype, "min", 2);
__decorateClass([
  n5({ type: String })
], Input.prototype, "max", 2);
Input = __decorateClass([
  e8("uigc-input")
], Input);

// src/component/List.ts
var List = class extends UIGCElement {
  render() {
    return x`
      <div class="list-root">
        <div class="list-header">
          <slot name="header"> </slot>
        </div>
        <slot name="selected"></slot>
        <slot></slot>
        <slot name="disabled"></slot>
      </div>
    `;
  }
};
List.styles = [
  UIGCElement.styles,
  i`
      .list-root {
        height: 100%;
        overflow-y: auto;
      }

      .list-header {
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 0 14px;
        color: var(--uigc-list--header-color);
        background: var(--uigc-list--header-background);
        font-style: normal;
        font-weight: 600;
        font-size: 12px;
        line-height: 90%;
        border-bottom: var(--uigc-list-border-bottom);
        position: sticky;
        height: 24px;
        top: 0;
        z-index: 2;
      }

      @media (min-width: 768px) {
        .list-header {
          padding: 0 28px;
        }
      }

      .subheader {
        background: var(--uigc-list--header-background);
        position: sticky;
        top: 25px;
        z-index: 2;
      }

      ::slotted(*) {
        border-bottom: var(--uigc-list-border-bottom);
        display: block;
      }

      ::slotted(*[slot='header']) {
        border-bottom: none;
      }
    `
];
List = __decorateClass([
  e8("uigc-list")
], List);

// src/component/ListItem.ts
var ListItem = class extends UIGCElement {
  constructor() {
    super(...arguments);
    this.item = null;
    this.disabled = false;
  }
  onItemClick(e10) {
    const options2 = {
      bubbles: true,
      composed: true,
      detail: { item: this.item }
    };
    this.dispatchEvent(new CustomEvent("list-item-click", options2));
  }
  render() {
    return x` <button @click=${this.onItemClick} ?disabled=${this.disabled}>
      <slot></slot>
    </button>`;
  }
};
ListItem.styles = [
  UIGCElement.styles,
  i`
      :host([disabled]) {
        opacity: 0.6;
        pointer-events: none;
      }

      :host([selected]) {
        background-color: var(--uigc-list-item__selected-background);
      }

      button {
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 22px 14px;
        gap: 6px;
        background-color: transparent;
        background: var(--uigc-list-item--button-background);
        width: 100%;
        height: 56px;
        cursor: pointer;
      }

      @media (min-width: 768px) {
        button {
          padding: 22px 28px;
        }
      }

      button:hover {
        background: rgba(var(--rgb-white), 0.06);
      }
    `
];
__decorateClass([
  n5({ attribute: false })
], ListItem.prototype, "item", 2);
__decorateClass([
  n5({ type: Boolean })
], ListItem.prototype, "disabled", 2);
ListItem = __decorateClass([
  e8("uigc-list-item")
], ListItem);

// src/component/Paper.ts
var Paper = class extends UIGCElement {
  render() {
    return x` <slot></slot> `;
  }
};
Paper.styles = [
  UIGCElement.styles,
  i`
      :host {
        background: var(--uigc-paper-background);
        box-shadow: var(--uigc-paper-box-shadow);
        position: relative;
        overflow: hidden;
        padding: var(--uigc-paper-padding);
      }

      @media (min-width: 480px) {
        :host {
          border-radius: var(--uigc-app-border-radius);
        }

        :host:before {
          content: var(--uigc-paper-content);
          border-radius: var(--uigc-app-border-radius);
          position: absolute;
          inset: 0px;
          padding: 1px;
          background: linear-gradient(
            rgba(102, 151, 227, 0.35) 0%,
            rgba(68, 109, 174, 0.3) 66.67%,
            rgba(91, 151, 245, 0) 99.99%,
            rgba(158, 167, 180, 0) 100%
          );
          mask: var(--uigc-paper-mask);
          mask-composite: xor;
          -webkit-mask: var(--uigc-paper-mask);
          -webkit-mask-composite: xor;
          pointer-events: none;
        }
      }

      ::slotted(*) {
        width: 100%;
      }
    `
];
Paper = __decorateClass([
  e8("uigc-paper")
], Paper);

// ../../node_modules/@floating-ui/utils/dist/floating-ui.utils.mjs
var min = Math.min;
var max = Math.max;
var round = Math.round;
var createCoords = (v3) => ({
  x: v3,
  y: v3
});
function getSide(placement) {
  return placement.split("-")[0];
}
function getAlignment(placement) {
  return placement.split("-")[1];
}
function getOppositeAxis(axis) {
  return axis === "x" ? "y" : "x";
}
function getAxisLength(axis) {
  return axis === "y" ? "height" : "width";
}
function getSideAxis(placement) {
  return ["top", "bottom"].includes(getSide(placement)) ? "y" : "x";
}
function getAlignmentAxis(placement) {
  return getOppositeAxis(getSideAxis(placement));
}
function rectToClientRect(rect) {
  return {
    ...rect,
    top: rect.y,
    left: rect.x,
    right: rect.x + rect.width,
    bottom: rect.y + rect.height
  };
}

// ../../node_modules/@floating-ui/core/dist/floating-ui.core.mjs
function computeCoordsFromPlacement(_ref, placement, rtl) {
  let {
    reference,
    floating
  } = _ref;
  const sideAxis = getSideAxis(placement);
  const alignmentAxis = getAlignmentAxis(placement);
  const alignLength = getAxisLength(alignmentAxis);
  const side = getSide(placement);
  const isVertical = sideAxis === "y";
  const commonX = reference.x + reference.width / 2 - floating.width / 2;
  const commonY = reference.y + reference.height / 2 - floating.height / 2;
  const commonAlign = reference[alignLength] / 2 - floating[alignLength] / 2;
  let coords;
  switch (side) {
    case "top":
      coords = {
        x: commonX,
        y: reference.y - floating.height
      };
      break;
    case "bottom":
      coords = {
        x: commonX,
        y: reference.y + reference.height
      };
      break;
    case "right":
      coords = {
        x: reference.x + reference.width,
        y: commonY
      };
      break;
    case "left":
      coords = {
        x: reference.x - floating.width,
        y: commonY
      };
      break;
    default:
      coords = {
        x: reference.x,
        y: reference.y
      };
  }
  switch (getAlignment(placement)) {
    case "start":
      coords[alignmentAxis] -= commonAlign * (rtl && isVertical ? -1 : 1);
      break;
    case "end":
      coords[alignmentAxis] += commonAlign * (rtl && isVertical ? -1 : 1);
      break;
  }
  return coords;
}
var computePosition = async (reference, floating, config) => {
  const {
    placement = "bottom",
    strategy = "absolute",
    middleware = [],
    platform: platform2
  } = config;
  const validMiddleware = middleware.filter(Boolean);
  const rtl = await (platform2.isRTL == null ? void 0 : platform2.isRTL(floating));
  let rects = await platform2.getElementRects({
    reference,
    floating,
    strategy
  });
  let {
    x: x2,
    y: y2
  } = computeCoordsFromPlacement(rects, placement, rtl);
  let statefulPlacement = placement;
  let middlewareData = {};
  let resetCount = 0;
  for (let i7 = 0; i7 < validMiddleware.length; i7++) {
    const {
      name,
      fn
    } = validMiddleware[i7];
    const {
      x: nextX,
      y: nextY,
      data,
      reset
    } = await fn({
      x: x2,
      y: y2,
      initialPlacement: placement,
      placement: statefulPlacement,
      strategy,
      middlewareData,
      rects,
      platform: platform2,
      elements: {
        reference,
        floating
      }
    });
    x2 = nextX != null ? nextX : x2;
    y2 = nextY != null ? nextY : y2;
    middlewareData = {
      ...middlewareData,
      [name]: {
        ...middlewareData[name],
        ...data
      }
    };
    if (reset && resetCount <= 50) {
      resetCount++;
      if (typeof reset === "object") {
        if (reset.placement) {
          statefulPlacement = reset.placement;
        }
        if (reset.rects) {
          rects = reset.rects === true ? await platform2.getElementRects({
            reference,
            floating,
            strategy
          }) : reset.rects;
        }
        ({
          x: x2,
          y: y2
        } = computeCoordsFromPlacement(rects, statefulPlacement, rtl));
      }
      i7 = -1;
    }
  }
  return {
    x: x2,
    y: y2,
    placement: statefulPlacement,
    strategy,
    middlewareData
  };
};

// ../../node_modules/@floating-ui/utils/dist/floating-ui.utils.dom.mjs
function getNodeName(node) {
  if (isNode(node)) {
    return (node.nodeName || "").toLowerCase();
  }
  return "#document";
}
function getWindow(node) {
  var _node$ownerDocument;
  return (node == null || (_node$ownerDocument = node.ownerDocument) == null ? void 0 : _node$ownerDocument.defaultView) || window;
}
function getDocumentElement(node) {
  var _ref;
  return (_ref = (isNode(node) ? node.ownerDocument : node.document) || window.document) == null ? void 0 : _ref.documentElement;
}
function isNode(value) {
  return value instanceof Node || value instanceof getWindow(value).Node;
}
function isElement(value) {
  return value instanceof Element || value instanceof getWindow(value).Element;
}
function isHTMLElement(value) {
  return value instanceof HTMLElement || value instanceof getWindow(value).HTMLElement;
}
function isShadowRoot(value) {
  if (typeof ShadowRoot === "undefined") {
    return false;
  }
  return value instanceof ShadowRoot || value instanceof getWindow(value).ShadowRoot;
}
function isOverflowElement(element) {
  const {
    overflow,
    overflowX,
    overflowY,
    display
  } = getComputedStyle2(element);
  return /auto|scroll|overlay|hidden|clip/.test(overflow + overflowY + overflowX) && !["inline", "contents"].includes(display);
}
function isTableElement(element) {
  return ["table", "td", "th"].includes(getNodeName(element));
}
function isContainingBlock(element) {
  const webkit = isWebKit();
  const css = getComputedStyle2(element);
  return css.transform !== "none" || css.perspective !== "none" || (css.containerType ? css.containerType !== "normal" : false) || !webkit && (css.backdropFilter ? css.backdropFilter !== "none" : false) || !webkit && (css.filter ? css.filter !== "none" : false) || ["transform", "perspective", "filter"].some((value) => (css.willChange || "").includes(value)) || ["paint", "layout", "strict", "content"].some((value) => (css.contain || "").includes(value));
}
function getContainingBlock(element) {
  let currentNode = getParentNode(element);
  while (isHTMLElement(currentNode) && !isLastTraversableNode(currentNode)) {
    if (isContainingBlock(currentNode)) {
      return currentNode;
    } else {
      currentNode = getParentNode(currentNode);
    }
  }
  return null;
}
function isWebKit() {
  if (typeof CSS === "undefined" || !CSS.supports)
    return false;
  return CSS.supports("-webkit-backdrop-filter", "none");
}
function isLastTraversableNode(node) {
  return ["html", "body", "#document"].includes(getNodeName(node));
}
function getComputedStyle2(element) {
  return getWindow(element).getComputedStyle(element);
}
function getNodeScroll(element) {
  if (isElement(element)) {
    return {
      scrollLeft: element.scrollLeft,
      scrollTop: element.scrollTop
    };
  }
  return {
    scrollLeft: element.pageXOffset,
    scrollTop: element.pageYOffset
  };
}
function getParentNode(node) {
  if (getNodeName(node) === "html") {
    return node;
  }
  const result = (
    // Step into the shadow DOM of the parent of a slotted node.
    node.assignedSlot || // DOM Element detected.
    node.parentNode || // ShadowRoot detected.
    isShadowRoot(node) && node.host || // Fallback.
    getDocumentElement(node)
  );
  return isShadowRoot(result) ? result.host : result;
}
function getNearestOverflowAncestor(node) {
  const parentNode = getParentNode(node);
  if (isLastTraversableNode(parentNode)) {
    return node.ownerDocument ? node.ownerDocument.body : node.body;
  }
  if (isHTMLElement(parentNode) && isOverflowElement(parentNode)) {
    return parentNode;
  }
  return getNearestOverflowAncestor(parentNode);
}
function getOverflowAncestors(node, list, traverseIframes) {
  var _node$ownerDocument2;
  if (list === void 0) {
    list = [];
  }
  if (traverseIframes === void 0) {
    traverseIframes = true;
  }
  const scrollableAncestor = getNearestOverflowAncestor(node);
  const isBody = scrollableAncestor === ((_node$ownerDocument2 = node.ownerDocument) == null ? void 0 : _node$ownerDocument2.body);
  const win = getWindow(scrollableAncestor);
  if (isBody) {
    return list.concat(win, win.visualViewport || [], isOverflowElement(scrollableAncestor) ? scrollableAncestor : [], win.frameElement && traverseIframes ? getOverflowAncestors(win.frameElement) : []);
  }
  return list.concat(scrollableAncestor, getOverflowAncestors(scrollableAncestor, [], traverseIframes));
}

// ../../node_modules/@floating-ui/dom/dist/floating-ui.dom.mjs
function getCssDimensions(element) {
  const css = getComputedStyle2(element);
  let width = parseFloat(css.width) || 0;
  let height = parseFloat(css.height) || 0;
  const hasOffset = isHTMLElement(element);
  const offsetWidth = hasOffset ? element.offsetWidth : width;
  const offsetHeight = hasOffset ? element.offsetHeight : height;
  const shouldFallback = round(width) !== offsetWidth || round(height) !== offsetHeight;
  if (shouldFallback) {
    width = offsetWidth;
    height = offsetHeight;
  }
  return {
    width,
    height,
    $: shouldFallback
  };
}
function unwrapElement(element) {
  return !isElement(element) ? element.contextElement : element;
}
function getScale(element) {
  const domElement = unwrapElement(element);
  if (!isHTMLElement(domElement)) {
    return createCoords(1);
  }
  const rect = domElement.getBoundingClientRect();
  const {
    width,
    height,
    $: $2
  } = getCssDimensions(domElement);
  let x2 = ($2 ? round(rect.width) : rect.width) / width;
  let y2 = ($2 ? round(rect.height) : rect.height) / height;
  if (!x2 || !Number.isFinite(x2)) {
    x2 = 1;
  }
  if (!y2 || !Number.isFinite(y2)) {
    y2 = 1;
  }
  return {
    x: x2,
    y: y2
  };
}
var noOffsets = /* @__PURE__ */ createCoords(0);
function getVisualOffsets(element) {
  const win = getWindow(element);
  if (!isWebKit() || !win.visualViewport) {
    return noOffsets;
  }
  return {
    x: win.visualViewport.offsetLeft,
    y: win.visualViewport.offsetTop
  };
}
function shouldAddVisualOffsets(element, isFixed, floatingOffsetParent) {
  if (isFixed === void 0) {
    isFixed = false;
  }
  if (!floatingOffsetParent || isFixed && floatingOffsetParent !== getWindow(element)) {
    return false;
  }
  return isFixed;
}
function getBoundingClientRect(element, includeScale, isFixedStrategy, offsetParent) {
  if (includeScale === void 0) {
    includeScale = false;
  }
  if (isFixedStrategy === void 0) {
    isFixedStrategy = false;
  }
  const clientRect = element.getBoundingClientRect();
  const domElement = unwrapElement(element);
  let scale = createCoords(1);
  if (includeScale) {
    if (offsetParent) {
      if (isElement(offsetParent)) {
        scale = getScale(offsetParent);
      }
    } else {
      scale = getScale(element);
    }
  }
  const visualOffsets = shouldAddVisualOffsets(domElement, isFixedStrategy, offsetParent) ? getVisualOffsets(domElement) : createCoords(0);
  let x2 = (clientRect.left + visualOffsets.x) / scale.x;
  let y2 = (clientRect.top + visualOffsets.y) / scale.y;
  let width = clientRect.width / scale.x;
  let height = clientRect.height / scale.y;
  if (domElement) {
    const win = getWindow(domElement);
    const offsetWin = offsetParent && isElement(offsetParent) ? getWindow(offsetParent) : offsetParent;
    let currentIFrame = win.frameElement;
    while (currentIFrame && offsetParent && offsetWin !== win) {
      const iframeScale = getScale(currentIFrame);
      const iframeRect = currentIFrame.getBoundingClientRect();
      const css = getComputedStyle2(currentIFrame);
      const left = iframeRect.left + (currentIFrame.clientLeft + parseFloat(css.paddingLeft)) * iframeScale.x;
      const top = iframeRect.top + (currentIFrame.clientTop + parseFloat(css.paddingTop)) * iframeScale.y;
      x2 *= iframeScale.x;
      y2 *= iframeScale.y;
      width *= iframeScale.x;
      height *= iframeScale.y;
      x2 += left;
      y2 += top;
      currentIFrame = getWindow(currentIFrame).frameElement;
    }
  }
  return rectToClientRect({
    width,
    height,
    x: x2,
    y: y2
  });
}
var topLayerSelectors = [":popover-open", ":modal"];
function topLayer(floating) {
  let isTopLayer = false;
  let x2 = 0;
  let y2 = 0;
  function setIsTopLayer(selector) {
    try {
      isTopLayer = isTopLayer || floating.matches(selector);
    } catch (e10) {
    }
  }
  topLayerSelectors.forEach((selector) => {
    setIsTopLayer(selector);
  });
  if (isTopLayer) {
    const containingBlock = getContainingBlock(floating);
    if (containingBlock) {
      const rect = containingBlock.getBoundingClientRect();
      x2 = rect.x;
      y2 = rect.y;
    }
  }
  return [isTopLayer, x2, y2];
}
function convertOffsetParentRelativeRectToViewportRelativeRect(_ref) {
  let {
    elements,
    rect,
    offsetParent,
    strategy
  } = _ref;
  const documentElement = getDocumentElement(offsetParent);
  const [isTopLayer] = elements ? topLayer(elements.floating) : [false];
  if (offsetParent === documentElement || isTopLayer) {
    return rect;
  }
  let scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  let scale = createCoords(1);
  const offsets = createCoords(0);
  const isOffsetParentAnElement = isHTMLElement(offsetParent);
  if (isOffsetParentAnElement || !isOffsetParentAnElement && strategy !== "fixed") {
    if (getNodeName(offsetParent) !== "body" || isOverflowElement(documentElement)) {
      scroll = getNodeScroll(offsetParent);
    }
    if (isHTMLElement(offsetParent)) {
      const offsetRect = getBoundingClientRect(offsetParent);
      scale = getScale(offsetParent);
      offsets.x = offsetRect.x + offsetParent.clientLeft;
      offsets.y = offsetRect.y + offsetParent.clientTop;
    }
  }
  return {
    width: rect.width * scale.x,
    height: rect.height * scale.y,
    x: rect.x * scale.x - scroll.scrollLeft * scale.x + offsets.x,
    y: rect.y * scale.y - scroll.scrollTop * scale.y + offsets.y
  };
}
function getClientRects(element) {
  return Array.from(element.getClientRects());
}
function getWindowScrollBarX(element) {
  return getBoundingClientRect(getDocumentElement(element)).left + getNodeScroll(element).scrollLeft;
}
function getDocumentRect(element) {
  const html2 = getDocumentElement(element);
  const scroll = getNodeScroll(element);
  const body = element.ownerDocument.body;
  const width = max(html2.scrollWidth, html2.clientWidth, body.scrollWidth, body.clientWidth);
  const height = max(html2.scrollHeight, html2.clientHeight, body.scrollHeight, body.clientHeight);
  let x2 = -scroll.scrollLeft + getWindowScrollBarX(element);
  const y2 = -scroll.scrollTop;
  if (getComputedStyle2(body).direction === "rtl") {
    x2 += max(html2.clientWidth, body.clientWidth) - width;
  }
  return {
    width,
    height,
    x: x2,
    y: y2
  };
}
function getViewportRect(element, strategy) {
  const win = getWindow(element);
  const html2 = getDocumentElement(element);
  const visualViewport = win.visualViewport;
  let width = html2.clientWidth;
  let height = html2.clientHeight;
  let x2 = 0;
  let y2 = 0;
  if (visualViewport) {
    width = visualViewport.width;
    height = visualViewport.height;
    const visualViewportBased = isWebKit();
    if (!visualViewportBased || visualViewportBased && strategy === "fixed") {
      x2 = visualViewport.offsetLeft;
      y2 = visualViewport.offsetTop;
    }
  }
  return {
    width,
    height,
    x: x2,
    y: y2
  };
}
function getInnerBoundingClientRect(element, strategy) {
  const clientRect = getBoundingClientRect(element, true, strategy === "fixed");
  const top = clientRect.top + element.clientTop;
  const left = clientRect.left + element.clientLeft;
  const scale = isHTMLElement(element) ? getScale(element) : createCoords(1);
  const width = element.clientWidth * scale.x;
  const height = element.clientHeight * scale.y;
  const x2 = left * scale.x;
  const y2 = top * scale.y;
  return {
    width,
    height,
    x: x2,
    y: y2
  };
}
function getClientRectFromClippingAncestor(element, clippingAncestor, strategy) {
  let rect;
  if (clippingAncestor === "viewport") {
    rect = getViewportRect(element, strategy);
  } else if (clippingAncestor === "document") {
    rect = getDocumentRect(getDocumentElement(element));
  } else if (isElement(clippingAncestor)) {
    rect = getInnerBoundingClientRect(clippingAncestor, strategy);
  } else {
    const visualOffsets = getVisualOffsets(element);
    rect = {
      ...clippingAncestor,
      x: clippingAncestor.x - visualOffsets.x,
      y: clippingAncestor.y - visualOffsets.y
    };
  }
  return rectToClientRect(rect);
}
function hasFixedPositionAncestor(element, stopNode) {
  const parentNode = getParentNode(element);
  if (parentNode === stopNode || !isElement(parentNode) || isLastTraversableNode(parentNode)) {
    return false;
  }
  return getComputedStyle2(parentNode).position === "fixed" || hasFixedPositionAncestor(parentNode, stopNode);
}
function getClippingElementAncestors(element, cache) {
  const cachedResult = cache.get(element);
  if (cachedResult) {
    return cachedResult;
  }
  let result = getOverflowAncestors(element, [], false).filter((el) => isElement(el) && getNodeName(el) !== "body");
  let currentContainingBlockComputedStyle = null;
  const elementIsFixed = getComputedStyle2(element).position === "fixed";
  let currentNode = elementIsFixed ? getParentNode(element) : element;
  while (isElement(currentNode) && !isLastTraversableNode(currentNode)) {
    const computedStyle = getComputedStyle2(currentNode);
    const currentNodeIsContaining = isContainingBlock(currentNode);
    if (!currentNodeIsContaining && computedStyle.position === "fixed") {
      currentContainingBlockComputedStyle = null;
    }
    const shouldDropCurrentNode = elementIsFixed ? !currentNodeIsContaining && !currentContainingBlockComputedStyle : !currentNodeIsContaining && computedStyle.position === "static" && !!currentContainingBlockComputedStyle && ["absolute", "fixed"].includes(currentContainingBlockComputedStyle.position) || isOverflowElement(currentNode) && !currentNodeIsContaining && hasFixedPositionAncestor(element, currentNode);
    if (shouldDropCurrentNode) {
      result = result.filter((ancestor) => ancestor !== currentNode);
    } else {
      currentContainingBlockComputedStyle = computedStyle;
    }
    currentNode = getParentNode(currentNode);
  }
  cache.set(element, result);
  return result;
}
function getClippingRect(_ref) {
  let {
    element,
    boundary,
    rootBoundary,
    strategy
  } = _ref;
  const elementClippingAncestors = boundary === "clippingAncestors" ? getClippingElementAncestors(element, this._c) : [].concat(boundary);
  const clippingAncestors = [...elementClippingAncestors, rootBoundary];
  const firstClippingAncestor = clippingAncestors[0];
  const clippingRect = clippingAncestors.reduce((accRect, clippingAncestor) => {
    const rect = getClientRectFromClippingAncestor(element, clippingAncestor, strategy);
    accRect.top = max(rect.top, accRect.top);
    accRect.right = min(rect.right, accRect.right);
    accRect.bottom = min(rect.bottom, accRect.bottom);
    accRect.left = max(rect.left, accRect.left);
    return accRect;
  }, getClientRectFromClippingAncestor(element, firstClippingAncestor, strategy));
  return {
    width: clippingRect.right - clippingRect.left,
    height: clippingRect.bottom - clippingRect.top,
    x: clippingRect.left,
    y: clippingRect.top
  };
}
function getDimensions(element) {
  const {
    width,
    height
  } = getCssDimensions(element);
  return {
    width,
    height
  };
}
function getRectRelativeToOffsetParent(element, offsetParent, strategy, floating) {
  const isOffsetParentAnElement = isHTMLElement(offsetParent);
  const documentElement = getDocumentElement(offsetParent);
  const isFixed = strategy === "fixed";
  const rect = getBoundingClientRect(element, true, isFixed, offsetParent);
  let scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const offsets = createCoords(0);
  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
    if (getNodeName(offsetParent) !== "body" || isOverflowElement(documentElement)) {
      scroll = getNodeScroll(offsetParent);
    }
    if (isOffsetParentAnElement) {
      const offsetRect = getBoundingClientRect(offsetParent, true, isFixed, offsetParent);
      offsets.x = offsetRect.x + offsetParent.clientLeft;
      offsets.y = offsetRect.y + offsetParent.clientTop;
    } else if (documentElement) {
      offsets.x = getWindowScrollBarX(documentElement);
    }
  }
  let x2 = rect.left + scroll.scrollLeft - offsets.x;
  let y2 = rect.top + scroll.scrollTop - offsets.y;
  const [isTopLayer, topLayerX, topLayerY] = topLayer(floating);
  if (isTopLayer) {
    x2 += topLayerX;
    y2 += topLayerY;
    if (isOffsetParentAnElement) {
      x2 += offsetParent.clientLeft;
      y2 += offsetParent.clientTop;
    }
  }
  return {
    x: x2,
    y: y2,
    width: rect.width,
    height: rect.height
  };
}
function getTrueOffsetParent(element, polyfill) {
  if (!isHTMLElement(element) || getComputedStyle2(element).position === "fixed") {
    return null;
  }
  if (polyfill) {
    return polyfill(element);
  }
  return element.offsetParent;
}
function getOffsetParent(element, polyfill) {
  const window2 = getWindow(element);
  if (!isHTMLElement(element)) {
    return window2;
  }
  let offsetParent = getTrueOffsetParent(element, polyfill);
  while (offsetParent && isTableElement(offsetParent) && getComputedStyle2(offsetParent).position === "static") {
    offsetParent = getTrueOffsetParent(offsetParent, polyfill);
  }
  if (offsetParent && (getNodeName(offsetParent) === "html" || getNodeName(offsetParent) === "body" && getComputedStyle2(offsetParent).position === "static" && !isContainingBlock(offsetParent))) {
    return window2;
  }
  return offsetParent || getContainingBlock(element) || window2;
}
var getElementRects = async function(data) {
  const getOffsetParentFn = this.getOffsetParent || getOffsetParent;
  const getDimensionsFn = this.getDimensions;
  return {
    reference: getRectRelativeToOffsetParent(data.reference, await getOffsetParentFn(data.floating), data.strategy, data.floating),
    floating: {
      x: 0,
      y: 0,
      ...await getDimensionsFn(data.floating)
    }
  };
};
function isRTL(element) {
  return getComputedStyle2(element).direction === "rtl";
}
var platform = {
  convertOffsetParentRelativeRectToViewportRelativeRect,
  getDocumentElement,
  getClippingRect,
  getOffsetParent,
  getElementRects,
  getClientRects,
  getDimensions,
  getScale,
  isElement,
  isRTL
};
var computePosition2 = (reference, floating, options2) => {
  const cache = /* @__PURE__ */ new Map();
  const mergedOptions = {
    platform,
    ...options2
  };
  const platformWithCache = {
    ...mergedOptions.platform,
    _c: cache
  };
  return computePosition(reference, floating, {
    ...mergedOptions,
    platform: platformWithCache
  });
};

// src/component/Popper.ts
var Popper = class extends UIGCElement {
  constructor() {
    super(...arguments);
    this.text = null;
  }
  async firstUpdated() {
    const slotted = this.shadowRoot.querySelector("slot");
    const triggerElement = slotted.assignedElements()[0];
    const tooltipElement = this.shadowRoot.querySelector(".tooltip");
    triggerElement.addEventListener("mouseover", () => {
      console.log(triggerElement);
      console.log(tooltipElement);
      computePosition2(triggerElement, tooltipElement, {
        placement: "right-start"
      }).then(({ x: x2, y: y2 }) => {
        Object.assign(tooltipElement.style, {
          display: "block",
          left: `${x2}px`,
          top: `${y2}px`
        });
      });
    });
    triggerElement.addEventListener("mouseout", () => {
      Object.assign(tooltipElement.style, {
        display: "none"
      });
    });
  }
  render() {
    return x`
      <slot></slot>
      <div class="tooltip">${this.text}</div>
    `;
  }
};
Popper.styles = [
  UIGCElement.styles,
  i`
      .tooltip {
        display: none;
        width: max-content;
        position: absolute;
        top: 0;
        left: 0;
        background: #d00000;
        color: white;
        padding: 5px;
        border-radius: 4px;
        font-size: 90%;
      }
    `
];
__decorateClass([
  n5({ type: String })
], Popper.prototype, "text", 2);
Popper = __decorateClass([
  e8("uigc-popper")
], Popper);

// src/component/Progress.ts
var Progress = class extends UIGCElement {
  constructor() {
    super(...arguments);
    this.duration = null;
  }
  async firstUpdated() {
    const progress = this.shadowRoot.querySelector(".progress-root");
    if (this.duration) {
      progress.setAttribute("style", "--duration: " + this.duration / 1e3 + ";");
    }
  }
  render() {
    return x` <div class="progress-root"></div> `;
  }
};
Progress.styles = [
  UIGCElement.styles,
  i`
      :host {
        overflow: hidden;
      }

      :host([variant='success']) .progress-root {
        background: linear-gradient(
          to bottom,
          var(--uigc-progress__success-background),
          var(--uigc-progress__success-background)
        );
      }

      :host([variant='error']) .progress-root {
        background: linear-gradient(
          to bottom,
          var(--uigc-progress__error-background),
          var(--uigc-progress__error-background)
        );
      }

      :host([variant='progress']) .progress-root {
        background: linear-gradient(to bottom, var(--uigc-progress-background), var(--uigc-progress-background));
      }

      :host .progress-root {
        height: 3px;
        animation: roundtime calc(var(--duration) * 1s) linear forwards;
        transform-origin: left center;
        background: linear-gradient(to bottom, var(--uigc-progress-background), var(--uigc-progress-background));
      }

      @keyframes roundtime {
        to {
          transform: scaleX(0);
        }
      }
    `
];
__decorateClass([
  n5({ type: Number })
], Progress.prototype, "duration", 2);
Progress = __decorateClass([
  e8("uigc-progress")
], Progress);

// src/component/icons/Magnifier.ts
var MagnifierIcon = class extends BaseIcon {
  render() {
    return x`
      <svg width="25" height="27" viewBox="0 0 25 27" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M15.8005 18.2226L18.0614 20.4835V20.4844C18.1877 20.3087 18.3277 20.1431 18.4814 19.9894C18.6351 19.8366 18.7998 19.6957 18.9755 19.5685L16.7164 17.3076C16.5709 17.4659 16.4227 17.6214 16.2699 17.7761C16.1162 17.9307 15.9589 18.0771 15.8015 18.2226L15.8005 18.2226ZM24.234 25.7418C24.6896 25.2852 24.6896 24.5468 24.234 24.0912L20.6032 20.4604C20.1476 20.0048 19.4083 20.0048 18.9526 20.4604C18.497 20.9161 18.497 21.6554 18.9526 22.111L22.5843 25.7418C23.0409 26.1956 23.7774 26.1956 24.234 25.7418Z"
          fill="#686876"
        />
        <path
          d="M0.101562 10.2201C0.101562 12.6874 1.08182 15.0535 2.82604 16.7981C4.57148 18.5405 6.93574 19.5187 9.4025 19.5187C11.8681 19.5187 14.2336 18.5405 15.979 16.7981C17.7232 15.0534 18.7023 12.6874 18.7023 10.2201C18.7023 7.75269 17.7232 5.38663 15.979 3.64197C14.2347 1.89732 11.8693 0.917969 9.4025 0.917969C6.93574 0.917969 4.57027 1.89732 2.82604 3.64197C1.08182 5.38666 0.101562 7.75269 0.101562 10.2201Z"
          fill="#686876"
        />
      </svg>
    `;
  }
};
MagnifierIcon = __decorateClass([
  e8("uigc-icon-magnifier")
], MagnifierIcon);

// src/component/SearchBar.ts
var SearchBar = class extends UIGCElement {
  constructor() {
    super(...arguments);
    this.value = null;
    this.placeholder = null;
  }
  onInputChange(e10) {
    this.value = e10.target.value;
    const options2 = {
      bubbles: true,
      composed: true,
      detail: { value: this.value }
    };
    this.dispatchEvent(new CustomEvent("search-change", options2));
  }
  async firstUpdated() {
    const input = this.shadowRoot.querySelector("input");
    input.setAttribute("placeholder", this.placeholder);
  }
  render() {
    return x`
      <div class="search-root">
        <uigc-icon-magnifier></uigc-icon-magnifier>
        <input type="text" .value="${this.value}" @input=${this.onInputChange} />
      </div>
    `;
  }
};
SearchBar.styles = [
  UIGCElement.styles,
  i`
      :host {
        width: 100%;
      }

      /* Placeholder color */
      ::-webkit-input-placeholder {
        color: rgba(var(--rgb-primary-100), 0.4);
      }

      ::-moz-placeholder {
        color: rgba(var(--rgb-primary-100), 0.4);
      }

      ::-ms-placeholder {
        color: rgba(var(--rgb-primary-100), 0.4);
      }

      ::placeholder {
        color: rgba(var(--rgb-primary-100), 0.4);
      }

      input {
        width: 100%;
        background: none;
        border: none;
        color: var(--hex-white);
        font-weight: 500;
        font-size: 14px;
        line-height: 100%;
        padding: 0px;
        box-sizing: border-box;
      }

      .search-root {
        width: 100%;
        display: flex;
        align-items: center;
        -webkit-box-pack: center;
        justify-content: center;
        box-sizing: border-box;
        padding: 0 14px;
        height: 54px;
        background: var(--uigc-input-background);
        border-style: solid;
        border-radius: var(--uigc-input-border-radius);
        border-width: var(--uigc-input-border-width);
        border-color: var(--uigc-input-border-color);
      }

      .search-root > uigc-icon-magnifier {
        margin-right: 8px;
        width: 22px;
      }

      .search-root:focus-within {
        border-color: var(--uigc-input-border-color__focus);
      }

      .search-root:hover {
        background: var(--uigc-input-background__hover);
        transition: 0.2s ease-in-out;
      }
    `
];
__decorateClass([
  n5({ type: String })
], SearchBar.prototype, "value", 2);
__decorateClass([
  n5({ type: String })
], SearchBar.prototype, "placeholder", 2);
SearchBar = __decorateClass([
  e8("uigc-search-bar")
], SearchBar);

// src/component/Selector.ts
var Selector = class extends UIGCElement {
  constructor() {
    super(...arguments);
    this.item = null;
    this.title = null;
    this.readonly = false;
  }
  onSelectorClick(e10) {
    const options2 = {
      bubbles: true,
      composed: true,
      detail: { item: this.item }
    };
    this.dispatchEvent(new CustomEvent("selector-click", options2));
  }
  render() {
    return x` <div tabindex="0" class="selector-root">
      <button @click=${this.onSelectorClick}>
        <span class="title">${this.title}</span>
        <div>
          <slot></slot>
          <uigc-icon-dropdown alt></uigc-icon-dropdown>
        </div>
      </button>
    </div>`;
  }
};
Selector.styles = [
  UIGCElement.styles,
  i`
      :host {
        border-radius: 12px;
        width: 100%;
      }

      :host(:not([readonly])) .selector-root {
        border-bottom: var(--uigc-field-border-bottom);
      }

      :host(:not([readonly])) .selector-root:focus,
      :host(:not([readonly])) .selector-root:focus-visible,
      :host(:not([readonly])) .selector-root:focus-within,
      :host(:not([readonly])) .selector-root:hover {
        border-bottom: var(--uigc-selector-border-bottom__hover);
        background: var(--uigc-selector-background__hover);
        transition: 0.2s ease-in-out;
      }

      :host([readonly]) button {
        cursor: default;
      }

      button {
        width: 100%;
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        cursor: pointer;
        background: var(--uigc-field-background);
        border-radius: var(--uigc-field-border-radius);
        padding: var(--uigc-field-padding);
        row-gap: var(--uigc-field-row-gap);
      }

      button > div {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        width: 100%;
        align-items: center;
      }

      .title {
        display: flex;
        align-items: center;
        font-weight: var(--uigc-selector--title-font-weight);
        font-size: var(--uigc-field--title-font-size);
        line-height: var(--uigc-field--title-line-height);
        color: var(--uigc-selector--title-color);
        text-transform: var(--uigc-field--title-text-transform);
      }
    `
];
__decorateClass([
  n5({ type: String })
], Selector.prototype, "item", 2);
__decorateClass([
  n5({ type: String })
], Selector.prototype, "title", 2);
__decorateClass([
  n5({ type: Boolean })
], Selector.prototype, "readonly", 2);
Selector = __decorateClass([
  e8("uigc-selector")
], Selector);

// src/component/Skeleton.ts
var Skeleton = class extends UIGCElement {
  constructor() {
    super(...arguments);
    this.width = null;
    this.height = null;
  }
  async firstUpdated() {
    const span = this.shadowRoot.querySelector("span");
    span.style.width = this.width;
    span.style.height = this.height;
  }
  render() {
    return x` <span> </span> `;
  }
};
Skeleton.styles = [
  UIGCElement.styles,
  i`
      :host([circle]) span {
        width: 40px;
        height: 40px;
        border-radius: 50%;
      }

      :host([rectangle]) span {
        border-radius: var(--uigc-skeleton-border-radius);
      }

      :host([progress]) span {
        line-height: 1;
        z-index: 1;
      }

      :host([progress]) span::after {
        content: ' ';
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 100%;
        background-repeat: no-repeat;
        background-image: linear-gradient(
          90deg,
          rgba(var(--rgb-white), 0.12),
          rgba(var(--rgb-white), 0.24),
          rgba(var(--rgb-white), 0.12)
        );
        transform: translateX(-100%);
        animation: progress 1.5s ease-in-out infinite;
        animation-delay: 0.5s;
      }

      :host([pulse]) span {
        animation: pulse 1.5s ease-in-out infinite;
        animation-delay: 0.5s;
      }

      span {
        box-sizing: border-box;
        background-color: rgba(var(--rgb-white), 0.12);
        outline: none;
        overflow: hidden;
        position: relative;
        border-radius: 100px;
        width: 100%;
        height: 20px;
        display: block;
        will-change: transform;
      }

      @keyframes progress {
        100% {
          transform: translateX(100%);
        }
      }

      @keyframes pulse {
        0% {
          opacity: 1;
        }
        50% {
          opacity: 0.4;
        }
        100% {
          opacity: 1;
        }
      }
    `
];
__decorateClass([
  n5({ type: String })
], Skeleton.prototype, "width", 2);
__decorateClass([
  n5({ type: String })
], Skeleton.prototype, "height", 2);
Skeleton = __decorateClass([
  e8("uigc-skeleton")
], Skeleton);

// src/component/Switch.ts
var Switch = class extends UIGCElement {
  constructor() {
    super(...arguments);
    this.checked = false;
    this.highlight = false;
  }
  async updated() {
    const switchRoot = this.shadowRoot.querySelector(".switch-root");
    if (this.checked) {
      switchRoot.removeAttribute("checked");
    } else {
      switchRoot.setAttribute("checked", "");
    }
    if (this.highlight) {
      switchRoot.removeAttribute("highlight");
    } else {
      switchRoot.setAttribute("highlight", "");
    }
  }
  render() {
    return x`
      <div class="switch-root">
        <span class="switch-glow"></span>
        <span class="switch-thumb"></span>
      </div>
    `;
  }
};
Switch.styles = [
  UIGCElement.styles,
  i`
      :host {
        --hue: 0;
        --deg: 0deg;
      }

      .switch-root {
        width: 46px;
        height: 24px;
      }

      .switch-thumb {
        width: 20px;
        height: 20px;
        border-width: 1px;
      }

      .switch-root {
        position: relative;
        border: var(--uigc-switch--root-border);
        border-radius: var(--uigc-switch--root-border-radius);
        background: var(--uigc-switch--root-background);
        cursor: pointer;
      }

      .switch-root:hover > span.switch-thumb {
        border-color: var(--uigc-switch--thumb-border-color__hover);
      }

      .switch-thumb {
        position: absolute;
        border-radius: var(--uigc-switch--root-border-radius);
        top: 1px;
        left: 1px;
        border-color: var(--uigc-switch--thumb-border-color);
        background: var(--uigc-switch--thumb-background);
        border-style: solid;
      }

      :host([checked]) .switch-root {
        background: var(--uigc-switch__checked--root-background);
        border: var(--uigc-switch__checked--root-border);
      }

      :host([checked]) .switch-thumb {
        left: initial;
        right: 1px;
        background: var(--uigc-switch__checked--thumb-background);
        border-color: var(--uigc-switch__checked--thumb-border-color);
      }

      @keyframes rotate {
        100% {
          transform: rotate(1turn);
        }
      }

      .switch-glow {
        display: none;
        width: calc(100% + 2px);
        height: calc(100% + 2px);
      }

      :host([highlight]:not([checked])) .switch-glow {
        display: block;
        position: absolute;
        top: -1px;
        left: -1px;
        overflow: hidden;
        border-radius: var(--uigc-switch--root-border-radius);
        box-shadow: 0px 0px 10px 4px rgba(7, 151, 255, 0.49);
      }

      :host([highlight]:not([checked])) .switch-glow::before {
        content: '';
        position: absolute;
        left: -50%;
        top: -50%;
        width: 200%;
        height: 200%;
        background-color: var(--uigc-switch--root-border);
        background-repeat: no-repeat;
        background-position: 0 0;
        background-image: conic-gradient(transparent, #57b3eb, #70c9ff 80%);
        animation: rotate 3s linear infinite;
      }

      :host([highlight]:not([checked])) .switch-glow::after {
        content: '';
        position: absolute;
        left: 1px;
        top: 1px;
        width: calc(100% - 2px);
        height: calc(100% - 2px);
        background: var(--uigc-switch--root-background);
        border-radius: var(--uigc-switch--root-border-radius);
      }

      :host([disabled]) .switch-root {
        pointer-events: none;
      }

      :host([disabled]) .switch-thumb {
        background: var(--hex-background-gray-800);
      }
    `
];
__decorateClass([
  n5({ type: Boolean, reflect: true })
], Switch.prototype, "checked", 2);
__decorateClass([
  n5({ type: Boolean, reflect: true })
], Switch.prototype, "highlight", 2);
Switch = __decorateClass([
  e8("uigc-switch")
], Switch);

// src/component/Textfield.ts
var Textfield = class extends UIGCElement {
  constructor() {
    super();
    this._inputHandler = null;
    this._imask = null;
    this.id = null;
    this.value = null;
    this.desc = null;
    this.placeholder = null;
    this.error = null;
    this.min = null;
    this.max = null;
    this.number = false;
    this.disabled = false;
    this._inputHandler = r6(this.onInputChange, 300);
  }
  _onInputChange(e10) {
  }
  onInputChange() {
    const unmasked = this._imask.unmaskedValue;
    const masked = this._imask.value;
    const options2 = {
      bubbles: true,
      composed: true,
      detail: { value: unmasked, masked }
    };
    this.dispatchEvent(new CustomEvent("input-change", options2));
  }
  onWrapperClick(e10) {
    this.shadowRoot.getElementById("textField").focus();
  }
  update(changedProperties) {
    if (changedProperties.has("value") && this._imask) {
      if (this.value) {
        this._imask.unmaskedValue = this.value;
      } else {
        this._imask.unmaskedValue = "";
      }
    }
    super.update(changedProperties);
  }
  async firstUpdated() {
    super.firstUpdated();
    const input = this.shadowRoot.getElementById("textField");
    const maskOpts = this.number ? {
      mask: Number,
      min: this.min,
      max: this.max,
      radix: "."
    } : { mask: textMask };
    this._imask = IMask(input, maskOpts);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._imask) {
      this._imask.destroy();
    }
  }
  render() {
    return x`
      <div class="textfield-root" @click="${this.onWrapperClick}}">
        <slot name="inputAdornment"></slot>
        <div class="textfield-wrapper">
          <span class="textfield-field">
            <input
              type="text"
              class="textfield"
              id="textField"
              placeholder=${this.placeholder}
              value=${this.value}
              @input=${(e10) => {
      this._onInputChange(e10);
      this._inputHandler();
    }}
            />
            <slot name="endAdornment"></slot>
          </span>
          ${n9(this.desc, () => x` <span class="desc">${this.desc}</span> `)}
        </div>
      </div>
      <p class="textfield-error">${this.error}</p>
    `;
  }
};
Textfield.styles = [
  UIGCElement.styles,
  i`
      :host {
        width: 100%;
      }

      /* Remove arrows - Chrome, Safari, Edge, Opera */
      input::-webkit-outer-spin-button,
      input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }

      /* Remove arrows - Firefox */
      input[type='number'] {
        -moz-appearance: textfield;
      }

      input:placeholder-shown + .asset-unit {
        color: #c7c7cd;
      }

      /* Placeholder color */
      ::-webkit-input-placeholder {
        color: #c7c7cd;
      }

      ::-moz-placeholder {
        color: #c7c7cd;
      }

      ::-ms-placeholder {
        color: #c7c7cd;
      }

      ::placeholder {
        color: #c7c7cd;
      }

      .textfield-root {
        display: flex;
        flex-direction: row;
        align-items: center;
        height: 54px;
        border-radius: var(--uigc-input-border-radius);
        border-width: var(--uigc-input-border-width);
        border-color: var(--uigc-input-border-color);
      }

      :host([error]) .textfield-root {
        border: var(--uigc-field__error-border);
        border-width: var(--uigc-field__error-border-width);
        outline: var(--uigc-field__error-outline);
        outline-offset: -1px;
        border-bottom: var(--uigc-field__error-border) !important;
      }

      :host([field]) .textfield-root {
        flex-direction: row;
        background: var(--uigc-textfield__field-background);
        border-width: var(--uigc-textfield__field-border-width);
        border-color: var(--uigc-textfield__field-border-color);
        border-style: solid;
        box-sizing: border-box;
        padding: var(--uigc-field-padding);
      }

      :host([disabled]) .textfield-root {
        border-width: 0;
      }

      :host(:not([disabled]):not([field])) .textfield-root {
        padding: var(--uigc-textfield-padding);
        background: var(--uigc-textfield-background);
        border-style: var(--uigc-textfield-border-style);
      }

      :host(:not([disabled]):not([field])) .textfield-root:focus-within {
        border-color: var(--uigc-input-border-color__focus);
      }

      :host(:not([disabled]):not([field])) .textfield-root:hover {
        background: var(--uigc-textfield-background__hover);
      }

      :host([field]:not([disabled])) .textfield-root:focus,
      :host([field]:not([disabled])) .textfield-root:focus-visible,
      :host([field]:not([disabled])) .textfield-root:focus-within,
      :host([field]:not([disabled])) .textfield-root:hover {
        border-color: var(--uigc-textfield__field-border-color__hover);
        background: var(--uigc-textfield__field-background__hover);
        transition: 0.2s ease-in-out;
      }

      :host([error]:not([disabled])) .textfield-root:focus,
      :host([error]:not([disabled])) .textfield-root:focus-visible,
      :host([error]:not([disabled])) .textfield-root:focus-within,
      :host([error]:not([disabled])) .textfield-root:hover {
        background: rgba(255, 75, 75, 0.1);
        transition: 0.2s ease-in-out;
      }

      .textfield-wrapper {
        width: 100%;
      }

      .textfield-field {
        width: 100%;
        display: flex;
        position: relative;
        -webkit-box-align: center;
        align-items: center;
        gap: 4px;
      }

      .textfield-error {
        color: var(--uigc-field__error-color);
        line-height: 16px;
        margin-top: 2px;
        font-size: 12px;
      }

      .textfield {
        width: 100%;
        background: none;
        border: none;
        color: var(--hex-white);
        font-size: var(--uigc-textfield-font-size__sm);
        line-height: 24px;
        text-align: right;
        font-weight: 700;
        padding: 0px;
      }

      @media (min-width: 520px) {
        .textfield {
          font-size: var(--uigc-textfield-font-size);
        }
      }

      .desc {
        display: flex;
        flex-direction: row-reverse;
        font-size: 10px;
        line-height: 14px;
        color: var(--hex-neutral-gray-400);
        font-weight: 600;
      }
    `
];
__decorateClass([
  n5({ type: String })
], Textfield.prototype, "id", 2);
__decorateClass([
  n5({ type: String })
], Textfield.prototype, "value", 2);
__decorateClass([
  n5({ type: String })
], Textfield.prototype, "desc", 2);
__decorateClass([
  n5({ type: String })
], Textfield.prototype, "placeholder", 2);
__decorateClass([
  n5({ type: String })
], Textfield.prototype, "error", 2);
__decorateClass([
  n5({ type: Number })
], Textfield.prototype, "min", 2);
__decorateClass([
  n5({ type: Number })
], Textfield.prototype, "max", 2);
__decorateClass([
  n5({ type: Boolean })
], Textfield.prototype, "number", 2);
__decorateClass([
  n5({ type: Boolean })
], Textfield.prototype, "disabled", 2);
Textfield = __decorateClass([
  e8("uigc-textfield")
], Textfield);

// src/component/Toast.ts
var Toast = class extends CloseableElement {
  onClose(e10) {
    e10.stopPropagation();
    const applyDefault = this.dispatchEvent(
      new CustomEvent("toast-close", {
        composed: true,
        bubbles: true,
        cancelable: true,
        detail: { id: this.id }
      })
    );
    if (applyDefault) {
      this.close();
    }
  }
  async firstUpdated() {
    const slot = this.shadowRoot.querySelector("slot");
    const slt = slot.assignedElements();
    slt.forEach((item) => {
      const variant = item.getAttribute("variant");
      const prog = this.shadowRoot.querySelector("uigc-progress");
      if (prog) {
        prog.setAttribute("variant", variant);
      }
    });
  }
  render() {
    return x`
      <div class="root">
        <div class="content" role="alert">
          <slot></slot>
        </div>
        ${n9(this.timeout, () => x` <uigc-progress .duration=${this.timeout}></uigc-progress> `)}
      </div>
      <button class="close" @click=${this.onClose}>
        <uigc-icon-close></uigc-icon-close>
      </button>
    `;
  }
};
Toast.styles = [
  UIGCElement.styles,
  i`
      :host {
        position: fixed;
        z-index: 1400;
        bottom: 8px;
        right: 8px;
        left: 8px;
      }

      @media (min-width: 768px) {
        :host {
          bottom: 20px;
          right: 20px;
          left: auto;
        }
      }

      :host(:not([open])) {
        display: none;
      }

      :host .root {
        overflow: hidden;
        position: relative;
        height: 60px;
        display: flex;
        flex-direction: row;
        align-items: center;
        box-sizing: border-box;
        border-radius: var(--uigc-toast-border-radius);
        background: var(--uigc-toast-background);
        color: white;
        min-width: 130px;
      }

      .content {
        width: 100%;
      }

      ::slotted(*) {
        padding: 0 14px;
        height: 60px;
      }

      .close {
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        top: -8px;
        right: -8px;
        width: 24px;
        height: 24px;
        border-radius: var(--uigc-toast--close-border-radius);
        background: var(--uigc-toast--close-background);
        border: var(--uigc-toast--close-border);
      }

      .close uigc-icon-close {
        width: 7px;
      }

      .close:hover {
        background: var(--uigc-toast--close-background__hover);
        transition: 0.2s ease-in-out;
        cursor: pointer;
      }

      uigc-progress {
        position: absolute;
        width: 100%;
        bottom: 0;
      }
    `
];
Toast = __decorateClass([
  e8("uigc-toast")
], Toast);

// src/component/ToggleButton.ts
var ToggleButton = class extends UIGCElement {
  constructor() {
    super(...arguments);
    this.value = null;
  }
  onClick(e10) {
    const options2 = {
      bubbles: true,
      composed: true,
      detail: { value: this.value }
    };
    this.dispatchEvent(new CustomEvent("toggle-button-click", options2));
  }
  render() {
    return x`
      <button class="toggle-button-root" @click=${this.onClick} value=${this.value}>
        <slot></slot>
      </button>
    `;
  }
};
ToggleButton.styles = [
  UIGCElement.styles,
  i`
      :host {
        font-family: var(--uigc-app-font-secondary), sans-serif;
      }

      :host([tab]) {
        width: 100%;
        font-family: var(--uigc-app-font-primary), sans-serif;
      }

      :host([tab]) .toggle-button-root {
        width: 100%;
        height: 30px;
      }

      :host([size='small']) .toggle-button-root {
        width: 30px;
        height: 30px;
      }

      :host([size='medium']) .toggle-button-root {
        width: 40px;
        height: 40px;
      }

      :host(:not([size]):not([tab])) .toggle-button-root,
      :host([size='large']) .toggle-button-root {
        width: 54px;
        height: 54px;
      }

      .toggle-button-root {
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: var(--uigc-toggle-button--root-border-radius);
        transition: all 0.15s ease-in-out;
        background: var(--uigc-toggle-button--root-background);
        color: var(--hex-white);
        font-weight: 700;
        cursor: pointer;
      }

      :host([tab]) .toggle-button-root {
        background: transparent;
      }

      :host([tab]) .toggle-button-root:hover {
        background: var(--uigc-toggle-button--root-background__hover);
      }

      .toggle-button-root:hover {
        background: var(--uigc-toggle-button--root-background__hover);
        transition: 0.2s ease-in-out;
      }

      :host([aria-pressed='true']) .toggle-button-root {
        background: var(--uigc-toggle-button__selected--root-background);
        color: var(--uigc-toggle-button__selected--root-color);
      }

      :host([aria-pressed='true'][tab]) .toggle-button-root {
        background: var( --uigc-toggle-button__selected--tab-background);
        color: var(--uigc-toggle-button__selected--tab-color);
        border-radius: 66px;
      }
    `
];
__decorateClass([
  n5({ type: String })
], ToggleButton.prototype, "value", 2);
ToggleButton = __decorateClass([
  e8("uigc-toggle-button")
], ToggleButton);

// src/component/ToggleButtonGroup.ts
var ToggleButtonGroup = class extends UIGCElement {
  constructor() {
    super(...arguments);
    this.value = null;
    this.label = null;
  }
  async updated() {
    const slot = this.shadowRoot.querySelector("slot");
    const slt = slot.assignedElements();
    slt.forEach((item) => {
      const value = item.getAttribute("value");
      if (value == this.value) {
        item.setAttribute("aria-pressed", "true");
      } else {
        item.setAttribute("aria-pressed", "false");
      }
    });
  }
  render() {
    return x`
      <div class="toggle-group-root">
        ${n9(this.label, () => x` <span class="label">${this.label}</span> `)}
        <div>
          <slot></slot>
        </div>
      </div>
    `;
  }
};
ToggleButtonGroup.styles = [
  UIGCElement.styles,
  i`
      :host(:not([variant])) .toggle-group-root div {
        gap: 8px;
        padding: 8px 10px;
      }

      :host([variant='dense']) .toggle-group-root div {
        gap: 4px;
        padding: 4px 5px;
      }

      .toggle-group-root div {
        display: flex;
      }

      .toggle-group-root {
        background: var(--uigc-toggle-button-group--root-background);
        border-radius: var(--uigc-toggle-button-group--root-border-radius);
        display: flex;
        flex-direction: column;
      }

      .label {
        color: #878c9e;
        font-size: 13px;
        font-style: normal;
        font-weight: 500;
        line-height: 100%;
        text-transform: uppercase;
        padding: 8px 0 0 10px;
      }
    `
];
__decorateClass([
  n5({ type: String })
], ToggleButtonGroup.prototype, "value", 2);
__decorateClass([
  n5({ type: String })
], ToggleButtonGroup.prototype, "label", 2);
ToggleButtonGroup = __decorateClass([
  e8("uigc-toggle-button-group")
], ToggleButtonGroup);

// src/component/Typography.ts
var Typography = class extends UIGCElement {
  render() {
    return x` <slot> </slot> `;
  }
};
Typography.styles = [
  UIGCElement.styles,
  i`
      :host([variant='title']) {
        font-family: var(--uigc-app-font-secondary);
        font-weight: var(--uigc-typography__title-font-weight);
        font-size: var(--uigc-typography__title-font-size);
        background: var(--uigc-typography__title-background);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      :host([variant='title'][error]) {
        background: var(--uigc-typography__title-error-background);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      :host([variant='title'][gradient]) {
        background: var(--uigc-typography__title-gradient-background);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      :host([variant='section']) {
        font-family: var(--uigc-app-font-secondary);
        font-weight: var(--uigc-typography__section-font-weight);
        font-size: var(--uigc-typography__section-font-size);
        line-height: var(--uigc-typography__section-line-height);
        color: var(--uigc-typography__section-color);
      }

      :host([variant='subsection']) {
        font-weight: var(--uigc-typography__subsection-font-weight);
        font-size: var(--uigc-typography__subsection-font-size);
        line-height: var(--uigc-typography__subsection-line-height);
        color: var(--uigc-typography__subsection-color);
      }
    `
];
Typography = __decorateClass([
  e8("uigc-typography")
], Typography);

// src/component/icons/Back.ts
var BackIcon = class extends BaseIcon {
  render() {
    return x`
      <svg width="7" height="13" viewBox="0 0 7 13" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 1L1 6.5L6 12" stroke="#E5ECF1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    `;
  }
};
BackIcon = __decorateClass([
  e8("uigc-icon-back")
], BackIcon);

// src/component/icons/Chart.ts
var ChartIcon = class extends BaseIcon {
  bsxTemplate() {
    return x`
      <svg bsx xmlns="http://www.w3.org/2000/svg" width="15" height="16" viewBox="0 0 15 16" fill="none">
        <script xmlns="" />
        <script xmlns="" />
        <rect x="6" width="3" height="16" rx="1.5" fill="#b3ff8f" />
        <rect y="8" width="3" height="8" rx="1.5" fill="rgba(0, 138, 105, 0.7)" />
        <rect x="12" y="4" width="3" height="12" rx="1.5" fill="rgb(0, 138, 105)" />
      </svg>
    `;
  }
  hdxTemplate() {
    return x`
      <svg hdx xmlns="http://www.w3.org/2000/svg" width="15" height="16" viewBox="0 0 15 16" fill="none">
        <script xmlns="" />
        <script xmlns="" />
        <rect x="6" width="3" height="16" rx="1.5" fill="#FC408C" />
        <rect y="8" width="3" height="8" rx="1.5" fill="#EFB0FF" />
        <rect x="12" y="4" width="3" height="12" rx="1.5" fill="#EFB0FF" />
      </svg>
    `;
  }
  render() {
    return x` ${this.bsxTemplate()} ${this.hdxTemplate()} `;
  }
};
ChartIcon = __decorateClass([
  e8("uigc-icon-chart")
], ChartIcon);

// src/component/icons/ChevronRight.ts
var ChevronRightIcon = class extends BaseIcon {
  render() {
    return x`
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M11 15.998L14 11.998L11 7.99805"
          stroke="#BDCCD4"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    `;
  }
};
ChevronRightIcon = __decorateClass([
  e8("uigc-icon-chevron-right")
], ChevronRightIcon);

// src/component/icons/ErrorAlt.ts
var ErrorIconAlt = class extends BaseIcon {
  bsxTemplate() {
    return x`
      <svg bsx xmlns="http://www.w3.org/2000/svg" width="117" height="116" viewBox="0 0 117 116" fill="none">
        <circle cx="58.5" cy="58" r="58" fill="url(#paint0_linear_14501_5112)" fill-opacity="0.4" />
        <path
          d="M47.0625 69.6684L52.3158 64.415L70.3776 46.5294"
          stroke="url(#paint1_linear_14501_5112)"
          stroke-width="7"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M47.0625 46.5294L52.3158 51.7827L70.3776 69.6683"
          stroke="url(#paint2_linear_14501_5112)"
          stroke-width="7"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <defs>
          <linearGradient
            id="paint0_linear_14501_5112"
            x1="58.5"
            y1="-56.0161"
            x2="58.5"
            y2="112"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0.0560296" stop-color="#FF4F4F" stop-opacity="0" />
            <stop offset="0.35885" stop-color="#FF4F4F" stop-opacity="0.29" />
            <stop offset="0.438769" stop-color="#FF6868" stop-opacity="0.27" />
            <stop offset="1" stop-color="#FF6868" />
          </linearGradient>
          <linearGradient
            id="paint1_linear_14501_5112"
            x1="44.5217"
            y1="35.9098"
            x2="71.4619"
            y2="35.9098"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#FF8A8A" />
            <stop offset="1" stop-color="#DA5D5D" />
          </linearGradient>
          <linearGradient
            id="paint2_linear_14501_5112"
            x1="44.5217"
            y1="80.2879"
            x2="71.4619"
            y2="80.2879"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#FF8A8A" />
            <stop offset="1" stop-color="#DA5D5D" />
          </linearGradient>
        </defs>
      </svg>
    `;
  }
  hdxTemplate() {
    return x` <svg hdx xmlns="http://www.w3.org/2000/svg" width="117" height="117" viewBox="0 0 117 117" fill="none">
      <rect width="8.25" height="8.25" transform="matrix(1 0 0 -1 42.5 16.9341)" fill="#EF0303" fill-opacity="0.25" />
      <rect width="8.25" height="8.25" transform="matrix(1 0 0 -1 50.75 16.9341)" fill="#EF0303" fill-opacity="0.25" />
      <rect width="8.25" height="8.25" transform="matrix(1 0 0 -1 59 16.9341)" fill="#EF0303" fill-opacity="0.25" />
      <rect width="8.25" height="8.25" transform="matrix(1 0 0 -1 67.25 16.9341)" fill="#EF0303" fill-opacity="0.25" />
      <rect width="8.25" height="8.25" transform="matrix(1 0 0 -1 26 25.1841)" fill="#EF0303" fill-opacity="0.25" />
      <rect width="8.25" height="8.25" transform="matrix(1 0 0 -1 34.25 25.1841)" fill="#EF0303" fill-opacity="0.25" />
      <rect width="8.25" height="8.25" transform="matrix(1 0 0 -1 42.5 25.1841)" fill="#EF0303" fill-opacity="0.25" />
      <rect width="8.25" height="8.25" transform="matrix(1 0 0 -1 50.75 25.1841)" fill="#EF0303" fill-opacity="0.25" />
      <rect width="8.25" height="8.25" transform="matrix(1 0 0 -1 59 25.1841)" fill="#EF0303" fill-opacity="0.25" />
      <rect width="8.25" height="8.25" transform="matrix(1 0 0 -1 67.25 25.1841)" fill="#EF0303" fill-opacity="0.25" />
      <rect width="8.25" height="8.25" transform="matrix(1 0 0 -1 75.5 25.1841)" fill="#EF0303" fill-opacity="0.25" />
      <rect width="8.25" height="8.25" transform="matrix(1 0 0 -1 83.75 25.1841)" fill="#EF0303" fill-opacity="0.25" />
      <rect width="8.25" height="8.25" transform="matrix(1 0 0 -1 17.75 33.4341)" fill="#EF0303" fill-opacity="0.25" />
      <rect width="8.25" height="8.25" transform="matrix(1 0 0 -1 26 33.4341)" fill="#EF0303" fill-opacity="0.25" />
      <rect width="8.25" height="8.25" transform="matrix(1 0 0 -1 34.25 33.4341)" fill="#EF0303" fill-opacity="0.25" />
      <rect width="8.25" height="8.25" transform="matrix(1 0 0 -1 42.5 33.4341)" fill="#EF0303" fill-opacity="0.25" />
      <rect width="8.25" height="8.25" transform="matrix(1 0 0 -1 50.75 33.4341)" fill="#EF0303" fill-opacity="0.25" />
      <rect width="8.25" height="8.25" transform="matrix(1 0 0 -1 59 33.4341)" fill="#EF0303" fill-opacity="0.25" />
      <rect width="8.25" height="8.25" transform="matrix(1 0 0 -1 67.25 33.4341)" fill="#EF0303" fill-opacity="0.25" />
      <rect width="8.25" height="8.25" transform="matrix(1 0 0 -1 75.5 33.4341)" fill="#EF0303" fill-opacity="0.25" />
      <rect width="8.25" height="8.25" transform="matrix(1 0 0 -1 83.75 33.4341)" fill="#EF0303" fill-opacity="0.25" />
      <rect width="8.25" height="8.25" transform="matrix(1 0 0 -1 92 33.4341)" fill="#EF0303" fill-opacity="0.25" />
      <rect width="8.25" height="8.25" transform="matrix(1 0 0 -1 13.625 41.6841)" fill="#EF0303" fill-opacity="0.25" />
      <rect width="8.25" height="8.25" transform="matrix(1 0 0 -1 21.875 41.6841)" fill="#EF0303" fill-opacity="0.25" />
      <rect width="8.25" height="8.25" transform="matrix(1 0 0 -1 30.125 41.6841)" fill="#EF0303" fill-opacity="0.25" />
      <rect width="8.25" height="8.25" transform="matrix(1 0 0 -1 38.375 41.6841)" fill="#EF0303" fill-opacity="0.25" />
      <rect width="8.25" height="8.25" transform="matrix(1 0 0 -1 46.625 41.6841)" fill="#EF0303" fill-opacity="0.25" />
      <rect width="8.25" height="8.25" transform="matrix(1 0 0 -1 54.875 41.6841)" fill="#EF0303" fill-opacity="0.25" />
      <rect width="8.25" height="8.25" transform="matrix(1 0 0 -1 63.125 41.6841)" fill="#EF0303" fill-opacity="0.25" />
      <rect width="8.25" height="8.25" transform="matrix(1 0 0 -1 71.375 41.6841)" fill="#EF0303" fill-opacity="0.25" />
      <rect width="8.25" height="8.25" transform="matrix(1 0 0 -1 79.625 41.6841)" fill="#EF0303" fill-opacity="0.25" />
      <rect width="8.25" height="8.25" transform="matrix(1 0 0 -1 87.875 41.6841)" fill="#EF0303" fill-opacity="0.25" />
      <rect width="8.25" height="8.25" transform="matrix(1 0 0 -1 96.125 41.6841)" fill="#EF0303" fill-opacity="0.25" />
      <rect width="8.25" height="8.25" transform="matrix(1 0 0 -1 9.5 49.9341)" fill="#EF0303" fill-opacity="0.25" />
      <rect width="8.25" height="8.25" transform="matrix(1 0 0 -1 17.75 49.9341)" fill="#EF0303" fill-opacity="0.25" />
      <rect width="8.25" height="8.25" transform="matrix(1 0 0 -1 26 49.9341)" fill="#EF0303" fill-opacity="0.25" />
      <rect width="8.25" height="8.25" transform="matrix(1 0 0 -1 34.25 49.9341)" fill="#EF0303" fill-opacity="0.25" />
      <rect width="8.25" height="8.25" transform="matrix(1 0 0 -1 42.5 49.9341)" fill="#EF0303" fill-opacity="0.25" />
      <rect width="8.25" height="8.25" transform="matrix(1 0 0 -1 50.75 49.9341)" fill="#EF0303" fill-opacity="0.25" />
      <rect width="8.25" height="8.25" transform="matrix(1 0 0 -1 59 49.9341)" fill="#EF0303" fill-opacity="0.25" />
      <rect width="8.25" height="8.25" transform="matrix(1 0 0 -1 67.25 49.9341)" fill="#EF0303" fill-opacity="0.25" />
      <rect width="8.25" height="8.25" transform="matrix(1 0 0 -1 75.5 49.9341)" fill="#EF0303" fill-opacity="0.25" />
      <rect width="8.25" height="8.25" transform="matrix(1 0 0 -1 83.75 49.9341)" fill="#EF0303" fill-opacity="0.25" />
      <rect width="8.25" height="8.25" transform="matrix(1 0 0 -1 92 49.9341)" fill="#EF0303" fill-opacity="0.25" />
      <rect width="8.25" height="8.25" transform="matrix(1 0 0 -1 100.25 49.9341)" fill="#EF0303" fill-opacity="0.25" />
      <rect x="9.5" y="49.9341" width="8.25" height="8.25" fill="#EF0303" fill-opacity="0.25" />
      <rect x="17.75" y="49.9341" width="8.25" height="8.25" fill="#EF0303" fill-opacity="0.25" />
      <rect x="26" y="49.9341" width="8.25" height="8.25" fill="#EF0303" fill-opacity="0.25" />
      <rect x="34.25" y="49.9341" width="8.25" height="8.25" fill="#EF0303" fill-opacity="0.25" />
      <rect x="42.5" y="49.9341" width="8.25" height="8.25" fill="#EF0303" fill-opacity="0.25" />
      <rect x="50.75" y="49.9341" width="8.25" height="8.25" fill="#EF0303" fill-opacity="0.25" />
      <rect x="59" y="49.9341" width="8.25" height="8.25" fill="#EF0303" fill-opacity="0.25" />
      <rect x="67.25" y="49.9341" width="8.25" height="8.25" fill="#EF0303" fill-opacity="0.25" />
      <rect x="75.5" y="49.9341" width="8.25" height="8.25" fill="#EF0303" fill-opacity="0.25" />
      <rect x="83.75" y="49.9341" width="8.25" height="8.25" fill="#EF0303" fill-opacity="0.25" />
      <rect x="92" y="49.9341" width="8.25" height="8.25" fill="#EF0303" fill-opacity="0.25" />
      <rect x="100.25" y="49.9341" width="8.25" height="8.25" fill="#EF0303" fill-opacity="0.25" />
      <rect x="9.5" y="58.1841" width="8.25" height="8.25" fill="#EF0303" fill-opacity="0.25" />
      <rect x="17.75" y="58.1841" width="8.25" height="8.25" fill="#EF0303" fill-opacity="0.25" />
      <rect x="26" y="58.1841" width="8.25" height="8.25" fill="#EF0303" fill-opacity="0.25" />
      <rect x="34.25" y="58.1841" width="8.25" height="8.25" fill="#EF0303" fill-opacity="0.25" />
      <rect x="42.5" y="58.1841" width="8.25" height="8.25" fill="#EF0303" fill-opacity="0.25" />
      <rect x="50.75" y="58.1841" width="8.25" height="8.25" fill="#EF0303" fill-opacity="0.25" />
      <rect x="59" y="58.1841" width="8.25" height="8.25" fill="#EF0303" fill-opacity="0.25" />
      <rect x="67.25" y="58.1841" width="8.25" height="8.25" fill="#EF0303" fill-opacity="0.25" />
      <rect x="75.5" y="58.1841" width="8.25" height="8.25" fill="#EF0303" fill-opacity="0.25" />
      <rect x="83.75" y="58.1841" width="8.25" height="8.25" fill="#EF0303" fill-opacity="0.25" />
      <rect x="92" y="58.1841" width="8.25" height="8.25" fill="#EF0303" fill-opacity="0.25" />
      <rect x="100.25" y="58.1841" width="8.25" height="8.25" fill="#EF0303" fill-opacity="0.25" />
      <rect x="9.5" y="66.4341" width="8.25" height="8.25" fill="#EF0303" fill-opacity="0.25" />
      <rect x="17.75" y="66.4341" width="8.25" height="8.25" fill="#EF0303" fill-opacity="0.25" />
      <rect x="26" y="66.4341" width="8.25" height="8.25" fill="#EF0303" fill-opacity="0.25" />
      <rect x="34.25" y="66.4341" width="8.25" height="8.25" fill="#EF0303" fill-opacity="0.25" />
      <rect x="42.5" y="66.4341" width="8.25" height="8.25" fill="#EF0303" fill-opacity="0.25" />
      <rect x="50.75" y="66.4341" width="8.25" height="8.25" fill="#EF0303" fill-opacity="0.25" />
      <rect x="59" y="66.4341" width="8.25" height="8.25" fill="#EF0303" fill-opacity="0.25" />
      <rect x="67.25" y="66.4341" width="8.25" height="8.25" fill="#EF0303" fill-opacity="0.25" />
      <rect x="75.5" y="66.4341" width="8.25" height="8.25" fill="#EF0303" fill-opacity="0.25" />
      <rect x="83.75" y="66.4341" width="8.25" height="8.25" fill="#EF0303" fill-opacity="0.25" />
      <rect x="92" y="66.4341" width="8.25" height="8.25" fill="#EF0303" fill-opacity="0.25" />
      <rect x="100.25" y="66.4341" width="8.25" height="8.25" fill="#EF0303" fill-opacity="0.25" />
      <rect x="13.625" y="74.6841" width="8.25" height="8.25" fill="#EF0303" fill-opacity="0.25" />
      <rect x="21.875" y="74.6841" width="8.25" height="8.25" fill="#EF0303" fill-opacity="0.25" />
      <rect x="30.125" y="74.6841" width="8.25" height="8.25" fill="#EF0303" fill-opacity="0.25" />
      <rect x="38.375" y="74.6841" width="8.25" height="8.25" fill="#EF0303" fill-opacity="0.25" />
      <rect x="46.625" y="74.6841" width="8.25" height="8.25" fill="#EF0303" fill-opacity="0.25" />
      <rect x="54.875" y="74.6841" width="8.25" height="8.25" fill="#EF0303" fill-opacity="0.25" />
      <rect x="63.125" y="74.6841" width="8.25" height="8.25" fill="#EF0303" fill-opacity="0.25" />
      <rect x="71.375" y="74.6841" width="8.25" height="8.25" fill="#EF0303" fill-opacity="0.25" />
      <rect x="79.625" y="74.6841" width="8.25" height="8.25" fill="#EF0303" fill-opacity="0.25" />
      <rect x="87.875" y="74.6841" width="8.25" height="8.25" fill="#EF0303" fill-opacity="0.25" />
      <rect x="96.125" y="74.6841" width="8.25" height="8.25" fill="#EF0303" fill-opacity="0.25" />
      <rect x="17.75" y="82.9341" width="8.25" height="8.25" fill="#EF0303" fill-opacity="0.25" />
      <rect x="26" y="82.9341" width="8.25" height="8.25" fill="#EF0303" fill-opacity="0.25" />
      <rect x="34.25" y="82.9341" width="8.25" height="8.25" fill="#EF0303" fill-opacity="0.25" />
      <rect x="42.5" y="82.9341" width="8.25" height="8.25" fill="#EF0303" fill-opacity="0.25" />
      <rect x="50.75" y="82.9341" width="8.25" height="8.25" fill="#EF0303" fill-opacity="0.25" />
      <rect x="59" y="82.9341" width="8.25" height="8.25" fill="#EF0303" fill-opacity="0.25" />
      <rect x="67.25" y="82.9341" width="8.25" height="8.25" fill="#EF0303" fill-opacity="0.25" />
      <rect x="75.5" y="82.9341" width="8.25" height="8.25" fill="#EF0303" fill-opacity="0.25" />
      <rect x="83.75" y="82.9341" width="8.25" height="8.25" fill="#EF0303" fill-opacity="0.25" />
      <rect x="92" y="82.9341" width="8.25" height="8.25" fill="#EF0303" fill-opacity="0.25" />
      <rect x="26" y="91.1841" width="8.25" height="8.25" fill="#EF0303" fill-opacity="0.25" />
      <rect x="34.25" y="91.1841" width="8.25" height="8.25" fill="#EF0303" fill-opacity="0.25" />
      <rect x="42.5" y="91.1841" width="8.25" height="8.25" fill="#EF0303" fill-opacity="0.25" />
      <rect x="50.75" y="91.1841" width="8.25" height="8.25" fill="#EF0303" fill-opacity="0.25" />
      <rect x="59" y="91.1841" width="8.25" height="8.25" fill="#EF0303" fill-opacity="0.25" />
      <rect x="67.25" y="91.1841" width="8.25" height="8.25" fill="#EF0303" fill-opacity="0.25" />
      <rect x="75.5" y="91.1841" width="8.25" height="8.25" fill="#EF0303" fill-opacity="0.25" />
      <rect x="83.75" y="91.1841" width="8.25" height="8.25" fill="#EF0303" fill-opacity="0.25" />
      <rect x="42.5" y="99.4341" width="8.25" height="8.25" fill="#EF0303" fill-opacity="0.25" />
      <rect x="50.75" y="99.4341" width="8.25" height="8.25" fill="#EF0303" fill-opacity="0.25" />
      <rect x="59" y="99.4341" width="8.25" height="8.25" fill="#EF0303" fill-opacity="0.25" />
      <rect x="67.25" y="99.4341" width="8.25" height="8.25" fill="#EF0303" fill-opacity="0.25" />
      <rect x="45.3408" y="44.0879" width="5.7203" height="5.7203" fill="#FF4B4B" />
      <rect x="51.0391" y="49.8085" width="5.7203" height="5.7203" fill="#FF4B4B" />
      <rect x="56.793" y="55.5292" width="5.7203" height="5.7203" fill="#FF4B4B" />
      <rect x="62.4902" y="61.2481" width="5.7203" height="5.7203" fill="#FF4B4B" />
      <rect x="68.2441" y="66.9687" width="5.7203" height="5.7203" fill="#FF4B4B" />
      <rect
        x="73.9424"
        y="44.0879"
        width="5.7203"
        height="5.7203"
        transform="rotate(90 73.9424 44.0879)"
        fill="#FF4B4B"
      />
      <rect
        x="68.2441"
        y="49.8085"
        width="5.7203"
        height="5.7203"
        transform="rotate(90 68.2441 49.8085)"
        fill="#FF4B4B"
      />
      <rect
        x="62.4902"
        y="55.5292"
        width="5.7203"
        height="5.7203"
        transform="rotate(90 62.4902 55.5292)"
        fill="#FF4B4B"
      />
      <rect
        x="56.793"
        y="61.2481"
        width="5.7203"
        height="5.7203"
        transform="rotate(90 56.793 61.2481)"
        fill="#FF4B4B"
      />
      <rect
        x="51.0391"
        y="66.9687"
        width="5.7203"
        height="5.7203"
        transform="rotate(90 51.0391 66.9687)"
        fill="#FF4B4B"
      />
    </svg>`;
  }
  render() {
    return x` ${this.bsxTemplate()} ${this.hdxTemplate()} `;
  }
};
ErrorIconAlt = __decorateClass([
  e8("uigc-icon-error-alt")
], ErrorIconAlt);

// src/component/icons/Progress.ts
var ProgressIcon = class extends BaseIcon {
  render() {
    return x`
      <svg class="progress" xmlns="http://www.w3.org/2000/svg" width="29" height="29" viewBox="0 0 29 29" fill="none">
        <path
          d="M20.6052 23.6752C18.9116 24.771 16.9584 25.3994 14.9436 25.4967C12.9288 25.594 10.9242 25.1567 9.13292 24.2292C7.34169 23.3016 5.82763 21.9169 4.74431 20.2153C3.661 18.5138 3.04697 16.556 2.96452 14.5405C2.88206 12.5251 3.3341 10.5237 4.2748 8.73932C5.21549 6.95496 6.61137 5.45113 8.32084 4.38037C10.0303 3.30961 11.9926 2.71001 14.0086 2.64239C16.0246 2.57477 18.0226 3.04153 19.8 3.99533"
          stroke="url(#paint0_angular_13228_4479)"
          stroke-width="3.6551"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <defs>
          <radialGradient
            id="paint0_angular_13228_4479"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(13.4389 12.5377) rotate(99.0718) scale(13.1411)"
          >
            <stop offset="0.105163" stop-color="#F8C35D" />
            <stop offset="0.150751" stop-color="#FCAE33" />
            <stop offset="0.41257" stop-color="#54EF9F" />
            <stop offset="0.622807" stop-color="#54EF9F" />
            <stop offset="0.835374" stop-color="#686876" stop-opacity="0" />
            <stop offset="0.909407" stop-color="#FFB571" stop-opacity="0" />
          </radialGradient>
        </defs>
      </svg>
    `;
  }
};
ProgressIcon.styles = [
  i`
      .progress {
        display: inline-block;
        color: var(--hex-primary-300);
        -webkit-animation: animation-rotate 1.4s linear infinite;
        animation: animation-rotate 1.4s linear infinite;
      }

      @keyframes animation-rotate {
        0% {
          -webkit-transform: rotate(0deg);
          -moz-transform: rotate(0deg);
          -ms-transform: rotate(0deg);
          transform: rotate(0deg);
        }
        100% {
          -webkit-transform: rotate(360deg);
          -moz-transform: rotate(360deg);
          -ms-transform: rotate(360deg);
          transform: rotate(360deg);
        }
      }
    `
];
ProgressIcon = __decorateClass([
  e8("uigc-icon-progress")
], ProgressIcon);

// src/component/icons/Route.ts
var RouteIcon = class extends BaseIcon {
  bsxTemplate() {
    return x`<svg bsx width="22" height="14" viewBox="0 0 22 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <mask id="path-1-inside-1_11726_2306" fill="white">
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M16.4476 0.471447C16.7395 0.177576 17.2144 0.175987 17.5083 0.467898L20.5286 3.46802L21.0642 4.00012L20.5286 4.53223L17.5083 7.53235C17.2144 7.82426 16.7395 7.82267 16.4476 7.5288C16.1557 7.23493 16.1573 6.76006 16.4512 6.46815L18.188 4.74295L15.0654 4.73057L13.5841 5.33827C11.8062 6.06767 10.4086 7.41481 9.59828 9.07121C10.1523 9.53074 10.5051 10.2243 10.5051 11.0003C10.5051 12.3839 9.38346 13.5056 7.99986 13.5056C6.61626 13.5056 5.49463 12.3839 5.49463 11.0003C5.49463 9.61675 6.61626 8.49512 7.99986 8.49512C8.06951 8.49512 8.1385 8.49796 8.20671 8.50354C8.93329 6.9759 10.0753 5.66253 11.521 4.72998H5.4225C5.10924 5.77105 4.14321 6.52941 3.00006 6.52941C1.60313 6.52941 0.470703 5.39698 0.470703 4.00006C0.470703 2.60313 1.60313 1.4707 3.00006 1.4707C4.12846 1.4707 5.08428 2.20962 5.41005 3.22998H14.9189H14.9219L18.1734 3.24288L16.4512 1.5321C16.1573 1.24019 16.1557 0.765319 16.4476 0.471447Z"
        />
      </mask>
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M16.4476 0.471447C16.7395 0.177576 17.2144 0.175987 17.5083 0.467898L20.5286 3.46802L21.0642 4.00012L20.5286 4.53223L17.5083 7.53235C17.2144 7.82426 16.7395 7.82267 16.4476 7.5288C16.1557 7.23493 16.1573 6.76006 16.4512 6.46815L18.188 4.74295L15.0654 4.73057L13.5841 5.33827C11.8062 6.06767 10.4086 7.41481 9.59828 9.07121C10.1523 9.53074 10.5051 10.2243 10.5051 11.0003C10.5051 12.3839 9.38346 13.5056 7.99986 13.5056C6.61626 13.5056 5.49463 12.3839 5.49463 11.0003C5.49463 9.61675 6.61626 8.49512 7.99986 8.49512C8.06951 8.49512 8.1385 8.49796 8.20671 8.50354C8.93329 6.9759 10.0753 5.66253 11.521 4.72998H5.4225C5.10924 5.77105 4.14321 6.52941 3.00006 6.52941C1.60313 6.52941 0.470703 5.39698 0.470703 4.00006C0.470703 2.60313 1.60313 1.4707 3.00006 1.4707C4.12846 1.4707 5.08428 2.20962 5.41005 3.22998H14.9189H14.9219L18.1734 3.24288L16.4512 1.5321C16.1573 1.24019 16.1557 0.765319 16.4476 0.471447Z"
        fill="#211F24"
      />
      <path
        d="M17.5083 0.467898L16.4512 1.5321L16.4512 1.5321L17.5083 0.467898ZM16.4476 0.471447L15.3834 -0.585657V-0.585657L16.4476 0.471447ZM20.5286 3.46802L21.5857 2.40382V2.40382L20.5286 3.46802ZM21.0642 4.00012L22.1213 5.06433L23.1927 4.00012L22.1213 2.93592L21.0642 4.00012ZM20.5286 4.53223L21.5857 5.59643V5.59643L20.5286 4.53223ZM17.5083 7.53235L16.4512 6.46815L16.4512 6.46815L17.5083 7.53235ZM16.4476 7.5288L17.5118 6.4717V6.4717L16.4476 7.5288ZM16.4512 6.46815L15.3941 5.40394L15.3941 5.40395L16.4512 6.46815ZM18.188 4.74295L19.2451 5.80715L21.812 3.2573L18.1939 3.24296L18.188 4.74295ZM15.0654 4.73057L15.0713 3.23058L14.7725 3.22939L14.496 3.34281L15.0654 4.73057ZM13.5841 5.33827L13.0147 3.95052V3.95052L13.5841 5.33827ZM9.59828 9.07121L8.25087 8.41205L7.73223 9.47222L8.64062 10.2257L9.59828 9.07121ZM8.20671 8.50354L8.08452 9.99855L9.11655 10.0829L9.5613 9.14781L8.20671 8.50354ZM11.521 4.72998L12.3341 5.9905L16.6137 3.22998H11.521V4.72998ZM5.4225 4.72998V3.22998H4.30741L3.98611 4.29777L5.4225 4.72998ZM5.41005 3.22998L3.98111 3.68619L4.31435 4.72998H5.41005V3.22998ZM14.9219 3.22998L14.9278 1.72998H14.9219V3.22998ZM18.1734 3.24288L18.1675 4.74287L21.8266 4.75738L19.2305 2.17867L18.1734 3.24288ZM16.4512 1.5321L15.3941 2.5963L15.3941 2.5963L16.4512 1.5321ZM18.5654 -0.596304C17.6838 -1.47204 16.2592 -1.46727 15.3834 -0.585657L17.5118 1.52855C17.2199 1.82242 16.7451 1.82401 16.4512 1.5321L18.5654 -0.596304ZM21.5857 2.40382L18.5654 -0.596305L16.4512 1.5321L19.4714 4.53223L21.5857 2.40382ZM22.1213 2.93592L21.5857 2.40382L19.4714 4.53223L20.0071 5.06433L22.1213 2.93592ZM21.5857 5.59643L22.1213 5.06433L20.0071 2.93592L19.4714 3.46802L21.5857 5.59643ZM18.5654 8.59655L21.5857 5.59643L19.4714 3.46802L16.4512 6.46815L18.5654 8.59655ZM15.3834 8.58591C16.2592 9.46752 17.6838 9.47229 18.5654 8.59655L16.4512 6.46815C16.7451 6.17624 17.2199 6.17783 17.5118 6.4717L15.3834 8.58591ZM15.3941 5.40395C14.5125 6.27968 14.5077 7.70429 15.3834 8.58591L17.5118 6.4717C17.8037 6.76557 17.8022 7.24044 17.5083 7.53235L15.3941 5.40395ZM17.1309 3.67874L15.3941 5.40394L17.5083 7.53235L19.2451 5.80715L17.1309 3.67874ZM15.0594 6.23056L18.182 6.24294L18.1939 3.24296L15.0713 3.23058L15.0594 6.23056ZM14.1534 6.72602L15.6347 6.11832L14.496 3.34281L13.0147 3.95052L14.1534 6.72602ZM10.9457 9.73038C11.5982 8.39647 12.7229 7.3129 14.1534 6.72602L13.0147 3.95052C10.8894 4.82244 9.21896 6.43316 8.25087 8.41205L10.9457 9.73038ZM8.64062 10.2257C8.86578 10.4125 9.00509 10.6895 9.00509 11.0003H12.0051C12.0051 9.75919 11.4387 8.64899 10.5559 7.9167L8.64062 10.2257ZM9.00509 11.0003C9.00509 11.5555 8.55503 12.0056 7.99986 12.0056V15.0056C10.2119 15.0056 12.0051 13.2124 12.0051 11.0003H9.00509ZM7.99986 12.0056C7.44469 12.0056 6.99463 11.5555 6.99463 11.0003H3.99463C3.99463 13.2124 5.78783 15.0056 7.99986 15.0056V12.0056ZM6.99463 11.0003C6.99463 10.4452 7.44469 9.99512 7.99986 9.99512V6.99512C5.78783 6.99512 3.99463 8.78832 3.99463 11.0003H6.99463ZM7.99986 9.99512C8.02865 9.99512 8.05687 9.99629 8.08452 9.99855L8.3289 7.00852C8.22012 6.99963 8.11037 6.99512 7.99986 6.99512V9.99512ZM10.7079 3.46947C9.0253 4.55484 7.69707 6.08275 6.85212 7.85926L9.5613 9.14781C10.1695 7.86905 11.1253 6.77023 12.3341 5.9905L10.7079 3.46947ZM5.4225 6.22998H11.521V3.22998H5.4225V6.22998ZM3.00006 8.02941C4.82337 8.02941 6.36018 6.81953 6.85888 5.16219L3.98611 4.29777C3.85829 4.72257 3.46305 5.02941 3.00006 5.02941V8.02941ZM-1.0293 4.00006C-1.0293 6.22541 0.774706 8.02941 3.00006 8.02941V5.02941C2.43156 5.02941 1.9707 4.56855 1.9707 4.00006H-1.0293ZM3.00006 -0.0292969C0.774706 -0.0292969 -1.0293 1.77471 -1.0293 4.00006H1.9707C1.9707 3.43156 2.43156 2.9707 3.00006 2.9707V-0.0292969ZM6.83899 2.77377C6.32049 1.14975 4.79992 -0.0292969 3.00006 -0.0292969V2.9707C3.45699 2.9707 3.84807 3.26949 3.98111 3.68619L6.83899 2.77377ZM14.9189 1.72998H5.41005V4.72998H14.9189V1.72998ZM14.9219 1.72998H14.9189V4.72998H14.9219V1.72998ZM18.1794 1.74289L14.9278 1.72999L14.9159 4.72997L18.1675 4.74287L18.1794 1.74289ZM15.3941 2.5963L17.1163 4.30708L19.2305 2.17867L17.5083 0.467898L15.3941 2.5963ZM15.3834 -0.585657C14.5077 0.295957 14.5125 1.72057 15.3941 2.5963L17.5083 0.467899C17.8022 0.759811 17.8037 1.23468 17.5118 1.52855L15.3834 -0.585657Z"
        fill="url(#paint0_linear_11726_2306)"
        mask="url(#path-1-inside-1_11726_2306)"
      />
      <path
        d="M17.5083 0.467898L16.4512 1.5321L16.4512 1.5321L17.5083 0.467898ZM16.4476 0.471447L15.3834 -0.585657V-0.585657L16.4476 0.471447ZM20.5286 3.46802L21.5857 2.40382V2.40382L20.5286 3.46802ZM21.0642 4.00012L22.1213 5.06433L23.1927 4.00012L22.1213 2.93592L21.0642 4.00012ZM20.5286 4.53223L21.5857 5.59643V5.59643L20.5286 4.53223ZM17.5083 7.53235L16.4512 6.46815L16.4512 6.46815L17.5083 7.53235ZM16.4476 7.5288L17.5118 6.4717V6.4717L16.4476 7.5288ZM16.4512 6.46815L15.3941 5.40394L15.3941 5.40395L16.4512 6.46815ZM18.188 4.74295L19.2451 5.80715L21.812 3.2573L18.1939 3.24296L18.188 4.74295ZM15.0654 4.73057L15.0713 3.23058L14.7725 3.22939L14.496 3.34281L15.0654 4.73057ZM13.5841 5.33827L13.0147 3.95052V3.95052L13.5841 5.33827ZM9.59828 9.07121L8.25087 8.41205L7.73223 9.47222L8.64062 10.2257L9.59828 9.07121ZM8.20671 8.50354L8.08452 9.99855L9.11655 10.0829L9.5613 9.14781L8.20671 8.50354ZM11.521 4.72998L12.3341 5.9905L16.6137 3.22998H11.521V4.72998ZM5.4225 4.72998V3.22998H4.30741L3.98611 4.29777L5.4225 4.72998ZM5.41005 3.22998L3.98111 3.68619L4.31435 4.72998H5.41005V3.22998ZM14.9219 3.22998L14.9278 1.72998H14.9219V3.22998ZM18.1734 3.24288L18.1675 4.74287L21.8266 4.75738L19.2305 2.17867L18.1734 3.24288ZM16.4512 1.5321L15.3941 2.5963L15.3941 2.5963L16.4512 1.5321ZM18.5654 -0.596304C17.6838 -1.47204 16.2592 -1.46727 15.3834 -0.585657L17.5118 1.52855C17.2199 1.82242 16.7451 1.82401 16.4512 1.5321L18.5654 -0.596304ZM21.5857 2.40382L18.5654 -0.596305L16.4512 1.5321L19.4714 4.53223L21.5857 2.40382ZM22.1213 2.93592L21.5857 2.40382L19.4714 4.53223L20.0071 5.06433L22.1213 2.93592ZM21.5857 5.59643L22.1213 5.06433L20.0071 2.93592L19.4714 3.46802L21.5857 5.59643ZM18.5654 8.59655L21.5857 5.59643L19.4714 3.46802L16.4512 6.46815L18.5654 8.59655ZM15.3834 8.58591C16.2592 9.46752 17.6838 9.47229 18.5654 8.59655L16.4512 6.46815C16.7451 6.17624 17.2199 6.17783 17.5118 6.4717L15.3834 8.58591ZM15.3941 5.40395C14.5125 6.27968 14.5077 7.70429 15.3834 8.58591L17.5118 6.4717C17.8037 6.76557 17.8022 7.24044 17.5083 7.53235L15.3941 5.40395ZM17.1309 3.67874L15.3941 5.40394L17.5083 7.53235L19.2451 5.80715L17.1309 3.67874ZM15.0594 6.23056L18.182 6.24294L18.1939 3.24296L15.0713 3.23058L15.0594 6.23056ZM14.1534 6.72602L15.6347 6.11832L14.496 3.34281L13.0147 3.95052L14.1534 6.72602ZM10.9457 9.73038C11.5982 8.39647 12.7229 7.3129 14.1534 6.72602L13.0147 3.95052C10.8894 4.82244 9.21896 6.43316 8.25087 8.41205L10.9457 9.73038ZM8.64062 10.2257C8.86578 10.4125 9.00509 10.6895 9.00509 11.0003H12.0051C12.0051 9.75919 11.4387 8.64899 10.5559 7.9167L8.64062 10.2257ZM9.00509 11.0003C9.00509 11.5555 8.55503 12.0056 7.99986 12.0056V15.0056C10.2119 15.0056 12.0051 13.2124 12.0051 11.0003H9.00509ZM7.99986 12.0056C7.44469 12.0056 6.99463 11.5555 6.99463 11.0003H3.99463C3.99463 13.2124 5.78783 15.0056 7.99986 15.0056V12.0056ZM6.99463 11.0003C6.99463 10.4452 7.44469 9.99512 7.99986 9.99512V6.99512C5.78783 6.99512 3.99463 8.78832 3.99463 11.0003H6.99463ZM7.99986 9.99512C8.02865 9.99512 8.05687 9.99629 8.08452 9.99855L8.3289 7.00852C8.22012 6.99963 8.11037 6.99512 7.99986 6.99512V9.99512ZM10.7079 3.46947C9.0253 4.55484 7.69707 6.08275 6.85212 7.85926L9.5613 9.14781C10.1695 7.86905 11.1253 6.77023 12.3341 5.9905L10.7079 3.46947ZM5.4225 6.22998H11.521V3.22998H5.4225V6.22998ZM3.00006 8.02941C4.82337 8.02941 6.36018 6.81953 6.85888 5.16219L3.98611 4.29777C3.85829 4.72257 3.46305 5.02941 3.00006 5.02941V8.02941ZM-1.0293 4.00006C-1.0293 6.22541 0.774706 8.02941 3.00006 8.02941V5.02941C2.43156 5.02941 1.9707 4.56855 1.9707 4.00006H-1.0293ZM3.00006 -0.0292969C0.774706 -0.0292969 -1.0293 1.77471 -1.0293 4.00006H1.9707C1.9707 3.43156 2.43156 2.9707 3.00006 2.9707V-0.0292969ZM6.83899 2.77377C6.32049 1.14975 4.79992 -0.0292969 3.00006 -0.0292969V2.9707C3.45699 2.9707 3.84807 3.26949 3.98111 3.68619L6.83899 2.77377ZM14.9189 1.72998H5.41005V4.72998H14.9189V1.72998ZM14.9219 1.72998H14.9189V4.72998H14.9219V1.72998ZM18.1794 1.74289L14.9278 1.72999L14.9159 4.72997L18.1675 4.74287L18.1794 1.74289ZM15.3941 2.5963L17.1163 4.30708L19.2305 2.17867L17.5083 0.467898L15.3941 2.5963ZM15.3834 -0.585657C14.5077 0.295957 14.5125 1.72057 15.3941 2.5963L17.5083 0.467899C17.8022 0.759811 17.8037 1.23468 17.5118 1.52855L15.3834 -0.585657Z"
        fill="url(#paint1_linear_11726_2306)"
        mask="url(#path-1-inside-1_11726_2306)"
      />
      <path
        d="M17.5083 0.467898L16.4512 1.5321L16.4512 1.5321L17.5083 0.467898ZM16.4476 0.471447L15.3834 -0.585657V-0.585657L16.4476 0.471447ZM20.5286 3.46802L21.5857 2.40382V2.40382L20.5286 3.46802ZM21.0642 4.00012L22.1213 5.06433L23.1927 4.00012L22.1213 2.93592L21.0642 4.00012ZM20.5286 4.53223L21.5857 5.59643V5.59643L20.5286 4.53223ZM17.5083 7.53235L16.4512 6.46815L16.4512 6.46815L17.5083 7.53235ZM16.4476 7.5288L17.5118 6.4717V6.4717L16.4476 7.5288ZM16.4512 6.46815L15.3941 5.40394L15.3941 5.40395L16.4512 6.46815ZM18.188 4.74295L19.2451 5.80715L21.812 3.2573L18.1939 3.24296L18.188 4.74295ZM15.0654 4.73057L15.0713 3.23058L14.7725 3.22939L14.496 3.34281L15.0654 4.73057ZM13.5841 5.33827L13.0147 3.95052V3.95052L13.5841 5.33827ZM9.59828 9.07121L8.25087 8.41205L7.73223 9.47222L8.64062 10.2257L9.59828 9.07121ZM8.20671 8.50354L8.08452 9.99855L9.11655 10.0829L9.5613 9.14781L8.20671 8.50354ZM11.521 4.72998L12.3341 5.9905L16.6137 3.22998H11.521V4.72998ZM5.4225 4.72998V3.22998H4.30741L3.98611 4.29777L5.4225 4.72998ZM5.41005 3.22998L3.98111 3.68619L4.31435 4.72998H5.41005V3.22998ZM14.9219 3.22998L14.9278 1.72998H14.9219V3.22998ZM18.1734 3.24288L18.1675 4.74287L21.8266 4.75738L19.2305 2.17867L18.1734 3.24288ZM16.4512 1.5321L15.3941 2.5963L15.3941 2.5963L16.4512 1.5321ZM18.5654 -0.596304C17.6838 -1.47204 16.2592 -1.46727 15.3834 -0.585657L17.5118 1.52855C17.2199 1.82242 16.7451 1.82401 16.4512 1.5321L18.5654 -0.596304ZM21.5857 2.40382L18.5654 -0.596305L16.4512 1.5321L19.4714 4.53223L21.5857 2.40382ZM22.1213 2.93592L21.5857 2.40382L19.4714 4.53223L20.0071 5.06433L22.1213 2.93592ZM21.5857 5.59643L22.1213 5.06433L20.0071 2.93592L19.4714 3.46802L21.5857 5.59643ZM18.5654 8.59655L21.5857 5.59643L19.4714 3.46802L16.4512 6.46815L18.5654 8.59655ZM15.3834 8.58591C16.2592 9.46752 17.6838 9.47229 18.5654 8.59655L16.4512 6.46815C16.7451 6.17624 17.2199 6.17783 17.5118 6.4717L15.3834 8.58591ZM15.3941 5.40395C14.5125 6.27968 14.5077 7.70429 15.3834 8.58591L17.5118 6.4717C17.8037 6.76557 17.8022 7.24044 17.5083 7.53235L15.3941 5.40395ZM17.1309 3.67874L15.3941 5.40394L17.5083 7.53235L19.2451 5.80715L17.1309 3.67874ZM15.0594 6.23056L18.182 6.24294L18.1939 3.24296L15.0713 3.23058L15.0594 6.23056ZM14.1534 6.72602L15.6347 6.11832L14.496 3.34281L13.0147 3.95052L14.1534 6.72602ZM10.9457 9.73038C11.5982 8.39647 12.7229 7.3129 14.1534 6.72602L13.0147 3.95052C10.8894 4.82244 9.21896 6.43316 8.25087 8.41205L10.9457 9.73038ZM8.64062 10.2257C8.86578 10.4125 9.00509 10.6895 9.00509 11.0003H12.0051C12.0051 9.75919 11.4387 8.64899 10.5559 7.9167L8.64062 10.2257ZM9.00509 11.0003C9.00509 11.5555 8.55503 12.0056 7.99986 12.0056V15.0056C10.2119 15.0056 12.0051 13.2124 12.0051 11.0003H9.00509ZM7.99986 12.0056C7.44469 12.0056 6.99463 11.5555 6.99463 11.0003H3.99463C3.99463 13.2124 5.78783 15.0056 7.99986 15.0056V12.0056ZM6.99463 11.0003C6.99463 10.4452 7.44469 9.99512 7.99986 9.99512V6.99512C5.78783 6.99512 3.99463 8.78832 3.99463 11.0003H6.99463ZM7.99986 9.99512C8.02865 9.99512 8.05687 9.99629 8.08452 9.99855L8.3289 7.00852C8.22012 6.99963 8.11037 6.99512 7.99986 6.99512V9.99512ZM10.7079 3.46947C9.0253 4.55484 7.69707 6.08275 6.85212 7.85926L9.5613 9.14781C10.1695 7.86905 11.1253 6.77023 12.3341 5.9905L10.7079 3.46947ZM5.4225 6.22998H11.521V3.22998H5.4225V6.22998ZM3.00006 8.02941C4.82337 8.02941 6.36018 6.81953 6.85888 5.16219L3.98611 4.29777C3.85829 4.72257 3.46305 5.02941 3.00006 5.02941V8.02941ZM-1.0293 4.00006C-1.0293 6.22541 0.774706 8.02941 3.00006 8.02941V5.02941C2.43156 5.02941 1.9707 4.56855 1.9707 4.00006H-1.0293ZM3.00006 -0.0292969C0.774706 -0.0292969 -1.0293 1.77471 -1.0293 4.00006H1.9707C1.9707 3.43156 2.43156 2.9707 3.00006 2.9707V-0.0292969ZM6.83899 2.77377C6.32049 1.14975 4.79992 -0.0292969 3.00006 -0.0292969V2.9707C3.45699 2.9707 3.84807 3.26949 3.98111 3.68619L6.83899 2.77377ZM14.9189 1.72998H5.41005V4.72998H14.9189V1.72998ZM14.9219 1.72998H14.9189V4.72998H14.9219V1.72998ZM18.1794 1.74289L14.9278 1.72999L14.9159 4.72997L18.1675 4.74287L18.1794 1.74289ZM15.3941 2.5963L17.1163 4.30708L19.2305 2.17867L17.5083 0.467898L15.3941 2.5963ZM15.3834 -0.585657C14.5077 0.295957 14.5125 1.72057 15.3941 2.5963L17.5083 0.467899C17.8022 0.759811 17.8037 1.23468 17.5118 1.52855L15.3834 -0.585657Z"
        fill="url(#paint2_linear_11726_2306)"
        mask="url(#path-1-inside-1_11726_2306)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_11726_2306"
          x1="0.733041"
          y1="-7.6205"
          x2="21.9168"
          y2="-7.6205"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#FFCE4F" />
          <stop offset="1" stop-color="#4FFFB0" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_11726_2306"
          x1="0.733041"
          y1="-7.6205"
          x2="21.9168"
          y2="-7.6205"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#4FFFB0" />
          <stop offset="0.505223" stop-color="#A2FF76" />
          <stop offset="1" stop-color="#FF984E" />
        </linearGradient>
        <linearGradient
          id="paint2_linear_11726_2306"
          x1="0.733041"
          y1="-7.6205"
          x2="21.9168"
          y2="-7.6205"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#4FFFB0" />
          <stop offset="0.463556" stop-color="#B3FF8F" />
          <stop offset="1" stop-color="#FF984E" />
        </linearGradient>
      </defs>
    </svg>`;
  }
  hdxTemplate() {
    return x`<svg hdx xmlns="http://www.w3.org/2000/svg" width="22" height="14" viewBox="0 0 22 14" fill="none">
      <mask id="path-1-inside-1_13994_20333" fill="white">
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M16.4476 0.471447C16.7395 0.177576 17.2144 0.175987 17.5083 0.467898L20.5286 3.46802L21.0642 4.00012L20.5286 4.53223L17.5083 7.53235C17.2144 7.82426 16.7395 7.82267 16.4476 7.5288C16.1557 7.23493 16.1573 6.76006 16.4512 6.46815L18.188 4.74295L15.0654 4.73057L13.5841 5.33827C11.8057 6.06788 10.4078 7.4156 9.59757 9.07265C10.1506 9.53219 10.5027 10.2252 10.5027 11.0003C10.5027 12.3839 9.38102 13.5056 7.99742 13.5056C6.61382 13.5056 5.49219 12.3839 5.49219 11.0003C5.49219 9.61675 6.61382 8.49512 7.99742 8.49512C8.06787 8.49512 8.13764 8.49803 8.20662 8.50373C8.9332 6.97601 10.0752 5.66257 11.521 4.72998H5.42054C5.10728 5.77105 4.14125 6.52941 2.9981 6.52941C1.60118 6.52941 0.46875 5.39698 0.46875 4.00006C0.46875 2.60313 1.60118 1.4707 2.9981 1.4707C4.12651 1.4707 5.08233 2.20962 5.40809 3.22998H14.9189H14.9219L18.1734 3.24288L16.4512 1.5321C16.1573 1.24019 16.1557 0.765319 16.4476 0.471447Z"
        />
      </mask>
      <path
        d="M17.5083 0.467898L16.4512 1.5321L16.4512 1.5321L17.5083 0.467898ZM16.4476 0.471447L15.3834 -0.585657V-0.585657L16.4476 0.471447ZM20.5286 3.46802L21.5857 2.40382V2.40382L20.5286 3.46802ZM21.0642 4.00012L22.1213 5.06433L23.1927 4.00012L22.1213 2.93592L21.0642 4.00012ZM20.5286 4.53223L21.5857 5.59643V5.59643L20.5286 4.53223ZM17.5083 7.53235L16.4512 6.46815L16.4512 6.46815L17.5083 7.53235ZM16.4476 7.5288L17.5118 6.4717V6.4717L16.4476 7.5288ZM16.4512 6.46815L15.3941 5.40394L15.3941 5.40395L16.4512 6.46815ZM18.188 4.74295L19.2451 5.80715L21.812 3.2573L18.1939 3.24296L18.188 4.74295ZM15.0654 4.73057L15.0713 3.23058L14.7725 3.22939L14.496 3.34281L15.0654 4.73057ZM13.5841 5.33827L14.1534 6.72602L13.5841 5.33827ZM9.59757 9.07265L8.25003 8.41377L7.7322 9.47284L8.63888 10.2263L9.59757 9.07265ZM8.20662 8.50373L8.08302 9.99863L9.11604 10.084L9.56122 9.14797L8.20662 8.50373ZM11.521 4.72998L12.3341 5.9905L16.6137 3.22998H11.521V4.72998ZM5.42054 4.72998V3.22998H4.30546L3.98416 4.29777L5.42054 4.72998ZM5.40809 3.22998L3.97915 3.68619L4.3124 4.72998H5.40809V3.22998ZM14.9219 3.22998L14.9278 1.72998H14.9219V3.22998ZM18.1734 3.24288L18.1675 4.74287L21.8266 4.75738L19.2305 2.17867L18.1734 3.24288ZM16.4512 1.5321L15.3941 2.5963L15.3941 2.59631L16.4512 1.5321ZM18.5654 -0.596304C17.6838 -1.47204 16.2592 -1.46727 15.3834 -0.585657L17.5118 1.52855C17.2199 1.82242 16.7451 1.82401 16.4512 1.5321L18.5654 -0.596304ZM21.5857 2.40382L18.5654 -0.596305L16.4512 1.5321L19.4714 4.53223L21.5857 2.40382ZM22.1213 2.93592L21.5857 2.40382L19.4714 4.53223L20.0071 5.06433L22.1213 2.93592ZM21.5857 5.59643L22.1213 5.06433L20.0071 2.93592L19.4714 3.46802L21.5857 5.59643ZM18.5654 8.59655L21.5857 5.59643L19.4714 3.46802L16.4512 6.46815L18.5654 8.59655ZM15.3834 8.58591C16.2592 9.46752 17.6838 9.47229 18.5654 8.59655L16.4512 6.46815C16.7451 6.17624 17.2199 6.17783 17.5118 6.4717L15.3834 8.58591ZM15.3941 5.40395C14.5125 6.27968 14.5077 7.70429 15.3834 8.58591L17.5118 6.4717C17.8037 6.76557 17.8022 7.24044 17.5083 7.53235L15.3941 5.40395ZM17.1309 3.67874L15.3941 5.40394L17.5083 7.53235L19.2451 5.80715L17.1309 3.67874ZM15.0594 6.23056L18.182 6.24293L18.1939 3.24296L15.0713 3.23058L15.0594 6.23056ZM14.1534 6.72602L15.6347 6.11832L14.496 3.34281L13.0147 3.95052L14.1534 6.72602ZM10.9451 9.73154C11.5976 8.39709 12.7225 7.31307 14.1534 6.72602L13.0147 3.95052C10.8888 4.82269 9.218 6.4341 8.25003 8.41377L10.9451 9.73154ZM8.63888 10.2263C8.86363 10.4131 9.00265 10.6898 9.00265 11.0003H12.0027C12.0027 9.7605 11.4375 8.65131 10.5563 7.919L8.63888 10.2263ZM9.00265 11.0003C9.00265 11.5555 8.55259 12.0056 7.99742 12.0056V15.0056C10.2094 15.0056 12.0027 13.2124 12.0027 11.0003H9.00265ZM7.99742 12.0056C7.44225 12.0056 6.99219 11.5555 6.99219 11.0003H3.99219C3.99219 13.2124 5.78539 15.0056 7.99742 15.0056V12.0056ZM6.99219 11.0003C6.99219 10.4452 7.44225 9.99512 7.99742 9.99512V6.99512C5.78539 6.99512 3.99219 8.78832 3.99219 11.0003H6.99219ZM7.99742 9.99512C8.02656 9.99512 8.0551 9.99632 8.08302 9.99863L8.33021 7.00883C8.22018 6.99973 8.10918 6.99512 7.99742 6.99512V9.99512ZM10.7079 3.46947C9.02523 4.55488 7.69696 6.08288 6.85202 7.85949L9.56122 9.14797C10.1694 7.86914 11.1252 6.77027 12.3341 5.9905L10.7079 3.46947ZM5.42054 6.22998H11.521V3.22998H5.42054V6.22998ZM2.9981 8.02941C4.82141 8.02941 6.35823 6.81953 6.85693 5.16219L3.98416 4.29777C3.85634 4.72257 3.46109 5.02941 2.9981 5.02941V8.02941ZM-1.03125 4.00006C-1.03125 6.22541 0.772753 8.02941 2.9981 8.02941V5.02941C2.42961 5.02941 1.96875 4.56855 1.96875 4.00006H-1.03125ZM2.9981 -0.0292968C0.772753 -0.0292968 -1.03125 1.77471 -1.03125 4.00006H1.96875C1.96875 3.43156 2.42961 2.9707 2.9981 2.9707V-0.0292968ZM6.83703 2.77377C6.31854 1.14975 4.79797 -0.0292968 2.9981 -0.0292968V2.9707C3.45504 2.9707 3.84612 3.26949 3.97915 3.68619L6.83703 2.77377ZM14.9189 1.72998H5.40809V4.72998H14.9189V1.72998ZM14.9219 1.72998H14.9189V4.72998H14.9219V1.72998ZM18.1794 1.74289L14.9278 1.72999L14.9159 4.72997L18.1675 4.74287L18.1794 1.74289ZM15.3941 2.59631L17.1163 4.30708L19.2305 2.17867L17.5083 0.467898L15.3941 2.59631ZM15.3834 -0.585657C14.5077 0.295957 14.5125 1.72057 15.3941 2.5963L17.5083 0.4679C17.8022 0.759811 17.8037 1.23468 17.5118 1.52855L15.3834 -0.585657Z"
        fill="url(#paint0_linear_13994_20333)"
        mask="url(#path-1-inside-1_13994_20333)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_13994_20333"
          x1="0.46875"
          y1="6.87779"
          x2="21.0642"
          y2="6.87779"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.3" stop-color="#FC408C" />
          <stop offset="1" stop-color="#EFB0FF" />
        </linearGradient>
      </defs>
    </svg>`;
  }
  render() {
    return x` ${this.bsxTemplate()} ${this.hdxTemplate()} `;
  }
};
RouteIcon = __decorateClass([
  e8("uigc-icon-route")
], RouteIcon);

// src/component/icons/Info.ts
var InfoIcon = class extends BaseIcon {
  bsxTemplate() {
    return x`<svg bsx width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M15.2569 5.39486V3.35039H14.2347V2.32816H13.2125V1.30592H11.168V0.283691H6.05684V1.30592H4.01238V2.32816H2.99014V3.35039H1.96791V5.39486H0.945679V10.506H1.96791V12.5505H2.99014V13.5727H4.01238V14.595H6.05684V15.6172H11.168V14.595H13.2125V13.5727H14.2347V12.5505H15.2569V10.506H16.2792V5.39486H15.2569Z"
        fill="url(#linear1)"
        fill-opacity="0.5"
      />
      <path
        d="M7.92419 5.05975V4.29175L8.47619 3.73975H9.31619L9.86819 4.29175V5.05975L9.31619 5.61175H8.47619L7.92419 5.05975ZM8.10419 6.30775H9.68819V12.2837H8.10419V6.30775Z"
        fill="currentColor"
      />
      <defs>
        <linearGradient id="linear1" x1="8.66804" y1="-3.23897" x2="8.66804" y2="14.285" gradientUnits="userSpaceOnUse">
          <stop stop-color="#85D1FF" />
          <stop offset="1" stop-color="#85D1FF" stop-opacity="0" />
        </linearGradient>
      </defs>
    </svg> `;
  }
  hdxTemplate() {
    return x`
      <svg hdx width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M15.2569 5.39486V3.35039H14.2347V2.32816H13.2125V1.30592H11.168V0.283691H6.05684V1.30592H4.01238V2.32816H2.99014V3.35039H1.96791V5.39486H0.945679V10.506H1.96791V12.5505H2.99014V13.5727H4.01238V14.595H6.05684V15.6172H11.168V14.595H13.2125V13.5727H14.2347V12.5505H15.2569V10.506H16.2792V5.39486H15.2569Z"
          fill="url(#linear0)"
          fill-opacity="0.5"
        />
        <path
          d="M7.92419 5.05975V4.29175L8.47619 3.73975H9.31619L9.86819 4.29175V5.05975L9.31619 5.61175H8.47619L7.92419 5.05975ZM8.10419 6.30775H9.68819V12.2837H8.10419V6.30775Z"
          fill="currentColor"
        />
        <defs>
          <linearGradient
            id="linear0"
            x1="8.66804"
            y1="-3.23897"
            x2="8.66804"
            y2="14.285"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#85D1FF" />
            <stop offset="1" stop-color="#85D1FF" stop-opacity="0" />
          </linearGradient>
        </defs>
      </svg>
    `;
  }
  render() {
    return x` ${this.bsxTemplate()} ${this.hdxTemplate()} `;
  }
};
InfoIcon.styles = [
  BaseIcon.styles,
  i`
      :host svg[bsx] path {
        stroke: #fff;
      }

      :host svg[hdx] path:nth-of-type(1) {
        fill: url(#linear0);
      }

      :host svg[hdx] path:nth-of-type(2) {
        fill: rgb(133, 209, 255);
      }

      :host svg[hdx]:hover {
        cursor: pointer;
      }

      :host svg[hdx]:hover path:nth-of-type(1) {
        fill: #57b3eb;
        fill-opacity: 1;
      }

      :host svg[hdx]:hover path:nth-of-type(2) {
        fill: #00041d;
      }
    `
];
InfoIcon = __decorateClass([
  e8("uigc-icon-info")
], InfoIcon);

// src/component/icons/Settings.ts
var SettingsIcon = class extends BaseIcon {
  bsxTemplate() {
    return x`
      <svg bsx xmlns="http://www.w3.org/2000/svg" width="19" height="20" viewBox="0 0 19 20" fill="none">
        <path
          d="M16.3952 7.5882L16.0724 6.80519C17.1797 4.24986 17.1077 4.17329 16.891 3.95517L15.4756 2.54351L15.3354 2.4218H15.1721C15.0845 2.4218 14.8285 2.4218 12.6753 3.41708L11.8826 3.09051C10.8584 0.500977 10.7545 0.500977 10.4502 0.500977H8.45744C8.1576 0.500977 8.04107 0.500977 7.09329 3.1002L6.30434 3.42677C4.85114 2.79961 3.99753 2.47676 3.76744 2.47676H3.57744L2.05743 3.99677C1.82437 4.23428 1.74275 4.31222 2.91466 6.82818L2.59181 7.60897C1.81199e-07 8.63097 0 8.72967 0 9.05104V11.0423C0 11.3555 0 11.4661 2.60131 12.4175L2.92416 13.1969C1.81681 15.7522 1.89029 15.8288 2.10552 16.0469L3.52088 17.4608L3.66115 17.584H3.82666C3.91201 17.584 4.16659 17.584 6.32119 16.5864L7.11163 16.9152C8.13585 19.501 8.24051 19.501 8.55 19.501H10.5391C10.8449 19.501 10.9533 19.501 11.9055 16.9033L12.6982 16.5767C14.1514 17.2039 15.0012 17.5267 15.2305 17.5267H15.4205L16.9554 15.9933C17.1736 15.7692 17.25 15.6913 16.0855 13.1849L16.4069 12.4041C19 11.371 19 11.2626 19 10.9509V8.95971C19 8.64652 19 8.53592 16.3949 7.58813L16.3952 7.5882ZM9.50025 13.324C8.61779 13.3262 7.77094 12.9774 7.14595 12.3547C6.52027 11.732 6.16848 10.8859 6.16774 10.0034C6.16626 9.12167 6.51582 8.27481 7.13928 7.64984C7.76271 7.02565 8.60882 6.6746 9.4913 6.67386C10.3738 6.67386 11.2199 7.02419 11.8441 7.64836C12.4683 8.27255 12.8178 9.11865 12.8178 10.0011C12.8164 10.8814 12.466 11.7245 11.8448 12.3473C11.2229 12.97 10.3805 13.321 9.50022 13.324L9.50025 13.324Z"
          fill="#8affcb"
        />
      </svg>
    `;
  }
  hdxTemplate() {
    return x`
      <svg hdx xmlns="http://www.w3.org/2000/svg" width="19" height="20" viewBox="0 0 19 20" fill="none">
        <path
          d="M16.3952 7.5882L16.0724 6.80519C17.1797 4.24986 17.1077 4.17329 16.891 3.95517L15.4756 2.54351L15.3354 2.4218H15.1721C15.0845 2.4218 14.8285 2.4218 12.6753 3.41708L11.8826 3.09051C10.8584 0.500977 10.7545 0.500977 10.4502 0.500977H8.45744C8.1576 0.500977 8.04107 0.500977 7.09329 3.1002L6.30434 3.42677C4.85114 2.79961 3.99753 2.47676 3.76744 2.47676H3.57744L2.05743 3.99677C1.82437 4.23428 1.74275 4.31222 2.91466 6.82818L2.59181 7.60897C1.81199e-07 8.63097 0 8.72967 0 9.05104V11.0423C0 11.3555 0 11.4661 2.60131 12.4175L2.92416 13.1969C1.81681 15.7522 1.89029 15.8288 2.10552 16.0469L3.52088 17.4608L3.66115 17.584H3.82666C3.91201 17.584 4.16659 17.584 6.32119 16.5864L7.11163 16.9152C8.13585 19.501 8.24051 19.501 8.55 19.501H10.5391C10.8449 19.501 10.9533 19.501 11.9055 16.9033L12.6982 16.5767C14.1514 17.2039 15.0012 17.5267 15.2305 17.5267H15.4205L16.9554 15.9933C17.1736 15.7692 17.25 15.6913 16.0855 13.1849L16.4069 12.4041C19 11.371 19 11.2626 19 10.9509V8.95971C19 8.64652 19 8.53592 16.3949 7.58813L16.3952 7.5882ZM9.50025 13.324C8.61779 13.3262 7.77094 12.9774 7.14595 12.3547C6.52027 11.732 6.16848 10.8859 6.16774 10.0034C6.16626 9.12167 6.51582 8.27481 7.13928 7.64984C7.76271 7.02565 8.60882 6.6746 9.4913 6.67386C10.3738 6.67386 11.2199 7.02419 11.8441 7.64836C12.4683 8.27255 12.8178 9.11865 12.8178 10.0011C12.8164 10.8814 12.466 11.7245 11.8448 12.3473C11.2229 12.97 10.3805 13.321 9.50022 13.324L9.50025 13.324Z"
          fill="#676C80"
        />
      </svg>
    `;
  }
  render() {
    return x` ${this.bsxTemplate()} ${this.hdxTemplate()} `;
  }
};
SettingsIcon = __decorateClass([
  e8("uigc-icon-settings")
], SettingsIcon);

// src/component/icons/SuccessAlt.ts
var SuccessIconAlt = class extends BaseIcon {
  bsxTemplate() {
    return x`
      <svg bsx xmlns="http://www.w3.org/2000/svg" width="117" height="116" viewBox="0 0 117 116" fill="none">
        <circle cx="58.5" cy="58" r="58" fill="url(#paint0_linear_14501_1547)" fill-opacity="0.3" />
        <path
          d="M45.5 60.5L54.5 69.5L73.5 49.5"
          stroke="url(#paint1_linear_14501_1547)"
          stroke-width="7"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M45.5 60.5L54.5 69.5L73.5 49.5"
          stroke="url(#paint2_linear_14501_1547)"
          stroke-width="7"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M45.5 60.5L54.5 69.5L73.5 49.5"
          stroke="url(#paint3_linear_14501_1547)"
          stroke-width="7"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <defs>
          <linearGradient
            id="paint0_linear_14501_1547"
            x1="58.5"
            y1="-56.0161"
            x2="58.5"
            y2="181.586"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0.0560296" stop-color="#4FFFB0" stop-opacity="0" />
            <stop offset="0.323175" stop-color="#4FFFB0" stop-opacity="0.14" />
            <stop offset="0.633467" stop-color="#2EFFA1" />
            <stop offset="0.751279" stop-color="#FFE668" />
          </linearGradient>
          <linearGradient
            id="paint1_linear_14501_1547"
            x1="45.8567"
            y1="37.625"
            x2="74.6592"
            y2="37.625"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#FFCE4F" />
            <stop offset="1" stop-color="#4FFFB0" />
          </linearGradient>
          <linearGradient
            id="paint2_linear_14501_1547"
            x1="45.8567"
            y1="37.625"
            x2="74.6592"
            y2="37.625"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#4FFFB0" />
            <stop offset="0.505223" stop-color="#A2FF76" />
            <stop offset="1" stop-color="#FF984E" />
          </linearGradient>
          <linearGradient
            id="paint3_linear_14501_1547"
            x1="45.8567"
            y1="37.625"
            x2="74.6592"
            y2="37.625"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#4FFFB0" />
            <stop offset="0.463556" stop-color="#B3FF8F" />
            <stop offset="1" stop-color="#FF984E" />
          </linearGradient>
        </defs>
      </svg>
    `;
  }
  hdxTemplate() {
    return x` <svg hdx xmlns="http://www.w3.org/2000/svg" width="117" height="116" viewBox="0 0 117 116" fill="none">
      <rect width="8.25" height="8.25" transform="matrix(1 0 0 -1 42.5 16.563)" fill="#03EF97" fill-opacity="0.25" />
      <rect width="8.25" height="8.25" transform="matrix(1 0 0 -1 50.75 16.563)" fill="#03EF97" fill-opacity="0.25" />
      <rect width="8.25" height="8.25" transform="matrix(1 0 0 -1 59 16.563)" fill="#03EF97" fill-opacity="0.25" />
      <rect width="8.25" height="8.25" transform="matrix(1 0 0 -1 67.25 16.563)" fill="#03EF97" fill-opacity="0.25" />
      <rect width="8.25" height="8.25" transform="matrix(1 0 0 -1 26 24.813)" fill="#03EF97" fill-opacity="0.25" />
      <rect width="8.25" height="8.25" transform="matrix(1 0 0 -1 34.25 24.813)" fill="#03EF97" fill-opacity="0.25" />
      <rect width="8.25" height="8.25" transform="matrix(1 0 0 -1 42.5 24.813)" fill="#03EF97" fill-opacity="0.25" />
      <rect width="8.25" height="8.25" transform="matrix(1 0 0 -1 50.75 24.813)" fill="#03EF97" fill-opacity="0.25" />
      <rect width="8.25" height="8.25" transform="matrix(1 0 0 -1 59 24.813)" fill="#03EF97" fill-opacity="0.25" />
      <rect width="8.25" height="8.25" transform="matrix(1 0 0 -1 67.25 24.813)" fill="#03EF97" fill-opacity="0.25" />
      <rect width="8.25" height="8.25" transform="matrix(1 0 0 -1 75.5 24.813)" fill="#03EF97" fill-opacity="0.25" />
      <rect width="8.25" height="8.25" transform="matrix(1 0 0 -1 83.75 24.813)" fill="#03EF97" fill-opacity="0.25" />
      <rect width="8.25" height="8.25" transform="matrix(1 0 0 -1 17.75 33.063)" fill="#03EF97" fill-opacity="0.25" />
      <rect width="8.25" height="8.25" transform="matrix(1 0 0 -1 26 33.063)" fill="#03EF97" fill-opacity="0.25" />
      <rect width="8.25" height="8.25" transform="matrix(1 0 0 -1 34.25 33.063)" fill="#03EF97" fill-opacity="0.25" />
      <rect width="8.25" height="8.25" transform="matrix(1 0 0 -1 42.5 33.063)" fill="#03EF97" fill-opacity="0.25" />
      <rect width="8.25" height="8.25" transform="matrix(1 0 0 -1 50.75 33.063)" fill="#03EF97" fill-opacity="0.25" />
      <rect width="8.25" height="8.25" transform="matrix(1 0 0 -1 59 33.063)" fill="#03EF97" fill-opacity="0.25" />
      <rect width="8.25" height="8.25" transform="matrix(1 0 0 -1 67.25 33.063)" fill="#03EF97" fill-opacity="0.25" />
      <rect width="8.25" height="8.25" transform="matrix(1 0 0 -1 75.5 33.063)" fill="#03EF97" fill-opacity="0.25" />
      <rect width="8.25" height="8.25" transform="matrix(1 0 0 -1 83.75 33.063)" fill="#03EF97" fill-opacity="0.25" />
      <rect width="8.25" height="8.25" transform="matrix(1 0 0 -1 92 33.063)" fill="#03EF97" fill-opacity="0.25" />
      <rect width="8.25" height="8.25" transform="matrix(1 0 0 -1 13.625 41.313)" fill="#03EF97" fill-opacity="0.25" />
      <rect width="8.25" height="8.25" transform="matrix(1 0 0 -1 21.875 41.313)" fill="#03EF97" fill-opacity="0.25" />
      <rect width="8.25" height="8.25" transform="matrix(1 0 0 -1 30.125 41.313)" fill="#03EF97" fill-opacity="0.25" />
      <rect width="8.25" height="8.25" transform="matrix(1 0 0 -1 38.375 41.313)" fill="#03EF97" fill-opacity="0.25" />
      <rect width="8.25" height="8.25" transform="matrix(1 0 0 -1 46.625 41.313)" fill="#03EF97" fill-opacity="0.25" />
      <rect width="8.25" height="8.25" transform="matrix(1 0 0 -1 54.875 41.313)" fill="#03EF97" fill-opacity="0.25" />
      <rect width="8.25" height="8.25" transform="matrix(1 0 0 -1 63.125 41.313)" fill="#03EF97" fill-opacity="0.25" />
      <rect width="8.25" height="8.25" transform="matrix(1 0 0 -1 71.375 41.313)" fill="#03EF97" fill-opacity="0.25" />
      <rect width="8.25" height="8.25" transform="matrix(1 0 0 -1 79.625 41.313)" fill="#03EF97" fill-opacity="0.25" />
      <rect width="8.25" height="8.25" transform="matrix(1 0 0 -1 87.875 41.313)" fill="#03EF97" fill-opacity="0.25" />
      <rect width="8.25" height="8.25" transform="matrix(1 0 0 -1 96.125 41.313)" fill="#03EF97" fill-opacity="0.25" />
      <rect width="8.25" height="8.25" transform="matrix(1 0 0 -1 9.5 49.563)" fill="#03EF97" fill-opacity="0.25" />
      <rect width="8.25" height="8.25" transform="matrix(1 0 0 -1 17.75 49.563)" fill="#03EF97" fill-opacity="0.25" />
      <rect width="8.25" height="8.25" transform="matrix(1 0 0 -1 26 49.563)" fill="#03EF97" fill-opacity="0.25" />
      <rect width="8.25" height="8.25" transform="matrix(1 0 0 -1 34.25 49.563)" fill="#03EF97" fill-opacity="0.25" />
      <rect width="8.25" height="8.25" transform="matrix(1 0 0 -1 42.5 49.563)" fill="#03EF97" fill-opacity="0.25" />
      <rect width="8.25" height="8.25" transform="matrix(1 0 0 -1 50.75 49.563)" fill="#03EF97" fill-opacity="0.25" />
      <rect width="8.25" height="8.25" transform="matrix(1 0 0 -1 59 49.563)" fill="#03EF97" fill-opacity="0.25" />
      <rect width="8.25" height="8.25" transform="matrix(1 0 0 -1 67.25 49.563)" fill="#03EF97" fill-opacity="0.25" />
      <rect width="8.25" height="8.25" transform="matrix(1 0 0 -1 75.5 49.563)" fill="#03EF97" fill-opacity="0.25" />
      <rect width="8.25" height="8.25" transform="matrix(1 0 0 -1 83.75 49.563)" fill="#03EF97" fill-opacity="0.25" />
      <rect width="8.25" height="8.25" transform="matrix(1 0 0 -1 92 49.563)" fill="#03EF97" fill-opacity="0.25" />
      <rect width="8.25" height="8.25" transform="matrix(1 0 0 -1 100.25 49.563)" fill="#03EF97" fill-opacity="0.25" />
      <rect x="9.5" y="49.563" width="8.25" height="8.25" fill="#03EF97" fill-opacity="0.25" />
      <rect x="17.75" y="49.563" width="8.25" height="8.25" fill="#03EF97" fill-opacity="0.25" />
      <rect x="26" y="49.563" width="8.25" height="8.25" fill="#03EF97" fill-opacity="0.25" />
      <rect x="34.25" y="49.563" width="8.25" height="8.25" fill="#03EF97" fill-opacity="0.25" />
      <rect x="42.5" y="49.563" width="8.25" height="8.25" fill="#03EF97" fill-opacity="0.25" />
      <rect x="50.75" y="49.563" width="8.25" height="8.25" fill="#03EF97" fill-opacity="0.25" />
      <rect x="59" y="49.563" width="8.25" height="8.25" fill="#03EF97" fill-opacity="0.25" />
      <rect x="67.25" y="49.563" width="8.25" height="8.25" fill="#03EF97" fill-opacity="0.25" />
      <rect x="75.5" y="49.563" width="8.25" height="8.25" fill="#03EF97" fill-opacity="0.25" />
      <rect x="83.75" y="49.563" width="8.25" height="8.25" fill="#03EF97" fill-opacity="0.25" />
      <rect x="92" y="49.563" width="8.25" height="8.25" fill="#03EF97" fill-opacity="0.25" />
      <rect x="100.25" y="49.563" width="8.25" height="8.25" fill="#03EF97" fill-opacity="0.25" />
      <rect x="9.5" y="57.813" width="8.25" height="8.25" fill="#03EF97" fill-opacity="0.25" />
      <rect x="17.75" y="57.813" width="8.25" height="8.25" fill="#03EF97" fill-opacity="0.25" />
      <rect x="26" y="57.813" width="8.25" height="8.25" fill="#03EF97" fill-opacity="0.25" />
      <rect x="34.25" y="57.813" width="8.25" height="8.25" fill="#03EF97" fill-opacity="0.25" />
      <rect x="42.5" y="57.813" width="8.25" height="8.25" fill="#03EF97" fill-opacity="0.25" />
      <rect x="50.75" y="57.813" width="8.25" height="8.25" fill="#03EF97" fill-opacity="0.25" />
      <rect x="59" y="57.813" width="8.25" height="8.25" fill="#03EF97" fill-opacity="0.25" />
      <rect x="67.25" y="57.813" width="8.25" height="8.25" fill="#03EF97" fill-opacity="0.25" />
      <rect x="75.5" y="57.813" width="8.25" height="8.25" fill="#03EF97" fill-opacity="0.25" />
      <rect x="83.75" y="57.813" width="8.25" height="8.25" fill="#03EF97" fill-opacity="0.25" />
      <rect x="92" y="57.813" width="8.25" height="8.25" fill="#03EF97" fill-opacity="0.25" />
      <rect x="100.25" y="57.813" width="8.25" height="8.25" fill="#03EF97" fill-opacity="0.25" />
      <rect x="9.5" y="66.063" width="8.25" height="8.25" fill="#03EF97" fill-opacity="0.25" />
      <rect x="17.75" y="66.063" width="8.25" height="8.25" fill="#03EF97" fill-opacity="0.25" />
      <rect x="26" y="66.063" width="8.25" height="8.25" fill="#03EF97" fill-opacity="0.25" />
      <rect x="34.25" y="66.063" width="8.25" height="8.25" fill="#03EF97" fill-opacity="0.25" />
      <rect x="42.5" y="66.063" width="8.25" height="8.25" fill="#03EF97" fill-opacity="0.25" />
      <rect x="50.75" y="66.063" width="8.25" height="8.25" fill="#03EF97" fill-opacity="0.25" />
      <rect x="59" y="66.063" width="8.25" height="8.25" fill="#03EF97" fill-opacity="0.25" />
      <rect x="67.25" y="66.063" width="8.25" height="8.25" fill="#03EF97" fill-opacity="0.25" />
      <rect x="75.5" y="66.063" width="8.25" height="8.25" fill="#03EF97" fill-opacity="0.25" />
      <rect x="83.75" y="66.063" width="8.25" height="8.25" fill="#03EF97" fill-opacity="0.25" />
      <rect x="92" y="66.063" width="8.25" height="8.25" fill="#03EF97" fill-opacity="0.25" />
      <rect x="100.25" y="66.063" width="8.25" height="8.25" fill="#03EF97" fill-opacity="0.25" />
      <rect x="13.625" y="74.313" width="8.25" height="8.25" fill="#03EF97" fill-opacity="0.25" />
      <rect x="21.875" y="74.313" width="8.25" height="8.25" fill="#03EF97" fill-opacity="0.25" />
      <rect x="30.125" y="74.313" width="8.25" height="8.25" fill="#03EF97" fill-opacity="0.25" />
      <rect x="38.375" y="74.313" width="8.25" height="8.25" fill="#03EF97" fill-opacity="0.25" />
      <rect x="46.625" y="74.313" width="8.25" height="8.25" fill="#03EF97" fill-opacity="0.25" />
      <rect x="54.875" y="74.313" width="8.25" height="8.25" fill="#03EF97" fill-opacity="0.25" />
      <rect x="63.125" y="74.313" width="8.25" height="8.25" fill="#03EF97" fill-opacity="0.25" />
      <rect x="71.375" y="74.313" width="8.25" height="8.25" fill="#03EF97" fill-opacity="0.25" />
      <rect x="79.625" y="74.313" width="8.25" height="8.25" fill="#03EF97" fill-opacity="0.25" />
      <rect x="87.875" y="74.313" width="8.25" height="8.25" fill="#03EF97" fill-opacity="0.25" />
      <rect x="96.125" y="74.313" width="8.25" height="8.25" fill="#03EF97" fill-opacity="0.25" />
      <rect x="17.75" y="82.563" width="8.25" height="8.25" fill="#03EF97" fill-opacity="0.25" />
      <rect x="26" y="82.563" width="8.25" height="8.25" fill="#03EF97" fill-opacity="0.25" />
      <rect x="34.25" y="82.563" width="8.25" height="8.25" fill="#03EF97" fill-opacity="0.25" />
      <rect x="42.5" y="82.563" width="8.25" height="8.25" fill="#03EF97" fill-opacity="0.25" />
      <rect x="50.75" y="82.563" width="8.25" height="8.25" fill="#03EF97" fill-opacity="0.25" />
      <rect x="59" y="82.563" width="8.25" height="8.25" fill="#03EF97" fill-opacity="0.25" />
      <rect x="67.25" y="82.563" width="8.25" height="8.25" fill="#03EF97" fill-opacity="0.25" />
      <rect x="75.5" y="82.563" width="8.25" height="8.25" fill="#03EF97" fill-opacity="0.25" />
      <rect x="83.75" y="82.563" width="8.25" height="8.25" fill="#03EF97" fill-opacity="0.25" />
      <rect x="92" y="82.563" width="8.25" height="8.25" fill="#03EF97" fill-opacity="0.25" />
      <rect x="26" y="90.813" width="8.25" height="8.25" fill="#03EF97" fill-opacity="0.25" />
      <rect x="34.25" y="90.813" width="8.25" height="8.25" fill="#03EF97" fill-opacity="0.25" />
      <rect x="42.5" y="90.813" width="8.25" height="8.25" fill="#03EF97" fill-opacity="0.25" />
      <rect x="50.75" y="90.813" width="8.25" height="8.25" fill="#03EF97" fill-opacity="0.25" />
      <rect x="59" y="90.813" width="8.25" height="8.25" fill="#03EF97" fill-opacity="0.25" />
      <rect x="67.25" y="90.813" width="8.25" height="8.25" fill="#03EF97" fill-opacity="0.25" />
      <rect x="75.5" y="90.813" width="8.25" height="8.25" fill="#03EF97" fill-opacity="0.25" />
      <rect x="83.75" y="90.813" width="8.25" height="8.25" fill="#03EF97" fill-opacity="0.25" />
      <rect x="42.5" y="99.063" width="8.25" height="8.25" fill="#03EF97" fill-opacity="0.25" />
      <rect x="50.75" y="99.063" width="8.25" height="8.25" fill="#03EF97" fill-opacity="0.25" />
      <rect x="59" y="99.063" width="8.25" height="8.25" fill="#03EF97" fill-opacity="0.25" />
      <rect x="67.25" y="99.063" width="8.25" height="8.25" fill="#03EF97" fill-opacity="0.25" />
      <rect x="40.1719" y="58.0177" width="7.35899" height="7.35899" fill="#00FFA0" />
      <rect x="47.5312" y="65.3768" width="7.35899" height="7.35899" fill="#00FFA0" />
      <rect
        x="69.6094"
        y="50.6588"
        width="7.35899"
        height="7.35899"
        transform="rotate(90 69.6094 50.6588)"
        fill="#00FFA0"
      />
      <rect
        x="62.25"
        y="58.0177"
        width="7.35899"
        height="7.35899"
        transform="rotate(90 62.25 58.0177)"
        fill="#00FFA0"
      />
      <rect
        x="54.8867"
        y="65.3767"
        width="7.35899"
        height="7.35899"
        transform="rotate(90 54.8867 65.3767)"
        fill="#00FFA0"
      />
      <rect
        x="76.9648"
        y="43.2997"
        width="7.35899"
        height="7.35899"
        transform="rotate(90 76.9648 43.2997)"
        fill="#00FFA0"
      />
    </svg>`;
  }
  render() {
    return x` ${this.bsxTemplate()} ${this.hdxTemplate()} `;
  }
};
SuccessIconAlt = __decorateClass([
  e8("uigc-icon-success-alt")
], SuccessIconAlt);

// src/component/icons/Warning.ts
var WarningIcon = class extends BaseIcon {
  render() {
    return x`
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M12 2.875L22.5366 21.125H1.46338L12 2.875ZM11.0101 15.8919H12.9932V17.8751H11.0101V15.8919ZM12.9932 9.875H11.0101V14.5024H12.9932V9.875Z"
          fill="url(#paint0_linear_3_2)"
        ></path>
        <defs>
          <linearGradient
            id="paint0_linear_3_2"
            x1="12"
            y1="3.77624"
            x2="12"
            y2="21.125"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="var(--stop-first-offset)" stop-color="var(--stop-first-color)"></stop>
            <stop offset="1" stop-color="var(--stop-second-color)" stop-opacity="0.27"></stop>
          </linearGradient>
        </defs>
      </svg>
    `;
  }
};
WarningIcon.styles = [
  i`
      :host {
        --stop-first-color: #ffd53e;
        --stop-first-offset: 0;
        --stop-second-color: #ffec8a;
      }

      :host([red]) {
        --stop-first-color: #ff424d;
        --stop-first-offset: 0.503788;
        --stop-second-color: #ff5555;
      }
    `
];
WarningIcon = __decorateClass([
  e8("uigc-icon-warning")
], WarningIcon);
/*! Bundled license information:

dompurify/dist/purify.js:
  (*! @license DOMPurify 2.4.7 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/2.4.7/LICENSE *)

@lit/reactive-element/css-tag.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/reactive-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/lit-html.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-element/lit-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/is-server.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/property.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/directive.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/directive-helpers.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/directives/cache.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/async-directive.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/directives/private-async-helpers.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/directives/until.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/directives/unsafe-html.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

tslib/tslib.es6.js:
  (*! *****************************************************************************
  Copyright (c) Microsoft Corporation.
  
  Permission to use, copy, modify, and/or distribute this software for any
  purpose with or without fee is hereby granted.
  
  THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
  REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
  AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
  INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
  LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
  OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
  PERFORMANCE OF THIS SOFTWARE.
  ***************************************************************************** *)

lit-html/directives/template-content.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/custom-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/state.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/base.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/event-options.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-all.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-async.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-assigned-elements.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-assigned-nodes.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/directives/when.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/directives/choose.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/directives/async-replace.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/directives/class-map.js:
  (**
   * @license
   * Copyright 2018 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
//# sourceMappingURL=app.js.map
