/**
 * @overview Minimalist-Notation preset "main"
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 * @dependencies
 * mn-presets/styles
 * mn-presets/medias
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
    html: 'ovxH tsa',
    body: 'm0 ovxH',
    a: 'crP@mouse',
    img: 'wmax dB mhA b0',
    iframe: 'dB b0',
    // eslint-disable-next-line
    'aside, article, main, section, header, footer, nav, video, canvas, input, textarea':
      'dB',
  });
  // assign('[m~="container"]', '(mhAuto|ph10|w970@md|w1170@lg|w1570@ll)');
};
