import React from 'react'
import { Modal } from 'src/components/shared/ui/Modal'
import { GroupsBoxForm } from './box/Form'
import { TAdminModel as TAdminRole } from 'src/models/admin/Role'

interface Props {
  onClose: () => void
  role?: TAdminRole
}

export const ViewAdminGroupsBox = ({ onClose, role }: Props) =>
  role ? (
    <Modal show={!!role} onClose={onClose} width={'450px'}>
      <GroupsBoxForm onSuccess={onClose} role={role} />
    </Modal>
  ) : null
