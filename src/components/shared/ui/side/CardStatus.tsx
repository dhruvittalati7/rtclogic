import React from 'react'
import classNames from 'classnames'
import styles from './CardStatus.module.scss'

interface Props {
  colorType?: 'default' | 'gray' | 'orange' | 'blue' | 'green' | 'red'
  isActive?: boolean
  activeType?: 'green' | 'blue'
  onClick?: () => void
  children: React.ReactNode
}

export const SideCardStatus = ({ children, colorType = 'default', isActive, activeType = 'green', onClick }: Props) => {
  const onClickCb = React.useCallback(
    (e: React.SyntheticEvent) => {
      if (onClick) {
        e.stopPropagation()
        onClick()
      }
    },
    [onClick]
  )

  const classes = classNames(styles.root, styles.dark, styles[colorType], isActive && styles.active, styles[`a-${activeType}`])

  return (
    <div onClick={onClickCb} className={classes}>
      {children}
    </div>
  )
}
