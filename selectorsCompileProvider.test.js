const selectorsCompileProvider = require('./selectorsCompileProvider');

describe('MN instance', () => {
  test('it should parse simple notation', () => {
    const {
      parseComboNameProvider,
      parseComboName,
      parseId,
      parseClass,
    } = selectorsCompileProvider();

    const testNotation1 = 'cF00';

    expect(parseClass(testNotation1)).toEqual([
      [
        {'cF00': 1},
        {'.cF00': 1},
        '',
      ],
    ]);

    expect(parseId(testNotation1)).toEqual([
      [
        {'cF00': 1},
        {'#cF00': 1},
        '',
      ],
    ]);

    expect(parseComboNameProvider('m')(testNotation1)).toEqual([
      [
        {'cF00': 1},
        {'[m~=\"cF00\"]': 1},
        '',
      ],
    ]);

    expect(parseComboNameProvider('m-n')(testNotation1)).toEqual([
      [
        {'cF00': 1},
        {'[m-n~=\"cF00\"]': 1},
        '',
      ],
    ]);

    const targetName = '.anyClass';
    expect(parseComboName(testNotation1, targetName)).toEqual([
      [
        {'cF00': 1},
        {'.anyClass': 1},
        '',
      ],
    ]);
  });

  test('it should parse notation with one child selector', () => {
    const {
      parseComboNameProvider,
      parseComboName,
      parseId,
      parseClass,
    } = selectorsCompileProvider();

    const testNotation1 = 'cF00>.anyChildClass';
    const testNotation2 = 'ph10>div';

    expect(parseClass(testNotation1)).toEqual([
      [
        {'cF00': 1},
        {'.cF00\\>\\.anyChildClass .anyChildClass': 1},
        '',
      ],
    ]);
    expect(parseClass(testNotation2)).toEqual([
      [
        {'ph10': 1},
        {'.ph10\\>div div': 1},
        '',
      ],
    ]);

    expect(parseId(testNotation1)).toEqual([
      [
        {'cF00': 1},
        {'#cF00\\>\\.anyChildClass .anyChildClass': 1},
        '',
      ],
    ]);
    expect(parseId(testNotation2)).toEqual([
      [
        {'ph10': 1},
        {'#ph10\\>div div': 1},
        '',
      ],
    ]);

    expect(parseComboNameProvider('m')(testNotation1)).toEqual([
      [
        {'cF00': 1},
        {'[m~=\"cF00>.anyChildClass\"] .anyChildClass': 1},
        '',
      ],
    ]);
    expect(parseComboNameProvider('m')(testNotation2)).toEqual([
      [
        {'ph10': 1},
        {'[m~=\"ph10>div\"] div': 1},
        '',
      ],
    ]);

    expect(parseComboNameProvider('m-n')(testNotation1)).toEqual([
      [
        {'cF00': 1},
        {'[m-n~=\"cF00>.anyChildClass\"] .anyChildClass': 1},
        '',
      ],
    ]);
    expect(parseComboNameProvider('m-n')(testNotation2)).toEqual([
      [
        {'ph10': 1},
        {'[m-n~=\"ph10>div\"] div': 1},
        '',
      ],
    ]);

    const targetName = '.anyClass';
    expect(parseComboName(testNotation1, targetName)).toEqual([
      [
        {'cF00': 1},
        {'.anyClass .anyChildClass': 1},
        '',
      ],
    ]);
    expect(parseComboName(testNotation2, targetName)).toEqual([
      [
        {'ph10': 1},
        {'.anyClass div': 1},
        '',
      ],
    ]);
  });

  test('it should parse notation with one child selector and depth', () => {
    const {
      parseClass,
      parseComboName,
    } = selectorsCompileProvider();
    const testNotation1 = 'cF>1.anyChildClass';
    expect(parseClass(testNotation1)).toEqual([
      [
        {'cF': 1},
        {'.cF\\>1\\.anyChildClass>.anyChildClass': 1},
        '',
      ],
    ]);
    expect(parseComboName(testNotation1, 'targetSelector')).toEqual([
      [
        {'cF': 1},
        {'targetSelector>.anyChildClass': 1},
        '',
      ],
    ]);

    const testNotation2 = 'bg0>1div';
    expect(parseClass(testNotation2)).toEqual([
      [
        {'bg0': 1},
        {'.bg0\\>1div>div': 1},
        '',
      ],
    ]);
    expect(parseComboName(testNotation2, 'targetSelector')).toEqual([
      [
        {'bg0': 1},
        {'targetSelector>div': 1},
        '',
      ],
    ]);

    const testNotation3 = 'cF>3.anyChildClass';
    expect(parseClass(testNotation3)).toEqual([
      [
        {'cF': 1},
        {'.cF\\>3\\.anyChildClass>*>*>.anyChildClass': 1},
        '',
      ],
    ]);
    expect(parseComboName(testNotation3, 'targetSelector')).toEqual([
      [
        {'cF': 1},
        {'targetSelector>*>*>.anyChildClass': 1},
        '',
      ],
    ]);

    const testNotation4 = 'bg0>3div';
    expect(parseClass(testNotation4)).toEqual([
      [
        {'bg0': 1},
        {'.bg0\\>3div>*>*>div': 1},
        '',
      ],
    ]);
    expect(parseComboName(testNotation4, 'targetSelector')).toEqual([
      [
        {'bg0': 1},
        {'targetSelector>*>*>div': 1},
        '',
      ],
    ]);

    const testNotation5 = 'cF>1';
    expect(parseClass(testNotation5)).toEqual([
      [
        {'cF': 1},
        {'.cF\\>1>*': 1},
        '',
      ],
    ]);
    expect(parseComboName(testNotation5, 'targetSelector')).toEqual([
      [
        {'cF': 1},
        {'targetSelector>*': 1},
        '',
      ],
    ]);

    const testNotation6 = 'bg0>3';
    expect(parseClass(testNotation6)).toEqual([
      [
        {'bg0': 1},
        {'.bg0\\>3>*>*>*': 1},
        '',
      ],
    ]);
    expect(parseComboName(testNotation6, 'targetSelector')).toEqual([
      [
        {'bg0': 1},
        {'targetSelector>*>*>*': 1},
        '',
      ],
    ]);
  });

  /* eslint-disable */

  /*
  test('it should parse notation with one child selector and variants', () => {
    const {
      parseClass,
      parseComboName,
    } = selectorsCompileProvider();
    const testNotation1 = '(cF|bg0)>.anyChildClass';
    const testNotation2 = '(cF|bg0|bcE)>div';
    const testNotation2 = '(cF|bg0|bcE)>(.child1|.child2)';
    const testNotation3 = '(cF|bg0|bcE)>.(child1|child2)';
  });

  test('it should parse notation with the added selectors and variants', () => {
    const {
      parseClass,
      parseComboName,
    } = selectorsCompileProvider();
    const testNotation1 = 'mt15.active';
    const testNotation2 = 'mt15:hover';
    const testNotation3 = 'mt15[checked]';
    const testNotation4 = 'mt15[checked].active:hover';
    const testNotation5 = 'mt15:(hover|active)';
    const testNotation6 = '(mt15|mb10):hover';
    const testNotation7 = '(mt15|mb10):(hover|active)';
    const testNotation8 = '(mt15|mb10).active:(hover|active)';
    expect(parseClass(testNotation1)).toEqual([
      [
        {'cF00': 1},
        {'.cF00\\>\\.anyChildClass .anyChildClass': 1},
        '',
      ],
    ]);
    expect(parseClass(testNotation2)).toEqual([
      [
        {'ph10': 1},
        {'.ph10\\>div div': 1},
        '',
      ],
    ]);
  });

  /*
  test('it should parse notation with the combined selectors', () => {
    const {
      parseClass,
      parseComboName,
    } = selectorsCompileProvider();
    const testNotation1 = 'lt>.child1>.child2';
    const testNotation2 = 'mt15.active';
    const testNotation3 = 'mt15:hover';
    const testNotation4 = 'mt15[checked]';
    const testNotation5 = 'mt15<.parent1<.parent2';
    const testNotation6 = 'mt15[checked].active:hover<.parent1<.parent2>.child1>.child2';
    const testNotation7 = '(mt15|mb10)';
    const testNotation8 = '(mt15|mb10)>.child1';
    const testNotation9 = '(mt15|mb10)<.parent1';
    expect(parseClass(testNotation1)).toEqual([
      [
        {'cF00': 1},
        {'.cF00\\>\\.anyChildClass .anyChildClass': 1},
        '',
      ],
    ]);
    expect(parseClass(testNotation2)).toEqual([
      [
        {'ph10': 1},
        {'.ph10\\>div div': 1},
        '',
      ],
    ]);
  });
  */
});
