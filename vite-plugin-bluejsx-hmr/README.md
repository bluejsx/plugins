# Vite Plugin Bluejsx HMR

This is a plugin to enable HMR (Hot Module Replacement) into your vite environment.
## installation
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
- This takes in BlueJSX code and returns modified code which enables HMR
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
