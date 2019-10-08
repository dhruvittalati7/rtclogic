import 'src/utils/Logger'
import React from 'react'
import ReactDOM from 'react-dom'
import ReactModal from 'react-modal'
import { bootstrap } from 'src/Bootstrap'
import { App } from './components/App'
import { AppContainer } from 'react-hot-loader'
import * as serviceWorker from './serviceWorker'

const root = document.getElementById('root') as HTMLElement
ReactModal.setAppElement(root)

bootstrap
  .init()
  .then(() =>
    ReactDOM.render(
      <AppContainer>
        <App />
      </AppContainer>,
      root
    )
  )
  .catch(window.logger.error)

if (module.hot) {
  module.hot.accept('./components/App', () => {
    const NextApp = require('./components/App').App
    ReactDOM.render(
      <AppContainer>
        <NextApp />
      </AppContainer>,
      root
    )
  })
}

serviceWorker.register()
