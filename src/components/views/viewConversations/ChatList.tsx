import React from 'react'
import { IState } from 'src/store/state'
import { connect } from 'react-redux'
import classNames from 'classnames'
import { useRouter } from 'src/hooks/useRouter'
import { EditIcon } from 'src/components/shared/ui/Icons'
import { ChatListItems } from 'src/components/views/viewConversations/chatList/Items'
import { currentAccountIdSelector } from 'src/services/selectors/AccountSelectors'
import { ListFilter } from 'src/components/shared/ui/ListFilter'
import { TChat, filter as chatFilter } from 'src/models/Chat'
import { ListTitle } from 'src/components/shared/ui/ListTitle'
import { activeChatIdSelector, chatListWithoutCampaign, unAnsweredChatsCountSelector } from 'src/services/selectors/ChatSelectors'
import styles from './ChatList.module.scss'

interface Props {
  currentAccountId: number | null
  activeChatId: number | null
  chats: TChat[]
  isChatListLoading: boolean
  unRepliedCount: number
}

const ChatList = ({
  currentAccountId,
  activeChatId,
  chats,
  isChatListLoading,
  unRepliedCount,
}: Props) => {
  const router = useRouter()
  const [filter, setFilter] = React.useState('all')
  const visibleChats = chats.filter(chatFilter(filter, currentAccountId))

  return (
    <div className={classNames(styles.root, styles.dark)}>
      <ListTitle
        title={'Conversations'}
        badge={unRepliedCount}
        after={
          <>
            <EditIcon width={25} height={25} className={styles.newConversation} onClick={() => router.history.push('/chat/new')} />
          </>
        }
      />

      <ListFilter
        filter={filter}
        options={[
          { value: 'all', label: 'All' },
          { value: 'replied', label: 'Replied' },
          { value: 'unreplied', label: 'Unreplied' },
          { value: 'mine', label: 'Mine' },
        ]}
        onChange={setFilter}
        className={styles.filter}
      />

      <ChatListItems
        isLoading={isChatListLoading}
        currentAccountId={currentAccountId}
        activeChatId={activeChatId}
        chats={visibleChats}
        onClick={item => router.history.push(`/chat/${item.chatId}`)}
      />
    </div>
  )
}

const mapStateToProps = (state: IState): Props => ({
  currentAccountId: currentAccountIdSelector(state.app),
  activeChatId: activeChatIdSelector(state.app),
  chats: chatListWithoutCampaign(state.app),
  isChatListLoading: state.app.chats.listLoading,
  unRepliedCount: unAnsweredChatsCountSelector(state.app),
})

const ChatListConnected = connect(mapStateToProps)(ChatList)
export { ChatListConnected as ChatList }
