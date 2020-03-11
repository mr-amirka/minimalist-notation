/**
 * @overview minimalist-notation
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */

import {Emitter} from "mn-utils/Emitter/emitter";
import {ICssPropertiesStringify, ICssProps, IFlagsMap} from "mn-utils/global";
import {selectorsCompile} from "./selectorsCompileProvider";

export interface IMNCompiler {
  (attrValue: string): void;
  checkNode: (node: Element) => void;
  recursiveCheck: (node: Element | Document) => void;
  clear: () => void;
}

export interface IEssencesNamesMap {
  [essenceName: string]: any;
}
export interface IAttrsMap {
  [attrName: string]: IEssencesNamesMap;
}

export type IMNPreset = (mn: IMinimalistNotation) => any;

export interface IMinimalistNotationOptions {
  selectorPrefix?: string;
  presets?: IMNPreset[];
  altColor?: string;
}

export interface IMinimalistNotation extends selectorsCompile {
  (essencePrefix: string, essenceOptions: IEssenceOptions | string | string[]): IMinimalistNotation;
  (
    essencePrefix: string,
    handler: IEssenceHandler,
    matches?: string | string[],
    defaultMatchOff?: number | boolean,
  ): IMinimalistNotation;
  (essences: IEssenceMapOptions): IMinimalistNotation;
  propertiesStringify: ICssPropertiesStringify;
  data: IMinimalistNotationData;
  media: {[mediaName: string]: IMedia};
  handlerMap: IHandlerMap;
  getCompiler: (attrName: string) => IMNCompiler;
  recompileFrom: (attrsMap: IAttrsMap) => IMinimalistNotation;
  updateAttrByMap: (essencesMap: IEssencesNamesMap, attrName: string) => IMinimalistNotation;
  updateAttrByValues: (essencesNames: string[], attrName: string) => IMinimalistNotation;
  parseMediaName: (mediaName: string) => [number, string | undefined, string | undefined];
  clear: () => IMinimalistNotation;
  compile: () => IMinimalistNotation; // перекомиплировать стили для новых классов
  recompile: () => IMinimalistNotation; // полностью перекомиплировать все стили
  keyframesCompile: () => IMinimalistNotation; // перекомиплировать стили для новых keyframes
  cssCompile: () => IMinimalistNotation; // перекомиплировать стили для нового css, добавленного через метод mn.css
  deferCompile: () => IMinimalistNotation;
  deferRecompile: () => IMinimalistNotation;
  assign: (
    selectors: string | string[] | {[selector: string]: string | string[]},
    comboNames: string | string[],
    defaultMediaName?: string,
  ) => IMinimalistNotation;
  css: (selector: string | {[selector: string]: ICssProps}, css?: ICssProps | null) => IMinimalistNotation;
  setKeyframes: (name: string, body: IKeyframes | string, ifEmpty?: boolean | number) => IMinimalistNotation;
  set: IMinimalistNotation;
  setStyle: (name: string, content: string, priority?: number) => IMinimalistNotation;
  setPresets: (presets: IMNPreset[]) => IMinimalistNotation;
  emitter: Emitter<IStyle[]>;
  utils: any;
}
export interface IHandlerMap {
  [name: string]: IEssenceHandler;
}
export interface IMinimalistNotationData {
  compilers: {[attrName: string]: IMNCompiler};
  stylesMap: {[mediaName: string]: IStyle};
  assigned: IAssigned;
  root: IRoot;
  statics: IStatics;
  essences: IEssencesMap;
  keyframes: [
    {[animateName: string]: string},
    number
  ];
  css: [
    {[selector: string]: ICssDataItem},
    number
  ];
}
export interface IStatics {
  assigned: IAssigned;
  essences: {[essenceName: string]: IEssenceOptions};
}
export interface IEssenceMapOptions {
  [essencePrefix: string]: IEssenceOptions | IEssenceHandler;
}
export interface IEssenceContext {
  priority?: number;
  content?: string;
  map?: IFlagsMap;
  updated?: boolean;
}

// функция-генератор эссенции
export type IEssenceHandler = (params: IEssenceParams) => IEssenceOptions;
export interface IEssenceParams {
  name: string;
  suffix: string;
  negative: string;
  value: string;
  camel: string;
  num: string;
  unit: string;
  other: string;
  ni: string;
  [param: string]: string;
}

// Опции эссенции
export interface IEssenceOptions {
  inited?: boolean;
  priority?: number;
  style?: ICssProps;
  exts?: string[] | IFlagsMap;
  include?: string[];
  selectors?: string[];
  childs?: IEssencesMap;
  media?: {
    [mediaName: string]: IEssenceOptions;
  };
  updated?: number | boolean;
  important?: number | boolean;
  cssText?: string;
}

export interface IEssencesMap {
  [essenceName: string]: IEssenceOptions;
}

export interface IRoot {
  [mediaName: string]: [
    IEssencesMap,
    {[selector: string]: number | boolean},
    number,
    string,
    number | boolean,
    string
  ];
}

export interface IKeyframes {
  [name: string]: ICssProps | string;
}

interface ICssDataItem {
  content: string;
  css: ICssProps;
}

export interface IMedia {
  priority?: number;
  query?: string;
  selector?: string;
}

export interface IAssigned {
  [mediaName: string]: {[essenceName: string]: {[selector: string]: number}};
}

export interface IStyle {
  name?: string;
  priority?: number;
  content?: string;
  updated?: boolean | number;
}
