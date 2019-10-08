import React, { useEffect, useState } from 'react'
import { Modal } from 'src/components/shared/ui/Modal'
import { NewChatBoxForm } from './newChatBox/Form'
import { accountService } from 'src/services/AccountService'
import { TAccount } from 'src/models/Account'

interface Props {
  show: boolean
  onClose: () => void
  participantIds?: number[]
}

export const NewChatBox = ({ show, onClose, participantIds }: Props) => {
  const [accounts, setAccounts] = useState<TAccount[]>([])

  useEffect(() => {
    const fetch = async (ids: number[]) => {
      const accounts = await accountService.fetchByIds(ids)
      setAccounts(accounts)
    }
    if (show && (participantIds && participantIds.length)) {
      fetch(participantIds).catch(window.logger.error)
    }
  }, [show, participantIds])

  return (
    <Modal show={show} onClose={onClose} width={'450px'}>
      <NewChatBoxForm close={onClose} participants={accounts} />
    </Modal>
  )
}
