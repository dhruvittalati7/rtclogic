import React from 'react'

export function useOnMount(onMount: () => any) {
  const onMountCallback = React.useCallback(onMount, [])
  React.useEffect(onMountCallback, [onMountCallback])
}
