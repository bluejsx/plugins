import type { ResolvedConfig, PluginOption } from 'vite'

//import { addHMR } from './hmr'


export default function mdxToJS(options = {}): PluginOption {
  let config: ResolvedConfig

  return {
    name: 'vite-plugin-bluemdx',
    configResolved(resolvedConfig) {
      // store the resolved config
      config = resolvedConfig
    },
    transform(code, id) {
      if (/\.(jsx|tsx)/.test(id)) {
        if (config.command === 'serve') {
          // serve: plugin invoked by dev server
          return {
            //code: addHMR(code),
            map: null
          }
        } else {
          // build: plugin invoked by Rollup
          return {
            code: code,
            map: null
          }
        }
      }
    }
  }
}
