const regexpInvalid = /\.[[\]#.*^$()><+~=|:,"'`\s@%\!\/0-9]/g;
const regexpInQuotesAndEscaped = /("[^"]*"|'[^']*'|\\.)/g;

module.exports = (selector) => {
  return regexpInvalid.test(selector.replace(regexpInQuotesAndEscaped, ''));
};
