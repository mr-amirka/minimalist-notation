/**
 * @overview MinimalistNotation preset "default states"
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */

module.exports = (mn) => {
  /*
  // deprecated example
  mn.utils.extend(mn.states, {
    a: [':active'],
    c: [':checked'],
    f: [':focus'],
    h: [':hover'],
    i: [
      '::-webkit-input-placeholder',
      '::-moz-placeholder',
      ':-ms-input-placeholder',
      '::placeholder',
    ],
    even: [':nth-child(2n)'],
    odd: [':nth-child(2n+1)'],
    n: [':nth-child'],
    first: [':first-child'],
    last: [':last-child'],
  });
  */

  mn.synonyms({
    a: ':active',
    c: ':checked',
    f: ':focus',
    h: ':hover@mouse',
    i: ':(:-webkit-input-|:-moz-|-ms-input-|:)placeholder',
    even: ':nth-child\\(2n\\)',
    odd: ':nth-child\\(2n+1\\)',
    n: ':nth-child',
    first: ':first-child',
    last: ':last-child',
  });
};
