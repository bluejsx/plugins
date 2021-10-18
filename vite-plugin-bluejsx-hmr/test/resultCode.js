import Menu from './Menu'
import {title} from './index.module.scss'

const { log } = console
export default () =>{const refs={};const self=Blue.r('header', null,
     /* #ncjfdk */ Blue.r('div', {class: title}, "BlueJSX"),
     /* #ncjfdk */ Blue.r(Menu, null)
  )
self._bjsx_hmr_update = (Comp) =>{
  const newElem=Comp();
  self.before(newElem);
  self.remove();
  return newElem
}
if(import.meta.hot){
  
}else{
  console.warn('import.meta.hot does not exist')
}

return self;}