
function addHMR(code: string): string{
  const componentNames: [string,string][] = [...code.matchAll(/import +({? *[\w]+ *}?) +from +['"]([\w./@]+)['"]/g)].map(v=>v.slice(1) as [string,string])
  
  return code+`
  if (import.meta.hot) {
    const hot = import.meta.hot
    ${
      componentNames.map(([modName, modFile])=>{
        const compName = (/{? *([\w]+) *}?/).exec(modName)[1]
        return `hot.accept(${modFile}, (newMod) => {
          const elem = ${compName}
          if(elem.parentElement){
            const parent = elem.parentElement
            const i = Array.prototype.indexOf.call(parent.children, elem)
            elem.remove()
            const ${modName} = newMod
            if(i===0) elem.parentElement.firstElementChild.before(${compName})
            else elem.parentElement.children[i-1].after(${compName})
          }

        })`
      })
    }
  }`
}


export { addHMR }