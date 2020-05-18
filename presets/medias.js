/**
 * @overview Minimalist-Notation preset "default medias"
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */

module.exports = (mn) => {
  const {media, utils} = mn;
  const {forEach} = utils;
  /*
  forEach([
    [ 'sm', '(max-width: 991px)' ],
    [ 'sm-md', '(min-width: 768px) and (max-width: 991px)' ],
    [ 'xs', '(max-width: 767px)' ],
    [ 'xs-sm', '(min-width: 480px) and (max-width: 767px)' ],
    [ 'xv', '(max-width: 639px)' ],
    [ 'xm', '(max-width: 479px)' ],
    [ 'xm-xs', '(min-width: 360px) and (max-width: 479px)' ],
    [ 'mm', '(max-width: 359px)' ],
    [ 'md', '(min-width: 992px)' ],
    [ 'md-lg', '(min-width: 992px) and (max-width: 1199px)' ],
    [ 'lg', '(min-width: 1200px)' ],
    [ 'lg-ll', '(min-width: 1200px) and (max-width: 1559px)' ],
    [ 'll', '(min-width: 1600px)' ],
  ], (v, i) => media[v[0]] = {query: v[1], priority: i});
*/

  forEach([
    // mobile
    ['m', '(max-width: 992px)'],
    ['m2', '(max-width: 768px)'],
    ['m3', '(max-width: 640px)'],
    ['m4', '(max-width: 480px)'],
    ['m5', '(max-width: 360px)'],
    ['m6', '(max-width: 320px)'],

    ['m2-', '(min-width: 768px) and (max-width: 992px)'],
    ['m3-', '(min-width: 640px) and (max-width: 992px)'],
    ['m4-', '(min-width: 480px) and (max-width: 992px)'],
    ['m5-', '(min-width: 360px) and (max-width: 992px)'],
    ['m6-', '(min-width: 320px) and (max-width: 992px)'],

    // desktop
    ['d', '(min-width: 992px)'],
    ['d2', '(min-width: 1200px)'],
    ['d3', '(min-width: 1600px)'],
    ['d4', '(min-width: 1920px)'],

    ['-d4', '(min-width: 992px) and (max-width: 1920px)'],
    ['-d3', '(min-width: 992px) and (max-width: 1600px)'],
    ['-d2', '(min-width: 992px) and (max-width: 1200px)'],

    // if has mouse, touch pad, advanced stylus digitizers
    ['mouse', '(pointer: fine) and (hover: hover)'],

  ], (v, i) => {
    media[v[0]] = {query: v[1], priority: i};
  });

  // user agents
  forEach([
    'linux', 'mozilla', 'firefox', 'opera', 'trident', 'edge',
    'chrome', 'ubuntu', 'chromium', 'safari', 'msie', 'webkit', 'applewebkit',
    'mobile', 'ie', 'webtv', 'konqueror', 'blackberry', 'android', 'iron',
    'iphone', 'ipod', 'ipad', 'mac', 'darwin', 'windows', 'freebsd',
  ], (name) => {
    media[name] = {selector: '.' + name};
  });
};
