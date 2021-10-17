# Vite Plugin Bluejsx HMR

This is a plugin for providing HMR (Hot Module Replacement) into vite development.
## install
```sh
npm i -D @bluejsx/vite-plugin-blue-hmr
```


## Usage 

```js
import HMRLoader, { hmrAdder } from '@bluejsx/vite-plugin-blue-hmr'
```

### `hmrAdder.transform`
```ts
hmrAdder.transform(code: string) : string
```
- This takes in code and returns modified code to enable HMR
- This would be useful if you want to add HMR for other file formats (e.g. `.mdx`)


### `HMRLoader` plugin

```js
/** @type {import('vite').UserConfig} */
export default ({
  esbuild: {
    jsxFactory: 'Blue.r',
    jsxFragment: 'Blue.Fragment',
    jsxInject: `import Blue from 'bluejsx'`
  },
  plugins: [
    HMRLoader(),
  ],
  base: './',
  assetsInclude: 'public/*'
})
```