import React from 'react'
import { mem } from 'src/utils/mem'
import { ListPlaceholder } from 'src/components/shared/ui/placeholders/ListPlaceholder'
import { TChat } from 'src/models/Chat'
import { ChatListItemsItem } from './items/Item'
import styles from './Items.module.scss'
import { useOnMount } from 'src/hooks/useOnMount'

interface Props {
  chats: TChat[]
  onClick: (chat: TChat) => void
  activeChatId: number | null
  isLoading: boolean
  currentAccountId: number | null
}

export const ChatListItems = mem(({ chats, onClick, activeChatId, isLoading, currentAccountId }: Props) => {
  const refs = chats.reduce(
    (acc, value) => {
      acc[value.chatId] = React.createRef()
      return acc
    },
    {} as React.RefObject<HTMLDivElement>[]
  )

  useOnMount(() => {
    if (activeChatId && refs[activeChatId]) {
      const anchor = refs[activeChatId].current
      if (anchor !== null) {
        anchor.scrollIntoView()
      }
    }
  })

  return (
    <div className={styles.root}>
      <div className={styles.scrollable}>
        {isLoading ? (
          <ListPlaceholder num={3} />
        ) : (
          chats.map((chat, index) => {
            return (
              <ChatListItemsItem
                key={`${chat.chatId}-${index}`}
                item={chat}
                isActive={activeChatId === chat.chatId}
                onClick={onClick}
                innerRef={refs[chat.chatId]}
              />
            )
          })
        )}
      </div>
    </div>
  )
})
