import React from 'react'
import styles from './Search.module.scss'
import { connect } from 'react-redux'
import { IState } from 'src/store/state'
import { adminNumberSearchService } from 'src/services/admin/NumberSearchService'
import { SearchTable } from 'src/components/shared/ui/SearchTable'

interface Props {
  searchQuery: string
  setSearchQuery: (query: string) => void
}

const ViewAdminNumbersSearch = ({ searchQuery, setSearchQuery }: Props) => {
  return (
    <div className={styles.root}>
      <SearchTable searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
    </div>
  )
}

const ViewAdminNumbersSearchConnected = connect(
  (state: IState): Props => ({
    searchQuery: state.app.admin.numbers.searchQuery,
    setSearchQuery: adminNumberSearchService.setSearchQuery,
  })
)(ViewAdminNumbersSearch)

export { ViewAdminNumbersSearchConnected as ViewAdminNumbersSearch }
