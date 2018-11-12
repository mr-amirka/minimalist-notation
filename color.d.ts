

declare namespace color {
  export interface color {
    (input: string): string[];
    core: (args: string[]) => number[];
    normalize: (input: string) => number[];
    get: getColor;
    prepare: (args: (string | number[])[]) => number[][];
    join: colorJoin;
    rgba: (rgbaColor: number[]) => string;
    rgbaAlt: (rgbaColor: number[]) => string[];
    range: (colors: (string | number[])[], precision?: number) => string[];
    getBackground: getBackground;
  }
  export interface getColor {
    (input: string): number[];
    core: (args: string[]) => number[];
  }
  export interface colorJoin {
    (args: (string | number[])[]): string;
    core: (args: number[][]) => number[];
  }
  export interface getBackground {
    (v: string): bgResult
  }
  export interface bgResult {
    rgb: string;
    rgba: string;
    alts: string[];
    angle: number;
    radial?: string;
    length: number;
    repeating: boolean;
    parts: part[];
  }
  export interface part {
    color: string;
    alts: string[];
    position: string;
    unit: string;
    rgb: string;
    rgba: string;
  }
}
declare const color: color.color;
export = color;
