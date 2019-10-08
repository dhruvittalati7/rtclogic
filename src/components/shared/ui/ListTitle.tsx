import React from 'react'
import classNames from 'classnames'
import styles from './ListTitle.module.scss'

interface Props {
  title: string
  badge?: number
  after?: React.ReactNode
  className?: string
}

export const ListTitle = ({ title, badge, after, className }: Props) => (
  <div className={classNames(styles.root, styles.dark, className)}>
    {title} {!!badge && <span className={styles.count}>{badge}</span>}
    <div className={styles.spacer} />
    {after && <div className={styles.after}>{after}</div>}
  </div>
)
