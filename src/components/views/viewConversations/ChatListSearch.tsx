import React from 'react'
import { connect } from 'react-redux'
import { IState } from 'src/store/state'
import { TChat } from 'src/models/Chat'
import { ChatListItems } from 'src/components/views/viewConversations/chatList/Items'
import { currentAccountIdSelector } from 'src/services/selectors/AccountSelectors'
import { activeChatIdSelector, searchChatListSelector } from 'src/services/selectors/ChatSelectors'
import styles from './ChatListSearch.module.scss'
import { useRouter } from 'src/hooks/useRouter'

interface Props {
  currentAccountId: number | null
  activeChatId: number | null
  chats: TChat[]
  isLoading: boolean
}

const ChatListSearch = ({ currentAccountId, activeChatId, chats, isLoading }: Props) => {
  const router = useRouter()

  return (
    <div className={styles.root}>
      <ChatListItems
        isLoading={isLoading}
        currentAccountId={currentAccountId}
        activeChatId={activeChatId}
        chats={chats}
        onClick={item => router.history.push(`/chat/${item.chatId}`)}
      />
    </div>
  )
}

const mapStateToProps = (state: IState): Props => ({
  currentAccountId: currentAccountIdSelector(state.app),
  activeChatId: activeChatIdSelector(state.app),
  chats: searchChatListSelector(state.app),
  isLoading: state.app.chats.searchLoading,
})

const ChatListSearchConnected = connect(mapStateToProps)(ChatListSearch)
export { ChatListSearchConnected as ChatListSearch }
