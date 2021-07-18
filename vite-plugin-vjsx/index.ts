import * as ts from 'typescript'
//import fetch from 'node-fetch'
//import * as fs from 'fs'
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
function getKeyByValue(object: object, value: any) {
  return Object.keys(object).find(key => object[key] === value);
}
const getExportedFuncList = () => { }
const genInitializer = (id: string) => {
  const program = ts.createProgram([id], tsconfig)
  for (const sourceFile of program.getSourceFiles()) {
    //if (sourceFile.fileName.substr(-5) === '.d.ts') continue;
    if (!id.includes(sourceFile.fileName)) continue
    sourceFile.statements.forEach(node => {
      console.log(getKeyByValue(ts.SyntaxKind, node.kind));
      /*ts.forEachChild(node, (node: ts.Node)=>{
        
        
        
        //if(node.kind === ts.SyntaxKind.FunctionDeclaration)
      });*/
    })



  }
}

const fileName = 'memo/Example.jsx'

genInitializer(fileName)


