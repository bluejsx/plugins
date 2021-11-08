import HMRAdderAcorn from './HMRAdderAcorn'
import { PluginOption } from 'vite'

const hmrAdder = new HMRAdderAcorn()

export const transform = (code: string, path: string) => hmrAdder.transform(code, path)

export default function HMRLoader({ enabled } = { enabled: true }): PluginOption {
  return {
    name: 'vite-plugin-blue-hmr',
    apply(config, { command }) {
      return enabled && command === 'serve'
    },
    transform(code, id) {
      if (!id.includes('node_modules') && /\.[jt]sx$/.test(id)) {
        return hmrAdder.transform(code, id)
      }
    },
  }
}