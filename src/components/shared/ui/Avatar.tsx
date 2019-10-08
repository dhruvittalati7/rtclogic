import React from 'react'
import classNames from 'classnames'
import { LogoIcon, PersonIcon } from 'src/components/shared/ui/Icons'
import { TAccount } from 'src/models/Account'
import { AppImage } from 'src/components/shared/ui/Image'
import { UserStatusBadge } from 'src/components/shared/ui/UserStatusBadge'
import styles from './Avatar.module.scss'
import ReactTooltip from 'react-tooltip'

export interface Props {
  type: 'profile' | 'list' | 'message' | 'calling' | 'callingMinimized'
  system?: boolean
  displayName?: string
  className?: string
  withTooltip?: boolean
  account?: TAccount | null
}

const iconSizes: any = {
  profile: 21,
  list: 21,
  message: 16,
  calling: 21,
  callingMinimized: 28,
}

export const Avatar = React.memo(({ type, system, className, account, withTooltip }: Props) => {
  const uniqueRef = React.useRef(Math.random())
  const isPending = account && account.profile.status === 'pending'
  const sizeClasses = {
    [styles.profile]: type === 'profile',
    [styles.list]: type === 'list',
    [styles.message]: type === 'message',
    [styles.calling]: type === 'calling',
    [styles.pending]: isPending,
    [styles.callingMinimized]: type === 'callingMinimized',
  }

  const classes = [styles.root, styles.dark, sizeClasses, system && styles.system, className]
  const src = account ? account.profile.avatarUrl : ''
  const placeholder = <PersonIcon width={iconSizes[type]} height={iconSizes[type]} />

  return system ? (
    <LogoIcon className={classNames(classes, styles.systemIcon)} />
  ) : (
    <div
      className={classNames(classes)}
      data-tip=""
      data-for={`avatar:${uniqueRef.current}`}
    >
      <AppImage src={src} placeholder={placeholder} alt={'avatar'} />
      {!isPending && <Badge type={type} account={account} />}
      {withTooltip && account && (
        <ReactTooltip id={`avatar:${uniqueRef.current}`} effect="solid" place={'bottom'} className={'Tooltip'}>
          <span>{account.profile.displayName}</span>
        </ReactTooltip>
      )}
    </div>
  )
})

const Badge = ({ type, account }: Props) => {
  if (!account) {
    return null
  }

  return (
    <>
      {!['callingMinimized', 'calling'].includes(type) && (
        <UserStatusBadge account={account} className={styles.statusBadge} />
      )}
      {type === 'list' && account && account.isManagerOfGroupId > 0 && (
        <div className={classNames(styles.badge, styles.star)}>
          <span />
        </div>
      )}
    </>
  )
}
