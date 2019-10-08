import React from 'react'
import { connect } from 'react-redux'
import { IState } from 'src/store'
import classNames from 'classnames'
import { Link, withRouter, RouteComponentProps } from 'react-router-dom'
import {
  AdminIcon,
  BookIcon,
  MegaphoneIcon,
  SettingsIcon,
  SpeechBubblesIcon,
} from 'src/components/shared/ui/Icons'
import ReactTooltip from 'react-tooltip'
import styles from './Navigation.module.scss'
import { accessSelector } from 'src/services/selectors/AccountSelectors'
import { unAnsweredChatsCountSelector } from 'src/services/selectors/ChatSelectors'
import { hasAccountPermission } from 'src/helpers/AccountHelper'

export interface Props {
  unAnsweredChatsCount: number
  currentAccountPermissions: TPermission[]
}

class NavBarNavigation extends React.PureComponent<Props & RouteComponentProps> {
  public render() {
    const {
      unAnsweredChatsCount,
      location: { pathname },
    } = this.props

    return (
      <div className={classNames(styles.root, styles.dark)}>
        <Link to={'/'} className={classNames(styles.item, { [styles.active]: pathname === '/' })} data-tip={'Conversations'} data-for="tooltip">
          <div className={styles.icon}>
            <SpeechBubblesIcon width={23} height={23} />
            {unAnsweredChatsCount > 0 && (
              <div className={styles.badge}>
                <span>{unAnsweredChatsCount}</span>
              </div>
            )}
          </div>
        </Link>

        <Link
          to={'/contacts'}
          className={classNames(styles.item, { [styles.active]: pathname === '/contacts' })}
          data-tip={'Contacts'}
          data-for="tooltip"
        >
          <div className={styles.icon}>
            <BookIcon width={23} height={23} />
          </div>
        </Link>

        <Link
          to={'/campaigns'}
          className={classNames(styles.item, { [styles.active]: pathname === '/campaigns' })}
          data-tip={'Campaigns'}
          data-for="tooltip"
        >
          <div className={styles.icon}>
            <MegaphoneIcon width={23} height={23} />
          </div>
        </Link>

        <Link
          to={'/settings/profile'}
          className={classNames(styles.item, { [styles.active]: pathname.indexOf('settings') !== -1 })}
          data-tip={'Settings'}
          data-for="tooltip"
        >
          <div className={styles.icon}>
            <SettingsIcon width={23} height={23} />
          </div>
        </Link>

        {this.renderAdminArea()}

        <ReactTooltip
          id="tooltip"
          effect="solid"
          place={'right'}
          className={'Tooltip'}
        />
      </div>
    )
  }

  protected renderAdminArea = () => {
    const {
      currentAccountPermissions,
      location: { pathname },
    } = this.props

    if (!hasAccountPermission(currentAccountPermissions, ['admin', 'manager'])) {
      return null
    }

    return (
      <>
        <Link
          to={'/admin/members'}
          className={classNames(styles.item, { [styles.active]: pathname.indexOf('admin') !== -1 })}
          data-tip={'Admin'}
          data-for="tooltip"
        >
          <div className={styles.icon}>
            <AdminIcon width={23} height={23} />
          </div>
        </Link>
      </>
    )
  }
}

const mapStateToProps = (state: IState): Props => ({
  unAnsweredChatsCount: unAnsweredChatsCountSelector(state.app),
  currentAccountPermissions: accessSelector(state.app),
})

const NavBarNavigationConnected = withRouter(connect(mapStateToProps)(NavBarNavigation))

export { NavBarNavigationConnected as NavBarNavigation }
