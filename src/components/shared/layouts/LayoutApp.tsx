import React from 'react'
import classNames from 'classnames'
import { Meta } from 'src/components/shared/Meta'
import { LayoutAppNavBar } from './layoutApp/NavBar'
import styles from './LayoutApp.module.scss'

interface Props {
  title?: string
  sideBar?: React.ReactNode
  sideHeader?: React.ReactNode
  header?: React.ReactNode
  content: React.ReactNode
}

export const LayoutApp = ({ title, sideBar, sideHeader, header, content }: Props) => {
  return (
    <div className={classNames(styles.root, styles.dark)}>
      {title && <Meta title={title} />}
      <LayoutAppNavBar className={classNames(styles.navBar, { [styles.borderRight]: !sideBar })} />

      {sideBar && (
        <div className={classNames(styles.sideBar, styles.borderRight)}>
          {sideHeader && <div className={styles.sideHeader}>{sideHeader}</div>}
          {sideBar}
        </div>
      )}

      <div className={styles.main}>
        {(header) && (
          <div className={styles.header}>
            {header && <div className={styles.headerBottom}>{header}</div>}
          </div>
        )}
        <div className={styles.content}>{content}</div>
      </div>
    </div>
  )
}
