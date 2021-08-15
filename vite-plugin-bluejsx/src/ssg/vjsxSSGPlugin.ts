import type { Plugin } from 'vite'
import { addHMR } from './blueHMR'
import { compileForSSG } from './vjsxSSG'
const { log } = console

export function vjsxSSGPlugin(): Plugin{
  let config
  return {
    name: 'vite-plugin-vjsx-ssg',
    configResolved(resolvedConfig) {
      // store the resolved config
      config = resolvedConfig
    },
    transform(code, id, ssr){
      if(/\.(jsx|tsx)/.test(id)){
        if (config.command === 'serve') {
          // serve: plugin invoked by dev server
          log(code)
          return {
            code: addHMR(code),
            map: null
          }
        } else {
          // build: plugin invoked by Rollup
          return {
            code: compileForSSG(code),
            map: null
          }
        }
      }
    },
    transformIndexHtml(html, ctx){
      return html
    },
    handleHotUpdate({ server }){
      /*
      server.ws.send({
        type: 'custom',
        event: 'special-update',
        data: {}
      })
      */
      return []
    }
  }
}