import React from 'react'
import { TAdminModel as TAdminRole } from 'src/models/admin/Role'
import { TableStyled } from 'src/components/shared/ui/TableStyled'
import { TColumn } from 'src/components/shared/Table'
import { IState } from 'src/store'
import { connect } from 'react-redux'
import { NothingFound } from 'src/components/shared/ui/NothingFound'
import { PencilIcon } from 'src/components/shared/ui/Icons'
import { hasAccountPermission } from 'src/helpers/AccountHelper'
import { TAccount } from 'src/models/Account'
import { accessSelector } from 'src/services/selectors/AccountSelectors'
import { Loader } from 'src/components/shared/ui/Loader'
import { TableCellManager } from 'src/components/views/viewAdmin/groups/table/CellManager'
import { Pagination } from 'src/components/shared/ui/Pagination'
import { hasDiff, includesSubString } from 'src/helpers/CommonHelper'
import styles from './Table.module.scss'

interface Props {
  search: string
  items: TAdminRole[]
  currentUser: TAccount
  isLoading: boolean
  currentAccountPermissions: TPermission[]
  setEditRole: (item: TAdminRole) => void
}

interface State {
  page: number
}

const ROW_PER_PAGE = 10

class ViewAdminGroupsTable extends React.PureComponent<Props> {
  public state: State = {
    page: 1,
  }

  public componentDidUpdate(prevProps: Readonly<Props>): void {
    if (hasDiff(prevProps, this.props, ['search'])) {
      this.setState({ page: 1 })
    }
  }

  public render() {
    const { isLoading, items } = this.props
    const { page } = this.state
    const columns = this.getColumns()
    const filteredItems = this.filterItems(items)
    const pageItems = this.getPageItems(filteredItems, page)

    if (isLoading) {
      return (
        <div className={styles.root}>
          <Loader />
        </div>
      )
    }

    return (
      <div className={styles.root}>
        {filteredItems.length === 0 ? (
          <NothingFound />
        ) : (
          <>
            <TableStyled items={pageItems} columns={columns} />
            <Pagination total={filteredItems.length} page={page} size={ROW_PER_PAGE} onChange={this.onChangePage} />
          </>
        )}
      </div>
    )
  }

  private getColumns = (): TColumn[] => {
    const { currentUser, currentAccountPermissions, setEditRole } = this.props

    return [
      {
        label: 'Name',
        code: 'name',
        renderCell: (item: TAdminRole) => item.name,
      },
      {
        label: 'Manager',
        code: 'manager',
        renderCell: (item: TAdminRole) => (
          <TableCellManager item={item} />
        ),
      },
      {
        label: 'Members',
        code: 'members',
        renderCell: (item: TAdminRole) => item.totalMembers,
      },
      {
        label: 'Numbers',
        code: 'numbers',
        renderCell: (item: TAdminRole) => item.totalNumbers,
      },
      {
        label: 'Options',
        code: 'options',
        renderCell: (item: TAdminRole) => (
          <div className={styles.actions}>
            {this.canEdit(currentUser, currentAccountPermissions, item) && (
              <PencilIcon className={styles.actionPencil} width={10} onClick={() => setEditRole(item)} />
            )}
          </div>
        ),
      },
    ]
  }

  private canEdit = (currentUser: TAccount, currentAccountPermissions: TPermission[], group: TAdminRole) => {
    const isAdmin = hasAccountPermission(currentAccountPermissions, ['admin'])
    const isGroupManager = group.manager && group.manager.id === currentUser.id
    return isAdmin || isGroupManager
  }

  private onChangePage = (page: number) => this.setState({ page })

  private filterItems = (items: TAdminRole[]): TAdminRole[] => {
    return items.filter(i => includesSubString(i.name, this.props.search))
  }

  private getPageItems = (items: TAdminRole[], page: number): TAdminRole[] => {
    const start = (page - 1) * ROW_PER_PAGE
    const end = start + ROW_PER_PAGE
    return items.slice(start, end)
  }
}

const mapStateToProps = (state: IState, ownProps: Pick<Props, 'search' | 'setEditRole'>): Props => {
  return {
    search: ownProps.search,
    setEditRole: ownProps.setEditRole,
    isLoading: state.app.admin.roles.loading,
    currentUser: state.app.current.account,
    items: state.app.admin.roles.list,
    currentAccountPermissions: accessSelector(state.app),
  }
}

const ViewAdminGroupsTableConnected = connect(mapStateToProps)(ViewAdminGroupsTable)
export { ViewAdminGroupsTableConnected as ViewAdminGroupsTable }
