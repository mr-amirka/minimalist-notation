const regexpInvalid = /\.[[\]#.*^$()><+~=|:,"'`\s@%\!\/0-9]/g;
const regexpInQuotes = /("[^"]*"|'[^']*')/g;

module.exports = (selector) => {
  return regexpInvalid.test(selector.replace(regexpInQuotes, ''));
};
