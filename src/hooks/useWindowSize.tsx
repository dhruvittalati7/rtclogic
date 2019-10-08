import React from 'react'

function useWindowSize() {
  const [size, setSize] = React.useState({ width: window.innerWidth, height: window.innerHeight })

  React.useEffect(() => {
    function resizeHandler() {
      setSize({ width: window.innerWidth, height: window.innerHeight })
    }

    window.addEventListener('resize', resizeHandler)
    return () => window.removeEventListener('resize', resizeHandler)
  }, [])

  return size
}

export { useWindowSize }
