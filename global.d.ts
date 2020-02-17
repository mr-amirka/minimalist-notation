/**
 * @overview minimalist-notation
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */

import {IFlagsMap} from 'mn-utils/global';
import {Emitter} from 'mn-utils/Emitter/emitter';
import {
  cssPropertiesStringify,
  CssProps
} from 'mn-utils/cssPropertiesStringifyProvider';

import { selectorsCompile } from './selectorsCompileProvider';


export interface mnCompiler {
  (attrValue: string): void;
  checkNode: (node: Element) => void;
  recursiveCheck: (node: Element | Document) => void;
  clear: () => void;
}

export interface essencesNamesMap {
  [essenceName: string]: boolean | number;
}
export interface attrsMap {
  [attrName: string]: essencesNamesMap;
}
export interface MnPreset {
  (mn: MinimalistNotation): any;
}

export interface MinimalistNotationOptions {
  selectorPrefix?: string
}

export interface MinimalistNotation extends selectorsCompile {
  (essencePrefix: string, essenceOptions: EssenceOptions | string | string[]): MinimalistNotation;
  (essencePrefix: string, handler: EssenceHandler, matches?: string | string[]): MinimalistNotation;
  (essences: EssenceMapOptions): MinimalistNotation;
  propertiesStringify: cssPropertiesStringify;
  data: MinimalistNotationData;
  media: {[mediaName: string]: media};
  handlerMap: handlerMap;
  contextMode: string;
  disabled: boolean;
  getCompiler: (attrName: string) => mnCompiler;
  recompileFrom: (attrsMap: attrsMap, options?: MinimalistNotationOptions) => MinimalistNotation;
  updateAttrByMap: (essencesMap: essencesNamesMap, attrName: string) => MinimalistNotation;
  updateAttrByValues: (essencesNames: string[], attrName: string) => MinimalistNotation
  //ngCheck: (ngClass: string) => MinimalistNotation;
  parseMediaName: (mediaName: string) => media;
  clear: () => MinimalistNotation;
  compile: () => MinimalistNotation; //перекомиплировать стили для новых классов
  recompile: () => MinimalistNotation; //полностью перекомиплировать все стили
  keyframesCompile: () => MinimalistNotation; //перекомиплировать стили для новых keyframes
  cssCompile: () => MinimalistNotation; //перекомиплировать стили для нового css, добавленного через метод mn.css
  deferCompile: () => MinimalistNotation;
  deferRecompile: () => MinimalistNotation;
  assign: (essencesNames: string[], selectors: string[]) => MinimalistNotation;
  css: (selector: string | {[n: string]: CssProps}, css?: CssProps) => MinimalistNotation;
  setKeyframes: (name: string, body: keyframes | string) => MinimalistNotation;
  set: MinimalistNotation;
  setStyle: (name: string, content: string, priority?: number) => MinimalistNotation;
  setPresets: (presets: MnPreset[]) => MinimalistNotation;
  emitter: Emitter<style[]>
  utils: any;
}
export interface handlerMap {
  [name: string]: EssenceHandler;
}
export interface MinimalistNotationData {
  keyframes: keyframesData;
  classNamesMap: Set<string>;
  root: root;
  essences: essencesMap;
  statics: statics;
  attr: Set<string>;
  css: cssData;
  stylesMap: {[mediaName: string]: style};
}
export interface statics {
  assigned: assigned;
  essences: {[essenceName: string]: IFlagsMap};
}
export interface EssenceMapOptions {
  [essencePrefix: string]: EssenceOptions | EssenceHandler;
}
export interface MediaContext {
  map: essencesMap;
  updated: boolean;
}
export interface EssenceContext {
  priority?: number;
  content?: string;
  map?: IFlagsMap;
  updated?: boolean;
  rules?: string [];
}
//функция-генератор эссенции
export interface EssenceHandler {
  (params: EssenceParams): EssenceOptions
}
export interface EssenceParams {
  name: string;
  input: string;
  suffix: string;
  negative: string;
  value: string;
  camel: string;
  num: string;
  other: string;
  i: string;
  ni: string;
  [name: string]: string;
}

//Опции эссенции
export interface EssenceOptions {
  inited?: boolean;
  priority?: number;
  style?: CssProps;
  exts?: string[] | IFlagsMap;
  include?: string[];
  selectors?: string[];
  childs?: essencesMap,
  media?: {
    [mediaName: string]: EssenceOptions
  };

  rules?: rule[];
  updated?: boolean;
  content?: string;
}

export interface essencesMap {
  [essenceName: string]: EssenceOptions;
}

export interface root {
  [mediaName: string]: MediaContext
}

export interface keyframesData {
  map: {
    [name: string]: string;
  };
  updated: boolean;
}
export interface keyframes {
  [name: string]: CssProps | string;
}

export interface cssData {
  map: {
    [name: string]: cssDataItem;
  };
  updated: boolean;
}

interface cssDataItem {
  content: string;
  css: CssProps;
}

export interface media {
  priority?: number;
  query?: string;
}

export interface assigned {
  [mediaName: string]: {[essenceName: string]: IFlagsMap}
}

export interface rule {
  selectors: string[];
  css: string;
  priority: number;
}

export interface style {
  priority?: number;
  name?: string;
  content?: string;
  updated?: boolean;
}
