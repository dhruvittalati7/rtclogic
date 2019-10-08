import React from 'react'
import { mem } from 'src/utils/mem'
import classNames from 'classnames'
import { ChatMessage } from 'src/components/shared/ui/chat/chatContent/Message'
import { messageDividerDateFormat, isDayChanged } from 'src/helpers/DateHelper'
import { TChat } from 'src/models/Chat'
import { TAccount } from 'src/models/Account'
import { dialService } from 'src/services/DialService'
import { layoutService } from 'src/services/LayoutService'
import { chatService } from 'src/services/ChatService'
import { DynamicList } from 'src/components/shared/ui/DynamicList'
import { TMessage } from 'src/models/Message'
import styles from './ChatContent.module.scss'

interface Props {
  isSearch?: boolean
  chat: TChat | null
  currentAccount: TAccount | null
  currentChatAccounts: TAccount[] | null
  jumpToId?: string
  onMessageClick?: (message: TMessage) => void
}

export const ChatContent = mem(({ chat, isSearch = false, jumpToId, currentAccount, currentChatAccounts, onMessageClick }: Props) => {
  if (!chat || !currentAccount) {
    return null
  }

  let previousTimestamp = 0
  const loadPrevMessages = React.useCallback(() => chatService.loadPrevMessages(chat.chatId), [chat.chatId])
  const loadNextMessages = React.useCallback(() => chatService.loadNextMessages(chat.chatId), [chat.chatId])
  const lastMemberIdRef = React.useRef<null | number | string>(null)

  const call = React.useCallback((targetNumber: string) => {
    if (chat.srcNumber) {
      dialService.callExternal(targetNumber, chat.srcNumber.number).catch(window.logger.error)
    } else {
      const text = 'Current source number is undefined'
      layoutService.showNotification(text, 'error')
    }
  }, [chat.srcNumber])

  const fetchLast = React.useCallback(async () => {
    await chatService.loadLastMessages(chat.chatId)
  }, [chat])

  return (
    <DynamicList<TMessage>
      key={`${chat.chatId}${isSearch && 's'}:${jumpToId}`}
      items={chat.messages}
      enableFetch={!isSearch}
      isLoading={chat.isLoading}
      hasPrev={chat.firstLoadedId !== true}
      hasNext={chat.lastLoadedId !== true}
      fetchPrev={loadPrevMessages}
      fetchNext={loadNextMessages}
      fetchLast={fetchLast}
      initialScrollId={jumpToId}
      render={message => {
        const isDayChangedResult = isDayChanged(previousTimestamp, message.timestamp)
        if (isDayChangedResult) {
          lastMemberIdRef.current = null
        }
        const account = currentChatAccounts ? currentChatAccounts.find(a => a.id === message.accountId) || null : null
        const memberId = message.accountId || message.number
        const hideTitle = lastMemberIdRef.current === memberId
        lastMemberIdRef.current = memberId
        previousTimestamp = message.timestamp

        return (
          <div className={styles.msg} key={`${message.id}`}>
            {isDayChangedResult && <div className={styles.separator}>{messageDividerDateFormat(message.timestamp)}</div>}
            <ChatMessage
              call={call}
              item={message}
              account={account}
              hideTitle={hideTitle}
              currentAccount={currentAccount}
              highlight={message.id === jumpToId}
              outColor={chat.numbers.length ? 'green' : 'blue'}
              onClick={onMessageClick && (() => onMessageClick(message))}
            />
          </div>
        )
      }}
      classes={{
        root: classNames(styles.root, styles.dark),
        list: styles.inner,
      }}
    />
  )
})
