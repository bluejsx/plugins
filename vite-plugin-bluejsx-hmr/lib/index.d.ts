import { Parser, Node as Node$1 } from 'acorn';
import { PluginOption } from 'vite';

declare type InsertRecord = [
    number,
    number
][];
declare class HMRAdderBase {
    UPDATE_LISTENER_FUNC_NAME: string;
    PARAM_ALTER_NAME: string;
    constructor();
    transform(code: string): void;
    getImports(...args: any): any;
    getExports(...args: any): any[];
    /** returns node list of  */
    getDependentJSXComponents(code: string, imports: any): any[];
    getFunctions(nodeList: any[]): any[];
    getVars(searchVar: string, scopeCode: string): any[];
    fromDirectReturnToVarReturn(code: string): string;
    getReturnValue(funcNode: any): string;
    getInsertRecord(): InsertRecord;
    /**
     * replace specific range
     * @param insertCode inserting new code
     * @param range set of replacing locations `[startIndex, endIndex]`
     * @param code original code
     * @param insertRecord use `getInsertRecord()` to get `InsertRecord` object
     * @returns result entire code string
     */
    replaceCode(insertCode: string, range: [number, number], code: string, insertRecord: InsertRecord, insertInBack?: boolean): string;
    /**
     * insert code to specific place
     * @param insertCode inserting new code
     * @param index inserting location
     * @param code original code
     * @param insertRecord use `getInsertRecord()` to get `InsertRecord` object
     * @returns result entire code string
     */
    insertCode(insertCode: string, index: number, code: string, insertRecord: InsertRecord, insertInBack?: boolean): string;
    getCodeFragment(range: [number, number], code: string, insertRecord: InsertRecord): string;
}

declare type Node = Node$1 & {
    node?: string;
    [key: string]: Node | any;
};
/**
 * {
 *   originalName: usedName
 * }
 */
declare type Imports = {
    [key: string]: string;
};
/**
 * A set of imported var and src path
 */
declare type ImportInfo = {
    imports?: Imports;
    src?: string;
};
/**
 * example
```ts
const a: ImportsData = {
  info: {
    './cefce/c.edas': {
      imports: {
        default: 'Unko',
        'AAA': "AAA"
      },
      src: './cefce/c.edas'
    }
  },
  varNames: [
    {
      name: 'Unko',
      info: {
        imports: {
          default: 'Unko',
          'AAA': "AAA"
        },
        src: './cefce/c.edas'
      }
    }
  ]
}
```
*/
declare type ImportsData = {
    varNames: ({
        name: string;
        info: ImportInfo;
    })[];
    info: {
        [key: string]: ImportInfo;
    };
};
declare type ImportedJSXData = ImportsData['varNames'][0] & {
    node?: Node;
    refName?: string;
    index: number;
    hasRef?: boolean;
    attrObjCode?: string;
};
declare class HMRAdderAcorn extends HMRAdderBase {
    Parser: typeof Parser;
    constructor();
    transform(code: string, path?: string): string;
    addHotListenerInfo(hotListenerInfo: any, jsxComponent: any, refObjectName: any, updateInitializeLines: any): void;
    processFunctionCode(jsxComponents: ImportedJSXData[], funcNode: Node, funcCode: string, wholeCode: string): string;
    resolveFilePath(filepath: string, fromPath: string): string | false;
    getImports(body: Node[], filepath: string): ImportsData;
    getExports(body: Node[]): Node[];
    getExportedFunctions(body: Node[]): Node[];
    /** returns list of  */
    getDependentJSXComponents(code: string, imports: ImportsData): ImportedJSXData[];
    getVars(searchVar: string, scopeCode: string): any[];
    fromDirectReturnToVarReturn(code: string): string;
    getReturnValue(funcNode: any): string;
}

declare const hmrAdder: HMRAdderAcorn;
declare function HMRLoader({ enabled }?: {
    enabled: boolean;
}): PluginOption;

export { HMRLoader as default, hmrAdder };
