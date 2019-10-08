import React, { ChangeEvent, useEffect, useState } from 'react'
import { TAccount, TStatus } from 'src/models/Account'
import { Avatar } from 'src/components/shared/ui/Avatar'
import { TableStyled } from 'src/components/shared/ui/TableStyled'
import { TColumn, TSortColumn } from 'src/components/shared/Table'
import { IState } from 'src/store'
import { connect } from 'react-redux'
import { sortByEmail, sortByLastLogin, sortByName, sortByStatus } from 'src/helpers/AccountHelper'
import { contactAccountListSelector } from 'src/services/selectors/AccountSelectors'
import { mem } from 'src/utils/mem'
import { dateFormat } from 'src/helpers/DateHelper'
import { SortControl } from 'src/components/shared/ui/SortControl'
import classNames from 'classnames'
import { ViewContactsContentTableCheckbox } from 'src/components/views/viewContacts/content/table/Checkbox'
import { chatService } from 'src/services/ChatService'
import { SpeechBubblesIcon } from 'src/components/shared/ui/Icons'
import ReactTooltip from 'react-tooltip'
import { Pagination } from 'src/components/shared/ui/Pagination'
import { useRouter } from 'src/hooks/useRouter'
import { Loader } from 'src/components/shared/ui/Loader'
import { NothingFound } from 'src/components/shared/ui/NothingFound'
import styles from './Table.module.scss'

type TCreateChatFunction = (accountsId: number[], name: string) => Promise<{ chatId: number; status: string } | null>

interface Props {
  selected: number[]
  items: TAccount[]
  currentAccount: TAccount
  isLoading: boolean
  handleRowSelection: (value: number, action: 'add' | 'remove') => void
  createChat: TCreateChatFunction
}

const renderSort = (label: React.ReactNode, code: string, onSort: (code: string, dir?: 'asc' | 'desc') => void, dir?: 'asc' | 'desc') => {
  const props = {
    label,
    code,
    onSort,
    dir,
  }
  return <SortControl {...props} onSort={onSort} />
}

const getColumns = (
  handleValue: (e: ChangeEvent<HTMLInputElement>) => void,
  selected: number[],
  handleDirectMessage: (item: TAccount) => void
): TColumn[] => {
  return [
    {
      label: '',
      code: '',
      renderCell: (item: TAccount) => (
        <ViewContactsContentTableCheckbox id={item.id.toString()} onChange={handleValue} isChecked={selected.includes(item.id)} />
      ),
    },
    {
      label: 'Name',
      code: 'name',
      renderCell: (item: TAccount) => (
        <div className={styles.avatar}>
          <Avatar account={item} type={'list'} />
          {item.profile.displayName}
        </div>
      ),
      renderSort: (label, code, onSort, dir) => renderSort(label, code, onSort, dir),
    },
    {
      label: 'ID',
      code: 'id',
      renderCell: (item: TAccount) => item.profile.email,
      renderSort: (label, code, onSort, dir) => renderSort(label, code, onSort, dir),
    },
    {
      label: 'Mobile',
      code: 'mobile',
      renderCell: (item: TAccount) => item.profile.mobile,
    },
    {
      label: 'Group',
      code: 'group',
      renderCell: (item: TAccount) => item.group.name,
    },
    {
      label: 'Last login',
      code: 'lastLogin',
      renderCell: (item: TAccount) => dateFormat(item.lastLogin, 'MM/DD/YYYY'),
      renderSort: (label, code, onSort, dir) => renderSort(label, code, onSort, dir),
    },
    {
      label: 'Options',
      code: 'options',
      renderCell: (item: TAccount) => (
        <div className={styles.actions}>
          <div data-tip={'Direct chat'} data-for="tooltip">
            <SpeechBubblesIcon width={20} className={styles.actionDirectMessage} onClick={() => handleDirectMessage(item)} />
          </div>
          <ReactTooltip id="tooltip" effect="solid" place={'left'} className={'Tooltip'} />
        </div>
      ),
    },
  ]
}

const renderRow = (item: TAccount, columns: TColumn[]) => {
  return (
    <tr key={item.id} className={classNames({ [styles.inactive]: item.profile.status === ('pending' as TStatus) })}>
      {columns.map((column, i) => (
        <td key={`${i}:${column.label}`} className={styles.td}>
          {column.renderCell && column.renderCell(item)}
        </td>
      ))}
    </tr>
  )
}

const ROW_PER_PAGE = 10

const ViewContactsContentTable = mem((props: Props) => {
  const {
    selected,
    items,
    isLoading,
    handleRowSelection,
    createChat,
    currentAccount,
  } = props
  const [page, setPage] = useState<number>(1)
  const [sort, setSort] = useState<TSortColumn>({ name: 'name', dir: 'asc' })
  const [accounts, setAccounts] = useState<TAccount[]>([])
  const router = useRouter()

  useEffect(() => {
    const sorting = () => {
      if (sort) {
        if (sort.name === 'name') {
          setAccounts(sortByName(items, sort.dir))
        }

        if (sort.name === 'id') {
          setAccounts(sortByEmail(items, sort.dir))
        }

        if (sort.name === 'lastLogin') {
          setAccounts(sortByLastLogin(items, sort.dir))
        }

        if (sort.name === 'status') {
          setAccounts(sortByStatus(items, sort.dir))
        }
      } else {
        setAccounts(items)
      }
    }
    sorting()
  }, [sort, items])

  const onSort = (name: string, dir?: 'asc' | 'desc') => {
    setSort({ name, dir })
  }

  const rowSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const { checked, value } = e.target
    if (checked) {
      handleRowSelection(parseInt(value), 'add')
    } else {
      handleRowSelection(parseInt(value), 'remove')
    }
  }

  const handleDirectMessage = async (item: TAccount) => {
    const result = await createChat([item.id], `${item.profile.displayName} - ${currentAccount.profile.displayName}`)
    if (result) {
      router.history.push(`/chat/${result.chatId}`)
    }
  }

  const accountsOnPage = () => {
    const start = (page - 1) * ROW_PER_PAGE
    const end = start + ROW_PER_PAGE
    return accounts.slice(start, end)
  }

  if (!isLoading && !accounts.length) {
    return <NothingFound />
  }

  return (
    <div className={styles.root}>
      {isLoading ? (
        <Loader />
      ) : (
        <>
        <TableStyled
          items={accountsOnPage()}
          columns={getColumns(rowSelect, selected, handleDirectMessage)}
          onSort={onSort}
          sort={sort}
          renderRow={renderRow}
        />
        <Pagination total={accounts.length} page={page} size={ROW_PER_PAGE} onChange={(page: number) => setPage(page)} />
        </>
        )}
    </div>
  )
})

const mapStateToProps = (state: IState, ownProps: Pick<Props, 'handleRowSelection' | 'selected'>): Props => {
  return {
    ...ownProps,
    isLoading: state.app.accounts.searchLoading,
    items: contactAccountListSelector(state.app),
    createChat: chatService.createChatWithAccounts,
    currentAccount: state.app.current.account,
  }
}

const Connected = connect(mapStateToProps)(ViewContactsContentTable)
export { Connected as ViewContactsContentTable }
