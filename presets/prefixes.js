/**
 * @overview Minimalist-Notation preset "prefixes"
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */

const // eslint-disable-line
  WEBKIT = '-webkit-',
  MOZ = '-moz-',
  OPERA = '-o-',// eslint-disable-line
  MS = '-ms-'; // eslint-disable-line
  KHTML = '-khtml-'; // eslint-disable-line

module.exports = (mn) => {
  const {utils, propertiesStringify} = mn;
  const {flags, extend} = utils;
  const {prefixedAttrs} = propertiesStringify;
  flags([
    WEBKIT, MOZ,
  ], propertiesStringify.prefixes);

  extend(prefixedAttrs, {
    appearance: flags([WEBKIT]),
  });

  flags([
    'backgroundClip',
    'transform',
    'transformStyle',
    'transitionDuration',
    'pointerEvents',
    'userSelect',
    'filter',
    'flex',
    'flexDirection',
    'flexBasis',
    'flexWrap',
    'flexFlow',
    'flexGrow',
    'flexShrink',
    'justifyContent',
    'alignItems',
    'alignContent',
    'alignSelf',
    'boxPack',
    'boxDirection',
    'boxOrient',
    'order',
    // 'opacity',
    'boxSizing',
    'textSizeAdjust',
  ], prefixedAttrs);
};
