import Blue from 'bluejsx';import Menu from "../Menu";
import { title } from "./index.module.scss";
const { log } = console;
export default () =>   {const refs={};const self=Blue.r("header", null, /* @__PURE__ */ Blue.r("div", {
  class: title
}, "BlueJSX"), /* @__PURE__ */ Blue.r(Menu, {ref:[refs,'bjsxc_0']}))
if(import.meta.hot){
self._bjsx_hmr_update = (Comp) =>{
        const newElem=Comp();
        self.before(newElem);
        self.remove();
      }
import.meta.hot.accept('../Menu',({default:Menu,})=>{refs.bjsxc_0=refs.bjsxc_0._bjsx_hmr_update(Menu);});}
};