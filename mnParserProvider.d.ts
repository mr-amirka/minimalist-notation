/**
 * @overview minimalist-notation/parserProvider
 * @author Amir Absolutely <mr.amirka@ya.ru>
 */

import { attrsMap } from './index';

declare function parserProvider(attrs: string | string[] | {[from: string]: string})
  : ((output: attrsMap, content: string) => number) | null;
export = parserProvider;
