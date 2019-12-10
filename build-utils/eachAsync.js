const forEach = require('mn-utils/forEach');

function eachAsync(items, iteratee) {
  return new Promise((resolve) => {
    const length = items && items.length || 0;
    let i = 0;
    length < 1 ? resolve() : forEach(items, (item, index) => {
      let called;
      iteratee(item, index, (err) => {
        err && console.error(err);
        if (called) return;
        called = true;
        ++i < length || resolve();
      });
    });
  });
}

module.exports = eachAsync;
