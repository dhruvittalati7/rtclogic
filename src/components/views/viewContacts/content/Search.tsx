import React from 'react'
import { connect } from 'react-redux'
import { IState } from 'src/store'
import { SearchTable } from 'src/components/shared/ui/SearchTable'
import { accountSearchService } from 'src/services/AccountSearchService'
import styles from './Search.module.scss'

interface Props {
  searchQuery: string
  setSearchQuery: (query: string) => void
}

const ViewContactsContentSearch = ({ searchQuery, setSearchQuery }: Props) => (
  <div className={styles.root}>
    <SearchTable searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
  </div>
)

const mapStateToProps = (state: IState): Props => ({
  searchQuery: state.app.accounts.searchQuery,
  setSearchQuery: accountSearchService.setSearchQuery,
})

const Connected = connect(mapStateToProps)(ViewContactsContentSearch)
export { Connected as ViewContactsContentSearch }
