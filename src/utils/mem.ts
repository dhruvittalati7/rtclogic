/* tslint:disable:no-console */
import React, { ComponentType } from 'react'

const compare = (debugLabel?: string) => (prevProps: TObjectAny, props: TObjectAny) => {
  const keys = Object.keys(props)

  if (debugLabel) {
    let count = 0
    const diff: TObjectAny = {}
    for (const key of keys) {
      if (prevProps[key] !== props[key]) {
        diff[key] = { prev: prevProps[key], next: props[key] }
        count += 1
      }
    }

    if (count) {
      const title = `MEM: ${debugLabel} - diff: ${count}`
      console.groupCollapsed(title)
      Object.keys(diff).forEach(key => {
        console.log(key, diff[key])
      })
      console.groupEnd()
    }

    return !count
  }

  for (const key of keys) {
    if (prevProps[key] !== props[key]) {
      return false
    }
  }
  return true
}

export function mem<T extends ComponentType<any>>(component: T, debugLabel?: string) {
  return React.memo(component, compare(debugLabel))
}
