import React from 'react'
import { useRouter } from './useRouter'

export const useQueryHash = (): [TObjectAny, (hash: TObjectAny) => void] => {
  const router = useRouter()
  const hash = decodeURIComponent(router.location.hash.replace(/^#/, ''))

  const setQueryHash = React.useCallback(
    (hashObject: TObjectAny) => {
      router.history.push(`#${JSON.stringify(hashObject)}`)
    },
    [router]
  )

  try {
    const queryHash = React.useMemo(() => JSON.parse(hash), [hash])
    return [queryHash, setQueryHash]
  } catch (e) {
    return [{}, setQueryHash]
  }
}
