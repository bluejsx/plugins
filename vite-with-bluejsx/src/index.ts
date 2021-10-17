import HMRLoader from '@bluejsx/vite-plugin-blue-hmr'
import mdxLoader from '@bluejsx/vite-plugin-bluemdx'
import { UserConfig } from 'vite'

export default function withBlueJSX(config: UserConfig): UserConfig {
  config.esbuild ??= {}
  const esbuild = config.esbuild
  esbuild.jsxFactory = 'Blue.r'
  esbuild.jsxFragment = 'Blue.Fragment'
  esbuild.jsxInject = `import Blue from 'bluejsx'`

  config.plugins ??= []
  config.plugins.push(HMRLoader(), mdxLoader())

  
  return config
}