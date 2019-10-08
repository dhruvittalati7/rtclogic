import React from 'react'
import { connect } from 'react-redux'
import { IState } from 'src/store'
import { Modal } from 'src/components/shared/ui/Modal'
import { TAccount, TStatus } from 'src/models/Account'
import { ViewSettingsSecurityContent } from 'src/components/views/viewSettings/security/Content'

interface Props {
  currentAccount: TAccount
}

const ChangePassword = ({ currentAccount }: Props) => {
  return (
    <Modal show={currentAccount.profile.status === 'pending' as TStatus} width={'345px'}>
      <ViewSettingsSecurityContent />
    </Modal>
  )
}

const mapStateToProps = (state: IState): Props => ({
  currentAccount: state.app.current.account,
})

const ChangePasswordConnected = connect(mapStateToProps)(ChangePassword)
export { ChangePasswordConnected as ChangePassword }
