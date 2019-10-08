import React from 'react'

interface Props {
  className?: string
  style?: React.CSSProperties
  children?: any
  onClick?: () => void
}

export const ClickOutside = ({ className, style, children, onClick }: Props) => {
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    return listenClickOutside(ref.current, onClick)
  })

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  )
}

const listenClickOutside = (el: any, cb?: Function) => {
  const isParent = (el: any, ofEl: any): boolean => {
    const p = ofEl.parentNode
    if (p === el) {
      return true
    }
    return p ? isParent(el, p) : false
  }
  const clickListener = (e: any) => {
    if (!isParent(el, e.target)) {
      cb && cb()
    }
  }
  const destroyer = () => document.removeEventListener('click', clickListener)
  document.addEventListener('click', clickListener)
  return destroyer
}
