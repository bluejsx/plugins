var w=Object.create;var i=Object.defineProperty,$=Object.defineProperties,b=Object.getOwnPropertyDescriptor,y=Object.getOwnPropertyDescriptors,S=Object.getOwnPropertyNames,s=Object.getOwnPropertySymbols,U=Object.getPrototypeOf,f=Object.prototype.hasOwnProperty,k=Object.prototype.propertyIsEnumerable;var a=(r,e,t)=>e in r?i(r,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):r[e]=t,p=(r,e)=>{for(var t in e||(e={}))f.call(e,t)&&a(r,t,e[t]);if(s)for(var t of s(e))k.call(e,t)&&a(r,t,e[t]);return r},d=(r,e)=>$(r,y(e)),g=r=>i(r,"__esModule",{value:!0});var A=(r,e)=>{g(r);for(var t in e)i(r,t,{get:e[t],enumerable:!0})},T=(r,e,t)=>{if(e&&typeof e=="object"||typeof e=="function")for(let n of S(e))!f.call(r,n)&&n!=="default"&&i(r,n,{get:()=>e[n],enumerable:!(t=b(e,n))||t.enumerable});return r},m=r=>T(g(i(r!=null?w(U(r)):{},"default",r&&r.__esModule&&"default"in r?{get:()=>r.default,enumerable:!0}:{value:r,enumerable:!0})),r);A(exports,{default:()=>v});var B=typeof document=="undefined"?new(require("url")).URL("file:"+__filename).href:document.currentScript&&document.currentScript.src||new URL("main.js",document.baseURI).href;var u=m(require("jsx-transform")),h=m(require("markdown-it")),c=m(require("highlight.js")),x=m(require("@bluejsx/vite-plugin-blue-hmr")),I=/import +(?:[A-z0-9]*,? *)?(?:{ *(?:[A-z0-9]* *,?)* *})? *from *['"`][@A-z0-9\-\/\.?&]*['"`];?/g;function v(r={}){let e,t=new h.default(d(p({},r),{highlight:function(n,o){return c.default.highlightAuto(n,[o]).value.replace(/([{}])/g,'{"$&"}').replace(/\n/g,"<br />")},html:!0,xhtmlOut:!0}));return{name:"vite-plugin-bluemdx",configResolved(n){e=n},transform(n,o){if(!o.includes("node_modules")){if(/\.mdx$/.test(o)){n=t.render(n);let l="";return n=n.replace(I,j=>(l+=j+";","")),n=`${l}import Blue from 'bluejsx';export default ()=>${u.default.fromString(`<div>${n}</div>`,{factory:"Blue.r",passUnknownTagsToFactory:!0,arrayChildren:!1})}`,e.mode==="development"?x.hmrAdder.transform(n,o):n}else if(/\.md$/.test(o))return`import Blue from 'bluejsx';export default ()=>${u.default.fromString(`<div>${t.render(n)}</div>`,{factory:"Blue.r",passUnknownTagsToFactory:!0})}`}}}}0&&(module.exports={});
