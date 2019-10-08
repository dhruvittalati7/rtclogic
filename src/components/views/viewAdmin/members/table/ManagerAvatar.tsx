import React from 'react'
import { connect } from 'react-redux'
import { IState } from 'src/store'
import { TAccount } from 'src/models/Account'
import { Avatar } from 'src/components/shared/ui/Avatar'

interface Props {
  manager: TAccount
  accounts: TAccount[]
}

const TableManagerAvatar = ({ manager, accounts }: Props) => {
  const item = React.useMemo(() => {
    const account = accounts.find(i => i.id === manager.id)
    return { ...manager, status: account ? account.status : '' }
  }, [manager, accounts])

  return (
    <Avatar account={item} type={'list'} />
  )
}

const mapStateToProps = (state: IState, ownProps: Pick<Props, 'manager'>): Props => ({
  manager: ownProps.manager,
  accounts: state.app.accounts.list,
})

const Connected = connect(mapStateToProps)(TableManagerAvatar)

export { Connected as TableManagerAvatar }
