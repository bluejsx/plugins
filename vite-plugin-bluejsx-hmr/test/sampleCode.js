import Menu from './Menu'
import {title} from './index.module.scss'

const { log } = console
export default () =>
  <header >
    <div class={title}>BlueJSX</div>
    <Menu />
  </header>