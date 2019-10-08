import React from 'react'
import classNames from 'classnames'
import styles from './ListFilter.module.scss'

interface Props {
  filter: string
  options: TOption[]
  className?: string
  onChange: (value: string) => void
}

export const ListFilter = ({ filter, options, onChange, className }: Props) => (
  <div className={classNames(styles.root, styles.dark, className)}>
    {options.map(option => (
      <div
        key={option.value}
        className={classNames(styles.tab, { [`${styles.active}`]: filter === option.value })}
        onClick={() => onChange(option.value)}
      >
        {option.label}
      </div>
    ))}
  </div>
)
