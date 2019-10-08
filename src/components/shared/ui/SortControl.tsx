import React from 'react'
import styles from './SortControl.module.scss'
import classNames from 'classnames'
import { nextDirection } from 'src/helpers/CommonHelper'

interface Props {
  onSort: (code: string, dir?: 'asc' | 'desc') => void
  code: string
  label: React.ReactNode
  dir?: 'asc' | 'desc'
}

export const SortControl = ({ label, code, dir, onSort }: Props) => (
  <span
    className={classNames(styles.sortBy, {
      [`${styles.asc}`]: dir === 'asc',
      [`${styles.desc}`]: dir === 'desc',
    })}
    onClick={() => onSort(code, nextDirection(dir))}
  >
    {label}
  </span>
)
