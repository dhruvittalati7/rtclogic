import React from 'react'
import { Modal } from 'src/components/shared/ui/Modal'
import { NewMemberBoxForm } from './box/Form'
import { TAccount } from 'src/models/Account'

interface Props {
  onClose: () => void
  account?: TAccount
}

export const ViewAdminMembersBox = ({ onClose, account }: Props) =>
    <Modal show={!!account} onClose={onClose} width={'450px'}>
      {account && <NewMemberBoxForm onSuccess={onClose} account={account} /> }
    </Modal>
