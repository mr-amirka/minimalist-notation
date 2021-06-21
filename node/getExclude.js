const isFunction = require('mn-utils/isFunction');
const isArray = require('mn-utils/isArray');
const isRegExp = require('mn-utils/isRegExp');
const isString = require('mn-utils/isString');
const noop = require('mn-utils/noop');
const reduce = require('mn-utils/reduce');

const reStringMatcher = /^\.\//gim;
function getStringMatcher(pattern) {
  pattern = pattern.replace(reStringMatcher, '');
  return (value) => pattern == value.replace(reStringMatcher, '');
}

function getMatcher(matcher) {
  return isFunction(matcher)
    ? matcher
    : (
      isRegExp(matcher)
        ? (path) => matcher.test(path)
        : (
          isString(matcher)
            ? getStringMatcher(matcher)
            : (
              isArray(matcher)
                ? getMatcherAggregate(matcher)
                : null
            )
        )
    );
}
function getMatcherAggregate(matchers) {
  matchers = reduce(matchers, getMatcherIteratee, []);
  const length = matchers.length;
  return length ? (path) => {
    let i = length;
    for (; i-- > 0;) {
      if (matchers[i](path)) return true;
    }
    return false;
  } : null;
}
function getMatcherIteratee(matchers, matcher) {
  matcher = getMatcher(matcher);
  matcher && matchers.push(matcher);
  return matchers;
}

module.exports = (exclude, include) => {
  include = getMatcher(include) || noop;
  exclude = getMatcher(exclude) || noop;
  return (path) => exclude(path) || !include(path);
};
