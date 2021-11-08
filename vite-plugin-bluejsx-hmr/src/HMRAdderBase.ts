export type InsertRecord = [
  number,
  number
][]
export default class HMRAdderBase {
  UPDATE_LISTENER_FUNC_NAME = '_bjsx_hmr_update'
  PARAM_ALTER_NAME = '_blue_insert_params'
  constructor(/*private code: string*/) {

  }
  transform(code: string, path: string) {

  }
  getImports(...args: any): any {
    return []
  }
  getExports(...args: any): any[] {
    return []
  }
  /** returns node list of  */
  getDependentJSXComponents(code: string, imports: any) {
    return []
  }
  getFunctions(nodeList: any[]): any[] {
    return []
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
  getInsertRecord(): InsertRecord {
    return []
  }
  /**
   * replace specific range 
   * @param insertCode inserting new code
   * @param range set of replacing locations `[startIndex, endIndex]`
   * @param code original code
   * @param insertRecord use `getInsertRecord()` to get `InsertRecord` object
   * @returns result entire code string
   */
  replaceCode(insertCode: string, range: [number, number], code: string, insertRecord: InsertRecord, insertInBack: boolean = false) {
    let prevShift = 0
    insertRecord.filter(v => v[0] < range[0] || (insertInBack && v[0] === range[0])).forEach(v => prevShift += v[1])
    insertRecord.push([range[0], insertCode.length - range[1] + range[0]])
    return code.substring(0, range[0] + prevShift) + insertCode + code.substring(range[1] + prevShift)
  }
  /**
   * insert code to specific place
   * @param insertCode inserting new code
   * @param index inserting location
   * @param code original code
   * @param insertRecord use `getInsertRecord()` to get `InsertRecord` object
   * @returns result entire code string
   */
  insertCode(insertCode: string, index: number, code: string, insertRecord: InsertRecord, insertInBack: boolean = false) {
    return this.replaceCode(insertCode, [index, index], code, insertRecord, insertInBack)
  }
  getCodeFragment(range: [number, number], code: string, insertRecord: InsertRecord): string {
    let i1 = range[0], i2 = range[1]
    for (let c = insertRecord.length; c--;) {
      const [index, shift] = insertRecord[c]

      if (index < range[1]) {
        i2 += shift
        if (index < range[0]) {
          i1 += shift
        }
      }
    }
    return code.substring(i1, i2)
  }
}