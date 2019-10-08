import React from 'react'
import { useRouter } from './useRouter'

export const useRouterOnUnmount = () => {
  const { history: { push } } = useRouter()

  const [url, goToOnUnmount] = React.useState()
  React.useEffect(() => {
    return () => {
      if (url) {
        push(url)
      }
    }
  }, [url, push])

  return { goToOnUnmount }
}
