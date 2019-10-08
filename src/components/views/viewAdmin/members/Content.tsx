import React, { useState } from 'react'
import { ViewAdminMembersContentTop } from 'src/components/views/viewAdmin/members/ContentTop'
import { ViewAdminMembersTable } from 'src/components/views/viewAdmin/members/Table'
import { TAccount } from 'src/models/Account'
import { ViewAdminMembersBox } from 'src/components/views/viewAdmin/members/Box'

export const ViewAdminMembersContent = () => {
  const [editAccount, setEditAccount] = useState<TAccount>()
  const [search, setSearch] = useState('')

  return (
    <>
      <ViewAdminMembersContentTop
        searchQuery={search}
        setSearchQuery={setSearch}
        setEditAccount={setEditAccount}
      />
      <ViewAdminMembersTable search={search} setEditAccount={setEditAccount} />
      <Box account={editAccount} setEditAccount={setEditAccount} />
    </>
  )
}

interface IBoxProps {
  account?: TAccount,
  setEditAccount: (account: TAccount | undefined) => void
}

const Box = ({ account, setEditAccount }: IBoxProps) => {
  return (
    <ViewAdminMembersBox
      account={account}
      onClose={() => {
        setEditAccount(undefined)
      }}
    />
  )
}
