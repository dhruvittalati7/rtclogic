import React from 'react'

interface TData {
  key: string
  code: string
}

interface Props {
  active: boolean
  el?: HTMLElement | null
  onPress?: (data: TData) => void
  onNumeric?: (value: number) => void
  onUp?: () => void
  onDown?: () => void
  onLeft?: () => void
  onRight?: () => void
  onEsc?: () => void
  onMetaEnter?: () => void
  onEnter?: () => void
  onSpace?: () => void
  onBackspace?: () => void
}

export class KeyboardHandler extends React.PureComponent<Props> {
  private el = this.props.el

  public componentDidMount(): void {
    const el = this.el || document
    el.addEventListener('keydown', this.keyboardHandler)
  }

  public componentWillUnmount(): void {
    const el = this.el || document
    el.removeEventListener('keydown', this.keyboardHandler)
  }

  public render() {
    return null
  }

  private keyboardHandler = (e: any) => {
    const numeric = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
    const { active, onPress, onNumeric, onMetaEnter, onEnter, onSpace, onEsc, onUp, onDown, onLeft, onRight, onBackspace } = this.props
    if (active) {
      onPress && onPress({ key: e.key, code: e.code })
      onNumeric && numeric.indexOf(e.key) !== -1 && onNumeric(parseInt(e.key))
      onSpace && e.code === 'Space' && onSpace()
      onEsc && e.code === 'Escape' && onEsc()
      onBackspace && e.code === 'Backspace' && onBackspace()
      onUp && e.code === 'ArrowUp' && onUp()
      onDown && e.code === 'ArrowDown' && onDown()
      onLeft && e.code === 'ArrowLeft' && onLeft()
      onRight && e.code === 'ArrowRight' && onRight()
      if (onEnter && e.code === 'Enter') {
        if ((e.metaKey || e.shiftKey || e.ctrlKey) && onMetaEnter) {
          onMetaEnter()
        } else {
          onEnter && onEnter()
        }
      }
    }
  }
}
