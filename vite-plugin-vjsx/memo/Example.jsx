import { useAttr } from '@vanillajsx/vjsx'
import { CustomProgress } from './CustomProgress'

export const Example = ({ progValue = 0, children = null }) => {
  const progress = <CustomProgress max='100' value={progValue} />
  /*
    find all lines depends on `progress` variable
    transform them into one function which takes `progress` as a parameter.
    
   */
  progress.dataset.vjsxHmr = 'aaa'
  const refs = {}
  const self = (
    <div class='t3'>
      <button ref={[refs, 'btn']}>click</button>
      {progress}
      {(set, elem) => elem.watch('progValue', v => set(v))} %
      {children}
    </div>
  )
  const { btn } = refs
  useAttr(self, 'progValue', progValue)
  self.watch('progValue', v => progress.value = v)

  btn.onclick = () => {
    if (self.progValue < 100) self.progValue += 10
    else self.progValue = 0
  }
  return self
}
const init1 = (self) =>{
  
}
export { init1 }

if (import.meta.hot) {
  const hot = import.meta.hot

  hot.accept('./CustomProgress', (newMod) => {
    const { CustomProgress } = newMod
    if (elem.parentElement) {
      const parent = elem.parentElement
      const i = Array.prototype.indexOf.call(parent.children, elem)
      elem.remove()
      const ${ modName } = newMod
      if (i === 0) elem.parentElement.firstElementChild.before(${ compName })
      else elem.parentElement.children[i - 1].after(${ compName })
    }

  })

}
