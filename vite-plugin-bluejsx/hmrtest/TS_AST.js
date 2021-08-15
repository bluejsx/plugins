var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
import ts from 'typescript';
//import * as ts from './node_modules/typescript/lib'
//import fetch from 'node-fetch'
//import * as fs from 'fs'
var log = console.log;
var tsconfig = {
    "module": ts.ModuleKind.ESNext,
    "lib": ["dom", "esnext"],
    "moduleResolution": ts.ModuleResolutionKind.NodeJs,
    "allowSyntheticDefaultImports": true,
    "downlevelIteration": true,
    "jsx": ts.JsxEmit.Preserve,
    "jsxFactory": "Blue.r",
    "jsxFragmentFactory": "Blue.Fragment",
    "resolveJsonModule": true,
    "allowJs": true
};
export var modCode = function (id) {
};
function getKeyByValue(object, value) {
    return Object.keys(object).find(function (key) { return object[key] === value; });
}
var getExports = function (sourceFile) {
    var code = sourceFile.getFullText();
    var list = [];
    sourceFile.statements.forEach(function (nodeC0) {
        var _a, _b;
        log(getKeyByValue(ts.SyntaxKind, nodeC0.kind));
        if (nodeC0.kind === ts.SyntaxKind.ExportAssignment) {
            list.push(nodeC0.expression);
        } /*else if (nodeC0.kind === ts.SyntaxKind.ExportDeclaration && nodeC0.modifiers[0]?.kind === ts.SyntaxKind.ExportKeyword) {
          list.push(...((nodeC0 as ts.ExportDeclaration).exportClause as ts.NamedExports).elements.map(value=>value.))
        } */
        else if (nodeC0.kind === ts.SyntaxKind.FunctionDeclaration && ((_a = nodeC0.modifiers[0]) === null || _a === void 0 ? void 0 : _a.kind) === ts.SyntaxKind.ExportKeyword) {
            list.push(nodeC0);
        }
        else if (nodeC0.kind === ts.SyntaxKind.VariableStatement && ((_b = nodeC0.modifiers[0]) === null || _b === void 0 ? void 0 : _b.kind) === ts.SyntaxKind.ExportKeyword) {
            list.push.apply(list, __spreadArray([], __read(nodeC0.declarationList.declarations)));
        }
        /*for (const nodeC1 of nodeC0.getChildren(sourceFile)) {
          log('>', getKeyByValue(ts.SyntaxKind, nodeC1.kind));
    
          if (nodeC1.kind === ts.SyntaxKind.FunctionDeclaration) {
    
          }
    
        }*/
    });
    return list;
};
var getFunctions = function (nodeList) {
    var list = [];
    nodeList.forEach(function (node) {
        var _a;
        if (node.kind === ts.SyntaxKind.FunctionDeclaration)
            list.push(node);
        else if (((_a = node.initializer) === null || _a === void 0 ? void 0 : _a.kind) === ts.SyntaxKind.ArrowFunction)
            list.push(node.initializer);
    });
    return list;
};
var findRefObjName = function (sourceFile) {
    var reg = /ref *= *{\[([A-z]+) *, *["'`]([A-z]+)["'`]\]}/g;
    var code = sourceFile.text;
    var refObjName = '', match;
    while ((match = reg.exec(code)) !== null) {
        log(getKeyByValue(ts.SyntaxKind, sourceFile.getChildAt(reg.lastIndex, sourceFile).kind));
        if (sourceFile.getChildAt(reg.lastIndex, sourceFile).kind === ts.SyntaxKind.JsxExpression) {
            if (refObjName === '')
                refObjName = match[1];
            else if (refObjName !== match[1])
                throw new Error('multi refs object');
        }
    }
    return refObjName;
};
var getImports = function (sourceFile) {
    var code = sourceFile.getFullText();
    var list = [];
    sourceFile.statements.forEach(function (nodeC0) {
        var _a, _b;
        log(getKeyByValue(ts.SyntaxKind, nodeC0.kind));
        if (nodeC0.kind === ts.SyntaxKind.ExportAssignment) {
            list.push(nodeC0.expression);
        } /*else if (nodeC0.kind === ts.SyntaxKind.ExportDeclaration && nodeC0.modifiers[0]?.kind === ts.SyntaxKind.ExportKeyword) {
          list.push(...((nodeC0 as ts.ExportDeclaration).exportClause as ts.NamedExports).elements.map(value=>value.))
        } */
        else if (nodeC0.kind === ts.SyntaxKind.FunctionDeclaration && ((_a = nodeC0.modifiers[0]) === null || _a === void 0 ? void 0 : _a.kind) === ts.SyntaxKind.ExportKeyword) {
            list.push(nodeC0);
        }
        else if (nodeC0.kind === ts.SyntaxKind.VariableStatement && ((_b = nodeC0.modifiers[0]) === null || _b === void 0 ? void 0 : _b.kind) === ts.SyntaxKind.ExportKeyword) {
            list.push.apply(list, __spreadArray([], __read(nodeC0.declarationList.declarations)));
        }
        /*for (const nodeC1 of nodeC0.getChildren(sourceFile)) {
          log('>', getKeyByValue(ts.SyntaxKind, nodeC1.kind));
    
          if (nodeC1.kind === ts.SyntaxKind.FunctionDeclaration) {
    
          }
    
        }*/
    });
    return list;
};
var processCode = function (id) {
    var e_1, _a;
    var program = ts.createProgram([id], tsconfig);
    try {
        for (var _b = __values(program.getSourceFiles()), _c = _b.next(); !_c.done; _c = _b.next()) {
            var sourceFile = _c.value;
            //if (sourceFile.fileName.substr(-5) === '.d.ts') continue;
            if (!id.includes(sourceFile.fileName))
                continue;
            sourceFile;
            log(sourceFile.fileName);
            //const exports = getExports(sourceFile)
            //const exportedFunctions = getFunctions(exports)
            log('ref obj name:', findRefObjName(sourceFile));
            /*ts.forEachChild(node, (node: ts.Node)=>{
              
              
              
              //if(node.kind === ts.SyntaxKind.FunctionDeclaration)
            });*/
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
        }
        finally { if (e_1) throw e_1.error; }
    }
};
var fileName = '../memo/ExampleRaw.tsx';
processCode(fileName);
var genIniter = function (code) {
};
/*
HMR procedures:

components:
- find all function export
- from each of the function, find the returning object:
  - direct jsx
  - variable
  
- find all dependent JSX children components
- store components in a variable
- make composer function
-

finding exporting function:
- Function declaration
- ExportDeclaration
- VariableDeclaration
  -

*/
