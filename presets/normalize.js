/**
 * @overview Minimalist-Notation preset "normalize.css"
 * @description This is a fork of the normalize.css v8.0.1
 * | github.com/necolas/normalize.css
 * @dependencies
 * mn-presets/styles
 */

/* eslint quote-props: ["error", "as-needed"] */

module.exports = (mn) => {
  mn.assign({
    /* Document
  ========================================================================== */

    /**
     * 1. Correct the line height in all browsers.
     * 2. Prevent adjustments of font size after orientation changes in iOS.
     */
    html: 'lh115% tsa',

    /* Sections
  ========================================================================== */

    /**
     * Remove the margin in all browsers.
     */
    body: 'm',

    /**
     * Render the `main` element consistently in IE.
     */
    main: 'dBlock',

    /**
     * Correct the font size and margin on `h1` elements within `section` and
     * `article` contexts in Chrome, Firefox, and Safari.
     */
    h1: 'f2em mv0\\.67em mh',

    /* Grouping content
  ========================================================================== */

    /**
     * 1. Add the correct box sizing in Firefox.
     * 2. Show the overflow in Edge and IE.
     */
    hr: 'bxzContentBox h0 ovVisible',

    /**
     * 1. Correct the inheritance and scaling of font size in all browsers.
     * 2. Correct the odd `em` font sizing in all browsers.
     */
    pre: 'ff_monospase f1em',

    /* Text-level semantics
  ========================================================================== */

    /**
     * Remove the gray background on active links in IE 10.
     */
    a: 'bgTransparent',

    /**
     * 1. Remove the bottom border in Chrome 57-
     * 2. Add the correct text decoration in Chrome, Edge, IE, Opera,
     * and Safari.
     */
    'abbr[title]': 'bb0 tdUnderline',

    /**
     * Add the correct font weight in Chrome, Edge, and Safari.
     */

    'b, strong': 'fwBolder',

    /**
     * 1. Correct the inheritance and scaling of font size in all browsers.
     * 2. Correct the odd `em` font sizing in all browsers.
     */
    'code, kbd, samp': 'ff_monospase f1em',

    /**
     * Add the correct font size in all browsers.
     */
    small: 'f80%',

    /**
     * Prevent `sub` and `sup` elements from affecting the line height in
     * all browsers.
     */
    'sub, sup': 'f75% lh0 rlv vaBaseline',

    sub: 'sb-0\\.25em',

    sup: 'st-0\\.5em',

    /* Embedded content
  ========================================================================== */

    /**
     * Remove the border on images inside links in IE 10.
     */
    img: 'bsNone',

    /* Forms
  ========================================================================== */

    /**
     * 1. Change the font styles in all browsers.
     * 2. Remove the margin in Firefox and Safari.
     */
    'button, input, optgroup, select, textarea': 'ffInherit f100% lh115% m',

    /**
     * Show the overflow in IE.
     * 1. Show the overflow in Edge.
     */
    'button, input': 'ovVisible',

    /**
     * Remove the inheritance of text transform in Edge, Firefox, and IE.
     * 1. Remove the inheritance of text transform in Firefox.
     */
    'button, select': 'ttNone',

    /**
     * Correct the inability to style clickable types in iOS and Safari.
     */
    'button, [type=(button|reset|submit)]': 'apcButton',

    /**
     * Remove the inner border and padding in Firefox.
     */
    '(button|[type=(button|reset|submit)])::-moz-focus-inner': 'bsNone p',

    /**
     * Restore the focus styles unset by the previous rule.
     */
    '(button|[type=(button|reset|submit)]):-moz-focusring':
      'ol_1px_dotted_ButtonText',

    /**
    * Correct the padding in Firefox.
    */
    fieldset: 'pt0\\.35em ph0\\.75em pb0\\.625em',

    /**
     * 1. Correct the text wrapping in Edge and IE.
     * 2. Correct the color inheritance from `fieldset` elements in IE.
     * 3. Remove the padding so developers are not caught out when they zero out
     *    `fieldset` elements in all browsers.
     */
    legend: 'bxzBorderBox cInherit dTable wmax p wsNormal',

    /**
     * Add the correct vertical alignment in Chrome, Firefox, and Opera.
     */

    progress: 'vaBaseline',

    /**
     * Remove the default vertical scrollbar in IE 10+.
     */
    textarea: 'ovAuto',

    /**
     * 1. Add the correct box sizing in IE 10.
     * 2. Remove the padding in IE 10.
     */
    '[type=(checkbox|radio)]': 'bxzBorderBox p',

    /**
     * Correct the cursor style of increment and decrement buttons in Chrome.
     */
    '[type=number]::-webkit-(inner|outer)-spin-button': 'hAuto',

    /**
     * 1. Correct the odd appearance in Chrome and Safari.
     * 2. Correct the outline style in Safari.
     */
    '[type=search]': 'apcTextfield olo-2',

    /**
     * Remove the inner padding in Chrome and Safari on macOS.
     */
    '[type=search]::-webkit-search-decoration': 'apcNone',

    /**
     * 1. Correct the inability to style clickable types in iOS and Safari.
     * 2. Change font properties to `inherit` in Safari.
     */
    '::-webkit-file-upload-button': 'apcButton fontInherit',


    /* Interactive
  ========================================================================== */

    /*
     * Add the correct display in Edge, IE 10+, and Firefox.
     */
    details: 'dBlock',

    /*
     * Add the correct display in all browsers.
     */
    summary: 'dListItem',

    /* Misc
  ========================================================================== */

    /**
     * Add the correct display in IE 10+.
     */
    template: 'dNone',

    /**
     * Add the correct display in IE 10.
     */

    '[hidden]': 'dNone',
  });
};
