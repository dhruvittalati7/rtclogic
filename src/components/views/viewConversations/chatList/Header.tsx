import React from 'react'
import { mem } from 'src/utils/mem'
import { connect } from 'react-redux'
import { IState } from 'src/store/state'
import { chatSearchService } from 'src/services/ChatSearchService'
import { Search } from 'src/components/shared/ui/Search'

interface Props {
  searchQuery: string
  setSearchQuery: (query: string) => void
  setSearchInFocus: (focus: boolean) => void
}

const ChatListHeader = mem(({ searchQuery, setSearchQuery, setSearchInFocus }: Props) => (
  <Search searchQuery={searchQuery} setSearchQuery={setSearchQuery} setSearchInFocus={setSearchInFocus} />
))

const ChatListHeaderConnected = connect(
  (state: IState): Props => ({
    searchQuery: state.app.chats.searchQuery,
    setSearchQuery: chatSearchService.setSearchQuery,
    setSearchInFocus: chatSearchService.setSearchInFocus,
  })
)(ChatListHeader)

export { ChatListHeaderConnected as ChatListHeader }
