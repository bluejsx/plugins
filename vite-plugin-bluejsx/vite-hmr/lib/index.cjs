var Q=Object.create;var S=Object.defineProperty;var W=Object.getOwnPropertyDescriptor;var Y=Object.getOwnPropertyNames;var j=Object.getPrototypeOf,ee=Object.prototype.hasOwnProperty;var C=c=>S(c,"__esModule",{value:!0});var te=(c,e)=>{C(c);for(var t in e)S(c,t,{get:e[t],enumerable:!0})},re=(c,e,t)=>{if(e&&typeof e=="object"||typeof e=="function")for(let r of Y(e))!ee.call(c,r)&&r!=="default"&&S(c,r,{get:()=>e[r],enumerable:!(t=W(e,r))||t.enumerable});return c},L=c=>re(C(S(c!=null?Q(j(c)):{},"default",c&&c.__esModule&&"default"in c?{get:()=>c.default,enumerable:!0}:{value:c,enumerable:!0})),c);te(exports,{default:()=>O,hmrAdder:()=>k});var w=typeof document=="undefined"?new(require("url")).URL("file:"+__filename).href:document.currentScript&&document.currentScript.src||new URL("main.js",document.baseURI).href;var B=L(require("acorn"));var F=class{constructor(){this.UPDATE_LISTENER_FUNC_NAME="_bjsx_hmr_update";this.PARAM_ALTER_NAME="_blue_insert_params"}transform(e){}getImports(...e){return[]}getExports(...e){return[]}getDependentJSXComponents(e,t){return[]}getFunctions(e){return[]}getVars(e,t){return[]}fromDirectReturnToVarReturn(e){return""}getReturnValue(e){return""}getInsertRecord(){return[]}replaceCode(e,t,r,n,s=!1){let o=0;return n.filter(a=>a[0]<t[0]||s&&a[0]===t[0]).forEach(a=>o+=a[1]),n.push([t[0],e.length-t[1]+t[0]]),r.substring(0,t[0]+o)+e+r.substring(t[1]+o)}insertCode(e,t,r,n,s=!1){return this.replaceCode(e,[t,t],r,n,s)}getCodeFragment(e,t,r){let n=e[0],s=e[1];for(let o=r.length;o--;){let[a,p]=r[o];a<e[1]&&(s+=p,a<e[0]&&(n+=p))}return t.substring(n,s)}};var b=L(require("path")),P=L(require("fs")),M=class extends F{constructor(){super();this.Parser=B.Parser}transform(e,t){e=e.replace(/addEventListener/g,"on").replace(/=>/g,"=> ");let r=this.Parser.parse(e,{ecmaVersion:"latest",sourceType:"module"}),n=e,s=this.getImports(r.body,t),o=this.getExportedFunctions(r.body),a=this.getInsertRecord();return o.forEach(p=>{let{start:g,end:h}=p,E=this.getCodeFragment([g,h],e,a),u=this.getDependentJSXComponents(E,s);e=this.replaceCode(this.processFunctionCode(u,p,E,n),[g,h],e,a)}),e}addHotListenerInfo(e,t,r,n){var o,a;(a=e[o=t.info.src])!=null||(e[o]={varMapCode:"",listenCode:""});let s=e[t.info.src];s.varMapCode+=`${t.info.imports[t.name]}:${t.name},`,s.listenCode+=`${r}.${t.refName}=${r}.${t.refName}.${this.UPDATE_LISTENER_FUNC_NAME}(${t.name});${n}`}processFunctionCode(e,t,r,n){var U,H,J,X;let s=this.getInsertRecord(),o=r,a=t.body,p=a.start-t.start,g=a.end-t.start,h=a.body,E=t.params[0],u="";if(E){let i=E.start-t.start,l=E.end-t.start,y=r.substring(i,l);r=this.replaceCode(this.PARAM_ALTER_NAME,[i,l],r,s),u=`
let ${y}=${this.PARAM_ALTER_NAME};`}let d="self",_=[],$={},m,V=0,f=h==null?void 0:h.find(i=>i.type==="ReturnStatement"),R=a.type==="CallExpression"&&((H=(U=a.callee)==null?void 0:U.object)==null?void 0:H.name)==="Blue";if(f)f.argument.type==="Identifier"&&(d=f.argument.name);else if(!R)return o;let q=f&&f.argument.type==="CallExpression"&&((X=(J=f.argument.callee)==null?void 0:J.object)==null?void 0:X.name)==="Blue",z=R?g:f.start-t.start;[...r.matchAll(/Blue\.r\(/g)].forEach(i=>{var y,N;let l=this.Parser.parseExpressionAt(r,i.index,{ecmaVersion:"latest",sourceType:"module"});l.type==="SequenceExpression"&&(l=l.expressions.find(x=>x.start===l.start)),(l==null?void 0:l.type)==="CallExpression"&&((y=l==null?void 0:l.arguments[1])==null?void 0:y.type)==="ObjectExpression"&&(m!=null||(m=(N=l.arguments[1].properties.find(x=>{var A;return((A=x.key)==null?void 0:A.name)==="ref"}))==null?void 0:N.value.elements[0].name))}),e.forEach(i=>{let l=i.node.arguments[1];if(l.type==="ObjectExpression"){let y=l.properties.find(N=>N.key.name==="ref");if(y){let N="",x=y.value.elements;i.refName=x[1].value,i.hasRef=!0,R||(h.forEach(({type:A,start:D,end:Z})=>{let v=D-t.start,G=Z-t.start,K=o.substring(v,G);A==="ExpressionStatement"&&o.indexOf(i.refName,v)===v&&(N+=`${m}.${K};`)}),[...o.matchAll(new RegExp(i.refName,"g"))].forEach(A=>{try{let D=this.Parser.parseExpressionAt(o,A.index,{ecmaVersion:"latest",sourceType:"module"});(D.type==="AssignmentExpression"||D.type==="CallExpression")&&(r=this.insertCode(`${m}.`,A.index,r,s))}catch{}})),this.addHotListenerInfo($,i,m,N)}else i.refName=`bjsxc_${V++}`,i.hasRef=!1,_.push(()=>{r=this.insertCode(`ref:[${m},'${i.refName}'],`,l.start+1,r,s),this.addHotListenerInfo($,i,m,"")})}else i.refName=`bjsxc_${V++}`,_.push(()=>{r=this.replaceCode(`{ref:[${m},'${i.refName}']}`,[l.start,l.start+4],r,s),this.addHotListenerInfo($,i,m,"")})}),m||(m="refs",u+=`const ${m}={};`);for(let i=_.length;i--;)_[i]();if(R)u=`{${u}const ${d}=`,r=this.insertCode(`
return ${d};}`,a.end,r,s,!0);else if(q){let i=this.getCodeFragment([f.start-t.start+6,f.end-t.start],r,s);u=`${u}
      const ${d}=${i};`,r=this.replaceCode(`
return ${d};`,[f.start-t.start,f.start-t.start+i.length+7],r,s)}r=this.insertCode(u,R?p:p+1,r,s);let I="";E?I=`
${d}.${this.UPDATE_LISTENER_FUNC_NAME} = (Comp) =>{
  const newElem=Comp(${this.PARAM_ALTER_NAME});
  ${d}.before(newElem);
  ${d}.remove();
  return newElem
}
`:I=`
${d}.${this.UPDATE_LISTENER_FUNC_NAME} = (Comp) =>{
  const newElem=Comp();
  ${d}.before(newElem);
  ${d}.remove();
  return newElem
}
`;let T=!1;for(let i in $){T||(T=!0);let l=$[i];I+=`import.meta.hot.accept('${i}',({${l.varMapCode}})=>{${l.listenCode}});`}return T&&(I=`
if(import.meta.hot){
  ${I}
}else{
  console.warn('import.meta.hot not exist')
}
`),r=this.insertCode(I,z,r,s),r}resolveFilePath(e,t){let r=b.default.resolve(t,"../",e);try{let n=P.default.statSync(r);if(n.isDirectory()){let s=P.default.readdirSync(r);for(let o=s.length;o--;){let a=s[o];if(/index\.[jt]sx$/.test(a))return e+"/"+a}}else return n.isFile()?e:!1}catch{let s=P.default.readdirSync(b.default.resolve(r,"../")),o=b.default.basename(e),a=b.default.dirname(e);for(let p=s.length;p--;){let g=s[p];if(s.indexOf(o)===0&&/\.[jt]sx$/.test(g))return a+"/"+g}}return!1}getImports(e,t){let r={varNames:[],info:{}};return e.forEach(n=>{if(n.type!=="ImportDeclaration"||n.source.value.indexOf(".")!==0)return 0;let s=this.resolveFilePath(n.source.value,t);if(!s)return 0;let o={src:s,imports:{}};r.info[n.source.value]=o,n.specifiers.forEach(a=>{let p=a.local.name;a.type==="ImportDefaultSpecifier"?o.imports[p]="default":a.type==="ImportSpecifier"&&(o.imports[p]=a.imported.name),r.varNames.push({name:p,info:o})})}),r}getExports(e){return e.filter(t=>t.type==="ExportDefaultDeclaration"||t.type==="ExportNamedDeclaration")}getExportedFunctions(e){let t=[],r=n=>{n.type==="FunctionDeclaration"||n.type==="ArrowFunctionExpression"?t.push(n):n.type==="VariableDeclaration"&&n.declarations.forEach(s=>r(s.init))};return e.forEach(n=>{if(n.type==="ExportDefaultDeclaration"||n.type==="ExportNamedDeclaration"){let{declaration:s}=n;s&&r(s)}}),t}getDependentJSXComponents(e,t){let r=[];return[...e.matchAll(/Blue\.r\(([A-Z][A-z_]*)/g)].forEach(n=>{let s=n[1],o=this.Parser.parseExpressionAt(e,n.index,{ecmaVersion:"latest",sourceType:"module"});o.type==="SequenceExpression"&&(o=o.expressions.find(a=>a.start===o.start)),t.varNames.forEach(a=>{if(a.name===s){let p={name:s,info:a.info,node:o,index:n.index};r.push(p)}})}),r}getVars(e,t){return[]}fromDirectReturnToVarReturn(e){return""}getReturnValue(e){return""}};var k=new M;function O({enabled:c}={enabled:!0}){return{name:"vite-plugin-blue-hmr",apply(e,{command:t}){return c&&t==="serve"},transform(e,t){if(/\.[jt]sx$/.test(t))return k.transform(e,t)}}}0&&(module.exports={hmrAdder});
