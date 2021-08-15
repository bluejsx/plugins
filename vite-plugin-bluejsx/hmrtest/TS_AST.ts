import ts from 'typescript';
//import * as ts from './node_modules/typescript/lib'

//import fetch from 'node-fetch'
//import * as fs from 'fs'
const { log } = console
const tsconfig = {
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
}
export const modCode = (id: string) => {

}
function getKeyByValue(object: Record<string, unknown>, value: any) {
  return Object.keys(object).find(key => object[key] === value);
}
const getExports = (sourceFile: ts.SourceFile): Array<ts.Node> => {
  let code = sourceFile.getFullText()
  const list: Array<ts.Node> = []
  sourceFile.statements.forEach(nodeC0 => {
    log(getKeyByValue(ts.SyntaxKind, nodeC0.kind));
    if (nodeC0.kind === ts.SyntaxKind.ExportAssignment) {
      list.push((nodeC0 as ts.ExportAssignment).expression)
    } /*else if (nodeC0.kind === ts.SyntaxKind.ExportDeclaration && nodeC0.modifiers[0]?.kind === ts.SyntaxKind.ExportKeyword) {
      list.push(...((nodeC0 as ts.ExportDeclaration).exportClause as ts.NamedExports).elements.map(value=>value.))
    } */else if (nodeC0.kind === ts.SyntaxKind.FunctionDeclaration && nodeC0.modifiers[0]?.kind === ts.SyntaxKind.ExportKeyword) {
      list.push(nodeC0)
    } else if (nodeC0.kind === ts.SyntaxKind.VariableStatement && nodeC0.modifiers[0]?.kind === ts.SyntaxKind.ExportKeyword) {
      list.push(...(nodeC0 as ts.VariableStatement).declarationList.declarations)
    }
    /*for (const nodeC1 of nodeC0.getChildren(sourceFile)) {
      log('>', getKeyByValue(ts.SyntaxKind, nodeC1.kind));

      if (nodeC1.kind === ts.SyntaxKind.FunctionDeclaration) {

      }

    }*/
  })
  return list
}
const getFunctions = (nodeList: Array<ts.Node>): Array<ts.Node> => {
  const list: Array<ts.Node>  = []
  nodeList.forEach((node: ts.VariableDeclaration | ts.Node | any) => {
    if (node.kind === ts.SyntaxKind.FunctionDeclaration) list.push(node)
    else if (node.initializer?.kind === ts.SyntaxKind.ArrowFunction) list.push(node.initializer)
  })
  return list
}
const findRefObjName = (sourceFile: ts.SourceFile) =>{
  const reg = /ref *= *{\[([A-z]+) *, *["'`]([A-z]+)["'`]\]}/g
  const code = sourceFile.text
  let refObjName = '', match: RegExpExecArray;
  
  while((match = reg.exec(code)) !== null){
    log(getKeyByValue(ts.SyntaxKind, sourceFile.getChildAt(reg.lastIndex, sourceFile).kind))
    if(sourceFile.getChildAt(reg.lastIndex, sourceFile).kind===ts.SyntaxKind.JsxExpression){
      if(refObjName==='') refObjName = match[1]
      else if(refObjName!==match[1])throw new Error('multi refs object')
    } 
  }
  return refObjName
}
const getImports = (sourceFile: ts.SourceFile): Array<ts.Node> => {
  let code = sourceFile.getFullText()
  const list: Array<ts.Node> = []
  sourceFile.statements.forEach(nodeC0 => {
    log(getKeyByValue(ts.SyntaxKind, nodeC0.kind));
    if (nodeC0.kind === ts.SyntaxKind.ExportAssignment) {
      list.push((nodeC0 as ts.ExportAssignment).expression)
    } /*else if (nodeC0.kind === ts.SyntaxKind.ExportDeclaration && nodeC0.modifiers[0]?.kind === ts.SyntaxKind.ExportKeyword) {
      list.push(...((nodeC0 as ts.ExportDeclaration).exportClause as ts.NamedExports).elements.map(value=>value.))
    } */else if (nodeC0.kind === ts.SyntaxKind.FunctionDeclaration && nodeC0.modifiers[0]?.kind === ts.SyntaxKind.ExportKeyword) {
      list.push(nodeC0)
    } else if (nodeC0.kind === ts.SyntaxKind.VariableStatement && nodeC0.modifiers[0]?.kind === ts.SyntaxKind.ExportKeyword) {
      list.push(...(nodeC0 as ts.VariableStatement).declarationList.declarations)
    }
    /*for (const nodeC1 of nodeC0.getChildren(sourceFile)) {
      log('>', getKeyByValue(ts.SyntaxKind, nodeC1.kind));

      if (nodeC1.kind === ts.SyntaxKind.FunctionDeclaration) {

      }

    }*/
  })
  return list
}

const processCode = (id: string) => {
  const program = ts.createProgram([id], tsconfig)
  for (const sourceFile of program.getSourceFiles()) {
    //if (sourceFile.fileName.substr(-5) === '.d.ts') continue;
    if (!id.includes(sourceFile.fileName)) continue
    sourceFile as ts.SourceFile
    log(sourceFile.fileName)
    //const exports = getExports(sourceFile)
    //const exportedFunctions = getFunctions(exports)
    log('ref obj name:', findRefObjName(sourceFile))
    /*ts.forEachChild(node, (node: ts.Node)=>{
      
      
      
      //if(node.kind === ts.SyntaxKind.FunctionDeclaration)
    });*/




  }
}

const fileName = '../memo/ExampleRaw.tsx'
processCode(fileName)
const genIniter = (code: string) => {

}


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
