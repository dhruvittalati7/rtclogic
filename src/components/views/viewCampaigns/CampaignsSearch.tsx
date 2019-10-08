import React from 'react'
import { mem } from 'src/utils/mem'
import { connect } from 'react-redux'
import { IState } from 'src/store/state'
import { Search } from 'src/components/shared/ui/Search'

interface Props {
  searchQuery: string
  setSearchQuery: (query: string) => void
  setSearchInFocus: (focus: boolean) => void
}

const CampaignsSearch = mem(({ searchQuery, setSearchQuery, setSearchInFocus }: Props) => (
  <Search searchQuery={searchQuery} setSearchQuery={setSearchQuery} setSearchInFocus={setSearchInFocus} />
))

const CampaignsSearchConnected = connect(
  (state: IState): Props => ({
    searchQuery: '',
    setSearchQuery: () => {},
    setSearchInFocus: () => {},
  })
)(CampaignsSearch)

export { CampaignsSearchConnected as CampaignsSearch }
