var y=Object.create;var m=Object.defineProperty,T=Object.defineProperties,b=Object.getOwnPropertyDescriptor,j=Object.getOwnPropertyDescriptors,k=Object.getOwnPropertyNames,u=Object.getOwnPropertySymbols,B=Object.getPrototypeOf,a=Object.prototype.hasOwnProperty,z=Object.prototype.propertyIsEnumerable;var p=(r,t,e)=>t in r?m(r,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):r[t]=e,g=(r,t)=>{for(var e in t||(t={}))a.call(t,e)&&p(r,e,t[e]);if(u)for(var e of u(t))z.call(t,e)&&p(r,e,t[e]);return r},d=(r,t)=>T(r,j(t)),x=r=>m(r,"__esModule",{value:!0});var A=(r,t)=>{for(var e in t)m(r,e,{get:t[e],enumerable:!0})},h=(r,t,e,o)=>{if(t&&typeof t=="object"||typeof t=="function")for(let n of k(t))!a.call(r,n)&&(e||n!=="default")&&m(r,n,{get:()=>t[n],enumerable:!(o=b(t,n))||o.enumerable});return r},i=(r,t)=>h(x(m(r!=null?y(B(r)):{},"default",!t&&r&&r.__esModule?{get:()=>r.default,enumerable:!0}:{value:r,enumerable:!0})),r),I=(r=>(t,e)=>r&&r.get(t)||(e=h(x({}),t,1),r&&r.set(t,e),e))(typeof WeakMap!="undefined"?new WeakMap:0);var F={};A(F,{default:()=>c});var l=i(require("jsx-transform"),1),v=i(require("markdown-it"),1),s=i(require("highlight.js"),1),$=i(require("@bluejsx/vite-plugin-blue-hmr"),1),S=/import +(?:[A-z0-9]*,? *)?(?:{ *(?:[A-z0-9]* *,?)* *})? *from *['"`][@A-z0-9\-\/\.?&]*['"`];?/g;function c(r={}){let t,e=new v.default(d(g({},r),{highlight(o,n){return s.default.getLanguage(n)||(n="txt"),s.default.highlight(o,{language:n}).value.replace(/([{}])/g,'{"$&"}').replace(/\n/g,"<br />")},html:!0,xhtmlOut:!0}));return{name:"vite-plugin-bluemdx",configResolved(o){t=o},transform(o,n){if(!n.includes("node_modules")){if(/\.mdx$/.test(n)){o=e.render(o);let f="";return o=o.replace(S,w=>(f+=w+";","")),o=`${f}import Blue from 'bluejsx';export default ()=>${l.default.fromString(`<div>${o}</div>`,{factory:"Blue.r",passUnknownTagsToFactory:!0,arrayChildren:!1})}`,t.mode==="development"?(0,$.transform)(o,n):o}else if(/\.md$/.test(n))return`import Blue from 'bluejsx';export default ()=>${l.default.fromString(`<div>${e.render(o)}</div>`,{factory:"Blue.r",passUnknownTagsToFactory:!0})}`}}}}module.exports=I(F);0&&(module.exports={});
