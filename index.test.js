const cloneDepth = require('mn-utils/cloneDepth');
const mnProvider = require('./index.js');

const CLONE_DEPTH = 10;

function paddingHandle(p) {
  return {
    style: {
      padding: (p.num || '0') + (p.unit || 'px') + p.i,
    },
  };
}

describe('MN instance', () => {
  test('it should generate styles', () => {
    const mn = mnProvider();
    const check = mn.getCompiler('class');
    mn('p', paddingHandle);

    expect(mn.emitter.getValue()).toEqual([]);

    check('p10');
    expect(mn.emitter.getValue()).toEqual([]);

    let outputMediaItem;
    mn.emitter.on((styles) => {
      outputMediaItem = cloneDepth(styles[0], CLONE_DEPTH);
    });
    mn.compile();
    expect(outputMediaItem).toEqual({
      content: '.p10{padding:10px}',
      name: 'media.all',
      priority: -2000,
      updated: true,
    });
    expect(mn.emitter.getValue()).toEqual([
      {
        content: '.p10{padding:10px}',
        name: 'media.all',
        priority: -2000,
        updated: false,
      },
    ]);
  });
});
