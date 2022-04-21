/**
 * @overview MinimalistNotation preset "synonyms"
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */

module.exports = (mn) => {
  // synonyms
  mn.synonyms({
    a: ':active',
    c: ':checked',
    d: ':disabled',
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
