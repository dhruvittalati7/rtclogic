import React, { useEffect, useState } from 'react'
import classNames from 'classnames'
import styles from './NewContent.module.scss'
import { connect } from 'react-redux'
import { IState } from 'src/store'

interface Props {
  newContent: INotification
}

const NotificationsNewContent = ({ newContent }: Props) => {
  const [show, setShow] = useState<boolean>(newContent.show)

  useEffect(() => {
    setShow(newContent.show)
  }, [newContent.show])

  const reload = () => {
    window.location.reload()
  }

  return (
    <div className={classNames(styles.root, show && styles.show)}>
      <span>
        New content is available. Please,{' '}
        <span className={styles.link} onClick={reload}>
          reload
        </span>{' '}
        application, because it could miss some important data.
      </span>
    </div>
  )
}

const mapStateToProps = (state: IState): Props => ({
  newContent: state.app.notifications.newContent,
})

const NotificationsNewContentConnected = connect(mapStateToProps)(NotificationsNewContent)
export { NotificationsNewContentConnected as NotificationsNewContent }
