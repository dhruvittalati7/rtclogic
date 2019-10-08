import React from 'react'
import classNames from 'classnames'
import styles from './LayoutSimple.module.scss'

interface Props {
  children: any
}

export const LayoutSimple = ({ children }: Props) => (
  <>
    <div className={classNames(styles.root, styles.dark)}>{children}</div>
  </>
)
