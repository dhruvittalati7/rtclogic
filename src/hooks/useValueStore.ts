import { useState } from 'react'

export function useValueStore<T>(init: T[]) {
  const [values, setValues] = useState<T[]>(init)

  function handleValue(value: T, action: 'add' | 'remove') {
    if (action === 'add') {
      addValue(value)
    }

    if (action === 'remove') {
      removeValue(value)
    }
  }

  function addValue(value: T) {
    values.push(value)
    setValues([...values])
  }

  function removeValue(value: T) {
    const index = values.findIndex(i => i === value)

    if (index !== -1) {
      values.splice(index, 1)
      setValues([...values])
    }
  }

  function clear() {
    setValues([])
  }

  return { values, handleValue, clear }
}
