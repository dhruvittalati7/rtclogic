import React from 'react'
import { connect } from 'react-redux'
import { IState } from 'src/store/state'
import { TChat } from 'src/models/Chat'
import { ChatInput } from 'src/components/shared/ui/chat/ChatInput'
import { ChatContent } from 'src/components/shared/ui/chat/ChatContent'
import { TAccount } from 'src/models/Account'
import { ISendAttachment, TMessage } from 'src/models/Message'
import { activeChatSelector, currentChatAccountsSelector, isSearchSelector } from 'src/services/selectors/ChatSelectors'
import { currentAccountIdSelector, currentAccountSelector } from 'src/services/selectors/AccountSelectors'
import { chatSearchService } from 'src/services/ChatSearchService'
import { chatService } from 'src/services/ChatService'
import { storageService } from 'src/services/StorageService'
import { useRouter } from 'src/hooks/useRouter'

interface Props {
  isSearch: boolean
  searchInFocus: boolean
  currentAccount: TAccount | null
  currentAccountId: null | number
  currentChatAccounts: TAccount[] | null
  currentChat: TChat | null
  send: (chatId: number, message: string, attachments: ISendAttachment[]) => void
}

const ChatArea = ({
  isSearch,
  currentChat,
  searchInFocus,
  currentAccount,
  currentAccountId,
  currentChatAccounts,
  send,
}: Props) => {
  const router = useRouter<{ id?: string }>()
  const [jumpToId, setJumpToId] = React.useState('')
  const activeChatId = parseInt(router.match.params.id || '') || parseInt(storageService.get('lastActiveChatId')) || null

  React.useEffect(() => {
    chatService.setActiveChatId(activeChatId)
  }, [activeChatId])

  const onSend = (message: string, attachments: ISendAttachment[]): boolean => {
    if (currentChat) {
      send(currentChat.chatId, message, attachments)
      return true
    }
    return false
  }

  const onMessageClick = async (message: TMessage) => {
    if (currentChat) {
      setJumpToId(message.id)
      chatSearchService.setSearchQuery('')
      await chatService.loadMessageContext(currentChat.chatId, message)
    }
  }

  if (!currentChat) {
    return null
  }

  return (
    <>
      <ChatContent
        isSearch={isSearch}
        chat={currentChat}
        jumpToId={jumpToId}
        currentAccount={currentAccount}
        currentChatAccounts={currentChatAccounts}
        onMessageClick={isSearch ? onMessageClick : undefined}
      />
      {!isSearch && !['archived', 'readonly'].includes(currentChat.status) && (
        <ChatInput
          key={currentChat.chatId}
          currentChat={currentChat}
          currentAccountId={currentAccountId}
          autoFocus={!searchInFocus}
          showCounter={currentChat.numbers.length > 0}
          onSend={onSend}
        />
      )}
    </>
  )
}

const mapStateToProps = (state: IState): Props => ({
  isSearch: isSearchSelector(state.app),
  searchInFocus: state.app.chats.searchInFocus,
  send: chatService.sendMessage,
  currentChat: activeChatSelector(state.app),
  currentAccount: currentAccountSelector(state.app),
  currentAccountId: currentAccountIdSelector(state.app),
  currentChatAccounts: currentChatAccountsSelector(state.app),
})

const Connected = connect(mapStateToProps)(ChatArea)
export { Connected as ChatArea }
