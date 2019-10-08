import React from 'react'
import styles from './ChatFound.module.scss'

interface Props {
  chatId: number
  gotoChat: (chatId: number) => void
}

export const FormChatFound = ({ chatId, gotoChat }: Props) => (
  <div className={styles.root}>
    <p>
      The Conversation is already exists. Follow the{' '}
      <span className={styles.link} onClick={() => gotoChat(chatId)}>
        link
      </span>{' '}
      to open it.
    </p>
  </div>
)
