import React from 'react'
import classNames from 'classnames'
import { useNetworkStatus } from 'src/hooks/useNetworkStatus'
import styles from './Disconnect.module.scss'

export const NotificationsDisconnect = () => {
  const { status, wasOffline } = useNetworkStatus()
  const show = status === 'offline' || wasOffline

  const reload = () => {
    document.location.reload()
  }

  return (
    <div className={classNames(styles.root, show && styles.show)}>
      { status === 'offline' && (
        <span>Network connection lost.</span>
      )}
      { status === 'online' && wasOffline && (
        <span>
          You were offline. Please, <span className={styles.link} onClick={reload}> reload </span> application,
          because it could miss some important data.
        </span>
      )}
    </div>
  )
}
