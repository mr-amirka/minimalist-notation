const splitReverse = require('mn-utils/escapedSplitProvider')('!').base;
const regexpClassSubstr = /\.\*([A-Za-z0-9-_$]+)/g;
const regexpIdSubstr = /\#\*([A-Za-z0-9-_$]+)/g;


module.exports = (minimalistNotationSelector) => {
  return splitReverse(minimalistNotationSelector)
      .reverse()
      .join('')
      .replace(regexpClassSubstr, '[class*=$1]')
      .replace(regexpIdSubstr, '[id*=$1]');
};
