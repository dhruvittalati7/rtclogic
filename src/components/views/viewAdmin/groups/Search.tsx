import React from 'react'
import styles from './Search.module.scss'
import { connect } from 'react-redux'
import { IState } from 'src/store/state'
import { create, TAdminModel as TAdminRole } from 'src/models/admin/Role'
import { SearchTable } from 'src/components/shared/ui/SearchTable'
import { accessSelector } from 'src/services/selectors/AccountSelectors'
import { hasAccountPermission } from 'src/helpers/AccountHelper'

interface Props {
  searchQuery: string
  setSearchQuery: (query: string) => void
  setEditRole: (item: TAdminRole) => void
  currentAccountPermissions: TPermission[]
}

const ViewAdminGroupsSearch = ({ searchQuery, setSearchQuery, setEditRole, currentAccountPermissions }: Props) => {
  return (
    <div className={styles.root}>
      <SearchTable searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      {hasAccountPermission(currentAccountPermissions, ['admin']) && (
        <button className={styles.button} onClick={() => setEditRole(create())}>
          Add Group
        </button>
      )}
    </div>
  )
}

const ViewAdminGroupsSearchConnected = connect(
  (state: IState, ownProps: Pick<Props, 'searchQuery' | 'setSearchQuery' | 'setEditRole'>): Props => ({
    searchQuery: ownProps.searchQuery,
    setSearchQuery: ownProps.setSearchQuery,
    setEditRole: ownProps.setEditRole,
    currentAccountPermissions: accessSelector(state.app),
  })
)(ViewAdminGroupsSearch)

export { ViewAdminGroupsSearchConnected as ViewAdminGroupsSearch }
