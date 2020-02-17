/**
 * @overview minimalistNotation for nodejs
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */

import { MnPreset } from '../global';
export interface compileSourceOptions {
  input: string | {
    [outputName: string]: string | compileSourceOptions
  },
  output?: string | undefined | null,
  include?: RegExp | RegExp[],
  exclude?: RegExp | RegExp[],
  attrs: string | string[],
  selectorPrefix?: string | undefined | null,
  presets: MnPreset[]
}

export declare const defaultSettings: compileSourceOptions;
export declare const compileSource: (options: compileSourceOptions) => void;
