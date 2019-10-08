import React from 'react'
import classNames from 'classnames'
import { TAccount } from 'src/models/Account'
import { CloseIcon, PencilIcon } from 'src/components/shared/ui/Icons'
import { TableStyled } from 'src/components/shared/ui/TableStyled'
import { TColumn, TSortColumn } from 'src/components/shared/Table'
import { IState } from 'src/store'
import { connect } from 'react-redux'
import { hasAccountPermission, sortByEmail, sortByLastLogin, sortByName, sortByStatus } from 'src/helpers/AccountHelper'
import { accessSelector } from 'src/services/selectors/AccountSelectors'
import { dateFormat } from 'src/helpers/DateHelper'
import { SortControl } from 'src/components/shared/ui/SortControl'
import { currentMemberSelector } from 'src/services/admin/selectors/MemberSelectors'
import { Pagination } from 'src/components/shared/ui/Pagination'
import { layoutService } from 'src/services/LayoutService'
import { adminMemberService } from 'src/services/admin/MemberService'
import { TableConfirmSuspendContent } from './table/ConfirmSuspendContent'
import { Loader } from 'src/components/shared/ui/Loader'
import styles from './Table.module.scss'
import { hasDiff, includesSubString } from 'src/helpers/CommonHelper'
import { TableManagerAvatar } from 'src/components/views/viewAdmin/members/table/ManagerAvatar'

interface Props {
  search: string
  items: TAccount[]
  isLoading: boolean
  setEditAccount: (account: TAccount) => void
  currentMember?: TAccount
  currentAccountPermissions: TPermission[]
}

interface State {
  page: number
  sort: TSortColumn
}

const ROW_PER_PAGE = 10

class ViewAdminMembersTable extends React.PureComponent<Props, State> {
  public state: State = {
    page: 1,
    sort: { name: 'name', dir: 'asc' },
  }

  public componentDidUpdate(prevProps: Readonly<Props>): void {
    if (hasDiff(prevProps, this.props, ['search'])) {
      this.setState({ page: 1 })
    }
  }

  public render() {
    const { isLoading, items } = this.props
    const { page, sort } = this.state
    const columns = this.getColumns()
    const filteredItems = this.filterItems(items)
    const sortedItems = this.sortItems(filteredItems)
    const pageItems = this.getPageItems(sortedItems, page)

    return (
      <div className={styles.root}>
        {isLoading ? (
          <Loader />
        ) : (
          <>
            <TableStyled
              columns={columns}
              items={pageItems}
              onSort={this.onSort}
              sort={sort}
              renderRow={this.renderRow}
            />
            <Pagination total={filteredItems.length} page={page} size={ROW_PER_PAGE} onChange={this.onChangePage} />
          </>
        )}
      </div>
    )
  }

  private onChangePage = (page: number) => this.setState({ page })

  private onSort = (name: string, dir?: 'asc' | 'desc') => this.setState({ sort: { name, dir } })

  private getColumns = (): TColumn[] => {
    const { currentMember, currentAccountPermissions, setEditAccount } = this.props

    return [
      {
        label: 'Name',
        code: 'name',
        renderCell: (item: TAccount) => (
          <div className={styles.avatar}>
            <TableManagerAvatar manager={item} />
            <Text item={item}>{item.profile.displayName}</Text>
          </div>
        ),
        renderSort: (label, code, onSort, dir) => this.renderSort(label, code, onSort, dir),
      },
      {
        label: 'ID',
        code: 'id',
        renderCell: (item: TAccount) => <Text item={item}>{item.profile.email}</Text>,
        renderSort: (label, code, onSort, dir) => this.renderSort(label, code, onSort, dir),
      },
      {
        label: 'Last login',
        code: 'lastLogin',
        renderCell: (item: TAccount) => <Text item={item}>{dateFormat(item.lastLogin, 'MM/DD/YYYY')}</Text>,
        renderSort: (label, code, onSort, dir) => this.renderSort(label, code, onSort, dir),
      },
      {
        label: 'Status',
        code: 'status',
        renderCell: (item: TAccount) => <Text item={item}>{item.profile.status}</Text>,
        renderSort: (label, code, onSort, dir) => this.renderSort(label, code, onSort, dir),
      },
      {
        label: 'Group',
        code: 'group',
        renderCell: (item: TAccount) => <Text item={item}>{item.group.name}</Text>,
      },
      {
        label: 'Options',
        code: 'options',
        renderCell: (item: TAccount) => (
          <div className={styles.actions}>
            {this.canSuspend(item, currentAccountPermissions, currentMember) && (
              <>
                <PencilIcon className={styles.actionPencil} width={10} onClick={() => setEditAccount(item)} />
                <CloseIcon
                  className={styles.actionRemove}
                  width={7}
                  onClick={() => layoutService.confirm(
                    'Suspend User',
                    <TableConfirmSuspendContent account={item} />,
                    'Suspend',
                    () => adminMemberService.suspend(item)
                  )}
                />
              </>
            )}
          </div>
        ),
      },
    ]
  }

  private filterItems = (items: TAccount[]): TAccount[] => {
    return items.filter(i => includesSubString(i.profile.displayName, this.props.search))
  }

  private sortItems = (items: TAccount[]): TAccount[] => {
    const { sort } = this.state

    switch (sort.name) {
      case 'id': return sortByEmail(items, sort.dir)
      case 'name': return sortByName(items, sort.dir)
      case 'lastLogin': return sortByLastLogin(items, sort.dir)
      case 'status': return sortByStatus(items, sort.dir)
      default: return items
    }
  }

  private getPageItems = (items: TAccount[], page: number): TAccount[] => {
    const start = (page - 1) * ROW_PER_PAGE
    const end = start + ROW_PER_PAGE
    return items.slice(start, end)
  }

  private canSuspend = (member: TAccount, currentMemberPermissions: TPermission[], currentMember?: TAccount): boolean => {
    if (member.profile.status === 'suspended') {
      return false
    }

    if (currentMember && currentMember.id === member.id) {
      return false
    }

    if (hasAccountPermission(currentMemberPermissions, ['admin'])) {
      return true
    }

    if (currentMember && currentMember.isManagerOfGroupId && member.group.id === currentMember.isManagerOfGroupId) {
      return true
    }

    return false
  }

  private renderSort = (label: React.ReactNode, code: string, onSort: (code: string, dir?: 'asc' | 'desc') => void, dir?: 'asc' | 'desc') => {
    const props = {
      label,
      code,
      onSort,
      dir,
    }
    return <SortControl {...props} onSort={onSort} />
  }

  private renderRow = (item: TAccount, columns: TColumn[]) => {
    return (
      <tr key={item.id} className={classNames({ [styles.inactive]: item.profile.status === 'pending' })}>
        {columns.map((column, i) => (
          <td key={`${i}:${column.label}`} className={styles.td}>
            {column.renderCell && column.renderCell(item)}
          </td>
        ))}
      </tr>
    )
  }
}

const mapStateToProps = (state: IState, ownProps: Pick<Props, 'search' | 'setEditAccount'>): Props => {
  return {
    search: ownProps.search,
    setEditAccount: ownProps.setEditAccount,
    isLoading: state.app.admin.members.loading,
    items: state.app.admin.members.list,
    currentMember: currentMemberSelector(state.app),
    currentAccountPermissions: accessSelector(state.app),
  }
}

const ViewAdminMembersTableConnected = connect(mapStateToProps)(ViewAdminMembersTable)
export { ViewAdminMembersTableConnected as ViewAdminMembersTable }

interface TextProps {
  item: TAccount
  children: React.ReactNode
}
const Text = ({ item, children }: TextProps) => (
  <span className={classNames(item.profile.status === 'pending' && styles.pending)}>{children}</span>
)
