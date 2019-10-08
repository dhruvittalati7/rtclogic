import IMask from 'imask'
import React from 'react'

export const useInputPhoneMask = (withoutCode: boolean = false) => {
  const phoneMask = withoutCode ? '000 000 00 00' : '+0 000 000 00 00'
  const [inputRef, setInputRef] = React.useState<null | HTMLInputElement>(null)
  const [pos, setPos] = React.useState(0)
  const [currentPos, setCurrentPos] = React.useState(0)
  const mask = React.useMemo(() => IMask.createMask({ mask: phoneMask }), [phoneMask])
  const jumps = phoneMask
    .split('')
    .map((c, i) => c !== '0' ? i + 1 : null)
    .filter(i => i)

  React.useLayoutEffect(() => {
    if (inputRef && pos !== currentPos) {
      inputRef.setSelectionRange(pos, pos)
      setCurrentPos(pos)
    }
  }, [inputRef, pos, currentPos])

  const formatValue = React.useCallback((value: string) => {
    const maskedValue = mask.resolve(value)
    if (inputRef) {
      const pos = inputRef.selectionStart || 0
      setPos(jumps.includes(pos) ? pos + 1 : pos) // workaround for jumping cursor
    }
    return maskedValue
  }, [inputRef, mask, jumps])

  return {
    setInputRef,
    inputRef,
    formatValue,
  }
}
