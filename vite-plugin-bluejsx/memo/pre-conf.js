import swc from '@swc/core'
code = `import Blue from 'bluejsx';${swc.transformSync(code, {
  jsc: {
    parser: {
      syntax: "typescript",
      tsx: true,
      decorators: true
    },
    target: "es2020",
    transform: {
      react: {
        pragma: "Blue.r",
        pragmaFrag: "Blue.Fragment",

      }
    }
  }
}).code}`