/**
 * @overview Minimalist-Notation preset "main"
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 * @dependencies
 * minimalist-notation/presets/styles
 * minimalist-notation/presets/medias
 */


/* eslint quote-props: ["error", "as-needed"] */
module.exports = (mn) => {
  mn.css({
    html: {
      '-webkit-tap-highlight-color': '#000',
    },
  });
  mn.assign({
    '*, *:before, *:after': 'bxzBB',
    html: 'lh115% tsa',
    body: 'm',
    a: 'cr@mouse bgTransparent',
    img: 'dB b0',
    iframe: 'dB b0 bcTransparent',
    // eslint-disable-next-line
    'aside, article, main, section, header, footer, nav, video, canvas, input, textarea':
      'dB',

    'input:-webkit-autofill': 'dn',
    'input::-ms-(reveal|clear)': 'dN',

    hr: 'bxzCB h0 ovV',

    /**
     * 1. Correct the inheritance and scaling of font size in all browsers.
     * 2. Correct the odd `em` font sizing in all browsers.
     */
    pre: 'ff_monospase f1em',

    /* Text-level semantics
  ========================================================================== */

    /**
     * 1. Remove the bottom border in Chrome 57-
     * 2. Add the correct text decoration in Chrome, Edge, IE, Opera,
     * and Safari.
     */
    'abbr[title]': 'bb0 tdU',

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
    'sub, sup': 'f75% lh0 rlv vaBL',

    sub: 'sb-0.25em',
    sup: 'st-0.5em',

    /* Embedded content
  ========================================================================== */

    /**
     * Remove the border on images inside links in IE 10.
     */
    img: 'bsN',

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
    'button, input': 'ovV',

    /**
     * Remove the inheritance of text transform in Edge, Firefox, and IE.
     * 1. Remove the inheritance of text transform in Firefox.
     */
    'button, select': 'ttN',

    /**
     * Correct the inability to style clickable types in iOS and Safari.
     */
    'button, [type=(button|reset|submit)]': 'apcButton',

    /**
     * Remove the inner border and padding in Firefox.
     */
    '(button|[type=(button|reset|submit)])::-moz-focus-inner': 'bsN p',

    /**
     * Restore the focus styles unset by the previous rule.
     */
    '(button|[type=(button|reset|submit)]):-moz-focusring':
      'ol_1px_dotted_ButtonText',

    /**
    * Correct the padding in Firefox.
    */
    fieldset: 'pt0.35em ph0.75em pb0.625em',

    /**
     * 1. Correct the text wrapping in Edge and IE.
     * 2. Correct the color inheritance from `fieldset` elements in IE.
     * 3. Remove the padding so developers are not caught out when they zero out
     *    `fieldset` elements in all browsers.
     */
    legend: 'bxzBB cInherit dTB wmax p wsN',

    /**
     * Add the correct vertical alignment in Chrome, Firefox, and Opera.
     */

    progress: 'vaBL',

    /**
     * Remove the default vertical scrollbar in IE 10+.
     */
    textarea: 'ovA',

    /**
     * 1. Add the correct box sizing in IE 10.
     * 2. Remove the padding in IE 10.
     */
    '[type=(checkbox|radio)]': 'bxzBB p',

    /**
     * Correct the cursor style of increment and decrement buttons in Chrome.
     */
    '[type=number]::-webkit-(inner|outer)-spin-button': 'hA',

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
    details: 'dB',

    /*
     * Add the correct display in all browsers.
     */
    summary: 'dLI',

    /* Misc
  ========================================================================== */

    /**
     * Add the correct display in IE 10+.
     */
    template: 'dN',

    /**
     * Add the correct display in IE 10.
     */

    '[hidden]': 'dN',
  });
  // assign('[m~="container"]', '(mhAuto|ph10|w970@md|w1170@lg|w1570@ll)');
};
