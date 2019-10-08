import React from 'react'
import { mem } from 'src/utils/mem'
import { connect } from 'react-redux'
import { IState } from 'src/store/state'
import classNames from 'classnames'
import { DialButton } from 'src/components/shared/ui/DialButton'
import { TChat } from 'src/models/Chat'
import { CallButton } from 'src/components/shared/ui/CallButton'
import { ChatHeaderMetaExternal } from 'src/components/views/viewConversations/chatHeader/MetaExternal'
import { activeChatSelector } from 'src/services/selectors/ChatSelectors'
import { ChatHeaderMetaInternal } from 'src/components/views/viewConversations/chatHeader/MetaInternal'
import styles from './ChatHeader.module.scss'

interface Props {
  chat: TChat | null
}

const ChatHeader = mem(({ chat }: Props) => {
  return (
    <div className={classNames(styles.root, styles.dark)}>
      <div className={styles.meta}>
        {chat && chat.numbers.length ? <ChatHeaderMetaExternal /> : <ChatHeaderMetaInternal /> }
      </div>
      <div className={styles.right}>
        <div className={styles.actions}>
          <DialButton />
          <CallButton />
        </div>
      </div>
    </div>
  )
})

const mapStateToProps = (state: IState): Props => ({
  chat: activeChatSelector(state.app),
})

const ChatHeaderConnected = connect(mapStateToProps)(ChatHeader)
export { ChatHeaderConnected as ChatHeader }
