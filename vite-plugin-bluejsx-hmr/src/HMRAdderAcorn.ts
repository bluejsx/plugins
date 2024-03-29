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
  attrObjCode?: string
}

type HotListenerInfo = {
  [ket: string]: {
    varMapCode: string
    listenCode: string
    usedCompNames: string[]
    //overrideImportCode: string
  }
}


export default class HMRAdderAcorn extends HMRAdderBase {
  Parser: typeof Parser;
  constructor() {
    super();
    this.Parser = Parser
  }
  transform(code: string, path: string) {

    code = code.replace(/=>/g, '=> ').replace(/Blue\.r\(([A-Z]\w*)[ \n]*\)/g, 'Blue.r($1, null)')

    const program = this.Parser.parse(code, { ecmaVersion: 'latest', sourceType: "module" })
    const originalCode = code
    const { imports, exportedFuncs } = this.analyzeTree((program as any).body as Node[], path)
    const insertRecord = this.getInsertRecord()

    for (const funcNode of exportedFuncs) {
      const { start, end } = funcNode
      const funcCode = this.getCodeFragment([start, end], code, insertRecord)
      const jsxComponents = this.getDependentJSXComponents(funcCode, imports)
      //const refObjName = 

      code = this.replaceCode(
        this.processFunctionCode(jsxComponents, funcNode, funcCode, imports, originalCode),
        [start, end],
        code,
        insertRecord
      )

    }
    return code
  }
  /////////////////
  addHotListenerInfo(hotListenerInfo: HotListenerInfo, jsxComponent, refObjectName, updateInitializeLines) {
    hotListenerInfo[jsxComponent.info.src] ??= {
      varMapCode: '',
      listenCode: '',
      usedCompNames: [],
      //overrideImportCode: ''
    }
    const o = hotListenerInfo[jsxComponent.info.src]
    if (!o.usedCompNames.includes(jsxComponent.name)) {
      o.varMapCode += `${jsxComponent.info.imports[jsxComponent.name]}:${jsxComponent.name},`
      o.usedCompNames.push(jsxComponent.name)
      //o.overrideImportCode += `${jsxComponent.name}_b = ${jsxComponent.name};`
    }
    o.listenCode +=
`
if(${refObjectName}.${jsxComponent.refName}.${this.UPDATE_LISTENER_FUNC_NAME}){
  ${refObjectName}.${jsxComponent.refName}=${refObjectName}.${jsxComponent.refName}.${this.UPDATE_LISTENER_FUNC_NAME}(${jsxComponent.name}, ${jsxComponent.attrObjCode ? jsxComponent.attrObjCode : 'null'});
  ${updateInitializeLines}
}else{
  import.meta.hot.decline()
}
`

  }

  processFunctionCode(jsxComponents: ImportedJSXData[], funcNode: Node, funcCode: string, imports: ImportsData, wholeCode: string): string {
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
    const hotListenerInfo: HotListenerInfo = {}
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

    for (const v of funcCode.matchAll(/Blue\.r\(/g)) {
      let blueCallNode: Node = this.Parser.parseExpressionAt(funcCode, v.index, { ecmaVersion: 'latest', sourceType: "module" })

      if (blueCallNode.type === 'SequenceExpression') {
        blueCallNode = blueCallNode.expressions.find(v => v.start === blueCallNode.start)
      }
      if (blueCallNode?.type === 'CallExpression' && blueCallNode?.arguments[1]?.type === 'ObjectExpression') {
        const name = blueCallNode.arguments[1].properties.find((v: Node) => v.key?.name === 'ref')?.value.elements[0].name
        if (name) {
          refObjectName = name
          break
        }
      }
    }

    for (const jsxComponent of jsxComponents) {
      const attrNode = jsxComponent.node.arguments[1] // null | { attr: value }


      if (attrNode.type === 'ObjectExpression') {
        jsxComponent.attrObjCode = originalFuncCode.substring(attrNode.start, attrNode.end)

        const refAttrNode = attrNode.properties.find((v: Node) => v.key.name === 'ref')  // ref: [refs, 'elem']
        //const classAttrNode = attrNode.properties.find((v: Node) => v.key.name === 'class')  // class: [refs, 'elem']
        
        if (refAttrNode) {
          let updateInitializeLines = ''
          const refAttrContentNode = refAttrNode.value.elements

          jsxComponent.refName = refAttrContentNode[1].value
          jsxComponent.hasRef = true

          if (!isDirectJSXArrowReturnFunc) {
            // take any statements which uses updated components
            for (const { type, start, end } of bodyNodes) {
              const relStart = start - funcNode.start, relEnd = end - funcNode.start
              const statement = originalFuncCode.substring(relStart, relEnd)

              if (type === 'ExpressionStatement' && originalFuncCode.indexOf(jsxComponent.refName, relStart) === relStart) {
                updateInitializeLines += `${refObjectName}.${statement};`
              }
            }

            //find ref object name (refs)
            for (const v of originalFuncCode.matchAll(new RegExp(jsxComponent.refName, 'g'))) {
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

    }

    if (!refObjectName) {  // no ref object found
      refObjectName = 'refs'
      insertCodeToFirstLine += `const ${refObjectName}={};`
    }
    for (let i = execLater.length; i--;) {
      execLater[i]()
    }
    let insertCodeBeforeHotListener = ''
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
      insertCodeBeforeHotListener = `const ${selfVarName}=${selfCode}`
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
      hotListenerCode = `const newElem=Blue.r(Comp, attr, ${this.PARAM_ALTER_NAME}.children?.map(elem=>elem.__newElem||elem))`
    } else {
      hotListenerCode = `const newElem=Blue.r(Comp, attr)`
    }
    hotListenerCode =
      `\n${selfVarName}.${this.UPDATE_LISTENER_FUNC_NAME} = (Comp, attr) =>{
    ${hotListenerCode}
    ${selfVarName}.__newElem=newElem
    ${selfVarName}.before(newElem);
    ${selfVarName}.remove();
    return newElem
  }\n`
    //let listenerAdded = false
    for (const src in hotListenerInfo) {
      //listenerAdded || (listenerAdded = true)
      const listenerData = hotListenerInfo[src]
      hotListenerCode += `import.meta.hot.accept('${src}',({${listenerData.varMapCode}})=>{${listenerData.listenCode}});`
    }

    //if (listenerAdded) {
    hotListenerCode =
      `
${insertCodeBeforeHotListener}
if(import.meta.hot){
  ${hotListenerCode}
}else{
  console.warn('import.meta.hot does not exist')
}\n`
    //}
    funcCode = this.insertCode(
      hotListenerCode,
      insertHotListenerPlace,
      funcCode,
      insertRecord
    )
    return funcCode
  }

  private resolveFilePath(filepath: string, fromPath: string): string | false {
    const dPath = path.resolve(fromPath, '../', filepath)
    try {
      const stat = fs.statSync(dPath)
      if (stat.isDirectory()) {
        const filenames = fs.readdirSync(dPath)
        for (let i = filenames.length; i--;) {
          const filename = filenames[i]
          if (/index\.(?:[jt]sx|mdx?)$/.test(filename)) return filepath + '/' + filename
        }
      } else {
        if (stat.isFile()) return filepath
        return false
      }
    } catch (e) {

      const filenames = fs.readdirSync(path.resolve(dPath, '../'))
      const targetFileName = path.basename(filepath)
      const parentDirName = path.dirname(filepath)
      for (let i = filenames.length; i--;) {
        const filename = filenames[i]
        if (filename.indexOf(targetFileName) === 0 && /\.(?:[jt]sx|mdx?)$/.test(filename)) return parentDirName + '/' + filename
      }
    }
    return false
  }
  private analyzeTree(body: Node[], filepath: string){
    const imports: ImportsData = {
      varNames: [],
      info: {}
    }
    const exportedFuncs: Node[] = []
    const namesToLookFor: string[] = []
    for (let i = body.length; i--;) {
      const bNode = body[i]
      this.filterImports(bNode, imports, filepath)
      this.filterExportedFuncs(bNode, exportedFuncs, namesToLookFor)
    }

    return { imports, exportedFuncs }
  }
  private filterImports(node: Node, imports: ImportsData, filepath: string) {
    if (node.type !== 'ImportDeclaration' || node.source.value.indexOf('.') !== 0) return null
    const resolvedImportPath = this.resolveFilePath(node.source.value, filepath)
    if (!resolvedImportPath) return null
    const info: ImportInfo = {
      src: resolvedImportPath,
      imports: {}
    }
    imports.info[node.source.value] = info
    for (const specifier of node.specifiers) {
      let name: string = specifier.local.name
      if (specifier.type === 'ImportDefaultSpecifier') {
        //info.imports.default = name
        info.imports[name] = 'default'

      } else if (specifier.type === 'ImportSpecifier') {
        //info.imports[specifier.imported.name] = name
        info.imports[name] = specifier.imported.name
      }
      imports.varNames.push({ name, info })
    }
  }
  private filterFuncs(node: Node, funcNodes: Node[], namesToLookFor: string[], checkName = false){
    const { type } = node
    if (!checkName && type === 'FunctionDeclaration' || type === 'ArrowFunctionExpression') {
      funcNodes.push(node)
    } else if (type === 'VariableDeclaration') {
      if (checkName) {
        for (const declaration of node.declarations) {
          if (namesToLookFor.includes(declaration.id.name)) {
            this.filterFuncs(declaration.init, funcNodes, namesToLookFor)
          }
        }
      } else {
        for (const declaration of node.declarations) this.filterFuncs(declaration.init, funcNodes, namesToLookFor)
      }
    } else if (type === 'Identifier') namesToLookFor.push(node.name)
  }
  private filterExportedFuncs(node: Node, funcNodes: Node[], namesToLookFor: string[]){
    if (node.type === 'ExportDefaultDeclaration' || node.type === 'ExportNamedDeclaration') {
      const { declaration, specifiers } = node
      if (declaration) {
        this.filterFuncs(declaration, funcNodes, namesToLookFor)
      } else {
        specifiers.forEach(specifier => {
          this.filterFuncs(specifier.local, funcNodes, namesToLookFor)
        })
      }
    } else if (namesToLookFor.length) {
      this.filterFuncs(node, funcNodes, namesToLookFor, true)
    }
  }
  // getImports(body: Node[], filepath: string) {
  //   const imports: ImportsData = {
  //     varNames: [],
  //     info: {}
  //   }

  //   for (const node of body) {
  //     if (node.type !== 'ImportDeclaration' || node.source.value.indexOf('.') !== 0) continue
  //     const resolvedImportPath = this.resolveFilePath(node.source.value, filepath)
  //     if (!resolvedImportPath) continue
  //     const info: ImportInfo = {
  //       src: resolvedImportPath,
  //       imports: {}
  //     }
  //     imports.info[node.source.value] = info
  //     for (const specifier of node.specifiers) {
  //       let name: string = specifier.local.name
  //       if (specifier.type === 'ImportDefaultSpecifier') {
  //         //info.imports.default = name
  //         info.imports[name] = 'default'

  //       } else if (specifier.type === 'ImportSpecifier') {
  //         //info.imports[specifier.imported.name] = name
  //         info.imports[name] = specifier.imported.name
  //       }
  //       imports.varNames.push({ name, info })
  //     }
  //   }
  //   return imports
  // }
  // getExports(body: Node[]): Node[] {
  //   return body.filter(v => v.type === 'ExportDefaultDeclaration' || v.type === 'ExportNamedDeclaration')
  // }
  // getExportedFunctions(body: Node[]): Node[] {
  //   const funcNodes: Node[] = []
  //   const namesToLookFor: string[] = []
  //   const filterFuncs = (node: Node, checkName = false) => {
  //     const { type } = node
  //     if (!checkName && type === 'FunctionDeclaration' || type === 'ArrowFunctionExpression') {
  //       funcNodes.push(node)
  //     } else if (type === 'VariableDeclaration') {
  //       if (checkName) {
  //         for (const declaration of node.declarations) {
  //           if (namesToLookFor.includes(declaration.id.name)) {
  //             filterFuncs(declaration.init)
  //           }
  //         }
  //       } else {
  //         for (const declaration of node.declarations) filterFuncs(declaration.init)
  //       }
  //     } else if (type === 'Identifier') namesToLookFor.push(node.name)
  //   }
  //   for (let i = body.length; i--;) {
  //     const bNode = body[i]
  //     if (bNode.type === 'ExportDefaultDeclaration' || bNode.type === 'ExportNamedDeclaration') {
  //       const { declaration, specifiers } = bNode
  //       if (declaration) {
  //         filterFuncs(declaration)
  //       } else {
  //         specifiers.forEach(specifier => {
  //           filterFuncs(specifier.local)
  //         })
  //       }
  //     } else if (namesToLookFor.length) {
  //       filterFuncs(bNode, true)
  //     }
  //   }
  //   return funcNodes
  // }
  /** returns list of  */
  getDependentJSXComponents(code: string, imports: ImportsData) {
    const jsxInfo: ImportedJSXData[] = [];
    for (const v of code.matchAll(/Blue\.r\(([A-Z][A-z_]*)/g)) {
      const compName = v[1]
      let blueCallNode: Node = this.Parser.parseExpressionAt(code, v.index, { ecmaVersion: 'latest', sourceType: "module" })

      if (blueCallNode.type === 'SequenceExpression') {
        blueCallNode = blueCallNode.expressions.find((v: Node) => v.start === blueCallNode.start)
      }
      for (const i of imports.varNames) {
        if (i.name === compName) {

          const importedJSXData: ImportedJSXData = {
            name: compName,
            info: i.info,
            node: blueCallNode,
            index: v.index
          }
          jsxInfo.push(importedJSXData)
        }
      }
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