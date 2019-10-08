import { createBrowserHistory, History } from 'history'

export const history: History = createBrowserHistory()

let prevLocation = { pathname: '', hash: '' }
history.listen(location => {
  const pathChanged = prevLocation.pathname !== location.pathname
  const hashChanged = prevLocation.hash !== location.hash
  if (pathChanged || hashChanged) {
    window.scrollTo(0, 0)
  }
  prevLocation = location
})
