import React from 'react'
import { connect } from 'react-redux'
import { Switch, Route } from 'react-router'
import { IState } from 'src/store/state'
import { LayoutApp } from 'src/components/shared/layouts/LayoutApp'
import { ChatList } from './viewConversations/ChatList'
import { ChatListHeader } from 'src/components/views/viewConversations/chatList/Header'
import { ChatHeader } from 'src/components/views/viewConversations/ChatHeader'
import { ChatListSearch } from 'src/components/views/viewConversations/ChatListSearch'
import { isSearchSelector } from 'src/services/selectors/ChatSelectors'
import { ChatCreate } from './viewConversations/ChatCreate'
import { ChatArea } from './viewConversations/ChatArea'

interface Props {
  isSearch: boolean
}

const ViewConversations = ({ isSearch }: Props) => {

  return (
    <LayoutApp
      title={'Conversations'}
      sideBar={isSearch ? <ChatListSearch /> : <ChatList />}
      sideHeader={<ChatListHeader />}
      header={<ChatHeader />}
      content={(
        <Switch>
          <Route exact path="/chat/new" component={ChatCreate} />
          <Route component={ChatArea} />
        </Switch>
      )}
    />
  )
}

const mapStateToProps = (state: IState): Props => ({
  isSearch: isSearchSelector(state.app),
})

const ViewConversationsConnected = connect(mapStateToProps)(ViewConversations)
export { ViewConversationsConnected as ViewConversations }
