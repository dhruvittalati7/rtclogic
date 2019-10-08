import * as React from 'react'
import { useWindowSize } from './useWindowSize'

export interface BreakpointConfig<T extends any = any> {
  [key: number]: T
  default: T
}

export function useBreakpoints<T extends any = any>(config: BreakpointConfig<T>, mobileFirst: boolean = false): T {
  const { width } = useWindowSize()

  return React.useMemo(() => {
    const breakpoints = { ...config }
    delete breakpoints.default

    const points = Object.keys(breakpoints).map(i => parseInt(i)).sort((a, b) => a - b)
    if (mobileFirst) { points.reverse() }

    for (const point of points) {
      if ((mobileFirst && width >= point) || (!mobileFirst && width <= point)) {
        return breakpoints[point]
      }
    }

    return config.default
  }, [config, mobileFirst, width])
}
