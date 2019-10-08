import React from 'react'
import { useOnMount } from 'src/hooks/useOnMount'
import { chatService } from 'src/services/ChatService'
import { NewChatBoxForm } from 'src/components/shared/ui/chat/newChatBox/Form'
import styles from './ChatCreate.module.scss'

export const ChatCreate = () => {
  useOnMount(() => {
    chatService.setActiveChatId(null)
  })

  return (
    <div className={styles.root}>
      <NewChatBoxForm />
    </div>
  )
}
