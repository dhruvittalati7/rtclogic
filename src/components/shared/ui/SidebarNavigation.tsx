import React from 'react'
import styles from './SidebarNavigation.module.scss'
import { Link, withRouter, RouteComponentProps } from 'react-router-dom'
import classNames from 'classnames'

interface Props {
  items: { icon: React.ReactNode; title: string; url: string }[]
}

const SidebarNavigation = ({ items, location: { pathname } }: Props & RouteComponentProps) => {
  return (
    <div className={classNames(styles.root, styles.dark)}>
      {items.map(i => (
        <Link key={i.url} to={i.url} className={classNames(styles.item, { [styles.active]: pathname === i.url })}>
          <div className={styles.icon}>{i.icon}</div>
          <span>{i.title}</span>
        </Link>
      ))}
    </div>
  )
}

const SidebarNavigationConnected = withRouter(SidebarNavigation)
export { SidebarNavigationConnected as SidebarNavigation }
