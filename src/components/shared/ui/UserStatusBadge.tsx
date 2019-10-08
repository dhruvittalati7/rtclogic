import React, { useEffect, useState } from 'react'
import styles from './UserStatusBadge.module.scss'
import { TAccount } from 'src/models/Account'
import classNames from 'classnames'

interface Props {
  account: TAccount
  className?: string
}

const statusColors = {
  online: '#42913d',
  dnd: '#cbc80e',
  away: '#ea2121',
}

export const UserStatusBadge = ({ account, className }: Props) => {
  const [statusColor, setStatusColor] = useState<string>(statusColors.away)

  useEffect(() => {
    if (account) {
      let color = statusColors.away
      if (account.status === 'online') {
        color = statusColors.online
      }

      if (account.status === 'away') {
        color = statusColors.away
      }

      if (account.status === 'dnd') {
        color = statusColors.dnd
      }

      if (statusColor !== color) {
        setStatusColor(color)
      }
    }
  }, [account, statusColor])

  return (
    <div className={classNames(className, styles.root)}>
      <div className={styles.dot} style={{ background: `${statusColor}` }} />
    </div>
  )
}
