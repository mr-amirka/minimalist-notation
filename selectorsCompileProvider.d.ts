/**
 * @overview minimalist-notation/selectorsCompileProvider
 * Генеририрует селекторы в Minimalist Notation
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */

import {IFlagsMap} from "mn-utils/global";

type IEssenceOptions = [
  IFlagsMap,
  IFlagsMap,
  string
];
type parseMethod = (comboName: string) => IEssenceOptions[];

interface ISelectorsCompile {
  (comboName: string, targetName: string): IEssenceOptions[];
  states: {[stateName: string]: string[]};
  parseComboName: (comboName: string, targetName: string) => IEssenceOptions[];
  parseComboNameProvider: (attrName: string) => parseMethod;
  parseId: parseMethod;
  parseClass: parseMethod;
}

declare function selectorsCompileProvider<T>(instance?: T): T & ISelectorsCompile;
export = selectorsCompileProvider;
