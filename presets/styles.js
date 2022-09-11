/**
 * @overview Minimalist-Notation preset "default styles"
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */

/* eslint quote-props: ["error", "as-needed"] */
const regexpComma = /(?:\s*,\s*)+/;
const regexpTrimSnakeLeft = /^_+/g;
const regexpTrimKebabLeft = /^-+/g;
const reZero =/^0+|\.?0+$/g;
const regexpFilterName = /^([A-Za-z]+)([0-9]*)(.*)$/;
const regexpFilterSep = /_+/;
const regexpDots = /\./g;


const PATTERN_VAR = '((-):env?((--[^;,]+)(,\\d+([a-z%]+):vu?):va?):vv;?)';
// eslint-disable-next-line
const PATTERN_VAR_ADD = '(-):nva?((--[^;,]+)(,[0-9\\.]+([a-z%]+):vua?):vaa?):vva;?';
const PATTERN_DIGITS = '(-?[0-9\\.]+)';

// eslint-disable-next-line
const PATTERN_BASE_COLOR = '([A-Z][a-z][A-Za-z]+):camel|([A-Fa-f0-9]+(\\.[0-9]+)?):color|(-?--[^;]+):vv';
const PATTERN_COLOR = '^(' + PATTERN_BASE_COLOR + '):value';

const PATTERN_VAL = '^(((([A-Za-z]+):otherName|([-]):sign?'
  + PATTERN_DIGITS + ':num(/' + PATTERN_DIGITS
  + ':total?)?):value([a-z%]+):unit?)|'
  + PATTERN_VAR + '):vl(([-+]):sa(([0-9\\.]+):addv([a-z%]+):addu?|'
  + PATTERN_VAR_ADD + ')):add?$';


const SHADOW_PATTERNS = [
  '(r|R)(\\-?[0-9]+):r',
  '(x|X)(\\-?[0-9]+):x',
  '(y|Y)(\\-?[0-9]+):y',
  '(m|M)([0-9]+):m',
  'c(' + PATTERN_BASE_COLOR + '):c',
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
const COLOR_SYNONYMS = {
  CT: 'CurrentColor',
  T: 'Transparent',
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
const UNITS = 'em,ex,%,px,cm,mm,in,pt,pc,ch,rem,vh,vw,vmin,vmax'.split(',');


function throwInvalid(message) {
  throw new Error(message || 'Parameter is invalid');
}
function floatNormalize(v, nosign) {
  const m = v && v.match(regexpDots);
  (m && m.length > 1 || isNaN(v = parseFloat(v)) || (v < 0 && nosign))
    && throwInvalid();
  return v;
}

function replace(v, from, to) {
  return ('' + v).replace(from, to);
}
function snakeLeftTrim(v) {
  return replace(v, regexpTrimSnakeLeft, '');
}
function styleWrap(style, priority) {
  return {style, priority: priority || 0};
}
function toFixed(v) {
  isNaN(v = v * 100) && throwInvalid();
  return replace((Math.floor(v) * 0.01).toFixed(2), reZero, '') || '0';
}
function normalizeDefault(p, def) {
  return {
    exts: [p.name + (def || 0) + p.ni],
  };
}
function stylePosition(position, priority) {
  return styleWrap({
    position: position,
  }, priority);
}
function __wr(v) {
  return v[0] == '-'
    ? '"' + v.substr(1) + '"'
    : (
      v.indexOf(' ') > -1 ? '"' + v + '"' : v
    );
}
function calc(v, sign, add) {
  return 'calc(' + v + ' ' + sign + ' ' + add + ')';
}


module.exports = (mn) => {
  const {
    utils,
    setKeyframes,
  } = mn;
  const {
    isDefined,
    map,
    filter,
    forIn,
    forEach,
    upperFirst,
    lowerFirst,
    toUpper,
    camelToKebabCase,
    isArray,
    flags,
    size,
    intval,
    floatval,
    color: getColor,
    colorGetBackground,
    spaceNormalize,
    routeParseProvider,
    indexOf,
  } = utils;

  const parseVals = routeParseProvider(PATTERN_VAL);


  function validateUnit(unit) {
    if (!unit || indexOf(UNITS, unit) > -1) return unit;
    throwInvalid('Unit "' + unit + '" is invalid');
  }
  function getVal(
      suffix,
      positive,
      one,
      defaultUnit,
      noOtherName,
      symonyms,
      seprarator,
  ) {
    defaultUnit = defaultUnit || 'px';
    const parts = ('' + suffix).split('_');
    const l = parts.length;
    one && l > 1 && throwInvalid('There must be one parameter');
    l > 4 && throwInvalid('There should not be more than 4 parameters');
    const output = new Array(l);
    let i = 0;
    let otherName;
    let add;
    let total;
    let vv;
    let vva;
    let num;
    let val;
    let p;
    let sa;
    for (; i < l; i++) {
      parseVals(parts[i], p = {});
      if (otherName = p.otherName) {
        noOtherName && throwInvalid();
        output[i] = toKebabCase(symonyms && symonyms[otherName] || otherName);
        continue;
      }
      p.vl || throwInvalid();
      num = p.num;
      vv = p.vv;
      add = p.add;
      total = p.total;
      vva = p.vva;
      sa = p.sa;
      val = num == '0'
        ? num
        : (
          vv ? (
            (p.env ? 'env(' : 'var(') + vv
              + (p.va ? (validateUnit(p.vu) ? '' : defaultUnit) : '') + ')'
          ) : (p.sign || '') + (
            total
              ? toFixed(100 * floatNormalize(num, positive)
                / floatNormalize(total, positive)) + '%'
              : toFixed(num) + validateUnit(p.unit || defaultUnit)
          )
        );
      output[i] = add ? calc(
          val,
          sa,
          vva
            ? ((p.nva ? 'env(' : 'var(') + vva
              + (p.vaa ? (validateUnit(p.vua) ? '' : defaultUnit) : '') + ')')
            : ('' + floatNormalize(p.addv)
              + validateUnit(p.addu || defaultUnit)),
      ) : val;
    }
    return [
      output.join(seprarator || ' '),
      l - 1,
    ];
  }

  function toKebabCase(v) {
    return camelToKebabCase(lowerFirst(v));
  }
  function fontNameNormalize(s, c) {
    c = s[0];
    return spaceNormalize(
        c == '_'
          ? snakeLeftTrim(s)
          : (
            c == '\'' || c == '-'
              ? s
              : toKebabCase(s)
          ),
    );
  }
  function synonymProvider(propName, synonyms, priority, props) {
    return isArray(propName)
      ? (props = flags(propName), ((p, s, style, synonym, propName) => {
        if (synonym = synonyms[s = p.suffix]) {
          return normalizeDefault(p, synonym);
        }
        if (s) {
          s = fontNameNormalize(s);
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
        isDefined(v) || throwInvalid();
        let style = {}, pName; // eslint-disable-line
        for (pName in propsMap) style[pName] = v; // eslint-disable-line
        return style;
      };
    }

    function handleProvider(sidesSet, nosign, one) {
      return (p, suffix, synonym) => {
        if (!(suffix = p.suffix)) {
          return normalizeDefault(p, 0);
        }
        if (synonym = sizeSynonyms[suffix]) {
          return normalizeDefault(p, synonym);
        }
        const v = getVal(suffix, nosign, one, 'px', 0, sizeSynonyms);
        return styleWrap(sidesSet(v[0]), priority + v[1]);
      };
    }

    forIn({
      p: ['padding', 0, 1],
      m: ['margin'],
      b: ['border', '-width', 1],
    }, (args, pfx) => {
      const propName = args[0];
      const propSuffix = args[1] || '';
      mn(pfx + suffix, handleProvider(
          sidesSetter((side) => propName + side + propSuffix),
          args[2],
          suffix,
      ), 0, 1);
    });

    mn('s' + suffix, handleProvider(
      suffix
        ? sidesSetter((side) => replace(side, regexpTrimKebabLeft, ''))
        : (v) => (isDefined(v) ? {
          top: v,
          bottom: v,
          left: v,
          right: v,
        } : throwInvalid()),
      0,
      1,
    ), 0, 1);
    mn('bs' + suffix, (p, s, synonym) => {
      return (synonym = borderStyleSynonyms[s = p.suffix])
        ? normalizeDefault(p, synonym)
        : (
          s
            ? styleWrap(bsSidesSet(toKebabCase(s)), priority + 1)
            : normalizeDefault(p, 'Solid')
        );
    });
    mn('bc' + suffix, (p, v, suffix, synonym) => {
      return (synonym = COLOR_SYNONYMS[suffix = p.suffix || 'CT'])
        ? normalizeDefault(p, synonym)
        : (
          (v = p.value)
            ? styleWrap(bcSidesSet(getColor(v)), priority + 1)
            : normalizeDefault(p)
        );
    }, PATTERN_COLOR, 1);
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
        const suffix = p.suffix;
        if (!suffix) return normalizeDefault(p, '100%');
        const synonym = sizeSynonyms[suffix];
        if (synonym) return normalizeDefault(p, synonym);
        const v = getVal(suffix, 1, 1, 'px', 0, sizeSynonyms);
        const [value] = v;
        const style = {};
        let propName;
        for (propName in propMap) style[propName] = value; // eslint-disable-line
        return styleWrap(style, priority + v[1]);
      }, 0, 1);
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
    mn(pfx, (p, s, suffix, v, synonym) => {
      return (synonym = COLOR_SYNONYMS[suffix = p.suffix || 'CT'])
        ? normalizeDefault(p, synonym)
        : (
          v = p.value,
          v || throwInvalid(),
          s = {},
          s[propName] = getColor(v),
          styleWrap(s, priority)
        );
    }, PATTERN_COLOR);
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
        'translate(' + (floatNormalize(p.x || '0') + (p.xu || 'px')) + ','
        + (floatNormalize(p.y || '0') + (p.yu || 'px')) + ')'
        + (z ? (' translateZ('
          + floatNormalize(z || '0') + (p.zu || 'px') + ')') : '')
        + (scale ? (' scale(' + (0.01 * floatNormalize(scale)) + ')') : '')
        + (angle ? (' rotate' + toUpper(p.dir)
        + '(' + floatNormalize(angle) + (p.unit || 'deg') + ')') : ''),
    }); // eslint-disable-next-line
  }, '^' + PATTERN_DIGITS + ':x?(%):xu?([yY]' + PATTERN_DIGITS
    + ':y(%):yu?)?([zZ]' + PATTERN_DIGITS
    + ':z(%):zu?)?([sS]([0-9\\.]+):s)?([rR](x|y|z):dir'
    + PATTERN_DIGITS + ':angle([a-z]+):unit?)?$');

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
    const prefix = 'rotate' + toUpper(suffix) + '(';
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


  mn('r', (p) => {
    const v = getVal(p.suffix || 10000, 1, 0, 'px', 1);
    return styleWrap({
      borderRadius: v[0],
    }, v[1]);
  }, 0, 1);


  // border-radius by sides
  forIn({
    lt: 'top-left',
    lb: 'bottom-left',
    rt: 'top-right',
    rb: 'bottom-right',
  }, (side, suffix) => {
    const propName = 'border-' + side + '-radius';
    mn('r' + suffix, (p) => {
      const style = {};
      style[propName] = getVal(p.suffix || 10000, 1, 1, 'px', 1)[0];
      return styleWrap(style, 2);
    }, 0, 1);
  });


  forIn({
    f: ['fontSize', '', 1, 1, {
      I: 'Inherit',
    }],
    sw: ['strokeWidth', 0],
    olw: ['outlineWidth', 0, 1],
    gg: ['gridGap', 0, 1, 0, {
      U: 'Unset',
    }],
    ggc: ['gridColumnGap', 0, 2, 0, {
      U: 'Unset',
      R: 'Revert',
      N: 'Normal',
    }],
    ggr: ['gridRowGap', 0, 2, 0, {
      U: 'Unset',
      R: 'Revert',
    }],
  }, (options, pfx) => {
    const [propName, defaultValue] = options;
    const priority = options[2] || 0;
    const one = options[3];
    const synonyms = options[4] || {};
    mn(pfx, (p, style, suffix, synonym, v) => {
      return (synonym = synonyms[suffix = p.suffix])
        ? normalizeDefault(p, synonym)
        : (
          v = getVal(suffix || defaultValue,
              1, one, 'px', 0, synonyms),
          style = {},
          style[propName] = v[0],
          styleWrap(style, priority + v[1])
        );
    });
  }, 0, 1);


  forIn({'': 0, x: 1, y: 1}, (priority, suffix) => {
    const propName = 'overflow' + toUpper(suffix);
    const handle = synonymProvider(propName, {
      '': 'Hidden',
      V: 'Visible',
      H: 'Hidden',
      S: 'Scroll',
      A: 'Auto',
    }, priority);

    mn('ov' + suffix, function() {
      // eslint-disable-next-line
      const essence = handle.apply(this, arguments);
      if (essence) {
        const s = essence.style;
        const v = s && s[propName];
        if (v === 'scroll' || v === 'auto') {
          essence.exts = ['ovscT'];
        }
      }
      return essence;
    });
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
      p.negative && throwInvalid();
      return (v = p.suffix) ? styleWrap({
        background: colorGetBackground(v),
      }) : normalizeDefault(p);
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

    of: synonymProvider('objectFit', {
      '': 'Cover',
      F: 'Fill',
      CT: 'Contain',
      CV: 'Cover',
      N: 'None',
      SD: 'ScaleDown',
    }),

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
    ovsc: synonymProvider('-webkitOverflowScrolling', {
      '': 'Touch',
      A: 'Auto',
      T: 'Touch',
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
      N: 'None',
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
      U: 'Unset',
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
    fxd: synonymProvider('flexDirection', {
      C: 'Column',
      CR: 'ColumnReverse',
      R: 'Row',
      RR: 'RowReverse',
      U: 'Unset',
    }, 1),
    font: (p, s) => {
      return (s = p.suffix) && styleWrap({
        font: spaceNormalize(s),
      });
    },
    ff: (p, s) => {
      return (s = p.suffix) && styleWrap({
        fontFamily: map(fontNameNormalize(s).split(regexpComma), __wr)
            .join(','),
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

    gr: ['gridRow', 1],
    gc: ['gridColumn', 1],

    fx: ['flex'],
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
    // bdrs: ['borderRadius'],
    zm: ['zoom'],
    tem: ['textEmphasis'],
    temp: ['textEmphasisPosition', 1],
    tems: ['textEmphasisStyle', 1],
    ir: ['imageRendering'],
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

  mn('ratio', (p, add, v) => {
    p.other && throwInvalid();
    return (
      v = '' + toFixed(100 * floatval(p.oh || p.h || 100, 1, 1)
        / floatval(p.w || 100, 1, 1)) + '%',
      {
        style: {
          position: 'relative',
          paddingTop: p.add
            ? normalizeCalc(
                v,
                p.sa + floatNormalize(p.addv),
                validateUnit(p.addu || 'px'),
            )
            : v,
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
  }, '^((((\\d+):w)x((\\d+):h))|(\\d+):oh)?(([-+]):sa([0-9\\.]+):addv([a-z%]+):addu?):add?|(.*):other', 1);


  mn({
    contrast: styleWrap({
      imageRendering: [
        'optimize-contrast',
        '-webkit-optimize-contrast',
      ],
    }),
  });
};
