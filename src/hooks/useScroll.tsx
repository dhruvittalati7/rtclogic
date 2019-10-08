import React from 'react'

function useScroll() {
  const [scrollTop, setScrollTop] = React.useState(window.scrollY)

  React.useEffect(() => {
    function scrollHandler() {
      setScrollTop(window.scrollY)
    }

    window.addEventListener('scroll', scrollHandler)
    return () => window.removeEventListener('scroll', scrollHandler)
  }, [])

  return scrollTop
}

export { useScroll }
