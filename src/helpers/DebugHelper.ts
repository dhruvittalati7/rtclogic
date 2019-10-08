/* tslint:disable:no-console */
let lastProps: TObjectAny | null = null
let lastState: TObjectAny | null = null

export function debugChanges(props: TObjectAny | null, state: TObjectAny | null) {
  if (props && lastProps) {
    compare('props', props, lastProps)
  }
  if (state && lastState) {
    compare('state', state, lastState)
  }
  lastProps = props
  lastState = state
}

function compare(label: string, obj: TObjectAny, lastObj: TObjectAny) {
  const keys = Object.keys(obj)
  let hasDiff = false
  keys.forEach(key => {
    if (obj[key] !== lastObj[key]) {
      !hasDiff && console.group(`DEBUG CHANGES: ${label}`)
      hasDiff = true
      console.log(key, { old: lastObj[key], new: obj[key] })
    }
  })
  hasDiff && console.groupEnd()
}
