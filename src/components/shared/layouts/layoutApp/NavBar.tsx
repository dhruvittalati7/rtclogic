import React from 'react'
import classNames from 'classnames'
import { NavBarNavigation } from './navBar/Navigation'
import { NavBarProfile } from './navBar/Profile'
import { LogoIcon } from 'src/components/shared/ui/Icons'
import styles from './NavBar.module.scss'

export interface Props {
  className?: string
}

export const LayoutAppNavBar = React.memo(({ className }: Props) => (
  <div className={classNames(styles.root, className, styles.dark)}>
    <LogoIcon className={styles.logo}/>
    <NavBarNavigation />
    <div className={styles.spacer} />
    <NavBarProfile />
  </div>
))
