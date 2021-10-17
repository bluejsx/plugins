import { Parser } from 'acorn'
import HMRAdder from './HMRAdderAcorn.js';
import jsx from 'jsx-transform'
import fs from 'fs'
import path from 'path';

const code = jsx.fromFile('test/sampleCode.js', {
  factory: 'Blue.r',
  arrayChildren: false,
  passUnknownTagsToFactory: true
}).replace(/Blue\.r\(([A-z]+)\)/g, 'Blue.r($1, null)').replace(/Blue\.r/g, ' /* #ncjfdk */ Blue.r')

console.log(code);
// fs

const hmrAdder = new HMRAdder()
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

fs.writeFileSync('test/resultCode.js', hmrAdder.transform(code, path.resolve('./test/sampleCode.js')), {
  encoding: 'utf8'
})