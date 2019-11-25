/**
 * @overview minimalist-notation/selectorsCompileProvider
 * Генеририрует селекторы в Minimalist Notation
 * @author Amir Absolutely <mr.amirka@ya.ru>
 */


import { IFlagsMap } from 'mn-utils/global';
import { escapedBreakupCore } from 'mn-utils/escapedBreakupProvider'
declare namespace selectorsCompileProvider {

  interface essenceOptions {
    essences: IFlagsMap;
    selectors: IFlagsMap;
    mediaName: string;
  }

  export interface states {
    [stateName: string]: string[];
  }

  export interface parseMethod {
    (comboName: string): essenceOptions[];
  }

  export interface selectorsCompile {
    (comboName: string, targetName: string): essenceOptions[];
    states: states;
    parseComboName: (comboName: string, targetName: string) => essenceOptions[];
    parseComboNameProvider: (attrName: string) => parseMethod;
    parseAttrProvider: (attrName: string) => parseMethod;
    parseId: parseMethod;
    parseClass: parseMethod;
    getParents: (mediaNames: string[], name: string, targetName?: string) => IFlagsMap;
    getEssence: (input: string) => { selector: string, states: IFlagsMap };
  }

  export interface selectorsCompileProvider {
    <T> (instance?: T): T & selectorsCompile;
  }
}
declare const selectorsCompileProvider: selectorsCompileProvider.selectorsCompileProvider;
export = selectorsCompileProvider;
