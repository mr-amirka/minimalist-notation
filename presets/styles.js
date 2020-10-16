/**
 * @overview Minimalist-Notation preset "default styles"
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */

/*
TODO:
Добавить вычисляемость (calc) для свойств "height, side, padding, marign"
по аналогии с "width"
*/

/* eslint quote-props: ["error", "as-needed"] */
const regexpComma = /(?:\s*,\s*)+/;
const regexpTrimSnakeLeft = /^_+/g;
const regexpTrimKebabLeft = /^-+/g;
const regexpSign = /([-+])/;
const reZero =/^0+|\.?0+$/g;
const regexpSpaceNormalize = /(\\_)|(_)/g;
const regexpFilterName = /^([A-Za-z]+)([0-9]*)(.*)$/;
const regexpFilterSep = /_+/;
const BASE_COLOR_PATTERN
  = '([A-Z][a-z][A-Za-z]+):camel|([A-Fa-f0-9]+(\\.[0-9]+)?):color';
const COLOR_PATTERN = '^(' + BASE_COLOR_PATTERN + '):value';

// eslint-disable-next-line
const WIDTH_PATTERN = '^(([A-Z][A-Za-z]*):camel|([0-9]*\\.[0-9]+|[0-9]+):num(/([0-9]*\\.[0-9]+|[0-9]+):total?)?):value?([a-z%]+):unit?([-+]([0-9]*\\.[0-9]+|[0-9]+)):add?$';
// eslint-disable-next-line
const MARGIN_PATTERN = '^(([A-Z][A-Za-z]*):camel|([-+]):sign?([0-9]*\\.[0-9]+|[0-9]+):num(/([0-9]*\\.[0-9]+|[0-9]+):total?)?):value?([a-z%]+):unit?([-+]([0-9]*\\.[0-9]+|[0-9]+)):add?$';
const SHADOW_PATTERNS = [
  '(r|R)(\\-?[0-9]+):r',
  '(x|X)(\\-?[0-9]+):x',
  '(y|Y)(\\-?[0-9]+):y',
  '(m|M)([0-9]+):m',
  'c(' + BASE_COLOR_PATTERN + '):c',
  '(in):in',
];
const TOP = '-top';
const BOTTOM = '-bottom';
const LEFT = '-left';
const RIGHT = '-right';

const SIDES_MAP = {
  '': [''],
  t: [TOP],
  b: [BOTTOM],
  l: [LEFT],
  r: [RIGHT],

  v: [TOP, BOTTOM],
  vl: [TOP, BOTTOM, LEFT],
  vr: [TOP, BOTTOM, RIGHT],

  h: [LEFT, RIGHT],
  ht: [LEFT, RIGHT, TOP],
  hb: [LEFT, RIGHT, BOTTOM],

  lt: [TOP, LEFT],
  rt: [TOP, RIGHT],
  lb: [BOTTOM, LEFT],
  rb: [BOTTOM, RIGHT],
};
const borderStyleSynonyms = {
  N: 'None',
  H: 'Hidden',
  DT: 'Dotted',
  DS: 'Dashed',
  S: 'Solid',
  DB: 'Double',
  DTDS: 'DotDash',
  DTDTDS: 'DotDotDash',
  W: 'Wave',
  G: 'Groove',
  R: 'Ridge',
  I: 'Inset',
  O: 'Outset',
};
const sizeSynonyms = {
  A: 'Auto',
  N: 'None',
};
const tdSynonyms = {
  '': 'None',
  N: 'None',
  U: 'Underline',
  O: 'Overline',
  L: 'LineThrough',
  I: 'Inherit',
};
const breakAfterSynonyms = {
  A: 'Auto',
  AW: 'Always',
  AV: 'Avoid',
  AVP: 'AvoidPage',
  AVC: 'AvoidColumn',
  AVRN: 'AvoidRegion',
  RN: 'Region',
  C: 'Column',
  P: 'Page',
  L: 'Left',
  R: 'Right',
  RE: 'Recto',
  VE: 'Verso',
};
const fontWeightSynonyms = {
  N: 'Normal',
  B: 'Bold',
  BR: 'Bolder',
  LR: 'Lighter',
};
const outlineStyleSynonyms = {
  N: 'None',
  DT: 'Dotted',
  DS: 'Dashed',
  S: 'Solid',
  DB: 'Double',
  G: 'Groove',
  R: 'Ridge',
  I: 'Inset',
  O: 'Outset',
};
const SHADOW_HANDLERS = {
  bxsh: ['boxShadow', function(x, y, value, r, color) {
    return [x, y, value, r, color];
  }],
  tsh: ['textShadow', function(x, y, value, r, color) {
    return [x, y, value, color];
  }],
};
const FILTER_MAP = {
  blur: ['blur', 4, 'px'],
  gray: ['grayscale', 100, '%'],
  bright: ['brightness', 100, '%'],
  contrast: ['contrast', 100, '%'],
  hue: ['hue-rotate', 180, 'deg'],
  invert: ['invert', 100, '%'],
  saturate: ['saturate', 100, '%'],
  sepia: ['sepia', 100, '%'],
};

function replacerSpaceNormalize(all, escaped) {
  return escaped ? '_' : ' ';
}
function spaceNormalize(v) {
  return replace(v, regexpSpaceNormalize, replacerSpaceNormalize);
}
function replace(v, from, to) {
  return v.replace(from, to);
}
function snakeLeftTrim(v) {
  return replace(v, regexpTrimSnakeLeft, '');
}
function styleWrap(style, priority) {
  return {style, priority: priority || 0};
}
function toFixed(v) {
  return replace((Math.floor(v * 100) * 0.01).toFixed(2), reZero, '') || '0';
}
function normalizeDefault(p, def) {
  return {
    exts: [p.name + (def || 0) + p.ni],
  };
}
function stylePosition(position, priority) {
  return styleWrap({position: position}, priority);
}
function upperCase(v) {
  return v.toUpperCase();
}
function __wr(v) {
  return v[0] == '-' ? '"' + v.substr(1) + '"' : v;
}
function normalizeCalc(v, add) {
  return 'calc(' + v + ' ' + replace(add, regexpSign, '$1 ') + 'px)';
}

module.exports = (mn) => {
  const {utils, setKeyframes} = mn;
  const {
    isDefined,
    map,
    filter,
    forIn,
    forEach,
    upperFirst,
    lowerFirst,
    camelToKebabCase,
    isArray,
    flags,
    size,
    intval,
    floatval,
    color: getColor,
    colorGetBackground,
  } = utils;

  function toKebabCase(v) {
    return camelToKebabCase(lowerFirst(v));
  }
  function synonymProvider(propName, synonyms, priority, props) {
    return isArray(propName)
      ? (props = flags(propName), ((p, s, style, synonym, propName) => {
        if (synonym = synonyms[s = p.suffix]) {
          return normalizeDefault(p, synonym);
        }
        if (s) {
          s = spaceNormalize(s[0] == '_' ? snakeLeftTrim(s) : toKebabCase(s));
          style = {};
          for (propName in props) style[propName] = s; // eslint-disable-line
          return styleWrap(style, priority);
        }
      }))
      : ((p, s, style, synonym) => {
        return (synonym = synonyms[s = p.suffix])
          ? normalizeDefault(p, synonym)
          : (
            s ? (style = {}, style[propName] = spaceNormalize(
                s[0] == '_'
                  ? snakeLeftTrim(s)
                  : toKebabCase(s),
            ), styleWrap(style, priority))
            : 0
          );
      });
  }

  forIn(map(SIDES_MAP, (sides) => flags(sides)), (sides, suffix) => {
    const priority = suffix ? (4 - size(sides)) : 0;
    const bsSidesSet = sidesSetter((side) => 'border' + side + '-style');
    const bcSidesSet = sidesSetter((side) => 'border' + side + '-color');
    const biSidesSet = sidesSetter((side) => 'border' + side + '-image');

    function sidesSetter(handle) {
      const propsMap = {};
      let propSide;
      for (propSide in sides) propsMap[handle(propSide)] = 1; // eslint-disable-line
      return (v) => {
        if (isDefined(v)) {
          let style = {}, pName; // eslint-disable-line
          for (pName in propsMap) style[pName] = v; // eslint-disable-line
          return style;
        }
      };
    }
    function handleProvider(sidesSet) {
      return (p, camel, total, num, add) => {
        return p.suffix ? (
          (camel = p.camel) === 'A'
            ? normalizeDefault(p, 'Auto')
            : styleWrap(
                sidesSet(
                  camel
                    ? toKebabCase(camel)
                    : (
                      (num = p.num) == '0'
                        ? num
                        : (
                          num = (p.sign || '') + ((total = p.total)
                            ? toFixed(100 * parseFloat(num)
                              / parseFloat(total)) + '%'
                            : toFixed(num) + (p.unit || 'px')),
                          (add = p.add)
                            ? normalizeCalc(num, add)
                            : num
                        )
                    ),
                ),
                priority,
            )
        ) : normalizeDefault(p, 0);
      };
    }

    forIn({
      p: ['padding'],
      m: ['margin'],
      b: ['border', '-width'],
    }, (args, pfx) => {
      const propName = args[0];
      const propSuffix = args[1] || '';
      mn(pfx + suffix, handleProvider(
          sidesSetter((side) => propName + side + propSuffix),
      ), MARGIN_PATTERN, 1);
    });

    mn('s' + suffix, handleProvider(
      suffix
        ? sidesSetter((side) => replace(side, regexpTrimKebabLeft, ''))
        : (v) => (isDefined(v) && {
          top: v,
          bottom: v,
          left: v,
          right: v,
        }),
    ), MARGIN_PATTERN, 1);
    mn('bs' + suffix, (p, s, synonym) => {
      return (synonym = borderStyleSynonyms[s = p.suffix])
        ? normalizeDefault(p, synonym)
        : (
          s
            ? styleWrap(bsSidesSet(toKebabCase(s)), priority + 1)
            : normalizeDefault(p, 'Solid')
        );
    });
    mn('bc' + suffix, (p, v) => {
      return (v = p.value)
        ? styleWrap(bcSidesSet(
          p.suffix === 'CT'
            ? 'currentColor'
            : getColor(v || '0'),
        ), priority + 1)
        : normalizeDefault(p);
    }, COLOR_PATTERN, 1);
    mn('bi' + suffix, (p, s) => {
      return styleWrap(biSidesSet(
        (s = p.suffix)
          ? spaceNormalize(s[0] == '_' ? snakeLeftTrim(s) : toKebabCase(s))
          : 'none',
      ), priority + 1);
    });
  });

  forIn({
    sq: ['width', 'height'],
    w: ['width'],
    h: ['height'],
  }, (props, essencePrefix) => {
    const length = props.length;
    const priority = 2 - length;
    forEach(['', 'min', 'max'], (sfx) => {
      const propMap = {};
      let propName, i = 0; // eslint-disable-line
      for (; i < length; i++) {
        propName = props[i];
        propMap[sfx ? (sfx + '-' + propName) : propName] = 1;
      }
      mn(essencePrefix + sfx, (p) => {
        if (!p.suffix) return normalizeDefault(p, '100%');
        const camel = p.camel;
        const synonym = camel && sizeSynonyms[camel];
        if (synonym) return normalizeDefault(p, synonym);
        const style = {};
        // eslint-disable-next-line
        let propName, add, total, num = p.num, unit = p.unit || 'px', v;
        v = camel ? toKebabCase(camel) : (
          (total = p.total) && (
            unit = '%',
            num = toFixed(100 * parseFloat(num) / parseFloat(total))
          ),
          v = num ? (num == '0' ? num : (num + unit)) : '100%',
          (add = p.add) ? normalizeCalc(v, add) : v
        );
        for (propName in propMap) style[propName] = v; // eslint-disable-line
        return styleWrap(style, priority);
      }, WIDTH_PATTERN, 1);
    });
  });

  mn('tbl', styleWrap({display: 'table'}));
  mn('tbl.cell', {
    selectors: ['>*'],
    style: {
      display: 'table-cell',
      verticalAlign: 'middle',
    },
  });

  // flex horizontal align
  forIn({
    start: {boxPack: 'start', justifyContent: 'flex-start'},
    center: {boxPack: 'center', justifyContent: 'center'},
    end: {boxPack: 'end', justifyContent: 'flex-end'},
    around: {justifyContent: 'space-around'},
    between: {boxPack: 'justify', justifyContent: 'space-between'},
  }, (style, essenceName, name) => {
    mn(
        name = 'fha' + (essenceName = upperFirst(essenceName)),
        styleWrap(style, 1),
    );
    mn('fha' + essenceName[0], name);
  });

  // flex vertical align
  forIn({
    start: {
      boxAlign: 'start',
      alignItems: 'flex-start',
      alignContent: 'flex-start',
    },
    center: {
      boxAlign: 'center',
      alignItems: 'center',
      alignContent: 'center',
    },
    end: {
      boxAlign: 'end',
      alignItems: 'flex-end',
      alignContent: 'flex-end',
    },
    stretch: {
      boxAlign: 'stretch',
      alignItems: 'stretch',
      alignContent: 'stretch',
    },
  }, (style, essenceName) => {
    mn('fva' + upperFirst(essenceName), styleWrap(style, 1));
  });

  forIn({
    S: 'Start',
    C: 'Center',
    E: 'End',
    A: 'Around',
    ST: 'Stretch',
  }, (essenceName, abbr) => {
    mn('fva' + abbr, 'fva' + essenceName);
  });

  forIn({
    dn: 'transitionDuration',
    delay: 'transitionDelay',
  }, (propName, essenceName) => {
    mn(essenceName, (p, num) => {
      return p.camel || p.negative ? 0 : ((num = p.num)
        ? styleWrap({[propName]: num + 'ms'}, 1)
        : normalizeDefault(p, 250)
      );
    });
  });

  forIn({
    c: ['color'],
    stroke: ['stroke'],
    fill: ['fill'],
    olc: ['outlineColor', 1],
    bgc: ['backgroundColor', 1],
    temc: ['textEmphasisColor', 1],
    tdc: ['textDecorationColor', 1],
  }, (options, pfx) => {
    const propName = options[0];
    const priority = options[1] || 0;
    mn(pfx, (p, v, s) => {
      return (v = p.value)
        ? (
          s = {},
          s[propName] = p.suffix === 'CT'
            ? 'currentColor'
            : getColor(v || '0'),
          styleWrap(s, priority)
        )
        : normalizeDefault(p);
    }, COLOR_PATTERN);
  });

  forIn({
    // backgroundImage: url(...)
    bgi: 'backgroundImage',
    // listStyleImage: url(...)
    lisi: 'listStyleImage',
  }, (propName, name) => {
    mn(name, (p, style, url) => {
      style = {};
      style[propName] = (url = snakeLeftTrim(p.suffix))
        ? ('url("' + url + '")')
        : 'none';
      return styleWrap(style, 1);
    });
  });

  forIn({
    textAlign: {
      tl: 'left',
      tc: 'center',
      tr: 'right',
      tj: 'justify',
    },
    float: {
      lt: 'left',
      jt: 'none',
      rt: 'right',
    },
  }, (valsMap, propName) => {
    forIn(valsMap, (value, pfx) => {
      mn(pfx, (p) => {
        return p.suffix ? 0 : styleWrap({
          [propName]: value,
        });
      });
    });
  });

  mn('x', (p) => {
    const scale = p.s;
    const angle = p.angle;
    const z = p.z;
    return styleWrap({
      transform:
        'translate(' + ((p.x || '0') + (p.xu || 'px')) + ','
        + ((p.y || '0') + (p.yu || 'px')) + ')'
        + (z ? (' translateZ(' + (z || '0') + (p.zu || 'px') + ')') : '')
        + (scale ? (' scale(' + (0.01 * scale) + ')') : '')
        + (angle ? (' rotate' + upperCase(p.dir)
        + '(' + angle + (p.unit || 'deg') + ')') : ''),
    }); // eslint-disable-next-line
  }, '^(-?[0-9]+):x?(%):xu?([yY](-?[0-9]+):y(%):yu?)?([zZ](-?[0-9]+):z(%):zu?)?([sS]([0-9]+):s)?([rR](x|y|z):dir(-?[0-9]+):angle([a-z]+):unit?)?$');

  mn('spnr', (p, v) => {
    return isNaN(v = (v = p.value) ? parseInt(v) : 3000) || v < 1 ? 0 : (
      setKeyframes('spinner-animate', {
        from: {transform: 'rotateZ(0deg)'},
        to: {transform: 'rotateZ(360deg)'},
      }, 1),
      styleWrap({
        animation: 'spinner-animate ' + v + 'ms infinite linear',
      })
    );
  });

  forEach(['x', 'y', 'z'], (suffix) => {
    const prefix = 'rotate' + upperCase(suffix) + '(';
    mn('r' + suffix, (p, v) => {
      return (v = p.value) ? styleWrap({
        transform: prefix + v + (p.unit || 'deg') + ')',
      }) : normalizeDefault(p, 180);
    });
  });

  forIn(SHADOW_HANDLERS, ([propName, handler], pfx) => {
    mn(pfx, (p, output) => {
      const suffix = p.suffix;
      const style = {};
      if (suffix[0] === '_') {
        output = spaceNormalize(snakeLeftTrim(suffix));
      } else {
        const repeatCount = intval(p.m, 1, 0);
        const value = p.value;
        if (!value || repeatCount < 1) {
          style[propName] = 'none';
          return styleWrap(style);
        }

        const colors = getColor(p.c || '0');
        const prefixIn = p.in ? 'inset ' : '';
        const colorsLength = colors.length;
        let sample, v, color, i, ci = 0; // eslint-disable-line
        output = new Array(colorsLength);

        for (;ci < colorsLength; ci++) {
          color = colors[ci];
          sample = prefixIn
            + handler(p.x || 0, p.y || 0, value, p.r || 0, color).join('px ');
          v = new Array(repeatCount);
          for (i = repeatCount; i--;) v[i] = sample;
          output[ci] = v.join(',');
        }
      }
      style[propName] = output;
      return styleWrap(style);
    }, SHADOW_PATTERNS);
  });


  // border-radius by sides
  forIn({
    lt: 'top-left',
    lb: 'bottom-left',
    rt: 'top-right',
    rb: 'bottom-right',
  }, (side, suffix) => {
    const propName = 'border-' + side + '-radius';
    mn('r' + suffix, (p, style) => {
      return p.camel || p.negative ? 0 : (
        style = {},
        style[propName] = (p.num || 10000) + (p.unit || 'px'),
        styleWrap(style, 2)
      );
    });
  });

  forIn({
    f: ['fontSize', 14, 1, {
      I: 'Inherit',
    }],
    r: ['borderRadius', 10000],
    sw: ['strokeWidth'],
    olw: ['outlineWidth', 0, 1],
  }, (options, pfx) => {
    const [propName, defaultValue] = options;
    const priority = options[2] || 0;
    const synonyms = options[3] || {};
    mn(pfx, (p, style, camel, synonym) => {
      return (synonym = synonyms[p.suffix])
        ? normalizeDefault(p, synonym)
        : !p.negative && (
          style = {},
          style[propName] = (camel = p.camel)
            ? toKebabCase(camel)
            : (p.num || defaultValue) + (p.unit || 'px'),
          styleWrap(style, priority)
        );
    });
  });

  forIn({'': 0, x: 1, y: 1}, (priority, suffix) => {
    mn('ov' + suffix, synonymProvider('overflow' + upperCase(suffix), {
      '': 'Hidden',
      V: 'Visible',
      H: 'Hidden',
      S: 'Scroll',
      A: 'Auto',
    }, priority));
  });


  mn({
    cfx: {
      style: {position: 'static'},
      childs: {
        pale: {
          selectors: [':before', ':after'],
          style: {content: '" "', clear: 'both', display: 'table'},
        },
      },
    },

    tbl: synonymProvider('tableLayout', {
      A: 'Auto',
      F: 'Fixed',
    }),

    layout: styleWrap({
      display: ['-webkit-box', '-webkit-flex', 'flex'],
    }),

    layoutRow: {
      exts: ['layout'],
      style: {
        boxDirection: 'normal',
        boxOrient: 'horizontal',
        flexDirection: 'row',
        boxPack: 'start',
        justifyContent: 'flex-start',
        boxAlign: 'center',
        alignItems: 'center',
        alignContent: 'center',
      },
    },

    layoutColumn: {
      exts: ['layout'],
      style: {
        boxDirection: 'normal',
        boxOrient: 'vertical',
        flexDirection: 'column',
      },
    },

    olcI: 'olcInvert',

    // background: (...)
    bg: (p, v) => {
      return !p.negative && ((v = p.suffix) ? styleWrap({
        background: v === 'CT' ? 'currentColor' : colorGetBackground(v),
      }) : normalizeDefault(p));
    },

    // font-weight
    fw: (p, camel, synonym) => {
      camel = p.camel;
      synonym = camel && fontWeightSynonyms[camel];
      return synonym ? normalizeDefault(p, synonym) : !p.negative && styleWrap({
        fontWeight: camel
          ? toKebabCase(camel)
          : (100 * intval(p.num, 1, 1, 9)),
      }, 1);
    },

    // position
    posR: stylePosition('relative', 0),
    posA: stylePosition('absolute', 1),
    posF: stylePosition('fixed', 2),
    posS: stylePosition('static', 3),
    pos: 'posR',
    rlv: 'posR',
    abs: 'posA',
    fixed: 'posF',
    'static': 'posS', // eslint-disable-line

    olwTN: 'olwThin',
    olwM: 'olwMedium',
    olwTC: 'olwThick',
    'break': styleWrap({ // eslint-disable-line
      whiteSpace: 'normal',
      wordBreak: 'break-word',
    }),
    z: (p, num) => {
      return p.camel ? 0 : ((num = p.num) ? styleWrap({
        zIndex: num,
      }) : normalizeDefault(p, 1));
    },
    o: (p, num) => {
      return p.camel || p.negative ? 0 : ((num = p.num) ? styleWrap({
        opacity: toFixed((p.num || 0) * 0.01),
      }) : normalizeDefault(p));
    },
    lh: (p, num, unit) => {
      return p.camel ? 0 : (
        unit = p.unit,
        (num = p.num) ? styleWrap({
          lineHeight: num == '0' ? num : (
            unit === '%' ? toFixed(num * 0.01) : (num + (unit || 'px'))
          ),
        }) : normalizeDefault(p, '100%')
      );
    },
    tsa: (p, num, camel) => {
      return p.negative ? 0 : (p.value ? styleWrap({
        textSizeAdjust: (camel = p.camel)
          ? toKebabCase(camel)
          : ((num = p.num) == '0' ? num : (num + (p.unit || 'px'))),
      }) : normalizeDefault(p, '100%'));
    },
    fsa: (p, num, camel) => {
      return p.negative ? 0 : (p.value ? styleWrap({
        fontSizeAdjust: (camel = p.camel)
          ? (camel == 'N' ? 'none' : toKebabCase(camel))
          : ((num = p.num) == '0' ? num : (num + (p.unit || 'px'))),
      }) : 0);
    },
    olo: (p, num, camel) => {
      return (p.value ? styleWrap({
        outlineOffset: (camel = p.camel)
          ? toKebabCase(camel)
          : ((num = p.num) == '0' ? num : (num + (p.unit || 'px'))),
      }) : normalizeDefault(p));
    },
    d: synonymProvider('display', {
      '': 'Block',
      B: 'Block',
      N: 'None',
      F: 'Flex',
      IF: 'InlineFlex',
      I: 'Inline',
      IB: 'InlineBlock',
      LI: 'ListItem',
      RI: 'RunIn',
      CP: 'Compact',
      TB: 'Table',
      ITB: 'InlineTable',
      TBCP: 'TableCaption',
      TBCL: 'TableColumn',
      TBCLG: 'TableColumnGroup',
      TBHG: 'TableHeaderGroup',
      TBFG: 'TableFooterGroup',
      TBR: 'TableRow',
      TBRG: 'TableRowGroup',
      TBC: 'TableCell',
      RB: 'Ruby',
      RBB: 'RubyBase',
      RBBG: 'RubyBaseGroup',
      RBT: 'RubyText',
      RBTG: 'RubyTextGroup',
    }),
    cl: synonymProvider('clear', {
      '': 'Both',
      B: 'Both',
      N: 'None',
      L: 'Left',
      R: 'Right',
    }),
    v: synonymProvider('visibility', {
      '': 'Hidden',
      V: 'Visible',
      H: 'Hidden',
      C: 'Collapse',
    }),
    ovs: synonymProvider('overflowStyle', {
      '': 'Scrollbar',
      S: 'Scrollbar',
      A: 'Auto',
      P: 'Panner',
      M: 'Move',
      MQ: 'Marquee',
    }),
    cp: synonymProvider('clip', {
      A: 'Auto',
      R: 'Rect\\(top_right_bottom_left\\)',
    }),
    rsz: synonymProvider('resize', {
      '': 'None',
      N: 'None',
      B: 'Both',
      H: 'Horizontal',
      V: 'Vertical',
    }),
    cr: synonymProvider('cursor', {
      '': 'Pointer',
      A: 'Auto',
      D: 'Default',
      C: 'Crosshair',
      HA: 'Hand',
      HE: 'Help',
      M: 'Move',
      P: 'Pointer',
      T: 'Text',
      NA: 'NotAllowed',
    }),
    jc: synonymProvider('justifyContent', {
      '': 'Center',
      C: 'Center',
      FE: 'FlexEnd',
      FS: 'FlexStart',
      SA: 'SpaceAround',
      SB: 'SpaceBetween',
    }),
    ai: synonymProvider('alignItems', {
      '': 'Center',
      C: 'Center',
      B: 'Baseline',
      FE: 'FlexEnd',
      FS: 'FlexStart',
      S: 'Stretch',
    }),
    bxz: synonymProvider('boxSizing', {
      '': 'BorderBox',
      BB: 'BorderBox',
      CB: 'ContentBox',
    }),
    fs: synonymProvider('fontStyle', {
      '': 'Italic',
      N: 'Normal',
      I: 'Italic',
      O: 'Oblique',
    }, 1),
    fv: synonymProvider('fontVariant', {
      N: 'Normal',
      SC: 'SmallCaps',
    }, 1),
    fef: synonymProvider('fontEffect', {
      N: 'None',
      EG: 'Engrave',
      EB: 'Emboss',
      O: 'Outline',
    }, 1),
    fsm: synonymProvider('fontSmooth', {
      A: 'Auto',
      N: 'Never',
      AW: 'Always',
    }, 1),
    fst: synonymProvider('fontStretch', {
      N: 'Normal',
      UC: 'UltraCondensed',
      EC: 'ExtraCondensed',
      C: 'Condensed',
      SC: 'SemiCondensed',
      SE: 'SemiExpanded',
      E: 'Expanded',
      EE: 'ExtraExpanded',
      UE: 'UltraExpanded',
    }, 1),
    tal: synonymProvider('textAlignLast', {
      A: 'Auto',
      L: 'Left',
      C: 'Center',
      R: 'Right',
      J: 'Justify',
      E: 'End',
      S: 'Start',
    }, 1),
    td: synonymProvider('textDecoration', tdSynonyms),
    tdl: synonymProvider('textDecorationLine', tdSynonyms, 1),
    tj: synonymProvider('textJustify', {
      A: 'Auto',
      IW: 'InterWord',
      II: 'InterIdeograph',
      IC: 'InterCluster',
      D: 'Distribute',
      K: 'Kashida',
      T: 'Tibetan',
    }),
    tov: synonymProvider('textOverflow', {
      '': 'Ellipsis',
      C: 'Clip',
      E: 'Ellipsis',
    }),
    tt: synonymProvider('textTransform', {
      '': 'Uppercase',
      N: 'None',
      C: 'Capitalize',
      U: 'Uppercase',
      L: 'Lowercase',
      FL: 'FullWidth',
      FSK: 'FullSizeKana',
    }),
    tw: synonymProvider('textWrap', {
      N: 'Normal',
      NO: 'None',
      U: 'Unrestricted',
      S: 'Suppress',
    }),
    lts: synonymProvider('letterSpacing', {
      N: 'Normal',
    }),
    ws: synonymProvider('whiteSpace', {
      '': 'Nowrap',
      N: 'Normal',
      P: 'Pre',
      NW: 'Nowrap',
      PW: 'PreWrap',
      PL: 'PreLine',
      BS: 'BreakSpaces',
    }),
    wsc: synonymProvider('whiteSpaceCollapse', {
      N: 'Normal',
      K: 'KeepAll',
      L: 'Loose',
      BS: 'BreakStrict',
      BA: 'BreakAll',
    }),
    wb: synonymProvider('wordBreak', {
      N: 'Normal',
      K: 'KeepAll',
      BA: 'BreakAll',
    }),
    ww: synonymProvider('wordWrap', {
      N: 'None',
      NM: 'Normal',
      U: 'Unrestricted',
      S: 'Suppress',
      B: 'BreakWord',
    }),
    bgr: synonymProvider('backgroundRepeat', {
      '': 'Repeat',
      R: 'Repeat',
      N: 'NoRepeat',
      X: 'RepeatX',
      Y: 'RepeatY',
      SP: 'Space',
      RD: 'Round',
    }, 1),
    bga: synonymProvider('backgroundAttachment', {
      F: 'Fixed',
      S: 'Scroll',
      L: 'Local',
    }, 1),
    bgbk: synonymProvider('backgroundBreak', {
      BB: 'BoundingBox',
      EB: 'EachBox',
      C: 'Continuous',
    }, 1),
    bgcp: synonymProvider('backgroundClip', {
      '': 'PaddingBox',
      BB: 'BorderBox',
      PB: 'PaddingBox',
      CB: 'ContentBox',
      NC: 'NoClip',
      T: 'Text',
    }, 1),
    bgo: synonymProvider('backgroundOrigin', {
      BB: 'BorderBox',
      PB: 'PaddingBox',
      CB: 'ContentBox',
    }, 1),
    bgs: synonymProvider('backgroundSize', {
      A: 'Auto',
      CT: 'Contain',
      CV: 'Cover',
    }, 1),
    q: synonymProvider('quotes', {
      A: 'Auto',
      N: 'None',
      RU: `'\\00AB'_'\\00BB'_'\\201E'_'\\201C'`,
      EN: `'\\201C'_'\\201D'_'\\2018'_'\\2019'`,
    }, 1),
    ol: synonymProvider('outline', outlineStyleSynonyms),
    ols: synonymProvider('outlineStyle', outlineStyleSynonyms, 1),
    cps: synonymProvider('captionSide', {
      T: 'Top',
      B: 'Bottom',
      L: 'Left',
      R: 'Right',
      TO: 'TopOutside',
      BO: 'BottomOutside',
    }),
    ec: synonymProvider('emptyCells', {
      S: 'Show',
      H: 'Hide',
    }),
    bdcl: synonymProvider('borderCollapse', {
      C: 'Collapse',
      S: 'Separate',
    }, 1),
    lis: synonymProvider('listStyle', {
      N: 'None',
      S: 'Square',
      D: 'Disc',
      DC: 'Decimal',
      DCLZ: 'DecimalLeadingZero',
      LR: 'LowerRoman',
      UR: 'UpperRoman',
      C: 'Circle',
      I: 'Inside',
      O: 'Outside',
    }),
    lisp: synonymProvider('listStylePosition', {
      I: 'Inside',
      O: 'Outside',
    }, 1),
    list: synonymProvider('listStyleType', {
      N: 'None',
      S: 'Square',
      D: 'Disc',
      DC: 'Decimal',
      DCLZ: 'DecimalLeadingZero',
      LR: 'LowerRoman',
      UR: 'UpperRoman',
      C: 'Circle',
    }, 1),
    pgbb: synonymProvider([
      'pageBreakBefore', 'breakBefore',
    ], breakAfterSynonyms),
    pgba: synonymProvider([
      'pageBreakAfter', 'breakAfter',
    ], breakAfterSynonyms),
    pgbi: synonymProvider(['pageBreakInside', 'breakInside'], {
      A: 'Auto',
      AV: 'Avoid',
      AVP: 'AvoidPage',
      AVC: 'AvoidColumn',
      AVRN: 'AvoidRegion',
    }),
    us: synonymProvider('userSelect', {
      A: 'Auto',
      N: 'None',
      T: 'Text',
      C: 'Contain',
      E: 'Element',
    }),
    e: synonymProvider('pointerEvents', {
      A: 'Auto',
      N: 'None',
      V: 'Visible',
      VP: '_visiblePainted',
      VF: '_visibleFill',
      VS: '_visibleStroke',
      P: 'Painted',
      F: 'Fill',
      S: 'Stroke',
    }),
    as: synonymProvider('alignSelf', {
      A: 'Auto',
      N: 'Normal',
      B: 'Baseline',
      C: 'Center',
      FS: 'FlexStart',
      FE: 'FlexEnd',
      SS: 'SelfStart',
      SE: 'SelfEnd',
      S: 'Start',
      E: 'End',
      ST: 'Stretch',
      FB: 'First_baseline',
      LB: 'Last_baseline',
    }),
    ac: synonymProvider('alignContent', {
      C: 'Center',
      FS: 'FlexStart',
      FE: 'FlexEnd',
      SB: 'SpaceBetween',
      SA: 'SpaceAround',
      ST: 'Stretch',
    }),
    va: synonymProvider('verticalAlign', {
      SUP: 'Super',
      T: 'Top',
      TT: 'TextTop',
      M: 'Middle',
      BL: 'Baseline',
      B: 'Bottom',
      TB: 'TextBottom',
    }),
    wm: synonymProvider('writingMode', {
      '': 'LrTb',
      BTL: 'BtLr',
      BTR: 'BtRl',
      LRB: 'LrBt',
      LRT: 'LrTb',
      RLB: 'RlTb',
      TBL: 'TbLr',
      TBR: 'TbRl',
      HT: 'HorizontalTb',
      HB: 'HorizontalBt',
      VR: 'VerticalRl',
      VL: 'VerticalLr',
    }),
    font: (p, s) => {
      return (s = p.s) && styleWrap({
        font: spaceNormalize(s[0] == '_' ? snakeLeftTrim(s) : toKebabCase(s)),
      });
    },
    ff: (p, s) => {
      return (s = p.suffix) && styleWrap({
        fontFamily: map(
            spaceNormalize(s[0] == '_' ? snakeLeftTrim(s) : toKebabCase(s))
                .split(regexpComma)
            , __wr).join(','),
      }, 1);
    },
    cnt: (p, s, v) => {
      return (s = p.suffix) == '_'
        ? normalizeDefault(p, '\'_\'')
        : styleWrap({
          content: s ? spaceNormalize(
            s[0] == '_' ? (snakeLeftTrim(s) || '" "') : toKebabCase(s),
          ) : 'none',
        });
    },
    ft: (p, v) => {
      return (v = filter(map(
          p.suffix.split(regexpFilterSep),
          (v, matchs, name, options) => {
            return v && (matchs = regexpFilterName.exec(v)) ? (
              options = FILTER_MAP[name = lowerFirst(matchs[1])],
              camelToKebabCase(options && options[0] || name)
                + '(' + (matchs[2] || options && options[1] || '')
                + (matchs[3] || options && options[2] || '') + ')'
            ) : 0;
          },
      )).join(' ')) ? styleWrap({
        filter: v,
      }) : 0;
    },
  });

  forIn({
    wid: ['widows'],
    orp: ['orphans'],
    coi: ['counterIncrement'],
    cor: ['counterReset'],
    wos: ['wordSpacing'],
    apc: ['appearance'],

    ti: ['textIndent'],

    tn: ['transition'],
    tp: ['transitionProperty', 1],
    ttf: ['transitionTimingFunction', 1],

    bgp: ['backgroundPosition', 1],
    bgpx: ['backgroundPositionX', 1],
    bgpy: ['backgroundPositionY', 1],

    g: ['grid'],
    gt: ['gridTemplate', 1],
    gtc: ['gridTemplateColumns', 2],
    gtr: ['gridTemplateRows', 2],
    gac: ['gridAutoColumns', 1],
    gar: ['gridAutoRows', 1],
    gaf: ['gridAutoFlow', 1],

    gg: ['gridGap', 1],
    ggc: ['gridColumnGap', 2],
    ggr: ['gridRowGap', 2],

    gr: ['gridRow', 1],
    gc: ['gridColumn', 1],

    fx: ['flex'],
    fxd: ['flexDirection', 1],
    fxb: ['flexBasis', 1],
    fxf: ['flexFlow', 1],
    fxw: ['flexWrap', 1],
    fxg: ['flexGrow', 1],
    fxs: ['flexShrink', 1],

    or: ['order'],
    tds: ['textDecorationSkip', 1],
    tdsi: ['textDecorationSkipInk', 2],
    tdt: ['textDecorationThickness', 1],

    ts: ['transformStyle'],
    mbm: ['mixBlendMode'],
    bsp: ['borderSpacing'],
    bdrs: ['borderRadius'],
    zm: ['zoom'],
    tem: ['textEmphasis'],
    temp: ['textEmphasisPosition', 1],
    tems: ['textEmphasisStyle', 1],
  }, ([propName, priority], essenceName) => {
    mn(essenceName, (p, s, style) => {
      return (s = p.suffix)
        ? (style = {}, style[propName] = spaceNormalize(
            s[0] == '_'
              ? snakeLeftTrim(s)
              : toKebabCase(s),
        ), styleWrap(style, priority || 0))
        : 0;
    });
  });

  /*
  forIn({
    '': 'width',
    l: 'marginLeft',
    r: 'marginRight',
  }, (propName, suffix) => {
    mn('col' + suffix, (p, style, add, v) => {
      if (!p.suffix) return normalizeDefault(p, '12/12');
      return p.camel || p.other ? 0 : {
        exts: ['hmin1-i'],
        style: (
          v = toFixed(
              100 * parseFloat(p.num || 12) / parseFloat(p.total || 12),
          ) + '%',
          style = {},
          style[propName] = (add = p.add)
            ? normalizeCalc(v, add)
            : v,
          style
        ),
      };
    }, WIDTH_PATTERN, 1);
  });
  */

  mn('ratio', (p, add, v) => {
    return p.other ? 0 : (
      v = '' + (100 * floatval(p.oh || p.h || 100, 1, 1)
        / floatval(p.w || 100, 1, 1)) + '% ',
      {
        style: {
          position: 'relative',
          paddingTop: (add = p.add) ? normalizeCalc(v, add) : v,
        },
        childs: {
          overlay: {
            selectors: ['>*'],
            exts: ['abs' + p.ni, 's' + p.ni],
          },
        },
      }
    );
  // eslint-disable-next-line
  }, '^((((\\d+):w)x((\\d+):h))|(\\d+):oh)?([-+]\\d+):add?|(.*):other', 1);
};
