import { render } from 'preact'
import { App } from './app'
import './index.css'

render(<App />, document.getElementById('shopaloud_widget') as HTMLElement)
