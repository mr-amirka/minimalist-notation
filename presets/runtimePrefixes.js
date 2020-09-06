/**
 * @overview Minimalist-Notation preset "runtime prefixes"
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */

module.exports = (mn) => {
  const {utils, propertiesStringify} = mn;
  const {flags, forEach} = utils;
  const style = document.createElement('div').style;
  const prefixes = propertiesStringify.prefixes;
  forEach(['webkit', 'moz', 'o', 'ms', 'khtml'], (prefix) => {
    style[prefix + 'Transform'] && (prefixes['-' + prefix + '-'] = 1);
  });
  flags([
    'appearance',
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
    'opacity',
    'boxSizing',
    'textSizeAdjust',
  ], propertiesStringify.prefixedAttrs);
};
