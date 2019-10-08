/* tslint:disable:no-console */
import React from 'react'

export function useDebug<T extends { [key: string]: any }>(label: string, props: T) {
  const renderRef = React.useRef(1)
  const propsRef = React.useRef<T>(props)
  const diff: TObjectAny = {}

  Object.keys(props).forEach(key => {
    if (props[key] !== propsRef.current[key]) {
      diff[key] = { prev: propsRef.current[key], next: props[key] }
    }
  })

  const diffKeys = Object.keys(diff)
  const title = `${label} [render ${renderRef.current}] - diff: ${diffKeys.length}`

  console.groupCollapsed(title)
  diffKeys.forEach(key => {
    console.log(key, diff[key])
  })
  console.groupEnd()

  renderRef.current += 1
  propsRef.current = props
}
