import React from 'react'
import { toArray as toCapabilitiesArray } from 'src/models/dids/Capabilities'
import { TAdminModel as TAdminNumber } from 'src/models/admin/Number'
import { TableStyled } from 'src/components/shared/ui/TableStyled'
import { TColumn } from 'src/components/shared/Table'
import { IState } from 'src/store'
import { connect } from 'react-redux'
import { adminNumberService, Type } from 'src/services/admin/NumberService'
import { formatPhoneNumber } from 'src/helpers/PhoneHelper'
import { countryHelper } from 'src/helpers/CountryHelper'
import { Pagination } from 'src/components/shared/ui/Pagination'
import { NothingFound } from 'src/components/shared/ui/NothingFound'
import { TableStatus } from 'src/components/views/viewAdmin/numbers/table/Status'
import { Loader } from 'src/components/shared/ui/Loader'
import { hasDiff } from 'src/helpers/CommonHelper'
import styles from './Table.module.scss'

const ROW_PER_PAGE = 10

interface Props {
  type: number
  items: TAdminNumber[]
  total: number
  isLoading: boolean
}

interface State {
  page: number
}

class ViewAdminNumbersTable extends React.PureComponent<Props, State> {
  public state: State = {
    page: 1,
  }

  public componentDidMount() {
    this.load(this.props.type, this.state.page)
  }

  public componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>) {
    if (hasDiff(prevProps, this.props, ['type'])) {
      this.setState({ page: 1 })
      this.load(this.props.type, 1)
    }

    if (hasDiff(prevState, this.state, ['page'])) {
      this.load(this.props.type, this.state.page)
    }
  }

  public render() {
    const { isLoading, items, total } = this.props
    const { page } = this.state
    const columns = this.getColumns()

    if (isLoading) {
      return (
        <div className={styles.root}>
          <Loader />
        </div>
      )
    }

    return (
      <div className={styles.root}>
        {items.length === 0 ? (
          <NothingFound />
        ) : (
          <>
            <TableStyled items={items} columns={columns} />
            <Pagination total={total} page={page} size={ROW_PER_PAGE} onChange={this.onChangePage} />
          </>
        )}
      </div>
    )
  }

  private load = (type: Type, page: number) => {
    adminNumberService.loadNumbers({ type, page, size: ROW_PER_PAGE }).catch(window.logger.error)
  }

  private onChangePage = (page: number) => this.setState({ page })

  private getColumns = (): TColumn[] => {
    return [
      {
        label: 'Number',
        code: 'number',
        renderCell: (item: TAdminNumber) => formatPhoneNumber(item.number),
      },
      {
        label: 'Provider',
        code: 'provider',
        renderCell: (item: TAdminNumber) => item.provider,
      },
      {
        label: 'Country',
        code: 'country',
        renderCell: (item: TAdminNumber) => {
          if (item.countryCode !== '*') {
            const country = countryHelper.getCountryByCode(item.countryCode)
            return (
              <div className={styles.country}>
                <div className={styles.flag}>{countryHelper.getFlagByCode(item.countryCode)}</div>
                {country ? country.name : ''}
              </div>
            )
          }
          return item.countryCode
        },
      },
      {
        label: 'Number Type',
        code: 'numberType',
        renderCell: (item: TAdminNumber) => toCapabilitiesArray(item.capabilities).join(' / '),
      },
      {
        label: 'Status',
        code: 'status',
        renderCell: (item: TAdminNumber) => <TableStatus item={item} />,
      },
      {
        label: '',
        code: '',
      },
    ]
  }
}

const mapStateToProps = (state: IState, ownProps: Pick<Props, 'type'>): Props => {
  return {
    type: ownProps.type,
    isLoading: state.app.admin.numbers.loading,
    items: state.app.admin.numbers.list.items,
    total: state.app.admin.numbers.list.total,
  }
}

const ViewAdminNumbersTableConnected = connect(mapStateToProps)(ViewAdminNumbersTable)
export { ViewAdminNumbersTableConnected as ViewAdminNumbersTable }
