import jsx from 'jsx-transform'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import { hmrAdder } from '@bluejsx/vite-plugin-blue-hmr'
const regImports = /import +(?:[A-z0-9]*,? *)?(?:{ *(?:[A-z0-9]* *,?)* *})? *from *['"`][@A-z0-9\-\/\.?&]*['"`];?/g
/**
 * @returns {import('vite').PluginOption}
 */
export default function mdxToJS(options: MarkdownIt.Options = {}) {
  /** @type {import('vite').ResolvedConfig} */
  let config
  const md = new MarkdownIt({
    ...options,
    highlight: function (code, lang) {
      return hljs.highlightAuto(code, [lang]).value.replace(/([{}])/g, '{"$&"}').replace(/\n/g, '<br />')
    },
    html: true,
    xhtmlOut: true
  })
  return {
    name: 'vite-plugin-bluemdx',
    configResolved(resolvedConfig) {
      // store the resolved config
      config = resolvedConfig
    },
    transform(code, id) {
      if (!id.includes('node_modules') && /\.mdx$/.test(id)) {
        code = md.render(code)
        let imports = ''
        code = code.replace(regImports, (match)=>{
          imports += match + ';'
          return ''
        })
        code = `${imports}import Blue from 'bluejsx';export default ()=>${jsx.fromString(`<div>${code}</div>`, {
          factory: 'Blue.r',
          passUnknownTagsToFactory: true,
          arrayChildren: false,
        })}`
        if(config.mode==='development'){
          return hmrAdder.transform(code, id)
        }else {
          return code
        }
      }
    }
  }
}