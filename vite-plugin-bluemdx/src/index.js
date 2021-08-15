import jsx from 'jsx-transform'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
const regImports = /import +(?:[A-z0-9]*,? *)?(?:{ *(?:[A-z0-9]* *,?)* *})? *from *['"`][@A-z0-9\-\/\.?&]*['"`];?/g
/**
 * 
 * @param {MarkdownIt.Options} options 
 * @returns {import('vite').PluginOption}
 */
export default function mdxToJS(options = {}) {
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
      if (/\.mdx$/.test(id)) {
        code = md.render(code)
        let imports = ''
        code = code.replace(regImports, (match)=>{
          imports += match + ';'
          return ''
        })
        return `${imports}import Blue from 'bluejsx';export default ${jsx.fromString(`<div>${code}</div>`, {
          factory: 'Blue.r',
          passUnknownTagsToFactory: true,
        })}`
      }
    }
  }
}