import React from 'react'
import styles from './ContentTop.module.scss'
import { connect } from 'react-redux'
import { IState } from 'src/store/state'
import { TAccount, create } from 'src/models/Account'
import { accessSelector } from 'src/services/selectors/AccountSelectors'
import { hasAccountPermission } from 'src/helpers/AccountHelper'
import { SearchTable } from 'src/components/shared/ui/SearchTable'

interface Props {
  searchQuery: string
  setSearchQuery: (query: string) => void
  setEditAccount: (account: TAccount) => void
  currentAccountPermissions: TPermission[]
}

const ViewAdminMembersContentTop = ({ searchQuery, setSearchQuery, setEditAccount, currentAccountPermissions }: Props) => {
  return (
    <div className={styles.root}>
      <SearchTable searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      { hasAccountPermission(currentAccountPermissions, ['admin']) &&
        <button className={ styles.button } onClick={ () => setEditAccount(create()) }>
          Add Member
        </button>
      }
    </div>
  )
}

const ViewAdminMembersContentTopConnected = connect(
  (state: IState, ownProps: Pick<Props, 'searchQuery' | 'setSearchQuery' | 'setEditAccount'>): Props => ({
    searchQuery: ownProps.searchQuery,
    setSearchQuery: ownProps.setSearchQuery,
    setEditAccount: ownProps.setEditAccount,
    currentAccountPermissions: accessSelector(state.app),
  })
)(ViewAdminMembersContentTop)

export { ViewAdminMembersContentTopConnected as ViewAdminMembersContentTop }
