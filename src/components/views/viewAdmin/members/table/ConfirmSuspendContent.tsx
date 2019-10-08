import React from 'react'
import { connect } from 'react-redux'
import { IState } from 'src/store'
import { TAccount } from 'src/models/Account'
import { TAdminModel as TAdminRole } from 'src/models/admin/Role'

interface Props {
  account: TAccount
  roles: TAdminRole[]
}

const TableConfirmSuspendContent = ({ account, roles }: Props) => {
  const role = account.isManagerOfGroupId && roles.find(i => i.id === account.isManagerOfGroupId)

  return (
    <>
      <div>
        User {account.profile.displayName} will not be able to sign in when suspended.
      </div>
      {!!role && (
        <div>
          <br />
          {account.profile.displayName} is a manager of group "{role.name}".
          <br />
          If you suspend this user, you will have to assign another manager to group "{role.name}".
        </div>
      )}
    </>
  )
}

const mapStateToProps = (state: IState, ownProps: Pick<Props, 'account'>): Props => ({
  account: ownProps.account,
  roles: state.app.admin.roles.list,
})

const Connected = connect(mapStateToProps)(TableConfirmSuspendContent)
export { Connected as TableConfirmSuspendContent }
