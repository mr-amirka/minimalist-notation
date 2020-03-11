/**
 * @overview minimalistNotation for nodejs
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */

import {MnPreset} from "../global";
export interface ICompileSourceOptions {
  input: string | {
    [outputName: string]: string | compileSourceOptions;
  };
  output?: string | undefined | null;
  include?: RegExp | RegExp[];
  exclude?: RegExp | RegExp[];
  attrs: string | string[];
  altColor?: string | null;
  selectorPrefix?: string | undefined | null;
  presets: MnPreset[];
}

export declare const defaultSettings: ICompileSourceOptions;
export declare const compileSource: (options: ICompileSourceOptions) => void;
