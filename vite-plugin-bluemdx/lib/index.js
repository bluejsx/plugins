var g=Object.defineProperty,p=Object.defineProperties;var h=Object.getOwnPropertyDescriptors;var i=Object.getOwnPropertySymbols;var d=Object.prototype.hasOwnProperty,x=Object.prototype.propertyIsEnumerable;var m=(n,r,t)=>r in n?g(n,r,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[r]=t,s=(n,r)=>{for(var t in r||(r={}))d.call(r,t)&&m(n,t,r[t]);if(i)for(var t of i(r))x.call(r,t)&&m(n,t,r[t]);return n},u=(n,r)=>p(n,h(r));import a from"jsx-transform";import v from"markdown-it";import $ from"highlight.js";import{transform as j}from"@bluejsx/vite-plugin-blue-hmr";var b=/import +(?:[A-z0-9]*,? *)?(?:{ *(?:[A-z0-9]* *,?)* *})? *from *['"`][@A-z0-9\-\/\.?&]*['"`];?/g;function c(n={}){let r,t=new v(u(s({},n),{highlight:function(e,o){return $.highlight(e,{language:o,ignoreIllegals:!0}).value.replace(/([{}])/g,'{"$&"}').replace(/\n/g,"<br />")},html:!0,xhtmlOut:!0}));return{name:"vite-plugin-bluemdx",configResolved(e){r=e},transform(e,o){if(!o.includes("node_modules")){if(/\.mdx$/.test(o)){e=t.render(e);let l="";return e=e.replace(b,f=>(l+=f+";","")),e=`${l}import Blue from 'bluejsx';export default ()=>${a.fromString(`<div>${e}</div>`,{factory:"Blue.r",passUnknownTagsToFactory:!0,arrayChildren:!1})}`,r.mode==="development"?j(e,o):e}else if(/\.md$/.test(o))return`import Blue from 'bluejsx';export default ()=>${a.fromString(`<div>${t.render(e)}</div>`,{factory:"Blue.r",passUnknownTagsToFactory:!0})}`}}}}export{c as default};
