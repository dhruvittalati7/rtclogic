import React, { useState } from 'react'
import { TAdminModel as TAdminRole } from 'src/models/admin/Role'
import { ViewAdminGroupsBox } from 'src/components/views/viewAdmin/groups/Box'
import { ViewAdminGroupsTable } from 'src/components/views/viewAdmin/groups/Table'
import { ViewAdminGroupsSearch } from 'src/components/views/viewAdmin/groups/Search'

export const ViewAdminGroupContent = () => {
  const [role, setEditRole] = useState<TAdminRole>()
  const [search, setSearch] = useState('')

  return (
    <>
      <ViewAdminGroupsSearch
        searchQuery={search}
        setSearchQuery={setSearch}
        setEditRole={setEditRole}
      />
      <ViewAdminGroupsTable search={search} setEditRole={setEditRole} />
      <Box role={role} setEditRole={setEditRole} />
    </>
  )
}

interface IBoxProps {
  role?: TAdminRole,
  setEditRole: (role: TAdminRole | undefined) => void
}

const Box = ({ role, setEditRole }: IBoxProps) => {
  return (
    <ViewAdminGroupsBox
      role={role}
      onClose={() => {
        setEditRole(undefined)
      }}
    />
  )
}
