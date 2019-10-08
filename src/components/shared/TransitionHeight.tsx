import React from 'react'
import { easing, tween } from 'popmotion'

interface Props extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  ease?: easing.Easing
  duration?: number
  delayGrow?: number
  delayShrink?: number
  children: React.ReactChild
}

export const TransitionHeight = React.memo((props: Props) => {
  const { children, duration = 500, delayGrow = 0, delayShrink = 0, ease = easing.easeInOut, ...restProps } = props
  const [ref, setRef] = React.useState<null | HTMLDivElement>(null)
  const [height, setHeight] = React.useState<null | number>(null)

  React.useLayoutEffect(() => {
    if (ref) {
      const h = getInnerHeight(ref) || 0
      if (h !== height) {
        if (height !== null) {
          setTimeout(() => {
            tween({ duration, ease, from: height, to: h })
              .start((h: number) => {
                requestAnimationFrame(() => {
                  ref.style.height = `${h}px`
                })
              })
          }, h > height ? delayGrow : delayShrink)
        } else {
          ref.style.height = `${h}px`
        }
        setHeight(h)
      }
    }
  }, [setHeight, height, children, ref, duration, ease, delayGrow, delayShrink])

  return <div {...restProps} ref={setRef}>{children}</div>
})

const getInnerHeight = (ref: HTMLDivElement): number => {
  if (ref) {
    const refStyles = window.getComputedStyle(ref)
    const child = ref.children[0] as any
    const childStyles = window.getComputedStyle(child)
    return parseInt(refStyles.paddingTop || '0')
      + parseInt(refStyles.paddingBottom || '0')
      + parseInt(childStyles.marginTop || '0')
      + parseInt(childStyles.marginBottom || '0')
      + child.offsetHeight || child.offsetHeight
  }

  return 0
}
