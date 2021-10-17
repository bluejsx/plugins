import dirTree from 'directory-tree'
import { resolve, relative } from 'path'
import { createServer, ViteDevServer } from 'vite'
import fs from 'fs'

/**
 * 
 * @param {ViteDevServer} server 
 * @returns 
 */
async function restartServer(server) {
  // @ts-ignore
  global.__vite_start_time = Date.now()
  const { port } = server.config.server

  await server.close()

  let newServer = null
  try {
    newServer = await createServer(server.config.inlineConfig)
  } catch (err) {
    server.config.logger.error(err.message, {
      timestamp: true,
    })
    return
  }

  for (const key in newServer) {
    if (key !== 'app') {
      // @ts-ignore
      server[key] = newServer[key]
    }
  }
  if (!server.config.server.middlewareMode) {
    await server.listen(port, true)
  } else {
    server.config.logger.info('server restarted.', { timestamp: true })
  }
}

/**
 * 
 * @param {import('vite').UserConfig} config 
 */
export default function withPages(config) {

  /** html entry files */
  const entries = {}

  /** directory where `vite.config.js` is located */
  const projectRoot = resolve(require.main.path, '../../../')
  //console.log(projectRoot)

  /** original `pages` folder in project */
  const srcPagesDir = resolve(projectRoot, './pages')

  /** path of entry html files */
  const outDir = resolve(projectRoot, './node_modules/.blue-pages')
  const outPagesDir = resolve(outDir, './pages')

  //clean old html sources
  fs.rmdirSync(outPagesDir, { recursive: true })

  
  //get pages tree
  const tree = dirTree(srcPagesDir, {
    extensions: /\.(md|mdx|js|jsx|ts|tsx)$/,
    //extensions: /^[^_]+\.(md|mdx|js|jsx|ts|tsx)$/,
    //attributes: ['name', 'path'],
    normalizePath: true
  }, ({ name }, path) => {
    const relativePath = relative(projectRoot, path)
    const fileName = name.replace(/.[\w]+$/, '')
    if(fileName.indexOf('_')===0) return null
    /** path location of html entry  */
    const outFilePath = resolve(outDir + '/' + relativePath, '../')

    //create folder structure
    fs.mkdirSync(outFilePath, { recursive: true })
    //output html
    const outHTMLPath = resolve(outFilePath, `./${fileName}.html`)

    fs.writeFileSync(resolve(outFilePath, `./${fileName}.js`), `import Page from '${srcPagesDir}/_app';import Component from '${path}';Page({Component})`)
    const html = fs.readFileSync(`${srcPagesDir}/_template.html`, 'utf-8').replace('</body', `<script type="module" src="./${fileName}.js"></script></body`)
    fs.writeFileSync(outHTMLPath, html)
    //fs.copyFileSync(`${srcPagesDir}/_template.html`, outHTMLPath)
    entries[fileName] = outHTMLPath
  })
  //change config
  const virtualTreeId = '@virtual:pages-tree'
  config.plugins.push({
    name: 'with-pages-dir-tree', // required, will show up in warnings and errors
    resolveId(id) {
      if (id === virtualTreeId) {
        return virtualTreeId
      }
    },
    load(id) {
      if (id === virtualTreeId) {
        return `export const tree = ${JSON.stringify(tree)}`
      }
    }
  })
  config.plugins.push({
    name: 'with-pages-listen-dir', // required, will show up in warnings and errors
    async configureServer(server) {
      const { watcher } = server
      watcher.add(srcPagesDir)
      watcher.on('add', (path, stats)=>{
        if(path.includes(srcPagesDir)) restartServer(server)
      })
    }
  })

  if ('build' in config) {
    if ('rollupOptions' in config.build) {
      config.build.rollupOptions.input = entries
    } else {
      config.build.rollupOptions = {
        input: entries
      }
    }
  } else {
    config.build = {
      rollupOptions: {
        input: entries
      }
    }
  }
  console.log(config.build.rollupOptions.input)
  
  config.root = outPagesDir
  config.build.outDir = relative(outPagesDir, resolve(projectRoot, './dist'))

  return config
}