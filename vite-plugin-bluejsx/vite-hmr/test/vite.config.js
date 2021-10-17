const path = require('path')
/**
 * @type {import('vite').UserConfig}
 */
export default ({
  // esbuild: {
  //   jsxFactory: 'Blue.r',
  //   jsxFragment: 'Blue.Fragment',
  //   jsxInject: `import Blue from 'bluejsx'`
  // },
  // build: {
  //   rollupOptions: {
  //     // make sure to externalize deps that shouldn't be bundled
  //     // into your library
  //     external: [],
  //     output: {
  //       // Provide global variables to use in the UMD build
  //       // for externalized deps
  //       globals: {
  //       }
  //     }
  //   }
  // }
  base: './',
  assetsInclude: 'public/*'
})