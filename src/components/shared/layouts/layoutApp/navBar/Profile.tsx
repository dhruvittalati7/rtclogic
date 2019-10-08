import * as React from 'react'
import { mem } from 'src/utils/mem'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { IState } from 'src/store'
import ReactTooltip from 'react-tooltip'
import { Avatar } from 'src/components/shared/ui/Avatar'
import { currentAccountSelector } from 'src/services/selectors/AccountSelectors'
import { authService } from 'src/services/AuthService'
import { IAccountStatus, TAccount } from 'src/models/Account'
import { LogoutIcon } from 'src/components/shared/ui/Icons'
import styles from './Profile.module.scss'
import { Link } from 'react-router-dom'
import { accountService } from 'src/services/AccountService'
import { UserStatusBadge } from 'src/components/shared/ui/UserStatusBadge'

export interface Props {
  account: TAccount
  onLogout: () => void
}

const NavBarProfile = mem(({ account, onLogout }: Props) => {
  return (
    <div className={classNames(styles.root, styles.dark)}>
      <div className={styles.inner}>
        <div className={styles.avatar}>
          <Link to={'/settings/profile'} className={styles.block}>
            <Avatar type={'profile'} displayName={account.profile.displayName} className={styles.avatar} account={account} />
          </Link>
          <NavBarProfileStatus account={account}/>
        </div>

        <div onClick={onLogout} className={styles.logout} title={'Logout'} data-tip data-for="sign-out">
          <div className={styles.logoutIcon}>
            <LogoutIcon width={14} height={15} />
          </div>
        </div>
        <ReactTooltip id="sign-out" effect="solid" place={'right'} className={'Tooltip'}>
          <span>Sign Out</span>
        </ReactTooltip>
      </div>
    </div>
  )
})

const NavBarProfileStatus = ({ account }: Pick<Props, 'account'>) => {
  const onClickStatus = (status: IAccountStatus) => {
    accountService.setPresence(status).catch(window.logger.error)
  }

  return (
    <div className={styles.status}>
      <div className={styles.displayName}><UserStatusBadge account={account} className={styles.statusBadge} />{account.profile.displayName}</div>
      <div className={classNames({ [styles.active]: account.status === 'online' })} onClick={() => onClickStatus({ status: 'online' })}>
        Available
      </div>
      <div className={classNames({ [styles.active]: account.status === 'dnd' })} onClick={() => onClickStatus({ status: 'dnd', expire: 3600 })}>
        DND
      </div>
      <div className={classNames({ [styles.active]: account.status === 'away' })} onClick={() => onClickStatus({ status: 'away' })}>
        Unavailable
      </div>
    </div>
  )
}

const mapStateToProps = (state: IState): Props => ({
  account: currentAccountSelector(state.app),
  onLogout: authService.logout,
})

const NavBarProfileConnected = connect(mapStateToProps)(NavBarProfile)
export { NavBarProfileConnected as NavBarProfile }
