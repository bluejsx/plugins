var b=Object.create;var l=Object.defineProperty,c=Object.defineProperties,w=Object.getOwnPropertyDescriptor,k=Object.getOwnPropertyDescriptors,y=Object.getOwnPropertyNames,u=Object.getOwnPropertySymbols,T=Object.getPrototypeOf,a=Object.prototype.hasOwnProperty,B=Object.prototype.propertyIsEnumerable;var f=(r,t,e)=>t in r?l(r,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):r[t]=e,g=(r,t)=>{for(var e in t||(t={}))a.call(t,e)&&f(r,e,t[e]);if(u)for(var e of u(t))B.call(t,e)&&f(r,e,t[e]);return r},p=(r,t)=>c(r,k(t)),h=r=>l(r,"__esModule",{value:!0});var I=(r,t)=>{h(r);for(var e in t)l(r,e,{get:t[e],enumerable:!0})},z=(r,t,e)=>{if(t&&typeof t=="object"||typeof t=="function")for(let n of y(t))!a.call(r,n)&&n!=="default"&&l(r,n,{get:()=>t[n],enumerable:!(e=w(t,n))||e.enumerable});return r},i=r=>z(h(l(r!=null?b(T(r)):{},"default",r&&r.__esModule&&"default"in r?{get:()=>r.default,enumerable:!0}:{value:r,enumerable:!0})),r);I(exports,{default:()=>$});var m=i(require("jsx-transform")),d=i(require("markdown-it")),x=i(require("highlight.js")),v=i(require("@bluejsx/vite-plugin-blue-hmr")),A=/import +(?:[A-z0-9]*,? *)?(?:{ *(?:[A-z0-9]* *,?)* *})? *from *['"`][@A-z0-9\-\/\.?&]*['"`];?/g;function $(r={}){let t,e=new d.default(p(g({},r),{highlight:function(n,o){return x.default.highlight(n,{language:o,ignoreIllegals:!0}).value.replace(/([{}])/g,'{"$&"}').replace(/\n/g,"<br />")},html:!0,xhtmlOut:!0}));return{name:"vite-plugin-bluemdx",configResolved(n){t=n},transform(n,o){if(!o.includes("node_modules")){if(/\.mdx$/.test(o)){n=e.render(n);let s="";return n=n.replace(A,j=>(s+=j+";","")),n=`${s}import Blue from 'bluejsx';export default ()=>${m.default.fromString(`<div>${n}</div>`,{factory:"Blue.r",passUnknownTagsToFactory:!0,arrayChildren:!1})}`,t.mode==="development"?(0,v.transform)(n,o):n}else if(/\.md$/.test(o))return`import Blue from 'bluejsx';export default ()=>${m.default.fromString(`<div>${e.render(n)}</div>`,{factory:"Blue.r",passUnknownTagsToFactory:!0})}`}}}}0&&(module.exports={});
