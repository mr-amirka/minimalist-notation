/**
 * @overview MinimalistNotation preset "default states"
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */

module.exports = (mn) => {
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
};
