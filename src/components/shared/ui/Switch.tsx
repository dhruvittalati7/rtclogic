import React from 'react'
import classNames from 'classnames'
import styles from './Switch.module.scss'

interface Props {
  name: string
  value: boolean
  label?: string
  readonly?: boolean
  onChange: (value: boolean) => void
}

export const Switch = React.memo(({ name, label, value, readonly, onChange }: Props) => {
  const classes = [
    styles.root,
    styles.dark,
    value && styles.checked,
    readonly && styles.readonly,
  ]

  return (
    <div
      className={classNames(classes)}
      onClick={() => !readonly && onChange(!value)}
    >
      <div className={styles.switch} />
      {label && <div className={styles.label}>{label}</div>}
    </div>
  )
})
