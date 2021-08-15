import Blue, { useAttr, ElemType } from 'bluejsx'
import { CustomProgress } from './CustomProgress'

export default ({ progValue = 0, children = null }) => {
  const progress = <CustomProgress max='100' value={progValue} />
  const percentage = new Text(''+progValue)
  const refs: {
    btn?: ElemType<'button'>
  } = {}
  const self = (
    <div class='t3'>
      <button ref={[refs, 'btn']}>click</button>
      {progress}
      {percentage} %
      {children}
    </div>
  )
  const { btn } = refs
  useAttr(self, 'progValue', progValue)
  self.watch('progValue', v =>{ 
    progress.value = v
    percentage.data = v
  })

  btn.onclick = () => {
    if (self.progValue < 100) self.progValue += 10
    else self.progValue = 0
  }
  return self
}
export function Unko(){
  return <div>Hello</div>
}
const num1 = 56
export { num1 }

export const ExmpleSub = () =>{
  
}

