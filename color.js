/**
 * @overview color
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

const round = Math.round;

const regexpColor = /^[A-Fa-f0-9]+$/;
const color = module.exports = v => regexpColor.test(v) ? rgbaAlt(__normalize(v)) : [ v.toLowerCase() ];


const __normalize = color.normalize = (v) => {
  if (!v) return [0, 0, 0, 1];
  let l = v.length;
  if (l < 2) {
    v += v;
    return getCore([ v, v, v ]);
  }
  if (l < 3) {
    let w = v[0] + v[0];
    return getCore([ w, w, w, v[1] + v[1] ]);
  }
  if (l < 5) return getCore([ v[0] + v[0], v[1] + v[1], v[2] + v[2], v[3] + v[3] ]);
  if (l < 6) return getCore([ v[0] + v[0], v[1] + v[1], v[2] + v[2], v.substr(3, 2) ]);
  if (l < 7) return getCore([ v.substr(0, 2), v.substr(2, 2), v.substr(4, 2) ]);
  if (l < 8) return getCore([ v.substr(0, 2), v.substr(2, 2), v.substr(4, 2), v[6] + v[6] ]);
  return getCore([ v.substr(0, 2), v.substr(2, 2), v.substr(4, 2), v.substr(6, 2) ]);
};
const k = 1.0 / 255;

const getColor = color.get = (input) => {
  const matchs = /^(([A-Fa-f0-9]+)|rgba?\((.*)\))(.*)$/.exec(input);
  if (!matchs) return [0, 0, 0, 1];
  const c16 = matchs[2];
  if (c16) return __normalize(c16);
  const tones = matchs[3].split(/\s*,\s*/);
  const output = [0, 0, 0, 1];
  let v, i = tones.length;
  if (i > 3) {
    i = 3;
    isNaN(v = parseFloat(v = tones[3])) || (output[3] = v);
  }
  for (;i--;) isNaN(v = parseInt(tones[i])) || (output[i] = v * k);
  return output;
};
const getCore = getColor.core = (args) => {
  let rgbaColor = [0, 0, 0, 1];
  for (let v, l = args.length; l--;) isNaN(v = parseInt(args[l], 16)) || (rgbaColor[l] = v * k);
  return rgbaColor;
};
const prepare = color.prepare = (args) => {
  let arg, l = args.length, output = new Array(l);
  for (; l--;) output[l] = typeof(arg = args[l]) === 'object' ? arg : getColor(arg);
  return output;
};

const join = color.join = (args) => rgba(joinCore(prepare(args)));
const joinCore = join.core = (args) => {
  let i, output = [0, 0, 0, 0], input, l = args.length;
  for (; l--;) {
    for (input = args[l], i = input.length; i--;) output[i] += (input[i] || 0);
  }
  return output;
};
const __tone = (v) => v > 1 ? 1 : (v < 0 ? 0 : v);
const rgba = color.rgba = (rgbaColor) => {
  let output = [0, 0, 0, __tone(rgbaColor[3]) ], i = 3;
  for (; i--;) output[i] = round(__tone(rgbaColor[i]) * 255);
  return 'rgba(' + output.join(',') + ')';
};
const rgbaAlt = color.rgbaAlt = (rgbaColor) => {
  let output = [0, 0, 0], i = 3;
  for (; i--;) output[i] = round(__tone(rgbaColor[i]) * 255);
  const rgb = output.join(',');
  const alpha = __tone(rgbaColor[3]);
  let _output = [ 'rgb(' + rgb + ')' ];
  if (alpha < 1) _output.push('rgba(' + rgb + ',' + alpha + ')');
  return _output;
};

//const __push = [].push;

/**
 * @example
 * var precision = 4;
 * var input = [ '#F00', '#0F0', '#00F' ];
 * var output = rangeColors(input, precision);
 */
 /*
export const colorRange = (<any> color).range = (() => {
  function __rangeColor(c0: number[], c1: number[], precision: number): number[][] {
    const max = precision + 1, cl = 4;
    let kl, kr, tmp, i, il, ci, output: number[][] = new Array(precision);
    for(i = 0; i < precision; i++){
      il = 1 + i;
      tmp = output[precision - il] = new Array(cl);
      kl = il / max;
      kr = 1 - kl;
      for(ci = cl; ci--;){
        tmp[ci] = c0[ci] * kl + c1[ci] * kr;
      }
    }
    return output;
  }
  const rangeColors = (colors: (string | number[])[], precision?: number): string[] => {
    let output = <any> __rangeColors(prepare(colors), precision || 0 ), i = output.length;
    for (; i--;) output[i] = rgba(output[i]);
    return output;
  };
  const __rangeColors = (<any> rangeColors).core = (input: number[][], precision: number):number[][] => {
    const l = input.length;
    let output = [], i, prev = input[ l - 1 ], follow;
    for (i = 0; i < l; i++) {
      follow = input[i];
      __push.apply(output, __rangeColor(prev, follow, precision));
      output.push(prev = follow);
    }
    return output;
  };
  return rangeColors;
})();
*/


const getBackgroundParams = (_color, i, end) => {
  let unit, position, matches;
  if (matches = /^([A-Fa-f0-9]+)(p([0-9]+)([a-z%]*))?$/i.exec(_color)) {
    _color = matches[1];
    position = matches[3] || 0;
    unit = matches[4] || '%';
  } else {
    return null;
  }
  _color || (_color = round(i * 15 / end).toString(16));
  position || (position = end ? round(i * 100 / end) : 0);
  return {color: _color, position, unit};
};

color.getBackground = (input) => {
  let radial = '', repeating, matches, angle = 180, i, l, vls, v = input;
  if (matches = /^(.*)rpt$/i.exec(v)) {
    repeating = true;
    v = matches[1];
  }

  if (matches = /^(.*)\-?((r)_?(.*)|g(\-?[0-9]+))$/i.exec(v)) {
    v = matches[1];
    if (matches[3]) {
      radial = (matches[4] || 'circle').split(/_+/gi).join(' ');
    } else {
      let vi = matches[5];
      angle = (angle + (vi ? parseInt(vi) : 0)) % 360;
      if (angle < 0) angle += 360;
    }
  }
  vls = v.split(/\-/i);
  l = vls.length;
  const end = l - 1;
  const prefix =
    (repeating ? 'repeating-' : '') +
    (radial ? 'radial' : 'linear') +
    '-gradient(' + (radial || ('' + angle + 'deg'));
  let alts, part, parts = [], rgb, rgba, suffix;
  let outputRgb = [ prefix ];
  let outputRgba = [ prefix ];
  let hasAlpha = false;
  for (i = 0; i < l; i++) {
    part = getBackgroundParams(vls[i], i, end);
    if (!part) return [ input.toLowerCase() ];
    parts.push(part);
    alts = part.alts = color(part.color);
    suffix = ' ' + part.position + part.unit;
    rgb = part.rgb = alts[0];
    if (rgba = alts[1]) {
      hasAlpha = true;
      part.rgba = rgba;
    } else {
      rgba = rgb;
    }
    outputRgb.push(rgb + suffix);
    outputRgba.push(rgba + suffix);
  }
  part = parts[0];
  rgb = part.rgb;
  rgba = part.rgba || rgb;
  let gradient = [ rgb ];
  if (rgba !== rgb) gradient.push(rgba);
  if (parts.length > 1) {
    gradient.push(outputRgb.join(',') + ')');
    if (hasAlpha) gradient.push(outputRgba.join(',') + ')');
  }
  //return { rgb, rgba, alts: gradient, angle, radial, length: l, repeating, parts };
  return gradient;
};
