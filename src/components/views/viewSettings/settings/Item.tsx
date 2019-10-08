import React from 'react'

import styles from 'src/components/views/viewSettings/settings/Item.module.scss'

interface Props {
  title: string
  subtitle: string
  toggle: React.ReactNode
}

export const ViewSettingsSettingsItem = ({ title, subtitle, toggle }: Props) => {
  return (
    <div className={styles.root}>
      <div className={styles.content}>
        <div className={styles.title}>{title}</div>
        <div className={styles.subtitle}>{subtitle}</div>
      </div>
      <div className={styles.toggle}>{toggle}</div>
    </div>
  )
}
