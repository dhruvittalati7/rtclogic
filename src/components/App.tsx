import 'src/assets/scss/base.scss'
import React from 'react'
import { Provider } from 'react-redux'
import { store } from 'src/store'
import { Routes } from 'src/components/Routes'
import { SvgCollection } from 'src/components/shared/ui/SvgCollection'
import { ErrorBoundary } from './shared/ErrorBoundary'
import { Meta } from './shared/Meta'
import { CallList } from 'src/components/shared/ui/CallList'
import { useBeforeunload } from 'src/hooks/useBeforeunload'
import { Dialog } from 'src/components/shared/ui/Dialog'
import { Notifications } from 'src/components/shared/ui/Notifications'

export const App = () => {
  useBeforeunload()

  return (
    <Provider store={store}>
      <Meta />
      <SvgCollection />
      <ErrorBoundary>
        <Routes />
        <CallList />
        <Dialog />
        <Notifications />
      </ErrorBoundary>
    </Provider>
  )
}
