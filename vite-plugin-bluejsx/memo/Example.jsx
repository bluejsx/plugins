import Blue, { useAttr } from 'bluejsx'
import { CustomProgress } from './CustomProgress'

//export const Example = ({ progValue = 0, children = null }) => {
export const Example = (param) => {
  let { progValue = 0, children = null } = param
  
  let /*const */progress = <CustomProgress max='100' value={progValue} />
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

  self.update = (newFunc) =>{
    const newElem = Blue.r(newFunc, param, ...children)
    self.after(newElem)
    self.remove()
    return newElem
  }
  import.meta.accept('./CustomProgress', mod=>{
    progress = progress.update(mod.CustomProgress)
  })
  
  //const { btn } = refs
  useAttr(self, 'progValue', progValue)
  self.watch('progValue', v => progress.value = v)

  //btn.onclick = () => {
  refs.btn.onclick = () => {
      if (self.progValue < 100) self.progValue += 10
    else self.progValue = 0
  }
  return self
}
const init1 = (self) =>{
  
}
export { init1 }


