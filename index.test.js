const cloneDepth = require('mn-utils/cloneDepth');
const mnProvider = require('./index.js');

const CLONE_DEPTH = 10;

function paddingHandle(p) {
  return {
    style: {
      padding: (p.num || '0') + (p.unit || 'px'),
    },
  };
}

describe('MN instance', () => {
  // eslint-disable-next-line
  test('it should generate styles using "class" after call method "compile"', () => {
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
      updated: 1,
    });
    expect(mn.emitter.getValue()).toEqual([
      {
        content: '.p10{padding:10px}',
        name: 'media.all',
        priority: -2000,
        updated: 0,
      },
    ]);

    check('p25');
    expect(mn.emitter.getValue()).toEqual([
      {
        content: '.p10{padding:10px}',
        name: 'media.all',
        priority: -2000,
        updated: 0,
      },
    ]);
    mn.compile();
    expect(mn.emitter.getValue()).toEqual([
      {
        content: '.p10{padding:10px}.p25{padding:25px}',
        name: 'media.all',
        priority: -2000,
        updated: 0,
      },
    ]);
  });

  // eslint-disable-next-line
  test('it should generate styles using attribute "m" after call method "compile"', () => {
    const mn = mnProvider();
    const check = mn.getCompiler('m');
    mn('p', paddingHandle);

    expect(mn.emitter.getValue()).toEqual([]);

    check('p15');
    expect(mn.emitter.getValue()).toEqual([]);

    let outputMediaItem; // eslint-disable-line
    mn.emitter.on((styles) => {
      outputMediaItem = cloneDepth(styles[0], CLONE_DEPTH);
    });
    mn.compile();
    /*
    expect(outputMediaItem).toEqual({
      content: '[m~=\"p15\"]{padding:15px}',
      name: 'media.all',
      priority: -2000,
      updated: 1,
    });
    */
    expect(mn.emitter.getValue()).toEqual([
      {
        content: '[m~=\"p15\"]{padding:15px}',
        name: 'media.all',
        priority: -2000,
        updated: 0,
      },
    ]);


    check('p20');
    expect(mn.emitter.getValue()).toEqual([
      {
        content: '[m~=\"p15\"]{padding:15px}',
        name: 'media.all',
        priority: -2000,
        updated: 0,
      },
    ]);
    mn.compile();
    expect(mn.emitter.getValue()).toEqual([
      {
        content: '[m~=\"p15\"]{padding:15px}[m~=\"p20\"]{padding:20px}',
        name: 'media.all',
        priority: -2000,
        updated: 0,
      },
    ]);
  });
});
