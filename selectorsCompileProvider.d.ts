import { FlagsMap } from 'mn-utils';
import { escapedBreakupCore } from 'mn-utils/escapedBreakupProvider'
declare namespace selectorsCompileProvider {

  interface essenceOptions {
    essences: FlagsMap;
    selectors: FlagsMap;
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
    getParents: (mediaNames: string[], name: string, targetName?: string) => FlagsMap;
    getEssence: (input: string) => { selector: string, states: FlagsMap };
  }

  export interface selectorsCompileProvider {
    <T> (instance?: T): T & selectorsCompile;
  }
}
declare const selectorsCompileProvider: selectorsCompileProvider.selectorsCompileProvider;
export = selectorsCompileProvider;
