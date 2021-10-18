import{Parser as q}from"acorn";var x=class{constructor(){this.UPDATE_LISTENER_FUNC_NAME="_bjsx_hmr_update";this.PARAM_ALTER_NAME="_blue_insert_params"}transform(t){}getImports(...t){return[]}getExports(...t){return[]}getDependentJSXComponents(t,e){return[]}getFunctions(t){return[]}getVars(t,e){return[]}fromDirectReturnToVarReturn(t){return""}getReturnValue(t){return""}getInsertRecord(){return[]}replaceCode(t,e,r,o,s=!1){let a=0;return o.filter(n=>n[0]<e[0]||s&&n[0]===e[0]).forEach(n=>a+=n[1]),o.push([e[0],t.length-e[1]+e[0]]),r.substring(0,e[0]+a)+t+r.substring(e[1]+a)}insertCode(t,e,r,o,s=!1){return this.replaceCode(t,[e,e],r,o,s)}getCodeFragment(t,e,r){let o=t[0],s=t[1];for(let a=r.length;a--;){let[n,c]=r[a];n<t[1]&&(s+=c,n<t[0]&&(o+=c))}return e.substring(o,s)}};import _ from"path";import M from"fs";var S=class extends x{constructor(){super();this.Parser=q}transform(t,e){t=t.replace(/=>/g,"=> ");let r=this.Parser.parse(t,{ecmaVersion:"latest",sourceType:"module"}),o=t,s=this.getImports(r.body,e),a=this.getExportedFunctions(r.body),n=this.getInsertRecord();return a.forEach(c=>{let{start:p,end:E}=c,y=this.getCodeFragment([p,E],t,n),f=this.getDependentJSXComponents(y,s);t=this.replaceCode(this.processFunctionCode(f,c,y,o),[p,E],t,n)}),t}addHotListenerInfo(t,e,r,o){var a,n;(n=t[a=e.info.src])!=null||(t[a]={varMapCode:"",listenCode:""});let s=t[e.info.src];s.varMapCode+=`${e.info.imports[e.name]}:${e.name},`,s.listenCode+=`
if(${r}.${e.refName}.${this.UPDATE_LISTENER_FUNC_NAME}){
  ${r}.${e.refName}=${r}.${e.refName}.${this.UPDATE_LISTENER_FUNC_NAME}(${e.name}, ${e.attrObjCode?e.attrObjCode:"null"});
  ${o}
}else{
  import.meta.hot.decline()
}
`}processFunctionCode(t,e,r,o){var L,V,w,B,H,J;let s=this.getInsertRecord(),a=r,n=e.body,c=n.start-e.start,p=n.end-e.start,E=n.body,y=e.params[0],f="";if(y){let i=y.start-e.start,l=y.end-e.start,u=r.substring(i,l);r=this.replaceCode(this.PARAM_ALTER_NAME,[i,l],r,s),f=`
let ${u}=${this.PARAM_ALTER_NAME};`}let g="self",R=[],A={},d,T=0,m=E==null?void 0:E.find(i=>i.type==="ReturnStatement"),$=n.type==="CallExpression"&&((V=(L=n.callee)==null?void 0:L.object)==null?void 0:V.name)==="Blue";if(m)m.argument.type==="Identifier"&&(g=m.argument.name);else if(!$)return a;let O=m&&m.argument.type==="CallExpression"&&((B=(w=m.argument.callee)==null?void 0:w.object)==null?void 0:B.name)==="Blue",X=$?p:m.start-e.start;for(let i of r.matchAll(/Blue\.r\(/g)){let l=this.Parser.parseExpressionAt(r,i.index,{ecmaVersion:"latest",sourceType:"module"});if(l.type==="SequenceExpression"&&(l=l.expressions.find(u=>u.start===l.start)),(l==null?void 0:l.type)==="CallExpression"&&((H=l==null?void 0:l.arguments[1])==null?void 0:H.type)==="ObjectExpression"){let u=(J=l.arguments[1].properties.find(N=>{var b;return((b=N.key)==null?void 0:b.name)==="ref"}))==null?void 0:J.value.elements[0].name;if(u){d=u;break}}}t.forEach(i=>{let l=i.node.arguments[1];if(l.type==="ObjectExpression"){i.attrObjCode=a.substring(l.start,l.end);let u=l.properties.find(N=>N.key.name==="ref");if(u){let N="",b=u.value.elements;if(i.refName=b[1].value,i.hasRef=!0,!$){E.forEach(({type:D,start:I,end:C})=>{let P=I-e.start,U=C-e.start,k=a.substring(P,U);D==="ExpressionStatement"&&a.indexOf(i.refName,P)===P&&(N+=`${d}.${k};`)});for(let D of a.matchAll(new RegExp(i.refName,"g")))try{let I=this.Parser.parseExpressionAt(a,D.index,{ecmaVersion:"latest",sourceType:"module"});(I.type==="AssignmentExpression"||I.type==="CallExpression")&&(r=this.insertCode(`${d}.`,D.index,r,s))}catch{}}this.addHotListenerInfo(A,i,d,N)}else i.refName=`bjsxc_${T++}`,i.hasRef=!1,R.push(()=>{r=this.insertCode(`ref:[${d},'${i.refName}'],`,l.start+1,r,s),this.addHotListenerInfo(A,i,d,"")})}else i.refName=`bjsxc_${T++}`,R.push(()=>{r=this.replaceCode(`{ref:[${d},'${i.refName}']}`,[l.start,l.start+4],r,s),this.addHotListenerInfo(A,i,d,"")})}),d||(d="refs",f+=`const ${d}={};`);for(let i=R.length;i--;)R[i]();if($)f=`{${f}const ${g}=`,r=this.insertCode(`
return ${g};}`,n.end,r,s,!0);else if(O){let i=this.getCodeFragment([m.start-e.start+6,m.end-e.start],r,s);f=`${f}
      const ${g}=${i};`,r=this.replaceCode(`
return ${g};`,[m.start-e.start,m.start-e.start+i.length+7],r,s)}r=this.insertCode(f,$?c:c+1,r,s);let h="";y?h=`const newElem=Blue.r(Comp, attr, ${this.PARAM_ALTER_NAME}.children)`:h="const newElem=Blue.r(Comp, attr)",h=`
${g}.${this.UPDATE_LISTENER_FUNC_NAME} = (Comp, attr) =>{
    ${h}
    ${g}.before(newElem);
    ${g}.remove();
    return newElem
  }
`;let v=!1;for(let i in A){v||(v=!0);let l=A[i];h+=`import.meta.hot.accept('${i}',({${l.varMapCode}})=>{${l.listenCode}});`}return v&&(h=`
if(import.meta.hot){
  ${h}
}else{
  console.warn('import.meta.hot does not exist')
}
`),r=this.insertCode(h,X,r,s),r}resolveFilePath(t,e){let r=_.resolve(e,"../",t);try{let o=M.statSync(r);if(o.isDirectory()){let s=M.readdirSync(r);for(let a=s.length;a--;){let n=s[a];if(/index\.[jt]sx$/.test(n))return t+"/"+n}}else return o.isFile()?t:!1}catch{let s=M.readdirSync(_.resolve(r,"../")),a=_.basename(t),n=_.dirname(t);for(let c=s.length;c--;){let p=s[c];if(s.indexOf(a)===0&&/\.[jt]sx$/.test(p))return n+"/"+p}}return!1}getImports(t,e){let r={varNames:[],info:{}};return t.forEach(o=>{if(o.type!=="ImportDeclaration"||o.source.value.indexOf(".")!==0)return 0;let s=this.resolveFilePath(o.source.value,e);if(!s)return 0;let a={src:s,imports:{}};r.info[o.source.value]=a,o.specifiers.forEach(n=>{let c=n.local.name;n.type==="ImportDefaultSpecifier"?a.imports[c]="default":n.type==="ImportSpecifier"&&(a.imports[c]=n.imported.name),r.varNames.push({name:c,info:a})})}),r}getExports(t){return t.filter(e=>e.type==="ExportDefaultDeclaration"||e.type==="ExportNamedDeclaration")}getExportedFunctions(t){let e=[],r=[],o=(s,a=!1)=>{let{type:n}=s;!a&&n==="FunctionDeclaration"||n==="ArrowFunctionExpression"?e.push(s):n==="VariableDeclaration"?a?s.declarations.forEach(c=>{r.includes(c.id.name)&&o(c.init)}):s.declarations.forEach(c=>o(c.init)):n==="Identifier"&&r.push(s.name)};for(let s=t.length;s--;){let a=t[s];if(a.type==="ExportDefaultDeclaration"||a.type==="ExportNamedDeclaration"){let{declaration:n,specifiers:c}=a;n?o(n):c.forEach(p=>{o(p.local)})}else r.length&&o(a,!0)}return e}getDependentJSXComponents(t,e){let r=[];for(let o of t.matchAll(/Blue\.r\(([A-Z][A-z_]*)/g)){let s=o[1],a=this.Parser.parseExpressionAt(t,o.index,{ecmaVersion:"latest",sourceType:"module"});a.type==="SequenceExpression"&&(a=a.expressions.find(n=>n.start===a.start)),e.varNames.forEach(n=>{if(n.name===s){let c={name:s,info:n.info,node:a,index:o.index};r.push(c)}})}return r}getVars(t,e){return[]}fromDirectReturnToVarReturn(t){return""}getReturnValue(t){return""}};var z=new S;function Z({enabled:F}={enabled:!0}){return{name:"vite-plugin-blue-hmr",apply(t,{command:e}){return F&&e==="serve"},transform(t,e){if(!e.includes("node_modules")&&/\.[jt]sx$/.test(e))return z.transform(t,e)}}}export{Z as default,z as hmrAdder};
