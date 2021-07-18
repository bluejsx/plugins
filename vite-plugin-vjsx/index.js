"use strict";
exports.__esModule = true;
exports.modCode = void 0;
var ts = require("typescript");
//import fetch from 'node-fetch'
//import * as fs from 'fs'
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
var modCode = function (id) {
};
exports.modCode = modCode;
function getKeyByValue(object, value) {
    return Object.keys(object).find(function (key) { return object[key] === value; });
}
var getExportedFuncList = function () { };
var genInitializer = function (id) {
    var program = ts.createProgram([id], tsconfig);
    for (var _i = 0, _a = program.getSourceFiles(); _i < _a.length; _i++) {
        var sourceFile = _a[_i];
        //if (sourceFile.fileName.substr(-5) === '.d.ts') continue;
        if (!id.includes(sourceFile.fileName))
            continue;
        sourceFile.statements.forEach(function (node) {
            console.log(getKeyByValue(ts.SyntaxKind, node.kind));
            /*ts.forEachChild(node, (node: ts.Node)=>{
              
              
              
              //if(node.kind === ts.SyntaxKind.FunctionDeclaration)
            });*/
        });
    }
};
var fileName = 'memo/Example.jsx';
genInitializer(fileName);
