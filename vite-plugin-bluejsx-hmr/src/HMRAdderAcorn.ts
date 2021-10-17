import { Node as N, Parser } from 'acorn'
import HMRAdderBase, { InsertRecord } from './HMRAdderBase'
import path from 'path'
import fs from 'fs'

type Node = N & {
  node?: string
  [key: string]: Node | any
}
/**
 * {
 *   originalName: usedName
 * }
 */
type Imports = {
  //default?: string
  [key: string]: string
}
/**
 * A set of imported var and src path
 */
type ImportInfo = {
  imports?: Imports
  src?: string
}
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
type ImportsData = {
  varNames: ({
    name: string,
    info: ImportInfo
  })[],
  info: {
    [key: string]: ImportInfo
  }
}
type ImportedJSXData = ImportsData['varNames'][0] & {
  node?: Node
  refName?: string
  index: number
  hasRef?: boolean
}



export default class HMRAdderAcorn extends HMRAdderBase {
  Parser: typeof Parser;
  constructor() {
    super();
    this.Parser = Parser
  }
  transform(code: string, path?: string) {

    code = code.replace(/=>/g, '=> ')

    const program = this.Parser.parse(code, { ecmaVersion: 'latest', sourceType: "module" })
    const originalCode = code
    const imports = this.getImports((program as any).body as Node[], path);
    const exportedFuncs = this.getExportedFunctions((program as any).body as Node[]);
    const insertRecord = this.getInsertRecord()

    exportedFuncs.forEach((funcNode: Node | any) => {
      const { start, end } = funcNode
      const funcCode = this.getCodeFragment([start, end], code, insertRecord)
      const jsxComponents = this.getDependentJSXComponents(funcCode, imports)
      //const refObjName = 

      code = this.replaceCode(
        this.processFunctionCode(jsxComponents, funcNode, funcCode, originalCode),
        [start, end],
        code,
        insertRecord
      )

    })
    return code
  }
  /////////////////
  addHotListenerInfo(hotListenerInfo, jsxComponent, refObjectName, updateInitializeLines) {
    hotListenerInfo[jsxComponent.info.src] ??= {
      varMapCode: '',
      listenCode: ''
    }
    const o = hotListenerInfo[jsxComponent.info.src]
    o.varMapCode += `${jsxComponent.info.imports[jsxComponent.name]}:${jsxComponent.name},`
    o.listenCode += 
`
if(${refObjectName}.${jsxComponent.refName}.${this.UPDATE_LISTENER_FUNC_NAME}){
  ${refObjectName}.${jsxComponent.refName}=${refObjectName}.${jsxComponent.refName}.${this.UPDATE_LISTENER_FUNC_NAME}(${jsxComponent.name});
  ${updateInitializeLines}
}else{
  import.meta.hot.decline()
}
`

  }

  processFunctionCode(jsxComponents: ImportedJSXData[], funcNode: Node, funcCode: string, wholeCode: string): string {
    const insertRecord = this.getInsertRecord()
    const originalFuncCode = funcCode

    const bodyNode: Node = funcNode.body
    const relBodyStartIndex = bodyNode.start - funcNode.start, relBodyEndIndex = bodyNode.end - funcNode.start
    const bodyNodes: Node[] = bodyNode.body
    const paramNode = funcNode.params[0]
    let insertCodeToFirstLine = ''
    if (paramNode) {
      const pStart = paramNode.start - funcNode.start
      const pEnd = paramNode.end - funcNode.start
      const paramCode = funcCode.substring(pStart, pEnd)

      funcCode = this.replaceCode(
        this.PARAM_ALTER_NAME,
        [pStart, pEnd],
        funcCode,
        insertRecord
      )
      insertCodeToFirstLine = `\nlet ${paramCode}=${this.PARAM_ALTER_NAME};`
    }
    let selfVarName = 'self'

    const execLater = []
    const hotListenerInfo: {
      [ket: string]: {
        varMapCode: string
        listenCode: string
      }
    } = {}
    let refObjectName: string
    let c = 0
    const retNode: Node = bodyNodes?.find(v => v.type === 'ReturnStatement')

    const isDirectJSXArrowReturnFunc = bodyNode.type === 'CallExpression' && bodyNode.callee?.object?.name === 'Blue'
    if (retNode) {
      if (retNode.argument.type === 'Identifier') selfVarName = retNode.argument.name
    } else if (!isDirectJSXArrowReturnFunc) {
      return originalFuncCode
    }
    const isDirectJSXReturnFunc = retNode && retNode.argument.type === 'CallExpression' && retNode.argument.callee?.object?.name === 'Blue'

    const insertHotListenerPlace = isDirectJSXArrowReturnFunc ? relBodyEndIndex : retNode.start - funcNode.start;

    for(const v of funcCode.matchAll(/Blue\.r\(/g)){
      let blueCallNode: Node = this.Parser.parseExpressionAt(funcCode, v.index, { ecmaVersion: 'latest', sourceType: "module" })

      if (blueCallNode.type === 'SequenceExpression') {
        blueCallNode = blueCallNode.expressions.find(v => v.start === blueCallNode.start)
      }
      if (blueCallNode?.type === 'CallExpression' && blueCallNode?.arguments[1]?.type === 'ObjectExpression') {
        const name = blueCallNode.arguments[1].properties.find((v: Node) => v.key?.name === 'ref')?.value.elements[0].name
        if(name){
          refObjectName = name
          break
        }
      }
    }

    jsxComponents.forEach(jsxComponent => {
      const attrNode = jsxComponent.node.arguments[1] // null | { attr: value }


      if (attrNode.type === 'ObjectExpression') {
        const refAttrNode = attrNode.properties.find((v: Node) => v.key.name === 'ref')  // ref: [refs, 'elem']

        if (refAttrNode) {
          let updateInitializeLines = ''
          const refAttrContentNode = refAttrNode.value.elements

          jsxComponent.refName = refAttrContentNode[1].value
          jsxComponent.hasRef = true

          if (!isDirectJSXArrowReturnFunc) {
            // take any statements which uses updated components
            bodyNodes.forEach(({ type, start, end }) => {
              const relStart = start - funcNode.start, relEnd = end - funcNode.start
              const statement = originalFuncCode.substring(relStart, relEnd)

              if (type === 'ExpressionStatement' && originalFuncCode.indexOf(jsxComponent.refName, relStart) === relStart) {
                updateInitializeLines += `${refObjectName}.${statement};`
              }
            });

            //find ref object name (refs)
            for(const v of originalFuncCode.matchAll(new RegExp(jsxComponent.refName, 'g'))){
              try {
                const varNode = this.Parser.parseExpressionAt(originalFuncCode, v.index, { ecmaVersion: 'latest', sourceType: "module" })
                if (varNode.type === 'AssignmentExpression' || varNode.type === 'CallExpression') {
                  funcCode = this.insertCode(
                    `${refObjectName}.`,
                    v.index,
                    funcCode,
                    insertRecord
                  )
                }
              } catch (e) { }
            }
          }
          this.addHotListenerInfo(hotListenerInfo, jsxComponent, refObjectName, updateInitializeLines)
        } else {
          //Blue.r(A, {noAttr: 'aaa'})
          jsxComponent.refName = `bjsxc_${c++}`
          jsxComponent.hasRef = false
          execLater.push(() => {
            funcCode = this.insertCode(
              `ref:[${refObjectName},'${jsxComponent.refName}'],`,
              attrNode.start + 1,
              funcCode,
              insertRecord
            )
            this.addHotListenerInfo(hotListenerInfo, jsxComponent, refObjectName, '')
          })
        }
      } else {
        // Blue.r('Comp', null)
        jsxComponent.refName = `bjsxc_${c++}`
        execLater.push(() => {
          funcCode = this.replaceCode(
            `{ref:[${refObjectName},'${jsxComponent.refName}']}`,
            [attrNode.start, attrNode.start + 4],
            funcCode,
            insertRecord
          )
          this.addHotListenerInfo(hotListenerInfo, jsxComponent, refObjectName, '')
        })

      }

    })

    if (!refObjectName) {  // no ref object found
      refObjectName = 'refs'
      insertCodeToFirstLine += `const ${refObjectName}={};`
    }
    for (let i = execLater.length; i--;) {
      execLater[i]()
    }

    if (isDirectJSXArrowReturnFunc) {
      insertCodeToFirstLine = `{${insertCodeToFirstLine}const ${selfVarName}=`
      funcCode = this.insertCode(
        `\nreturn ${selfVarName};}`,
        bodyNode.end,
        funcCode,
        insertRecord,
        true
      )

    } else if (isDirectJSXReturnFunc) {

      const selfCode = this.getCodeFragment([retNode.start - funcNode.start + 6, retNode.end - funcNode.start], funcCode, insertRecord)

      insertCodeToFirstLine = `${insertCodeToFirstLine}
      const ${selfVarName}=${selfCode};`

      funcCode = this.replaceCode(
        `\nreturn ${selfVarName};`,
        [retNode.start - funcNode.start, retNode.start - funcNode.start + selfCode.length + 7],
        funcCode,
        insertRecord
      )
    }
    funcCode = this.insertCode(
      insertCodeToFirstLine,
      isDirectJSXArrowReturnFunc ? relBodyStartIndex : relBodyStartIndex + 1,
      funcCode,
      insertRecord
    )


    let hotListenerCode = ''
    if (paramNode) {
      hotListenerCode = 
`\n${selfVarName}.${this.UPDATE_LISTENER_FUNC_NAME} = (Comp) =>{
  const newElem=Comp(${this.PARAM_ALTER_NAME});
  ${selfVarName}.before(newElem);
  ${selfVarName}.remove();
  return newElem
}\n`
    } else {
      hotListenerCode = 
`\n${selfVarName}.${this.UPDATE_LISTENER_FUNC_NAME} = (Comp) =>{
  const newElem=Comp();
  ${selfVarName}.before(newElem);
  ${selfVarName}.remove();
  return newElem
}\n`
    }
    let listenerAdded = false
    for (const src in hotListenerInfo) {
      listenerAdded || (listenerAdded = true)
      const listenerData = hotListenerInfo[src]
      hotListenerCode += `import.meta.hot.accept('${src}',({${listenerData.varMapCode}})=>{${listenerData.listenCode}});`
    }

    if (listenerAdded) {
      hotListenerCode = 
`\nif(import.meta.hot){
  ${hotListenerCode}
}else{
  console.warn('import.meta.hot not exist')
}\n`
    }
    funcCode = this.insertCode(
      hotListenerCode,
      insertHotListenerPlace,
      funcCode,
      insertRecord
    )
    return funcCode
  }

  resolveFilePath(filepath: string, fromPath: string): string|false {
    const dPath = path.resolve(fromPath, '../', filepath)
    try {
      const stat = fs.statSync(dPath)
      if (stat.isDirectory()) {
        const filenames = fs.readdirSync(dPath)
        for (let i = filenames.length; i--;) {
          const filename = filenames[i]
          if (/index\.[jt]sx$/.test(filename)) return filepath + '/' + filename
        }
      } else {
        if(stat.isFile()) return filepath
        return false
      }
    } catch (e) {
      
      const filenames = fs.readdirSync(path.resolve(dPath, '../'))
      const targetFileName = path.basename(filepath)
      const parentDirName = path.dirname(filepath)
      for (let i = filenames.length; i--;) {
        const filename = filenames[i]
        if (filenames.indexOf(targetFileName)===0 && /\.[jt]sx$/.test(filename)) return parentDirName + '/' + filename
      }
    }
    return false
  }

  getImports(body: Node[], filepath: string) {
    const imports: ImportsData = {
      varNames: [],
      info: {}
    }

    body.forEach(v => {
      if (v.type !== 'ImportDeclaration' || v.source.value.indexOf('.') !== 0) return 0
      const resolvedImportPath = this.resolveFilePath(v.source.value, filepath)
      if(!resolvedImportPath) return 0
      const info: ImportInfo = {
        src: resolvedImportPath,
        imports: {}
      }
      imports.info[v.source.value] = info
      v.specifiers.forEach(specifier => {
        let name: string = specifier.local.name
        if (specifier.type === 'ImportDefaultSpecifier') {
          //info.imports.default = name
          info.imports[name] = 'default'

        } else if (specifier.type === 'ImportSpecifier') {
          //info.imports[specifier.imported.name] = name
          info.imports[name] = specifier.imported.name
        }
        imports.varNames.push({ name, info })
      })
    })
    return imports
  }
  getExports(body: Node[]): Node[] {
    return body.filter(v => v.type === 'ExportDefaultDeclaration' || v.type === 'ExportNamedDeclaration')
  }
  getExportedFunctions(body: Node[]): Node[] {
    const funcNodes = []
    const filterFuncs = (node: Node) => {
      if (node.type === 'FunctionDeclaration' || node.type === 'ArrowFunctionExpression') funcNodes.push(node)
      else if (node.type === 'VariableDeclaration') node.declarations.forEach(v => filterFuncs(v.init))
    }
    body.forEach(v => {
      if (v.type === 'ExportDefaultDeclaration' || v.type === 'ExportNamedDeclaration') {
        const { declaration } = v as typeof v & {
          declaration: Node
        }
        if (declaration) {
          filterFuncs(declaration)
        }
      }
    })
    return funcNodes
  }
  /** returns list of  */
  getDependentJSXComponents(code: string, imports: ImportsData) {
    const jsxInfo: ImportedJSXData[] = [];
    for(const v of code.matchAll(/Blue\.r\(([A-Z][A-z_]*)/g)){
      const compName = v[1]
      let blueCallNode: Node = this.Parser.parseExpressionAt(code, v.index, { ecmaVersion: 'latest', sourceType: "module" })

      if (blueCallNode.type === 'SequenceExpression') {
        blueCallNode = blueCallNode.expressions.find((v: Node) => v.start === blueCallNode.start)
      }
      imports.varNames.forEach(i => {
        if (i.name === compName) {

          const importedJSXData: ImportedJSXData = {
            name: compName,
            info: i.info,
            node: blueCallNode,
            index: v.index
          }
          jsxInfo.push(importedJSXData)
        }
      })
    }
    return jsxInfo
  }

  getVars(searchVar: string, scopeCode: string): any[] {
    return []
  }
  fromDirectReturnToVarReturn(code: string): string {

    return ''
  }
  getReturnValue(funcNode: any): string {
    return ''
  }

}