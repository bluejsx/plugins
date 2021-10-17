import { Parser } from 'acorn'
import HMRAdderAcorn from '../src/HMRAdderAcorn';
import jsx from 'jsx-transform'
import fs from 'fs'


const code = jsx.fromFile('sampleCode.js', {
  factory: 'Blue.r'
})

const HMRAdder = new HMRAdderAcorn()
// fs


console.log(HMRAdder.transform(code));

// .arguments[1]
// if(n.type==='ObjectExpression'){
//   const refNode = n.properties.find(v=>v.key.name==='ref')
//   if(refNode)
//   console.log(refNode.value.elements[1])
// }
// console.log(
//   Parser.parseExpressionAt(code, code.indexOf('Blue.r'), { ecmaVersion: 'latest', sourceType: "module" }).arguments[1].properties

// )

// fs.writeFileSync('./resultCode.js', HMRAdder.transform(code), {
//   encoding: 'utf8'
// })