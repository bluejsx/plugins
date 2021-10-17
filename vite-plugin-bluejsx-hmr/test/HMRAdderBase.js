class HMRAdderBase {
    constructor(){
        this.UPDATE_LISTENER_FUNC_NAME = '_bjsx_hmr_update';
        this.PARAM_ALTER_NAME = '_blue_insert_params';
    }
    transform(code) {
    }
    getImports(...args) {
        return [];
    }
    getExports(...args) {
        return [];
    }
    /** returns node list of  */ getDependentJSXComponents(code, imports) {
        return [];
    }
    getFunctions(nodeList) {
        return [];
    }
    getVars(searchVar, scopeCode) {
        return [];
    }
    fromDirectReturnToVarReturn(code) {
        return '';
    }
    getReturnValue(funcNode) {
        return '';
    }
    getInsertRecord() {
        return [];
    }
    /**
   * replace specific range 
   * @param insertCode inserting new code
   * @param range set of replacing locations `[startIndex, endIndex]`
   * @param code original code
   * @param insertRecord use `getInsertRecord()` to get `InsertRecord` object
   * @returns result entire code string
   */ replaceCode(insertCode, range, code, insertRecord, insertInBack = false) {
        let prevShift = 0;
        insertRecord.filter((v)=>v[0] < range[0] || insertInBack && v[0] === range[0]
        ).forEach((v)=>prevShift += v[1]
        );
        insertRecord.push([
            range[0],
            insertCode.length - range[1] + range[0]
        ]);
        return code.substring(0, range[0] + prevShift) + insertCode + code.substring(range[1] + prevShift);
    }
    /**
   * insert code to specific place
   * @param insertCode inserting new code
   * @param index inserting location
   * @param code original code
   * @param insertRecord use `getInsertRecord()` to get `InsertRecord` object
   * @returns result entire code string
   */ insertCode(insertCode, index, code, insertRecord, insertInBack = false) {
        return this.replaceCode(insertCode, [
            index,
            index
        ], code, insertRecord, insertInBack);
    }
    getCodeFragment(range, code, insertRecord) {
        let i1 = range[0], i2 = range[1];
        for(let c = insertRecord.length; c--;){
            const [index, shift] = insertRecord[c];
            if (index < range[1]) {
                i2 += shift;
                if (index < range[0]) {
                    i1 += shift;
                }
            }
        }
        return code.substring(i1, i2);
    }
}
export { HMRAdderBase as default };
