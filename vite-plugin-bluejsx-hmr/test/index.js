import { Parser } from 'acorn'
//import HMRAdder from './HMRAdderAcorn.js';
import jsx from 'jsx-transform'
import fs from 'fs'
import path from 'path';

const code = jsx.fromFile('test/sampleCode.js', {
  factory: 'Blue.r',
  arrayChildren: false,
  passUnknownTagsToFactory: true
}).replace(/Blue\.r\(([A-z]+)\)/g, 'Blue.r($1, null)').replace(/Blue\.r/g, '  Blue.r')

//console.log(code);
// fs
const program = Parser.parse(code, { ecmaVersion: 'latest', sourceType: "module" })
function getExportedFunctions(body){
  const funcNodes = []
  const namesToLookFor = []
  const filterFuncs = (node, checkName = false) => {
    const { type } = node
    if (!checkName && type === 'FunctionDeclaration' || type === 'ArrowFunctionExpression'){
      funcNodes.push(node)
    }else if (type === 'VariableDeclaration') {
      if(checkName){
        node.declarations.forEach((declaration) =>{
          if(namesToLookFor.includes(declaration.id.name)){
            filterFuncs(declaration.init)
          }
        })
      }else{
        node.declarations.forEach((declaration) => filterFuncs(declaration.init))
      }
    }else if(type === 'Identifier') namesToLookFor.push(node.name)
  }
  for(let i=body.length;i--;){
    const bNode = body[i]
    if (bNode.type === 'ExportDefaultDeclaration' || bNode.type === 'ExportNamedDeclaration') {
      const { declaration, specifiers } = bNode
      if (declaration) {
        filterFuncs(declaration)
      }else{
        specifiers.forEach(specifier=>{
          filterFuncs(specifier.local)
        })
      }
    }else if(namesToLookFor.length){
      filterFuncs(bNode, true)
    }
  }
  return funcNodes
}
console.log(getExportedFunctions(program.body).map(node=>code.substring(node.start,node.end)))
//const hmrAdder = new HMRAdder()
//console.log(HMRAdder.transform(code));

// .arguments[1]
// if(n.type==='ObjectExpression'){
//   const refNode = n.properties.find(v=>v.key.name==='ref')
//   if(refNode)
//   console.log(refNode.value.elements[1])
// }
// console.log(
//   Parser.parseExpressionAt(code, code.indexOf('Blue.r'), { ecmaVersion: 'latest', sourceType: "module" }).arguments[1].properties

// )

// fs.writeFileSync('test/resultCode.js', code/* hmrAdder.transform(code, path.resolve('./test/sampleCode.js')) */, {
//   encoding: 'utf8'
// })