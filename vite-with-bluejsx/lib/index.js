import t from"@bluejsx/vite-plugin-blue-hmr";import s from"@bluejsx/vite-plugin-bluemdx";function m(e){var u,l;(u=e.esbuild)!=null||(e.esbuild={});let r=e.esbuild;return r.jsxFactory="Blue.r",r.jsxFragment="Blue.Fragment",r.jsxInject="import Blue from 'bluejsx'",(l=e.plugins)!=null||(e.plugins=[]),e.plugins.push(t(),s()),e}export{m as default};
