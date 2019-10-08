import 'react-toastify/dist/ReactToastify.css'
import React from 'react'
import { ToastContainer, cssTransition } from 'react-toastify'
import { NotificationsDisconnect } from './notifications/Disconnect'
import { NotificationsNewContent } from './notifications/NewContent'
import styles from './Notifications.module.scss'

const Zoom = cssTransition({
  enter: styles.enter,
  exit: styles.exit,
  duration: 300,
})

export const Notifications = () => (
  <>
    <NotificationsDisconnect />
    <NotificationsNewContent />
    <ToastContainer
      draggable
      pauseOnHover
      closeOnClick
      newestOnTop
      position="top-right"
      autoClose={5000}
      transition={Zoom}
      className="Notifications"
    />
  </>
)
