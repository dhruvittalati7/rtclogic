import React, { ChangeEvent } from 'react'
import classNames from 'classnames'
import styles from './Field.module.scss'

interface Props {
  label: string
  name: string
  value: string
  type?: string
  error?: string | boolean
  autoFocus?: boolean
  className?: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  onFocus?: () => void
  hint?: string
  autocomplete: string
}

export const Field = ({ label, name, value, type = 'text', autoFocus, error, className, onChange, onFocus, hint, autocomplete }: Props) => {
  const [ref, setRef] = React.useState(null as null | HTMLInputElement)
  const [isFocused, setIsFocused] = React.useState(false)

  const isActive = !!value || isFocused

  const handleFocus = () => {
    setIsFocused(true)
    onFocus && onFocus()
  }

  return (
    <div className={classNames(styles.root, className)} onClick={() => ref && ref.focus()}>
      <div className={classNames(styles.label, isActive && styles.labelActive)}>{label}</div>
      <div className={classNames(styles.error, error && styles.errorActive)}>{error}</div>

      <input
        className={styles.input}
        ref={setRef}
        type={type}
        name={name}
        value={value}
        autoFocus={autoFocus}
        autoComplete={autocomplete}
        onFocus={handleFocus}
        onBlur={() => setIsFocused(false)}
        onChange={onChange}
      />
      {hint && <div className={styles.hint}>{hint}</div>}
    </div>
  )
}
