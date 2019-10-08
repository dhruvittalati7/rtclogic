import React from 'react'
import classNames from 'classnames'
import styles from './Button.module.scss'

export interface Props {
  type?: 'button' | 'submit'
  disabled?: boolean
  onClick?: () => void
  className?: string
  children: React.ReactNode
}

export const Button = ({ disabled, onClick, className, children, type = 'button' }: Props) => {
  const onClickButton = (e: any) => {
    if (onClick) {
      e.preventDefault()
      onClick()
    }
  }

  return (
    <button
      onClick={onClickButton}
      type={type}
      className={classNames(styles.root, styles.dark, disabled && styles.buttonDisabled, className)}
    >
      {children}
    </button>
  )
}
