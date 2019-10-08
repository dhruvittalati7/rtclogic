import React from 'react'
import classNames from 'classnames'
import styles from './Dropdown.module.scss'
import { KeyboardHandler } from 'src/components/shared/KeyboardHandler'
import { ClickOutside } from 'src/components/shared/ClickOutside'

export interface Props {
  open: boolean
  options: TOption[]
  onSelect: (value: any) => void
  onClose?: () => void
  height?: number
  maxHeight?: number
}

export const Dropdown = ({ open, options, onSelect, height, maxHeight, onClose }: Props) => {
  const [pos, setPos] = React.useState(0)
  React.useEffect(() => {
    setPos(0)
  }, [options])

  if (!options.length || !open) {
    return null
  }

  return (
    <ClickOutside onClick={onClose}>
      <div className={classNames(styles.root, styles.dark)} style={{ height, maxHeight }}>
        {options.map((option, idx) => (
          <div
            key={option.value}
            className={classNames(styles.item, pos === idx && styles.active)}
            onMouseOver={() => setPos(idx)}
            onClick={() => onSelect(option.value)}
          >
            {option.label}
          </div>
        ))}
      </div>

      <KeyboardHandler
        active={options.length > 0}
        onUp={() => (pos <= 0 ? setPos(options.length - 1) : setPos(pos - 1))}
        onDown={() => (pos >= options.length - 1 ? setPos(0) : setPos(pos + 1))}
        onEnter={() => options[pos] && onSelect(options[pos].value)}
      />
    </ClickOutside>
  )
}
